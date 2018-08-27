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
    | Table TableMeta
    | CustomElement String



--    | TextBlock (List TextBlockElement)
--type TextBlockElement
--    = TBParagraph (List TextBlockPrimitive)
--    | UList (List Li)
--    | TextBlockPrimitive
--type alias Li =
--    List TextBlockPrimitive
--type TextBlockPrimitive
--    = Text String
--    | Link LinkMeta
--    | Bold String


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
    , nbrRows : Int
    , nbrCols : Int
    , data : List (Array String)
    }


type alias Config msg =
    { width : Int
    , height : Int
    , sizesDict :
        Dict Int
            { docWidth : Int
            , docHeight : Int
            }
    , customElems :
        Dict String (Element msg)
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
