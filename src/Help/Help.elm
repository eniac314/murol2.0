module Help.Help exposing (Model, Msg, externalUpdate, init, subscriptions, update, view)

import Browser.Dom as Dom
import Browser.Events exposing (onAnimationFrame)
import Dict exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Html
import Html.Attributes as HtmlAttr
import Html.Events as HtmlEvents exposing (on)
import Http exposing (Error)
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (noAttr)
import Json.Decode as Decode exposing (succeed)
import Lazy.Tree as Tree exposing (Tree(..))
import Lazy.Tree.Zipper as Zipper exposing (Zipper)
import Set
import Task


type alias Model msg =
    { index : Maybe (Zipper ( Bool, IndexEntry ))
    , pages : Dict String HelpPage
    , currentPage : Id
    , scrollOnNextFrame : Bool
    , loaded : Set.Set String
    , externalMsg : Msg -> msg
    }


type Msg
    = Toogle (Zipper ( Bool, IndexEntry ))
    | SetCurrentPage Bool Id
    | Scroll
    | GotPages (Result Http.Error ( List HelpPage, List IndexEntry ))
    | ImgLoaded String
    | NoOp


type alias IndexEntry =
    { id : Id
    , title : String
    , parent : Maybe Id
    }


type alias HelpPage =
    { id : String
    , title : String
    , content : Content
    }


type alias Id =
    ( Int, String )


type alias Content =
    List ( Int, String )


init externalMsg =
    { index = Nothing
    , pages = Dict.empty
    , currentPage = ( 0, "root" )
    , externalMsg = externalMsg
    , loaded = Set.empty
    , scrollOnNextFrame = False
    }
        |> update () (GotPages (Ok ( helpPagesData, indexEntriesData )))


subscriptions model =
    [ if model.scrollOnNextFrame && model.loaded == Set.empty then
        onAnimationFrame (\_ -> Scroll)

      else
        Sub.none
    ]
        |> Sub.batch
        |> Sub.map model.externalMsg



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

        SetCurrentPage external id ->
            let
                content =
                    Dict.get (Tuple.second id) model.pages
                        |> Maybe.map .content
                        |> Maybe.withDefault []
            in
            ( { model
                | currentPage = id
                , scrollOnNextFrame = True
                , loaded =
                    if (Tuple.second id == Tuple.second model.currentPage) && not external then
                        Set.empty

                    else
                        List.map Tuple.second content
                            |> Set.fromList
              }
            , Cmd.none
            )

        Scroll ->
            let
                ( anchor, id ) =
                    model.currentPage
            in
            ( { model | scrollOnNextFrame = False }
            , Cmd.map model.externalMsg <| scrollTo (id ++ " " ++ String.fromInt anchor)
            )

        GotPages res ->
            case res of
                Ok ( pagesList, indexEntries ) ->
                    let
                        pages =
                            List.map (\p -> ( p.id, p )) pagesList
                                |> Dict.fromList

                        root =
                            List.filter (\e -> e.id == ( 0, "root" )) indexEntries
                                |> List.head

                        index =
                            List.map (\p -> ( True, p )) (List.filter (\e -> e.id /= ( 0, "root" )) indexEntries)
                                |> Tree.fromList
                                    (\mbParent ( _, page ) ->
                                        Maybe.map (.id << Tuple.second) mbParent == page.parent
                                    )
                                |> (\forest -> Maybe.map (\r -> Tree ( True, r ) forest) root)
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

        ImgLoaded src ->
            ( { model | loaded = Set.remove src model.loaded }, Cmd.none )

        NoOp ->
            ( model, Cmd.none )


externalUpdate id model =
    update () (SetCurrentPage True id) model



--goToHelp : msg -> String -> Cmd msg
--goToHelp handler id =
-------------------------------------------------------------------------------
----------
-- View --
----------


type alias ViewConfig a =
    { a
        | maxWidth : Int
        , maxHeight : Int
    }


view : ViewConfig a -> Model msg -> Element msg
view config model =
    Element.map model.externalMsg <|
        row
            [ height fill
            , width fill
            , clip
            , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
            , height fill
            ]
            [ leftPanelView config model
            , mainView config model
            ]


leftPanelView config model =
    column
        [ spacing 15
        , Font.size 16
        , Font.family
            []
        , alignTop
        , padding 15
        , height (maximum config.maxHeight fill)
        ]
        [ el
            [ spacing 15
            , scrollbars
            , width (minimum 400 (maximum 500 fill))
            , height fill
            , alignTop
            , Border.solid
            , Border.widthEach
                { top = 0
                , bottom = 0
                , left = 0
                , right = 2
                }
            , Border.color (rgb 0.8 0.8 0.8)
            ]
            (case model.index of
                Just zipper ->
                    column [] [ indexView model 0 (Zipper.root zipper) ]

                Nothing ->
                    Element.none
            )
        ]


indexView : Model msg -> Int -> Zipper ( Bool, IndexEntry ) -> Element Msg
indexView model offset zipper =
    let
        ( isOpen, entry ) =
            Zipper.current zipper
    in
    Element.column
        []
        [ row
            [ spacing 7
            ]
            [ if not (Zipper.isEmpty zipper) then
                el
                    [ Events.onClick <|
                        Toogle zipper
                    , pointer
                    ]
                    (text <|
                        if isOpen then
                            "-"

                        else
                            "+"
                    )

              else
                text " "
            , el
                [ pointer
                , Events.onClick <| SetCurrentPage False entry.id
                , if entry.id == model.currentPage then
                    Font.color (rgb 0 0 1)

                  else
                    noAttr
                ]
                (text <| entry.title)
            ]
        , column
            [ paddingXY 10 0 ]
            (if isOpen then
                Zipper.openAll zipper
                    |> List.map (indexView model (offset + 1))

             else
                []
            )
        ]


mainView config model =
    let
        contentView ( anchor, url ) =
            --el
            --    [ htmlAttribute <| HtmlAttr.id (currentId ++ " " ++ String.fromInt anchor)
            --    , centerX
            --    , width (px 800)
            --    , height (px 600)
            --    ]
            --    (text url)
            column
                []
                [ image
                    [ htmlAttribute <| HtmlAttr.id (currentId ++ " " ++ String.fromInt anchor)
                    , centerX
                    ]
                    { src = url
                    , description = ""
                    }
                , html <|
                    Html.img
                        [ HtmlAttr.hidden True
                        , HtmlEvents.on "load" (Decode.succeed (ImgLoaded url))
                        , HtmlAttr.src url
                        ]
                        []
                ]

        ( currentAnchor, currentId ) =
            model.currentPage
    in
    column
        [ width fill
        , height fill
        , scrollbarY
        , htmlAttribute <| HtmlAttr.id "MainPanel"
        ]
        [ el
            [ centerX
            , padding 15
            , htmlAttribute <| HtmlAttr.id currentId
            ]
            (Dict.get currentId model.pages
                |> Maybe.map .title
                |> Maybe.withDefault ""
                |> text
            )
        , column
            [ spacing 15
            , htmlAttribute <| HtmlAttr.id "MainContent"
            ]
            (Dict.get currentId model.pages
                |> Maybe.map .content
                |> Maybe.withDefault []
                |> List.map contentView
            )
        ]



---------------------
-- Helper functions--
---------------------


scrollTo : String -> Cmd Msg
scrollTo destId =
    --Dom.getElement
    --    destId
    --    |> Task.andThen
    --        (\el ->
    --            let
    --                r =
    --                    Debug.log "" el
    --            in
    --            Dom.setViewportOf "MainPanel"
    --                0
    --                (el.element.y - 50)
    --        )
    --    |> Task.attempt (\_ -> NoOp)
    Dom.getElement "MainContent"
        |> Task.andThen
            (\mainContInfo ->
                Dom.getElement
                    destId
                    |> Task.andThen
                        (\el ->
                            Dom.setViewportOf "MainPanel"
                                0
                                (el.element.y
                                    - mainContInfo.element.y
                                    - 50
                                )
                        )
            )
        |> Task.attempt (\_ -> NoOp)



-------------------------------------------------------------------------------


helpPagesData =
    [ { id = "root"
      , title = "Notice éditeur murol.fr"
      , content =
            [ ( 0, "images/notice/Diapositive1.JPG" )
            ]
      }
    , { id = "ae7aa3c8-b706-4cb7-948b-7038313b2f0c"
      , title = "Introduction"
      , content =
            [ ( 1, "images/notice/Diapositive2.JPG" )
            , ( 2, "images/notice/Diapositive3.JPG" )
            , ( 3, "images/notice/Diapositive4.JPG" )
            ]
      }
    ]


indexEntriesData =
    [ { id = ( 0, "root" )
      , title = "Notice éditeur murol.fr"
      , parent = Nothing
      }
    , { id = ( 0, "ae7aa3c8-b706-4cb7-948b-7038313b2f0c" )
      , title = "Introduction"
      , parent = Nothing
      }
    , { id = ( 1, "ae7aa3c8-b706-4cb7-948b-7038313b2f0c" )
      , title = "Adresse d'accès à l'éditeur"
      , parent = Just ( 0, "ae7aa3c8-b706-4cb7-948b-7038313b2f0c" )
      }
    , { id = ( 2, "ae7aa3c8-b706-4cb7-948b-7038313b2f0c" )
      , title = "Identification"
      , parent = Just ( 0, "ae7aa3c8-b706-4cb7-948b-7038313b2f0c" )
      }
    , { id = ( 3, "ae7aa3c8-b706-4cb7-948b-7038313b2f0c" )
      , title = "Chargement"
      , parent = Just ( 0, "ae7aa3c8-b706-4cb7-948b-7038313b2f0c" )
      }
    ]
