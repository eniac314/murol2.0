module Editor exposing (..)

import Browser exposing (document)
import Browser.Dom as Dom
import Browser.Events exposing (onResize)
import Dict exposing (..)
import Document exposing (..)
import Element exposing (layout)
import Element.Font as Font
import Html exposing (div, text)
import SampleDocs exposing (..)
import StyleSheets exposing (..)
import Task exposing (perform)


main : Program () Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type Msg
    = CurrentViewport Dom.Viewport
    | WinResize Int Int
    | NoOp
    | SelectDoc Int
    | HoverDoc Int


type alias Model =
    { winSize : WinSize
    , selectedNode : Maybe Int
    , hoveredNode : Maybe Int
    , document : DocZipper Msg
    , currentNodeBackup : Document Msg
    }


init flags =
    ( { winSize = { width = 1920, height = 1080 }
      , selectedNode = Nothing
      , document =
            sampleDoc1
                |> initZip
                |> addSelectors handlers
      , currentNodeBackup = sampleDoc1
      , hoveredNode = Nothing
      }
    , Cmd.batch
        [ Task.perform CurrentViewport Dom.getViewport ]
    )


update msg model =
    case msg of
        WinResize width height ->
            let
                ws =
                    model.winSize
            in
            ( { model | winSize = { ws | width = width, height = height } }, Cmd.none )

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

        NoOp ->
            ( model, Cmd.none )


handlers =
    { click = SelectDoc
    , dblClick = \_ -> NoOp
    , mouseEnter = HoverDoc
    , mouseLeave = HoverDoc
    }


subscriptions model =
    Sub.batch [ onResize WinResize ]


view model =
    { title = "editor"
    , body =
        [ layout []
            (model.document
                |> rewind
                |> extractDoc
                |> responsivePreFormat model.winSize
                |> packStyleSheet defaulStyleSheet
                |> renderDoc model.winSize
            )
        , Html.text <| Debug.toString model.selectedNode
        ]
    }
