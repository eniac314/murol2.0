module NewDocPlugin exposing (..)

import Document exposing (..)
import DocumentEditorHelpers exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Lazy as Lazy
import Element.Region as Region
import Html exposing (Html)


view config =
    column
        [ Font.size 16
        , width fill
        , alignTop
        , spacing 20
        , padding 15
        ]
        [ column
            [ width fill
            , spacing 15
            , Border.width 1
            , Border.color (rgba 0.9 0.9 0.9 1)
            , padding 15
            ]
            [ el [ Font.size 18 ] (text "Nouveau conteneur")
            , row
                [ spacing 15 ]
                [ Input.button (buttonStyle True)
                    { onPress =
                        Just <|
                            config.createNewContainer DocColumn
                    , label =
                        row [ spacing 10 ]
                            [ text "Créer colonne"
                            ]
                    }
                , Input.button (buttonStyle True)
                    { onPress =
                        Just <|
                            config.createNewContainer DocRow
                    , label =
                        row [ spacing 10 ]
                            [ text "Créer ligne"
                            ]
                    }
                , Input.button (buttonStyle True)
                    { onPress =
                        Just <|
                            config.createNewContainer TextColumn
                    , label =
                        row [ spacing 10 ]
                            [ text "Créer colonne de texte"
                            ]
                    }

                --, Input.button (buttonStyle True)
                --    { onPress =
                --        Just <|
                --            config.createNewContainer ResponsiveBloc
                --    , label =
                --        row [ spacing 10 ]
                --            [ text "Créer bloc réactif"
                --            ]
                --    }
                ]
            ]
        , column
            [ width fill
            , spacing 15
            , padding 15
            , Border.width 1
            , Border.color (rgba 0.9 0.9 0.9 1)
            ]
            [ el [ Font.size 18 ] (text "Nouvelle cellule")
            , row
                [ spacing 15 ]
                [ Input.button (buttonStyle True)
                    { onPress =
                        Just <|
                            config.createNewCell TextBlockPlugin
                    , label =
                        row [ spacing 10 ]
                            [ text "Créer bloc de texte"
                            ]
                    }
                , Input.button (buttonStyle True)
                    { onPress =
                        Just <|
                            config.createNewCell ImagePlugin
                    , label =
                        row [ spacing 10 ]
                            [ text "Image"
                            ]
                    }
                , Input.button (buttonStyle True)
                    { onPress =
                        Just <|
                            config.createNewCell VideoPlugin
                    , label =
                        row [ spacing 10 ]
                            [ text "Video"
                            ]
                    }
                , Input.button (buttonStyle True)
                    { onPress =
                        Just <|
                            config.createNewCell TablePlugin
                    , label =
                        row [ spacing 10 ]
                            [ text "Tableau"
                            ]
                    }
                ]
            ]
        , Input.button (buttonStyle True)
            { onPress =
                Just <|
                    config.goBack
            , label =
                row [ spacing 10 ]
                    [ text "Retour"
                    ]
            }
        ]



--(buttonStyle True) =
--    [ Border.rounded 5
--    , Font.center
--    , centerY
--    , paddingXY 5 3
--    , mouseOver
--        [ Background.color (rgb 0.95 0.95 0.95) ]
--    ]
