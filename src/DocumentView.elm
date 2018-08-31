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
        , alpha
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
        , mouseOver
        , newTabLink
        , none
        , paddingEach
        , paddingXY
        , paragraph
        , pointer
        , px
        , rgb
        , rgba
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


renderDoc : Config msg -> Document -> Element msg
renderDoc config document =
    case renderDoc_ config document of
        [ doc ] ->
            doc

        _ ->
            el [] (text "erreur de rendu document")


renderDoc_ : Config msg -> Document -> List (Element msg)
renderDoc_ config document =
    let
        device =
            classifyDevice config
    in
    case document of
        Node { nodeLabel, id, attrs } children ->
            case nodeLabel of
                Column ->
                    renderColumn config id attrs children

                Row ->
                    renderRow config id attrs children

                TextColumn ->
                    renderTextColumn config id attrs children

                ResponsiveBloc ->
                    renderResponsiveBloc config id attrs children

        Leaf { leafContent, id, attrs } ->
            case leafContent of
                Image meta ->
                    renderImage config id attrs meta

                TextBlock xs ->
                    renderTextBlock config attrs xs

                Table meta ->
                    renderTable config id attrs meta

                CustomElement s ->
                    renderCustomElement config id attrs s


renderTextBlock config attrs xs =
    List.map (renderTextBlockElement config attrs) xs


renderTextBlockElement config tbAttrs tbe =
    case tbe of
        Paragraph attrs xs ->
            paragraph
                (config.styleSheet.paragraphStyle
                    ++ renderAttrs config tbAttrs
                    ++ renderAttrs config attrs
                )
                (List.map (renderTextBlockPrimitive config tbAttrs) xs)

        UList attrs xs ->
            column
                (renderAttrs config tbAttrs
                    ++ renderAttrs config attrs
                )
                (List.map (renderLi config tbAttrs) xs)

        TBPrimitive p ->
            renderTextBlockPrimitive config tbAttrs p


renderTextBlockPrimitive config tbAttrs p =
    case p of
        Text attrs s ->
            el
                (config.styleSheet.textStyle
                    ++ renderAttrs config tbAttrs
                    ++ renderAttrs config attrs
                )
                (text s)

        Link attrs { targetBlank, url, label } ->
            let
                linkFun =
                    if targetBlank then
                        newTabLink
                    else
                        link
            in
            linkFun
                (config.styleSheet.linkStyle
                    ++ renderAttrs config tbAttrs
                    ++ renderAttrs config attrs
                )
                { url = url
                , label = text label
                }

        Heading attrs ( level, s ) ->
            let
                headingStyle =
                    Dict.get level config.styleSheet.headingStyles
                        |> Maybe.withDefault []
            in
            paragraph
                ([ Region.heading level ]
                    ++ headingStyle
                    ++ renderAttrs config tbAttrs
                    ++ renderAttrs config attrs
                )
                [ text s ]


renderLi config tbAttrs li =
    row
        ([ spacing 10
         , paddingEach
            { top = 0
            , left = 20
            , right = 0
            , bottom = 0
            }
         ]
            ++ renderAttrs config tbAttrs
        )
        ([ el [] (text "=>") ] ++ List.map (renderTextBlockPrimitive config tbAttrs) li)


renderColumn config id attrs children =
    [ column
        (config.styleSheet.columnStyle
            ++ (if config.containersBkgColors then
                    [ Background.color (rgba 0 1 0 0.3) ]
                else
                    []
               )
            ++ idStyle config.styleSheet id
            ++ [ width (maximum config.width fill) ]
            ++ renderAttrs config attrs
        )
        (List.concatMap (renderDoc_ config) children)
    ]


renderRow config id attrs children =
    [ row
        (config.styleSheet.rowStyle
            ++ (if config.containersBkgColors then
                    [ Background.color (rgba 1 0 0 0.3) ]
                else
                    []
               )
            ++ idStyle config.styleSheet id
            ++ renderAttrs config attrs
        )
        (List.concatMap (renderDoc_ config) children)
    ]


renderTextColumn config id attrs children =
    [ textColumn
        (config.styleSheet.textColumnStyle
            ++ (if config.containersBkgColors then
                    [ Background.color (rgba 0 0 1 0.3) ]
                else
                    []
               )
            ++ idStyle config.styleSheet id
            ++ renderAttrs config attrs
        )
        (List.concatMap (renderDoc_ config) children)
    ]


renderResponsiveBloc config id attrs children =
    [ row
        (config.styleSheet.responsiveBlocStyle
            ++ idStyle config.styleSheet id
            ++ renderAttrs config attrs
        )
        (List.concatMap (renderDoc_ config) children)
    ]


renderImage config ({ uid, styleId, classes } as id) attrs { src, caption, size } =
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
                , Html.Events.on "load" (Decode.succeed (config.onLoadMsg uid))
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
            ++ renderAttrs config attrs
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


renderAttrs : Config msg -> List DocAttribute -> List (Attribute msg)
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
                            , bottom = 0
                            , left = 15
                            }
                        ]
                            ++ (if config.editMode then
                                    [ htmlAttribute <| Attr.style "z-index" "1" ]
                                else
                                    []
                               )

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
                            , bottom = 0
                            , left = 0
                            }
                        ]
                            ++ (if config.editMode then
                                    [ htmlAttribute <| Attr.style "z-index" "1" ]
                                else
                                    []
                               )

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

                Bold ->
                    [ Font.bold ]

                Italic ->
                    [ Font.italic ]

                HtmlId s ->
                    [ Attr.id s
                        |> htmlAttribute
                    ]

                ZipperAttr uid zipperEventHandler ->
                    case config.zipperHandlers of
                        Nothing ->
                            []

                        Just handlers ->
                            case zipperEventHandler of
                                ZipperOnClick ->
                                    [ Events.onClick (handlers.click uid) ]

                                ZipperOnDblClick ->
                                    [ Events.onDoubleClick (handlers.dblClick uid) ]

                                ZipperOnMouseOver ->
                                    [ mouseOver
                                        [ Background.color <| rgba 0.8 0.8 0.8 0.5 ]
                                    , pointer
                                    , htmlAttribute <| Attr.style "transition" "0.3s"
                                    ]
    in
    List.concatMap renderAttr attrs
