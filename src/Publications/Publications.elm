port module Publications.Publications exposing (..)

import Auth.AuthPlugin exposing (LogInfo(..), cmdIfLogged)
import Derberos.Date.Core exposing (civilToPosix, newDateRecord)
import Dict exposing (..)
import Document.Document exposing (..)
import Document.DocumentViews.RenderConfig exposing (Config)
import Document.DocumentViews.StyleSheets exposing (PreviewMode(..), Season(..))
import Document.Json.DocumentDecoder exposing (decodeNews)
import Document.Json.DocumentSerializer exposing (encodeNews)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Keyed as Keyed
import Element.Lazy exposing (lazy)
import FileExplorer.FileExplorer as FileExplorer
import Html exposing (map)
import Html.Attributes as HtmlAttr
import Http exposing (..)
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.Icons as Icons exposing (checkSquare, square)
import Internals.ToolHelpers exposing (..)
import Json.Decode as D
import Json.Encode as E
import PageEditor.EditorPlugins.TextBlockPlugin as TextBlockPlugin
import PageEditor.Internals.DocumentEditorHelpers exposing (..)
import PageTreeEditor.PageTreeEditor as PageTreeEditor exposing (Model)
import Random exposing (..)
import Set exposing (..)
import String.Extra exposing (pluralize)
import Task exposing (..)
import Time exposing (..)
import UUID exposing (..)


type alias Model msg =
    { displayMode : DisplayMode
    , murolInfos : Dict Int MurolInfoMeta
    , delibs : Dict Int DelibMeta
    , bulletins : Dict Int BulletinMeta
    , lockedMurolInfos : Maybe Int
    , lockedDelib : Maybe Int
    , lockedBulletin : Maybe Int
    , loadingStatus : ToolLoadingStatus
    , externalMsg : Msg -> msg
    }


type DisplayMode
    = Initial
    | MurolInfoEditor
    | DelibEditor
    | BulletinEditor


type alias Publications =
    { murolInfos : Dict Int MurolInfoMeta
    , delibs : Dict Int DelibMeta
    , bulletins : Dict Int BulletinMeta
    }


load : Model msg -> LogInfo -> Cmd msg
load model logInfo =
    case logInfo of
        LoggedIn { sessionId } ->
            Cmd.map model.externalMsg <|
                Cmd.batch
                    [ getAllPublications sessionId ]

        LoggedOut ->
            Cmd.none


loadingStatus model =
    model.loadingStatus


loadingView model =
    toolLoadingView "Chargement des publications: "
        { loadingStatus = loadingStatus model }


type Msg
    = LoadPublications (Result Http.Error Publications)
    | SaveMurolInfo Int
    | MurolInfoSaved Int (Result Http.Error Bool)
    | DeleteMurolInfo Int
    | MurolInfoDeleted Int (Result Http.Error Bool)
    | SaveDelib Int
    | DelibSaved Int (Result Http.Error Bool)
    | DeleteDelib Int
    | DelibDeleted Int (Result Http.Error Bool)
    | SaveBulletin Int
    | BulletinSaved Int (Result Http.Error Bool)
    | DeleteBulletin Int
    | BulletinDeleted Int (Result Http.Error Bool)
    | NoOp


init externalMsg =
    { displayMode = Initial
    , murolInfos = Dict.empty
    , delibs = Dict.empty
    , bulletins = Dict.empty
    , lockedMurolInfos = Nothing
    , lockedDelib = Nothing
    , lockedBulletin = Nothing
    , loadingStatus = ToolLoadingWaiting
    , externalMsg = externalMsg
    }


subscriptions model =
    Sub.map model.externalMsg <|
        Sub.batch
            []


update :
    { a
        | logInfo : LogInfo
        , zone : Zone
    }
    -> Msg
    -> Model msg
    -> ( Model msg, Cmd msg )
update config msg model =
    case msg of
        LoadPublications res ->
            case res of
                Ok { murolInfos, delibs, bulletins } ->
                    ( { model
                        | murolInfos = murolInfos
                        , delibs = delibs
                        , bulletins = bulletins
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

        SaveMurolInfo issue ->
            ( model, Cmd.none )

        MurolInfoSaved issue res ->
            ( model, Cmd.none )

        DeleteMurolInfo issue ->
            ( model, Cmd.none )

        MurolInfoDeleted issue res ->
            ( model, Cmd.none )

        SaveDelib date ->
            ( model, Cmd.none )

        DelibSaved date res ->
            ( model, Cmd.none )

        DeleteDelib date ->
            ( model, Cmd.none )

        DelibDeleted date res ->
            ( model, Cmd.none )

        SaveBulletin issue ->
            ( model, Cmd.none )

        BulletinSaved issue res ->
            ( model, Cmd.none )

        DeleteBulletin issue ->
            ( model, Cmd.none )

        BulletinDeleted issue res ->
            ( model, Cmd.none )

        NoOp ->
            ( model, Cmd.none )


view config model =
    Element.none



-------------------------------------------------------------------------------
-----------------
-- Json / Http --
-----------------


getAllPublications : String -> Cmd Msg
getAllPublications sessionId =
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
        { url = "getAllPublications.php"
        , body = body
        , expect = Http.expectJson LoadPublications decodePublications
        }


saveMurolInfo : MurolInfoMeta -> String -> Cmd Msg
saveMurolInfo murolInfo sessionId =
    let
        body =
            E.object
                [ ( "sessionId"
                  , E.string sessionId
                  )
                , ( "murolInfo"
                  , encodeMurolInfo
                        murolInfo
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "saveMurolInfo.php"
        , body = body
        , expect = Http.expectJson (MurolInfoSaved murolInfo.issue) decodeSuccess
        }


saveDelib : DelibMeta -> String -> Cmd Msg
saveDelib delib sessionId =
    let
        body =
            E.object
                [ ( "sessionId"
                  , E.string sessionId
                  )
                , ( "delib"
                  , encodeDelib
                        delib
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "saveDelib.php"
        , body = body
        , expect = Http.expectJson (DelibSaved (posixToMillis delib.date)) decodeSuccess
        }


saveBulletin : BulletinMeta -> String -> Cmd Msg
saveBulletin bulletin sessionId =
    let
        body =
            E.object
                [ ( "sessionId"
                  , E.string sessionId
                  )
                , ( "bulletin"
                  , encodeBulletin
                        bulletin
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "saveBulletin.php"
        , body = body
        , expect = Http.expectJson (BulletinSaved bulletin.issue) decodeSuccess
        }


decodePublications : D.Decoder Publications
decodePublications =
    D.map3 Publications
        (D.field "murolInfos"
            (D.list decodeMurolInfo
                |> D.map (List.map (\mi -> ( mi.issue, mi )))
                |> D.map Dict.fromList
            )
        )
        (D.field "delibs"
            (D.list decodeDelib
                |> D.map (List.map (\d -> ( posixToMillis d.date, d )))
                |> D.map Dict.fromList
            )
        )
        (D.field "bulletins"
            (D.list decodeBulletin
                |> D.map (List.map (\b -> ( b.issue, b )))
                |> D.map Dict.fromList
            )
        )


decodeMurolInfo : D.Decoder MurolInfoMeta
decodeMurolInfo =
    D.map3 MurolInfoMeta
        (D.field "issue" D.int)
        (D.field "date" (D.map millisToPosix D.int))
        (D.field "topics" (D.list D.string))


encodeMurolInfo : MurolInfoMeta -> E.Value
encodeMurolInfo { issue, date, topics } =
    E.object
        [ ( "issue", E.int issue )
        , ( "date", E.int (posixToMillis date) )
        , ( "topics", E.list E.string topics )
        ]


decodeDelib : D.Decoder DelibMeta
decodeDelib =
    D.map2 DelibMeta
        (D.field "date" (D.map millisToPosix D.int))
        (D.field "topics" (D.list D.string))


encodeDelib : DelibMeta -> E.Value
encodeDelib { date, topics } =
    E.object
        [ ( "date", E.int (posixToMillis date) )
        , ( "topics", E.list E.string topics )
        ]


decodeBulletin : D.Decoder BulletinMeta
decodeBulletin =
    D.map4 BulletinMeta
        (D.field "issue" D.int)
        (D.field "date" (D.map millisToPosix D.int))
        (D.field "cover" D.string)
        (D.field "index" (D.dict D.int))


encodeBulletin : BulletinMeta -> E.Value
encodeBulletin { issue, date, cover, index } =
    E.object
        [ ( "issue", E.int issue )
        , ( "date", E.int (posixToMillis date) )
        , ( "cover", E.string cover )
        , ( "index", E.dict identity E.int index )
        ]


decodeSuccess : D.Decoder Bool
decodeSuccess =
    D.at [ "message" ] (D.succeed True)
