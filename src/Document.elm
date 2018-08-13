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
import Html.Events exposing (onMouseOut, onMouseOver)
import Set exposing (..)


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

    --, depth : Int
    }


type alias Id =
    { uid : Int
    , styleId : Maybe String
    , classes : Set String
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


hasUid : Int -> Document msg -> Bool
hasUid id document =
    case document of
        Node nv _ ->
            id == nv.id.uid

        Leaf lv ->
            id == lv.id.uid


hasClass : String -> Document msg -> Bool
hasClass class document =
    case document of
        Node nv _ ->
            Set.member class nv.id.classes

        Leaf lv ->
            Set.member class lv.id.classes


containsOnly : (Document msg -> Bool) -> Document msg -> Bool
containsOnly p document =
    case document of
        Node nv children ->
            List.foldr (\d acc -> p d && acc) True children

        Leaf _ ->
            False


isImage : Document msg -> Bool
isImage document =
    case document of
        Leaf lv ->
            case lv.leafContent of
                Image _ ->
                    True

                _ ->
                    False

        Node _ _ ->
            False


fixUids : Int -> Document msg -> Document msg
fixUids nextUid document =
    case document of
        Node ({ id } as nv) [] ->
            Node { nv | id = { id | uid = nextUid } } []

        Node ({ id } as nv) children ->
            Node { nv | id = { id | uid = nextUid } }
                (List.foldr
                    (\doc ( done, nUid ) -> ( fixUids nUid doc :: done, nUid + 1 ))
                    ( [], nextUid + 1 )
                    children
                    |> Tuple.first
                )

        Leaf ({ id } as lv) ->
            Leaf { lv | id = { id | uid = nextUid } }



-------------------------------------------------------------------------------


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


rewind : DocZipper msg -> DocZipper msg
rewind docZipper =
    case zipUp docZipper of
        Nothing ->
            docZipper

        Just docZipper_ ->
            rewind docZipper_


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


addClass : String -> Document msg -> Document msg
addClass class document =
    let
        newId id =
            { id
                | classes =
                    Set.insert class id.classes
            }
    in
    case document of
        Node nv children ->
            Node { nv | id = newId nv.id } children

        Leaf lv ->
            Leaf { lv | id = newId lv.id }


toogleClass : String -> Document msg -> Document msg
toogleClass class document =
    let
        newId id =
            { id
                | classes =
                    if Set.member class id.classes then
                        Set.remove class id.classes
                    else
                        Set.insert class id.classes
            }
    in
    case document of
        Node nv children ->
            Node { nv | id = newId nv.id } children

        Leaf lv ->
            Leaf { lv | id = newId lv.id }


toogleHoverClass : Int -> Document msg -> Document msg
toogleHoverClass uid document =
    case document of
        Leaf _ ->
            document

        Node _ [] ->
            document

        Node nv children ->
            Node nv
                (List.map
                    (\c ->
                        if hasUid uid c then
                            toogleClass "hovered" c
                        else
                            c
                    )
                    children
                )


addSelectors :
    { click : Int -> msg
    , dblClick : Int -> msg
    , mouseEnter : Int -> msg
    , mouseLeave : Int -> msg
    }
    -> DocZipper msg
    -> DocZipper msg
addSelectors handlers ({ current, contexts } as dz) =
    let
        selectors id =
            [ StyleElementAttr (Events.onClick (handlers.click id.uid))
            , StyleElementAttr (Events.onDoubleClick (handlers.dblClick id.uid))
            , StyleElementAttr (Events.onMouseEnter (handlers.mouseEnter id.uid))
            , StyleElementAttr (Events.onMouseLeave (handlers.mouseLeave id.uid))
            ]

        addSelector doc =
            case doc of
                Leaf ({ leafContent, id, attrs } as lv) ->
                    Leaf
                        { lv
                            | attrs =
                                selectors id ++ attrs
                        }

                Node ({ nodeLabel, id, attrs } as nv) children ->
                    Node
                        { nv
                            | attrs =
                                selectors id ++ attrs
                        }
                        children
    in
    case toogleClass "selected" current of
        Node nv children ->
            { dz
                | current = Node nv (List.map addSelector children)
            }

        _ ->
            dz



-------------------------------------------------------------------------------


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
                    renderImage winSize id attrs meta

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


renderImage winSize { uid, styleId, classes } attrs { src, caption, size } =
    let
        device =
            classifyDevice winSize

        attrs_ =
            if Set.member "colImg" classes then
                [ width (maximum size.imgWidth fill) ]
                    ++ renderAttrs winSize attrs
            else if Set.member "rowImg" classes then
                [ height (px 85) ]
                    ++ renderAttrs winSize attrs
            else
                [ width (maximum size.imgWidth fill)

                --, height fill
                ]
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
    paragraph (Region.heading level :: renderAttrs winSize attrs) [ text s ]



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
                                                , id = { lId | classes = Set.insert "colImg" id.classes }
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
                    if
                        hasClass "sameHeightImgsRow" document
                            && containsOnly isImage document
                    then
                        renderSameHeightImgRow winSize.width document
                    else
                        Node nv (List.map (responsivePreFormat winSize) children)

                TextColumn ->
                    if device.class == Phone || device.class == Tablet then
                        responsivePreFormat winSize <| Node { nv | nodeLabel = Column } children
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


renderSameHeightImgRow : Int -> Document msg -> Document msg
renderSameHeightImgRow containerWidth document =
    case document of
        Leaf _ ->
            document

        Node id_ children ->
            let
                images =
                    List.foldr
                        (\doc acc ->
                            case doc of
                                Node _ _ ->
                                    acc

                                Leaf lv ->
                                    case lv.leafContent of
                                        Image ({ src, caption, size } as meta) ->
                                            { meta = meta
                                            , id = lv.id
                                            , attrs = lv.attrs
                                            , newWidth = 0
                                            , newHeight = 0
                                            }
                                                :: acc

                                        _ ->
                                            acc
                        )
                        []
                        children

                imgSizes imgs =
                    List.map (\i -> i.meta.size) imgs

                minHeight imgs =
                    imgSizes imgs
                        |> List.map .imgHeight
                        |> List.sort
                        |> List.head
                        |> Maybe.withDefault 0

                imgsScaledToMinHeight =
                    let
                        mh =
                            minHeight images

                        scale { meta, attrs, id } =
                            { meta = meta
                            , id = id
                            , attrs = attrs
                            , newHeight = toFloat mh + 5
                            , newWidth =
                                toFloat mh
                                    * toFloat meta.size.imgWidth
                                    / toFloat meta.size.imgHeight
                            }
                    in
                    List.map scale images

                totalImgWidth =
                    List.foldr (\i n -> i.newWidth + n) 0 imgsScaledToMinHeight

                spacingOffset =
                    if containerWidth > 500 then
                        20
                    else
                        15

                scalingFactor =
                    if
                        toFloat containerWidth
                            < totalImgWidth
                            + toFloat (List.length images)
                            * spacingOffset
                    then
                        toFloat
                            (containerWidth
                                - List.length images
                                * spacingOffset
                            )
                            / totalImgWidth
                    else
                        1

                imgsScaledToFitContainer =
                    List.map
                        (\im ->
                            { im
                                | newWidth =
                                    im.newWidth * scalingFactor
                                , newHeight =
                                    im.newHeight * scalingFactor
                            }
                        )
                        imgsScaledToMinHeight
            in
            Node id_ <|
                List.map
                    (\im ->
                        Leaf
                            { leafContent = Image im.meta
                            , id = im.id
                            , attrs =
                                [ StyleElementAttr <| height (px (floor im.newHeight))
                                , StyleElementAttr <| width (px (floor im.newWidth))
                                ]
                                    ++ im.attrs
                            }
                    )
                    imgsScaledToFitContainer


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
