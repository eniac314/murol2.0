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
    let
        device =
            classifyDevice config
    in
    case document of
        Node { nodeLabel, id, attrs } children ->
            case nodeLabel of
                Paragraph ->
                    renderParagraph onLoadMsg config id attrs children

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

                Link meta ->
                    renderLink config attrs meta

                Text s ->
                    renderText config attrs s

                Heading ( level, s ) ->
                    renderHeading config attrs ( level, s )

                Table meta ->
                    renderTable config id attrs meta

                CustomElement s ->
                    renderCustomElement config id attrs s


renderParagraph config onLoadMsg id attrs children =
    paragraph (renderAttrs config attrs)
        (List.map (renderDoc config onLoadMsg) children)


renderColumn config onLoadMsg id attrs children =
    column
        ([ width (maximum config.width fill) ]
            ++ renderAttrs config attrs
        )
        (List.map (renderDoc config onLoadMsg) children)


renderRow config onLoadMsg id attrs children =
    row (renderAttrs config attrs)
        (List.map (renderDoc config onLoadMsg) children)


renderTextColumn config onLoadMsg id attrs children =
    textColumn (renderAttrs config attrs)
        (List.map (renderDoc config onLoadMsg) children)


renderResponsiveBloc config onLoadMsg id attrs children =
    row (renderAttrs config attrs)
        (List.map (renderDoc config onLoadMsg) children)


renderImage config onLoadMsg { uid, styleId, classes } attrs { src, caption, size } =
    let
        device =
            classifyDevice config

        attrs_ =
            [ width (maximum size.imgWidth fill)
            ]
                ++ renderAttrs config attrs

        src_ =
            case src of
                Inline s ->
                    s

                UrlSrc s ->
                    s
    in
    el attrs_
        (html <|
            Html.img
                [ Attr.style "width" "100%"
                , Attr.style "height" "auto"
                , Html.Events.on "load" (Decode.succeed (onLoadMsg uid))
                , Attr.src src_
                ]
                []
        )


renderLink config attrs { targetBlank, url, label } =
    let
        linkFun =
            if targetBlank then
                newTabLink
            else
                link
    in
    linkFun
        (renderAttrs config attrs)
        { url = url
        , label = text label
        }


renderText config attrs s =
    el (renderAttrs config attrs) (text s)


renderHeading config attrs ( level, s ) =
    paragraph (Region.heading level :: renderAttrs config attrs) [ text s ]


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
    indexedTable
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


renderCustomElement config id attrs s =
    Dict.get s config.customElems
        |> Maybe.withDefault Element.none



-------------------------------------------------------------------------------


packStyleSheet : StyleSheet msg -> Document msg -> Document msg
packStyleSheet ({ paragraphStyle, columnStyle, rowStyle, textColumnStyle, respBlocStyle, customStyles, imageStyle, linkStyle, textStyle, headingStyles } as styleSheet) document =
    let
        packAttr new current =
            List.map StyleElementAttr new ++ current

        idStyle { uid, styleId, classes } =
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
    in
    case document of
        Node ({ nodeLabel, id, attrs } as nv) children ->
            case nodeLabel of
                Paragraph ->
                    Node { nv | attrs = packAttr (paragraphStyle ++ idStyle id) attrs }
                        (List.map (packStyleSheet styleSheet) children)

                Column ->
                    Node { nv | attrs = packAttr (columnStyle ++ idStyle id) attrs }
                        (List.map (packStyleSheet styleSheet) children)

                Row ->
                    Node { nv | attrs = packAttr (rowStyle ++ idStyle id) attrs }
                        (List.map (packStyleSheet styleSheet) children)

                TextColumn ->
                    Node { nv | attrs = packAttr (textColumnStyle ++ idStyle id) attrs }
                        (List.map (packStyleSheet styleSheet) children)

                ResponsiveBloc ->
                    Node { nv | attrs = packAttr (respBlocStyle ++ idStyle id) attrs }
                        (List.map (packStyleSheet styleSheet) children)

        Leaf ({ leafContent, id, attrs } as lv) ->
            case leafContent of
                Image meta ->
                    Leaf { lv | attrs = packAttr (imageStyle ++ idStyle id) attrs }

                Link meta ->
                    Leaf { lv | attrs = packAttr (linkStyle ++ idStyle id) attrs }

                Text s ->
                    Leaf { lv | attrs = packAttr (textStyle ++ idStyle id) attrs }

                Heading ( level, s ) ->
                    let
                        headingStyle =
                            Dict.get level headingStyles
                                |> Maybe.withDefault []
                    in
                    Leaf { lv | attrs = packAttr (headingStyle ++ idStyle id) attrs }

                Table meta ->
                    Leaf { lv | attrs = packAttr (idStyle id) attrs }

                CustomElement s ->
                    Leaf { lv | attrs = packAttr (idStyle id) attrs }


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

                Bold ->
                    [ Font.bold ]

                Italic ->
                    [ Font.italic ]

                StyleElementAttr attr_ ->
                    [ attr_ ]
    in
    List.concatMap renderAttr attrs
