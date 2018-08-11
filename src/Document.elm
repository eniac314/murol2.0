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


type Document msg
    = Node (NodeValue msg) (List (Document msg))
    | Leaf (LeafValue msg)


type NodeLabel
    = Paragraph
    | Column
    | Row
    | TextColumn
    | ResponsiveBloc


type LeafContent
    = Image ImageMeta
    | Link LinkMeta
    | Text String
    | Heading ( Int, String )


type alias LeafValue msg =
    { leafContent : LeafContent
    , id : Id
    , attrs : List (DocAttribute msg)
    }


type alias NodeValue msg =
    { nodeLabel : NodeLabel
    , id : Id
    , attrs : List (DocAttribute msg)
    }


type DocAttribute msg
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
    | StyleElementAttr (Attribute msg)


type alias DocZipper msg =
    { current : Document msg
    , contexts : List (Context msg)
    }


type alias Context msg =
    { parent : NodeValue msg
    , left : List (Document msg)
    , right : List (Document msg)
    }


initZip : Document msg -> DocZipper msg
initZip doc =
    { current = doc
    , contexts = []
    }


extractDoc : DocZipper msg -> Document msg
extractDoc { current, contexts } =
    current


updateCurrent : Document msg -> DocZipper msg -> DocZipper msg
updateCurrent new { current, contexts } =
    { current = new, contexts = contexts }


zipUp : DocZipper msg -> Maybe (DocZipper msg)
zipUp { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            Just
                { current = Node parent (left ++ [ current ] ++ right)
                , contexts = cs
                }


zipDown : (Document msg -> Bool) -> DocZipper msg -> Maybe (DocZipper msg)
zipDown p { current, contexts } =
    case current of
        Leaf _ ->
            Nothing

        Node _ [] ->
            Nothing

        Node nv ds ->
            let
                ( l, r ) =
                    break p ds
            in
            case r of
                [] ->
                    Nothing

                d :: ds_ ->
                    Just
                        { current = d
                        , contexts =
                            { parent = nv
                            , left = l
                            , right = ds_
                            }
                                :: contexts
                        }


zipLeft : DocZipper msg -> Maybe (DocZipper msg)
zipLeft { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            case List.reverse left of
                [] ->
                    Nothing

                d :: ds ->
                    Just
                        { current = d
                        , contexts =
                            { parent = parent
                            , left = List.reverse ds
                            , right = current :: right
                            }
                                :: cs
                        }


zipRight : DocZipper msg -> Maybe (DocZipper msg)
zipRight { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            case right of
                [] ->
                    Nothing

                d :: ds ->
                    Just
                        { current = d
                        , contexts =
                            { parent = parent
                            , left = left ++ [ current ]
                            , right = ds
                            }
                                :: cs
                        }


break : (a -> Bool) -> List a -> ( List a, List a )
break p xs =
    let
        helper ys left =
            case ys of
                [] ->
                    ( left, [] )

                y :: ys_ ->
                    if p y then
                        ( List.reverse left, y :: ys_ )
                    else
                        helper ys_ (y :: left)
    in
    helper xs []


type alias Id =
    { uid : Int
    , styleId : Maybe String
    , classes : List String
    }


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


renderDoc : WinSize -> Document msg -> Element msg
renderDoc winSize document =
    let
        device =
            classifyDevice winSize
    in
    case document of
        Node { nodeLabel, id, attrs } children ->
            case nodeLabel of
                Paragraph ->
                    renderParagraph winSize id attrs children

                Column ->
                    renderColumn winSize id attrs children

                Row ->
                    renderRow winSize id attrs children

                TextColumn ->
                    renderTextColumn winSize id attrs children

                ResponsiveBloc ->
                    renderResponsiveBloc winSize id attrs children

        Leaf { leafContent, id, attrs } ->
            case leafContent of
                Image meta ->
                    renderImage winSize attrs meta

                Link meta ->
                    renderLink winSize attrs meta

                Text s ->
                    renderText winSize attrs s

                Heading ( level, s ) ->
                    renderHeading winSize attrs ( level, s )


renderParagraph winSize id attrs children =
    paragraph (renderAttrs winSize attrs)
        (List.map (renderDoc winSize) children)


renderColumn winSize id attrs children =
    column (renderAttrs winSize attrs)
        (List.map (renderDoc winSize) children)


renderRow winSize id attrs children =
    row (renderAttrs winSize attrs)
        (List.map (renderDoc winSize) children)


renderTextColumn winSize id attrs children =
    textColumn (renderAttrs winSize attrs)
        (List.map (renderDoc winSize) children)


renderResponsiveBloc winSize id attrs children =
    Debug.todo ""


renderImage winSize attrs { src, caption, size } =
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


renderLink winSize attrs { targetBlank, url, label } =
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


renderText winSize attrs s =
    el (renderAttrs winSize attrs) (text s)


renderHeading winSize attrs ( level, s ) =
    el (Region.heading level :: renderAttrs winSize attrs) (text s)



-------------------------------------------------------------------------------


responsivePreFormat : WinSize -> Document msg -> Document msg
responsivePreFormat winSize document =
    let
        device =
            classifyDevice winSize
    in
    case document of
        Node ({ nodeLabel, id, attrs } as nv) children ->
            case nodeLabel of
                Paragraph ->
                    Node nv (List.map (responsivePreFormat winSize) children)

                Column ->
                    let
                        addColImgClass doc =
                            case doc of
                                (Leaf lv) as l ->
                                    case lv.leafContent of
                                        Image meta ->
                                            let
                                                lId =
                                                    lv.id
                                            in
                                            Leaf
                                                { leafContent = lv.leafContent
                                                , id = { lId | classes = "colImg" :: id.classes }
                                                , attrs = lv.attrs
                                                }

                                        _ ->
                                            l

                                doc_ ->
                                    doc_

                        children_ =
                            List.map addColImgClass children
                    in
                    Node nv (List.map (responsivePreFormat winSize) children_)

                Row ->
                    Node nv (List.map (responsivePreFormat winSize) children)

                TextColumn ->
                    if device.class == Phone || device.class == Tablet then
                        Node { nv | nodeLabel = Column } (List.map (responsivePreFormat winSize) children)
                    else
                        Node nv (List.map (responsivePreFormat winSize) children)

                ResponsiveBloc ->
                    Node nv (List.map (responsivePreFormat winSize) children)

        (Leaf { leafContent, id, attrs }) as l ->
            case leafContent of
                Image meta ->
                    l

                Link meta ->
                    l

                Text s ->
                    l

                Heading ( level, s ) ->
                    l


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
                        classes
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
