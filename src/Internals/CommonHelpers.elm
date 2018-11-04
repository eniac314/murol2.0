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


newLog :
    ((Time.Posix -> Log) -> Time.Posix -> msg)
    -> String
    -> Maybe String
    -> Bool
    -> Cmd msg
newLog addLogMsg logMsg details isError =
    Task.perform
        (addLogMsg (Log logMsg details isError))
        Time.now


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

        BadStatus resp ->
            "Erreur serveur: "
                ++ String.fromInt resp.status.code
                ++ " - "
                ++ resp.status.message

        BadPayload decodingError resp ->
            "Erreur décodage: " ++ decodingError
