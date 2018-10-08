module PageEditor.Internals.PersistencePlugin exposing (..)

import Base64 exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Keyed as Keyed
import Element.Lazy as Lazy
import Element.Region as Region
import Html as Html
import Html.Attributes as HtmlAttr
import Internals.CommonStyleHelpers exposing (..)
import Json.Decode exposing (decodeString, value)
import Json.Encode exposing (null)
import PageEditor.Json.DocumentSerializer exposing (..)


view config =
    column
        [ spacing 15
        , padding 15
        , Font.size 16
        , height fill
        , width fill
        , scrollbarY
        ]
        [ el
            [ Font.bold
            , Font.size 18
            ]
            (text "Persistence dans le cache du navigateur")
        , column
            [ spacing 15
            , Background.color (rgb 0.95 0.95 0.95)
            , padding 10
            , width (px 500)
            ]
            [ text "Fichiers disponibles:"
            , column
                [ spacingXY 15 0
                , Background.color (rgb 1 1 1)
                , width fill
                , height (px 150)
                , scrollbars
                ]
                (List.map
                    (\f ->
                        el
                            ([ Events.onClick (config.setLocalStorageKey f)
                             , pointer
                             , paddingXY 5 3
                             ]
                                ++ (if f == config.localStorageKey then
                                        [ Background.color (rgba 0.3 0 1 0.3) ]
                                    else
                                        []
                                   )
                            )
                            (text f)
                    )
                    config.localStorageKeys
                )
            , row
                [ spacing 15 ]
                [ Input.button (buttonStyle True)
                    { onPress =
                        Just
                            config.removeFromLocalStorage
                    , label =
                        row [ spacing 10 ]
                            [ text "Effacer fichier"
                            ]
                    }
                , Input.button (buttonStyle True)
                    { onPress =
                        Just
                            config.clearLocalStorage
                    , label =
                        row [ spacing 10 ]
                            [ text "Vider cache"
                            ]
                    }
                ]
            , row
                [ spacing 15 ]
                [ Input.button (buttonStyle True)
                    { onPress =
                        Just
                            config.getFromLocalStorage
                    , label =
                        row [ spacing 10 ]
                            [ text "Charger fichier"
                            ]
                    }
                , Input.button (buttonStyle True)
                    { onPress =
                        Just
                            config.loadDocument
                    , label =
                        row [ spacing 10 ]
                            [ text "Conversion Json -> Document"
                            ]
                    }
                ]
            ]
        , row [ spacing 15 ]
            [ el [] (text "Prévisualisation Json: ")
            ]
        , column
            [ spacing 15 ]
            [ Keyed.el []
                ( config.jsonBuffer
                , Input.multiline
                    [ width (px 500)
                    , height (px 350)
                    , scrollbars
                    , htmlAttribute <| HtmlAttr.style "background-color" "Beige"
                    , Font.size 14
                    , padding 10
                    ]
                    { onChange = config.setJsonBuffer
                    , text =
                        config.jsonBuffer
                    , placeholder = Nothing
                    , label = Input.labelLeft [] Element.none
                    , spellcheck = False
                    }
                )
            , row
                [ spacing 15 ]
                [ Input.text
                    [ width (px 150)
                    , spacing 5
                    , paddingXY 15 5
                    , focused [ Border.glow (rgb 1 1 1) 0 ]
                    , Font.family
                        [ Font.monospace
                        ]
                    ]
                    { onChange = config.setLocalStorageKey
                    , text = config.localStorageKey
                    , placeholder = Nothing
                    , label =
                        Input.labelLeft
                            [ centerY
                            , Font.bold
                            ]
                            (Element.text "Nom du fichier: ")
                    }
                , Input.button (buttonStyle True)
                    { onPress =
                        Just <|
                            config.setLocalStorageValue
                                (encodeDocument config.document)
                    , label =
                        row [ spacing 10 ]
                            [ text "Conversion Document -> Json"
                            ]
                    }
                , Input.button (buttonStyle True)
                    { onPress =
                        Just
                            config.putInLocalStorage
                    , label =
                        row [ spacing 10 ]
                            [ text "Sauvegarder"
                            ]
                    }
                ]
            ]
        , row [ spacing 15 ]
            [ el [ Font.bold ] (text "Lien téléchargement: ")
            , html <|
                Html.a
                    [ HtmlAttr.href <|
                        "data:application/octet-stream;charset=utf-16le;base64,"
                            ++ Base64.encode config.jsonBuffer
                    , HtmlAttr.download (config.localStorageKey ++ ".json")
                    ]
                    [ Html.text <| config.localStorageKey ++ ".json" ]
            ]
        , el
            [ paddingEach
                { top = 0
                , bottom = 15
                , right = 0
                , left = 0
                }
            ]
            (Input.button (buttonStyle True)
                { onPress =
                    Just <|
                        config.setEditorPlugin Nothing
                , label =
                    row [ spacing 10 ]
                        [ text "Retour"
                        ]
                }
            )
        ]
