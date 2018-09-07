module Editor exposing (..)

--import DocumentSerializer exposing (..)

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
    | SwapLeft
    | SwapRight
    | AddNewLeft
    | AddNewRight
    | CreateNewContainer Document
    | CreateNewCell Document
    | DeleteSelected
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
            { clickHandler = SelectDoc
            , dblClickHandler = \_ -> NoOp
            , cellClick = EditCell
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

        SelectDoc id ->
            case
                zipDown (hasUid id) model.document
            of
                Nothing ->
                    ( model, Cmd.none )

                Just newDocument ->
                    ( { model
                        | document = newDocument
                      }
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
                [ mainInterface model
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


mainInterface : Model -> Element Msg
mainInterface model =
    column
        [ width fill
        , Font.size 15
        , htmlAttribute <| HtmlAttr.id "mainInterface"
        ]
        [ mainMenu model.menuClicked [] model.menuFocused
        , row
            [ width fill
            , spacing 15
            , paddingXY 15 10
            , Background.color (rgb 0.9 0.9 0.9)
            ]
            [ Input.button buttonStyle
                { onPress = ifNotInPlugin model.currentPlugin AddNewLeft
                , label =
                    row [ spacing 10 ]
                        [ row
                            []
                            [ el [] (html <| plusSquare)
                            , el [] (html <| chevronsUp)
                            ]
                        , text "Ajouter au dessus"
                        ]
                }
            , Input.button buttonStyle
                { onPress = ifNotInPlugin model.currentPlugin AddNewRight
                , label =
                    row [ spacing 10 ]
                        [ row
                            []
                            [ el [] (html <| plusSquare)
                            , el [] (html <| chevronsDown)
                            ]
                        , text "Ajouter en dessous"
                        ]
                }

            --, Input.button buttonStyle
            --    { onPress = Nothing
            --    , label =
            --     html <| minusSquare
            --    }
            , Input.button buttonStyle
                { onPress =
                    Just EditCell
                , label =
                    row [ spacing 10 ]
                        [ el [] (html <| edit)
                        , text "Modifier"
                        ]
                }
            , Input.button buttonStyle
                { onPress = ifNotInPlugin model.currentPlugin DeleteSelected
                , label =
                    row [ spacing 10 ]
                        [ el [] (html <| xSquare)
                        , text "Supprimer"
                        ]
                }
            , Input.button buttonStyle
                { onPress = ifNotInPlugin model.currentPlugin SwapLeft
                , label =
                    row [ spacing 10 ]
                        [ el [] (html <| chevronsUp)
                        , text "Monter"
                        ]
                }
            , Input.button buttonStyle
                { onPress = ifNotInPlugin model.currentPlugin SwapRight
                , label =
                    row [ spacing 10 ]
                        [ el [] (html <| chevronsDown)
                        , text "Descendre"
                        ]
                }
            , Input.button buttonStyle
                { onPress = Just RefreshSizes
                , label =
                    row [ spacing 10 ]
                        [ el [] (html <| refreshCw)
                        , text "Rafraichir"
                        ]
                }
            , Input.button buttonStyle
                { onPress = Nothing
                , label =
                    row [ spacing 10 ]
                        [ el [] (html <| settings)
                        , text "Préférences"
                        ]
                }
            ]
        ]


ifNotInPlugin currentPlugin msg =
    case currentPlugin of
        Nothing ->
            Just msg

        Just _ ->
            Nothing


mainMenu clicked flags currentFocus =
    let
        topEntry ( label, submenu ) =
            el
                ([ mouseOver
                    [ Background.color (rgb 0.9 0.9 0.9) ]
                 , onMouseEnter (TopEntryFocused label)
                 , onClick MenuClick
                 , paddingXY 10 5
                 , pointer
                 ]
                    ++ (if clicked && currentFocus == label then
                            [ below
                                (column
                                    [ spacing 15
                                    , Background.color (rgb 1 1 1)
                                    , Border.width 1
                                    , Border.color (rgb 0.8 0.8 0.8)
                                    ]
                                    (List.map groupEntry submenu)
                                )
                            , Background.color (rgb 0.9 0.9 0.9)

                            --, Border.widthEach
                            --    { top = 1
                            --    , bottom = 0
                            --    , left = 1
                            --    , right = 1
                            --    }
                            --, Border.color (rgb 0.8 0.8 0.8)
                            ]
                        else
                            []
                       )
                )
                (text label)

        groupEntry group =
            column
                [ spacing 0
                , width fill
                ]
                (List.map menuEntry group)

        menuEntry { label, msg, flag, icon } =
            row
                [ onClick msg
                , mouseOver
                    [ Background.color (rgb 0.9 0.9 0.9) ]
                , width fill
                , paddingXY 10 5
                ]
                [ text label ]

        defEntry =
            { label = ""
            , msg = NoOp
            , flag = Nothing
            , icon = Nothing
            }

        menuData =
            --Dict.fromList
            [ ( "Fichier"
              , [ [ { defEntry | label = "Ouvrir page" }
                  , { defEntry | label = "Sauvegarder" }
                  , { defEntry | label = "Retour menu principal" }
                  ]
                ]
              )
            , ( "Mise en page"
              , [ [ { defEntry | label = "Copier" }
                  , { defEntry | label = "Couper" }
                  , { defEntry | label = "Coller" }
                  ]
                , [ { defEntry
                        | label = "Annuler"
                        , msg = Undo
                    }
                  ]
                , [ { defEntry | label = "Supprimer" }
                  , { defEntry | label = "Modifier selection" }
                  ]
                ]
              )
            , ( "Affichage"
              , [ [ { defEntry
                        | label = "Structure du document"
                        , flag = Just "showStruct"
                    }
                  , { defEntry
                        | label = "Editeur de feuille de style"
                        , flag = Just "showStyleSheetEditor"
                    }
                  ]
                , [ { defEntry
                        | label = "Grand écran"
                        , flag = Just "BigScreen"
                        , msg = SetPreviewMode PreviewBigScreen
                    }
                  , { defEntry
                        | label = "Petit écran"
                        , flag = Just "SmallScreen"
                        , msg = SetPreviewMode PreviewScreen
                    }
                  , { defEntry
                        | label = "Tablette"
                        , flag = Just "Tablet"
                        , msg = SetPreviewMode PreviewTablet
                    }
                  , { defEntry
                        | label = "Téléphone"
                        , flag = Just "Phone"
                        , msg = SetPreviewMode PreviewPhone
                    }
                  ]
                , [ { defEntry
                        | label = "Couleurs conteneurs"
                        , flag = Just "ContainersColors"
                        , msg = ToogleCountainersColors
                    }
                  ]
                ]
              )
            , ( "Aide"
              , [ [ { defEntry | label = "A propos" }
                  ]
                ]
              )
            ]
    in
    row
        [--onMouseLeave MenuClickOff
        ]
        (List.map topEntry menuData)



--|> Dict.values)


documentView model =
    column
        [ scrollbarY
        , height fill -- needed to be able to scroll
        , width fill
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
