module Editor exposing (..)

--import DocumentSerializer exposing (..)

import Array exposing (..)
import Browser exposing (document)
import Browser.Dom as Dom
import Browser.Events exposing (onKeyDown, onKeyUp, onResize)
import Dict exposing (..)
import Document exposing (..)
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
import Html.Attributes as HtmlAttr
import Html.Events.Extra.Wheel as Wheel
import Icons exposing (..)
import Json.Decode as Decode
import NewDocPlugin exposing (..)
import SampleDocs exposing (..)
import StyleSheets exposing (..)
import TablePlugin exposing (..)
import Task exposing (perform)
import Time exposing (..)


main : Program () Model Msg
main =
    Browser.document
        { init = init sampleDoc1
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type Msg
    = CurrentViewport Dom.Viewport
    | CurrentViewportOf Int (Result Dom.Error Dom.Viewport)
    | WinResize Int Int
    | RefreshSizes
    | MainInterfaceViewport (Result Dom.Error Dom.Viewport)
    | NoOp
    | SelectDoc Int
    | EditCell
    | WheelEvent Wheel.Event
    | ZipUp
    | Rewind
    | SwapLeft
    | SwapRight
    | AddNewLeft
    | AddNewRight
    | CreateNewContainer Document
    | CreateNewCell Document
    | DeleteSelected
    | Copy
    | Cut
    | Paste
    | Undo
    | KeyDown String
    | KeyUp String
    | MenuClick
    | MenuClickOff
    | TopEntryFocused String
    | SetPreviewMode PreviewMode
    | ToogleCountainersColors
    | TablePluginMsg TablePlugin.Msg


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
    , currentPlugin : Maybe EditorPlugin
    , tablePlugin : TablePlugin.DocTable
    }


undoCacheDepth =
    4


init doc flags =
    let
        ( doc_, idsToTrack ) =
            setSizeTrackedDocUids doc

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
      , currentPlugin = Nothing
      , tablePlugin = TablePlugin.init Nothing
      }
    , Cmd.batch
        [ Task.perform CurrentViewport Dom.getViewport
        , Task.attempt MainInterfaceViewport
            (Dom.getViewportOf "mainInterface")
        ]
    )


subscriptions model =
    Sub.batch
        [ onResize WinResize
        , onKeyDown (Decode.map KeyDown keyDecoder)
        , onKeyUp (Decode.map KeyUp keyDecoder)
        ]


update msg model =
    case msg of
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
                      --, Cmd.batch
                      --    [ jumpToSelection
                      --        (getStyleId <| extractDoc newDocument)
                      --    ]
                    , Cmd.none
                    )

        EditCell ->
            openPlugin model

        SwapLeft ->
            case swapLeft model.document of
                Nothing ->
                    ( model, Cmd.none )

                Just newDoc ->
                    ( { model | document = newDoc }
                    , Cmd.none
                    )

        SwapRight ->
            case swapRight model.document of
                Nothing ->
                    ( model, Cmd.none )

                Just newDoc ->
                    ( { model | document = newDoc }
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
                    , Cmd.none
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
                    , Cmd.none
                    )

        CreateNewContainer newDoc ->
            ( { model
                | document = updateCurrent newDoc model.document
                , nextUid = model.nextUid + 2
                , currentPlugin = Nothing
              }
            , Cmd.none
            )

        CreateNewCell newDoc ->
            let
                ( newModel, cmd ) =
                    { model | document = updateCurrent newDoc model.document }
                        |> openPlugin
            in
            ( { newModel | nextUid = model.nextUid + 1 }
            , Cmd.batch [ cmd ]
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

        ZipUp ->
            ( { model
                | document =
                    Maybe.withDefault
                        model.document
                        (zipUp model.document)
              }
            , Cmd.none
            )

        Rewind ->
            ( { model
                | document =
                    rewind model.document
              }
            , Cmd.none
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

        RefreshSizes ->
            ( model
            , updateSizes model.config
            )

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

        TablePluginMsg tableMsg ->
            let
                ( newTablePlugin, mbPluginData ) =
                    TablePlugin.update tableMsg model.tablePlugin
            in
            case mbPluginData of
                Nothing ->
                    ( { model | tablePlugin = newTablePlugin }
                    , Cmd.none
                    )

                Just PluginQuit ->
                    ( { model
                        | tablePlugin = newTablePlugin
                        , currentPlugin = Nothing
                      }
                    , Cmd.none
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
                                    , Cmd.none
                                    )

                                _ ->
                                    ( model, Cmd.none )

                        _ ->
                            ( model, Cmd.none )

        NoOp ->
            ( model, Cmd.none )


view model =
    { title = "editor"
    , body =
        [ Element.layout
            []
            (column
                ([ width fill
                 , height (maximum model.config.height fill)
                 ]
                    ++ (if model.currentPlugin == Nothing && model.controlDown then
                            [ htmlAttribute <| Wheel.onWheel WheelEvent ]
                        else
                            []
                       )
                    ++ (if model.menuClicked then
                            [ onClick MenuClickOff ]
                        else
                            []
                       )
                )
                [ mainInterface
                    { clicked = model.menuClicked

                    --, flags = []
                    , currentFocus = model.menuFocused
                    , isInPlugin = model.currentPlugin /= Nothing
                    , clipboardEmpty = model.clipboard == Nothing
                    , undoCacheEmpty = model.undoCache == []
                    , selectionIsRoot = zipUp model.document == Nothing
                    , selectionIsContainer =
                        case extractDoc model.document of
                            Container _ _ ->
                                True

                            _ ->
                                False
                    , previewMode = model.previewMode
                    , containersBkgColors = model.config.containersBkgColors
                    }
                , row
                    [ width fill

                    --trick to make the columns scrollable
                    , clip
                    , htmlAttribute (HtmlAttr.style "flex-shrink" "1")

                    -- works too
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
                ]
            )

        --, Html.text <| Debug.toString model.controlDown
        ]
    }


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
                    | icons = [ plusSquare ]
                    , labelText = "Ajouter"
                    , msg = Nothing
                    , isActive =
                        not config.isInPlugin
                            && config.selectionIsContainer
                  }
                , { defButtonConfig
                    | icons =
                        [ plusSquare
                        , chevronsUp
                        ]
                    , labelText = "Ajouter au dessus"
                    , msg = Just AddNewLeft
                    , isActive =
                        not config.isInPlugin
                            && not config.selectionIsRoot
                  }
                , { defButtonConfig
                    | icons =
                        [ plusSquare
                        , chevronsDown
                        ]
                    , labelText = "Ajouter en dessous"
                    , msg = Just AddNewRight
                    , isActive =
                        not config.isInPlugin
                            && not config.selectionIsRoot
                  }
                , { defButtonConfig
                    | icons = [ edit ]
                    , labelText = "Modifier"
                    , msg = Just EditCell
                    , isActive =
                        not config.isInPlugin
                            && not config.selectionIsContainer
                            && not config.selectionIsRoot
                  }
                , { defButtonConfig
                    | icons = [ xSquare ]
                    , labelText = "Supprimer"
                    , msg = Just DeleteSelected
                    , isActive =
                        not config.isInPlugin
                            && not config.selectionIsRoot
                  }
                , { defButtonConfig
                    | icons = [ chevronsUp ]
                    , labelText = "Monter"
                    , msg = Just SwapLeft
                    , isActive =
                        not config.isInPlugin
                            && not config.selectionIsRoot
                  }
                , { defButtonConfig
                    | icons = [ chevronsDown ]
                    , labelText = "Descendre"
                    , msg = Just SwapRight
                    , isActive =
                        not config.isInPlugin
                            && not config.selectionIsRoot
                  }
                , { defButtonConfig
                    | icons = [ refreshCw ]
                    , labelText = "Rafraichir"
                    , msg = Just RefreshSizes
                    , isActive = True
                  }
                , { defButtonConfig
                    | icons = [ settings ]
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
                        , isActive = False && not config.isInPlugin
                    }
                  , { defEntry
                        | label = "Sauvegarder"
                        , isActive = False && not config.isInPlugin
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


documentView model =
    column
        [ scrollbarY
        , height fill -- needed to be able to scroll
        , width fill
        , htmlAttribute <| HtmlAttr.style "id" "documentContainer"
        ]
        [ column
            [ case model.previewMode of
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
            [ model.document
                |> addZipperHandlers
                |> rewind
                |> extractDoc
                |> responsivePreFormat model.config
                |> renderDoc model.config

            --, paragraph [] [ text <| Debug.toString (extractDoc model.document) ]
            ]
        ]


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
            el [] (text "Nothing  here yet!")

        NewDocPlugin ->
            NewDocPlugin.view
                { createNewCell = CreateNewCell
                , createNewContainer = CreateNewContainer
                , nextUid = model.nextUid
                }



--{ createNewCell = \_ -> NoOp
--, createNewContainer = \_ -> NoOp
--, nextUid = model.nextUid
--}


buttonStyle =
    [ Border.rounded 5
    , Font.center
    , centerY
    , paddingXY 5 3
    , mouseOver
        [ Background.color (rgb 0.95 0.95 0.95) ]
    ]


updateSizes : Config Msg -> Cmd Msg
updateSizes { sizesDict } =
    let
        cmd uid id =
            Task.attempt (CurrentViewportOf uid) (Dom.getViewportOf id)
    in
    Dict.keys sizesDict
        |> List.map (\uid -> cmd uid ("sizeTracked" ++ String.fromInt uid))
        |> Cmd.batch


jumpToSelection : Maybe String -> Cmd Msg
jumpToSelection mbSelectionId =
    case mbSelectionId of
        Nothing ->
            Cmd.none

        Just selectionId ->
            Dom.getViewportOf selectionId
                |> Task.andThen (\vp -> Dom.setViewportOf "documentContainer" 0 vp.viewport.y)
                |> Task.attempt (\_ -> NoOp)


keyDecoder : Decode.Decoder String
keyDecoder =
    Decode.field "key" Decode.string


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
