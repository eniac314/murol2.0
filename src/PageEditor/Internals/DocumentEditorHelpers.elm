module PageEditor.Internals.DocumentEditorHelpers exposing (..)

import Document.Document exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Lazy as Lazy
import Element.Region as Region
import Html exposing (Html)
import Html.Attributes as HtmlAttr
import Http exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import PageTreeEditor.PageTreeEditor as PageTreeEditor
import Set exposing (empty)
import Time exposing (..)


emptyDoc =
    Container
        { attrs = []
        , id = { classes = Set.fromList [], htmlId = Just "mainContainer", docStyleId = Just "root", uid = 0 }
        , containerLabel = DocColumn
        }
        [ Cell
            { cellContent = EmptyCell
            , attrs = []
            , id =
                { classes = Set.fromList []
                , htmlId = Nothing
                , docStyleId = Nothing
                , uid = 1
                }
            }
        ]



----------------------------------------------------------------------
-- Helpers functions to manipulate Documents specific to the editor --
----------------------------------------------------------------------


type EditorPluginResult a
    = EditorPluginQuit
    | EditorPluginData a


type Alignment
    = ARight
    | ACenter
    | ALeft


type EditorPlugin
    = ImagePlugin
    | VideoPlugin
    | TablePlugin
    | CustomElementPlugin
    | TextBlockPlugin
    | NewDocPlugin
    | ContainerEditPlugin
    | BlockLinksPlugin
    | PersistencePlugin
    | PageTreeEditorPlugin PageTreeEditor.Mode
    | FichesPlugin


findAlignment : List DocAttribute -> Alignment
findAlignment attrs =
    let
        helper xs =
            case xs of
                [] ->
                    ACenter

                AlignRight :: _ ->
                    ARight

                AlignLeft :: _ ->
                    ALeft

                y :: ys ->
                    helper ys
    in
        helper attrs


setAligment : Alignment -> List DocAttribute -> List DocAttribute
setAligment a attrs =
    let
        removeOldAlignment acc xs =
            case xs of
                [] ->
                    List.reverse acc

                AlignRight :: xs_ ->
                    removeOldAlignment acc xs_

                AlignLeft :: xs_ ->
                    removeOldAlignment acc xs_

                y :: ys ->
                    removeOldAlignment (y :: acc) ys

        newAlignment =
            case a of
                ACenter ->
                    []

                ARight ->
                    [ AlignRight ]

                ALeft ->
                    [ AlignLeft ]
    in
        newAlignment ++ removeOldAlignment [] attrs



-- NOTE: this function sets a unique id starting at 0 (document root) to each
--       cell and container.
--       Also adds unique css id selector "defaultHtmlID" ++ uid


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


maxUid doc =
    let
        getUid doc_ =
            case doc_ of
                Cell { cellContent, id, attrs } ->
                    id.uid

                Container { containerLabel, id, attrs } _ ->
                    id.uid

        helper acc doc_ =
            case doc of
                Cell { id } ->
                    max id.uid acc

                Container { id } xs ->
                    List.foldr
                        (\d acc_ -> max (getUid d) acc_)
                        (max id.uid acc)
                        xs
    in
        helper 0 doc



---------------
-- new Cells --
---------------


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



--------------------
-- new Containers --
--------------------


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



-----------------
-- Misc helpers--
-----------------


buildYoutubeUrl src videoMeta =
    let
        params =
            [ Maybe.map (\n -> "start=" ++ String.fromInt n) videoMeta.startAt
            , if not videoMeta.frameBorder then
                Just "frameborder=0"
              else
                Nothing
            , if not videoMeta.suggestions then
                Just "rel=0"
              else
                Nothing
            , if not videoMeta.controls then
                Just "controls=0"
              else
                Nothing
            , if not videoMeta.title then
                Just "showinfo=0"
              else
                Nothing
            ]
                |> List.filterMap identity
                |> String.join "&"
                |> (\s ->
                        if s == "" then
                            s
                        else
                            "?" ++ s
                   )
    in
        "https://www.youtube"
            ++ (if videoMeta.privacy then
                    "-nocookie"
                else
                    ""
               )
            ++ ".com/embed/"
            ++ src
            ++ params
