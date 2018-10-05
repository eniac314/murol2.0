module DocumentEditorHelpers exposing (..)

import Document exposing (..)
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
import Set exposing (empty)


----------------------------------------------------------------------
-- Helpers functions to manipulate Documents specific to the editor --
----------------------------------------------------------------------


type PluginResult a
    = PluginQuit
    | PluginData a


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
    | PersistencePlugin
    | FilesysDebug
    | AuthPlugin


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


buttonStyle isActive =
    [ Border.rounded 5
    , Font.center
    , centerY
    , padding 5
    , focused [ Border.glow (rgb 1 1 1) 0 ]
    ]
        ++ (if isActive then
                [ Background.color (rgb 0.9 0.9 0.9)
                , mouseOver [ Font.color (rgb 255 255 255) ]
                , Border.width 1
                , Border.color (rgb 0.9 0.9 0.9)
                ]
            else
                [ Background.color (rgb 0.95 0.95 0.95)
                , Font.color (rgb 0.7 0.7 0.7)
                , htmlAttribute <| HtmlAttr.style "cursor" "default"
                , Border.width 1
                , Border.color (rgb 0.95 0.95 0.95)
                ]
           )


toogleButtonStyle isPressed isActive =
    [ Border.rounded 5
    , Font.center
    , centerY
    , padding 5
    , focused [ Border.glow (rgb 1 1 1) 0 ]
    ]
        ++ (if isActive then
                [ Background.color (rgb 0.9 0.9 0.9)
                , Border.width 1
                , Border.color (rgb 0.9 0.9 0.9)
                , mouseOver
                    [ Font.color (rgb 0.3 0.3 0.3)
                    ]
                ]
                    ++ (if isPressed then
                            []
                        else
                            [ Background.color (rgb 1 1 1)
                            , Border.width 1
                            , Border.color (rgb 0.9 0.9 0.9)
                            ]
                       )
            else
                [ Background.color (rgb 0.95 0.95 0.95)
                , Font.color (rgb 0.7 0.7 0.7)
                , htmlAttribute <| HtmlAttr.style "cursor" "default"
                , Border.width 1
                , Border.color (rgb 0.95 0.95 0.95)
                ]
           )


textInputStyle =
    [ width (px 250)
    , paddingXY 5 5
    , spacing 15
    , focused [ Border.glow (rgb 1 1 1) 0 ]
    ]


property name value =
    htmlAttribute <| HtmlAttr.property name value


noAttr =
    htmlAttribute <| HtmlAttr.class ""


noHtmlAttr =
    HtmlAttr.class ""


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
