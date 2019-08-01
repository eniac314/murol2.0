port module Publications.Publications exposing (DisplayMode(..), Model, Msg(..), PubType(..), bulletinCover, containerStyle, coverFilename, dateInputView, decodeBulletin, decodeBulletinCover, decodeDelib, decodeMurolInfo, decodePublications, decodeSuccess, deleteBulletin, deleteDelib, deleteMurolInfo, encodeBulletin, encodeDelib, encodeMurolInfo, extractPubType, getAllPublications, indexEditorView, init, initialView, issueInputView, itemStyle, load, loadingStatus, loadingView, newBulletinView, newDelibView, newMurolInfoView, nextKey, parseDate, requestBulletinCover, saveBulletinMeta, saveDelibMeta, saveMurolInfoMeta, selectFile, subscriptions, topicEditorView, update, uploadPub, uploadView, view)

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
import Internals.Icons as Icons exposing (checkSquare, chevronDown, chevronUp, square)
import Internals.ToolHelpers exposing (..)
import Json.Decode as D
import Json.Encode as E
import List.Extra exposing (swapAt)
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
    , modifyingExisting : Bool
    , murolInfos : Dict Int MurolInfoMeta
    , delibs : Dict Int DelibMeta
    , bulletins : Dict Int BulletinMeta
    , fileToUpload : Maybe File
    , uploadProgress : Maybe ( Int, Maybe UploadStatus )

    --
    , issueInput : Maybe String
    , dateInput : Maybe Posix
    , dateBuffer : String
    , topics : Dict Int (Maybe String)
    , index : Dict Int ( Maybe String, Maybe Int )
    , bulletinCover : Maybe String

    --
    , lockedMurolInfos : Dict Int MurolInfoMeta
    , lockedDelibs : Dict Int DelibMeta
    , lockedBulletins : Dict Int BulletinMeta
    , metaDataUploaded : Status
    , loadingStatus : ToolLoadingStatus
    , debug : String
    , externalMsg : Msg -> msg
    }


type DisplayMode
    = Select PubType
    | Edit PubType
    | Upload PubType


type PubType
    = MurolInfo
    | Delib
    | Bulletin



--type alias Publications =
--    { murolInfos : Dict Int MurolInfoMeta
--    , delibs : Dict Int DelibMeta
--    , bulletins : Dict Int BulletinMeta
--    }


load : Model msg -> LogInfo -> Cmd msg
load model logInfo =
    case logInfo of
        LoggedIn { sessionId } ->
            Cmd.map model.externalMsg <|
                Cmd.batch
                    [ getAllPublications LoadPublications ]

        LoggedOut ->
            Cmd.none


loadingStatus model =
    model.loadingStatus


loadingView model =
    toolLoadingView "Chargement des publications: "
        { loadingStatus = loadingStatus model }


type Msg
    = SetPubType PubType
    | LoadPublications (Result Http.Error Publications)
      --
    | SelectMurolInfo Int
    | SelectDelib Int
    | SelectBulletin Int
      --
    | SetIssue String
    | SetDate String
    | NewTopic
    | SetTopic Int String
    | RemoveTopic Int
    | NewIndexEntry
    | SetIndexEntryTopic Int String
    | SetIndexEntryPageNbr Int String
    | RemoveIndexEntry Int
    | SwapUp Int
    | SwapDown Int
      --
    | FileRequested
    | FileSelected File
    | FileConverted String
    | BulletinCover D.Value
    | GotProgress Http.Progress
    | UploadDone (Cmd Msg) (Result Http.Error UploadStatus)
    | SaveMurolInfo
    | MurolInfoSaved Int (Result Http.Error Bool)
    | DeleteMurolInfo Int
    | MurolInfoDeleted Int (Result Http.Error Bool)
    | SaveDelib
    | DelibSaved Int (Result Http.Error Bool)
    | DeleteDelib Int
    | DelibDeleted Int (Result Http.Error Bool)
    | SaveBulletin
    | BulletinSaved Int (Result Http.Error Bool)
    | DeleteBulletin Int
    | BulletinDeleted Int (Result Http.Error Bool)
    | Reset
    | NoOp


init externalMsg =
    { displayMode = Select MurolInfo
    , modifyingExisting = False
    , murolInfos = Dict.empty
    , delibs = Dict.empty
    , bulletins = Dict.empty
    , fileToUpload = Nothing
    , uploadProgress = Nothing
    , issueInput = Nothing
    , dateInput = Nothing
    , dateBuffer = ""
    , topics = Dict.empty
    , bulletinCover = Nothing
    , index = Dict.empty
    , lockedMurolInfos = Dict.empty
    , lockedDelibs = Dict.empty
    , lockedBulletins = Dict.empty
    , metaDataUploaded = Initial
    , loadingStatus = ToolLoadingWaiting
    , debug = ""
    , externalMsg = externalMsg
    }


subscriptions model =
    Sub.map model.externalMsg <|
        Sub.batch
            [ bulletinCover BulletinCover
            , Http.track "publicationUpload" GotProgress
            ]



-------------------------------------------------------------------------------
------------
-- Update --
------------


update :
    { a
        | logInfo : LogInfo
        , zone : Zone
        , reloadFilesMsg : msg
    }
    -> Msg
    -> Model msg
    -> ( Model msg, Cmd msg )
update config msg model =
    case msg of
        SetPubType pt ->
            case model.displayMode of
                Select _ ->
                    ( { model | displayMode = Select pt }
                    , Cmd.none
                    )

                Edit _ ->
                    ( { model | displayMode = Edit pt }
                    , Cmd.none
                    )

                Upload _ ->
                    ( { model | displayMode = Upload pt }
                    , Cmd.none
                    )

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

        SelectMurolInfo n ->
            case Dict.get n model.murolInfos of
                Just { issue, date, topics } ->
                    ( { model
                        | displayMode = Edit MurolInfo
                        , modifyingExisting = True
                        , issueInput = Just <| String.fromInt issue
                        , dateInput = Just date
                        , dateBuffer = dateToStr config.zone date
                        , topics =
                            List.indexedMap
                                (\i t -> ( i, Just t ))
                                topics
                                |> Dict.fromList
                      }
                    , Cmd.none
                    )

                Nothing ->
                    ( model, Cmd.none )

        SelectDelib n ->
            case Dict.get n model.delibs of
                Just { date, index } ->
                    ( { model
                        | displayMode = Edit Delib
                        , modifyingExisting = True
                        , dateInput = Just date
                        , dateBuffer = dateToStr config.zone date
                        , index =
                            List.indexedMap
                                (\i ( t, p ) -> ( i, ( Just t, Just p ) ))
                                index
                                |> Dict.fromList
                      }
                    , Cmd.none
                    )

                Nothing ->
                    ( model, Cmd.none )

        SelectBulletin n ->
            case Dict.get n model.bulletins of
                Just { issue, date, cover, index } ->
                    ( { model
                        | displayMode = Edit Bulletin
                        , modifyingExisting = True
                        , issueInput = Just <| String.fromInt issue
                        , dateInput = Just date
                        , dateBuffer = dateToStr config.zone date
                        , index =
                            List.indexedMap
                                (\i ( t, p ) -> ( i, ( Just t, Just p ) ))
                                index
                                |> Dict.fromList
                        , bulletinCover = Nothing
                      }
                    , Cmd.none
                    )

                Nothing ->
                    ( model, Cmd.none )

        SetIssue issue ->
            let
                newIssue =
                    if issue == "" then
                        Nothing

                    else
                        Just issue
            in
            ( { model | issueInput = newIssue }
            , Cmd.none
            )

        SetDate date ->
            case parseDate config.zone date of
                Just posix ->
                    ( { model
                        | dateInput = Just posix
                        , dateBuffer = date
                      }
                    , Cmd.none
                    )

                Nothing ->
                    ( { model
                        | dateBuffer = date
                        , dateInput = Nothing
                      }
                    , Cmd.none
                    )

        NewTopic ->
            let
                key =
                    nextKey model.topics
            in
            ( { model
                | topics = Dict.insert key Nothing model.topics
              }
            , Cmd.none
            )

        SetTopic key topic ->
            let
                newTopic =
                    if topic == "" then
                        Nothing

                    else
                        Just topic
            in
            ( { model
                | topics =
                    Dict.insert key newTopic model.topics
              }
            , Cmd.none
            )

        RemoveTopic key ->
            ( { model
                | topics = Dict.remove key model.topics
              }
            , Cmd.none
            )

        NewIndexEntry ->
            let
                key =
                    nextKey model.index
            in
            ( { model
                | index =
                    Dict.insert key ( Nothing, Nothing ) model.index
              }
            , Cmd.none
            )

        SetIndexEntryTopic key topic ->
            case Dict.get key model.index of
                Just ( _, pNbr ) ->
                    ( { model
                        | index =
                            Dict.insert key
                                ( if topic == "" then
                                    Nothing

                                  else
                                    Just topic
                                , pNbr
                                )
                                model.index
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        SetIndexEntryPageNbr key pageNbr ->
            case Dict.get key model.index of
                Just ( topic, _ ) ->
                    ( { model
                        | index =
                            Dict.insert key ( topic, String.toInt pageNbr ) model.index
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        RemoveIndexEntry key ->
            ( { model
                | index =
                    Dict.remove key model.index
              }
            , Cmd.none
            )

        SwapUp i ->
            case extractPubType model of
                MurolInfo ->
                    let
                        newTopics =
                            Dict.values model.topics
                                |> swapAt i (i - 1)
                                |> List.indexedMap Tuple.pair
                                |> Dict.fromList
                    in
                    ( { model | topics = newTopics }, Cmd.none )

                _ ->
                    let
                        newIndex =
                            Dict.values model.index
                                |> swapAt i (i - 1)
                                |> List.indexedMap Tuple.pair
                                |> Dict.fromList
                    in
                    ( { model | index = newIndex }, Cmd.none )

        SwapDown i ->
            case extractPubType model of
                MurolInfo ->
                    let
                        newTopics =
                            Dict.values model.topics
                                |> swapAt i (i + 1)
                                |> List.indexedMap Tuple.pair
                                |> Dict.fromList
                    in
                    ( { model | topics = newTopics }, Cmd.none )

                _ ->
                    let
                        newIndex =
                            Dict.values model.index
                                |> swapAt i (i + 1)
                                |> List.indexedMap Tuple.pair
                                |> Dict.fromList
                    in
                    ( { model | index = newIndex }, Cmd.none )

        FileRequested ->
            ( model
            , Cmd.map model.externalMsg selectFile
            )

        FileSelected file ->
            ( { model
                | fileToUpload = Just file
                , displayMode = Edit (extractPubType model)
              }
            , case model.displayMode of
                Select Bulletin ->
                    Task.perform
                        FileConverted
                        (File.toUrl file)
                        |> Cmd.map model.externalMsg

                _ ->
                    Cmd.none
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

        GotProgress progress ->
            case progress of
                Sending { sent, size } ->
                    ( { model
                        | uploadProgress =
                            Just
                                ( floor <| 100 * toFloat sent / toFloat size
                                , Nothing
                                )
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        UploadDone saveMetaCmd res ->
            case res of
                Ok UploadSuccessful ->
                    ( { model
                        | uploadProgress =
                            Just ( 100, Just UploadSuccessful )
                      }
                    , Cmd.map model.externalMsg saveMetaCmd
                    )

                Ok (UploadFailure e) ->
                    ( { model
                        | uploadProgress =
                            Just ( 0, Just (UploadFailure e) )
                      }
                    , Cmd.none
                    )

                Err e ->
                    ( { model
                        | uploadProgress =
                            Just ( 0, Just (UploadFailure (httpErrorToString e)) )
                      }
                    , Cmd.none
                    )

        SaveMurolInfo ->
            case
                ( Maybe.andThen String.toInt model.issueInput
                , model.dateInput
                , Dict.values model.topics
                    |> List.filterMap identity
                )
            of
                ( Just issue, Just date, t :: ts ) ->
                    let
                        saveMetaCmd =
                            saveMurolInfoMeta
                                { issue = issue
                                , date = date
                                , topics = t :: ts
                                }

                        name =
                            String.fromInt issue
                                |> String.padLeft 3 '0'
                                |> (\s -> s ++ ".pdf")
                    in
                    if model.modifyingExisting then
                        ( { model
                            | displayMode = Upload MurolInfo
                            , metaDataUploaded = Waiting
                          }
                        , cmdIfLogged
                            config.logInfo
                            saveMetaCmd
                            |> Cmd.map model.externalMsg
                        )

                    else
                        case model.fileToUpload of
                            Just file ->
                                ( { model
                                    | displayMode = Upload MurolInfo
                                    , metaDataUploaded = Waiting
                                  }
                                , cmdIfLogged
                                    config.logInfo
                                    (uploadPub file MurolInfo name saveMetaCmd)
                                    |> Cmd.map model.externalMsg
                                )

                            _ ->
                                ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        MurolInfoSaved issue res ->
            case res of
                Ok True ->
                    ( { model
                        | lockedMurolInfos =
                            Dict.remove issue model.lockedMurolInfos
                        , metaDataUploaded = Success
                      }
                    , Task.perform (\_ -> config.reloadFilesMsg) (Task.succeed ())
                    )

                _ ->
                    ( { model | metaDataUploaded = Failure }
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
                    , Task.perform (\_ -> config.reloadFilesMsg) (Task.succeed ())
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

        SaveDelib ->
            case
                ( model.dateInput
                , Dict.values model.index
                    |> List.foldr
                        (\v acc ->
                            case v of
                                ( Just topic, Just pageNbr ) ->
                                    ( topic, pageNbr ) :: acc

                                _ ->
                                    acc
                        )
                        []
                )
            of
                ( Just date, x :: xs ) ->
                    let
                        saveMetaCmd =
                            saveDelibMeta
                                { date = date
                                , index = x :: xs
                                }

                        name =
                            dateToStr config.zone date
                                |> String.replace "/" "-"
                                |> (\s -> s ++ ".pdf")
                    in
                    if model.modifyingExisting then
                        ( { model
                            | displayMode = Upload Delib
                            , metaDataUploaded = Waiting
                          }
                        , cmdIfLogged
                            config.logInfo
                            saveMetaCmd
                            |> Cmd.map model.externalMsg
                        )

                    else
                        case model.fileToUpload of
                            Just file ->
                                ( { model
                                    | displayMode = Upload Delib
                                    , metaDataUploaded = Waiting
                                  }
                                , cmdIfLogged
                                    config.logInfo
                                    (uploadPub file Delib name saveMetaCmd)
                                    |> Cmd.map model.externalMsg
                                )

                            _ ->
                                ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        DelibSaved date res ->
            case res of
                Ok True ->
                    ( { model
                        | lockedDelibs = Dict.remove date model.lockedDelibs
                        , metaDataUploaded = Success
                      }
                    , Task.perform (\_ -> config.reloadFilesMsg) (Task.succeed ())
                    )

                _ ->
                    ( { model | metaDataUploaded = Failure }, Cmd.none )

        DeleteDelib date ->
            case Dict.get date model.delibs of
                Just delib ->
                    let
                        name =
                            millisToPosix date
                                |> dateToStr config.zone
                                |> String.replace "/" "-"
                                |> (\s -> s ++ ".pdf")
                    in
                    ( { model
                        | lockedDelibs =
                            Dict.insert date delib model.lockedDelibs
                        , delibs =
                            Dict.remove date model.delibs
                      }
                    , cmdIfLogged
                        config.logInfo
                        (deleteDelib name date)
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
                    , Task.perform (\_ -> config.reloadFilesMsg) (Task.succeed ())
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

        SaveBulletin ->
            case
                ( ( Maybe.andThen String.toInt model.issueInput
                  , model.dateInput
                  )
                , Dict.values model.index
                    |> List.foldr
                        (\v acc ->
                            case v of
                                ( Just topic, Just pageNbr ) ->
                                    ( topic, pageNbr ) :: acc

                                _ ->
                                    acc
                        )
                        []
                )
            of
                ( ( Just issue, Just date ), x :: xs ) ->
                    let
                        saveMetaCmd =
                            saveBulletinMeta
                                { issue = issue
                                , date = date
                                , cover =
                                    Maybe.withDefault
                                        ""
                                        model.bulletinCover
                                , index = x :: xs
                                }

                        name =
                            String.fromInt issue
                                |> String.padLeft 3 '0'
                                |> (\s -> s ++ ".pdf")
                    in
                    if model.modifyingExisting then
                        ( { model
                            | displayMode = Upload Bulletin
                            , metaDataUploaded = Waiting
                          }
                        , cmdIfLogged
                            config.logInfo
                            saveMetaCmd
                            |> Cmd.map model.externalMsg
                        )

                    else
                        case model.fileToUpload of
                            Just file ->
                                ( { model
                                    | displayMode = Upload Bulletin
                                    , metaDataUploaded = Waiting
                                  }
                                , cmdIfLogged
                                    config.logInfo
                                    (uploadPub file Bulletin name saveMetaCmd)
                                    |> Cmd.map model.externalMsg
                                )

                            _ ->
                                ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        BulletinSaved issue res ->
            case res of
                Ok True ->
                    ( { model
                        | lockedBulletins =
                            Dict.remove issue model.lockedBulletins
                        , metaDataUploaded = Success
                      }
                    , Task.perform (\_ -> config.reloadFilesMsg) (Task.succeed ())
                    )

                _ ->
                    ( { model | metaDataUploaded = Failure }, Cmd.none )

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
                    , Task.perform (\_ -> config.reloadFilesMsg) (Task.succeed ())
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

        Reset ->
            ( init model.externalMsg
            , getAllPublications LoadPublications
                |> Cmd.map model.externalMsg
            )

        NoOp ->
            ( model, Cmd.none )



-------------------------------------------------------------------------------
--------------------
-- View functions --
--------------------


view config model =
    Element.map model.externalMsg <|
        column
            [ padding 15
            , spacing 15
            , width fill
            , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
            , clip
            , width fill
            , height (maximum config.maxHeight fill)
            , scrollbarY
            ]
            [ case model.displayMode of
                Select _ ->
                    initialView config model

                Edit MurolInfo ->
                    newMurolInfoView config model

                Edit Delib ->
                    newDelibView config model

                Edit Bulletin ->
                    newBulletinView config model

                Upload _ ->
                    uploadView config model
            ]


initialView config model =
    column
        (containerStyle ++ [ spacing 15 ])
        [ column
            (itemStyle
                ++ [ spacing 15
                   , width (px 940)
                   ]
            )
            [ el
                [ Font.bold
                , Font.size 20
                ]
                (text "Type de publication")
            , row
                [ width fill ]
                [ Input.radioRow
                    [ spacing 20 ]
                    { onChange = SetPubType
                    , options =
                        [ Input.option
                            MurolInfo
                            (text "Murol info")
                        , Input.option
                            Delib
                            (text "Délibération")
                        , Input.option
                            Bulletin
                            (text "Bulletin municipal")
                        ]
                    , selected =
                        Just <| extractPubType model
                    , label =
                        Input.labelHidden ""
                    }
                , Input.button
                    (buttonStyle True ++ [ alignRight ])
                    { onPress = Just FileRequested
                    , label = text "Mettre en ligne"
                    }
                ]
            , column
                (itemStyle
                    ++ [ width fill
                       , height (px 500)
                       , scrollbarY
                       , Background.color (rgb 1 1 1)
                       ]
                )
                (case extractPubType model of
                    MurolInfo ->
                        Dict.foldl
                            (\n { issue, date } acc ->
                                row
                                    [ spacing 15
                                    , width fill
                                    , if modBy 2 n == 0 then
                                        Background.color teal7

                                      else
                                        Background.color blue7
                                    , paddingXY 7 7
                                    ]
                                    [ row []
                                        [ el [ Font.bold ]
                                            (text "Numéro: ")
                                        , text <| String.fromInt issue
                                        ]
                                    , row []
                                        [ el [ Font.bold ]
                                            (text "Date: ")
                                        , text <| dateToStr config.zone date
                                        ]
                                    , row
                                        [ spacing 15
                                        , alignRight
                                        ]
                                        [ Input.button
                                            (buttonStyle True)
                                            { onPress = Just <| SelectMurolInfo n
                                            , label = text "Modifier"
                                            }
                                        , Input.button
                                            (deleteButtonStyle True)
                                            { onPress = Just <| DeleteMurolInfo n
                                            , label = text "Supprimer"
                                            }
                                        ]
                                    ]
                                    :: acc
                            )
                            []
                            model.murolInfos

                    Delib ->
                        Dict.foldl
                            (\n { date } acc ->
                                row
                                    [ spacing 15
                                    , width fill
                                    , if modBy 2 n == 0 then
                                        Background.color blue6

                                      else
                                        Background.color blue7
                                    , paddingXY 7 7
                                    ]
                                    [ row []
                                        [ el [ Font.bold ]
                                            (text "Date: ")
                                        , text <| dateToStr config.zone date
                                        ]
                                    , row
                                        [ spacing 15
                                        , alignRight
                                        ]
                                        [ Input.button
                                            (buttonStyle True)
                                            { onPress = Just <| SelectDelib n
                                            , label = text "Modifier"
                                            }
                                        , Input.button
                                            (buttonStyle True)
                                            { onPress = Just <| DeleteDelib n
                                            , label = text "Supprimer"
                                            }
                                        ]
                                    ]
                                    :: acc
                            )
                            []
                            model.delibs

                    Bulletin ->
                        Dict.foldl
                            (\n { issue, date } acc ->
                                row
                                    [ spacing 15
                                    , width fill
                                    , if modBy 2 n == 0 then
                                        Background.color blue6

                                      else
                                        Background.color blue7
                                    , paddingXY 7 7
                                    ]
                                    [ row []
                                        [ el [ Font.bold ]
                                            (text "Numéro: ")
                                        , text <| String.fromInt issue
                                        ]
                                    , row []
                                        [ el [ Font.bold ]
                                            (text "Date: ")
                                        , text <| dateToStr config.zone date
                                        ]
                                    , row
                                        [ spacing 15
                                        , alignRight
                                        ]
                                        [ Input.button
                                            (buttonStyle True)
                                            { onPress = Just <| SelectBulletin n
                                            , label = text "Modifier"
                                            }
                                        , Input.button
                                            (buttonStyle True)
                                            { onPress = Just <| DeleteBulletin n
                                            , label = text "Supprimer"
                                            }
                                        ]
                                    ]
                                    :: acc
                            )
                            []
                            model.bulletins
                )
            ]
        ]


newMurolInfoView config model =
    let
        canUpload =
            case
                ( Maybe.andThen String.toInt model.issueInput
                , model.dateInput
                , Dict.values model.topics
                    |> List.filterMap identity
                )
            of
                ( Just issue, Just date, t :: ts ) ->
                    (model.modifyingExisting
                        || (not <| Dict.member issue model.murolInfos)
                    )
                        && (List.length (t :: ts) == Dict.size model.topics)
                        && (model.modifyingExisting
                                || (model.fileToUpload /= Nothing)
                           )

                _ ->
                    False
    in
    column (containerStyle ++ [ spacing 15 ])
        [ row
            (itemStyle
                ++ [ width (px 940)
                   ]
            )
            [ el
                [ Font.bold
                , Font.size 20
                ]
                (text "Nouveau Murol info: ")
            , el
                [ alignRight ]
                (text
                    (Maybe.map File.name model.fileToUpload
                        |> Maybe.withDefault ""
                    )
                )
            ]
        , row
            (itemStyle
                ++ [ spacing 15
                   , width (px 940)
                   ]
            )
            [ issueInputView config model
            , dateInputView config model
            ]
        , topicEditorView config model
        , row
            (itemStyle
                ++ [ width (px 940)
                   , spacing 15
                   ]
            )
            [ Input.button
                (saveButtonStyle canUpload)
                { onPress =
                    if canUpload then
                        Just SaveMurolInfo

                    else
                        Nothing
                , label = text "Valider"
                }
            , Input.button
                (buttonStyle True)
                { onPress = Just Reset
                , label = text "Annuler"
                }
            ]
        ]


newDelibView config model =
    let
        canUpload =
            case
                ( model.dateInput
                , Dict.values model.index
                    |> List.foldr
                        (\v acc ->
                            case v of
                                ( Just topic, Just pageNbr ) ->
                                    ( topic, pageNbr ) :: acc

                                _ ->
                                    acc
                        )
                        []
                )
            of
                ( Just date, x :: xs ) ->
                    (model.modifyingExisting
                        || (not <|
                                Dict.member (posixToMillis date) model.delibs
                           )
                    )
                        && (List.length (x :: xs) == Dict.size model.index)
                        && (model.modifyingExisting
                                || (model.fileToUpload /= Nothing)
                           )

                _ ->
                    False
    in
    column (containerStyle ++ [ spacing 15 ])
        [ row
            (itemStyle
                ++ [ width (px 940)
                   ]
            )
            [ el
                [ Font.bold
                , Font.size 20
                ]
                (text "Nouvelle séance du conseil municipal:")
            , el
                [ alignRight ]
                (text
                    (Maybe.map File.name model.fileToUpload
                        |> Maybe.withDefault ""
                    )
                )
            ]
        , row
            (itemStyle
                ++ [ spacing 15
                   , width (px 940)
                   ]
            )
            [ dateInputView config model
            ]
        , indexEditorView config model
        , row
            (itemStyle
                ++ [ width (px 940)
                   , spacing 15
                   ]
            )
            [ Input.button
                (saveButtonStyle canUpload)
                { onPress =
                    if canUpload then
                        Just SaveDelib

                    else
                        Nothing
                , label = text "Valider"
                }
            , Input.button
                (buttonStyle True)
                { onPress = Just Reset
                , label = text "Annuler"
                }
            ]
        ]


newBulletinView config model =
    let
        canUpload =
            case
                ( Maybe.andThen String.toInt model.issueInput
                , model.dateInput
                , Dict.values model.index
                    |> List.foldr
                        (\v acc ->
                            case v of
                                ( Just topic, Just pageNbr ) ->
                                    ( topic, pageNbr ) :: acc

                                _ ->
                                    acc
                        )
                        []
                )
            of
                ( Just issue, Just date, x :: xs ) ->
                    (model.modifyingExisting
                        || (not <| Dict.member issue model.bulletins)
                    )
                        && (List.length (x :: xs) == Dict.size model.index)
                        && (model.modifyingExisting
                                || (model.fileToUpload /= Nothing)
                           )

                _ ->
                    False
    in
    column (containerStyle ++ [ spacing 15 ])
        [ row
            (itemStyle
                ++ [ width (px 940)
                   ]
            )
            [ column
                [ spacing 15 ]
                [ el
                    [ Font.bold
                    , Font.size 20
                    ]
                    (text "Nouveau bulletin municipal: ")
                , el
                    [ padding 10
                    , Border.rounded 5
                    , Background.color grey7
                    ]
                    (case model.bulletinCover of
                        Just cover ->
                            el
                                [ centerY
                                , centerX
                                , width (px 105)
                                , height (px <| 297 // 2)
                                , Background.image
                                    cover
                                ]
                                Element.none

                        _ ->
                            if model.modifyingExisting then
                                let
                                    imgSrc =
                                        model.issueInput
                                            |> Maybe.map (String.padLeft 3 '0')
                                            |> Maybe.map
                                                (\s ->
                                                    "/baseDocumentaire/publications/bulletins/miniatures/"
                                                        ++ s
                                                        ++ ".jpg"
                                                )
                                            |> Maybe.withDefault ""
                                in
                                el
                                    [ centerY
                                    , centerX
                                    , width (px 105)
                                    , height (px <| 297 // 2)
                                    , Background.image
                                        imgSrc
                                    ]
                                    Element.none

                            else
                                el
                                    [ width (px 105)
                                    , height (px <| 297 // 2)
                                    , centerY
                                    , centerX
                                    , Background.color grey6
                                    ]
                                    (image
                                        [ centerX
                                        , centerY
                                        , clip
                                        ]
                                        { src = "/assets/images/loading.gif"
                                        , description = "chargement"
                                        }
                                    )
                    )
                ]
            , el
                [ alignRight
                , alignTop
                ]
                (text
                    (Maybe.map File.name model.fileToUpload
                        |> Maybe.withDefault ""
                    )
                )
            ]
        , row
            (itemStyle
                ++ [ spacing 15
                   , width (px 940)
                   ]
            )
            [ issueInputView config model
            , dateInputView config model
            ]
        , indexEditorView config model
        , row
            (itemStyle
                ++ [ width (px 940)
                   , spacing 15
                   ]
            )
            [ Input.button
                (saveButtonStyle canUpload)
                { onPress =
                    if canUpload then
                        Just SaveBulletin

                    else
                        Nothing
                , label = text "Valider"
                }
            , Input.button
                (buttonStyle True)
                { onPress = Just Reset
                , label = text "Annuler"
                }
            ]
        ]


uploadView config model =
    let
        canReset =
            model.metaDataUploaded == Success
    in
    column (containerStyle ++ [ spacing 15 ])
        [ row
            (itemStyle
                ++ [ spacing 15
                   , width (px 940)
                   ]
            )
            [ el
                [ Font.bold
                , Font.size 20
                ]
                (text "Mise en ligne...")
            ]
        , column
            (itemStyle
                ++ [ spacing 15
                   , width (px 940)
                   ]
            )
            [ if model.modifyingExisting then
                Element.none

              else
                row
                    [ spacing 15 ]
                    [ el
                        [ Font.bold ]
                        (text "Transfert fichier: ")
                    , Maybe.map Tuple.first model.uploadProgress
                        |> Maybe.withDefault 0
                        |> progressBar
                    ]
            , row
                [ spacing 15 ]
                [ el
                    [ Font.bold ]
                    (text "Transfert metadonnées: ")
                , case model.metaDataUploaded of
                    Waiting ->
                        text "En cours..."

                    Success ->
                        text "Terminé"

                    _ ->
                        text "Erreur"
                ]
            ]
        , row
            (itemStyle
                ++ [ width (px 940)
                   , spacing 15
                   ]
            )
            [ Input.button
                (buttonStyle canReset)
                { onPress =
                    if canReset then
                        Just Reset

                    else
                        Nothing
                , label = text "Retour"
                }
            ]
        ]



-------------------------------------------------------------------------------
----------------------------
-- View functions helpers --
----------------------------


issueInputView config model =
    if model.modifyingExisting then
        row
            []
            [ el [ Font.bold ]
                (text "Numéro: ")
            , text
                (model.issueInput
                    |> Maybe.withDefault ""
                )
            ]

    else
        Input.text
            (textInputStyle ++ [ width (px 50) ])
            { onChange = SetIssue
            , text =
                model.issueInput
                    |> Maybe.withDefault ""
            , placeholder = Nothing
            , label =
                Input.labelLeft
                    [ centerY
                    , Font.bold
                    ]
                    (text "Numéro: ")
            }


dateInputView config model =
    case ( extractPubType model, model.modifyingExisting ) of
        ( Delib, True ) ->
            text <| model.dateBuffer

        _ ->
            Input.text
                (textInputStyle
                    ++ [ width (px 150)
                       , case model.dateInput of
                            Just _ ->
                                Font.color green4

                            _ ->
                                Font.color red4
                       ]
                )
                { onChange = SetDate
                , label =
                    Input.labelLeft
                        [ centerY
                        , Font.bold
                        ]
                        (text "Date: ")
                , placeholder =
                    Just <| Input.placeholder [ clip ] (text "jj/mm/aaaa")
                , text =
                    case model.dateInput of
                        Nothing ->
                            model.dateBuffer

                        Just t ->
                            dateToStr config.zone t
                }


topicEditorView config model =
    let
        topicView ( i, ( n, t ) ) =
            Keyed.el []
                ( String.fromInt i
                , row
                    [ width fill
                    , spacing 15
                    ]
                    [ Input.text
                        (textInputStyle
                            ++ [ width (px 600) ]
                        )
                        { onChange =
                            SetTopic n
                        , label = Input.labelHidden ""
                        , placeholder = Nothing
                        , text =
                            Maybe.withDefault "" t
                        }
                    , row
                        [ spacing 5 ]
                        [ Input.button
                            (buttonStyle True)
                            { onPress = Just (SwapUp i)
                            , label =
                                el []
                                    (html <| chevronUp 14)
                            }
                        , Input.button
                            (buttonStyle True)
                            { onPress = Just (SwapDown i)
                            , label =
                                el []
                                    (html <| chevronDown 14)
                            }
                        ]
                    , Input.button
                        (buttonStyle True)
                        { onPress = Just <| RemoveTopic n
                        , label = text "Supprimer"
                        }
                    ]
                )
    in
    column
        (itemStyle
            ++ [ spacing 15
               , width (px 940)
               ]
        )
        ([ row
            [ spacing 30 ]
            [ el
                [ Font.bold ]
                (text "Sujets: ")
            , Input.button
                (buttonStyle True)
                { onPress = Just NewTopic
                , label =
                    case extractPubType model of
                        Delib ->
                            text "Nouvel article de l'ordre du jour"

                        _ ->
                            text "Nouveau sujet"
                }
            ]
         ]
            ++ (Dict.toList model.topics
                    |> List.indexedMap Tuple.pair
                    |> List.map topicView
               )
        )


indexEditorView config model =
    let
        topicView ( i, ( n, ( t, p ) ) ) =
            Keyed.el
                []
                ( String.fromInt i
                , row
                    [ width fill
                    , spacing 15
                    ]
                    [ Input.text
                        (textInputStyle
                            ++ [ width (px 600) ]
                        )
                        { onChange =
                            SetIndexEntryTopic n
                        , label = Input.labelHidden ""
                        , placeholder = Nothing
                        , text =
                            Maybe.withDefault "" t
                        }
                    , Input.text
                        (textInputStyle ++ [ width (px 50) ])
                        { onChange = SetIndexEntryPageNbr n
                        , text =
                            Maybe.withDefault "" (Maybe.map String.fromInt p)
                        , placeholder = Nothing
                        , label =
                            Input.labelLeft
                                [ centerY
                                , Font.bold
                                ]
                                (text "Page: ")
                        }
                    , row
                        [ spacing 5 ]
                        [ Input.button
                            (buttonStyle True)
                            { onPress = Just (SwapUp i)
                            , label =
                                el []
                                    (html <| chevronUp 14)
                            }
                        , Input.button
                            (buttonStyle True)
                            { onPress = Just (SwapDown i)
                            , label =
                                el []
                                    (html <| chevronDown 14)
                            }
                        ]
                    , Input.button
                        (buttonStyle True)
                        { onPress = Just <| RemoveIndexEntry n
                        , label = text "Supprimer"
                        }
                    ]
                )
    in
    column
        (itemStyle
            ++ [ spacing 15
               , width (px 940)
               ]
        )
        ([ row
            [ spacing 30 ]
            [ el
                [ Font.bold ]
                (text "Sujets: ")
            , Input.button
                (buttonStyle True)
                { onPress = Just NewIndexEntry
                , label =
                    text "Nouveau sujet"
                }
            ]
         ]
            ++ (Dict.toList model.index
                    |> List.indexedMap Tuple.pair
                    |> List.map topicView
               )
        )



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


getAllPublications : (Result Http.Error Publications -> msg) -> Cmd msg
getAllPublications msg =
    let
        body =
            E.object
                []
                |> Http.jsonBody
    in
    Http.post
        { url = "/getAllPublications.php"
        , body = body
        , expect = Http.expectJson msg decodePublications
        }


uploadPub : File -> PubType -> String -> (String -> Cmd Msg) -> String -> Cmd Msg
uploadPub file pubType name saveMetaCmd sessionId =
    let
        pubTypeStr =
            case pubType of
                MurolInfo ->
                    "murolInfo"

                Delib ->
                    "delib"

                Bulletin ->
                    "bulletin"

        body =
            Http.multipartBody
                [ Http.stringPart "sessionId" sessionId
                , Http.stringPart "pubType" pubTypeStr
                , Http.stringPart "name" name
                , Http.filePart "file" file
                ]
    in
    Http.request
        { method = "POST"
        , headers = []
        , url = "/uploadPub.php"
        , body = body
        , expect =
            Http.expectJson
                (UploadDone (saveMetaCmd sessionId))
                decodeUploadStatus
        , timeout = Nothing
        , tracker = Just "publicationUpload"
        }


saveMurolInfoMeta : MurolInfoMeta -> String -> Cmd Msg
saveMurolInfoMeta murolInfo sessionId =
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
        { url = "/saveMurolInfo.php"
        , body = body
        , expect = Http.expectJson (MurolInfoSaved murolInfo.issue) decodeSuccess
        }


deleteMurolInfo : Int -> String -> Cmd Msg
deleteMurolInfo issue sessionId =
    let
        name =
            String.fromInt issue
                |> String.padLeft 3 '0'
                |> (\s -> s ++ ".pdf")

        body =
            E.object
                [ ( "issue", E.int issue )
                , ( "name", E.string name )
                , ( "sessionId"
                  , E.string sessionId
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "/deleteMurolInfo.php"
        , body = body
        , expect = Http.expectJson (MurolInfoDeleted issue) decodeSuccess
        }


saveDelibMeta : DelibMeta -> String -> Cmd Msg
saveDelibMeta delib sessionId =
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
        { url = "/saveDelib.php"
        , body = body
        , expect = Http.expectJson (DelibSaved (posixToMillis delib.date)) decodeSuccess
        }


deleteDelib : String -> Int -> String -> Cmd Msg
deleteDelib name date sessionId =
    let
        body =
            E.object
                [ ( "date", E.int date )
                , ( "name", E.string name )
                , ( "sessionId"
                  , E.string sessionId
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "/deleteDelib.php"
        , body = body
        , expect = Http.expectJson (DelibDeleted date) decodeSuccess
        }


saveBulletinMeta : BulletinMeta -> String -> Cmd Msg
saveBulletinMeta bulletin sessionId =
    let
        name =
            String.fromInt bulletin.issue
                |> String.padLeft 3 '0'
                |> (\s -> s ++ ".jpg")

        body =
            E.object
                [ ( "sessionId"
                  , E.string sessionId
                  )
                , ( "name", E.string name )
                , ( "bulletin"
                  , encodeBulletin
                        bulletin
                  )
                ]
                |> Http.jsonBody
    in
    Http.request
        { method = "POST"
        , headers = []
        , url = "/saveBulletin.php"
        , body = body
        , expect =
            Http.expectJson
                (BulletinSaved bulletin.issue)
                decodeSuccess
        , timeout = Nothing
        , tracker = Just "bulletinMeta"
        }


deleteBulletin : Int -> String -> Cmd Msg
deleteBulletin issue sessionId =
    let
        name =
            String.fromInt issue
                |> String.padLeft 3 '0'
                |> (\s -> s ++ ".pdf")

        cover =
            String.fromInt issue
                |> String.padLeft 3 '0'
                |> (\s -> s ++ ".jpg")

        body =
            E.object
                [ ( "issue", E.int issue )
                , ( "name", E.string name )
                , ( "cover", E.string cover )
                , ( "sessionId"
                  , E.string sessionId
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "/deleteBulletin.php"
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
    let
        decodeIndexEntry =
            D.map2 Tuple.pair
                (D.field "topic" D.string)
                (D.field "page" D.int)
    in
    D.map2 DelibMeta
        (D.field "date" (D.map millisToPosix D.int))
        (D.field "index" (D.list decodeIndexEntry))


encodeDelib : DelibMeta -> E.Value
encodeDelib { date, index } =
    let
        encodeIndexEntry ( topic, page ) =
            E.object
                [ ( "topic", E.string topic )
                , ( "page", E.int page )
                ]
    in
    E.object
        [ ( "date", E.int (posixToMillis date) )
        , ( "index", E.list encodeIndexEntry index )
        ]


decodeBulletin : D.Decoder BulletinMeta
decodeBulletin =
    let
        decodeIndexEntry =
            D.map2 Tuple.pair
                (D.field "topic" D.string)
                (D.field "page" D.int)
    in
    D.map4 BulletinMeta
        (D.field "issue" D.int)
        (D.field "date" (D.map millisToPosix D.int))
        (D.field "issue" D.int
            |> D.map coverFilename
        )
        (D.field "index" (D.list decodeIndexEntry))


encodeBulletin : BulletinMeta -> E.Value
encodeBulletin { issue, date, cover, index } =
    let
        encodeIndexEntry ( topic, page ) =
            E.object
                [ ( "topic", E.string topic )
                , ( "page", E.int page )
                ]
    in
    E.object
        [ ( "issue", E.int issue )
        , ( "date", E.int (posixToMillis date) )
        , ( "cover"
          , if cover == "" then
                E.null

            else
                E.string cover
          )
        , ( "index", E.list encodeIndexEntry index )
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



-------------------------------------------------------------------------------
----------
-- Misc --
----------


coverFilename : Int -> String
coverFilename n =
    String.fromInt n
        |> String.padLeft 3 '0'
        |> (\s -> "/baseDocumentaire/publications/bulletins/miniatures/" ++ s ++ ".jpg")


extractPubType model =
    case model.displayMode of
        Select pt ->
            pt

        Edit pt ->
            pt

        Upload pt ->
            pt


nextKey : Dict Int a -> Int
nextKey dict =
    Dict.keys dict
        |> List.foldr max 0
        |> (\n -> n + 1)


containerStyle : List (Attribute msg)
containerStyle =
    [ padding 15
    , Background.color grey6
    , Border.rounded 5
    ]


itemStyle : List (Attribute msg)
itemStyle =
    [ padding 15
    , Background.color grey7
    , Border.rounded 5
    ]


parseDate : Zone -> String -> Maybe Posix
parseDate zone s =
    case
        String.split "/" s
            |> List.filterMap String.toInt
    of
        day :: month :: year :: [] ->
            if year < 2000 then
                Nothing

            else
                let
                    choosenTime =
                        newDateRecord year month day 0 0 0 0 zone
                            |> civilToPosix
                in
                Just choosenTime

        _ ->
            Nothing
