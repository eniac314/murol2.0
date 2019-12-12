module Internals.CommonHelpers exposing
    ( Log
    , PickerResult(..)
    , Status(..)
    , UploadStatus(..)
    , break
    , chunks
    , combineStatus
    , dateToFrench
    , dateToStr
    , dateToW3c
    , decodeUploadStatus
    , hashLog
    , hdSrc
    , httpErrorToString
    , jsonResolver
    , logTitleView
    , logsDictView
    , logsView
    , newLog
    , outsideTargetHandler
    , parseDate
    , safeInsert
    , thumbSrc
    , timeToStr
    )

import Derberos.Date.Core exposing (addTimezoneMilliseconds, civilToPosix, newDateRecord, posixToCivil)
import Derberos.Date.Utils exposing (monthToNumber1, numberOfDaysInMonth, numberToMonth)
import Dict exposing (Dict, insert, member)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Lazy as Lazy
import Element.Region as Region
import Http exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Json.Decode as D
import Murmur3 exposing (hashString)
import Random exposing (Seed, int, step)
import String.Extra exposing (insertAt)
import Task exposing (perform)
import Time exposing (Month(..), Posix, Weekday(..), Zone, now, posixToMillis)
import UUID exposing (..)


type Status
    = Initial
    | Waiting
    | Success
    | Failure


type UploadStatus
    = UploadSuccessful
    | UploadFailure String


decodeUploadStatus : D.Decoder UploadStatus
decodeUploadStatus =
    D.oneOf
        [ D.field "serverError" D.string
            |> D.map UploadFailure
        , D.field "message" D.string
            |> D.map (always UploadSuccessful)
        ]


type PickerResult
    = PickedImage { url : String, width : Int, height : Int }
    | PickedDoc String


chunks : Int -> List a -> List (List a)
chunks n xs =
    let
        helper acc ys =
            case ys of
                [] ->
                    List.reverse acc

                _ ->
                    helper (List.take n ys :: acc) (List.drop n ys)
    in
    helper [] xs


break : (a -> Bool) -> List a -> ( List a, List a )
break p xs =
    let
        helper ys left =
            case ys of
                [] ->
                    ( left, [] )

                y :: ys_ ->
                    if p y then
                        ( List.reverse left, y :: ys_ )

                    else
                        helper ys_ (y :: left)
    in
    helper xs []



-------------------------------------------------------------------------------
------------
-- Logger --
------------


type alias Log =
    { message : String
    , mbDetails : Maybe String
    , isError : Bool
    , isImportant : Bool
    , timeStamp : Posix
    }


hashLog : Seed -> Log -> ( Int, Seed )
hashLog seed log =
    let
        ( hashSeed, newSeed ) =
            Random.step (Random.int 0 10000) seed

        hash =
            (log.message
                ++ (log.mbDetails
                        |> Maybe.withDefault ""
                   )
                ++ (if log.isError then
                        "isError"

                    else
                        "isNotError"
                   )
                ++ (if log.isImportant then
                        "isImportant"

                    else
                        "isNotImportant"
                   )
                ++ (posixToMillis log.timeStamp
                        |> String.fromInt
                   )
            )
                |> hashString hashSeed
    in
    ( hash, newSeed )


newLog : (Log -> msg) -> String -> Maybe String -> Bool -> Bool -> Cmd msg
newLog addLogMsg logMsg details isError isImportant =
    Task.perform addLogMsg <|
        (Time.now
            |> Task.andThen
                (\t ->
                    Task.succeed <|
                        Log logMsg
                            details
                            isError
                            isImportant
                            t
                )
        )


formatTime =
    String.fromInt
        >> String.padLeft 2 '0'


logTitleView l zone =
    row [ spacing 15 ]
        [ el [ Font.color (rgb 0.7 0.7 0.7) ]
            (text <|
                formatTime (Time.toHour zone l.timeStamp)
                    ++ ":"
                    ++ formatTime (Time.toMinute zone l.timeStamp)
            )
        , el
            [ if l.isError then
                Font.color (rgb 1 0 0)

              else
                noAttr
            ]
            (text l.message)
        ]


logsView : List Log -> Time.Zone -> Element msg
logsView logs zone =
    let
        logView ({ message, mbDetails, isError, timeStamp } as log) =
            column
                [ spacing 5
                , width (maximum 500 fill)
                ]
                [ logTitleView log zone
                , case mbDetails of
                    Nothing ->
                        Element.none

                    Just details ->
                        paragraph
                            [ paddingEach { sides | left = 20 }
                            , Font.size 12
                            ]
                            [ text details ]
                ]
    in
    column [ spacing 15 ]
        (List.map logView logs)


logsDictView : List ( Int, ( Log, Bool ) ) -> Time.Zone -> (Int -> msg) -> List (Element msg)
logsDictView logs zone toogleLog =
    let
        logView i ( k, ( { message, mbDetails, isError, timeStamp } as log, isOpen ) ) =
            column
                [ spacing 5
                , width fill
                , Events.onClick (toogleLog k)
                ]
                [ el
                    [ if modBy 2 i /= 0 then
                        Background.color (rgb 1 1 1)

                      else
                        Background.color grey7
                    , width fill
                    , paddingXY 10 7
                    ]
                    (logTitleView log zone)
                , case mbDetails of
                    Nothing ->
                        Element.none

                    Just details ->
                        if isOpen then
                            paragraph
                                [ paddingEach { sides | left = 20 }
                                , Font.size 12
                                ]
                                [ text details ]

                        else
                            Element.none
                ]
    in
    List.indexedMap logView logs



-------------------------------------------------------------------------------


httpErrorToString : Http.Error -> String
httpErrorToString e =
    case e of
        BadUrl s ->
            "Url invalide: " ++ s

        Timeout ->
            "Délai d'attente dépassé"

        NetworkError ->
            "Erreur de réseau"

        BadStatus statusCode ->
            "Erreur serveur: "
                ++ String.fromInt statusCode

        BadBody details ->
            "Erreur décodage: " ++ details


jsonResolver decoder =
    stringResolver <|
        \response ->
            case response of
                Http.BadUrl_ url ->
                    Err (Http.BadUrl url)

                Http.Timeout_ ->
                    Err Http.Timeout

                Http.NetworkError_ ->
                    Err Http.NetworkError

                Http.BadStatus_ metadata body ->
                    Err (Http.BadStatus metadata.statusCode)

                Http.GoodStatus_ metadata body ->
                    case D.decodeString decoder body of
                        Ok value ->
                            Ok value

                        Err err ->
                            Err (Http.BadBody (D.errorToString err))


parseDate : Posix -> Zone -> String -> Maybe ( Int, Int, Int )
parseDate currentTime zone s =
    case
        String.split "/" s
            |> List.filterMap String.toInt
    of
        day :: month :: year :: [] ->
            let
                choosenTime =
                    newDateRecord year month day 0 0 0 0 Time.utc
                        |> civilToPosix
            in
            if posixToMillis currentTime > posixToMillis choosenTime then
                Nothing

            else
                Just ( day, month, year )

        _ ->
            Nothing


timeToStr : Time.Zone -> Time.Posix -> String
timeToStr zone t =
    let
        dateRec =
            posixToCivil (addTimezoneMilliseconds zone t)
    in
    (String.fromInt dateRec.day
        |> String.padLeft 2 '0'
    )
        ++ "-"
        ++ (String.fromInt dateRec.month
                |> String.padLeft 2 '0'
           )
        ++ "-"
        ++ String.fromInt dateRec.year
        ++ " "
        ++ (String.fromInt dateRec.hour
                |> String.padLeft 2 '0'
           )
        ++ "H"
        ++ (String.fromInt dateRec.minute
                |> String.padLeft 2 '0'
           )


dateToStr : Time.Zone -> Time.Posix -> String
dateToStr zone d =
    let
        dateRec =
            posixToCivil (addTimezoneMilliseconds zone d)
    in
    (String.fromInt dateRec.day
        |> String.padLeft 2 '0'
    )
        ++ "/"
        ++ (String.fromInt dateRec.month
                |> String.padLeft 2 '0'
           )
        ++ "/"
        ++ String.fromInt dateRec.year


dateToW3c : Time.Posix -> String
dateToW3c d =
    let
        dateRec =
            posixToCivil (addTimezoneMilliseconds Time.utc d)
    in
    String.fromInt dateRec.year
        ++ "-"
        ++ (String.fromInt dateRec.month
                |> String.padLeft 2 '0'
           )
        ++ "-"
        ++ (String.fromInt dateRec.day
                |> String.padLeft 2 '0'
           )
        ++ "T"
        ++ (String.fromInt dateRec.hour
                |> String.padLeft 2 '0'
           )
        ++ ":"
        ++ (String.fromInt dateRec.minute
                |> String.padLeft 2 '0'
           )
        ++ ":"
        ++ (String.fromInt dateRec.second
                |> String.padLeft 2 '0'
           )
        ++ "Z"


dateToFrench : Time.Zone -> Time.Posix -> String
dateToFrench zone t =
    let
        currentYear =
            Time.toYear zone t
                |> String.fromInt

        currentMonth =
            case Time.toMonth zone t of
                Jan ->
                    "janvier"

                Feb ->
                    "février"

                Mar ->
                    "mars"

                Apr ->
                    "avril"

                May ->
                    "mai"

                Jun ->
                    "juin"

                Jul ->
                    "juillet"

                Aug ->
                    "août"

                Sep ->
                    "septembre"

                Oct ->
                    "octobre"

                Nov ->
                    "novembre"

                Dec ->
                    "décembre"

        currentDay =
            Time.toDay zone t
                |> String.fromInt

        currentWeekday =
            case Time.toWeekday zone t of
                Mon ->
                    "lundi"

                Tue ->
                    "mardi"

                Wed ->
                    "mercredi"

                Thu ->
                    "jeudi"

                Fri ->
                    "vendredi"

                Sat ->
                    "samedi"

                Sun ->
                    "dimanche"
    in
    currentWeekday ++ " " ++ currentDay ++ " " ++ currentMonth ++ " " ++ currentYear


thumbSrc : String -> String
thumbSrc s =
    case List.reverse <| String.indexes "/" s of
        [] ->
            s

        n :: _ ->
            String.Extra.insertAt "/thumbs" n s


hdSrc : String -> String
hdSrc s =
    case List.reverse <| String.indexes "/" s of
        [] ->
            s

        n :: _ ->
            String.Extra.insertAt "/HQ" n s



-------------------------------------------------------------------------------
---------------------------
-- Outside click decoder --
---------------------------


outsideTargetHandler : String -> msg -> D.Decoder msg
outsideTargetHandler targetId handler =
    D.field "target" (isOutsideTarget targetId)
        |> D.andThen
            (\isOutside ->
                if isOutside then
                    D.succeed handler

                else
                    D.fail "inside target"
            )


isOutsideTarget targetId =
    D.oneOf
        [ D.field "id" D.string
            |> D.andThen
                (\id ->
                    if targetId == id then
                        -- found match by id
                        D.succeed False

                    else
                        -- try next decoder
                        D.fail "continue"
                )
        , D.lazy (\_ -> D.field "parentNode" (isOutsideTarget targetId))

        -- fallback if all previous decoders failed
        , D.succeed True
        ]



-------------------------------------------------------------------------------


safeInsert :
    (comparable -> comparable)
    -> comparable
    -> b
    -> Dict comparable b
    -> Dict comparable b
safeInsert f k v d =
    if Dict.member k d then
        safeInsert f (f k) v d

    else
        Dict.insert k v d


combineStatus : List Status -> Status
combineStatus xs =
    if List.member Failure xs then
        Failure

    else if List.member Waiting xs then
        Waiting

    else
        Success



-------------------------------------------------------------------------------
