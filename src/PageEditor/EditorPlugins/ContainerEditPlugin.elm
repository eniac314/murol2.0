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
    el
        [ padding 15
        , alignTop
        ]
        (column
            (containerStyle
                ++ [ Font.size 16
                   ]
            )
            [ changeContainerTypeView config
            , changeContainerWidthView config
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
        )


changeContainerTypeView config =
    let
        containerLabel =
            config.currentContainer.containerLabel
    in
    column
        itemStyle
        [ el
            [ Font.bold ]
            (text "Modification du type de containeur: ")
        , text <|
            "Transformer "
                ++ containerLabelToString containerLabel
                ++ " en: "
        , row
            [ spacing 15 ]
            [ Input.button
                (buttonStyle (containerLabel /= DocColumn))
                { onPress =
                    if containerLabel /= DocColumn then
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
                (buttonStyle <| containerLabel /= DocRow)
                { onPress =
                    if containerLabel /= DocRow then
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
                (buttonStyle <| containerLabel /= TextColumn)
                { onPress =
                    if containerLabel /= TextColumn then
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
        ]


changeContainerWidthView config =
    let
        attrs =
            config.currentContainer.attrs
    in
    column
        (itemStyle ++ [])
        [ el
            [ Font.bold ]
            (text "Adapter la largeur du containeur au: ")
        , Input.radioRow
            [ spacing 15 ]
            { onChange = config.updateContainerAttr
            , options =
                [ Input.option ( Just WidthShrink, Just WidthFill ) (text "contenant")
                , Input.option ( Just WidthFill, Just WidthShrink ) (text "contenu")
                ]
            , selected =
                if List.member WidthShrink attrs then
                    Just ( Just WidthFill, Just WidthShrink )

                else
                    Just ( Just WidthShrink, Just WidthFill )
            , label = Input.labelHidden ""
            }
        ]



--changeContainerWidthView model config =
--    column
--        (itemStyle ++ [])
--        [ Input.slider
--            [ Element.height (Element.px 30)
--            , Element.width (px 250)
--            -- Here is where we're creating/styling the "track"
--            , Element.behindContent
--                (Element.el
--                    [ Element.width fill
--                    , Element.height (Element.px 2)
--                    , Element.centerY
--                    , Background.color (rgb 0.9 0.9 0.9)
--                    , Border.rounded 2
--                    ]
--                    Element.none
--                )
--            ]
--            { onChange = SetContainerWidth
--            , label = Input.labelLeft [ centerY ] Element.none
--            , min = 0
--            , max = 100
--            , step = Just 1
--            , value = model.sliderValue
--            , thumb =
--                Input.defaultThumb
--            }
--        ]


containerLabelToString cl =
    case cl of
        DocColumn ->
            "colonne"

        DocRow ->
            "ligne"

        TextColumn ->
            "colonne de texte"

        ResponsiveBloc ->
            "bloc réactif"


containerStyle : List (Attribute msg)
containerStyle =
    [ padding 15
    , spacing 15
    , Background.color grey6
    , Border.rounded 5
    ]


itemStyle : List (Attribute msg)
itemStyle =
    [ padding 15
    , spacing 15
    , Background.color grey7
    , Border.rounded 5
    ]
