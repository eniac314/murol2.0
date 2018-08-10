module Main exposing (..)

import Browser exposing (document)
import Browser.Dom as Dom
import Browser.Events exposing (onResize)
import Dict exposing (..)
import Document exposing (..)
import Element exposing (layout)
import Html exposing (div, text)
import Html.Attributes as Attr
import StyleSheets exposing (..)
import Task exposing (perform)


sampleDoc : Document
sampleDoc =
    ColumnNode { uid = 0, styleId = Just "root", classes = [] }
        []
        --[ DocumentLeafNode <|
        [ HeadingNode { uid = 1, styleId = Nothing, classes = [] }
            []
            ( 1, "Découvrir Murol" )

        --, DocumentLeafNode <|
        , HeadingNode { uid = 2, styleId = Nothing, classes = [] }
            []
            ( 2, "Le bourg de Murol" )
        , TextColumnNode { uid = 3, styleId = Nothing, classes = [] }
            []
            [ ImageNode { uid = 4, styleId = Nothing, classes = [] }
                [ AlignLeft ]
                { src = UrlSrc "/images/2 Murol, le bourg.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 300
                    , imgHeight = 300
                    }
                }
            , ImageNode { uid = 5, styleId = Nothing, classes = [] }
                [ AlignRight ]
                { src = UrlSrc "/images/2 Murol, le bourg.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 300
                    , imgHeight = 300
                    }
                }
            , ParagraphNode { uid = 6, styleId = Nothing, classes = [] }
                []
                [ TextNode { uid = 22, styleId = Nothing, classes = [] }
                    []
                    "Le bourg de Murol est implanté dans un écrin de verdure à 850 mètres d'altitude, dans la vallée de la Couze Chambon, sur le versant Est du massif du Sancy."
                ]
            , ParagraphNode { uid = 7, styleId = Nothing, classes = [] }
                []
                [ TextNode { uid = 8, styleId = Nothing, classes = [] }
                    []
                    "Enchâssé entre le volcan boisé du "
                , LinkNode { uid = 9, styleId = Nothing, classes = [] }
                    []
                    { targetBlank = False
                    , url = ""
                    , label = "Tartaret"
                    }
                , TextNode { uid = 10, styleId = Nothing, classes = [] }
                    []
                    " le promontoire du "
                , LinkNode { uid = 11, styleId = Nothing, classes = [] }
                    []
                    { targetBlank = False
                    , url = ""
                    , label = "château de Murol"
                    }
                , TextNode { uid = 12, styleId = Nothing, classes = [] }
                    []
                    " et le puy de Bessolles, le village vous ravira par ses sites remarquables et pittoresques."
                ]
            , ParagraphNode { uid = 13, styleId = Nothing, classes = [] }
                []
                [ TextNode { uid = 14, styleId = Nothing, classes = [] }
                    []
                    "Au pied du château, découvrez le parc arboré du Prélong où se trouvent le "
                , LinkNode { uid = 15, styleId = Nothing, classes = [] }
                    []
                    { targetBlank = True
                    , url = "http://www.musee-murol.fr/fr"
                    , label = "musée des Peintres de l’Ecole de Murols"
                    }
                , TextNode { uid = 16, styleId = Nothing, classes = [] }
                    []
                    " et le musée archéologique."
                ]
            ]
        , ColumnNode { uid = 17, styleId = Nothing, classes = [] }
            []
            [ ImageNode { uid = 18, styleId = Nothing, classes = [] }
                []
                { src = UrlSrc "/images/prélong.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 333
                    , imgHeight = 250
                    }
                }
            , ImageNode { uid = 19, styleId = Nothing, classes = [] }
                []
                { src = UrlSrc "/images/museePeintre.jpeg"
                , caption = Nothing
                , size =
                    { imgWidth = 333
                    , imgHeight = 250
                    }
                }
            , ImageNode { uid = 20, styleId = Nothing, classes = [] }
                []
                { src = UrlSrc "/images/bourg2.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 377
                    , imgHeight = 250
                    }
                }
            , ImageNode { uid = 21, styleId = Nothing, classes = [] }
                []
                { src = UrlSrc "/images/illustration animations estivales.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 576
                    , imgHeight = 772
                    }
                }
            ]
        ]


main : Program () Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type Msg
    = Default
    | CurrentViewport Dom.Viewport
    | WinResize Int Int


type alias Model =
    { winSize : WinSize
    }


init flags =
    ( { winSize = { width = 1920, height = 1080 } }
    , Cmd.batch
        [ Task.perform CurrentViewport Dom.getViewport ]
    )


update msg model =
    case msg of
        WinResize width height ->
            ( { model | winSize = { width = width, height = height } }, Cmd.none )

        CurrentViewport vp ->
            ( { model
                | winSize =
                    { width = round vp.viewport.width
                    , height = round vp.viewport.height
                    }
              }
            , Cmd.none
            )

        Default ->
            ( model, Cmd.none )


subscriptions model =
    Sub.batch [ onResize WinResize ]


view model =
    { title = "editor"
    , body =
        [ layout []
            (responsivePreFormat model.winSize sampleDoc
                |> packStyleSheet defaulStyleSheet
                |> renderDoc model.winSize
            )
            |> Html.map (\_ -> Default)
        , Html.text <| Debug.toString model
        ]
    }
