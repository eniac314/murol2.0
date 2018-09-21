port module Editor exposing (..)

--import Doc

import Browser exposing (document)
import Browser.Dom as Dom
import Browser.Events exposing (onKeyDown, onKeyUp, onResize)
import Dict exposing (..)
import Document exposing (..)
import DocumentDecoder exposing (..)
import DocumentEditorHelpers exposing (..)
import DocumentResponsive exposing (..)
import DocumentStructView exposing (..)
import DocumentView exposing (..)
import DocumentZipper exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events exposing (..)
import Element.Font as Font
import Element.Input as Input
import Element.Lazy exposing (lazy)
import Html exposing (map)
import Html.Attributes as HtmlAttr
import Html.Events.Extra.Wheel as Wheel
import Icons exposing (..)
import Json.Decode as Decode
import Json.Encode exposing (Value, null)
import NewDocPlugin exposing (..)
import PortFunnel exposing (FunnelSpec, GenericMessage, ModuleDesc, StateAccessors)
import PortFunnel.LocalStorage as LocalStorage
import SampleDocs exposing (..)
import StyleSheets exposing (..)
import TablePlugin exposing (..)
import Task exposing (perform)
import TextBlockPlugin exposing (..)
import PersistencePlugin exposing (..)
import Json.Print exposing (prettyValue)
import Yajson exposing (..)
import Yajson.Stringify exposing (..)


main : Program () Model Msg
main =
    Browser.document
        { init = init emptyDoc
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ onResize WinResize
        , onKeyDown (Decode.map KeyDown keyDecoder)
        , onKeyUp (Decode.map KeyUp keyDecoder)
        , subPort Process
        ]


port cmdPort : Value -> Cmd msg


port subPort : (Value -> msg) -> Sub msg


type alias FunnelState =
    -- FunnelState packages the states of all the modules using portFunnel
    { storage : LocalStorage.State }


type
    Funnel
    -- a Funnel is a module using port-funnel, only one constructor here
    -- StorageFunnel (FunnelSpec FunnelState LocalStorage.State LocalStorage.Message LocalStorage.Response Model Msg)
    = StorageFunnel (AppFunnel LocalStorage.State LocalStorage.Message LocalStorage.Response)


type alias AppFunnel substate message response =
    -- exists only to shorten Funnel type definition
    -- could be used to add other constructors to the Funnel type
    FunnelSpec FunnelState substate message response Model Msg


funnels : Dict String Funnel
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


storageHandler : LocalStorage.Response -> FunnelState -> Model -> ( Model, Cmd Msg )
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


type alias Model =
    { config : Config Msg
    , document : DocZipper
    , undoCache : List DocZipper
    , clipboard : Maybe Document
    , nextUid : Int
    , controlDown : Bool
    , menuClicked : Bool
    , menuFocused : String
    , previewMode : PreviewMode
    , funnelState : FunnelState
    , localStorageKey : String
    , localStorageValue : Maybe Value
    , localStorageKeys : List String
    , jsonBuffer : String
    , currentPlugin : Maybe EditorPlugin
    , tablePlugin : TablePlugin.DocTable
    , textBlockPlugin : TextBlockPlugin.DocTextBlock
    }


type PreviewMode
    = PreviewBigScreen
    | PreviewScreen
    | PreviewTablet
    | PreviewPhone


type EditorPlugin
    = ImagePlugin
    | TablePlugin
    | CustomElementPlugin
    | TextBlockPlugin
    | NewDocPlugin
    | PersistencePlugin


type Msg
    = ----------------------------------------------
      -- Dom manipulation && Dom events processing--
      ----------------------------------------------
      CurrentViewport Dom.Viewport
    | CurrentViewportOf Int (Result Dom.Error Dom.Viewport)
    | WinResize Int Int
    | RefreshSizes
    | MainInterfaceViewport (Result Dom.Error Dom.Viewport)
    | JumpTo (Maybe String)
    | KeyDown String
    | KeyUp String
      ---------------------------------
      -- Document Zipper manipulation--
      ---------------------------------
    | SelectDoc Int
    | WheelEvent Wheel.Event
    | Rewind
    | SwapLeft
    | SwapRight
    | EditCell
    | AddNewInside
    | AddNewLeft
    | AddNewRight
    | CreateNewContainer Document
    | CreateNewCell Document
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
    | ToogleCountainersColors
    | SetEditorPlugin (Maybe EditorPlugin)
      -----------------------------
      -- Plugins messages routing--
      -----------------------------
    | TablePluginMsg TablePlugin.Msg
    | TextBlockPluginMsg TextBlockPlugin.Msg
      -------------------
      -- Persistence   --
      -------------------
    | LoadDocument
    | SetLocalStorageKey String
    | SetLocalStorageValue Json.Encode.Value
    | SetJsonBuffer String
    | DecodeJsonBuffer
    | GetFromLocalStorage
    | PutInLocalStorage
    | RemoveFromLocalStorage
    | ListLocalStorageKeys
    | ClearLocalStorage
    | Process Json.Encode.Value
      ---------
      -- Misc--
      ---------
    | NoOp


undoCacheDepth =
    4


init : Document -> flags -> ( Model, Cmd Msg )
init doc flags =
    let
        ( doc_, idsToTrack ) =
            setSizeTrackedDocUids doc

        ( newTextBlockPlugin, textBlockPluginCmds ) =
            TextBlockPlugin.init [] Nothing

        handlers =
            { containerClickHandler = SelectDoc
            , containerDblClickHandler = \_ -> NoOp
            , cellClick = EditCell
            , neighbourClickHandler = \_ -> Rewind
            }

        config =
            { width = 1920
            , height = 1080
            , mainInterfaceHeight = 75
            , sizesDict =
                Dict.fromList
                    (List.map
                        (\uid -> ( uid, { docWidth = 0, docHeight = 0 } ))
                        idsToTrack
                    )
            , customElems = Dict.empty
            , styleSheet = defaulStyleSheet
            , onLoadMsg = \_ -> RefreshSizes
            , zipperHandlers = Just handlers
            , editMode = True
            , containersBkgColors = False
            }
    in
        ( { config = config
          , document = initZip doc_
          , clipboard = Nothing
          , undoCache = []
          , nextUid = docSize doc_
          , controlDown = False
          , menuClicked = False
          , menuFocused = ""
          , previewMode = PreviewBigScreen
          , funnelState = { storage = LocalStorage.initialState "Editor" }
          , localStorageKey = ""
          , localStorageValue = Nothing
          , localStorageKeys = []
          , jsonBuffer = ""
          , currentPlugin = Nothing
          , tablePlugin = TablePlugin.init Nothing
          , textBlockPlugin = newTextBlockPlugin
          }
        , Cmd.batch
            [ Task.perform CurrentViewport Dom.getViewport
            , Task.attempt MainInterfaceViewport
                (Dom.getViewportOf "mainInterface")
            , textBlockPluginCmds
            ]
        )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
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
                          }
                        , Cmd.none
                        )

                Err (Dom.NotFound s) ->
                    ( model, Cmd.none )

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
                , Cmd.batch [ updateSizes newConfig ]
                )

        RefreshSizes ->
            ( model
            , updateSizes model.config
            )

        JumpTo id ->
            ( model, scrollTo id )

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
                    , Cmd.batch
                        []
                    )

        WheelEvent e ->
            let
                newDoc =
                    zipUp model.document
            in
                if e.deltaY > 0 then
                    ( { model
                        | document =
                            Maybe.withDefault model.document newDoc
                      }
                    , Cmd.none
                    )
                else
                    ( model, Cmd.none )

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
                    )

        EditCell ->
            openPlugin model

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
                    )

        CreateNewContainer newDoc ->
            ( { model
                | document = updateCurrent newDoc model.document
                , nextUid = model.nextUid + 2
                , currentPlugin = Nothing
              }
            , Cmd.batch
                []
            )

        CreateNewCell newDoc ->
            let
                ( newModel, cmd ) =
                    { model | document = updateCurrent newDoc model.document }
                        |> openPlugin
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
                    , updateSizes model.config
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
                config =
                    model.config

                newWidth =
                    case pm of
                        PreviewBigScreen ->
                            1920

                        PreviewScreen ->
                            1268

                        PreviewTablet ->
                            1024

                        PreviewPhone ->
                            480

                newConfig =
                    { config | width = newWidth }
            in
                ( { model | previewMode = pm, config = newConfig }
                , updateSizes newConfig
                )

        ToogleCountainersColors ->
            let
                config =
                    model.config

                newConfig =
                    { config
                        | containersBkgColors =
                            not config.containersBkgColors
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
                ( newTablePlugin, mbPluginData ) =
                    TablePlugin.update tableMsg model.tablePlugin
            in
                case mbPluginData of
                    Nothing ->
                        ( { model | tablePlugin = newTablePlugin }
                        , Cmd.batch
                            []
                        )

                    Just PluginQuit ->
                        ( { model
                            | tablePlugin = newTablePlugin
                            , currentPlugin = Nothing
                          }
                        , Cmd.batch
                            [ scrollTo <| getHtmlId (extractDoc model.document) ]
                        )

                    Just (PluginData tm) ->
                        case extractDoc model.document of
                            Cell ({ cellContent } as lv) ->
                                case cellContent of
                                    Table _ ->
                                        let
                                            newDoc =
                                                updateCurrent
                                                    (Cell { lv | cellContent = Table tm })
                                                    model.document
                                        in
                                            ( { model
                                                | document = newDoc
                                                , currentPlugin = Nothing
                                              }
                                            , Cmd.batch
                                                [ scrollTo <| getHtmlId (extractDoc model.document) ]
                                            )

                                    _ ->
                                        ( model, Cmd.none )

                            _ ->
                                ( model, Cmd.none )

        TextBlockPluginMsg textBlockMsg ->
            let
                ( newTextBlockPlugin, textBlockPluginCmds, mbPluginData ) =
                    TextBlockPlugin.update textBlockMsg model.textBlockPlugin
            in
                case mbPluginData of
                    Nothing ->
                        ( { model | textBlockPlugin = newTextBlockPlugin }
                        , Cmd.batch
                            [ Cmd.map TextBlockPluginMsg textBlockPluginCmds
                            ]
                        )

                    Just PluginQuit ->
                        ( { model
                            | textBlockPlugin = newTextBlockPlugin
                            , currentPlugin = Nothing
                          }
                        , Cmd.batch
                            [ scrollTo <| getHtmlId (extractDoc model.document)
                            , Cmd.map TextBlockPluginMsg textBlockPluginCmds
                            ]
                        )

                    Just (PluginData ( tbElems, attrs )) ->
                        case extractDoc model.document of
                            Cell ({ cellContent } as lv) ->
                                case cellContent of
                                    TextBlock _ ->
                                        let
                                            newDoc =
                                                updateCurrent
                                                    (Cell
                                                        { lv
                                                            | cellContent = TextBlock tbElems
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
                                                [ scrollTo <| getHtmlId (extractDoc model.document)
                                                , Cmd.map TextBlockPluginMsg textBlockPluginCmds
                                                ]
                                            )

                                    _ ->
                                        ( model, Cmd.none )

                            _ ->
                                ( model, Cmd.none )

        -------------------
        -- Persistence   --
        -------------------
        --LocalStorage.send (getCmdPort model)
        --    message
        --    model.funnelState.storage
        LoadDocument ->
            case Maybe.map (Decode.decodeValue decodeDocument) model.localStorageValue of
                Just (Ok newDoc) ->
                    let
                        ( newModel, cmd ) =
                            init newDoc ""
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
                    (Yajson.fromValue val
                        |> (\res ->
                                case res of
                                    Ok json ->
                                        pretty json

                                    Err error ->
                                        "error"
                           )
                    )
                    --(prettyValue { indent = 4, columns = 80 }
                    --    (Maybe.withDefault null (Just val))
                    --    |> (\res ->
                    --            case res of
                    --                Ok prettyJson ->
                    --                    prettyJson
                    --                Err error ->
                    --                    "Erreur: " ++ error
                    --       )
                    --)
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
                    (Yajson.fromValue (Maybe.withDefault null newLocalStorageValue)
                        |> (\res ->
                                case res of
                                    Ok json ->
                                        pretty json

                                    Err error ->
                                        "error"
                           )
                    )
            in
                ( { model
                    | jsonBuffer = newBuffer
                    , localStorageValue =
                        newLocalStorageValue
                  }
                , Cmd.none
                )

        DecodeJsonBuffer ->
            ( { model
                | localStorageValue =
                    case Decode.decodeString Decode.value model.jsonBuffer of
                        Ok value ->
                            Just value

                        Err _ ->
                            Nothing
              }
            , Cmd.none
            )

        GetFromLocalStorage ->
            ( model
            , LocalStorage.send
                cmdPort
                (LocalStorage.get model.localStorageKey)
                model.funnelState.storage
            )

        PutInLocalStorage ->
            ( model
            , LocalStorage.send
                cmdPort
                (LocalStorage.put
                    model.localStorageKey
                    model.localStorageValue
                )
                model.funnelState.storage
            )

        RemoveFromLocalStorage ->
            ( model
            , LocalStorage.send
                cmdPort
                (LocalStorage.put
                    model.localStorageKey
                    Nothing
                )
                model.funnelState.storage
            )

        ListLocalStorageKeys ->
            ( model
            , LocalStorage.send
                cmdPort
                (LocalStorage.listKeys "")
                model.funnelState.storage
            )

        ClearLocalStorage ->
            ( model
            , LocalStorage.send
                cmdPort
                (LocalStorage.clear "")
                model.funnelState.storage
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

                                            Ok res ->
                                                res

                            _ ->
                                ( model, Cmd.none )

        ---------
        -- Misc--
        ---------
        NoOp ->
            ( model, Cmd.none )



-------------------------------------------------------------------------------
-------------------
-- View funcions --
-------------------


view : Model -> Browser.Document Msg
view model =
    { title = "editor"
    , body =
        [ Element.layout
            []
            (column
                ([ width fill
                 , height (maximum model.config.height fill)
                 ]
                    --++ (if model.currentPlugin == Nothing && model.controlDown then
                    --        [ htmlAttribute <| Wheel.onWheel WheelEvent ]
                    --    else
                    --        []
                    --   )
                    ++
                        (if model.menuClicked then
                            [ onClick MenuClickOff ]
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
                    , previewMode = model.previewMode
                    , containersBkgColors = model.config.containersBkgColors
                    }
                , row
                    [ width fill
                      --NOTE: trick to make the columns scrollable
                    , clip
                    , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
                      --NOTE: works too
                      --, height (maximum (model.config.height - model.config.mainInterfaceHeight) fill)
                    ]
                    [ documentStructView
                        model.config
                        (extractDoc model.document
                            |> getUid
                        )
                        (extractDoc <| rewind model.document)
                    , case model.currentPlugin of
                        Nothing ->
                            documentView model

                        Just plugin ->
                            pluginView model plugin
                    ]
                  --mainMenu
                  --  { clicked = model.menuClicked
                  --  , currentFocus = model.menuFocused
                  --  , isInPlugin = model.currentPlugin /= Nothing
                  --  , clipboardEmpty = model.clipboard == Nothing
                  --  , undoCacheEmpty = model.undoCache == []
                  --  , selectionIsRoot = zipUp model.document == Nothing
                  --  , selectionIsContainer = isContainer (extractDoc model.document)
                  --  , previewMode = model.previewMode
                  --  , containersBkgColors = model.config.containersBkgColors
                  --  }
                ]
            )
        ]
    }


documentView : Model -> Element Msg
documentView model =
    column
        [ scrollbarY
        , height fill
          -- needed to be able to scroll
        , width fill
        , htmlAttribute <| HtmlAttr.id "documentContainer"
        , case model.previewMode of
            PreviewBigScreen ->
                width fill

            PreviewScreen ->
                width (px 1268)

            PreviewTablet ->
                width (px 1024)

            PreviewPhone ->
                width (px 480)
        , centerX
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


pluginView : Model -> EditorPlugin -> Element Msg
pluginView model plugin =
    case plugin of
        ImagePlugin ->
            el [] (text "Nothing  here yet!")

        TablePlugin ->
            TablePlugin.view model.tablePlugin
                |> Element.map TablePluginMsg

        CustomElementPlugin ->
            el [] (text "Nothing  here yet!")

        TextBlockPlugin ->
            TextBlockPlugin.view model.textBlockPlugin model.config
                |> Element.map TextBlockPluginMsg

        NewDocPlugin ->
            NewDocPlugin.view
                { createNewCell = CreateNewCell
                , createNewContainer = CreateNewContainer
                , nextUid = model.nextUid
                }

        PersistencePlugin ->
            PersistencePlugin.view
                { localStorageKeys = model.localStorageKeys
                , localStorageKey = model.localStorageKey
                , localStorageValue = model.localStorageValue
                , jsonBuffer = model.jsonBuffer
                , setLocalStorageValue = SetLocalStorageValue
                , setLocalStorageKey = SetLocalStorageKey
                , setJsonBuffer = SetJsonBuffer
                , decodeJsonBuffer = DecodeJsonBuffer
                , getFromLocalStorage = GetFromLocalStorage
                , putInLocalStorage = PutInLocalStorage
                , loadDocument = LoadDocument
                , listLocalStorageKeys = ListLocalStorageKeys
                , removeFromLocalStorage = RemoveFromLocalStorage
                , clearLocalStorage = ClearLocalStorage
                , setEditorPlugin = SetEditorPlugin
                , document = extractDoc (rewind model.document)
                , noOp = NoOp
                }



--{ createNewCell = \_ -> NoOp
--, createNewContainer = \_ -> NoOp
--, nextUid = model.nextUid
--}


openPlugin : Model -> ( Model, Cmd Msg )
openPlugin model =
    case extractDoc model.document of
        Cell { cellContent, id, attrs } ->
            case cellContent of
                Table tm ->
                    ( { model
                        | currentPlugin = Just TablePlugin
                        , tablePlugin = TablePlugin.init (Just tm)
                      }
                    , Cmd.none
                    )

                TextBlock tbElems ->
                    let
                        ( newTextBlockPlugin, textBlockPluginCmds ) =
                            TextBlockPlugin.init attrs (Just tbElems)
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
                        , msg = Just EditCell
                        , isActive =
                            not config.isInPlugin
                                && not config.selectionIsContainer
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
                        | icons = [ refreshCw iconSize ]
                        , labelText = "Rafraichir"
                        , msg = Just RefreshSizes
                        , isActive = True
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
                        , msg = SetEditorPlugin (Just PersistencePlugin)
                    }
                  , { defEntry
                        | label = "Sauvegarder"
                        , isActive = not config.isInPlugin
                        , msg = SetEditorPlugin (Just PersistencePlugin)
                    }
                  ]
                , [ { defEntry
                        | label = "Retour menu principal"
                        , isActive = False && not config.isInPlugin
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
                        | label = "Structure du document"
                        , isSelectable = True
                        , isActive = False
                    }
                  , { defEntry
                        | label = "Editeur de feuille de style"
                        , isSelectable = True
                        , isActive = False
                    }
                  ]
                , [ { defEntry
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
            []
            (List.map topEntry menuData)



---------------------
-- Helper functions--
---------------------


updateSizes : Config Msg -> Cmd Msg
updateSizes { sizesDict } =
    let
        cmd uid id =
            Task.attempt (CurrentViewportOf uid) (Dom.getViewportOf id)
    in
        Dict.keys sizesDict
            |> List.map (\uid -> cmd uid ("sizeTracked" ++ String.fromInt uid))
            |> Cmd.batch


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
