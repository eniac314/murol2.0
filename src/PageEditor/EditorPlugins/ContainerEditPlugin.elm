module PageEditor.EditorPlugins.ContainerEditPlugin exposing (..)

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
        [ padding 15
        , spacing 15
        , Font.size 16
        , alignTop
        ]
        [ text "Modification du type de containeur: "
        , text <|
            "Transformer "
                ++ containerLabelToString config.currentContainer
                ++ " en: "
        , row
            [ spacing 15 ]
            [ Input.button
                (buttonStyle (config.currentContainer /= DocColumn))
                { onPress =
                    if config.currentContainer /= DocColumn then
                        Just <|
                            config.swapContainerType DocColumn
                    else
                        Nothing
                , label =
                    row [ spacing 10 ]
                        [ text "Colonne"
                        ]
                }
            , Input.button
                (buttonStyle <| config.currentContainer /= DocRow)
                { onPress =
                    if config.currentContainer /= DocRow then
                        Just <|
                            config.swapContainerType DocRow
                    else
                        Nothing
                , label =
                    row [ spacing 10 ]
                        [ text "Ligne"
                        ]
                }
            , Input.button
                (buttonStyle <| config.currentContainer /= TextColumn)
                { onPress =
                    if config.currentContainer /= TextColumn then
                        Just <|
                            config.swapContainerType TextColumn
                    else
                        Nothing
                , label =
                    row [ spacing 10 ]
                        [ text "Colonne de texte"
                        ]
                }
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


containerLabelToString cl =
    case cl of
        DocColumn ->
            "Colonne"

        DocRow ->
            "Ligne"

        TextColumn ->
            "Colonne de texte"

        ResponsiveBloc ->
            "Bloc réactif"
