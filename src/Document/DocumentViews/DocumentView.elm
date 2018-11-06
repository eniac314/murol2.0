module Document.DocumentViews.DocumentView exposing (..)

import Array exposing (..)
import Dict exposing (..)
import Document.Document exposing (..)
import Document.DocumentViews.StyleSheets exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Keyed as Keyed
import Element.Region as Region
import Html as Html
import Html.Attributes as Attr
import Html.Events exposing (on, onMouseOut, onMouseOver)
import Internals.CommonHelpers exposing (chunks)
import Internals.CommonStyleHelpers exposing (..)
import Json.Decode as Decode
import Murmur3 exposing (hashString)
import PageEditor.Internals.DocumentEditorHelpers exposing (buildYoutubeUrl)
import Set exposing (..)


renderDoc : Config msg -> Document -> List (Element msg)
renderDoc config document =
    let
        device =
            classifyDevice config
    in
    case document of
        Container { containerLabel, id, attrs } children ->
            case containerLabel of
                DocColumn ->
                    renderColumn config id attrs children

                DocRow ->
                    renderRow config id attrs children

                TextColumn ->
                    renderTextColumn config id attrs children

                ResponsiveBloc ->
                    renderResponsiveBloc config id attrs children

        Cell { cellContent, id, attrs } ->
            case cellContent of
                Image meta ->
                    renderImage config id attrs meta

                Video meta ->
                    renderVideo config id attrs meta

                BlockLinks meta ->
                    renderBlockLinks config id attrs meta

                TextBlock xs ->
                    renderTextBlock config id attrs xs

                Table meta ->
                    renderTable config id attrs meta

                CustomElement s ->
                    renderCustomElement config id attrs s

                EmptyCell ->
                    renderEmptyCell config id attrs


renderBlockLinks : Config msg -> Id -> List DocAttribute -> List BlockLinkMeta -> List (Element msg)
renderBlockLinks config id attrs meta =
    let
        maxWidth =
            docMaxWidth
                ( config.width, config.height )
                config.editMode
                config.previewMode

        device =
            Element.classifyDevice
                { height = config.height
                , width = config.width
                }

        nbrChunks =
            if config.editMode then
                case config.previewMode of
                    PreviewPhone ->
                        1

                    PreviewTablet ->
                        2

                    PreviewScreen ->
                        3

                    PreviewBigScreen ->
                        3
            else
                case device.class of
                    Phone ->
                        1

                    Tablet ->
                        2

                    Desktop ->
                        3

                    BigDesktop ->
                        3

        rows =
            chunks nbrChunks
                (List.map (renderBlocksLinksMeta config id attrs) meta)
                |> List.map
                    (row
                        [ centerX, spacing 10 ]
                    )
    in
    [ column
        [ width fill
        , spacing 10
        ]
        rows
    ]


renderBlocksLinksMeta : Config msg -> Id -> List DocAttribute -> BlockLinkMeta -> Element msg
renderBlocksLinksMeta config id attrs { image, label, targetBlank, url } =
    let
        styleSheet =
            defaultStyleSheet config

        linkFun =
            if targetBlank then
                newTabLink
            else
                link

        url_ =
            if targetBlank then
                url
            else
                Dict.get url config.pageIndex
                    |> Maybe.withDefault ""

        block =
            el
                (styleSheet.blocLinkStyle
                    ++ renderAttrs config attrs
                    ++ [ width (px 300)
                       , height (px 225)
                       , Background.color (rgb255 119 136 153)
                       , if not config.editMode then
                            mouseOver
                                [ Background.color (rgba255 119 136 153 0.5) ]
                         else
                            noAttr
                       ]
                )
                (el
                    [ width (px 288)
                    , height (px 213)
                    , centerX
                    , centerY
                    , Background.image image
                    , inFront
                        (el
                            [ alignBottom
                            , width fill
                            , padding 10
                            , Background.color (rgba255 119 136 153 0.8)
                            , Font.color (rgba255 240 248 255 1)
                            ]
                            (el
                                ([ Font.center
                                 , width fill
                                 ]
                                    ++ unselectable
                                )
                                (text label)
                            )
                        )
                    ]
                    Element.none
                )
    in
    if config.editMode then
        Keyed.el
            []
            ( hashString
                0
                (image ++ url ++ label)
                |> String.fromInt
            , block
            )
    else
        linkFun
            []
            { url = url_
            , label = block
            }


renderTextBlock config id attrs xs =
    List.map (renderTextBlockElement config id attrs) xs


renderTextBlockElement config id tbAttrs tbe =
    let
        styleSheet =
            defaultStyleSheet config
    in
    case tbe of
        Paragraph attrs xs ->
            paragraph
                (styleSheet.paragraphStyle
                    ++ idStyle styleSheet id
                    ++ renderAttrs config tbAttrs
                    ++ renderAttrs config attrs
                )
                (List.map (renderTextBlockPrimitive config tbAttrs) xs)

        UList attrs xs ->
            paragraph
                (renderAttrs config tbAttrs
                    ++ idStyle styleSheet id
                    ++ renderAttrs config attrs
                    ++ [ spacing 10 ]
                )
                (List.map (renderLi config tbAttrs) xs)

        Heading attrs ( level, s ) ->
            let
                headingStyle =
                    Dict.get level styleSheet.headingStyles
                        |> Maybe.withDefault []
            in
            paragraph
                ([ Region.heading level ]
                    ++ headingStyle
                    ++ idStyle styleSheet id
                    ++ renderAttrs config tbAttrs
                    ++ renderAttrs config attrs
                )
                [ text s ]

        TBPrimitive p ->
            el
                (idStyle styleSheet id)
                (renderTextBlockPrimitive config tbAttrs p)


renderTextBlockPrimitive config tbAttrs p =
    let
        styleSheet =
            defaultStyleSheet config
    in
    case p of
        Text attrs s ->
            el
                (styleSheet.textStyle
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

                url_ =
                    if targetBlank then
                        url
                    else
                        Dict.get url config.pageIndex
                            |> Maybe.withDefault ""
            in
            if config.editMode then
                el
                    (styleSheet.linkStyle
                        ++ renderAttrs config tbAttrs
                        ++ renderAttrs config attrs
                    )
                    (text label)
            else
                linkFun
                    (styleSheet.linkStyle
                        ++ renderAttrs config tbAttrs
                        ++ renderAttrs config attrs
                    )
                    { url = url_
                    , label = text label
                    }


renderLi config tbAttrs li =
    paragraph
        ([ paddingEach
            { top = 0
            , left = 20
            , right = 0
            , bottom = 0
            }
         ]
            ++ renderAttrs config tbAttrs
        )
        ([ el [] (text "•  ") ] ++ List.map (renderTextBlockPrimitive config tbAttrs) li)


renderColumn config id attrs children =
    let
        styleSheet =
            defaultStyleSheet config
    in
    [ column
        (styleSheet.columnStyle
            ++ (if config.containersBkgColors then
                    [ Background.color (rgba 0 1 0 0.3) ]
                else
                    []
               )
            ++ idStyle styleSheet id
            ++ [ width (maximum config.width fill) ]
            ++ renderAttrs config attrs
        )
        (List.concatMap (renderDoc config) children)
    ]


renderRow config id attrs children =
    let
        styleSheet =
            defaultStyleSheet config
    in
    [ row
        (styleSheet.rowStyle
            ++ (if config.containersBkgColors then
                    [ Background.color (rgba 1 0 0 0.3) ]
                else
                    []
               )
            ++ idStyle styleSheet id
            ++ renderAttrs config attrs
        )
        (List.concatMap (renderDoc config) children)
    ]


renderTextColumn config id attrs children =
    let
        styleSheet =
            defaultStyleSheet config
    in
    [ textColumn
        (styleSheet.textColumnStyle
            ++ (if config.containersBkgColors then
                    [ Background.color (rgba 0 0 1 0.3) ]
                else
                    []
               )
            ++ idStyle styleSheet id
            ++ renderAttrs config attrs
        )
        (List.concatMap (renderDoc config) children)
    ]


renderResponsiveBloc config id attrs children =
    let
        styleSheet =
            defaultStyleSheet config
    in
    [ row
        (styleSheet.respBlocStyle
            ++ idStyle styleSheet id
            ++ renderAttrs config attrs
        )
        (List.concatMap (renderDoc config) children)
    ]


renderImage config ({ uid, docStyleId, classes } as id) attrs { src, caption, size } =
    let
        styleSheet =
            defaultStyleSheet config

        attrs_ =
            [ width (maximum size.imgWidth fill)
            ]
                ++ styleSheet.imageStyle
                ++ idStyle styleSheet id
                ++ renderAttrs config attrs

        src_ =
            case src of
                Inline f s ->
                    s

                UrlSrc s ->
                    s
    in
    [ el attrs_
        (html <|
            Html.img
                [ Attr.style "width" "100%"
                , Attr.style "height" "auto"
                , Attr.src src_
                ]
                []
        )
    ]


renderVideo config ({ uid, docStyleId, classes } as id) attrs vidMeta =
    let
        attrs_ =
            idStyle styleSheet id
                ++ renderAttrs config attrs

        styleSheet =
            defaultStyleSheet config
    in
    [ el attrs_
        (html <|
            Html.iframe
                [ Attr.src <|
                    buildYoutubeUrl vidMeta.src vidMeta
                , Attr.width vidMeta.size.videoWidth
                , Attr.height vidMeta.size.videoHeight
                , if vidMeta.frameBorder then
                    noHtmlAttr
                  else
                    Attr.attribute "frameborder" "0"
                , Attr.attribute "allowfullscreen" "true"
                , Attr.attribute "allow" "autoplay; encrypted-media"
                ]
                []
        )
    ]


renderTable config id attrs { style, nbrRows, nbrCols, data } =
    let
        styleSheet =
            defaultStyleSheet config

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
            ++ idStyle styleSheet id
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


renderEmptyCell config id attrs =
    let
        styleSheet =
            defaultStyleSheet config
    in
    [ row
        ([ width fill
         , height (px 100)
         , Background.color (rgba 0 0 1 0.2)
         ]
            ++ idStyle styleSheet id
            ++ renderAttrs config attrs
        )
        [ el
            [ centerX
            , centerY
            ]
            (text "Cellule vide")
        ]
    ]


idStyle { customStyles } { uid, docStyleId, htmlId, classes } =
    (docStyleId
        |> Maybe.andThen
            (\id ->
                Dict.get
                    id
                    customStyles.idNbrs
            )
        |> Maybe.withDefault []
    )
        ++ (htmlId
                |> Maybe.map
                    (\hid ->
                        [ htmlAttribute <| Attr.id hid ]
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

                FillPortion n ->
                    [ width (fillPortion n) ]

                Border ->
                    [ Border.color (rgb 127 127 127)
                    , Border.width 1
                    , Border.solid
                    ]

                FontColor color ->
                    [ Font.color (toSeColor color) ]

                Font s ->
                    [ Font.family [ Font.typeface s ] ]

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

                ZipperAttr uid zipperEventHandler ->
                    case config.zipperHandlers of
                        Nothing ->
                            []

                        Just handlers ->
                            case zipperEventHandler of
                                OnContainerClick ->
                                    [ Events.onClick (handlers.containerClickHandler uid)

                                    --, Background.color (rgba 0 1 0 0.2)
                                    ]

                                OnContainerDblClick ->
                                    [ Events.onDoubleClick (handlers.containerDblClickHandler uid) ]

                                OnContainerMouseOver ->
                                    [ mouseOver
                                        [ Background.color <| rgba 0.8 0.8 0.8 0.5 ]
                                    , pointer
                                    , htmlAttribute <| Attr.style "transition" "0.3s"
                                    ]

                                OnCellClick ->
                                    [ pointer
                                    , mouseOver
                                        [ Background.color <| rgba 0.8 0.8 0.8 0.5 ]
                                    , htmlAttribute <| Attr.style "transition" "0.3s"
                                    , Events.onDoubleClick handlers.cellClick

                                    --, Background.color (rgba 0 0 1 0.2)
                                    ]

                                OnNeighbourClick ->
                                    [ Events.onClick (handlers.neighbourClickHandler uid)
                                    , pointer

                                    --, Border.width 1
                                    --, Border.color (rgb 1 0 0)
                                    ]
    in
    List.concatMap renderAttr attrs
