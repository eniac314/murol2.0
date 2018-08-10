module Document exposing (..)

import Dict exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Region as Region
import Html.Attributes as Attr


type Document
    = ParagraphNode Id (List NodeAttribute) (List Document)
    | ColumnNode Id (List NodeAttribute) (List Document)
    | RowNode Id (List NodeAttribute) (List Document)
    | TextColumnNode Id (List NodeAttribute) (List Document)
    | RespBloc Id (List NodeAttribute) (List Document)
    | ImageNode Id (List NodeAttribute) ImageMeta
    | LinkNode Id (List NodeAttribute) LinkMeta
    | TextNode Id (List NodeAttribute) String
    | HeadingNode Id (List NodeAttribute) ( Int, String )


type alias Id =
    { uid : Int
    , styleId : Maybe String
    , classes : List String
    }


type NodeAttribute
    = PaddingEach
        { bottom : Int
        , left : Int
        , right : Int
        , top : Int
        }
    | SpacingXY Int Int
    | AlignRight
    | AlignLeft
    | Pointer
    | BackgroundColor Color
    | Width Int
    | Height Int
    | Border
    | FontColor Color
    | FontSize Int
    | FontAlignLeft
    | FontAlignRight
    | Center
    | Justify
    | Bold
    | Italic
    | StyleElementAttr (Attribute Never)


type alias StyleSheet =
    { paragraphStyle : List (Attribute Never)
    , columnStyle : List (Attribute Never)
    , rowStyle : List (Attribute Never)
    , textColumnStyle : List (Attribute Never)
    , respBlocStyle : List (Attribute Never)
    , imageStyle : List (Attribute Never)
    , textStyle : List (Attribute Never)
    , linkStyle : List (Attribute Never)
    , headingStyles : Dict Int (List (Attribute Never))
    , customStyles :
        { idNbrs : Dict String (List (Attribute Never))
        , classes : Dict String (List (Attribute Never))
        }
    }


type ImageSrc
    = UrlSrc String
    | Inline String


type alias ImgSize =
    { imgWidth : Int
    , imgHeight : Int
    }


type alias ImageMeta =
    { src : ImageSrc
    , caption : Maybe String
    , size : ImgSize
    }


type alias LinkMeta =
    { targetBlank : Bool
    , url : String
    , label : String
    }


type alias WinSize =
    { width : Int
    , height : Int
    }


renderDoc : WinSize -> Document -> Element Never
renderDoc winSize document =
    let
        device =
            classifyDevice winSize
    in
    case document of
        ParagraphNode _ attrs children ->
            renderParagraphNode winSize attrs children

        ColumnNode _ attrs children ->
            renderColumnNode winSize attrs children

        RowNode _ attrs children ->
            renderRowNode winSize attrs children

        TextColumnNode _ attrs children ->
            renderTextColumnNode winSize attrs children

        RespBloc _ attrs children ->
            renderRespBloc winSize attrs children

        ImageNode _ attrs meta ->
            renderImageNode winSize attrs meta

        LinkNode _ attrs meta ->
            renderLinkNode winSize attrs meta

        TextNode _ attrs s ->
            renderTextNode winSize attrs s

        HeadingNode _ attrs ( level, s ) ->
            renderHeading winSize attrs ( level, s )


renderImageNode : WinSize -> List NodeAttribute -> ImageMeta -> Element Never
renderImageNode winSize attrs { src, caption, size } =
    let
        device =
            classifyDevice winSize

        attrs_ =
            [ width (maximum size.imgWidth fill) ]
                ++ renderAttrs winSize attrs

        src_ =
            case src of
                Inline s ->
                    s

                UrlSrc s ->
                    s
    in
    image attrs_
        { src = src_, description = Maybe.withDefault "" caption }


renderLinkNode : WinSize -> List NodeAttribute -> LinkMeta -> Element Never
renderLinkNode winSize attrs { targetBlank, url, label } =
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


renderTextNode : WinSize -> List NodeAttribute -> String -> Element Never
renderTextNode winSize attrs s =
    el (renderAttrs winSize attrs) (text s)


renderHeading : WinSize -> List NodeAttribute -> ( Int, String ) -> Element Never
renderHeading winSize attrs ( level, s ) =
    el (Region.heading level :: renderAttrs winSize attrs) (text s)


renderParagraphNode : WinSize -> List NodeAttribute -> List Document -> Element Never
renderParagraphNode winSize attrs children =
    paragraph (renderAttrs winSize attrs)
        (List.map (renderDoc winSize) children)


renderRowNode : WinSize -> List NodeAttribute -> List Document -> Element Never
renderRowNode winSize attrs children =
    row (renderAttrs winSize attrs)
        (List.map (renderDoc winSize) children)


renderColumnNode : WinSize -> List NodeAttribute -> List Document -> Element Never
renderColumnNode winSize attrs children =
    column (renderAttrs winSize attrs)
        (List.map (renderDoc winSize) children)


renderTextColumnNode : WinSize -> List NodeAttribute -> List Document -> Element Never
renderTextColumnNode winSize attrs children =
    textColumn (renderAttrs winSize attrs)
        (List.map (renderDoc winSize) children)


renderRespBloc : WinSize -> List NodeAttribute -> List Document -> Element Never
renderRespBloc winSize attrs children =
    Debug.todo ""



-------------------------------------------------------------------------------


responsivePreFormat : WinSize -> Document -> Document
responsivePreFormat winSize document =
    let
        device =
            classifyDevice winSize
    in
    case document of
        ParagraphNode id attrs children ->
            ParagraphNode id
                attrs
                (List.map (responsivePreFormat winSize) children)

        ColumnNode id attrs children ->
            let
                addColImgClass doc =
                    case doc of
                        ImageNode ({ uid, styleId, classes } as id_) attrs_ meta ->
                            ImageNode { id_ | classes = "colImg" :: classes } attrs_ meta

                        doc_ ->
                            doc_

                children_ =
                    List.map addColImgClass children
            in
            ColumnNode id
                attrs
                (List.map (responsivePreFormat winSize) children_)

        RowNode id attrs children ->
            RowNode id
                attrs
                (List.map (responsivePreFormat winSize) children)

        TextColumnNode id attrs children ->
            if
                (device.class == Phone || device.class == Tablet)
                    && device.orientation
                    == Portrait
            then
                ColumnNode id
                    attrs
                    (List.map (responsivePreFormat winSize) children)
            else
                TextColumnNode id
                    attrs
                    (List.map (responsivePreFormat winSize) children)

        RespBloc id attrs children ->
            RespBloc id
                attrs
                (List.map (responsivePreFormat winSize) children)

        ImageNode id attrs meta ->
            ImageNode id attrs meta

        LinkNode id attrs meta ->
            LinkNode id attrs meta

        TextNode id attrs s ->
            TextNode id attrs s

        HeadingNode id attrs ( level, s ) ->
            HeadingNode id attrs ( level, s )


packStyleSheet : StyleSheet -> Document -> Document
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
                        classes
                        |> List.concat
                   )
    in
    case document of
        ParagraphNode id attrs children ->
            ParagraphNode
                id
                (packAttr (paragraphStyle ++ idStyle id) attrs)
                (List.map (packStyleSheet styleSheet) children)

        ColumnNode id attrs children ->
            ColumnNode
                id
                (packAttr (columnStyle ++ idStyle id) attrs)
                (List.map (packStyleSheet styleSheet) children)

        RowNode id attrs children ->
            RowNode
                id
                (packAttr (rowStyle ++ idStyle id) attrs)
                (List.map (packStyleSheet styleSheet) children)

        TextColumnNode id attrs children ->
            TextColumnNode
                id
                (packAttr (textColumnStyle ++ idStyle id) attrs)
                (List.map (packStyleSheet styleSheet) children)

        RespBloc id attrs children ->
            RespBloc
                id
                (packAttr (respBlocStyle ++ idStyle id) attrs)
                (List.map (packStyleSheet styleSheet) children)

        ImageNode id attrs imgMeta ->
            ImageNode
                id
                (packAttr (imageStyle ++ idStyle id) attrs)
                imgMeta

        LinkNode id attrs linkMeta ->
            LinkNode
                id
                (packAttr (linkStyle ++ idStyle id) attrs)
                linkMeta

        TextNode id attrs s ->
            TextNode
                id
                (packAttr (textStyle ++ idStyle id) attrs)
                s

        HeadingNode id attrs ( l, s ) ->
            let
                headingStyle =
                    Dict.get l headingStyles
                        |> Maybe.withDefault []
            in
            HeadingNode
                id
                (packAttr (headingStyle ++ idStyle id) attrs)
                ( l, s )


renderAttrs : WinSize -> List NodeAttribute -> List (Attribute Never)
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
                        (device.class == Phone || device.class == Tablet)
                            && device.orientation
                            == Portrait
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
                        (device.class == Phone || device.class == Tablet)
                            && device.orientation
                            == Portrait
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
                    [ Background.color color ]

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
                    [ Font.color color ]

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
