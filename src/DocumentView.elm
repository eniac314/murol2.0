module DocumentView exposing (..)

import Array exposing (..)
import Dict exposing (..)
import Document exposing (..)
import Element
    exposing
        ( Attribute
        , DeviceClass(..)
        , Element
        , alignLeft
        , alignRight
        , centerX
        , classifyDevice
        , column
        , el
        , fill
        , height
        , html
        , htmlAttribute
        , image
        , indexedTable
        , link
        , maximum
        , minimum
        , newTabLink
        , none
        , paddingEach
        , paddingXY
        , paragraph
        , pointer
        , px
        , rgb
        , row
        , scrollbarX
        , shrink
        , spacing
        , spacingXY
        , text
        , textColumn
        , width
        )
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Region as Region
import Html as Html
import Html.Attributes as Attr
import Html.Events exposing (on, onMouseOut, onMouseOver)
import Json.Decode as Decode
import Set exposing (..)
import StyleSheets exposing (..)


renderDoc : Config msg -> (Int -> msg) -> Document msg -> Element msg
renderDoc config onLoadMsg document =
    case renderDoc_ config onLoadMsg document of
        [ doc ] ->
            doc

        _ ->
            el [] (text "erreur de rendu document")


renderDoc_ : Config msg -> (Int -> msg) -> Document msg -> List (Element msg)
renderDoc_ config onLoadMsg document =
    let
        device =
            classifyDevice config
    in
    case document of
        Node { nodeLabel, id, attrs } children ->
            case nodeLabel of
                Column ->
                    renderColumn config onLoadMsg id attrs children

                Row ->
                    renderRow config onLoadMsg id attrs children

                TextColumn ->
                    renderTextColumn config onLoadMsg id attrs children

                ResponsiveBloc ->
                    renderResponsiveBloc config onLoadMsg id attrs children

        Leaf { leafContent, id, attrs } ->
            case leafContent of
                Image meta ->
                    renderImage config onLoadMsg id attrs meta

                TextBlock xs ->
                    renderTextBlock config attrs xs

                Table meta ->
                    renderTable config id attrs meta

                CustomElement s ->
                    renderCustomElement config id attrs s


renderTextBlock config attrs xs =
    List.map (renderTextBlockElement config) xs


renderTextBlockElement config tbe =
    case tbe of
        Paragraph xs ->
            paragraph
                config.styleSheet.paragraphStyle
                (List.map (renderTextBlockPrimitive config) xs)

        UList xs ->
            column [] (List.map (renderLi config) xs)

        TBPrimitive p ->
            renderTextBlockPrimitive config p


renderTextBlockPrimitive : Config msg -> TextBlockPrimitive -> Element msg
renderTextBlockPrimitive config p =
    case p of
        Text s ->
            el config.styleSheet.textStyle (text s)

        Link { targetBlank, url, label } ->
            let
                linkFun =
                    if targetBlank then
                        newTabLink
                    else
                        link
            in
            linkFun
                config.styleSheet.linkStyle
                { url = url
                , label = text label
                }

        Bold s ->
            el [ Font.bold ] (text s)

        Heading ( level, s ) ->
            let
                headingStyle =
                    Dict.get level config.styleSheet.headingStyles
                        |> Maybe.withDefault []
            in
            paragraph
                ([ Region.heading level ] ++ headingStyle)
                --[]
                [ text s ]


renderLi config li =
    row
        [ spacing 10
        , paddingEach
            { top = 0
            , left = 20
            , right = 0
            , bottom = 0
            }
        ]
        ([ el [] (text "=>") ] ++ List.map (renderTextBlockPrimitive config) li)


renderColumn config onLoadMsg id attrs children =
    [ column
        (config.styleSheet.columnStyle
            ++ idStyle config.styleSheet id
            ++ [ width (maximum config.width fill) ]
            ++ renderAttrs config attrs
        )
        (List.concatMap (renderDoc_ config onLoadMsg) children)
    ]


renderRow config onLoadMsg id attrs children =
    [ row
        (config.styleSheet.rowStyle
            ++ idStyle config.styleSheet id
            ++ renderAttrs config attrs
        )
        (List.concatMap (renderDoc_ config onLoadMsg) children)
    ]


renderTextColumn config onLoadMsg id attrs children =
    [ textColumn
        (config.styleSheet.textColumnStyle
            ++ idStyle config.styleSheet id
            ++ renderAttrs config attrs
        )
        (List.concatMap (renderDoc_ config onLoadMsg) children)
    ]


renderResponsiveBloc config onLoadMsg id attrs children =
    [ row
        (config.styleSheet.responsiveBlocStyle
            ++ idStyle config.styleSheet id
            ++ renderAttrs config attrs
        )
        (List.concatMap (renderDoc_ config onLoadMsg) children)
    ]


renderImage config onLoadMsg ({ uid, styleId, classes } as id) attrs { src, caption, size } =
    let
        device =
            classifyDevice config

        attrs_ =
            [ width (maximum size.imgWidth fill)
            ]
                ++ config.styleSheet.imageStyle
                ++ idStyle config.styleSheet id
                ++ renderAttrs config attrs

        src_ =
            case src of
                Inline s ->
                    s

                UrlSrc s ->
                    s
    in
    [ el attrs_
        (html <|
            Html.img
                [ Attr.style "width" "100%"
                , Attr.style "height" "auto"
                , Html.Events.on "load" (Decode.succeed (onLoadMsg uid))
                , Attr.src src_
                ]
                []
        )
    ]


renderTable config id attrs { style, nbrRows, nbrCols, data } =
    let
        columns =
            List.map
                (\ci ->
                    { header = Element.none
                    , width = fill
                    , view =
                        \ri row ->
                            el
                                (Dict.get style tableStyles
                                    |> Maybe.map .containerStyle
                                    |> Maybe.withDefault []
                                    |> (\s -> height fill :: s)
                                )
                                (el
                                    ((Dict.get style tableStyles
                                        |> Maybe.map .cellStyle
                                        |> Maybe.withDefault (\_ -> [])
                                     )
                                        ri
                                        ++ [ paddingXY 15 5
                                           , height (minimum 30 fill)
                                           ]
                                    )
                                    (paragraph
                                        []
                                        [ text
                                            (Array.get ci row
                                                |> Maybe.withDefault ""
                                            )
                                        ]
                                    )
                                )
                    }
                )
                (List.range
                    0
                    (nbrCols - 1)
                )
    in
    [ indexedTable
        ((Dict.get style tableStyles
            |> Maybe.map .tableStyle
            |> Maybe.withDefault []
         )
            ++ [ width fill --(maximum (config.width - 40) fill)
               , scrollbarX

               --, paddingXY 15 0
               ]
        )
        { data = data
        , columns = columns
        }
    ]


renderCustomElement config id attrs s =
    [ Dict.get s config.customElems
        |> Maybe.withDefault Element.none
    ]


idStyle { customStyles } { uid, styleId, classes } =
    (styleId
        |> Maybe.andThen
            (\id ->
                Dict.get
                    id
                    customStyles.idNbrs
            )
        |> Maybe.withDefault []
    )
        ++ (List.filterMap
                (\c ->
                    Dict.get
                        c
                        customStyles.classes
                )
                (Set.toList classes)
                |> List.concat
           )



-------------------------------------------------------------------------------


renderAttrs : Config msg -> List (DocAttribute msg) -> List (Attribute msg)
renderAttrs config attrs =
    let
        device =
            classifyDevice config

        renderAttr attr =
            case attr of
                PaddingEach pad ->
                    [ paddingEach pad ]

                SpacingXY spcX spcY ->
                    [ spacingXY spcX spcY ]

                AlignRight ->
                    if
                        device.class == Phone || device.class == Tablet
                        --&& device.orientation
                        --== Portrait
                    then
                        [ centerX ]
                    else
                        [ alignRight
                        , paddingEach
                            { top = 0
                            , right = 0
                            , bottom = 15
                            , left = 15
                            }
                        ]

                AlignLeft ->
                    if
                        device.class == Phone || device.class == Tablet
                        --&& device.orientation
                        --== Portrait
                    then
                        [ centerX ]
                    else
                        [ alignLeft
                        , paddingEach
                            { top = 0
                            , right = 15
                            , bottom = 15
                            , left = 0
                            }
                        ]

                Pointer ->
                    [ pointer ]

                BackgroundColor color ->
                    [ Background.color (toSeColor color) ]

                Width n ->
                    [ width (px n) ]

                Height n ->
                    [ height (px n) ]

                Border ->
                    [ Border.color (rgb 127 127 127)
                    , Border.width 1
                    , Border.solid
                    ]

                FontColor color ->
                    [ Font.color (toSeColor color) ]

                FontAlignRight ->
                    [ Font.alignRight ]

                FontAlignLeft ->
                    [ Font.alignLeft
                    ]

                FontSize n ->
                    [ Font.size n ]

                Center ->
                    [ Font.center ]

                Justify ->
                    [ Font.justify ]

                --Bold ->
                --    [ Font.bold ]
                --Italic ->
                --    [ Font.italic ]
                StyleElementAttr attr_ ->
                    [ attr_ ]
    in
    List.concatMap renderAttr attrs
