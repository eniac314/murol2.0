module Document exposing (..)

import Array exposing (Array)
import Dict exposing (..)
import Element exposing (..)
import Html.Attributes as Attr
import Html.Events exposing (on)
import Json.Decode as Decode
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



--| Table TableMeta


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


type alias TableMeta =
    { style : String
    , nbrRow : Int
    , nbrCol : Int
    , data : List (Array String)
    }


type alias WinSize =
    { width : Int
    , height : Int
    , sizesDict :
        Dict Int
            { docWidth : Int
            , docHeight : Int
            }
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
    | BackgroundColor DocColor
    | Width Int
    | Height Int
    | Border
    | FontColor DocColor
    | FontSize Int
    | FontAlignLeft
    | FontAlignRight
    | Center
    | Justify
    | Bold
    | Italic
    | StyleElementAttr (Attribute msg)


type DocColor
    = DocColor Float Float Float


toSeColor : DocColor -> Color
toSeColor (DocColor r g b) =
    rgb r g b


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


setSizeTrackedDocUids : Document msg -> ( Document msg, List Int )
setSizeTrackedDocUids document =
    let
        htmlId uid =
            Attr.id ("sizeTracked" ++ String.fromInt uid)
                |> htmlAttribute
                |> StyleElementAttr
    in
    case document of
        Node ({ id, attrs } as nv) children ->
            let
                ( newChildren, newUids ) =
                    List.map setSizeTrackedDocUids children
                        |> List.unzip
                        |> Tuple.mapSecond List.concat
            in
            if hasClass "sameHeightImgsRow" document then
                ( Node { nv | attrs = htmlId id.uid :: nv.attrs } newChildren
                , id.uid :: newUids
                )
            else
                ( Node nv newChildren
                , newUids
                )

        Leaf lv ->
            ( document, [] )


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
                        case Dict.get id.uid winSize.sizesDict of
                            Just { docWidth, docHeight } ->
                                renderSameHeightImgRow docWidth document

                            Nothing ->
                                renderSameHeightImgRow winSize.width document
                        --Node nv (List.map (responsivePreFormat winSize) children)
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
