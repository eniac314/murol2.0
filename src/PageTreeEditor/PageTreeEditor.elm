module PageTreeEditor.PageTreeEditor exposing (..)

import Auth.AuthPlugin exposing (LogInfo(..), cmdIfLogged)
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


type alias Model msg =
    { pageTree : Maybe PageTree
    , contents : Contents
    , selected : Maybe Page
    , fileIoSelected : Maybe Page
    , saveAsSelected : Maybe Page
    , internalPageSelected : Maybe Page
    , pageTreeUpdatedStatus : Status
    , contentUpdatedStatus : Status
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
    , error : String
    }


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


setInternalPageSelection : Model msg -> String -> Cmd msg
setInternalPageSelection model path =
    Task.perform SetInternalPage (succeed <| String.split "/" path)
        |> Cmd.map model.externalMsg


type Mode
    = Full
    | Save
    | SaveAs
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
    , saveAsSelected = Nothing
    , pageTreeUpdatedStatus = Initial
    , contentUpdatedStatus = Initial
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
    | SaveAsSelectPage Page
      -----------------------
      -- Cmds from outside --
      -----------------------
    | SetInternalPage Path
      --------------------------
      -- Initial Data loading --
      --------------------------
    | LoadContents (Result Http.Error Decode.Value)
    | LoadPageTree (Result Http.Error PageTree)
    | LoadKeywords (Result Http.Error (Set.Set ( String, String )))
      ---------------------------
      -- Cmds / Coms to server --
      ---------------------------
    | PageTreeUpdated (Maybe Page) Page (Result Http.Error Bool)
    | SaveContent Page
    | ContentUpdated UUID (Result Http.Error Bool)
    | RenamePageInput String
    | RenamePage
    | NewPageInput String
    | NewPage
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
    | SetInitialSeed Time.Posix
    | NoOp


update :
    { a
        | logInfo : LogInfo
        , currentDocument : Document
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
        , currentDocument : Document
    }
    -> Msg
    -> Model msg
    -> ( Model msg, Cmd Msg )
internalUpdate config msg model =
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

        SaveAsSelectPage page ->
            ( { model
                | saveAsSelected = Just page
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

        LoadContents res ->
            case res of
                Ok jsonVal ->
                    case Decode.decodeValue decodeContents jsonVal of
                        Ok contents ->
                            ( { model
                                | contents = contents
                                , contentsLoaded = Success
                              }
                            , Cmd.none
                            )

                        Err e ->
                            ( { model
                                | contentsLoaded = Failure
                              }
                            , Cmd.none
                            )

                Err _ ->
                    ( { model | contentsLoaded = Failure }
                    , Cmd.none
                    )

        LoadPageTree res ->
            case res of
                Ok pageTree ->
                    ( { model
                        | pageTree = Just pageTree
                        , pageTreeLoaded = Success
                      }
                    , Cmd.none
                    )

                Err _ ->
                    ( { model | pageTreeLoaded = Failure }
                    , Cmd.none
                    )

        LoadKeywords res ->
            case res of
                Ok keywords ->
                    ( { model
                        | keywords = keywords
                        , keywordsLoaded = Success
                      }
                    , Cmd.none
                    )

                Err e ->
                    ( { model
                        | keywordsLoaded = Failure
                        , error = ""
                      }
                    , Cmd.none
                    )

        PageTreeUpdated mbBackup page res ->
            case res of
                Ok True ->
                    ( { model
                        | pageTreeUpdatedStatus = Success
                        , lockedPages = remove page model.lockedPages
                      }
                    , Cmd.none
                    )

                _ ->
                    ( { model
                        | pageTreeUpdatedStatus = Failure
                        , lockedPages = remove page model.lockedPages
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
                    , Cmd.none
                    )

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
                        | contentUpdatedStatus = Initial
                        , pageTreeUpdatedStatus = Initial
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
                        ]
                    )

                _ ->
                    ( model, Cmd.none )

        ContentUpdated uuid res ->
            case res of
                Ok True ->
                    ( { model
                        | pageTreeUpdatedStatus = Success
                        , lockedContents =
                            Dict.remove (canonical uuid)
                                model.lockedContents
                        , keywords =
                            Set.filter (\( k, cId ) -> Dict.member cId model.contents)
                                model.keywords
                      }
                    , Cmd.none
                    )

                _ ->
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
                    , Cmd.none
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
                        )
                    else
                        ( model, Cmd.none )

                Nothing ->
                    ( model, Cmd.none )

        NewPageInput s ->
            ( { model | newPageBuffer = s }
            , Cmd.none
            )

        NewPage ->
            if model.newPageBuffer == "" then
                ( model, Cmd.none )
            else
                case ( model.saveAsSelected, model.seed ) of
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
                        in
                        ( { model
                            | pageTree = newPageTree
                            , newPageBuffer = ""
                            , pageTreeUpdatedStatus = Initial
                            , lockedPages = newPage :: model.lockedPages
                          }
                        , Maybe.map extractPage newPageTree
                            |> Maybe.map
                                (\pt ->
                                    cmdIfLogged
                                        config.logInfo
                                        (savePageTree
                                            Nothing
                                            newPage
                                            pt
                                        )
                                )
                            |> Maybe.withDefault Cmd.none
                        )

                    _ ->
                        ( model, Cmd.none )

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
                            )

                        Nothing ->
                            ( model, Cmd.none )

                Nothing ->
                    ( model, Cmd.none )

        SelectKeyword s ->
            ( { model | selectedKeyword = Just s }
            , Cmd.none
            )

        SelectPageKeyword s ->
            ( { model | selectedPageKeyword = Just s }
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

        SetInitialSeed t ->
            ( { model
                | seed =
                    posixToMillis t
                        |> Random.initialSeed
                        |> Just
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

        request =
            Http.post "getPageTree.php" body decodePageTree
    in
    Http.send LoadPageTree request


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

        request =
            Http.post "getContents.php" body Decode.value
    in
    Http.send LoadContents request


getKeywords : Cmd Msg
getKeywords =
    let
        body =
            Encode.object
                []
                |> Http.jsonBody

        request =
            Http.post "getKeywords.php" body decodeKeywords
    in
    Http.send LoadKeywords request


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

        request =
            Http.post "savePageTree.php" body decodeSuccess
    in
    Http.send (PageTreeUpdated mbPage page) request


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

        request =
            Http.post "saveContent.php" body decodeSuccess
    in
    Http.send (ContentUpdated contentId) request


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

        request =
            Http.post "setKeyword.php" body decodeSuccess
    in
    Http.send (KeywordUpdated False ( keyword, contentId )) request


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

        request =
            Http.post "unsetKeyword.php" body decodeSuccess
    in
    Http.send (KeywordUpdated True ( keyword, contentId )) request


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

        request =
            Http.post "deleteContent.php" body decodeSuccess
    in
    Http.send (ContentUpdated contentId) request



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
            , padding 15
            , width fill
            , height (maximum config.maxHeight fill)
            ]
            [ case config.mode of
                Full ->
                    fullView config model

                Save ->
                    saveView config model

                SaveAs ->
                    saveAsView config model

                Open ->
                    openView config model

                Select ->
                    selectView config model
            ]


fullView : { config | mode : Mode } -> Model msg -> Element.Element Msg
fullView config model =
    row
        [ spacing 15
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
            , paddingEach
                { top = 0
                , bottom = 0
                , left = 0
                , right = 15
                }
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
                    (buttonStyle (model.selected /= Nothing))
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
                    (buttonStyle (model.selected /= Nothing))
                    { onPress =
                        Maybe.map (\_ -> Swap True) model.selected
                    , label =
                        row [ spacing 10 ]
                            [ el [] (html <| chevronsUp 18)
                            , text "Monter"
                            ]
                    }
                , Input.button
                    (buttonStyle (model.selected /= Nothing))
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
                    (buttonStyle (model.selected /= Nothing && model.pastePageBuffer /= Nothing))
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
                    (buttonStyle (model.selected /= Nothing))
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
                (buttonStyle
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
                (buttonStyle
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
            (buttonStyle (model.fileIoSelected /= Nothing))
            { onPress =
                Maybe.map SaveContent model.fileIoSelected
            , label =
                row [ spacing 10 ]
                    [ text "Valider"
                    ]
            }
        ]


saveAsView : { config | mode : Mode } -> Model msg -> Element.Element Msg
saveAsView config model =
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
            (text "Enregistrer sous")
        , row [ spacing 15 ]
            [ Input.text
                (textInputStyle ++ [ width (px 250), spacing 0 ])
                { onChange = NewPageInput
                , text = model.newPageBuffer
                , placeholder =
                    Nothing
                , label =
                    Input.labelLeft [] Element.none
                }
            , Input.button
                (buttonStyle True)
                { onPress =
                    Just <| NewPage
                , label =
                    row [ spacing 10 ]
                        [ text "Nouvelle page"
                        ]
                }
            ]
        , pageTreeView config model
        , Input.button
            (buttonStyle (model.saveAsSelected /= Nothing))
            { onPress =
                Maybe.map SaveContent model.saveAsSelected
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

                SaveAs ->
                    model.saveAsSelected

                _ ->
                    model.fileIoSelected
    in
    column
        [ spacing 2
        , width fill
        , Font.size 14
        , Font.family
            [ Font.monospace ]
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
                        , mouseOver [ Font.color (rgba 0 0 1 1) ]
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

                SaveAs ->
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
                    [ Events.onClick (SaveAsSelectPage (Page pageInfo children))
                    , pointer
                    , mouseOver [ Font.color (rgba 0 0 1 1) ]
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
                        , mouseOver [ Font.color (rgba 0 0 1 1) ]
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
                    , mouseOver [ Font.color (rgba 0 0 1 1) ]
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



-------------------------------------------------------------------------------
