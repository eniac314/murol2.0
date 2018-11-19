port module PageEditor.PageEditor exposing (..)

import Auth.AuthPlugin exposing (LogInfo(..), getLogInfo)
import Browser.Dom as Dom
import Browser.Events exposing (onResize)
import Delay exposing (..)
import Dict exposing (..)
import Document.Document exposing (..)
import Document.DocumentViews.DocumentResponsive exposing (..)
import Document.DocumentViews.DocumentView exposing (..)
import Document.DocumentViews.StyleSheets exposing (..)
import Document.Json.DocumentDecoder exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events exposing (..)
import Element.Font as Font
import Element.Input as Input
import Element.Lazy exposing (lazy)
import FileExplorer.FileExplorer as FileExplorer
import GeneralDirectoryEditor.GeneralDirectoryEditor as GeneralDirectoryEditor exposing (Model)
import Html exposing (map)
import Html.Attributes as HtmlAttr
import Internals.CommonStyleHelpers exposing (..)
import Internals.Icons exposing (..)
import Json.Decode as Decode
import Json.Encode exposing (Value, null)
import PageEditor.EditorPlugins.BlockLinksPlugin as BlockLinksPlugin
import PageEditor.EditorPlugins.ContainerEditPlugin as ContainerEditPlugin
import PageEditor.EditorPlugins.ImagePlugin as ImagePlugin
import PageEditor.EditorPlugins.NewDocPlugin as NewDocPlugin
import PageEditor.EditorPlugins.SidePanels.DocumentStructView exposing (..)
import PageEditor.EditorPlugins.TablePlugin as TablePlugin
import PageEditor.EditorPlugins.TextBlockPlugin as TextBlockPlugin
import PageEditor.EditorPlugins.VideoPlugin as VideoPlugin
import PageEditor.EditorPlugins.FichesPlugin as FichesPlugin exposing (..)
import PageEditor.Internals.DocumentEditorHelpers exposing (..)
import PageEditor.Internals.DocumentZipper exposing (..)
import PageEditor.Internals.PersistencePlugin as PersistencePlugin
import PageTreeEditor.PageTreeEditor as PageTreeEditor
import PortFunnel exposing (FunnelSpec, GenericMessage, ModuleDesc, StateAccessors)
import PortFunnel.LocalStorage as LocalStorage
import Task exposing (perform)
import Time exposing (Posix, Zone, here, millisToPosix, utc)
import Yajson exposing (..)
import Yajson.Stringify exposing (..)


subscriptions : Model msg -> Sub msg
subscriptions model =
    Sub.map model.externalMsg <|
        Sub.batch
            [ subPort Process
            , onResize WinResize
            ]


port cmdPort : Value -> Cmd msg


port subPort : (Value -> msg) -> Sub msg


type alias FunnelState =
    -- FunnelState packages the states of all the modules using portFunnel
    { storage : LocalStorage.State }


type
    Funnel msg
    -- a Funnel is a module using port-funnel, only one constructor here
    -- StorageFunnel (FunnelSpec FunnelState LocalStorage.State LocalStorage.Message LocalStorage.Response Model Msg)
    = StorageFunnel (AppFunnel LocalStorage.State LocalStorage.Message LocalStorage.Response msg)


type alias AppFunnel substate message response msg =
    -- exists only to shorten Funnel type definition
    -- could be used to add other constructors to the Funnel type
    FunnelSpec FunnelState substate message response (Model msg) msg


funnels : Dict String (Funnel msg)
funnels =
    -- Each entry corresponds to one funnel for one port-funnel using module
    -- only one entry here
    Dict.fromList
        [ ( LocalStorage.moduleName
          , StorageFunnel <|
                FunnelSpec
                    --
                    -- StateAccessors FunnelState LocalStorage.State
                    storageAccessors
                    --
                    -- ModuleDesc message substate response
                    LocalStorage.moduleDesc
                    --
                    -- (GenericMessage -> Cmd msg) -> response -> Cmd msg
                    -- always return Cmd.none
                    LocalStorage.commander
                    --
                    -- response -> state -> model -> ( model, Cmd msg )
                    storageHandler
          )
        ]


storageAccessors : StateAccessors FunnelState LocalStorage.State
storageAccessors =
    --type alias StateAccessors state substate =
    --    { get : state -> substate
    --    , set : substate -> state -> state
    --    }
    -- substate -> LocalStorage.State
    -- state -> FunnelState
    --Package up an application's functions for accessing one funnel module's state.
    StateAccessors .storage (\substate state -> { state | storage = substate })


storageHandler : LocalStorage.Response -> FunnelState -> Model msg -> ( Model msg, Cmd msg )
storageHandler response state mdl =
    let
        model =
            { mdl | funnelState = state }
    in
        case response of
            -- A `Response` is used to return values for `Get` and `ListKeys`.
            LocalStorage.GetResponse { key, value } ->
                ( { model
                    | localStorageKey = key
                    , localStorageValue = value
                  }
                , Cmd.none
                )

            LocalStorage.ListKeysResponse { keys } ->
                ( { model | localStorageKeys = keys }, Cmd.none )

            _ ->
                ( model, Cmd.none )


type alias Model msg =
    { config : Config msg
    , document : DocZipper
    , undoCache : List DocZipper
    , clipboard : Maybe Document
    , nextUid : Int
    , controlDown : Bool
    , menuClicked : Bool
    , menuFocused : String
    , funnelState : FunnelState
    , localStorageKey : String
    , localStorageValue : Maybe Value
    , localStorageKeys : List String
    , jsonBuffer : String
    , currentPlugin : Maybe EditorPlugin
    , tablePlugin : TablePlugin.Model msg
    , textBlockPlugin : TextBlockPlugin.Model msg
    , imagePlugin : ImagePlugin.Model msg
    , videoPlugin : VideoPlugin.Model msg
    , blockLinksPlugin : BlockLinksPlugin.Model msg
    , fichesPlugin : FichesPlugin.Model msg
    , externalMsg : Msg -> msg
    }


currentDocument : Model msg -> Document
currentDocument model =
    rewind model.document
        |> extractDoc


type Msg
    = ----------------------------------------------
      -- Dom manipulation && Dom events processing--
      ----------------------------------------------
      CurrentViewport Dom.Viewport
    | WinResize Int Int
    | MainInterfaceViewport (Result Dom.Error Dom.Viewport)
    | JumpTo (Maybe String)
    | KeyDown String
    | KeyUp String
      ---------------------------------
      -- Document Zipper manipulation--
      ---------------------------------
    | SelectDoc Int
    | ZipToUid Int
    | Rewind
    | SwapLeft
    | SwapRight
    | EditCell
    | EditContainer
    | SwapContainerType ContainerLabel
    | AddNewInside
    | AddNewLeft
    | AddNewRight
    | CreateNewContainer ContainerLabel
    | CreateNewCell EditorPlugin
    | DeleteSelected
    | Copy
    | Cut
    | Paste
    | Undo
      --------------
      -- Main menu--
      --------------
    | MenuClick
    | MenuClickOff
    | TopEntryFocused String
    | SetPreviewMode PreviewMode
    | SetSeason Season
    | ToogleCountainersColors
    | SetEditorPlugin (Maybe EditorPlugin)
      -----------------------------
      -- Plugins messages routing--
      -----------------------------
    | TablePluginMsg TablePlugin.Msg
    | TextBlockPluginMsg TextBlockPlugin.Msg
    | ImagePluginMsg ImagePlugin.Msg
    | VideoPluginMsg VideoPlugin.Msg
    | BlockLinksPluginMsg BlockLinksPlugin.Msg
    | FichesPluginMsg FichesPlugin.Msg
      -------------------
      -- Persistence   --
      -------------------
    | LoadLocalStorageDocument
    | SetLocalStorageKey String
    | SetLocalStorageValue Json.Encode.Value
    | SetJsonBuffer String
    | GetFromLocalStorage
    | PutInLocalStorage
    | RemoveFromLocalStorage
    | ClearLocalStorage
    | ListKeys
    | Process Json.Encode.Value
      ---------
      -- Misc--
      ---------
    | LoadDocument
    | NoOp


undoCacheDepth =
    4


init =
    reset


reset : Maybe Document -> (Msg -> msg) -> ( Model msg, Cmd msg )
reset mbDoc externalMsg =
    let
        doc_ =
            Maybe.withDefault emptyDoc mbDoc

        ( newTextBlockPlugin, textBlockPluginCmds ) =
            TextBlockPlugin.init [] Nothing (externalMsg << TextBlockPluginMsg)

        ( newImagePlugin, imagePluginCmds ) =
            ImagePlugin.init Nothing (externalMsg << ImagePluginMsg)

        handlers =
            { containerClickHandler = externalMsg << SelectDoc
            , containerDblClickHandler = \_ -> externalMsg NoOp
            , cellClick = externalMsg EditCell
            , neighbourClickHandler = \_ -> externalMsg Rewind
            }

        config =
            { width = 1920
            , height = 1080
            , mainInterfaceHeight = 75
            , customElems = Dict.empty
            , zipperHandlers = Just handlers
            , editMode = True
            , previewMode = PreviewScreen
            , containersBkgColors = False
            , season = Spring
            , pageIndex = Dict.empty
            , fiches = Dict.empty
            }

        funnelState =
            { storage = LocalStorage.initialState "Editor" }
    in
        ( { config = config
          , document = initZip doc_
          , clipboard = Nothing
          , undoCache = []
          , nextUid = maxUid doc_ + 1
          , controlDown = False
          , menuClicked = False
          , menuFocused = ""
          , funnelState = funnelState
          , localStorageKey = ""
          , localStorageValue = Nothing
          , localStorageKeys = []
          , jsonBuffer = ""
          , currentPlugin = Nothing
          , tablePlugin = TablePlugin.init Nothing (externalMsg << TablePluginMsg)
          , textBlockPlugin = newTextBlockPlugin
          , imagePlugin = newImagePlugin
          , videoPlugin = VideoPlugin.init Nothing (externalMsg << VideoPluginMsg)
          , blockLinksPlugin = BlockLinksPlugin.init Nothing (externalMsg << BlockLinksPluginMsg)
          , fichesPlugin = FichesPlugin.init [] (externalMsg << FichesPluginMsg)
          , externalMsg = externalMsg
          }
        , Cmd.batch
            [ Cmd.map externalMsg <|
                Task.perform CurrentViewport Dom.getViewport
            , Cmd.map externalMsg <|
                Task.attempt MainInterfaceViewport
                    (Dom.getViewportOf "mainInterface")
            , textBlockPluginCmds
            , imagePluginCmds
            , LocalStorage.send
                cmdPort
                (LocalStorage.listKeys "")
                funnelState.storage
            , Time.now
                |> Task.andThen
                    (\t ->
                        Time.here
                            |> Task.andThen
                                (\h ->
                                    Task.succeed (timeToSeason h t)
                                )
                    )
                |> Task.perform SetSeason
                |> Cmd.map externalMsg
            ]
        )


update :
    { config
        | pageTreeEditor : PageTreeEditor.Model msg
        , genDirEditor : GeneralDirectoryEditor.Model msg
    }
    -> Msg
    -> Model msg
    -> ( Model msg, Cmd msg, Maybe a )
update config msg model =
    let
        ( newModel, cmds ) =
            internalUpdate config msg model
    in
        ( newModel, cmds, Nothing )


internalUpdate :
    { config
        | pageTreeEditor : PageTreeEditor.Model msg
        , genDirEditor : GeneralDirectoryEditor.Model msg
    }
    -> Msg
    -> Model msg
    -> ( Model msg, Cmd msg )
internalUpdate config msg model =
    case msg of
        ----------------------------------------------
        -- Dom manipulation && Dom events processing--
        ----------------------------------------------
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
                            , previewMode =
                                if vp.viewport.width < 1300 then
                                    PreviewTablet
                                else
                                    PreviewScreen
                        }
                  }
                , Cmd.none
                )

        MainInterfaceViewport res ->
            case res of
                Ok { viewport } ->
                    let
                        currentConfig =
                            model.config
                    in
                        ( { model
                            | config =
                                { currentConfig
                                    | mainInterfaceHeight =
                                        round viewport.height
                                }
                          }
                        , Cmd.none
                        )

                Err (Dom.NotFound s) ->
                    ( model, Cmd.none )

        WinResize width height ->
            let
                cfg =
                    model.config

                newConfig =
                    { cfg | width = width, height = height }
            in
                ( { model | config = newConfig }
                , Cmd.batch
                    [ Task.attempt (model.externalMsg << MainInterfaceViewport)
                        (Dom.getViewportOf "mainInterface")
                    ]
                )

        JumpTo id ->
            ( model, Cmd.map model.externalMsg <| scrollTo id )

        KeyDown s ->
            if s == "Control" then
                ( { model | controlDown = True }, Cmd.none )
            else
                ( model, Cmd.none )

        KeyUp s ->
            if s == "Control" then
                ( { model | controlDown = False }, Cmd.none )
            else
                ( model, Cmd.none )

        ---------------------------------
        -- Document Zipper manipulation--
        ---------------------------------
        SelectDoc uid ->
            case
                zipDown (hasUid uid) model.document
            of
                Nothing ->
                    ( model, Cmd.none )

                Just newDocument ->
                    ( { model
                        | document = newDocument
                      }
                    , Cmd.none
                    )

        ZipToUid uid ->
            case zipToUid uid model.document of
                Nothing ->
                    ( model, Cmd.none )

                Just newDocument ->
                    ( { model
                        | document = newDocument
                      }
                    , Cmd.batch
                        [ scrollTo <| getHtmlId (extractDoc newDocument) ]
                        |> Cmd.map model.externalMsg
                    )

        Rewind ->
            ( { model
                | document =
                    rewind model.document
              }
            , Cmd.none
            )

        SwapLeft ->
            case swapLeft model.document of
                Nothing ->
                    ( model, Cmd.none )

                Just newDoc ->
                    ( { model | document = newDoc }
                    , Cmd.batch
                        [ scrollTo <| getHtmlId (extractDoc newDoc)
                        ]
                        |> Cmd.map model.externalMsg
                    )

        SwapRight ->
            case swapRight model.document of
                Nothing ->
                    ( model, Cmd.none )

                Just newDoc ->
                    ( { model | document = newDoc }
                    , Cmd.batch
                        [ scrollTo <| getHtmlId (extractDoc newDoc)
                        ]
                        |> Cmd.map model.externalMsg
                    )

        EditCell ->
            openPlugin config model

        EditContainer ->
            ( { model | currentPlugin = Just ContainerEditPlugin }
            , Cmd.none
            )

        SwapContainerType containerLabel ->
            case extractDoc model.document of
                Container cv children ->
                    let
                        newDoc =
                            Container { cv | containerLabel = containerLabel } children
                    in
                        ( { model
                            | document =
                                updateCurrent newDoc model.document
                            , currentPlugin = Nothing
                          }
                        , Cmd.none
                        )

                _ ->
                    ( model, Cmd.none )

        AddNewInside ->
            case addNewInside model.nextUid model.document of
                Nothing ->
                    ( model, Cmd.none )

                Just newDoc ->
                    ( { model
                        | document = newDoc
                        , nextUid = model.nextUid + 1
                      }
                    , Cmd.none
                    )

        AddNewLeft ->
            case addNewLeft model.nextUid model.document of
                Nothing ->
                    ( model, Cmd.none )

                Just newDoc ->
                    ( { model
                        | document = newDoc
                        , nextUid = model.nextUid + 1
                      }
                    , Cmd.batch
                        [ scrollTo <| getHtmlId (extractDoc newDoc)
                        ]
                        |> Cmd.map model.externalMsg
                    )

        AddNewRight ->
            case addNewRight model.nextUid model.document of
                Nothing ->
                    ( model, Cmd.none )

                Just newDoc ->
                    ( { model
                        | document = newDoc
                        , nextUid = model.nextUid + 1
                      }
                    , Cmd.batch
                        [ scrollTo <| getHtmlId (extractDoc newDoc)
                        ]
                        |> Cmd.map model.externalMsg
                    )

        CreateNewContainer containerLabel ->
            ( { model
                | document =
                    updateCurrent (newContainer model.nextUid containerLabel) model.document
                , nextUid = model.nextUid + 2
                , currentPlugin = Nothing
              }
            , Cmd.batch
                []
            )

        CreateNewCell plugin ->
            let
                ( newModel, cmd ) =
                    { model | currentPlugin = Just plugin }
                        |> openNewPlugin config
            in
                ( { newModel | nextUid = model.nextUid + 1 }
                , Cmd.batch
                    [ cmd ]
                )

        DeleteSelected ->
            let
                newDoc =
                    safeDeleteCurrent model.nextUid model.document
            in
                ( { model
                    | document =
                        Maybe.withDefault model.document
                            newDoc
                    , undoCache =
                        model.document
                            :: model.undoCache
                            |> List.take undoCacheDepth
                    , nextUid = model.nextUid + 1
                  }
                , Cmd.none
                )

        Copy ->
            ( { model
                | clipboard =
                    Just <| extractDoc model.document
              }
            , Cmd.none
            )

        Cut ->
            let
                currentDoc =
                    extractDoc model.document

                newDoc =
                    safeDeleteCurrent model.nextUid model.document
            in
                ( { model
                    | document =
                        Maybe.withDefault model.document
                            newDoc
                    , undoCache =
                        model.document
                            :: model.undoCache
                            |> List.take undoCacheDepth
                    , nextUid = model.nextUid + 1
                    , clipboard = Just currentDoc
                  }
                , Cmd.none
                )

        Paste ->
            case ( extractDoc model.document, model.clipboard ) of
                ( Container cv xs, Just doc ) ->
                    let
                        newDoc =
                            Container cv (xs ++ [ doc ])
                    in
                        ( { model
                            | document = updateCurrent newDoc model.document
                            , clipboard = Nothing
                          }
                        , Cmd.none
                        )

                _ ->
                    ( model, Cmd.none )

        Undo ->
            case model.undoCache of
                [] ->
                    ( model, Cmd.none )

                zipper :: xs ->
                    ( { model
                        | document = zipper
                        , undoCache = xs
                      }
                    , Cmd.none
                    )

        --------------
        -- Main menu--
        --------------
        MenuClick ->
            ( { model | menuClicked = not model.menuClicked }
            , Cmd.none
            )

        MenuClickOff ->
            ( { model | menuClicked = False }
            , Cmd.none
            )

        TopEntryFocused label ->
            ( { model | menuFocused = label }
            , Cmd.none
            )

        SetPreviewMode pm ->
            let
                config_ =
                    model.config

                newConfig =
                    { config_
                        | previewMode = pm
                    }
            in
                ( { model | config = newConfig }
                , Cmd.none
                )

        SetSeason season ->
            let
                config_ =
                    model.config
            in
                ( { model | config = { config_ | season = season } }
                , Cmd.none
                )

        ToogleCountainersColors ->
            let
                config_ =
                    model.config

                newConfig =
                    { config_
                        | containersBkgColors =
                            not config_.containersBkgColors
                    }
            in
                ( { model | config = newConfig }, Cmd.none )

        SetEditorPlugin mbPlugin ->
            ( { model | currentPlugin = mbPlugin }, Cmd.none )

        -----------------------------
        -- Plugins messages routing--
        -----------------------------
        TablePluginMsg tableMsg ->
            let
                ( newTablePlugin, mbEditorPluginResult ) =
                    TablePlugin.update tableMsg model.tablePlugin
            in
                case mbEditorPluginResult of
                    Nothing ->
                        ( { model | tablePlugin = newTablePlugin }
                        , Cmd.none
                        )

                    Just EditorPluginQuit ->
                        ( { model
                            | tablePlugin = newTablePlugin
                            , currentPlugin = Nothing
                          }
                        , Cmd.batch
                            [ scrollTo <| getHtmlId (extractDoc model.document) ]
                            |> Cmd.map model.externalMsg
                        )

                    Just (EditorPluginData tm) ->
                        let
                            newDoc =
                                updateCurrent
                                    (Cell
                                        { id = getId (extractDoc model.document)
                                        , attrs = getAttrs (extractDoc model.document)
                                        , cellContent = Table tm
                                        }
                                    )
                                    model.document
                        in
                            ( { model
                                | document = newDoc
                                , currentPlugin = Nothing
                              }
                            , Cmd.batch
                                [ scrollTo <| getHtmlId (extractDoc model.document) ]
                                |> Cmd.map model.externalMsg
                            )

        TextBlockPluginMsg textBlockMsg ->
            let
                ( newTextBlockPlugin, textBlockPluginCmds, mbEditorPluginResult ) =
                    TextBlockPlugin.update
                        { pageTreeEditor = config.pageTreeEditor }
                        textBlockMsg
                        model.textBlockPlugin
            in
                case mbEditorPluginResult of
                    Nothing ->
                        ( { model | textBlockPlugin = newTextBlockPlugin }
                        , Cmd.batch
                            [ textBlockPluginCmds
                            ]
                        )

                    Just EditorPluginQuit ->
                        ( { model
                            | textBlockPlugin = newTextBlockPlugin
                            , currentPlugin = Nothing
                          }
                        , Cmd.batch
                            [ Cmd.map model.externalMsg <|
                                scrollTo <|
                                    getHtmlId (extractDoc model.document)
                            , textBlockPluginCmds
                            ]
                        )

                    Just (EditorPluginData ( tbElems, attrs )) ->
                        let
                            newDoc =
                                updateCurrent
                                    (Cell
                                        { id = getId (extractDoc model.document)
                                        , cellContent = TextBlock tbElems
                                        , attrs = attrs
                                        }
                                    )
                                    model.document
                        in
                            ( { model
                                | document = newDoc
                                , currentPlugin = Nothing
                              }
                            , Cmd.batch
                                [ Cmd.map model.externalMsg <|
                                    scrollTo <|
                                        getHtmlId (extractDoc model.document)
                                , textBlockPluginCmds
                                ]
                            )

        ImagePluginMsg imgPlugMsg ->
            let
                ( newImagePlugin, imagePluginCmds, mbEditorPluginResult ) =
                    ImagePlugin.update config imgPlugMsg model.imagePlugin
            in
                case mbEditorPluginResult of
                    Nothing ->
                        ( { model | imagePlugin = newImagePlugin }
                        , imagePluginCmds
                        )

                    Just EditorPluginQuit ->
                        ( { model
                            | imagePlugin = newImagePlugin
                            , currentPlugin = Nothing
                          }
                        , Cmd.batch
                            [ Cmd.map model.externalMsg <|
                                scrollTo <|
                                    getHtmlId (extractDoc model.document)
                            , imagePluginCmds
                            ]
                        )

                    Just (EditorPluginData ( imgMeta, attrs )) ->
                        let
                            newDoc =
                                updateCurrent
                                    (Cell
                                        { id = getId (extractDoc model.document)
                                        , cellContent = Image imgMeta
                                        , attrs = attrs
                                        }
                                    )
                                    model.document
                        in
                            ( { model
                                | document = newDoc
                                , currentPlugin = Nothing
                              }
                            , Cmd.batch
                                [ Cmd.map model.externalMsg <|
                                    scrollTo <|
                                        getHtmlId (extractDoc model.document)
                                , imagePluginCmds
                                ]
                            )

        VideoPluginMsg vidPlugMsg ->
            let
                ( newVideoPlugin, mbEditorPluginResult ) =
                    VideoPlugin.update vidPlugMsg model.videoPlugin
            in
                case mbEditorPluginResult of
                    Nothing ->
                        ( { model | videoPlugin = newVideoPlugin }, Cmd.none )

                    Just EditorPluginQuit ->
                        ( { model
                            | videoPlugin = newVideoPlugin
                            , currentPlugin = Nothing
                          }
                        , Cmd.map model.externalMsg <|
                            scrollTo <|
                                getHtmlId (extractDoc model.document)
                        )

                    Just (EditorPluginData ( videoMeta, attrs )) ->
                        let
                            newDoc =
                                updateCurrent
                                    (Cell
                                        { id = getId (extractDoc model.document)
                                        , cellContent = Video videoMeta
                                        , attrs = attrs
                                        }
                                    )
                                    model.document
                        in
                            ( { model
                                | document = newDoc
                                , currentPlugin = Nothing
                              }
                            , Cmd.batch
                                [ Cmd.map model.externalMsg <|
                                    scrollTo <|
                                        getHtmlId (extractDoc model.document)
                                ]
                            )

        BlockLinksPluginMsg blockLinksPluginMsg ->
            let
                ( newBlockLinksPlugin, mbEditorPluginResult ) =
                    BlockLinksPlugin.update blockLinksPluginMsg model.blockLinksPlugin
            in
                case mbEditorPluginResult of
                    Nothing ->
                        ( { model | blockLinksPlugin = newBlockLinksPlugin }, Cmd.none )

                    Just EditorPluginQuit ->
                        ( { model
                            | blockLinksPlugin = newBlockLinksPlugin
                            , currentPlugin = Nothing
                          }
                        , Cmd.map model.externalMsg <|
                            scrollTo <|
                                getHtmlId (extractDoc model.document)
                        )

                    Just (EditorPluginData newBlockLinks) ->
                        let
                            newDoc =
                                updateCurrent
                                    (Cell
                                        { id = getId (extractDoc model.document)
                                        , cellContent = newBlockLinks
                                        , attrs = []
                                        }
                                    )
                                    model.document
                        in
                            ( { model
                                | document = newDoc
                                , currentPlugin = Nothing
                              }
                            , Cmd.batch
                                [ Cmd.map model.externalMsg <|
                                    scrollTo <|
                                        getHtmlId (extractDoc model.document)
                                ]
                            )

        FichesPluginMsg fichesPluginMsg ->
            let
                ( newFichesPlugin, mbEditorPluginResult ) =
                    FichesPlugin.update config fichesPluginMsg model.fichesPlugin
            in
                case mbEditorPluginResult of
                    Nothing ->
                        ( { model | fichesPlugin = newFichesPlugin }
                        , Cmd.none
                        )

                    Just EditorPluginQuit ->
                        ( { model
                            | fichesPlugin = newFichesPlugin
                            , currentPlugin = Nothing
                          }
                        , Cmd.map model.externalMsg <|
                            scrollTo <|
                                getHtmlId (extractDoc model.document)
                        )

                    Just (EditorPluginData newFichesIds) ->
                        let
                            newDoc =
                                updateCurrent
                                    (Cell
                                        { id = getId (extractDoc model.document)
                                        , cellContent = Fiches newFichesIds
                                        , attrs = []
                                        }
                                    )
                                    model.document
                        in
                            ( { model
                                | document = newDoc
                                , currentPlugin = Nothing
                              }
                            , Cmd.batch
                                [ Cmd.map model.externalMsg <|
                                    scrollTo <|
                                        getHtmlId (extractDoc model.document)
                                ]
                            )

        LoadLocalStorageDocument ->
            case Maybe.map (Decode.decodeValue decodeDocument) model.localStorageValue of
                Just (Ok newDoc) ->
                    let
                        ( newModel, cmd ) =
                            reset (Just newDoc) model.externalMsg
                    in
                        ( { newModel | currentPlugin = Just PersistencePlugin }
                        , cmd
                        )

                _ ->
                    ( model, Cmd.none )

        SetLocalStorageKey key ->
            ( { model | localStorageKey = key }, Cmd.none )

        SetLocalStorageValue val ->
            ( { model
                | localStorageValue = Just val
                , jsonBuffer =
                    Yajson.fromValue val
                        |> (\res ->
                                case res of
                                    Ok json ->
                                        pretty json

                                    Err error ->
                                        "error"
                           )
              }
            , Cmd.none
            )

        SetJsonBuffer s ->
            let
                newLocalStorageValue =
                    case Decode.decodeString Decode.value s of
                        Ok value ->
                            Just value

                        Err _ ->
                            Nothing

                newBuffer =
                    Yajson.fromValue (Maybe.withDefault null newLocalStorageValue)
                        |> (\res ->
                                case res of
                                    Ok json ->
                                        pretty json

                                    Err error ->
                                        "error"
                           )
            in
                ( { model
                    | jsonBuffer = newBuffer
                    , localStorageValue =
                        newLocalStorageValue
                  }
                , Cmd.none
                )

        GetFromLocalStorage ->
            ( model
            , LocalStorage.send
                cmdPort
                (LocalStorage.get model.localStorageKey)
                model.funnelState.storage
                |> Cmd.map model.externalMsg
            )

        PutInLocalStorage ->
            ( model
            , Cmd.batch
                [ LocalStorage.send
                    cmdPort
                    (LocalStorage.put
                        model.localStorageKey
                        model.localStorageValue
                    )
                    model.funnelState.storage
                , after 500 Millisecond ListKeys
                ]
                |> Cmd.map model.externalMsg
            )

        RemoveFromLocalStorage ->
            ( model
            , Cmd.batch
                [ LocalStorage.send
                    cmdPort
                    (LocalStorage.put
                        model.localStorageKey
                        Nothing
                    )
                    model.funnelState.storage
                , after 500 Millisecond ListKeys
                ]
                |> Cmd.map model.externalMsg
            )

        ClearLocalStorage ->
            ( model
            , Cmd.batch
                [ LocalStorage.send
                    cmdPort
                    (LocalStorage.clear "")
                    model.funnelState.storage
                , after 500 Millisecond ListKeys
                ]
                |> Cmd.map model.externalMsg
            )

        ListKeys ->
            ( model
            , LocalStorage.send
                cmdPort
                (LocalStorage.listKeys "")
                model.funnelState.storage
                |> Cmd.map model.externalMsg
            )

        Process val ->
            -- processes all messages incoming from subPort,
            -- for all modules using portFunnel
            case PortFunnel.decodeGenericMessage val of
                Err _ ->
                    ( model, Cmd.none )

                Ok genericMessage ->
                    let
                        moduleName =
                            genericMessage.moduleName
                    in
                        case Dict.get moduleName funnels of
                            Just funnel ->
                                case funnel of
                                    StorageFunnel storFunnel ->
                                        case
                                            PortFunnel.appProcess cmdPort
                                                genericMessage
                                                storFunnel
                                                model.funnelState
                                                model
                                        of
                                            Err _ ->
                                                ( model, Cmd.none )

                                            Ok ( mdl, cmd ) ->
                                                let
                                                    newBuffer =
                                                        Yajson.fromValue (Maybe.withDefault null mdl.localStorageValue)
                                                            |> (\res ->
                                                                    case res of
                                                                        Ok json ->
                                                                            pretty json

                                                                        Err error ->
                                                                            "error"
                                                               )
                                                in
                                                    ( { mdl
                                                        | jsonBuffer = newBuffer
                                                      }
                                                    , Cmd.batch
                                                        [ cmd
                                                        ]
                                                    )

                            _ ->
                                ( model, Cmd.none )

        ---------
        -- Misc--
        ---------
        LoadDocument ->
            case PageTreeEditor.loadedContent config.pageTreeEditor of
                Just { docContent } ->
                    let
                        ( newModel, cmd ) =
                            reset (Just docContent) model.externalMsg
                    in
                        ( { newModel | currentPlugin = Nothing }
                        , cmd
                        )

                _ ->
                    ( model, Cmd.none )

        NoOp ->
            ( model, Cmd.none )



-------------------------------------------------------------------------------
-------------------
-- View funcions --
-------------------


type alias ViewConfig config msg =
    { config
        | logInfo : LogInfo
        , fileExplorer : FileExplorer.Model msg
        , pageTreeEditor : PageTreeEditor.Model msg
        , genDirEditor : GeneralDirectoryEditor.Model msg
        , zone : Time.Zone
    }


view : ViewConfig config msg -> Model msg -> Element msg
view config model =
    column
        ([ width fill
         , height (maximum (model.config.height - 35) fill)
         ]
            ++ (if model.menuClicked then
                    [ onClick (model.externalMsg MenuClickOff) ]
                else
                    []
               )
        )
        [ mainInterface
            { clicked = model.menuClicked
            , currentFocus = model.menuFocused
            , isInPlugin = model.currentPlugin /= Nothing
            , clipboardEmpty = model.clipboard == Nothing
            , undoCacheEmpty = model.undoCache == []
            , selectionIsRoot = zipUp model.document == Nothing
            , selectionIsContainer = isContainer (extractDoc model.document)
            , previewMode = model.config.previewMode
            , containersBkgColors = model.config.containersBkgColors
            , logInfo = config.logInfo
            , canSave = PageTreeEditor.fileIoSelectedPageInfo config.pageTreeEditor /= Nothing
            , season = model.config.season
            }
            |> Element.map
                model.externalMsg
        , row
            [ width fill
              --NOTE: trick to make the columns scrollable
            , clip
            , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
              --NOTE: works too
              --, height (maximum (model.config.height - model.config.mainInterfaceHeight) fill)
            , height fill
            ]
            [ documentStructView
                { zipToUidCmd = ZipToUid
                , containersColors = model.config.containersBkgColors
                , isActive = model.currentPlugin == Nothing
                }
                (extractDoc model.document
                    |> getUid
                )
                (extractDoc <| rewind model.document)
                |> Element.map
                    model.externalMsg
            , case model.currentPlugin of
                Nothing ->
                    documentView model

                Just plugin ->
                    pluginView config model plugin
            ]
        ]


documentView : Model msg -> Element msg
documentView model =
    column
        [ scrollbarY
        , height fill
          -- needed to be able to scroll
        , width fill
        , htmlAttribute <| HtmlAttr.id "documentContainer"
        , case model.config.previewMode of
            PreviewBigScreen ->
                width fill

            PreviewScreen ->
                width (px 980)

            PreviewTablet ->
                width (px 800)

            PreviewPhone ->
                width (px 350)
        , centerX
          --, clipX
        ]
        (model.document
            |> addZipperHandlers
            |> rewind
            |> extractDoc
            |> responsivePreFormat model.config
            |> renderDoc model.config
         --, paragraph [] [ text <| Debug.toString (extractDoc model.document) ]
        )



-------------------------------
-- Plugins views loading code--
-------------------------------


pluginView : ViewConfig config msg -> Model msg -> EditorPlugin -> Element msg
pluginView config model plugin =
    case plugin of
        ImagePlugin ->
            ImagePlugin.view
                { picListing = []
                , fileExplorer = config.fileExplorer
                , zone = config.zone
                , maxHeight = model.config.height - model.config.mainInterfaceHeight - 35
                , logInfo = config.logInfo
                }
                model.imagePlugin

        TablePlugin ->
            TablePlugin.view model.tablePlugin

        CustomElementPlugin ->
            el [] (text "Nothing  here yet!")

        TextBlockPlugin ->
            TextBlockPlugin.view
                { fileExplorer = config.fileExplorer
                , pageTreeEditor = config.pageTreeEditor
                , zone = config.zone
                , logInfo = config.logInfo
                }
                model.config
                model.textBlockPlugin

        NewDocPlugin ->
            NewDocPlugin.view
                { createNewCell = model.externalMsg << CreateNewCell
                , createNewContainer = model.externalMsg << CreateNewContainer
                , goBack = model.externalMsg <| SetEditorPlugin Nothing
                , nextUid = model.nextUid
                }

        ContainerEditPlugin ->
            case extractDoc model.document of
                Container cv _ ->
                    ContainerEditPlugin.view
                        { currentContainer = cv.containerLabel
                        , swapContainerType = model.externalMsg << SwapContainerType
                        , goBack = model.externalMsg <| SetEditorPlugin Nothing
                        }

                _ ->
                    text "Aucun containeur sélectionné"

        VideoPlugin ->
            VideoPlugin.view
                []
                model.videoPlugin

        BlockLinksPlugin ->
            BlockLinksPlugin.view
                { fileExplorer = config.fileExplorer
                , pageTreeEditor = config.pageTreeEditor
                , zone = config.zone
                , logInfo = config.logInfo
                }
                model.config
                model.blockLinksPlugin

        FichesPlugin ->
            FichesPlugin.view
                { genDirEditor = config.genDirEditor
                }
                model.fichesPlugin

        PersistencePlugin ->
            Element.map model.externalMsg <|
                PersistencePlugin.view
                    { localStorageKeys = model.localStorageKeys
                    , localStorageKey = model.localStorageKey
                    , localStorageValue = model.localStorageValue
                    , jsonBuffer = model.jsonBuffer
                    , setLocalStorageValue = SetLocalStorageValue
                    , setLocalStorageKey = SetLocalStorageKey
                    , setJsonBuffer = SetJsonBuffer
                    , getFromLocalStorage = GetFromLocalStorage
                    , putInLocalStorage = PutInLocalStorage
                    , loadDocument = LoadLocalStorageDocument
                    , removeFromLocalStorage = RemoveFromLocalStorage
                    , clearLocalStorage = ClearLocalStorage
                    , setEditorPlugin = SetEditorPlugin
                    , document = extractDoc (rewind model.document)
                    , noOp = NoOp
                    }

        PageTreeEditorPlugin mode ->
            column
                [ width fill ]
                [ PageTreeEditor.view
                    { maxHeight = model.config.height - model.config.mainInterfaceHeight - 85
                    , zone = config.zone
                    , logInfo = config.logInfo
                    , mode = mode
                    }
                    config.pageTreeEditor
                , row
                    [ paddingXY 15 0
                    , spacing 15
                    ]
                    [ Input.button
                        (buttonStyle True)
                        { onPress =
                            Just <| model.externalMsg (SetEditorPlugin Nothing)
                        , label =
                            row [ spacing 10 ]
                                [ text "Retour"
                                ]
                        }
                    , if mode == PageTreeEditor.Open then
                        Input.button
                            (buttonStyle True)
                            { onPress =
                                Just <| model.externalMsg LoadDocument
                            , label =
                                row [ spacing 10 ]
                                    [ text "Ouvrir"
                                    ]
                            }
                      else
                        Element.none
                    ]
                ]



--openNewPlugin : Model msg -> ( Model msg, Cmd msg )


openNewPlugin : config -> Model msg -> ( Model msg, Cmd msg )
openNewPlugin config model =
    -- NOTE: reset corresponding plugin when the selection is an empty cell
    -- then open the plugin
    case model.currentPlugin of
        Just TablePlugin ->
            ( { model
                | tablePlugin =
                    TablePlugin.init Nothing
                        (model.externalMsg << TablePluginMsg)
              }
            , Cmd.none
            )

        Just TextBlockPlugin ->
            let
                ( newTextBlockPlugin, textBlockPluginCmds ) =
                    TextBlockPlugin.init []
                        Nothing
                        (model.externalMsg << TextBlockPluginMsg)
            in
                ( { model
                    | textBlockPlugin = newTextBlockPlugin
                  }
                , Cmd.batch
                    [ textBlockPluginCmds ]
                )

        Just ImagePlugin ->
            let
                ( newImagePlugin, imagePluginCmds ) =
                    ImagePlugin.open config
                        Nothing
                        (model.externalMsg << ImagePluginMsg)
            in
                ( { model
                    | imagePlugin = newImagePlugin
                  }
                , imagePluginCmds
                )

        Just VideoPlugin ->
            let
                newVideoPlugin =
                    VideoPlugin.init Nothing
                        (model.externalMsg << VideoPluginMsg)
            in
                ( { model
                    | videoPlugin = newVideoPlugin
                  }
                , Cmd.none
                )

        Just BlockLinksPlugin ->
            let
                newBlockLinksPlugin =
                    BlockLinksPlugin.init Nothing
                        (model.externalMsg << BlockLinksPluginMsg)
            in
                ( { model
                    | blockLinksPlugin = newBlockLinksPlugin
                  }
                , Cmd.none
                )

        Just FichesPlugin ->
            let
                newFichesPlugin =
                    FichesPlugin.init
                        []
                        (model.externalMsg << FichesPluginMsg)
            in
                ( { model
                    | fichesPlugin = newFichesPlugin
                  }
                , Cmd.none
                )

        _ ->
            ( model, Cmd.none )


openPlugin : config -> Model msg -> ( Model msg, Cmd msg )
openPlugin config model =
    -- NOTE: open the plugin corresponding to the current selection
    -- and initializes it with selection content
    case extractDoc model.document of
        Cell { cellContent, id, attrs } ->
            case cellContent of
                Table tm ->
                    ( { model
                        | currentPlugin = Just TablePlugin
                        , tablePlugin =
                            TablePlugin.init
                                (Just tm)
                                (model.externalMsg << TablePluginMsg)
                      }
                    , Cmd.none
                    )

                TextBlock tbElems ->
                    let
                        ( newTextBlockPlugin, textBlockPluginCmds ) =
                            TextBlockPlugin.init attrs
                                (Just tbElems)
                                (model.externalMsg << TextBlockPluginMsg)
                    in
                        ( { model
                            | currentPlugin = Just TextBlockPlugin
                            , textBlockPlugin = newTextBlockPlugin
                          }
                        , Cmd.batch
                            [ textBlockPluginCmds ]
                        )

                EmptyCell ->
                    ( { model
                        | currentPlugin = Just NewDocPlugin
                      }
                    , Cmd.none
                    )

                Image imgMeta ->
                    let
                        ( newImagePlugin, imagePluginCmds ) =
                            ImagePlugin.open config
                                (Just ( imgMeta, attrs ))
                                (model.externalMsg << ImagePluginMsg)
                    in
                        ( { model
                            | currentPlugin = Just ImagePlugin
                            , imagePlugin = newImagePlugin
                          }
                        , imagePluginCmds
                        )

                Video videoMeta ->
                    let
                        newVideoPlugin =
                            VideoPlugin.init
                                (Just ( videoMeta, attrs ))
                                (model.externalMsg << VideoPluginMsg)
                    in
                        ( { model
                            | currentPlugin = Just VideoPlugin
                            , videoPlugin = newVideoPlugin
                          }
                        , Cmd.none
                        )

                BlockLinks blocks ->
                    let
                        newBlockLinksPlugin =
                            BlockLinksPlugin.init
                                (Just blocks)
                                (model.externalMsg << BlockLinksPluginMsg)
                    in
                        ( { model
                            | currentPlugin = Just BlockLinksPlugin
                            , blockLinksPlugin = newBlockLinksPlugin
                          }
                        , Cmd.none
                        )

                Fiches fichesId ->
                    let
                        newFichesPlugin =
                            FichesPlugin.init
                                fichesId
                                (model.externalMsg << FichesPluginMsg)
                    in
                        ( { model
                            | currentPlugin = Just FichesPlugin
                            , fichesPlugin = newFichesPlugin
                          }
                        , Cmd.none
                        )

                _ ->
                    ( model, Cmd.none )

        _ ->
            ( model, Cmd.none )



---------------
-- Main menu --
---------------


iconSize =
    18


type alias MenuConfig =
    { clicked : Bool
    , currentFocus : String
    , isInPlugin : Bool
    , clipboardEmpty : Bool
    , undoCacheEmpty : Bool
    , selectionIsRoot : Bool
    , selectionIsContainer : Bool
    , previewMode : PreviewMode
    , containersBkgColors : Bool
    , canSave : Bool
    , logInfo : LogInfo
    , season : Season
    }


mainInterface : MenuConfig -> Element Msg
mainInterface config =
    let
        interfaceButton buttonConfig =
            Input.button (menuButtonStyle buttonConfig.isActive)
                { onPress =
                    if buttonConfig.isActive then
                        buttonConfig.msg
                    else
                        Nothing
                , label =
                    case buttonConfig.icons of
                        [] ->
                            el [] (text buttonConfig.labelText)

                        icons_ ->
                            row [ spacing 10 ]
                                [ row
                                    []
                                    (List.map (\i -> el [] (html <| i)) icons_)
                                , text buttonConfig.labelText
                                ]
                }

        defButtonConfig =
            { icons = []
            , labelText = ""
            , isActive = not config.isInPlugin
            , msg = Nothing
            }

        menuButtonStyle isActive =
            [ Border.rounded 5
            , Font.center
            , centerY
            , paddingXY 5 3
            , mouseOver
                [ Background.color (rgb 0.95 0.95 0.95) ]
            ]
                ++ (if isActive then
                        [ pointer ]
                    else
                        [ Font.color (rgb 0.7 0.7 0.7)
                        , htmlAttribute <| HtmlAttr.style "cursor" "default"
                        ]
                   )
    in
        column
            [ width fill
            , Font.size 15
            , htmlAttribute <| HtmlAttr.id "mainInterface"
            ]
            [ mainMenu config
            , row
                [ width fill
                , spacing 15
                , paddingXY 15 10
                , Background.color (rgb 0.9 0.9 0.9)
                ]
                (List.map interfaceButton <|
                    [ { defButtonConfig
                        | icons = [ plusSquare iconSize ]
                        , labelText = "Ajouter"
                        , msg = Just AddNewInside
                        , isActive =
                            not config.isInPlugin
                                && config.selectionIsContainer
                      }
                    , { defButtonConfig
                        | icons =
                            [ plusSquare iconSize
                            , chevronsUp iconSize
                            ]
                        , labelText = "Ajouter au dessus"
                        , msg = Just AddNewLeft
                        , isActive =
                            not config.isInPlugin
                                && not config.selectionIsRoot
                      }
                    , { defButtonConfig
                        | icons =
                            [ plusSquare iconSize
                            , chevronsDown iconSize
                            ]
                        , labelText = "Ajouter en dessous"
                        , msg = Just AddNewRight
                        , isActive =
                            not config.isInPlugin
                                && not config.selectionIsRoot
                      }
                    , { defButtonConfig
                        | icons = [ edit iconSize ]
                        , labelText = "Modifier"
                        , msg =
                            if config.selectionIsContainer then
                                Just EditContainer
                            else
                                Just EditCell
                        , isActive =
                            not config.isInPlugin
                                && not config.selectionIsRoot
                      }
                    , { defButtonConfig
                        | icons = [ xSquare iconSize ]
                        , labelText = "Supprimer"
                        , msg = Just DeleteSelected
                        , isActive =
                            not config.isInPlugin
                                && not config.selectionIsRoot
                      }
                    , { defButtonConfig
                        | icons = [ chevronsUp iconSize ]
                        , labelText = "Monter"
                        , msg = Just SwapLeft
                        , isActive =
                            not config.isInPlugin
                                && not config.selectionIsRoot
                      }
                    , { defButtonConfig
                        | icons = [ chevronsDown iconSize ]
                        , labelText = "Descendre"
                        , msg = Just SwapRight
                        , isActive =
                            not config.isInPlugin
                                && not config.selectionIsRoot
                      }
                    , { defButtonConfig
                        | icons = [ settings iconSize ]
                        , labelText = "Préférences"
                        , msg = Nothing
                        , isActive = False
                      }
                    ]
                )
            ]


mainMenu : MenuConfig -> Element Msg
mainMenu config =
    let
        topEntry ( label, submenu ) =
            el
                ([ mouseOver
                    [ Background.color (rgb 0.9 0.9 0.9) ]
                 , onMouseEnter (TopEntryFocused label)
                 , onClick MenuClick
                 , paddingXY 10 5
                 ]
                    ++ (if config.clicked && config.currentFocus == label then
                            [ below
                                (column
                                    [ spacing 5
                                    , paddingXY 0 5
                                    , Background.color (rgb 1 1 1)
                                    , Border.width 1
                                    , Border.color (rgb 0.8 0.8 0.8)
                                    ]
                                    (List.map groupEntry submenu
                                        |> List.intersperse
                                            (el
                                                [ width fill
                                                , Font.center
                                                , Border.widthEach
                                                    { top = 1
                                                    , left = 0
                                                    , right = 0
                                                    , bottom = 0
                                                    }
                                                , Border.color (rgb 0.9 0.9 0.9)
                                                ]
                                                Element.none
                                            )
                                    )
                                )
                            , Background.color (rgb 0.9 0.9 0.9)
                            ]
                        else
                            []
                       )
                )
                (el [ pointer ] (text label))

        groupEntry group =
            column
                [ spacing 0
                , width fill
                ]
                (List.map menuEntry group)

        menuEntry { label, msg, icon, isActive, isSelected, isSelectable } =
            row
                ([ width fill
                 , paddingXY 10 5
                 , mouseOver
                    [ Background.color (rgb 0.9 0.9 0.9) ]
                 , spacing 5
                 ]
                    ++ (if isActive then
                            [ onClick msg
                            , pointer
                            ]
                        else
                            [ Font.color (rgb 0.7 0.7 0.7)
                            , htmlAttribute <| HtmlAttr.style "cursor" "default"
                            ]
                       )
                )
                (if isSelected then
                    [ el [] (html <| checkSquare 15)
                    , text label
                    ]
                 else if isSelectable then
                    [ el [] (html <| square 15)
                    , text label
                    ]
                 else
                    [ text label ]
                )

        defEntry =
            { label = ""
            , msg = NoOp
            , icon = Nothing
            , isActive = True
            , isSelectable = False
            , isSelected = False
            }

        menuData =
            [ ( "Fichier"
              , [ [ { defEntry
                        | label = "Ouvrir page"
                        , isActive = not config.isInPlugin
                        , msg = SetEditorPlugin (Just <| PageTreeEditorPlugin PageTreeEditor.Open)
                    }
                  , { defEntry
                        | label = "Enregistrer"
                        , isActive = not config.isInPlugin && config.canSave
                        , msg = SetEditorPlugin (Just <| PageTreeEditorPlugin PageTreeEditor.Save)
                    }
                  , { defEntry
                        | label = "Enregistrer sous"
                        , isActive = not config.isInPlugin
                        , msg = SetEditorPlugin (Just <| PageTreeEditorPlugin PageTreeEditor.SaveAs)
                    }
                  ]
                , [ { defEntry
                        | label = "Sauvegarde cache"
                        , isActive = not config.isInPlugin
                        , msg = SetEditorPlugin (Just PersistencePlugin)
                    }
                  ]
                ]
              )
            , ( "Mise en page"
              , [ [ { defEntry
                        | label = "Copier"
                        , msg = Copy
                        , isActive = not config.isInPlugin
                    }
                  , { defEntry
                        | label = "Couper"
                        , msg = Cut
                        , isActive = not config.isInPlugin
                    }
                  , { defEntry
                        | label = "Coller"
                        , msg = Paste
                        , isActive =
                            not config.clipboardEmpty
                                && not config.isInPlugin
                    }
                  ]
                , [ { defEntry
                        | label = "Annuler"
                        , msg = Undo
                        , isActive =
                            not config.undoCacheEmpty
                                && not config.isInPlugin
                    }
                  ]
                , [ { defEntry
                        | label = "Supprimer"
                        , isActive =
                            not config.isInPlugin
                                && not config.selectionIsRoot
                    }
                  , { defEntry
                        | label = "Modifier selection"
                        , msg = EditCell
                        , isActive =
                            not config.isInPlugin
                                && not config.selectionIsContainer
                                && not config.selectionIsRoot
                    }
                  ]
                ]
              )
            , ( "Affichage"
              , [ [ { defEntry
                        | label = "Grand écran"
                        , msg = SetPreviewMode PreviewBigScreen
                        , isSelected = config.previewMode == PreviewBigScreen
                        , isSelectable = True
                    }
                  , { defEntry
                        | label = "Petit écran"
                        , msg = SetPreviewMode PreviewScreen
                        , isSelected = config.previewMode == PreviewScreen
                        , isSelectable = True
                    }
                  , { defEntry
                        | label = "Tablette"
                        , msg = SetPreviewMode PreviewTablet
                        , isSelected = config.previewMode == PreviewTablet
                        , isSelectable = True
                    }
                  , { defEntry
                        | label = "Téléphone"
                        , msg = SetPreviewMode PreviewPhone
                        , isSelected = config.previewMode == PreviewPhone
                        , isSelectable = True
                    }
                  ]
                , [ { defEntry
                        | label = "Couleurs conteneurs"
                        , msg = ToogleCountainersColors
                        , isSelected = config.containersBkgColors
                        , isSelectable = True
                    }
                  ]
                , [ { defEntry
                        | label = "Printemps"
                        , isSelectable = True
                        , isSelected = config.season == Spring
                        , msg = SetSeason Spring
                        , isActive = True
                    }
                  , { defEntry
                        | label = "Eté"
                        , isSelectable = True
                        , isSelected = config.season == Summer
                        , msg = SetSeason Summer
                        , isActive = True
                    }
                  , { defEntry
                        | label = "Automne"
                        , isSelectable = True
                        , isSelected = config.season == Autumn
                        , msg = SetSeason Autumn
                        , isActive = True
                    }
                  , { defEntry
                        | label = "Hiver"
                        , isSelectable = True
                        , isSelected = config.season == Winter
                        , msg = SetSeason Winter
                        , isActive = True
                    }
                  ]
                ]
              )
            , ( "Aide"
              , [ [ { defEntry
                        | label = "A propos"
                        , isActive = False
                    }
                  ]
                ]
              )
            ]
    in
        row
            [ width fill ]
            (List.map topEntry menuData)



---------------------
-- Helper functions--
---------------------


scrollTo : Maybe String -> Cmd Msg
scrollTo mbId =
    case mbId of
        Nothing ->
            Cmd.none

        Just destId ->
            Dom.getElement "defaultHtmlId0"
                |> Task.andThen
                    (\mainContInfo ->
                        Dom.getElement
                            destId
                            |> Task.andThen
                                (\el ->
                                    Dom.setViewportOf "documentContainer"
                                        0
                                        (el.element.y
                                            - mainContInfo.element.y
                                            - 50
                                        )
                                )
                    )
                |> Task.attempt (\_ -> NoOp)


keyDecoder : Decode.Decoder String
keyDecoder =
    Decode.field "key" Decode.string
