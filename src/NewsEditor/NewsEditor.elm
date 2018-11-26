module NewsEditor.NewsEditor exposing (..)

import Auth.AuthPlugin exposing (LogInfo(..), cmdIfLogged)
import Dict exposing (..)
import Document.Document exposing (..)
import Document.Json.DocumentDecoder exposing (decodeNews)
import Document.Json.DocumentSerializer exposing (encodeNews)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events exposing (..)
import Element.Font as Font
import Element.Input as Input
import Element.Lazy exposing (lazy)
import FileExplorer.FileExplorer as FileExplorer
import Html exposing (map)
import Html.Attributes as HtmlAttr
import Http exposing (..)
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.ToolHelpers exposing (..)
import Json.Decode as D
import Json.Encode as E
import PageEditor.EditorPlugins.TextBlockPlugin as TextBlockPlugin
import PageEditor.Internals.DocumentEditorHelpers exposing (..)
import Random exposing (..)
import Task exposing (..)
import Time exposing (..)
import UUID exposing (..)


type alias Model msg =
    { news : Dict String News
    , buffer : Maybe News
    , textBlockPlugin : TextBlockPlugin.Model msg
    , seed : Maybe Random.Seed
    , currentTime : Posix
    , newsEditorMode : NewsEditorMode
    , loadingStatus : ToolLoadingStatus
    , externalMsg : Msg -> msg
    }


type NewsEditorMode
    = NewsSelector
    | NewsEditor


init : (Msg -> msg) -> ( Model msg, Cmd msg )
init externalMsg =
    let
        ( newTextBlockPlugin, textBlockPluginCmds ) =
            TextBlockPlugin.init [] Nothing (externalMsg << TextBlockPluginMsg)
    in
    ( { news = Dict.empty
      , buffer = Nothing
      , textBlockPlugin = newTextBlockPlugin
      , seed = Nothing
      , currentTime = millisToPosix 0
      , newsEditorMode = NewsSelector
      , loadingStatus = ToolLoadingWaiting
      , externalMsg = externalMsg
      }
    , textBlockPluginCmds
    )


load : Model msg -> LogInfo -> Cmd msg
load model logInfo =
    case logInfo of
        LoggedIn { sessionId } ->
            Cmd.map model.externalMsg <|
                Cmd.batch
                    [ Task.perform SetTimeAndInitSeed Time.now
                    , getAllTheNews sessionId
                    ]

        LoggedOut ->
            Cmd.none


loadingStatus model =
    model.loadingStatus


loadingView model =
    toolLoadingView "Chargement des actualités: "
        { loadingStatus = loadingStatus model }


type Msg
    = LoadNews (Result Http.Error (Dict String News))
    | SelectNews String
    | SetTitle String
    | EditContent
    | ConfirmContent Document
    | OpenPicPicker
    | ClosePicPicker
    | ConfirmPic Pic
    | SaveNews
    | NewsSaved (Result Http.Error Bool)
    | DeleteNews
    | TextBlockPluginMsg TextBlockPlugin.Msg
    | SetTimeAndInitSeed Time.Posix
    | NoOp



-------------------------------------------------------------------------------
------------
-- Update --
------------


update :
    { a
        | logInfo : LogInfo
        , zone : Zone
    }
    -> Msg
    -> Model msg
    -> ( Model msg, Cmd msg )
update config msg model =
    let
        ( newModel, cmds ) =
            internalUpdate config msg model
    in
    ( newModel, Cmd.map model.externalMsg cmds )


internalUpdate :
    { a
        | logInfo : LogInfo
        , zone : Zone
    }
    -> Msg
    -> Model msg
    -> ( Model msg, Cmd Msg )
internalUpdate config msg model =
    case msg of
        LoadNews res ->
            case res of
                Ok newsDict ->
                    ( { model
                        | news = newsDict
                        , loadingStatus = ToolLoadingSuccess
                      }
                    , Cmd.none
                    )

                Err e ->
                    ( { model
                        | loadingStatus = ToolLoadingFailure ""
                      }
                    , Cmd.none
                    )

        SelectNews id ->
            ( { model
                | buffer = Dict.get id model.news
              }
            , Cmd.none
            )

        SetTitle title ->
            let
                baseNews =
                    model.buffer
                        |> Maybe.withDefault emptyNews

                newBuffer =
                    { baseNews | title = title }
            in
            ( { model | buffer = Just newBuffer }, Cmd.none )

        EditContent ->
            ( model, Cmd.none )

        ConfirmContent doc ->
            ( model, Cmd.none )

        OpenPicPicker ->
            ( model, Cmd.none )

        ClosePicPicker ->
            ( model, Cmd.none )

        ConfirmPic pic ->
            ( model, Cmd.none )

        SaveNews ->
            case ( model.buffer, config.logInfo ) of
                ( Just news, LoggedIn { sessionId } ) ->
                    ( model
                    , Task.attempt NewsSaved <|
                        (Time.now
                            |> Task.andThen
                                (\t ->
                                    setNews
                                        t
                                        news
                                        sessionId
                                )
                        )
                    )

                _ ->
                    ( model, Cmd.none )

        NewsSaved res ->
            ( model, Cmd.none )

        DeleteNews ->
            ( model, Cmd.none )

        TextBlockPluginMsg textBlockMsg ->
            ( model, Cmd.none )

        SetTimeAndInitSeed t ->
            ( { model
                | currentTime = t
                , seed = Just <| initialSeed (posixToMillis t)
              }
            , Cmd.none
            )

        NoOp ->
            ( model, Cmd.none )



-------------------------------------------------------------------------------
----------
-- View --
----------


view :
    { config
        | maxHeight : Int
        , zone : Time.Zone
        , fileExplorer : FileExplorer.Model msg
        , logInfo : LogInfo
    }
    -> Model msg
    -> Element msg
view config model =
    column
        [ padding 15
        , spacing 15
        , width fill
        , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
        , clip
        , width fill
        , height (maximum config.maxHeight fill)
        ]
        [ text "todo!"
        ]



-------------------------------------------------------------------------------
-----------------
-- Json / Http --
-----------------


getNews : Int -> Cmd Msg
getNews currentTime =
    let
        body =
            E.object
                [ ( "currentTime"
                  , E.int currentTime
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "getNews.php"
        , body = body
        , expect = Http.expectJson LoadNews decodeNewsDict
        }


getAllTheNews : String -> Cmd Msg
getAllTheNews sessionId =
    let
        body =
            E.object
                [ ( "sessionId"
                  , E.string sessionId
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "getAllTheNews.php"
        , body = body
        , expect = Http.expectJson LoadNews decodeNewsDict
        }



--setNews : Int -> News -> String -> Cmd Msg


setNews currentTime news sessionId =
    let
        datedNews =
            { news | date = currentTime }

        body =
            E.object
                [ ( "news"
                  , encodeNews datedNews
                  )
                , ( "sessionId"
                  , E.string sessionId
                  )
                ]
                |> Http.jsonBody
    in
    Http.task
        { method = "Post"
        , headers = []
        , url = "setNews.php"
        , body = body
        , resolver = jsonResolver decodeSuccess
        , timeout = Nothing
        }


decodeNewsDict : D.Decoder (Dict String News)
decodeNewsDict =
    D.list decodeNews
        |> D.map
            (\newsList ->
                List.map (\news -> ( canonical news.uuid, news ))
                    newsList
            )
        |> D.map Dict.fromList


decodeSuccess : D.Decoder Bool
decodeSuccess =
    D.at [ "message" ] (D.succeed True)
