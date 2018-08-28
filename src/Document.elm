module Document exposing (..)

import Array exposing (Array)
import Dict exposing (..)
import Element exposing (..)
import Html.Attributes as Attr
import Html.Events exposing (on)
import Json.Decode as Decode
import Set exposing (..)
import StyleSheets exposing (..)


type Document
    = Node NodeValue (List Document)
    | Leaf LeafValue


type NodeLabel
    = Column
    | Row
    | TextColumn
    | ResponsiveBloc


type LeafContent
    = Image ImageMeta
    | Table TableMeta
    | CustomElement String
    | TextBlock (List TextBlockElement)


type TextBlockElement
    = Paragraph (List DocAttribute) (List TextBlockPrimitive)
    | UList (List DocAttribute) (List Li)
    | TBPrimitive TextBlockPrimitive


type alias Li =
    List TextBlockPrimitive


type TextBlockPrimitive
    = Text (List DocAttribute) String
    | Link (List DocAttribute) LinkMeta
      --| Bold String
    | Heading (List DocAttribute) ( Int, String )


type alias LeafValue =
    { leafContent : LeafContent
    , id : Id
    , attrs : List DocAttribute
    }


type alias NodeValue =
    { nodeLabel : NodeLabel
    , id : Id
    , attrs : List DocAttribute
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
    , styleSheet : StyleSheet msg
    }


type alias Id =
    { uid : Int
    , styleId : Maybe String
    , classes : Set String
    }


type DocAttribute
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
    | HtmlId String
    | Bold
    | Italic


type DocColor
    = DocColor Float Float Float


toSeColor : DocColor -> Color
toSeColor (DocColor r g b) =
    rgb r g b


hasUid : Int -> Document -> Bool
hasUid id document =
    case document of
        Node nv _ ->
            id == nv.id.uid

        Leaf lv ->
            id == lv.id.uid


hasClass : String -> Document -> Bool
hasClass class document =
    case document of
        Node nv _ ->
            Set.member class nv.id.classes

        Leaf lv ->
            Set.member class lv.id.classes


containsOnly : (Document -> Bool) -> Document -> Bool
containsOnly p document =
    case document of
        Node nv children ->
            List.foldr (\d acc -> p d && acc) True children

        Leaf _ ->
            False


isImage : Document -> Bool
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


fixUids : Int -> Document -> Document
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


setSizeTrackedDocUids : Document -> ( Document, List Int )
setSizeTrackedDocUids document =
    let
        htmlId uid =
            HtmlId ("sizeTracked" ++ String.fromInt uid)
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


addClass : String -> Document -> Document
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


toogleClass : String -> Document -> Document
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


toogleHoverClass : Int -> Document -> Document
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
