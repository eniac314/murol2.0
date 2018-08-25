module Editor exposing (..)

import Browser exposing (document)
import Browser.Dom as Dom
import Browser.Events exposing (onResize)
import Dict exposing (..)
import Document exposing (..)
import DocumentSerializer exposing (..)
import DocumentView exposing (..)
import DocumentZipper exposing (..)
import Element exposing (layout)
import Element.Font as Font
import Element.Lazy exposing (lazy)
import Html exposing (div, text)
import SampleDocs exposing (..)
import StyleSheets exposing (..)
import Table exposing (..)
import Task exposing (perform)
import Time exposing (..)


main : Program () Model Msg
main =
    Browser.document
        { init = init sampleDoc1
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type Msg
    = CurrentViewport Dom.Viewport
    | CurrentViewportOf Int (Result Dom.Error Dom.Viewport)
    | WinResize Int Int
    | RefreshSizes
    | NoOp
    | SelectDoc Int
    | HoverDoc Int


type alias Model =
    { winSize : WinSize
    , selectedNode : Maybe Int
    , hoveredNode : Maybe Int
    , document : DocZipper Msg
    , currentNodeBackup : Document Msg
    , hasRefreshed : Bool
    }


init doc flags =
    let
        ( doc_, idsToTrack ) =
            setSizeTrackedDocUids doc

        winSize =
            { width = 1920
            , height = 1080
            , sizesDict =
                --Dict.empty
                Dict.fromList
                    (List.map
                        (\uid -> ( uid, { docWidth = 0, docHeight = 0 } ))
                        idsToTrack
                    )
            }
    in
    ( { winSize = winSize
      , selectedNode = Nothing
      , document =
            doc_
                |> initZip
                |> addSelectors handlers
      , currentNodeBackup = doc_
      , hoveredNode = Nothing
      , hasRefreshed = False
      }
    , Cmd.batch
        [ Task.perform CurrentViewport Dom.getViewport
        ]
    )


subscriptions model =
    Sub.batch
        [ onResize WinResize

        --, Time.every 500 (\_ -> RefreshSizes)
        --, if not model.hasRefreshed then
        --    Browser.Events.onAnimationFrame (\_ -> RefreshSizes)
        --  else
        --    Sub.none
        ]


update msg model =
    case msg of
        WinResize width height ->
            let
                ws =
                    model.winSize
            in
            ( { model | winSize = { ws | width = width, height = height } }
            , Cmd.batch [ updateSizes model.winSize ]
            )

        CurrentViewport vp ->
            let
                ws =
                    model.winSize
            in
            ( { model
                | winSize =
                    { ws
                        | width = round vp.viewport.width
                        , height = round vp.viewport.height
                    }
              }
            , Cmd.none
            )

        CurrentViewportOf uid res ->
            case res of
                Ok { viewport } ->
                    let
                        currentwinSize =
                            model.winSize

                        newSizesDict =
                            Dict.insert uid
                                { docWidth = round viewport.width
                                , docHeight = round viewport.height
                                }
                                currentwinSize.sizesDict
                    in
                    ( { model
                        | winSize =
                            { currentwinSize
                                | sizesDict = newSizesDict
                            }
                        , hasRefreshed = newSizesDict == currentwinSize.sizesDict
                      }
                    , Cmd.none
                    )

                Err (Dom.NotFound s) ->
                    ( model, Cmd.none )

        HoverDoc id ->
            ( { model
                | document =
                    extractDoc model.document
                        |> toogleHoverClass id
                        |> (\nd -> updateCurrent nd model.document)
              }
            , Cmd.none
            )

        SelectDoc id ->
            case
                zipDown (hasUid id)
                    (updateCurrent model.currentNodeBackup
                        model.document
                    )
            of
                Nothing ->
                    ( model, Cmd.none )

                Just newDocument ->
                    ( { model
                        | currentNodeBackup = extractDoc newDocument
                        , document = addSelectors handlers newDocument
                        , selectedNode = Just id
                      }
                    , Cmd.none
                    )

        RefreshSizes ->
            ( model
            , updateSizes model.winSize
            )

        NoOp ->
            ( model, Cmd.none )


handlers =
    { click = SelectDoc
    , dblClick = \_ -> NoOp
    , mouseEnter = HoverDoc
    , mouseLeave = HoverDoc
    }


view model =
    { title = "editor"
    , body =
        [ layout []
            (model.document
                |> rewind
                |> extractDoc
                |> responsivePreFormat model.winSize
                |> packStyleSheet defaulStyleSheet
                |> renderDoc model.winSize (\_ -> RefreshSizes)
             --|> (\doc -> lazy (\ws -> renderDoc ws doc) model.winSize)
            )

        --, Html.text <| Debug.toString model.winSize
        ]
    }


updateSizes : WinSize -> Cmd Msg
updateSizes { sizesDict } =
    let
        cmd uid id =
            Task.attempt (CurrentViewportOf uid) (Dom.getViewportOf id)
    in
    Dict.keys sizesDict
        |> List.map (\uid -> cmd uid ("sizeTracked" ++ String.fromInt uid))
        |> Cmd.batch
