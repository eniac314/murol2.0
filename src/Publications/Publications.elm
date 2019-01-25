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
import File exposing (..)
import File.Select as Select exposing (..)
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


port requestBulletinCover : E.Value -> Cmd msg


port bulletinCover : (D.Value -> msg) -> Sub msg


type alias Model msg =
    { displayMode : DisplayMode
    , murolInfos : Dict Int MurolInfoMeta
    , delibs : Dict Int DelibMeta
    , bulletins : Dict Int BulletinMeta
    , bulletinCover : Maybe String
    , lockedMurolInfos : Dict Int MurolInfoMeta
    , lockedDelibs : Dict Int DelibMeta
    , lockedBulletins : Dict Int BulletinMeta
    , loadingStatus : ToolLoadingStatus
    , debug : String
    , externalMsg : Msg -> msg
    }


type DisplayMode
    = Initial
    | MurolInfoEditor
    | DelibEditor
    | BulletinEditor



--type UploadData =


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
    | FileRequested
    | FileSelected File
    | FileConverted String
    | BulletinCover D.Value
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
    , bulletinCover = Nothing
    , lockedMurolInfos = Dict.empty
    , lockedDelibs = Dict.empty
    , lockedBulletins = Dict.empty
    , loadingStatus = ToolLoadingWaiting
    , debug = ""
    , externalMsg = externalMsg
    }


subscriptions model =
    Sub.map model.externalMsg <|
        Sub.batch
            [ bulletinCover BulletinCover ]



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

        FileRequested ->
            ( model
            , Cmd.map model.externalMsg selectFile
            )

        FileSelected file ->
            ( model
            , Task.perform
                FileConverted
                (File.toUrl file)
                |> Cmd.map model.externalMsg
            )

        FileConverted fileStr ->
            ( model
            , fileStr
                |> E.string
                |> requestBulletinCover
                |> Cmd.map model.externalMsg
            )

        BulletinCover json ->
            case D.decodeValue decodeBulletinCover json of
                Ok cover ->
                    ( { model | bulletinCover = Just cover }
                    , Cmd.none
                    )

                Err e ->
                    ( model, Cmd.none )

        --( { model | debug = Debug.toString e }, Cmd.none )
        SaveMurolInfo issue ->
            case Dict.get issue model.murolInfos of
                Just mu ->
                    ( { model
                        | lockedMurolInfos =
                            Dict.insert issue mu model.lockedMurolInfos
                      }
                    , cmdIfLogged
                        config.logInfo
                        (saveMurolInfo mu)
                        |> Cmd.map model.externalMsg
                    )

                _ ->
                    ( model, Cmd.none )

        MurolInfoSaved issue res ->
            case res of
                Ok True ->
                    ( { model
                        | lockedMurolInfos =
                            Dict.remove issue model.lockedMurolInfos
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model
                    , Cmd.none
                    )

        DeleteMurolInfo issue ->
            case Dict.get issue model.murolInfos of
                Just mu ->
                    ( { model
                        | lockedMurolInfos =
                            Dict.insert issue mu model.lockedMurolInfos
                        , murolInfos =
                            Dict.remove issue model.murolInfos
                      }
                    , cmdIfLogged
                        config.logInfo
                        (deleteMurolInfo issue)
                        |> Cmd.map model.externalMsg
                    )

                _ ->
                    ( model, Cmd.none )

        MurolInfoDeleted issue res ->
            case ( res, Dict.get issue model.lockedMurolInfos ) of
                ( Ok True, Just mu ) ->
                    ( { model
                        | lockedMurolInfos =
                            Dict.remove issue model.lockedMurolInfos
                      }
                    , Cmd.none
                    )

                ( _, Just mu ) ->
                    ( { model
                        | lockedMurolInfos =
                            Dict.remove issue model.lockedMurolInfos
                        , murolInfos =
                            Dict.insert issue mu model.murolInfos
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        SaveDelib date ->
            case Dict.get date model.delibs of
                Just delib ->
                    ( { model
                        | lockedDelibs =
                            Dict.insert date delib model.lockedDelibs
                      }
                    , cmdIfLogged
                        config.logInfo
                        (saveDelib delib)
                        |> Cmd.map model.externalMsg
                    )

                _ ->
                    ( model, Cmd.none )

        DelibSaved date res ->
            case res of
                Ok True ->
                    ( { model
                        | lockedDelibs = Dict.remove date model.lockedDelibs
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        DeleteDelib date ->
            case Dict.get date model.delibs of
                Just delib ->
                    ( { model
                        | lockedDelibs =
                            Dict.insert date delib model.lockedDelibs
                        , delibs =
                            Dict.remove date model.delibs
                      }
                    , cmdIfLogged
                        config.logInfo
                        (deleteDelib date)
                        |> Cmd.map model.externalMsg
                    )

                _ ->
                    ( model, Cmd.none )

        DelibDeleted date res ->
            case ( res, Dict.get date model.lockedDelibs ) of
                ( Ok True, Just delib ) ->
                    ( { model
                        | lockedDelibs =
                            Dict.remove date model.lockedDelibs
                      }
                    , Cmd.none
                    )

                ( _, Just delib ) ->
                    ( { model
                        | lockedDelibs =
                            Dict.remove date model.lockedDelibs
                        , delibs =
                            Dict.insert date delib model.delibs
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        SaveBulletin issue ->
            case Dict.get issue model.bulletins of
                Just bulletin ->
                    ( { model
                        | lockedBulletins =
                            Dict.insert issue bulletin model.lockedBulletins
                      }
                    , cmdIfLogged
                        config.logInfo
                        (saveBulletin bulletin)
                        |> Cmd.map model.externalMsg
                    )

                _ ->
                    ( model, Cmd.none )

        BulletinSaved issue res ->
            case res of
                Ok True ->
                    ( { model
                        | lockedBulletins =
                            Dict.remove issue model.lockedBulletins
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        DeleteBulletin issue ->
            case Dict.get issue model.bulletins of
                Just bulletin ->
                    ( { model
                        | lockedBulletins =
                            Dict.insert issue bulletin model.lockedBulletins
                        , bulletins =
                            Dict.remove issue model.bulletins
                      }
                    , cmdIfLogged
                        config.logInfo
                        (deleteBulletin issue)
                        |> Cmd.map model.externalMsg
                    )

                _ ->
                    ( model, Cmd.none )

        BulletinDeleted issue res ->
            case ( res, Dict.get issue model.lockedBulletins ) of
                ( Ok True, Just bulletin ) ->
                    ( { model
                        | lockedBulletins =
                            Dict.remove issue model.lockedBulletins
                      }
                    , Cmd.none
                    )

                ( _, Just bulletin ) ->
                    ( { model
                        | lockedBulletins =
                            Dict.remove issue model.lockedBulletins
                        , bulletins =
                            Dict.insert issue bulletin model.bulletins
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        NoOp ->
            ( model, Cmd.none )



-------------------------------------------------------------------------------
--------------------
-- View functions --
--------------------


view config model =
    Element.map model.externalMsg <|
        column
            [ spacing 15
            , padding 15
            ]
            [ Input.button
                (buttonStyle True)
                { onPress = Just FileRequested
                , label = text "New File"
                }
            , text <| model.debug
            , case model.bulletinCover of
                Just cover ->
                    image
                        []
                        { src = cover
                        , description = ""
                        }

                _ ->
                    Element.none
            ]



-------------------------------------------------------------------------------
-------------------
-- File handling --
-------------------


selectFile : Cmd Msg
selectFile =
    Select.file [ "application/pdf" ] FileSelected



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


deleteMurolInfo : Int -> String -> Cmd Msg
deleteMurolInfo issue sessionId =
    let
        body =
            E.object
                [ ( "issue", E.int issue )
                , ( "sessionId"
                  , E.string sessionId
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "deleteMurolInfo.php"
        , body = body
        , expect = Http.expectJson (MurolInfoDeleted issue) decodeSuccess
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


deleteDelib : Int -> String -> Cmd Msg
deleteDelib date sessionId =
    let
        body =
            E.object
                [ ( "date", E.int date )
                , ( "sessionId"
                  , E.string sessionId
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "deleteDelib.php"
        , body = body
        , expect = Http.expectJson (DelibDeleted date) decodeSuccess
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


deleteBulletin : Int -> String -> Cmd Msg
deleteBulletin issue sessionId =
    let
        body =
            E.object
                [ ( "issue", E.int issue )
                , ( "sessionId"
                  , E.string sessionId
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "deleteBulletin.php"
        , body = body
        , expect = Http.expectJson (BulletinDeleted issue) decodeSuccess
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


decodeBulletinCover : D.Decoder String
decodeBulletinCover =
    D.oneOf
        [ D.field "content" D.string
        , D.field "error" D.string
        ]


decodeSuccess : D.Decoder Bool
decodeSuccess =
    D.at [ "message" ] (D.succeed True)
