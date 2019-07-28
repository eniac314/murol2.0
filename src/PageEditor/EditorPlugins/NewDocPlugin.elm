module PageEditor.EditorPlugins.NewDocPlugin exposing (cellContStrToCellContent, view)

import Document.Document exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Lazy as Lazy
import Element.Region as Region
import Html exposing (Html)
import Internals.CommonStyleHelpers exposing (..)
import PageEditor.Internals.DocumentEditorHelpers exposing (..)


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
            , wrappedRow
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
                , if not config.showAdvancedControls then
                    Element.none

                  else
                    Input.button (buttonStyle True)
                        { onPress =
                            Just <|
                                config.createNewContainer TextColumn
                        , label =
                            row [ spacing 10 ]
                                [ text "Créer colonne de texte"
                                ]
                        }
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
            , wrappedRow
                [ spacing 15 ]
                [ Input.button (buttonStyle True)
                    { onPress =
                        Just <|
                            config.createNewCell TextBlockPlugin
                    , label =
                        row [ spacing 10 ]
                            [ text "Bloc de texte"
                            ]
                    }
                , Input.button (buttonStyle True)
                    { onPress =
                        Just <|
                            config.createNewCell BlockLinksPlugin
                    , label =
                        row [ spacing 10 ]
                            [ text "Zone blocs de liens"
                            ]
                    }
                , if not config.showAdvancedControls then
                    Element.none

                  else
                    Input.button (buttonStyle True)
                        { onPress =
                            Just <|
                                config.createNewCell FichesPlugin
                        , label =
                            row [ spacing 10 ]
                                [ text "Zone de fiches"
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
                , if not config.showAdvancedControls then
                    Element.none

                  else
                    Input.button (buttonStyle True)
                        { onPress =
                            Just <|
                                config.createNewCell PictureLinksPlugin
                        , label =
                            row [ spacing 10 ]
                                [ text "Bandeau liens images"
                                ]
                        }
                , Input.button (buttonStyle True)
                    { onPress =
                        Just <|
                            config.createNewCell GalleryPlugin
                    , label =
                        row [ spacing 10 ]
                            [ text "Album photothèque"
                            ]
                    }
                , if not config.showAdvancedControls then
                    Element.none

                  else
                    Input.button (buttonStyle True)
                        { onPress =
                            Just <|
                                config.insertNewCell
                                    "NewsBlock"
                        , label =
                            row [ spacing 10 ]
                                [ text "Zone actualités"
                                ]
                        }
                , if not config.showAdvancedControls then
                    Element.none

                  else
                    Input.button (buttonStyle True)
                        { onPress =
                            Just <|
                                config.insertNewCell
                                    "CalendarWidget"
                        , label =
                            row [ spacing 10 ]
                                [ text "Mini calendrier"
                                ]
                        }
                , if not config.showAdvancedControls then
                    Element.none

                  else
                    Input.button (buttonStyle True)
                        { onPress =
                            Just <|
                                config.insertNewCell
                                    "Calendar"
                        , label =
                            row [ spacing 10 ]
                                [ text "Calendrier animation"
                                ]
                        }
                , if not config.showAdvancedControls then
                    Element.none

                  else
                    Input.button (buttonStyle True)
                        { onPress =
                            Just <|
                                config.insertNewCell
                                    "CalendarSalleMurol"
                        , label =
                            row [ spacing 10 ]
                                [ text "Calendrier salle Murol"
                                ]
                        }
                , if not config.showAdvancedControls then
                    Element.none

                  else
                    Input.button (buttonStyle True)
                        { onPress =
                            Just <|
                                config.insertNewCell
                                    "CalendarSalleBeaune"
                        , label =
                            row [ spacing 10 ]
                                [ text "Calendrier salle Beaune"
                                ]
                        }
                , if not config.showAdvancedControls then
                    Element.none

                  else
                    Input.button (buttonStyle True)
                        { onPress =
                            Just <|
                                config.insertNewCell
                                    "WeatherWidget"
                        , label =
                            row [ spacing 10 ]
                                [ text "Météo"
                                ]
                        }
                , if not config.showAdvancedControls then
                    Element.none

                  else
                    Input.button (buttonStyle True)
                        { onPress =
                            Just <|
                                config.insertNewCell
                                    "DronePanorama"
                        , label =
                            row [ spacing 10 ]
                                [ text "Panoramique aérien"
                                ]
                        }
                , if not config.showAdvancedControls then
                    Element.none

                  else
                    Input.button (buttonStyle True)
                        { onPress =
                            Just <|
                                config.insertNewCell
                                    "MurolInfos"
                        , label =
                            row [ spacing 10 ]
                                [ text "Murol infos"
                                ]
                        }
                , if not config.showAdvancedControls then
                    Element.none

                  else
                    Input.button (buttonStyle True)
                        { onPress =
                            Just <|
                                config.insertNewCell
                                    "Delibs"
                        , label =
                            row [ spacing 10 ]
                                [ text "Délibérations"
                                ]
                        }
                , if not config.showAdvancedControls then
                    Element.none

                  else
                    Input.button (buttonStyle True)
                        { onPress =
                            Just <|
                                config.insertNewCell
                                    "Bulletins"
                        , label =
                            row [ spacing 10 ]
                                [ text "Bulletins municipaux"
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


cellContStrToCellContent : String -> Maybe CellContent
cellContStrToCellContent s =
    case s of
        "NewsBlock" ->
            Just NewsBlock

        "CalendarWidget" ->
            Just CalendarWidget

        "Calendar" ->
            Just Calendar

        "CalendarSalleMurol" ->
            Just CalendarSalleMurol

        "CalendarSalleBeaune" ->
            Just CalendarSalleBeaune

        "WeatherWidget" ->
            Just WeatherWidget

        "DronePanorama" ->
            Just DronePanorama

        "MurolInfos" ->
            Just MurolInfo

        "Delibs" ->
            Just Delib

        "Bulletins" ->
            Just Bulletin

        _ ->
            Nothing



--(buttonStyle True) =
--    [ Border.rounded 5
--    , Font.center
--    , centerY
--    , paddingXY 5 3
--    , mouseOver
--        [ Background.color (rgb 0.95 0.95 0.95) ]
--    ]
