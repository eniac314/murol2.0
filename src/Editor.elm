module Editor exposing (..)

import Browser exposing (document)
import Browser.Dom as Dom
import Browser.Events exposing (onResize)
import Dict exposing (..)
import Document exposing (..)
import DocumentResponsive exposing (..)
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
    { config : Config Msg
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

        config =
            { width = 1920
            , height = 1080
            , sizesDict =
                --Dict.empty
                Dict.fromList
                    (List.map
                        (\uid -> ( uid, { docWidth = 0, docHeight = 0 } ))
                        idsToTrack
                    )
            , customElems = Dict.empty
            }
    in
    ( { config = config
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
        ]


update msg model =
    case msg of
        WinResize width height ->
            let
                ws =
                    model.config
            in
            ( { model | config = { ws | width = width, height = height } }
            , Cmd.batch [ updateSizes model.config ]
            )

        CurrentViewport vp ->
            let
                ws =
                    model.config
            in
            ( { model
                | config =
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
                        currentConfig =
                            model.config

                        newSizesDict =
                            Dict.insert uid
                                { docWidth = round viewport.width
                                , docHeight = round viewport.height
                                }
                                currentConfig.sizesDict
                    in
                    ( { model
                        | config =
                            { currentConfig
                                | sizesDict = newSizesDict
                            }
                        , hasRefreshed = newSizesDict == currentConfig.sizesDict
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
            , updateSizes model.config
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
                |> responsivePreFormat model.config
                |> packStyleSheet defaulStyleSheet
                |> renderDoc model.config (\_ -> RefreshSizes)
             --|> (\doc -> lazy (\ws -> renderDoc ws doc) model.winSize)
            )

        --, Html.text <| Debug.toString model.winSize
        ]
    }


updateSizes : Config Msg -> Cmd Msg
updateSizes { sizesDict } =
    let
        cmd uid id =
            Task.attempt (CurrentViewportOf uid) (Dom.getViewportOf id)
    in
    Dict.keys sizesDict
        |> List.map (\uid -> cmd uid ("sizeTracked" ++ String.fromInt uid))
        |> Cmd.batch
