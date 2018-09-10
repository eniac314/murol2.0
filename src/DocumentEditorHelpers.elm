module DocumentEditorHelpers exposing (..)

import Document exposing (..)
import Set exposing (empty)


----------------------------------------------------------------------
-- Helpers functions to manipulate Documents specific to the editor --
----------------------------------------------------------------------


type PluginResult a
    = PluginQuit
    | PluginData a



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
