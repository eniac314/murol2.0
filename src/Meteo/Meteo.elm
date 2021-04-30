module Meteo.Meteo exposing
    ( Model
    , Msg
    , init
    , update
    , view
    )

import Browser
import Dict exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font
import Element.Input as Input exposing (..)
import Html exposing (..)
import Html.Attributes as HtmlAttr
import Http exposing (..)
import Json.Decode as D exposing (..)
import Simple.Animation as Animation exposing (Animation)
import Simple.Animation.Animated as Animated
import Simple.Animation.Property as P
import Simple.Transition as Transition
import String.Extra exposing (toSentenceCase)
import Task exposing (..)
import Time exposing (..)



-- Ce widget consomme le json produit par openweathermap.org
-- et servi par https://www.murol.fr/customWeather.php
-------------------------------------------------------------------------------
-- TYPES --
-----------


type Msg
    = GotZone Zone
    | GotRequest (Result Http.Error (Dict Int Meteo))
    | ChangeIndex Int
    | Reload
    | NoOp


type alias Model msg =
    { requestStatus : RequestStatus
    , currentIndex : Int
    , outMsg : Msg -> msg
    }


type alias Meteo =
    { date : { weekday : Time.Weekday, day : Int, month : Time.Month }
    , sunrise : Posix
    , sunset : Posix
    , temperature : Float
    , humidity : Float
    , wind_speed : Float
    , wind_direction : Float
    , weather : Weather
    }


type alias Weather =
    { code : Int
    , main : WeatherMain
    , iconUrl : String
    , description : String
    , isNight : Bool
    }


type WeatherMain
    = Thunderstorm
    | Drizzle
    | Rain
    | Snow
    | Mist
    | Smoke
    | Haze
    | Dust
    | Fog
    | Sand
    | Ash
    | Squall
    | Tornado
    | Clear
    | Clouds


type RequestStatus
    = Failure
    | Loading
    | Success (Dict Int Meteo)


type alias ViewConfig =
    { mainDateFontSize : Int
    , mainIconSize : Int
    , mainTempFontSize : Int
    , descriptionFontSize : Int
    , smallMeteoTextFontSize : Int
    , smallIconSize : Int
    , windRoseSize : Int
    , windHumidityFontSize : Int
    , windRoseSpacing : Int
    , currentMeteoViewSpacing : Int
    , containerHeight : Int
    }



-------------------------------------------------------------------------------
--------------
-- Decoders --
--------------


decodePartialDaily : Int -> Zone -> D.Decoder Meteo
decodePartialDaily d zone =
    D.field (String.fromInt d) (decodeMeteo zone)


decodeMeteo : Zone -> D.Decoder Meteo
decodeMeteo zone =
    D.map8 Meteo
        (D.field "dt" (decodePosix |> D.map (decodeDate zone)))
        (D.field "sunrise" decodePosix)
        (D.field "sunset" decodePosix)
        (D.field "temp" (oneOf [ decodeTemperature, D.float ]))
        (D.field "humidity" D.float)
        (D.field "wind_speed" D.float)
        (D.field "wind_deg" D.float)
        (D.field "weather" decodeListWeather)


decodeDate : Zone -> Posix -> { weekday : Time.Weekday, day : Int, month : Time.Month }
decodeDate zone posix =
    { weekday = Time.toWeekday zone posix, day = Time.toDay zone posix, month = Time.toMonth zone posix }


decodeListWeather : D.Decoder Weather
decodeListWeather =
    D.list decodeWeather
        |> D.andThen
            (\xs ->
                case xs of
                    [] ->
                        D.fail "no weather info"

                    x :: _ ->
                        D.succeed x
            )


decodePosix : D.Decoder Posix
decodePosix =
    D.int
        |> D.map (\n -> n * 1000)
        |> D.map millisToPosix


decodeTemperature : D.Decoder Float
decodeTemperature =
    D.field "day" D.float


decodeRequest : Zone -> D.Decoder (Dict Int Meteo)
decodeRequest zone =
    D.map4 (\current d1 d2 d3 -> Dict.fromList [ ( 0, current ), ( 1, d1 ), ( 2, d2 ), ( 3, d3 ) ])
        (D.field "current" (decodeMeteo zone))
        (D.field "daily" (decodePartialDaily 1 zone))
        (D.field "daily" (decodePartialDaily 2 zone))
        (D.field "daily" (decodePartialDaily 3 zone))


decodeWeather : D.Decoder Weather
decodeWeather =
    D.map5 Weather
        (D.field "id" D.int)
        (D.field "main" decodeWeatherMain)
        (D.field "icon" (D.map (String.replace "n" "d") <| D.string))
        (D.field "description" D.string)
        (D.field "icon" (D.string |> D.map (\icon -> String.contains "n" icon)))


decodeWeatherMain : D.Decoder WeatherMain
decodeWeatherMain =
    D.string
        |> D.andThen
            (\s ->
                case s of
                    "Thunderstorm" ->
                        D.succeed Thunderstorm

                    "Drizzle" ->
                        D.succeed Drizzle

                    "Rain" ->
                        D.succeed Rain

                    "Snow" ->
                        D.succeed Snow

                    "Mist" ->
                        D.succeed Mist

                    "Smoke" ->
                        D.succeed Smoke

                    "Haze" ->
                        D.succeed Haze

                    "Dust" ->
                        D.succeed Dust

                    "Fog" ->
                        D.succeed Fog

                    "Sand" ->
                        D.succeed Sand

                    "Ash" ->
                        D.succeed Ash

                    "Squall" ->
                        D.succeed Squall

                    "Tornado" ->
                        D.succeed Tornado

                    "Clear" ->
                        D.succeed Clear

                    "Clouds" ->
                        D.succeed Clouds

                    _ ->
                        D.fail "unknown weatherMain"
            )



-------------------------------------------------------------------------------
-------------------
-- HTTP requests --
-------------------


getZone : Cmd Msg
getZone =
    Task.perform GotZone Time.here


getDictMeteo : Zone -> Cmd Msg
getDictMeteo zone =
    Http.get
        { url = "https://www.murol.fr/customWeather.php"
        , expect = Http.expectJson GotRequest (decodeRequest zone)
        }



-------------------------------------------------------------------------------
----------
-- Init --
----------


init : (Msg -> msg) -> ( Model msg, Cmd msg )
init outMsg =
    ( { requestStatus = Loading
      , currentIndex = 0
      , outMsg = outMsg
      }
    , Cmd.batch [ getZone ] |> Cmd.map outMsg
    )



-------------------------------------------------------------------------------
------------
-- UPDATE --
------------


update : Msg -> Model msg -> ( Model msg, Cmd msg )
update msg model =
    Tuple.mapSecond (Cmd.map model.outMsg) <|
        case msg of
            GotZone zone ->
                ( model, Cmd.batch [ getDictMeteo zone ] )

            GotRequest request ->
                case request of
                    Ok dictMeteo ->
                        ( { model | requestStatus = Success dictMeteo }, Cmd.none )

                    Err _ ->
                        ( { model | requestStatus = Failure }, Cmd.none )

            ChangeIndex newIndex ->
                ( { model | currentIndex = newIndex }, Cmd.none )

            Reload ->
                ( { model | requestStatus = Loading }, Cmd.batch [ getZone ] )

            NoOp ->
                ( model, Cmd.none )



-------------------------------------------------------------------------------
----------
-- VIEW --
----------


viewConfig : Int -> ViewConfig
viewConfig containerWidth =
    if containerWidth <= 375 then
        { mainDateFontSize = 18
        , mainIconSize = 50
        , mainTempFontSize = 16
        , descriptionFontSize = 12
        , smallMeteoTextFontSize = 12
        , smallIconSize = 30
        , windRoseSize = 50
        , windHumidityFontSize = 12
        , windRoseSpacing = 10
        , currentMeteoViewSpacing = 15
        , containerHeight = 188
        }

    else if containerWidth > 375 && containerWidth <= 600 then
        { mainDateFontSize = 20
        , mainIconSize = 60
        , mainTempFontSize = 18
        , descriptionFontSize = 14
        , smallMeteoTextFontSize = 14
        , smallIconSize = 40
        , windRoseSize = 60
        , windHumidityFontSize = 14
        , windRoseSpacing = 15
        , currentMeteoViewSpacing = 15
        , containerHeight = 210
        }

    else
        { mainDateFontSize = 22
        , mainIconSize = 60
        , mainTempFontSize = 18
        , descriptionFontSize = 14
        , smallMeteoTextFontSize = 14
        , smallIconSize = 45
        , windRoseSize = 60
        , windHumidityFontSize = 14
        , windRoseSpacing = 30
        , currentMeteoViewSpacing = 25
        , containerHeight = 232
        }


view containerWidth model =
    let
        buttonStyle hasBorder =
            [ height fill
            , width fill
            , focused [ Border.glow (rgb 1 1 1) 0 ]
            , if hasBorder then
                Border.widthEach { bottom = 1, left = 0, right = 0, top = 0 }

              else
                noAttr
            , Border.color (rgb 0.5 0.5 0.5)
            ]

        vc =
            viewConfig containerWidth

        animation =
            Animation.fromTo
                { duration = 1000
                , options = [ Animation.easeIn ]
                }
                [ P.opacity 0 ]
                [ P.opacity 1 ]

        mainView dict =
            animatedUi column
                animation
                [ spacing 30 ]
                [ Element.row
                    [ width (px containerWidth)
                    ]
                    [ viewMeteo dict model.currentIndex (viewCurrentMeteo vc)
                    , column
                        [ width (minimum 140 fill)
                        , height fill
                        ]
                        [ Input.button
                            (buttonStyle True)
                            { onPress = Just (ChangeIndex 0)
                            , label = viewMeteo dict 0 (viewSmallMeteo vc (model.currentIndex == 0))
                            }
                        , Input.button
                            (buttonStyle True)
                            { onPress = Just (ChangeIndex 1)
                            , label = viewMeteo dict 1 (viewSmallMeteo vc (model.currentIndex == 1))
                            }
                        , Input.button
                            (buttonStyle True)
                            { onPress = Just (ChangeIndex 2)
                            , label = viewMeteo dict 2 (viewSmallMeteo vc (model.currentIndex == 2))
                            }
                        , Input.button
                            (buttonStyle False)
                            { onPress = Just (ChangeIndex 3)
                            , label = viewMeteo dict 3 (viewSmallMeteo vc (model.currentIndex == 3))
                            }
                        ]
                    ]
                ]

        loadingView =
            [ column
                [ centerY
                , centerX

                -- ugly hack pour forcer le paragraphe à revenir à la ligne
                , if containerWidth > 370 then
                    width shrink

                  else
                    width fill
                , spacing 15
                , Font.center
                ]
                [ el
                    [ Font.size 22, centerX ]
                    (Element.text "Metéo Murol")
                , case model.requestStatus of
                    Failure ->
                        column
                            [ spacing 10, centerX ]
                            [ paragraph
                                [ Font.size 12 ]
                                [ Element.text "Echec du chargement des données météo" ]
                            , Input.button
                                [ Border.rounded 10
                                , Background.color (rgb 1 1 1)
                                , mouseOver
                                    [ Background.color (rgb 0.8 0.8 0.9)
                                    ]
                                , Font.color (rgb 0 0 0)
                                , Font.size 18
                                , paddingXY 10 7
                                , centerX
                                , focused [ Border.glow (rgb 1 1 1) 0 ]
                                ]
                                { onPress = Just Reload
                                , label = el [] (Element.text "Recharger")
                                }
                            ]

                    _ ->
                        el [ Font.size 12, centerX ] (Element.text "Chargement en cours...")
                ]
            , el
                [ Border.rounded 10
                , Background.image castleLoader
                , width (px 100)
                , height (px 100)
                , centerY
                , centerX
                ]
                Element.none
            ]
    in
    Element.map model.outMsg <|
        row
            ([ width (px containerWidth)
             , height (px <| .containerHeight <| viewConfig containerWidth)
             , Background.color (Element.rgb255 61 106 162)
             , Font.color (rgb 1 1 1)
             , padding 15
             , spacing 15
             ]
                ++ (case model.requestStatus of
                        Success dict ->
                            [ inFront (mainView dict)
                            ]

                        _ ->
                            []
                   )
            )
            loadingView


viewMeteo : Dict Int Meteo -> Int -> (Meteo -> Element msg) -> Element msg
viewMeteo dict index f =
    case Dict.get index dict of
        Just m ->
            f m

        Nothing ->
            Element.none


viewCurrentMeteo : ViewConfig -> Meteo -> Element msg
viewCurrentMeteo vc meteo =
    column
        [ Background.color (Element.rgb255 61 106 162)
        , Font.color (rgb 1 1 1)
        , paddingXY 7 15
        , spacing vc.currentMeteoViewSpacing
        , height fill
        , width (minimum 160 fill)
        ]
        [ paragraph
            -- affichage de la date du jour actuel
            [ Font.size vc.mainDateFontSize
            , centerX
            , Font.center
            ]
            [ Element.text
                (String.join " "
                    [ frenchWeekdays meteo.date.weekday
                    , String.fromInt meteo.date.day
                    , frenchMonth meteo.date.month
                    ]
                )
            ]
        , row
            -- affichage du weather et de la temperature actuelle
            [ centerX

            --, Background.color (Element.rgb 0 0.8 0)
            ]
            [ image
                [ width (px vc.mainIconSize)
                , height (px vc.mainIconSize)
                , centerY
                ]
                { src = "assets/images/weatherIcons/" ++ meteo.weather.iconUrl ++ "@2x.png"
                , description = toSentenceCase meteo.weather.description
                }
            , column
                [ spacing 5
                , centerY
                , paddingEach { sides | left = 10 }
                ]
                [ el
                    [ Font.bold, Font.size vc.mainTempFontSize ]
                    (Element.text (String.fromInt (round meteo.temperature) ++ "°C"))
                , el [ Font.size vc.descriptionFontSize ] (Element.text (toSentenceCase meteo.weather.description))
                ]
            ]
        , row
            -- affichage de l'humidite et du vent
            [ spacing vc.windRoseSpacing
            , Background.color (rgb 1 1 1)
            , Border.rounded 15
            , Font.color (rgb 0 0 0)
            , padding 5
            , width fill
            ]
            [ windRose vc meteo.wind_direction
            , column
                [ Font.size vc.windHumidityFontSize
                , spacing 10
                , centerX
                ]
                [ row
                    []
                    [ el [] (Element.text "Vent ")
                    , el [ Font.color (rgb 0.2 0.2 0.2) ]
                        (Element.text (String.fromInt (round meteo.wind_speed)))
                    , el
                        [ Font.color (rgb 0.2 0.2 0.2)
                        , Font.size (vc.windHumidityFontSize - 1)
                        ]
                        (Element.text " km/h")
                    ]
                , row
                    []
                    [ el [] (Element.text "Humidité ")
                    , el [ Font.color (rgb 0.2 0.2 0.2) ]
                        (Element.text (String.fromFloat meteo.humidity))
                    , el
                        [ Font.color (rgb 0.2 0.2 0.2)
                        , Font.size (vc.windHumidityFontSize - 1)
                        ]
                        (Element.text "%")
                    ]
                ]
            ]
        ]


viewSmallMeteo : ViewConfig -> Bool -> Meteo -> Element msg
viewSmallMeteo vc isCurrentIndex meteo =
    row
        [ Font.size vc.smallMeteoTextFontSize
        , centerX
        , width fill
        , height fill
        , padding 5
        , width fill
        , Background.color (smallMeteoColor isCurrentIndex)
        , mouseOver
            (if isCurrentIndex then
                []

             else
                [ Background.color (mouseOverColor (smallMeteoColor isCurrentIndex)) ]
            )
        ]
        [ el [ width (px 45) ] (Element.text (frenchWeekdays meteo.date.weekday))
        , el [ width fill ]
            (image
                [ height (px vc.smallIconSize)
                , centerX
                , centerY
                ]
                { src = "assets/images/weatherIcons/" ++ meteo.weather.iconUrl ++ "@2x.png"
                , description = toSentenceCase meteo.weather.description
                }
            )

        --
        , el
            [ Font.bold
            , centerY
            , paddingXY 5 0
            , alignRight
            ]
            (Element.text (String.fromInt (round meteo.temperature) ++ "°C"))
        ]


windRose : ViewConfig -> Float -> Element msg
windRose vc angle =
    let
        duration =
            1000 + (500 * (round angle // 90))

        animation =
            Animation.fromTo
                { duration = duration
                , options = []
                }
                [ P.rotate 0 ]
                [ P.rotate angle ]

        fontSize =
            8
    in
    el
        [ width (px vc.windRoseSize)
        , height (px vc.windRoseSize)
        , Background.image cardinalDirections
        , centerX
        ]
        (row
            []
            [ animatedUi Element.el
                animation
                [ Background.image windrosePic
                , centerX
                , centerY
                , width (px vc.windRoseSize)
                , height (px vc.windRoseSize)
                ]
                Element.none
            ]
        )



-------------------------------------------------------------------------------
--------------------
-- Elm Ui Helpers --
--------------------


noAttr =
    htmlAttribute <| HtmlAttr.class ""


mouseOverColor : Color -> Color
mouseOverColor color =
    if color == Element.rgb 0.8 0.8 0.8 then
        Element.rgb 0.9 0.9 0.9

    else
        color


sides =
    { top = 0, bottom = 0, left = 0, right = 0 }


smallMeteoColor : Bool -> Color
smallMeteoColor isCurrentIndex =
    if isCurrentIndex then
        Element.rgb255 61 106 162

    else
        Element.rgb 0.8 0.8 0.8


animatedUi =
    Animated.ui
        { behindContent = Element.behindContent
        , htmlAttribute = Element.htmlAttribute
        , html = Element.html
        }



-------------------------------------------------------------------------------
---------------------------
-- Date and time helpers --
---------------------------


whatDayIsIt : Task x { weekday : Time.Weekday, day : Int, month : Time.Month }
whatDayIsIt =
    Task.map2 (\zone posix -> { weekday = Time.toWeekday zone posix, day = Time.toDay zone posix, month = Time.toMonth zone posix }) Time.here Time.now


frenchWeekdays : Weekday -> String
frenchWeekdays wd =
    case wd of
        Mon ->
            "Lundi"

        Tue ->
            "Mardi"

        Wed ->
            "Mercredi"

        Thu ->
            "Jeudi"

        Fri ->
            "Vendredi"

        Sat ->
            "Samedi"

        Sun ->
            "Dimanche"


frenchMonth : Month -> String
frenchMonth month =
    case month of
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


nextWeekday : Weekday -> Weekday
nextWeekday wd =
    case wd of
        Mon ->
            Tue

        Tue ->
            Wed

        Wed ->
            Thu

        Thu ->
            Fri

        Fri ->
            Sat

        Sat ->
            Sun

        Sun ->
            Mon



-------------------------------------------------------------------------------
-------------------
-- Inline assets --
-------------------


windrosePic =
    """data:image/png;base64,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"""


cardinalDirections =
    """data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAC7HpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHja7ZdtktwoDIb/c4ocAUkIieNgPqpygz1+XrDd0z2Z3SS1+2urTbWhhSzk9xH0TBh/fZ/hGy4qmUNS81xyjrhSSYUrBh7Pq+w7xbTv+5J2zdGrPTwmGCZZnudXq5d/hV0/HrjXoOPVHvyaYb8CXRN3QFkrMwb9OUnY+bRTugKVcQ5ycXtO9eCzb5fjTuX6zDstO7v1PTwbkkGlrlhImIeQxH33MwNZH5KKPuHOovCjPU6iYU/YlQkEeXm9u4/xWaAXke9R+Kz+Y/RJfK6XXT5pmS+NMPhygvRr8bfEz+XwyIhfJ0zuUF+IPLvPOc63qylD0XxV1Bab7jBwPCC57McymuGjGNtuBc1jjQ3Ie2zxQGtUiEFlBkrUqdKksftGDSkmHmzomRtALZuLceEmJyc0mmxSpIuDX+MRRGDmRy601y17vUaOlTvBlQnBCI/8bQv/NPknLcy5NhtR9IdWyItXXSONRW7d4QUgNC9uugW+24U/PtUPShUEdcvseMEajzPEofRRW7I5C/wU/bmFKFi/AkAirK1IhgQEYiZRyhSN2YigowNQReYsiQ8QIFXuSJKTCM4jY+e1Np4x2r6snHmZcTatXSRZDGyKVMBKSVE/lhw1VFU0qWpWUw9atGbJKWvO2fI65KqJJVPLZuZWrLp4cvXs5u7Fa+EiOAO15GLFSym1cqhYqCJWhX+F5eBDjnTokQ87/ChHbSiflpq23Kx5K6127tJxTPTcrXsvvQ4KAyfFSENHHjZ8lFEnam3KTFNnnjZ9llkf1C6qP7U/oEYXNd6klp89qMEazO4QtI4TXcxAjBOBuC0CKGhezKJTSrzILWaxMDaFMpLUxSZ0WsSAMA1infRg90Hut7gF9d/ixr8iFxa6/4JcALqfuX1Bra/fubaJnbtwaRoFuw/zw2tgr+tHrf7b/h3oHegd6B3oHegd6B3ofxBo4o8H/BMbfgCu6J5QM6HsegAAAYVpQ0NQSUNDIHByb2ZpbGUAAHicfZE7SMNAHMa/PqQiFQc7qDhkqOJgwRfiqFUoQoVQK7TqYHLpC5o0JCkujoJrwcHHYtXBxVlXB1dBEHyAuLk5KbpIif9LCi1iPDjux3f3fdx9B/jrZaaawTFA1SwjlYgLmeyqEHpFEP0IYwTjEjP1OVFMwnN83cPH17sYz/I+9+foVnImA3wC8SzTDYt4g3h609I57xNHWFFSiM+JRw26IPEj12WX3zgXHPbzzIiRTs0TR4iFQhvLbcyKhko8RRxVVI3y/RmXFc5bnNVylTXvyV8Yzmkry1ynOYgEFrEEEQJkVFFCGRZitGqkmEjRftzDP+D4RXLJ5CqBkWMBFaiQHD/4H/zu1sxPTrhJ4TjQ8WLbH0NAaBdo1Gz7+9i2GydA4Bm40lr+Sh2Y+SS91tKiR0DPNnBx3dLkPeByB+h70iVDcqQATX8+D7yf0Tdlgd5boGvN7a25j9MHIE1dJW+Ag0NguEDZ6x7v7mzv7d8zzf5+ALFWcsDVdl5PAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH5QQZDC0IdSe1/QAAAEdJREFUaN7t2zEKACAIAEDr/3+2pSVolKC6AxHcFDcxgiNyxnH9t0l3ywYAAAAAAJRpM+em9oqlN6cWAAAAAADgft54NEyNAS2KBgjgJmCjAAAAAElFTkSuQmCC"""


castleLoader =
    """data:image/gif;base64,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"""
