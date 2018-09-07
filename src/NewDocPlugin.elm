module NewDocPlugin exposing (..)

import Document exposing (..)
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
        [ Font.size 14
        , width fill
        , alignTop
        , spacing 20
        ]
        [ column
            [ width fill
            , spacing 15
            , Border.width 1
            , Border.color (rgba 0.9 0.9 0.9 1)
            ]
            [ el [ Font.size 18 ] (text "Nouveau conteneur")
            , row
                [ spacing 15 ]
                [ Input.button buttonStyle
                    { onPress =
                        Just <|
                            config.createNewContainer
                                (newContainer config.nextUid DocColumn)
                    , label =
                        row [ spacing 10 ]
                            [ text "Créer colonne"
                            ]
                    }
                , Input.button buttonStyle
                    { onPress =
                        Just <|
                            config.createNewContainer
                                (newContainer config.nextUid DocRow)
                    , label =
                        row [ spacing 10 ]
                            [ text "Créer ligne"
                            ]
                    }
                , Input.button buttonStyle
                    { onPress =
                        Just <|
                            config.createNewContainer
                                (newContainer config.nextUid TextColumn)
                    , label =
                        row [ spacing 10 ]
                            [ text "Créer colonne de texte"
                            ]
                    }
                , Input.button buttonStyle
                    { onPress =
                        Just <|
                            config.createNewContainer
                                (newContainer config.nextUid ResponsiveBloc)
                    , label =
                        row [ spacing 10 ]
                            [ text "Créer bloc réactif"
                            ]
                    }
                ]
            ]
        , column
            [ width fill
            , spacing 15
            , Border.width 1
            , Border.color (rgba 0.9 0.9 0.9 1)
            ]
            [ el [ Font.size 18 ] (text "Nouvelle cellule")
            , row
                [ spacing 15 ]
                [ Input.button buttonStyle
                    { onPress = Nothing
                    , label =
                        row [ spacing 10 ]
                            [ text "Créer bloc de texte"
                            ]
                    }
                , Input.button buttonStyle
                    { onPress = Nothing
                    , label =
                        row [ spacing 10 ]
                            [ text "Image"
                            ]
                    }
                , Input.button buttonStyle
                    { onPress =
                        Just <|
                            config.createNewCell
                                (newTable config.nextUid)
                    , label =
                        row [ spacing 10 ]
                            [ text "Tableau"
                            ]
                    }
                ]
            ]
        ]


buttonStyle =
    [ Border.rounded 5
    , Font.center
    , centerY
    , paddingXY 5 3
    , mouseOver
        [ Background.color (rgb 0.95 0.95 0.95) ]
    ]
