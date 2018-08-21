module DocumentView exposing (..)

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
        , link
        , maximum
        , newTabLink
        , none
        , paddingEach
        , paragraph
        , pointer
        , px
        , rgb
        , row
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


type alias StyleSheet msg =
    { paragraphStyle : List (Attribute msg)
    , columnStyle : List (Attribute msg)
    , rowStyle : List (Attribute msg)
    , textColumnStyle : List (Attribute msg)
    , respBlocStyle : List (Attribute msg)
    , imageStyle : List (Attribute msg)
    , textStyle : List (Attribute msg)
    , linkStyle : List (Attribute msg)
    , headingStyles : Dict Int (List (Attribute msg))
    , customStyles :
        { idNbrs : Dict String (List (Attribute msg))
        , classes : Dict String (List (Attribute msg))
        }
    }


renderDoc : WinSize -> (Int -> msg) -> Document msg -> Element msg
renderDoc winSize onLoadMsg document =
    let
        device =
            classifyDevice winSize
    in
    case document of
        Node { nodeLabel, id, attrs } children ->
            case nodeLabel of
                Paragraph ->
                    renderParagraph onLoadMsg winSize id attrs children

                Column ->
                    renderColumn winSize onLoadMsg id attrs children

                Row ->
                    renderRow winSize onLoadMsg id attrs children

                TextColumn ->
                    renderTextColumn winSize onLoadMsg id attrs children

                ResponsiveBloc ->
                    renderResponsiveBloc winSize onLoadMsg id attrs children

        Leaf { leafContent, id, attrs } ->
            case leafContent of
                Image meta ->
                    renderImage winSize onLoadMsg id attrs meta

                Link meta ->
                    renderLink winSize onLoadMsg attrs meta

                Text s ->
                    renderText winSize onLoadMsg attrs s

                Heading ( level, s ) ->
                    renderHeading winSize onLoadMsg attrs ( level, s )


renderParagraph winSize onLoadMsg id attrs children =
    paragraph (renderAttrs winSize attrs)
        (List.map (renderDoc winSize onLoadMsg) children)


renderColumn winSize onLoadMsg id attrs children =
    column (renderAttrs winSize attrs)
        (List.map (renderDoc winSize onLoadMsg) children)


renderRow winSize onLoadMsg id attrs children =
    row (renderAttrs winSize attrs)
        (List.map (renderDoc winSize onLoadMsg) children)


renderTextColumn winSize onLoadMsg id attrs children =
    textColumn (renderAttrs winSize attrs)
        (List.map (renderDoc winSize onLoadMsg) children)


renderResponsiveBloc winSize onLoadMsg id attrs children =
    row (renderAttrs winSize attrs)
        (List.map (renderDoc winSize onLoadMsg) children)



--renderImage winSize onLoadMsg { uid, styleId, classes } attrs { src, caption, size } =
--    let
--        device =
--            classifyDevice winSize
--        attrs_ =
--            if Set.member "colImg" classes then
--                [ width (maximum size.imgWidth fill)
--                , htmlAttribute <| Html.Events.on "load" (Decode.succeed (onLoadMsg uid))
--                ]
--                    ++ renderAttrs winSize attrs
--                --else if Set.member "rowImg" classes then
--                --    [ height (px 85) ]
--                --        ++ renderAttrs winSize attrs
--            else
--                [ width fill
--                , htmlAttribute <| Html.Events.on "load" (Decode.succeed (onLoadMsg uid))
--                ]
--                    ++ renderAttrs winSize attrs
--        src_ =
--            case src of
--                Inline s ->
--                    s
--                UrlSrc s ->
--                    s
--    in
--    image attrs_
--        { src = src_, description = Maybe.withDefault "" caption }


renderImage winSize onLoadMsg { uid, styleId, classes } attrs { src, caption, size } =
    let
        device =
            classifyDevice winSize

        attrs_ =
            [ width (maximum size.imgWidth fill)
            ]
                ++ renderAttrs winSize attrs

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


renderLink winSize onLoadMsg attrs { targetBlank, url, label } =
    let
        linkFun =
            if targetBlank then
                newTabLink
            else
                link
    in
    linkFun
        (renderAttrs winSize attrs)
        { url = url
        , label = text label
        }


renderText winSize onLoadMsg attrs s =
    el (renderAttrs winSize attrs) (text s)


renderHeading winSize onLoadMsg attrs ( level, s ) =
    paragraph (Region.heading level :: renderAttrs winSize attrs) [ text s ]



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


renderAttrs : WinSize -> List (DocAttribute msg) -> List (Attribute msg)
renderAttrs winSize attrs =
    let
        device =
            classifyDevice winSize

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
