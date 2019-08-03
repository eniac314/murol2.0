module PageTreeEditor.PageTreeEditor exposing
    ( Child(..)
    , Mode(..)
    , Model
    , Msg(..)
    , Page(..)
    , decodeContent
    , decodeKeywords
    , decodePage
    , fileIoSelectedPageInfo
    , getFileIoPath
    , getPathFromId
    , init
    , internalPageSelectedPageInfo
    , load
    , loadedContent
    , loadingStatus
    , loadingView
    , prefix
    , resetFileIoSelected
    , setFileIoSelection
    , setInternalPageSelection
    , status
    , update
    , view
    )

import Auth.AuthPlugin exposing (LogInfo(..), cmdIfLogged, newLogIfLogged)
import Base64 exposing (..)
import Dict exposing (..)
import Document.Document exposing (..)
import Document.Json.DocumentDecoder exposing (..)
import Document.Json.DocumentSerializer exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Keyed as Keyed
import Html as Html
import Html.Attributes as HtmlAttr
import Http exposing (..)
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.Icons exposing (chevronsDown, chevronsUp)
import Internals.ToolHelpers exposing (..)
import Json.Decode as Decode
import Json.Decode.Extra
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode
import List.Extra exposing (remove)
import Random
import Set as Set
import Task exposing (..)
import Time exposing (Zone, now, posixToMillis)
import UUID exposing (UUID, canonical)
import Url as Url


type alias Model msg =
    { pageTree : Maybe PageTree
    , contents : Contents
    , selected : Maybe Page
    , fileIoSelected : Maybe Page
    , saveNewSelected : Maybe Page
    , internalPageSelected : Maybe Page
    , pageTreeUpdatedStatus : Status
    , externalMsg : Msg -> msg
    , pageTreeLoaded : Status
    , contentsLoaded : Status
    , keywordsLoaded : Status
    , renamePageBuffer : Maybe String
    , pastePageBuffer : Maybe Page
    , newPageBuffer : String
    , keywords : Set.Set ( String, String )
    , keywordsPromptInput : Maybe String
    , selectedKeyword : Maybe String
    , selectedPageKeyword : Maybe String
    , seed : Maybe Random.Seed
    , lockedPages : List Page
    , lockedContents : Dict String (Maybe Content)
    , lockedKeywords : Set.Set ( String, String )
    , currentTime : Maybe Time.Posix
    , error : String
    }


status : Model msg -> Status
status model =
    combineStatus
        [ model.pageTreeLoaded
        , model.contentsLoaded
        , model.keywordsLoaded
        , model.pageTreeUpdatedStatus
        ]


loadedContent : Model msg -> Maybe Content
loadedContent model =
    Maybe.andThen getMbContentId model.fileIoSelected
        |> Maybe.andThen (\k -> Dict.get (canonical k) model.contents)


selectedPageInfo : Model msg -> Maybe PageInfo
selectedPageInfo model =
    case model.selected of
        Nothing ->
            Nothing

        Just (Page pageInfo xs) ->
            Just pageInfo


fileIoSelectedPageInfo : Model msg -> Maybe PageInfo
fileIoSelectedPageInfo model =
    case model.fileIoSelected of
        Nothing ->
            Nothing

        Just (Page pageInfo xs) ->
            Just pageInfo


internalPageSelectedPageInfo : Model msg -> Maybe PageInfo
internalPageSelectedPageInfo model =
    case model.internalPageSelected of
        Nothing ->
            Nothing

        Just (Page pageInfo xs) ->
            Just pageInfo


setFileIoSelection : Model msg -> Path -> Cmd msg
setFileIoSelection model path =
    Task.perform SetFileIoPage (succeed path)
        |> Cmd.map model.externalMsg


setInternalPageSelection : Model msg -> String -> Cmd msg
setInternalPageSelection model path =
    Task.perform SetInternalPage (succeed <| String.split "/" path)
        |> Cmd.map model.externalMsg


getFileIoPath : Model msg -> Path
getFileIoPath model =
    case model.fileIoSelected of
        Just (Page { path } _) ->
            path

        Nothing ->
            []


getPathFromId : Model msg -> String -> Maybe String
getPathFromId model cId =
    let
        findPath (Page { path, mbContentId } xs) =
            if mbContentId == Result.toMaybe (UUID.fromString cId) then
                Just ("/" ++ String.join "/" path)

            else
                List.filterMap findPath xs
                    |> List.head
    in
    Maybe.map extractPage model.pageTree
        |> Maybe.andThen findPath


type Mode
    = Full
    | Save
    | SaveNew
    | Open
    | Select


type alias Contents =
    Dict String Content


type alias Content =
    { contentId : UUID
    , jsonContent : Decode.Value
    , docContent : Document
    }


init : (Msg -> msg) -> Model msg
init externalMsg =
    { pageTree = Nothing
    , contents = Dict.empty
    , selected = Nothing
    , fileIoSelected = Nothing
    , internalPageSelected = Nothing
    , saveNewSelected = Nothing
    , pageTreeUpdatedStatus = Initial

    --, contentUpdatedStatus = Initial
    , keywordsLoaded = Initial
    , externalMsg = externalMsg
    , pageTreeLoaded = Initial
    , contentsLoaded = Initial
    , renamePageBuffer = Nothing
    , pastePageBuffer = Nothing
    , newPageBuffer = ""
    , keywords = Set.empty
    , keywordsPromptInput = Nothing
    , selectedKeyword = Nothing
    , selectedPageKeyword = Nothing
    , seed = Nothing
    , lockedPages = []
    , lockedContents = Dict.empty
    , lockedKeywords = Set.empty
    , currentTime = Nothing
    , error = ""
    }


load : Model msg -> LogInfo -> Cmd msg
load model logInfo =
    case logInfo of
        LoggedIn { sessionId } ->
            Cmd.map model.externalMsg <|
                Cmd.batch
                    [ getPageTree
                    , getContents sessionId
                    , getKeywords
                    , Task.perform SetInitialSeed Time.now
                    ]

        LoggedOut ->
            Cmd.none


loadingStatus model =
    case ( model.pageTreeLoaded, model.contentsLoaded, model.keywordsLoaded ) of
        ( Success, Success, Success ) ->
            ToolLoadingSuccess

        ( Failure, _, _ ) ->
            ToolLoadingFailure "Erreur chargement arborescence"

        ( _, Failure, _ ) ->
            ToolLoadingFailure "Erreur chargement pages"

        ( _, _, Failure ) ->
            ToolLoadingFailure "Erreur chargement mots clés"

        _ ->
            ToolLoadingWaiting


loadingView model =
    toolLoadingView "Chargement de la stucture du site: "
        { loadingStatus = loadingStatus model }


type Msg
    = ----------------
      -- Selections --
      ----------------
      SelectPage Page
    | FileIOSelectPage Page
    | SelectInternalPage Page
    | SaveNewSelectPage Page
      -----------------------
      -- Cmds from outside --
      -----------------------
    | SetInternalPage Path
    | SetFileIoPage Path
      --------------------------
      -- Initial Data loading --
      --------------------------
    | LoadContents (Result Http.Error Decode.Value)
    | LoadPageTree (Result Http.Error PageTree)
    | LoadKeywords (Result Http.Error (Set.Set ( String, String )))
      ---------------------------
      -- Cmds / Coms to server --
      ---------------------------
    | NewPage
    | SaveContent Page
    | PageTreeUpdated (Maybe Page) Page (Result Http.Error Bool)
    | ContentUpdated UUID (Result Http.Error Bool)
    | RenamePageInput String
    | RenamePage
    | NewPageInput String
    | DeletePage
    | CutPage
    | PastePage
    | Swap Bool
      --------------------
      -- Keywords admin --
      --------------------
    | SelectKeyword String
    | SelectPageKeyword String
    | KeywordInput String
    | NewKeyword
    | SetKeyword
    | UnsetKeyword
    | KeywordUpdated Bool ( String, String ) (Result Http.Error Bool)
      ----------
      -- Misc --
      ----------
    | ResetFileIoSelected
    | SetInitialSeed Time.Posix
    | NoOp


resetFileIoSelected : Model msg -> Cmd msg
resetFileIoSelected model =
    Task.perform (always <| model.externalMsg ResetFileIoSelected) (succeed ())


update :
    { a
        | logInfo : LogInfo
        , currentDocument : Document
        , addLog : Log -> msg
    }
    -> Msg
    -> Model msg
    -> ( Model msg, Cmd msg )
update config msg model =
    case msg of
        SelectPage ((Page pageInfo xs) as page) ->
            ( { model
                | selected = Just page
                , renamePageBuffer = Nothing
              }
            , Cmd.none
            )

        FileIOSelectPage ((Page pageInfo xs) as page) ->
            ( { model
                | fileIoSelected = Just page
              }
            , Cmd.none
            )

        SelectInternalPage ((Page pageInfo xs) as page) ->
            ( { model
                | internalPageSelected = Just page
              }
            , Cmd.none
            )

        SaveNewSelectPage page ->
            ( { model
                | saveNewSelected = Just page
              }
            , Cmd.none
            )

        SetInternalPage path ->
            ( { model
                | internalPageSelected =
                    Maybe.andThen (zipTo path) model.pageTree
                        |> Maybe.map extractPage
              }
            , Cmd.none
            )

        SetFileIoPage path ->
            ( { model
                | fileIoSelected =
                    Maybe.andThen (zipTo path) model.pageTree
                        |> Maybe.map extractPage
              }
            , Cmd.none
            )

        LoadContents res ->
            case res of
                Ok jsonVal ->
                    case Decode.decodeValue decodeContents jsonVal of
                        Ok contents ->
                            ( { model
                                | contents = contents
                                , contentsLoaded = Success
                              }
                            , newLog
                                config.addLog
                                "Chargement des pages réussi"
                                Nothing
                                False
                                False
                            )

                        Err e ->
                            ( { model
                                | contentsLoaded = Failure
                              }
                            , newLog
                                config.addLog
                                "Erreur décodage Json"
                                (Just <| Decode.errorToString e)
                                True
                                True
                            )

                Err e ->
                    ( { model | contentsLoaded = Failure }
                    , newLog
                        config.addLog
                        "Impossible de charger les pages"
                        (Just <| httpErrorToString e)
                        True
                        True
                    )

        LoadPageTree res ->
            case res of
                Ok pageTree ->
                    ( { model
                        | pageTree = Just pageTree
                        , pageTreeLoaded = Success
                      }
                    , newLog
                        config.addLog
                        "Chargement arborescence réussi"
                        Nothing
                        False
                        False
                    )

                Err e ->
                    ( { model | pageTreeLoaded = Failure }
                    , newLog
                        config.addLog
                        "Impossible de charger l'arborescence"
                        (Just <| httpErrorToString e)
                        True
                        True
                    )

        LoadKeywords res ->
            case res of
                Ok keywords ->
                    ( { model
                        | keywords = keywords
                        , keywordsLoaded = Success
                      }
                    , newLog
                        config.addLog
                        "Chargement mots clés réussi"
                        Nothing
                        False
                        False
                    )

                Err e ->
                    ( { model
                        | keywordsLoaded = Failure
                        , error = ""
                      }
                    , newLog
                        config.addLog
                        "Impossible de charger les mots clés"
                        (Just <| httpErrorToString e)
                        True
                        True
                    )

        PageTreeUpdated mbBackup page res ->
            case res of
                Ok True ->
                    ( { model
                        | pageTreeUpdatedStatus = Success
                        , lockedPages = List.Extra.remove page model.lockedPages

                        --, fileIoSelected = Nothing
                        , selected = Nothing
                      }
                    , newLog
                        config.addLog
                        "Arborescence mise à jour"
                        Nothing
                        False
                        False
                    )

                error ->
                    ( { model
                        | pageTreeUpdatedStatus = Failure
                        , lockedPages = List.Extra.remove page model.lockedPages
                        , pageTree =
                            case mbBackup of
                                Just backup ->
                                    Maybe.andThen (zipTo (getPath page)) model.pageTree
                                        |> Maybe.map (updateCurrPageTree backup)
                                        |> Maybe.map rewind

                                Nothing ->
                                    Maybe.andThen (zipTo (getPath page)) model.pageTree
                                        |> Maybe.andThen delete
                                        |> Maybe.map rewind
                      }
                    , case error of
                        Err e ->
                            newLog
                                config.addLog
                                "Echec de la mise à jour de l'arborescence"
                                (Just <| httpErrorToString e)
                                True
                                True

                        _ ->
                            Cmd.none
                    )

        NewPage ->
            if model.newPageBuffer == "" then
                ( model, Cmd.none )

            else
                case ( model.saveNewSelected, model.seed ) of
                    ( Just ((Page pageInfo xs) as page), Just seed ) ->
                        let
                            newPage =
                                Page
                                    { name = model.newPageBuffer
                                    , path = pageInfo.path ++ [ model.newPageBuffer ]
                                    , mbContentId = Nothing
                                    }
                                    []

                            newPageTree =
                                Maybe.andThen (zipTo pageInfo.path) model.pageTree
                                    |> Maybe.map
                                        (updateCurrPageTree
                                            (Page
                                                pageInfo
                                                (xs ++ [ newPage ])
                                            )
                                        )
                                    |> Maybe.map rewind

                            newModel =
                                { model
                                    | pageTree = newPageTree
                                }
                        in
                        update config (SaveContent newPage) newModel

                    _ ->
                        ( model, Cmd.none )

        SaveContent ((Page pageInfo xs) as page) ->
            case model.seed of
                Just seed ->
                    let
                        ( uuid, newSeed ) =
                            Random.step UUID.generator seed

                        contentId =
                            Maybe.withDefault uuid pageInfo.mbContentId

                        mbBackup =
                            Maybe.andThen (zipTo pageInfo.path) model.pageTree
                                |> Maybe.map extractPage

                        mbBackupContent =
                            Dict.get (canonical contentId) model.contents

                        newPage =
                            Page
                                { pageInfo
                                    | mbContentId = Just contentId
                                }
                                xs

                        newPageTree =
                            Maybe.andThen (zipTo pageInfo.path) model.pageTree
                                |> Maybe.map
                                    (updateCurrPageTree
                                        newPage
                                    )
                                |> Maybe.map rewind

                        newContent =
                            { contentId = contentId
                            , jsonContent = encodeDocument config.currentDocument
                            , docContent = config.currentDocument
                            }

                        newContents =
                            Dict.insert (canonical contentId) newContent model.contents
                    in
                    ( { model
                        | --,
                          --    contentUpdatedStatus = Initial
                          pageTreeUpdatedStatus = Waiting
                        , pageTree = newPageTree
                        , contents = newContents
                        , seed = Just newSeed
                        , fileIoSelected =
                            Just <|
                                Page
                                    { pageInfo
                                        | mbContentId = Just contentId
                                    }
                                    xs
                        , lockedPages = newPage :: model.lockedPages
                        , lockedContents =
                            Dict.insert (canonical contentId)
                                mbBackupContent
                                model.lockedContents
                      }
                    , Cmd.batch
                        [ cmdIfLogged
                            config.logInfo
                            (saveContent contentId config.currentDocument)
                            |> Cmd.map model.externalMsg
                        , Maybe.map extractPage newPageTree
                            |> Maybe.map
                                (\pt ->
                                    cmdIfLogged
                                        config.logInfo
                                        (savePageTree
                                            mbBackup
                                            newPage
                                            pt
                                        )
                                )
                            |> Maybe.withDefault Cmd.none
                            |> Cmd.map model.externalMsg
                        , newLogIfLogged
                            config.logInfo
                            config.addLog
                            "Sauvegarde page..."
                            Nothing
                            False
                            True
                        , newLogIfLogged
                            config.logInfo
                            config.addLog
                            "Sauvegarde arborescence..."
                            Nothing
                            False
                            False
                        ]
                    )

                _ ->
                    ( model, Cmd.none )

        ContentUpdated uuid res ->
            case res of
                Ok _ ->
                    ( { model
                        | pageTreeUpdatedStatus = Success
                        , lockedContents =
                            Dict.remove (canonical uuid)
                                model.lockedContents
                        , keywords =
                            Set.filter (\( k, cId ) -> Dict.member cId model.contents)
                                model.keywords
                      }
                    , newLog
                        config.addLog
                        "Page sauvegardée"
                        Nothing
                        False
                        True
                    )

                Err e ->
                    ( { model
                        | pageTreeUpdatedStatus = Failure
                        , lockedContents =
                            Dict.remove (canonical uuid) model.lockedContents
                        , contents =
                            case Dict.get (canonical uuid) model.lockedContents of
                                Just (Just backup) ->
                                    Dict.insert (canonical uuid) backup model.contents

                                _ ->
                                    Dict.remove (canonical uuid) model.contents
                      }
                    , newLog
                        config.addLog
                        "Echec sauvegarde page"
                        (Just <| httpErrorToString e)
                        True
                        True
                    )

        RenamePageInput s ->
            ( { model | renamePageBuffer = Just s }
            , Cmd.none
            )

        RenamePage ->
            case model.selected of
                Just (Page pageInfo xs) ->
                    if validMbStr model.renamePageBuffer then
                        let
                            newPage =
                                Page
                                    { pageInfo
                                        | name =
                                            Maybe.withDefault ""
                                                model.renamePageBuffer
                                    }
                                    xs
                                    |> fixPaths

                            newPageTree =
                                Maybe.andThen (zipTo pageInfo.path) model.pageTree
                                    |> Maybe.map
                                        (updateCurrPageTree
                                            newPage
                                        )
                                    |> Maybe.map rewind
                        in
                        ( { model
                            | pageTree = newPageTree
                            , renamePageBuffer = Nothing
                            , lockedPages = newPage :: model.lockedPages
                            , selected = Nothing
                          }
                        , Maybe.map extractPage newPageTree
                            |> Maybe.map
                                (\pt ->
                                    cmdIfLogged
                                        config.logInfo
                                        (savePageTree
                                            (Just <| Page pageInfo xs)
                                            newPage
                                            pt
                                        )
                                )
                            |> Maybe.withDefault Cmd.none
                            |> Cmd.map model.externalMsg
                        )

                    else
                        ( model, Cmd.none )

                Nothing ->
                    ( model, Cmd.none )

        NewPageInput s ->
            ( { model | newPageBuffer = s }
            , Cmd.none
            )

        DeletePage ->
            case model.selected of
                Just (Page pageInfo xs) ->
                    let
                        mbBackup =
                            Maybe.andThen (zipTo pageInfo.path) model.pageTree
                                |> Maybe.andThen zipUp

                        newPageTree =
                            Maybe.andThen (zipTo pageInfo.path) model.pageTree
                                |> Maybe.andThen delete
                                |> Maybe.map rewind
                    in
                    case Maybe.map extractPage mbBackup of
                        Just backup ->
                            ( { model
                                | pageTree = newPageTree
                                , lockedPages = backup :: model.lockedPages
                                , lockedContents =
                                    Maybe.map
                                        (\cId -> Dict.insert (canonical cId) Nothing model.lockedContents)
                                        (getMbContentId (Page pageInfo xs))
                                        |> Maybe.withDefault model.lockedContents
                                , selected = Nothing
                                , fileIoSelected = Nothing
                              }
                            , Cmd.batch
                                [ Maybe.map
                                    (\pt ->
                                        cmdIfLogged
                                            config.logInfo
                                            (savePageTree
                                                (Just <| backup)
                                                backup
                                                pt
                                            )
                                    )
                                    (Maybe.map extractPage newPageTree)
                                    |> Maybe.withDefault Cmd.none
                                , getMbContentId (Page pageInfo xs)
                                    |> Maybe.map
                                        (\contentId ->
                                            cmdIfLogged
                                                config.logInfo
                                                (deleteContent contentId)
                                        )
                                    |> Maybe.withDefault Cmd.none
                                ]
                                |> Cmd.map model.externalMsg
                            )

                        Nothing ->
                            ( model, Cmd.none )

                Nothing ->
                    ( model, Cmd.none )

        CutPage ->
            case ( model.selected, model.pastePageBuffer ) of
                ( Just page, Nothing ) ->
                    ( { model
                        | lockedPages = page :: model.lockedPages
                        , selected = Nothing
                        , pastePageBuffer = Just page
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        PastePage ->
            case ( model.selected, model.pastePageBuffer ) of
                ( Just (Page pageInfo xs), Just page ) ->
                    let
                        newPageTree =
                            Maybe.andThen (zipTo pageInfo.path) model.pageTree
                                |> Maybe.map
                                    (updateCurrPageTree
                                        (Page
                                            pageInfo
                                            (xs ++ [ page ])
                                        )
                                    )
                                |> Maybe.map rewind
                                |> Maybe.andThen (zipTo <| getPath page)
                                |> Maybe.andThen delete
                                |> Maybe.map rewind
                                |> Maybe.map extractPage
                                |> Maybe.map fixPaths
                                |> Maybe.map initPageTree
                    in
                    ( { model
                        | pastePageBuffer = Nothing
                        , pageTree = newPageTree
                        , selected = Nothing
                      }
                    , Maybe.map extractPage newPageTree
                        |> Maybe.map
                            (\pt ->
                                cmdIfLogged
                                    config.logInfo
                                    (savePageTree
                                        (Just page)
                                        page
                                        pt
                                    )
                            )
                        |> Maybe.withDefault Cmd.none
                        |> Cmd.map model.externalMsg
                    )

                _ ->
                    ( model, Cmd.none )

        Swap up ->
            case model.selected of
                Just (Page pageInfo xs) ->
                    case
                        Maybe.andThen (zipTo pageInfo.path) model.pageTree
                            |> Maybe.andThen
                                (if up then
                                    swapLeft

                                 else
                                    swapRight
                                )
                            |> Maybe.andThen zipUp
                    of
                        Just newPageTree ->
                            let
                                newPage =
                                    extractPage newPageTree
                            in
                            ( { model
                                | pageTree = Just <| rewind newPageTree
                                , lockedPages = newPage :: model.lockedPages
                                , selected = Nothing
                              }
                            , extractPage (rewind newPageTree)
                                |> (\pt ->
                                        cmdIfLogged
                                            config.logInfo
                                            (savePageTree
                                                (Maybe.andThen (zipTo pageInfo.path) model.pageTree
                                                    |> Maybe.andThen zipUp
                                                    |> Maybe.map extractPage
                                                )
                                                newPage
                                                pt
                                            )
                                   )
                                |> Cmd.map model.externalMsg
                            )

                        Nothing ->
                            ( model, Cmd.none )

                Nothing ->
                    ( model, Cmd.none )

        SelectKeyword s ->
            ( { model
                | selectedKeyword =
                    if model.selectedKeyword == Just s then
                        Nothing

                    else
                        Just s
              }
            , Cmd.none
            )

        SelectPageKeyword s ->
            ( { model
                | selectedPageKeyword =
                    if model.selectedPageKeyword == Just s then
                        Nothing

                    else
                        Just s
              }
            , Cmd.none
            )

        KeywordInput s ->
            ( { model
                | keywordsPromptInput = Just s
                , selectedKeyword = Nothing
              }
            , Cmd.none
            )

        NewKeyword ->
            case Maybe.andThen getMbContentId model.selected of
                Just contentId ->
                    if validMbStr model.keywordsPromptInput then
                        let
                            newEntry =
                                ( Maybe.withDefault
                                    ""
                                    model.keywordsPromptInput
                                , canonical contentId
                                )
                        in
                        ( { model
                            | keywords =
                                Set.insert newEntry model.keywords
                            , lockedKeywords =
                                Set.insert newEntry model.lockedKeywords
                            , keywordsPromptInput = Nothing
                            , selectedKeyword = Nothing
                          }
                        , cmdIfLogged
                            config.logInfo
                            (setKeyword newEntry)
                            |> Cmd.map model.externalMsg
                        )

                    else
                        ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        SetKeyword ->
            case
                ( model.selectedKeyword
                , Maybe.andThen getMbContentId model.selected
                )
            of
                ( Just keyword, Just contentId ) ->
                    let
                        newEntry =
                            ( keyword
                            , canonical contentId
                            )
                    in
                    ( { model
                        | keywords =
                            Set.insert newEntry
                                model.keywords
                        , lockedKeywords =
                            Set.insert newEntry model.lockedKeywords
                        , keywordsPromptInput = Nothing
                        , selectedKeyword = Nothing
                      }
                    , cmdIfLogged
                        config.logInfo
                        (setKeyword newEntry)
                        |> Cmd.map model.externalMsg
                    )

                _ ->
                    ( model, Cmd.none )

        UnsetKeyword ->
            case
                ( model.selectedPageKeyword
                , Maybe.andThen getMbContentId model.selected
                )
            of
                ( Just keyword, Just contentId ) ->
                    let
                        newEntry =
                            ( keyword
                            , canonical contentId
                            )
                    in
                    ( { model
                        | keywords =
                            Set.remove newEntry
                                model.keywords
                        , lockedKeywords =
                            Set.insert newEntry model.lockedKeywords
                        , selectedPageKeyword = Nothing
                      }
                    , cmdIfLogged
                        config.logInfo
                        (unsetKeyword newEntry)
                        |> Cmd.map model.externalMsg
                    )

                _ ->
                    ( model, Cmd.none )

        KeywordUpdated unset ( k, cId ) res ->
            case res of
                Ok True ->
                    ( { model
                        | lockedKeywords =
                            Set.remove ( k, cId )
                                model.lockedKeywords
                      }
                    , Cmd.none
                    )

                _ ->
                    ( { model
                        | lockedKeywords =
                            Set.remove ( k, cId )
                                model.lockedKeywords
                        , keywords =
                            if unset then
                                Set.insert ( k, cId ) model.keywords

                            else
                                Set.remove ( k, cId ) model.keywords
                      }
                    , Cmd.none
                    )

        ResetFileIoSelected ->
            ( { model | fileIoSelected = Nothing }
            , Cmd.none
            )

        SetInitialSeed t ->
            ( { model
                | seed =
                    posixToMillis t
                        |> Random.initialSeed
                        |> Just
                , currentTime = Just t
              }
            , Cmd.none
            )

        NoOp ->
            ( model, Cmd.none )



-------------------------------------------------------------------------------
--------------------
-- Http functions --
--------------------


getPageTree : Cmd Msg
getPageTree =
    let
        body =
            Encode.object
                []
                |> Http.jsonBody
    in
    Http.post
        { url = "getPageTree.php"
        , body = body
        , expect =
            Http.expectJson
                LoadPageTree
                decodePageTree
        }


getContents : String -> Cmd Msg
getContents sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "getContents.php"
        , body = body
        , expect =
            Http.expectJson
                LoadContents
                Decode.value
        }


getKeywords : Cmd Msg
getKeywords =
    let
        body =
            Encode.object
                []
                |> Http.jsonBody
    in
    Http.post
        { url = "getKeywords.php"
        , body = body
        , expect =
            Http.expectJson
                LoadKeywords
                decodeKeywords
        }


savePageTree : Maybe Page -> Page -> Page -> String -> Cmd Msg
savePageTree mbPage page pageTree sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                , ( "pageTree"
                  , encodePage pageTree
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "savePageTree.php"
        , body = body
        , expect =
            Http.expectJson
                (PageTreeUpdated mbPage page)
                decodeSuccess
        }


saveContent : UUID -> Document -> String -> Cmd Msg
saveContent contentId doc sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                , ( "contentId"
                  , Encode.string (canonical contentId)
                  )
                , ( "content"
                  , encodeDocument doc
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "saveContent.php"
        , body = body
        , expect =
            Http.expectJson
                (ContentUpdated contentId)
                decodeSuccess
        }


setKeyword : ( String, String ) -> String -> Cmd Msg
setKeyword ( keyword, contentId ) sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                , ( "contentId"
                  , Encode.string contentId
                  )
                , ( "keyword"
                  , Encode.string keyword
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "setKeyword.php"
        , body = body
        , expect =
            Http.expectJson
                (KeywordUpdated False ( keyword, contentId ))
                decodeSuccess
        }


unsetKeyword : ( String, String ) -> String -> Cmd Msg
unsetKeyword ( keyword, contentId ) sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                , ( "contentId"
                  , Encode.string contentId
                  )
                , ( "keyword"
                  , Encode.string keyword
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "unsetKeyword.php"
        , body = body
        , expect =
            Http.expectJson
                (KeywordUpdated True ( keyword, contentId ))
                decodeSuccess
        }


deleteContent : UUID -> String -> Cmd Msg
deleteContent contentId sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                , ( "contentId"
                  , Encode.string (canonical contentId)
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "deleteContent.php"
        , body = body
        , expect =
            Http.expectJson
                (ContentUpdated contentId)
                decodeSuccess
        }



-------------------------------------------------------------------------------
--------------------
-- Json functions --
--------------------
-- Decoders:


decodeKeywords : Decode.Decoder (Set.Set ( String, String ))
decodeKeywords =
    Decode.list decodeKeyword
        |> Decode.map Set.fromList


decodeKeyword : Decode.Decoder ( String, String )
decodeKeyword =
    Decode.succeed (\k cid -> ( k, cid ))
        |> Pipeline.required "keyword" Decode.string
        |> Pipeline.required "contentId" Decode.string


decodeContents : Decode.Decoder Contents
decodeContents =
    Decode.list decodeContent
        |> Decode.map (List.map (\c -> ( canonical c.contentId, c )))
        |> Decode.map Dict.fromList


decodeContent : Decode.Decoder Content
decodeContent =
    Decode.succeed Content
        |> Pipeline.required "contentId" decodeUUID
        |> Pipeline.required "jsonContent" Decode.value
        |> Pipeline.required "jsonContent" decodeDocument


decodePageTree : Decode.Decoder PageTree
decodePageTree =
    decodePage
        |> Decode.map
            initPageTree


decodePage : Decode.Decoder Page
decodePage =
    Decode.succeed Page
        |> Pipeline.requiredAt
            [ "Page", "pageInfo" ]
            decodePageInfo
        |> Pipeline.requiredAt
            [ "Page", "children" ]
            (Decode.list
                (Decode.lazy (\_ -> decodePage))
            )


decodePageInfo : Decode.Decoder PageInfo
decodePageInfo =
    Decode.succeed PageInfo
        |> Pipeline.required "name" Decode.string
        |> Pipeline.required "path"
            (Decode.string
                |> Decode.map (String.split "/")
            )
        |> Pipeline.required "mbContentId"
            (Decode.nullable decodeUUID)


decodeUUID : Decode.Decoder UUID
decodeUUID =
    Decode.string
        |> Decode.andThen
            (Json.Decode.Extra.fromResult << UUID.fromString)


decodeSuccess : Decode.Decoder Bool
decodeSuccess =
    Decode.at [ "message" ] (Decode.succeed True)



-- Encoders:


encodePage : Page -> Encode.Value
encodePage (Page pageInfo children) =
    Encode.object
        [ ( "Page"
          , Encode.object
                [ ( "pageInfo", encodePageInfo pageInfo )
                , ( "children", Encode.list encodePage children )
                ]
          )
        ]


encodePageInfo : PageInfo -> Encode.Value
encodePageInfo { name, path, mbContentId } =
    Encode.object
        [ ( "name", Encode.string name )
        , ( "path"
          , String.join "/" path
                |> Encode.string
          )
        , ( "mbContentId"
          , Maybe.map canonical mbContentId
                |> Maybe.map Encode.string
                |> Maybe.withDefault Encode.null
          )
        ]



-------------------------------------------------------------------------------
-------------------------
-- Page tree functions --
-------------------------


type Page
    = Page PageInfo (List Page)


type alias PageInfo =
    { name : String
    , path : Path
    , mbContentId : Maybe UUID
    }


type alias Path =
    List String


type alias PageTree =
    { current : Page
    , contexts : List Context
    }


type alias Context =
    { parent : PageInfo
    , left : List Page
    , right : List Page
    }


initPageTree : Page -> PageTree
initPageTree page =
    { current = page
    , contexts = []
    }


extractPage : PageTree -> Page
extractPage { current, contexts } =
    current


updateCurrPageTree : Page -> PageTree -> PageTree
updateCurrPageTree new pageTree =
    { pageTree | current = new }


rewind : PageTree -> PageTree
rewind pageTree =
    case zipUp pageTree of
        Nothing ->
            pageTree

        Just pageTree_ ->
            rewind pageTree_


zipUp : PageTree -> Maybe PageTree
zipUp pageTree =
    case pageTree.contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            Just
                { pageTree
                    | current =
                        Page parent
                            (left ++ [ pageTree.current ] ++ right)
                    , contexts = cs
                }


zipDown : (Page -> Bool) -> PageTree -> Maybe PageTree
zipDown pred pageTree =
    case pageTree.current of
        Page _ [] ->
            Nothing

        Page pageInfo xs ->
            let
                ( l, r ) =
                    break pred xs
            in
            case r of
                [] ->
                    Nothing

                p :: ps ->
                    Just
                        { pageTree
                            | current = p
                            , contexts =
                                { parent = pageInfo
                                , left = l
                                , right = ps
                                }
                                    :: pageTree.contexts
                        }


zipTo : Path -> PageTree -> Maybe PageTree
zipTo path pageTree =
    let
        helper remainingPath pageTree_ =
            case remainingPath of
                [] ->
                    Nothing

                curr :: [] ->
                    if getName (extractPage pageTree_) /= curr then
                        Nothing

                    else
                        Just pageTree_

                curr :: next :: rest ->
                    if getName (extractPage pageTree_) /= curr then
                        Nothing

                    else
                        zipDown (\page -> getName page == next) pageTree_
                            |> Maybe.andThen (helper (next :: rest))
    in
    helper path pageTree


fixPaths : Page -> Page
fixPaths homePage =
    let
        helper currPath (Page pageInfo ps) =
            Page { pageInfo | path = currPath ++ [ pageInfo.name ] }
                (List.map (helper (currPath ++ [ pageInfo.name ])) ps)
    in
    helper
        (getPath homePage
            |> List.reverse
            |> List.tail
            |> Maybe.map List.reverse
            |> Maybe.withDefault []
        )
        homePage


isSubPage : Page -> Page -> Bool
isSubPage mbSubPage ((Page _ xs) as page) =
    List.foldr (\p acc -> p == mbSubPage || acc) (page == mbSubPage) xs


delete : PageTree -> Maybe PageTree
delete { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            Just
                { current = Page parent (left ++ right)
                , contexts = cs
                }


swapLeft : PageTree -> Maybe PageTree
swapLeft { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            case List.reverse left of
                [] ->
                    Nothing

                d :: ds ->
                    Just
                        { current = current
                        , contexts =
                            { parent = parent
                            , left = List.reverse ds
                            , right = d :: right
                            }
                                :: cs
                        }


swapRight : PageTree -> Maybe PageTree
swapRight { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            case right of
                [] ->
                    Nothing

                d :: ds ->
                    Just
                        { current = current
                        , contexts =
                            { parent = parent
                            , left = left ++ [ d ]
                            , right = ds
                            }
                                :: cs
                        }



-------------------------------------------------------------------------------


insert : Page -> Maybe Page -> Maybe Page
insert p mbPage_ =
    let
        homePage =
            Page
                { name = "accueil"
                , path = [ "accueil" ]
                , mbContentId = Nothing
                }
                []

        helper path mbPage =
            case mbPage of
                Nothing ->
                    case path of
                        [] ->
                            helper
                                path
                                (Just <| homePage)

                        home :: _ ->
                            if home /= getName homePage then
                                Nothing

                            else
                                helper
                                    path
                                    (Just <| homePage)

                Just (Page pageInfo children) ->
                    case path of
                        [] ->
                            Just <| Page pageInfo children

                        curr :: [] ->
                            if curr /= pageInfo.name then
                                Nothing

                            else if List.any (\c -> getName c == getName p) children then
                                Just <| Page pageInfo children

                            else
                                Just <| Page pageInfo (p :: children)

                        curr :: next :: rest ->
                            if curr /= pageInfo.name then
                                Nothing

                            else
                                let
                                    ( l, r ) =
                                        break (\p_ -> getName p_ == next) children
                                in
                                case r of
                                    [] ->
                                        let
                                            newPage =
                                                Page
                                                    { name = next
                                                    , path =
                                                        pageInfo.path
                                                            ++ [ next ]
                                                    , mbContentId = Nothing
                                                    }
                                                    []
                                        in
                                        helper (next :: rest) (Just newPage)
                                            |> Maybe.andThen
                                                (\nsbt -> Just <| Page pageInfo (nsbt :: children))

                                    next_ :: rest_ ->
                                        helper (next :: rest) (Just next_)
                                            |> Maybe.andThen
                                                (\nsbt -> Just <| Page pageInfo (l ++ nsbt :: rest_))
    in
    List.reverse (getPath p)
        |> List.tail
        |> Maybe.map List.reverse
        |> Maybe.andThen (\path -> helper path mbPage_)



-------------------------------------------------------------------------------
--------------------
-- View functions --
--------------------


view :
    { maxHeight : Int
    , zone : Time.Zone
    , logInfo : LogInfo
    , mode : Mode
    }
    -> Model msg
    -> Element msg
view config model =
    Element.map model.externalMsg <|
        column
            [ spacing 15
            , Font.size 16
            , alignTop
            , padding 10
            , width fill
            , height (maximum config.maxHeight fill)
            ]
            [ case config.mode of
                Full ->
                    fullView config model

                Save ->
                    saveView config model

                SaveNew ->
                    saveNewView config model

                Open ->
                    openView config model

                Select ->
                    selectView config model
            ]


fullView : { config | mode : Mode } -> Model msg -> Element.Element Msg
fullView config model =
    row
        [ spacing 15
        , padding 5
        , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
        , clip
        , width fill
        , height fill
        ]
        [ column
            [ spacing 15
            , alignTop
            , Border.solid
            , Border.widthEach
                { top = 0
                , bottom = 0
                , left = 0
                , right = 2
                }
            , Border.color (rgb 0.8 0.8 0.8)
            , height fill
            , width (px 430)
            , paddingEach
                { top = 0
                , bottom = 0
                , left = 0
                , right = 15
                }
            , scrollbarY

            --, Background.color blue5
            ]
            [ el
                [ Font.bold
                , Font.size 18
                ]
                (text "Modification arborescence")
            , row [ spacing 15 ]
                [ Input.text
                    (textInputStyle ++ [ width (px 250), spacing 0 ])
                    { onChange = RenamePageInput
                    , text =
                        if model.renamePageBuffer == Nothing then
                            Maybe.map getName model.selected
                                |> Maybe.withDefault ""

                        else
                            Maybe.withDefault "" model.renamePageBuffer
                    , placeholder =
                        Nothing
                    , label =
                        Input.labelLeft [] Element.none
                    }
                , Input.button
                    (saveButtonStyle (model.selected /= Nothing))
                    { onPress =
                        Maybe.map (\_ -> RenamePage) model.selected
                    , label =
                        row [ spacing 10 ]
                            [ text "Renommer"
                            ]
                    }
                ]
            , row
                [ spacing 15 ]
                [ Input.button
                    (saveButtonStyle (model.selected /= Nothing))
                    { onPress =
                        Maybe.map (\_ -> Swap True) model.selected
                    , label =
                        row [ spacing 10 ]
                            [ el [] (html <| chevronsUp 18)
                            , text "Monter"
                            ]
                    }
                , Input.button
                    (saveButtonStyle (model.selected /= Nothing))
                    { onPress =
                        Maybe.map (\_ -> Swap False) model.selected
                    , label =
                        row [ spacing 10 ]
                            [ el [] (html <| chevronsDown 18)
                            , text "Descendre"
                            ]
                    }
                ]
            , row
                [ spacing 15 ]
                [ Input.button
                    (buttonStyle (model.selected /= Nothing && model.pastePageBuffer == Nothing))
                    { onPress =
                        if model.pastePageBuffer == Nothing then
                            Maybe.map (\_ -> CutPage) model.selected

                        else
                            Nothing
                    , label =
                        row [ spacing 10 ]
                            [ text "Couper"
                            ]
                    }
                , Input.button
                    (saveButtonStyle (model.selected /= Nothing && model.pastePageBuffer /= Nothing))
                    { onPress =
                        if model.pastePageBuffer /= Nothing then
                            Maybe.map (\_ -> PastePage) model.selected

                        else
                            Nothing
                    , label =
                        row [ spacing 10 ]
                            [ text "Coller"
                            ]
                    }
                , Input.button
                    (deleteButtonStyle (model.selected /= Nothing))
                    { onPress =
                        Maybe.map (\_ -> DeletePage) model.selected
                    , label =
                        row [ spacing 10 ]
                            [ text "Supprimer"
                            ]
                    }
                ]
            , keywordsAdminView config model
            ]
        , column
            [ htmlAttribute (HtmlAttr.style "flex-shrink" "1")
            , clip
            , width fill
            , height fill
            , spacing 15
            ]
            [ column
                [ paddingXY 15 10
                , Background.color (rgb 0.95 0.95 0.95)
                , width fill
                ]
                [ wrappedRow
                    [ width fill
                    , Background.color (rgb 1 1 1)
                    , padding 4
                    , Border.rounded 5
                    , Font.family
                        [ Font.monospace ]
                    ]
                    (Maybe.map getPath model.selected
                        |> Maybe.map (List.map text)
                        |> Maybe.map
                            (List.intersperse
                                (el [ paddingXY 2 4 ] (text "/"))
                            )
                        |> Maybe.map (\res -> el [ paddingXY 2 4 ] (text "/") :: res)
                        |> Maybe.withDefault [ el [ paddingXY 2 4 ] (text "/") ]
                    )
                ]
            , pageTreeView config model
            ]
        ]


keywordsAdminView : { config | mode : Mode } -> Model msg -> Element.Element Msg
keywordsAdminView config model =
    let
        visibleKeywords =
            model.keywords
                |> Set.map Tuple.first
                |> Set.toList
                |> List.filter
                    (\k ->
                        String.contains
                            (Maybe.withDefault ""
                                model.keywordsPromptInput
                            )
                            k
                    )

        pageKeywords =
            case Maybe.andThen getMbContentId model.selected of
                Nothing ->
                    []

                Just contentId ->
                    model.keywords
                        |> Set.filter
                            (\( c, cId ) ->
                                cId == canonical contentId
                            )
                        |> Set.map Tuple.first
                        |> Set.toList

        keywordView isPageKeyword k =
            let
                ( handler, selected ) =
                    if isPageKeyword then
                        ( Events.onClick (SelectPageKeyword k)
                        , model.selectedPageKeyword == Just k
                        )

                    else
                        ( Events.onClick (SelectKeyword k)
                        , model.selectedKeyword == Just k
                        )
            in
            el
                [ width fill
                , handler
                , paddingXY 5 5
                , pointer
                , if selected then
                    Background.color
                        (rgba 0 0 1 0.3)

                  else
                    noAttr
                ]
                (text k)
    in
    column
        [ spacing 15
        , Border.widthEach
            { top = 2
            , bottom = 0
            , left = 0
            , right = 0
            }
        , Border.color (rgb 0.8 0.8 0.8)
        , paddingEach
            { top = 15
            , bottom = 0
            , left = 0
            , right = 0
            }
        , width fill
        ]
        [ el
            [ Border.widthEach
                { top = 0
                , bottom = 2
                , left = 0
                , right = 0
                }
            , Border.color (rgb 0.8 0.8 0.8)
            , paddingEach
                { top = 0
                , bottom = 15
                , left = 0
                , right = 0
                }
            , width fill
            ]
            (case Maybe.map extractPage model.pageTree of
                Nothing ->
                    Element.none

                Just page ->
                    row
                        [ spacing 10 ]
                        [ el [ Font.bold ] (text "SiteMap: ")
                        , el []
                            (html <|
                                Html.a
                                    [ HtmlAttr.href <|
                                        "data:application/octet-stream;charset=utf-16le;base64,"
                                            ++ Base64.encode (siteMap model page)
                                    , HtmlAttr.download "sitemap.xml"
                                    ]
                                    [ Html.text "sitemap.xml" ]
                            )
                        ]
            )
        , el
            [ Font.bold
            , Font.size 18
            ]
            (text "Gestion mots clés")
        , Input.text
            (textInputStyle ++ [ width (px 300), spacing 0 ])
            { onChange = KeywordInput
            , text =
                if model.keywordsPromptInput == Nothing then
                    Maybe.withDefault "" model.selectedKeyword

                else
                    Maybe.withDefault "" model.keywordsPromptInput
            , placeholder =
                Nothing
            , label =
                Input.labelLeft [] Element.none
            }
        , row
            [ spacing 15
            , width fill
            ]
            [ column
                [ Border.width 2
                , Border.color (rgb 0.8 0.8 0.8)
                , width (px 200)
                , height (px 400)
                , scrollbars
                ]
                (List.map (keywordView False) visibleKeywords)
            , column
                [ Border.width 2
                , Border.color (rgb 0.8 0.8 0.8)
                , width (px 200)
                , height (px 400)
                , scrollbars
                ]
                (List.map (keywordView True) pageKeywords)
            ]
        , row
            [ spacing 15 ]
            [ Input.button
                (saveButtonStyle
                    ((Maybe.andThen getMbContentId model.selected
                        /= Nothing
                     )
                        && ((model.selectedKeyword
                                /= Nothing
                            )
                                || validMbStr model.keywordsPromptInput
                           )
                    )
                )
                { onPress =
                    if
                        (Maybe.andThen getMbContentId model.selected /= Nothing)
                            && (model.selectedKeyword /= Nothing)
                    then
                        Just SetKeyword

                    else if
                        (Maybe.andThen getMbContentId model.selected /= Nothing)
                            && validMbStr model.keywordsPromptInput
                    then
                        Just NewKeyword

                    else
                        Nothing
                , label =
                    row [ spacing 10 ]
                        [ text "Associer mot clé" ]
                }
            , Input.button
                (saveButtonStyle
                    ((Maybe.andThen getMbContentId model.selected
                        /= Nothing
                     )
                        && (model.selectedPageKeyword
                                /= Nothing
                           )
                    )
                )
                { onPress =
                    if
                        (Maybe.andThen getMbContentId model.selected /= Nothing)
                            && (model.selectedPageKeyword /= Nothing)
                    then
                        Just UnsetKeyword

                    else
                        Nothing
                , label =
                    row [ spacing 10 ]
                        [ text "Dissocier mot clé" ]
                }
            ]
        ]


saveView : { config | mode : Mode } -> Model msg -> Element.Element Msg
saveView config model =
    column
        [ spacing 15
        , padding 5
        , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
        , clip
        , width fill
        , height fill
        ]
        [ el
            [ Font.bold
            , Font.size 18
            ]
            (text "Enregistrer")
        , pageTreeView config model
        , Input.button
            (saveButtonStyle (model.fileIoSelected /= Nothing))
            { onPress =
                Maybe.map SaveContent model.fileIoSelected
            , label =
                row [ spacing 10 ]
                    [ text "Valider"
                    ]
            }
        ]


saveNewView : { config | mode : Mode } -> Model msg -> Element.Element Msg
saveNewView config model =
    let
        canSave =
            (model.saveNewSelected /= Nothing)
                && (model.newPageBuffer /= "")
    in
    column
        [ spacing 20
        , padding 5
        , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
        , clip
        , width fill
        , height fill
        ]
        [ el
            [ Font.bold
            , Font.size 18
            ]
            (text "Enregistrement nouvelle page")
        , column
            [ spacing 15
            , clip
            , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
            , height fill
            , width fill
            ]
            [ el
                []
                (text "Emplacement de la page dans l'arborescence:")
            , pageTreeView config model
            ]
        , row [ spacing 15 ]
            [ Input.text
                (textInputStyle ++ [ width (px 250), spacing 0 ])
                { onChange = NewPageInput
                , text = model.newPageBuffer
                , placeholder =
                    Just <| Input.placeholder [] (text "titre de la nouvelle page")
                , label =
                    Input.labelLeft [] Element.none
                }
            ]
        , Input.button
            (saveButtonStyle canSave)
            { onPress =
                if canSave then
                    Just NewPage

                else
                    Nothing
            , label =
                row [ spacing 10 ]
                    [ text "Enregistrer"
                    ]
            }
        ]


openView : { config | mode : Mode } -> Model msg -> Element.Element Msg
openView config model =
    column
        [ spacing 15
        , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
        , clip
        , width fill
        , height fill
        ]
        [ el
            [ Font.bold
            , Font.size 18
            ]
            (text "Charger une page")
        , pageTreeView config model
        ]


selectView : { config | mode : Mode } -> Model msg -> Element.Element Msg
selectView config model =
    column
        [ spacing 15
        , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
        , clip
        , width fill
        , height fill
        ]
        [ pageTreeView config model
        ]


type Child
    = LastChild Bool
    | NotLastChild Bool


pageTreeView : { config | mode : Mode } -> Model msg -> Element.Element Msg
pageTreeView config model =
    let
        selected =
            case config.mode of
                Full ->
                    model.selected

                Select ->
                    model.internalPageSelected

                SaveNew ->
                    model.saveNewSelected

                _ ->
                    model.fileIoSelected
    in
    column
        [ spacing 2
        , width fill
        , Font.size 14
        , Font.family
            [ Font.monospace
            ]
        , scrollbars
        , height fill
        ]
        (model.pageTree
            |> Maybe.map rewind
            |> Maybe.map extractPage
            |> Maybe.map
                (pageTreeView_ config [] selected model.contents model.lockedPages)
            |> Maybe.withDefault []
        )


pageTreeView_ :
    { config | mode : Mode }
    -> List Child
    -> Maybe Page
    -> Dict String Content
    -> List Page
    -> Page
    -> List (Element.Element Msg)
pageTreeView_ config offsets selected contents locked (Page pageInfo children) =
    let
        l =
            List.length children

        ( firsts, last ) =
            ( List.take (l - 1) children, List.drop (l - 1) children )

        isLocked =
            List.any identity
                (List.map (isSubPage (Page pageInfo children)) locked)

        attrs =
            case config.mode of
                Full ->
                    let
                        selectable =
                            not isLocked
                    in
                    (if selectable then
                        [ Events.onClick (SelectPage (Page pageInfo children))
                        , pointer
                        , mouseOver
                            [ if selected == Just (Page pageInfo children) then
                                Font.color (rgba 0 0 1 1)

                              else
                                Font.color (rgba 0 0 1 0.5)
                            ]
                        ]

                     else
                        []
                    )
                        ++ [ if selected == Just (Page pageInfo children) then
                                Font.color (rgba 0 0 1 1)

                             else
                                noAttr
                           ]

                Save ->
                    [ if selected == Just (Page pageInfo children) then
                        Font.color (rgba 0 0 1 1)

                      else
                        Font.color (rgba 0.8 0.8 0.8 1)
                    ]

                SaveNew ->
                    let
                        fontColor =
                            case pageInfo.mbContentId of
                                Nothing ->
                                    Font.color (rgba 0.8 0.8 0.8 1)

                                Just contentId ->
                                    case Dict.get (canonical contentId) contents of
                                        Just _ ->
                                            noAttr

                                        Nothing ->
                                            Font.color (rgba 1 0 0 0.7)
                    in
                    [ Events.onClick (SaveNewSelectPage (Page pageInfo children))
                    , pointer
                    , mouseOver
                        [ if selected == Just (Page pageInfo children) then
                            Font.color (rgba 0 0 1 1)

                          else
                            Font.color (rgba 0 0 1 0.5)
                        ]
                    ]
                        ++ [ if selected == Just (Page pageInfo children) then
                                Font.color (rgba 0 0 1 1)

                             else
                                fontColor
                           ]

                Open ->
                    let
                        selectable =
                            pageInfo.mbContentId
                                |> Maybe.map (\k -> Dict.get (canonical k) contents)
                                |> (\res -> res /= Nothing)

                        fontColor =
                            case pageInfo.mbContentId of
                                Nothing ->
                                    Font.color (rgba 0.8 0.8 0.8 1)

                                Just contentId ->
                                    case Dict.get (canonical contentId) contents of
                                        Just _ ->
                                            noAttr

                                        Nothing ->
                                            Font.color (rgba 1 0 0 0.7)
                    in
                    (if selectable then
                        [ Events.onClick (FileIOSelectPage (Page pageInfo children))
                        , pointer
                        , mouseOver
                            [ if selected == Just (Page pageInfo children) then
                                Font.color (rgba 0 0 1 1)

                              else
                                Font.color (rgba 0 0 1 0.5)
                            ]
                        ]

                     else
                        []
                    )
                        ++ [ if selected == Just (Page pageInfo children) then
                                Font.color (rgba 0 0 1 1)

                             else
                                fontColor
                           ]

                Select ->
                    [ Events.onClick (SelectInternalPage (Page pageInfo children))
                    , pointer
                    , mouseOver
                        [ if selected == Just (Page pageInfo children) then
                            Font.color (rgba 0 0 1 1)

                          else
                            Font.color (rgba 0 0 1 0.5)
                        ]
                    , if selected == Just (Page pageInfo children) then
                        Font.color (rgba 0 0 1 1)

                      else
                        noAttr
                    ]
    in
    [ row
        [ width fill ]
        (prefix offsets
            ++ [ Keyed.el
                    (attrs
                        ++ [ if isLocked then
                                Font.color (rgba 0.8 0.8 0.8 1)

                             else
                                noAttr
                           ]
                    )
                    ( String.join "/" pageInfo.path
                    , text <| pageInfo.name
                    )
               ]
        )
    ]
        ++ List.concatMap
            (pageTreeView_
                config
                (NotLastChild True
                    :: offsets
                )
                selected
                contents
                locked
            )
            firsts
        ++ List.concatMap
            (pageTreeView_
                config
                (LastChild True :: offsets)
                selected
                contents
                locked
            )
            last


prefix : List Child -> List (Element msg)
prefix offsets =
    let
        attrs sel =
            [ if sel then
                Font.color (rgba 0 0 1 1)

              else
                Font.color (rgba 0.8 0.8 0.8 1)
            ]

        helper acc indexes =
            case indexes of
                [] ->
                    [ row [] acc ]

                (LastChild sel) :: [] ->
                    acc
                        ++ [ el
                                (attrs sel)
                                (text <| String.repeat 3 " " ++ "└─ ")
                           ]

                (NotLastChild sel) :: [] ->
                    acc
                        ++ [ el
                                (attrs sel)
                                (text <| String.repeat 3 " " ++ "├─ ")
                           ]

                (LastChild sel) :: xs ->
                    helper
                        (acc
                            ++ [ row
                                    (attrs sel)
                                    [ text <| String.repeat 3 " " ++ " " ]
                               ]
                        )
                        xs

                (NotLastChild sel) :: xs ->
                    helper
                        (acc
                            ++ [ el
                                    (attrs sel)
                                    (text <| String.repeat 3 " " ++ "│")
                               ]
                        )
                        xs
    in
    helper [] (List.reverse offsets)



-------------------------------------------------------------------------------
------------------------
-- SiteMap generation --
------------------------


siteMap : Model msg -> Page -> String
siteMap model page =
    case model.currentTime of
        Just ct ->
            let
                urlStr loc =
                    "<url>\n"
                        ++ "<loc>"
                        ++ loc
                        ++ "</loc>\n"
                        ++ "<lastmod>"
                        ++ dateToW3c ct
                        ++ "</lastmod>\n"
                        ++ "</url>\n"

                helper (Page pageInfo children) =
                    (("https://www.murol.fr/"
                        ++ (List.map Url.percentEncode pageInfo.path
                                |> String.join "/"
                           )
                     )
                        |> urlStr
                    )
                        ++ (List.map helper children
                                |> String.join ""
                           )
            in
            "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
                ++ "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n"
                ++ helper page
                ++ urlStr "https://www.murol.fr/accueil/plan%20de%20site"
                ++ urlStr "https://www.murol.fr/accueil/contact"
                ++ urlStr "https://www.murol.fr/accueil/mentions%20l%C3%A9gales"
                ++ "</urlset>\n"

        Nothing ->
            ""



-------------------------------------------------------------------------------


getName (Page { name } _) =
    name


getPath (Page { path } _) =
    path


getMbContentId (Page { mbContentId } _) =
    mbContentId


break : (a -> Bool) -> List a -> ( List a, List a )
break p xs =
    let
        helper ys left =
            case ys of
                [] ->
                    ( left, [] )

                y :: ys_ ->
                    if p y then
                        ( List.reverse left, y :: ys_ )

                    else
                        helper ys_ (y :: left)
    in
    helper xs []


validMbStr : Maybe String -> Bool
validMbStr mbStr =
    (mbStr /= Nothing) && (mbStr /= Just "")


emptyPages : Page -> Page
emptyPages (Page pageInfo xs) =
    Page { pageInfo | mbContentId = Nothing } (List.map emptyPages xs)



-------------------------------------------------------------------------------
