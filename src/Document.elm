module Document exposing (..)

import Array exposing (Array)
import Dict exposing (Dict)
import Element exposing (..)
import Html.Attributes as Attr
import Html.Events exposing (on)
import Json.Decode as Decode
import Set exposing (..)
import StyleSheets exposing (..)


type Document
    = Container ContainerValue (List Document)
    | Cell CellValue


type alias ContainerValue =
    { containerLabel : ContainerLabel
    , id : Id
    , attrs : List DocAttribute
    }


type ContainerLabel
    = DocColumn
    | DocRow
    | TextColumn
    | ResponsiveBloc


type alias CellValue =
    { cellContent : CellContent
    , id : Id
    , attrs : List DocAttribute
    }


type CellContent
    = Image ImageMeta
    | Table TableMeta
    | CustomElement String
    | TextBlock (List TextBlockElement)
    | EmptyCell


type TextBlockElement
    = Paragraph (List DocAttribute) (List TextBlockPrimitive)
    | UList (List DocAttribute) (List Li)
    | TBPrimitive TextBlockPrimitive


type alias Li =
    List TextBlockPrimitive


type TextBlockPrimitive
    = Text (List DocAttribute) String
    | Link (List DocAttribute) LinkMeta
    | Heading (List DocAttribute) ( Int, String )


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
    , mainInterfaceHeight : Int
    , sizesDict :
        Dict Int
            { docWidth : Int
            , docHeight : Int
            }
    , customElems :
        Dict String (Element msg)
    , onLoadMsg : Int -> msg
    , styleSheet : StyleSheet msg
    , zipperHandlers : Maybe (ZipperHandlers msg)
    , editMode : Bool
    , containersBkgColors : Bool
    }


type alias ZipperHandlers msg =
    { containerClickHandler : Int -> msg
    , containerDblClickHandler : Int -> msg
    , neighbourClickHandler : Int -> msg
    , cellClick : msg
    }


type PluginResult a
    = PluginQuit
    | PluginData a


type alias Id =
    { uid : Int
    , docStyleId : Maybe String
    , htmlId : Maybe String
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
    | Bold
    | Italic
    | ZipperAttr Int ZipperEventHandler


type ZipperEventHandler
    = OnContainerClick
    | OnContainerDblClick
    | OnContainerMouseOver
    | OnNeighbourClick
    | OnCellClick


type DocColor
    = DocColor Float Float Float


toSeColor : DocColor -> Color
toSeColor (DocColor r g b) =
    rgb r g b


hasUid : Int -> Document -> Bool
hasUid id document =
    case document of
        Container nv _ ->
            id == nv.id.uid

        Cell lv ->
            id == lv.id.uid


hasClass : String -> Document -> Bool
hasClass class document =
    case document of
        Container nv _ ->
            Set.member class nv.id.classes

        Cell lv ->
            Set.member class lv.id.classes


containsOnly : (Document -> Bool) -> Document -> Bool
containsOnly p document =
    case document of
        Container nv children ->
            List.foldr (\d acc -> p d && acc) True children

        Cell _ ->
            False


isImage : Document -> Bool
isImage document =
    case document of
        Cell lv ->
            case lv.cellContent of
                Image _ ->
                    True

                _ ->
                    False

        Container _ _ ->
            False


isContainer : Document -> Bool
isContainer document =
    case document of
        Container _ _ ->
            True

        _ ->
            False


getUid doc =
    case doc of
        Cell { cellContent, id, attrs } ->
            id.uid

        Container { containerLabel, id, attrs } _ ->
            id.uid


fixUids : Int -> Document -> Document
fixUids nextUid document =
    case document of
        Container ({ id } as nv) [] ->
            Container
                { nv
                    | id =
                        { id
                            | uid = nextUid
                            , htmlId = Just <| "defaultHtmlId" ++ String.fromInt nextUid
                        }
                }
                []

        Container ({ id } as nv) children ->
            Container
                { nv
                    | id =
                        { id
                            | uid = nextUid
                            , htmlId = Just <| "defaultHtmlId" ++ String.fromInt nextUid
                        }
                }
                (List.foldr
                    (\doc ( done, nUid ) -> ( fixUids nUid doc :: done, nUid + docSize doc ))
                    ( [], nextUid + 1 )
                    children
                    |> Tuple.first
                )

        Cell ({ id } as lv) ->
            Cell
                { lv
                    | id =
                        { id
                            | uid = nextUid
                            , htmlId = Just <| "defaultHtmlId" ++ String.fromInt nextUid
                        }
                }


docSize doc =
    case doc of
        Cell _ ->
            1

        Container _ xs ->
            List.foldr (\d acc -> docSize d + acc) 1 xs


getDocStyleId doc =
    case doc of
        Cell cv ->
            cv.id.docStyleId

        Container cv _ ->
            cv.id.docStyleId


setDocStyleId sid doc =
    case doc of
        Cell ({ cellContent, id, attrs } as cv) ->
            Cell
                { cv | id = { id | docStyleId = Just sid } }

        Container ({ containerLabel, id, attrs } as cv) xs ->
            Container
                { cv | id = { id | docStyleId = Just sid } }
                xs


setDocStyleIdIfNone sid doc =
    case doc of
        Cell ({ cellContent, id, attrs } as cv) ->
            case id.docStyleId of
                Nothing ->
                    Cell
                        { cv | id = { id | docStyleId = Just sid } }

                Just _ ->
                    doc

        Container ({ containerLabel, id, attrs } as cv) xs ->
            case id.docStyleId of
                Nothing ->
                    Container
                        { cv | id = { id | docStyleId = Just sid } }
                        xs

                Just _ ->
                    doc


getHtmlId doc =
    case doc of
        Cell cv ->
            cv.id.htmlId

        Container cv _ ->
            cv.id.htmlId


setHtmlId sid doc =
    case doc of
        Cell ({ cellContent, id, attrs } as cv) ->
            Cell
                { cv | id = { id | htmlId = Just sid } }

        Container ({ containerLabel, id, attrs } as cv) xs ->
            Container
                { cv | id = { id | htmlId = Just sid } }
                xs


setHtmlIdIfNone sid doc =
    case doc of
        Cell ({ cellContent, id, attrs } as cv) ->
            case id.htmlId of
                Nothing ->
                    Cell
                        { cv | id = { id | htmlId = Just sid } }

                Just _ ->
                    doc

        Container ({ containerLabel, id, attrs } as cv) xs ->
            case id.htmlId of
                Nothing ->
                    Container
                        { cv | id = { id | htmlId = Just sid } }
                        xs

                Just _ ->
                    doc


setSizeTrackedDocUids : Document -> ( Document, List Int )
setSizeTrackedDocUids document =
    let
        htmlId uid =
            "sizeTracked" ++ String.fromInt uid
    in
    case document of
        Container ({ id, attrs } as nv) children ->
            let
                ( newChildren, newUids ) =
                    List.map setSizeTrackedDocUids children
                        |> List.unzip
                        |> Tuple.mapSecond List.concat
            in
            if hasClass "sameHeightImgsRow" document then
                ( setHtmlId (htmlId id.uid) document
                , id.uid :: newUids
                )
            else
                ( Container nv newChildren
                , newUids
                )

        Cell lv ->
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
        Container nv children ->
            Container { nv | id = newId nv.id } children

        Cell lv ->
            Cell { lv | id = newId lv.id }


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
        Container nv children ->
            Container { nv | id = newId nv.id } children

        Cell lv ->
            Cell { lv | id = newId lv.id }


toogleHoverClass : Int -> Document -> Document
toogleHoverClass uid document =
    case document of
        Cell _ ->
            document

        Container _ [] ->
            document

        Container nv children ->
            Container nv
                (List.map
                    (\c ->
                        if hasUid uid c then
                            toogleClass "hovered" c
                        else
                            c
                    )
                    children
                )


addAttrs : Document -> List DocAttribute -> Document
addAttrs doc newAttrs =
    case doc of
        Cell ({ cellContent, id, attrs } as lv) ->
            Cell
                { lv
                    | attrs =
                        newAttrs ++ attrs
                }

        Container ({ containerLabel, id, attrs } as nv) children ->
            Container
                { nv
                    | attrs =
                        newAttrs ++ attrs
                }
                children


newCell nextUid cellContent =
    Cell
        { cellContent = cellContent
        , id =
            { uid = nextUid
            , docStyleId = Nothing
            , classes = Set.empty
            , htmlId =
                Just ("defaultHtmlId" ++ String.fromInt nextUid)
            }
        , attrs = []
        }


emptyCell nextUid =
    newCell nextUid EmptyCell


newTable nextUid =
    newCell
        nextUid
        (Table
            { style = ""
            , nbrRows = 0
            , nbrCols = 0
            , data = []
            }
        )


newContainer nextUid containerLabel =
    Container
        { containerLabel = containerLabel
        , id =
            { uid = nextUid
            , docStyleId = Nothing
            , classes = Set.empty
            , htmlId =
                Just ("defaultHtmlId" ++ String.fromInt nextUid)
            }
        , attrs = []
        }
        [ emptyCell (nextUid + 1) ]
