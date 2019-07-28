module Help.Help exposing (Model)

import Dict exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Http exposing (Error)
import Internals.CommonHelpers exposing (..)
import Lazy.Tree as Tree exposing (Tree(..))
import Lazy.Tree.Zipper as Zipper exposing (Zipper)


type alias Model msg =
    { index : Maybe (Zipper ( Bool, IndexEntry ))
    , pages : Maybe (Dict String HelpPage)
    , externalMsg : Msg -> msg
    }


type Msg
    = Toogle (Zipper ( Bool, IndexEntry ))
    | GotPages (Result Http.Error ( List HelpPage, List IndexEntry ))
    | NoOp


type alias IndexEntry =
    { id : String
    , title : String
    , parent : Maybe String
    }


type alias HelpPage =
    { id : String
    , title : String
    , content : Content
    }


type alias Content =
    String


init externalMsg =
    { index = Nothing
    , pages = Nothing
    , externalMsg = externalMsg
    }



-------------------------------------------------------------------------------
------------
-- Update --
------------


update : config -> Msg -> Model msg -> ( Model msg, Cmd msg )
update config msg model =
    case msg of
        Toogle zipper ->
            ( { model
                | index =
                    Just <|
                        Zipper.updateItem
                            (\( s, i ) -> ( not s, i ))
                            zipper
              }
            , Cmd.none
            )

        GotPages res ->
            case res of
                Ok ( pagesList, indexEntries ) ->
                    let
                        pages =
                            List.map (\p -> ( p.id, p )) pagesList
                                |> Dict.fromList
                                |> Just

                        root =
                            List.filter (\e -> e.id == "root") indexEntries
                                |> List.head

                        index =
                            List.map (\p -> ( False, p )) indexEntries
                                |> Tree.fromList
                                    (\mbParent ( _, page ) ->
                                        Maybe.map (.id << Tuple.second) mbParent == page.parent
                                    )
                                |> (\forest -> Maybe.map (\r -> Tree ( False, r ) forest) root)
                                |> Maybe.map Zipper.fromTree
                    in
                    ( { model
                        | pages = pages
                        , index = index
                      }
                    , Cmd.none
                    )

                Err e ->
                    ( model, Cmd.none )

        NoOp ->
            ( model, Cmd.none )



-------------------------------------------------------------------------------
----------
-- View --
----------


type alias ViewConfig a =
    { a | maxWidth : Int }


view : ViewConfig a -> Model msg -> Element msg
view config model =
    Element.none


indexView : Int -> Zipper ( Bool, IndexEntry ) -> Element Msg
indexView offset zipper =
    let
        ( isOpen, entry ) =
            Zipper.current zipper
    in
    Element.column
        [ Events.onClick <| Toogle zipper
        , pointer
        ]
        [ el
            []
            (text <|
                if isOpen then
                    "-"

                else
                    "+"
            )
        , column
            []
            (if isOpen then
                Zipper.openAll zipper
                    |> List.map (indexView (offset + 1))

             else
                []
            )
        ]
