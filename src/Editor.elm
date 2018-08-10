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
    ColumnNode (Id { idNbr = 0, class = [] })
        []
        [ DocumentLeafNode <|
            HeadingNode NoId
                []
                ( 1, "Découvrir Murol" )
        , DocumentLeafNode <|
            HeadingNode NoId
                []
                ( 2, "Le bourg de Murol" )
        , TextColumnNode NoId
            []
            [ DocumentLeafNode <|
                ImageNode NoId
                    [ AlignLeft ]
                    { src = UrlSrc "/images/2 Murol, le bourg.jpg"
                    , caption = Nothing
                    , size =
                        { imgWidth = 300
                        , imgHeight = 300
                        }
                    }
            , DocumentLeafNode <|
                ImageNode NoId
                    [ AlignRight ]
                    { src = UrlSrc "/images/2 Murol, le bourg.jpg"
                    , caption = Nothing
                    , size =
                        { imgWidth = 300
                        , imgHeight = 300
                        }
                    }
            , ParagraphNode NoId
                []
                [ TextNode NoId
                    []
                    "Le bourg de Murol est implanté dans un écrin de verdure à 850 mètres d'altitude, dans la vallée de la Couze Chambon, sur le versant Est du massif du Sancy."
                ]
            , ParagraphNode NoId
                []
                [ TextNode NoId
                    []
                    "Enchâssé entre le volcan boisé du "
                , LinkNode NoId
                    []
                    { targetBlank = False
                    , url = ""
                    , label = "Tartaret"
                    }
                , TextNode NoId
                    []
                    " le promontoire du "
                , LinkNode NoId
                    []
                    { targetBlank = False
                    , url = ""
                    , label = "château de Murol"
                    }
                , TextNode NoId
                    []
                    " et le puy de Bessolles, le village vous ravira par ses sites remarquables et pittoresques."
                ]
            , ParagraphNode NoId
                []
                [ TextNode NoId
                    []
                    "Au pied du château, découvrez le parc arboré du Prélong où se trouvent le "
                , LinkNode NoId
                    []
                    { targetBlank = True
                    , url = "http://www.musee-murol.fr/fr"
                    , label = "musée des Peintres de l’Ecole de Murols"
                    }
                , TextNode NoId
                    []
                    " et le musée archéologique."
                ]
            ]
        , ColumnNode NoId
            --[ StyleElementAttr (spacing 15) ]
            []
            [ DocumentLeafNode <|
                ImageNode (Id { idNbr = 1, class = [ "colImg" ] })
                    []
                    { src = UrlSrc "/images/prélong.jpg"
                    , caption = Nothing
                    , size =
                        { imgWidth = 333
                        , imgHeight = 250
                        }
                    }
            , DocumentLeafNode <|
                ImageNode (Id { idNbr = 2, class = [ "colImg" ] })
                    []
                    { src = UrlSrc "/images/museePeintre.jpeg"
                    , caption = Nothing
                    , size =
                        { imgWidth = 333
                        , imgHeight = 250
                        }
                    }
            , DocumentLeafNode <|
                ImageNode (Id { idNbr = 3, class = [ "colImg" ] })
                    []
                    { src = UrlSrc "/images/bourg2.jpg"
                    , caption = Nothing
                    , size =
                        { imgWidth = 377
                        , imgHeight = 250
                        }
                    }
            , DocumentLeafNode <|
                ImageNode (Id { idNbr = 3, class = [ "colImg" ] })
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
            (packStyleSheet defaulStyleSheet sampleDoc
                |> renderDoc model.winSize
            )
            |> Html.map (\_ -> Default)
        , Html.text <| Debug.toString model
        ]
    }
