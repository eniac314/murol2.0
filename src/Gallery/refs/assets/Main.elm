module Main exposing (..)

import Browser
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Region as Region
import Html as Html
import Html.Attributes as HtmlAttr
import Html.Events as HtmlEvents
import Http
import Json.Decode as Decode
import Random
import Task
import Time exposing (..)
import Url.Builder as Url


-- MAIN --


main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }



-- MODEL --


type alias FetchRandomGif =
    { topic : String
    , url : String
    , errorMsg : String
    , loading : Bool
    , title : String
    }


type alias Model =
    { die1Face : Int
    , die2Face : Int
    , timePass : Float
    , zone : Time.Zone
    , time : Time.Posix
    , isPress : Bool
    , fetchRandomGif : FetchRandomGif
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { die1Face = 1
      , die2Face = 1
      , timePass = maxTime
      , zone = Time.utc
      , time = Time.millisToPosix 0
      , isPress = False
      , fetchRandomGif =
            { topic = "cat"
            , url = "waiting.gif"
            , errorMsg = ""
            , loading = False
            , title = ""
            }
      }
    , Cmd.batch
        [ Task.perform AdjustTimeZone Time.here

        --, getRandomGif model.fetchRandomGif.topic
        ]
    )



-- UPDATE --


type Msg
    = StartRoll
    | Roll Posix
    | NewFace ( Int, Int )
    | Tick Time.Posix
    | AdjustTimeZone Time.Zone
    | SwapTime
    | MorePlease
    | NewGif (Result Http.Error JsonData)
    | GifLoaded
    | ChangeTopic String


type alias JsonData =
    { url : String
    , title : String
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        StartRoll ->
            ( { model | timePass = 0 }
            , Cmd.none
            )

        Roll _ ->
            ( { model
                | timePass =
                    if model.timePass < maxTime then
                        model.timePass + 0.25
                    else
                        maxTime
              }
            , Random.generate NewFace
                (Random.pair (Random.int 1 6) (Random.int 1 6))
            )

        NewFace ( f1, f2 ) ->
            ( { model | die1Face = f1, die2Face = f2 }
            , Cmd.none
            )

        Tick newTime ->
            ( { model | time = newTime }
            , Cmd.none
            )

        AdjustTimeZone newZone ->
            ( { model | zone = newZone }
            , Cmd.none
            )

        SwapTime ->
            ( { model | isPress = not model.isPress }
            , Cmd.none
            )

        MorePlease ->
            let
                frgif =
                    model.fetchRandomGif
            in
            ( { model
                | fetchRandomGif =
                    { frgif
                        | loading = True
                        , url = ""
                    }
              }
            , getRandomGif model.fetchRandomGif.topic
            )

        NewGif result ->
            case result of
                Ok { title, url } ->
                    let
                        frgif =
                            model.fetchRandomGif
                    in
                    ( { model
                        | fetchRandomGif =
                            { frgif
                                | url = url
                                , title = title
                            }
                      }
                    , Cmd.none
                    )

                Err newErrorMsg ->
                    let
                        frgif =
                            model.fetchRandomGif
                    in
                    ( { model
                        | fetchRandomGif =
                            { frgif
                                | errorMsg = Debug.toString newErrorMsg
                            }
                      }
                    , Cmd.none
                    )

        GifLoaded ->
            let
                frgif =
                    model.fetchRandomGif
            in
            ( { model
                | fetchRandomGif =
                    { frgif
                        | loading = False
                    }
              }
            , Cmd.none
            )

        ChangeTopic newTopic ->
            let
                frgif =
                    model.fetchRandomGif
            in
            ( { model
                | fetchRandomGif =
                    { frgif | topic = newTopic }
              }
            , Cmd.none
            )



-- SUBSCRIPTIONS --


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ if model.timePass < maxTime then
            every 250 Roll
          else
            Sub.none
        , if model.isPress == False then
            Time.every 1000 Tick
          else
            Sub.none
        ]



-- VIEW --


view : Model -> Html.Html Msg
view model =
    layoutWith
        { options =
            [ focusStyle
                { borderColor = Nothing
                , backgroundColor = Nothing
                , shadow = Nothing
                }
            ]
        }
        [ padding 10
        , Font.family
            [ Font.monospace ]
        , Background.tiled "/images/Cloth.jpg"
        , width fill

        --, explain Debug.todo
        ]
    <|
        column
            [ spacing 10
            , padding 10

            --, explain Debug.todo
            , width fill
            ]
            [ row
                [ spacing 10
                , width fill
                ]
                [ diceView model
                , clockView model
                ]
            , row
                [ width fill ]
                [ column
                    [ spacing 15
                    , padding 10
                    , centerX
                    , width fill
                    ]
                    [ el [ centerX ]
                        (Input.text
                            []
                            { onChange = ChangeTopic
                            , text = model.fetchRandomGif.topic
                            , placeholder =
                                Just <| Input.placeholder [] (text "Search Topic")
                            , label = Input.labelLeft [ centerX ] (text "Topic")
                            }
                        )
                    , el
                        [ Font.size 25
                        , centerX
                        , Font.underline
                        , centerX
                        ]
                        (paragraph [ centerX ]
                            [ text <|
                                if model.fetchRandomGif.title /= "" then
                                    model.fetchRandomGif.title
                                else
                                    "No gif yet..."
                            ]
                        )
                    , el
                        [ Background.color (rgb 0.9 0.9 0.9)
                        , centerX
                        ]
                        (el
                            [ padding 10
                            , Border.width 1
                            , Border.color (rgb255 131 147 142)
                            , Background.color (rgb255 255 255 240)
                            , width (px 333)
                            , height (px 250)
                            , Background.image <|
                                if model.fetchRandomGif.loading then
                                    "/images/loading.gif"
                                else
                                    model.fetchRandomGif.url
                            ]
                            (html <|
                                Html.img
                                    [ HtmlAttr.hidden True
                                    , HtmlEvents.on "load" (Decode.succeed GifLoaded)
                                    , HtmlAttr.src model.fetchRandomGif.url
                                    ]
                                    []
                            )
                        )
                    , el
                        []
                        (text model.fetchRandomGif.errorMsg)
                    , Input.button
                        buttonStyle
                        { onPress = Just MorePlease
                        , label = text "More Please!"
                        }
                    ]
                ]
            ]



-- HTTP --


getRandomGif : String -> Cmd Msg
getRandomGif topic =
    Http.send NewGif (Http.get (toGiphyUrl topic) jsonDataDecoder)


toGiphyUrl : String -> String
toGiphyUrl topic =
    Url.crossOrigin "https://api.giphy.com"
        [ "v1", "gifs", "random" ]
        [ Url.string "api_key" "dc6zaTOxFJmzC"
        , Url.string "tag" topic
        ]


jsonDataDecoder : Decode.Decoder JsonData
jsonDataDecoder =
    Decode.map2 JsonData
        gifDecoder
        titleDecoder


gifDecoder : Decode.Decoder String
gifDecoder =
    Decode.field "data" (Decode.field "image_url" Decode.string)


titleDecoder : Decode.Decoder String
titleDecoder =
    Decode.field "data" (Decode.field "title" Decode.string)



--Helper--


maxTime : Float
maxTime =
    3


buttonStyle : List (Attribute msg)
buttonStyle =
    [ Background.color (rgba255 147 178 234 1.0)
    , padding 15
    , centerX
    , Border.rounded 10
    , Font.center
    , Font.color (rgb255 100 50 100)
    , mouseOver
        [ Background.color (rgba255 147 178 234 0.9)
        ]
    , mouseDown
        [ Border.glow (rgb 1 1 1) 0
        , moveDown 5
        ]
    , Border.shadow
        { offset = ( 0, 5 )
        , size = 2
        , blur = 0
        , color = rgba255 46 56 53 1.0
        }
    ]


diceView : Model -> Element Msg
diceView model =
    row
        [ spacing 15
        , padding 15

        --, Background.image "/images/Crystals.jpg"
        , Background.color (rgba255 156 206 189 1)
        , Border.rounded 2
        , centerX
        , Border.width 1
        , Border.color (rgb255 131 147 142)
        ]
        [ column
            [ spacing 10
            , padding 15
            ]
            [ el
                [ Font.size 50
                , Font.color
                    (rgb255 250 250 250)
                ]
                (text <| intToImage model.die1Face)
            , el
                [ Font.size 50
                , Font.color
                    (rgb255 250 250 250)
                ]
                (text <| intToImage model.die2Face)
            ]
        , column
            [ spacing 10
            , padding 15
            ]
            [ Input.button
                buttonStyle
                { onPress = Just StartRoll
                , label = text "Roll"
                }
            ]

        --, column
        --    [ spacing 10
        --    , padding 15
        --      --, Background.image "/images/Mail.png"
        --    , Background.color (rgba255 255 255 100 0.6)
        --    , Border.rounded 10
        --    ]
        --    [ image
        --        []
        --        { src = ""
        --        , description = "Cat"
        --        }
        --    ]
        ]


clockView : Model -> Element Msg
clockView model =
    row
        [ centerX
        , spacing 10
        ]
        [ let
            hour =
                String.padLeft 2 '0' (String.fromInt (Time.toHour model.zone model.time))

            minute =
                String.padLeft 2 '0' (String.fromInt (Time.toMinute model.zone model.time))

            second =
                String.padLeft 2 '0' (String.fromInt (Time.toSecond model.zone model.time))
          in
          text <| hour ++ ":" ++ minute ++ ":" ++ second
        , Input.button
            buttonStyle
            { onPress = Just SwapTime
            , label =
                if model.isPress == False then
                    text "Stop"
                else
                    text "Resume"
            }
        ]


intToImage : Int -> String
intToImage n =
    case n of
        1 ->
            "⚀"

        2 ->
            "⚁"

        3 ->
            "⚂"

        4 ->
            "⚃"

        5 ->
            "⚄"

        6 ->
            "⚅"

        _ ->
            ""



--div []
--  [ h1 [] [ text (String.fromInt model.dieFace) ]
--  , button [ onClick Roll ] [ text "Roll" ]
--  ]
