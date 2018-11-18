module Internals.CommonHelpers exposing (..)

import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Lazy as Lazy
import Element.Region as Region
import Http exposing (Error(..))
import Internals.CommonStyleHelpers exposing (..)
import Task exposing (perform)
import Time exposing (Posix, now)
import Http exposing (..)
import Json.Decode as D


type Status
    = Initial
    | Waiting
    | Success
    | Failure


type alias Log =
    { message : String
    , mbDetails : Maybe String
    , isError : Bool
    , timeStamp : Posix
    }


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


newLog : (Log -> msg) -> String -> Maybe String -> Bool -> Cmd msg
newLog addLogMsg logMsg details isError =
    Task.perform addLogMsg <|
        (Time.now
            |> Task.andThen
                (\t ->
                    Task.succeed <|
                        Log logMsg
                            details
                            isError
                            t
                )
        )


logsView : List Log -> Time.Zone -> Element msg
logsView logs zone =
    let
        formatTime =
            String.fromInt
                >> String.padLeft 2 '0'

        logView { message, mbDetails, isError, timeStamp } =
            column
                [ spacing 5
                , width (maximum 500 fill)
                ]
                [ row [ spacing 15 ]
                    [ el [ Font.color (rgb 0.7 0.7 0.7) ]
                        (text <|
                            formatTime (Time.toHour zone timeStamp)
                                ++ ":"
                                ++ formatTime (Time.toMinute zone timeStamp)
                        )
                    , el
                        [ if isError then
                            Font.color (rgb 1 0 0)
                          else
                            noAttr
                        ]
                        (text message)
                    ]
                , case mbDetails of
                    Nothing ->
                        Element.none

                    Just details ->
                        paragraph
                            [ paddingEach
                                { top = 0
                                , bottom = 0
                                , left = 20
                                , right = 0
                                }
                            , Font.size 12
                            ]
                            [ text details ]
                ]
    in
        column [ spacing 15 ]
            (List.map logView logs)


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
