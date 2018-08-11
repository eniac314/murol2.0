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

        --, onUrlRequest = \urlReq -> Debug.todo ""
        --, onUrlChange = \url -> Debug.todo ""
        }


type Msg
    = CurrentViewport Dom.Viewport
    | WinResize Int Int
    | NoOp Never
    | SelectNode Int


type alias Model =
    { winSize : WinSize
    , selectedNode : Maybe Int
    , document : DocZipper
    }


init flags =
    ( { winSize = { width = 1920, height = 1080 }
      , selectedNode = Nothing
      , document =
            sampleDoc1
                |> docToDocZip
                |> initZip
      }
    , Cmd.batch
        [ Task.perform CurrentViewport Dom.getViewport ]
    )


update msg model =
    case msg of
        WinResize width height ->
            ( { model | winSize = { width = width, height = height } }, Cmd.none )

        CurrentViewport vp ->
            ( { model
                | winSize =
                    { width = round vp.viewport.width
                    , height = round vp.viewport.height
                    }
              }
            , Cmd.none
            )

        SelectNode id ->
            ( { model | selectedNode = Just id }
            , Cmd.none
            )

        NoOp _ ->
            ( model, Cmd.none )


subscriptions model =
    Sub.batch [ onResize WinResize ]


view model =
    { title = "editor"
    , body =
        [ --layout []
          --    (responsivePreFormat model.winSize sampleDoc1
          --        |> packStyleSheet defaulStyleSheet
          --        |> renderEditableDoc model.winSize SelectNode NoOp
          --    )
          layout []
            (responsivePreFormat model.winSize sampleDoc1
                |> packStyleSheet defaulStyleSheet
                |> renderDoc model.winSize
            )
            |> Html.map NoOp
        , Html.text <| Debug.toString model.selectedNode
        ]
    }
