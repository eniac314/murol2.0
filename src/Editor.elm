module Editor exposing (..)

--import DocumentSerializer exposing (..)

import Browser exposing (document)
import Browser.Dom as Dom
import Browser.Events exposing (onKeyDown, onKeyUp, onResize)
import Dict exposing (..)
import Document exposing (..)
import DocumentResponsive exposing (..)
import DocumentView exposing (..)
import DocumentZipper exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events exposing (..)
import Element.Font as Font
import Element.Input as Input
import Element.Lazy exposing (lazy)
import Html.Events.Extra.Wheel as Wheel
import Icons exposing (..)
import Json.Decode as Decode
import SampleDocs exposing (..)
import StyleSheets exposing (..)
import Table exposing (..)
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
    | NoOp
    | SelectDoc Int
    | WheelEvent Wheel.Event
    | DeleteSelected
    | Undo
    | KeyDown String
    | KeyUp String
    | MenuClick
    | MenuClickOff
    | TopEntryFocused String
    | SetPreviewMode PreviewMode
    | ToogleCountainersColors


type PreviewMode
    = PreviewBigScreen
    | PreviewScreen
    | PreviewTablet
    | PreviewPhone


type alias Model =
    { config : Config Msg
    , selectedNode : Maybe Int
    , document : DocZipper
    , currentNodeBackup : Document
    , undoCache : List ( DocZipper, Document )
    , controlDown : Bool
    , menuClicked : Bool
    , menuFocused : String
    , previewMode : PreviewMode
    }


undoCacheDepth =
    4


init doc flags =
    let
        ( doc_, idsToTrack ) =
            setSizeTrackedDocUids doc

        handlers =
            { click = SelectDoc
            , dblClick = \_ -> NoOp
            }

        config =
            { width = 1920
            , height = 1080
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
      , selectedNode = Nothing
      , document =
            doc_
                |> initZip
                |> addSelectors
      , currentNodeBackup = doc_
      , undoCache = []
      , controlDown = False
      , menuClicked = False
      , menuFocused = ""
      , previewMode = PreviewBigScreen
      }
    , Cmd.batch
        [ Task.perform CurrentViewport Dom.getViewport
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

        SelectDoc id ->
            case
                zipDown (hasUid id)
                    (updateCurrent model.currentNodeBackup
                        model.document
                    )
            of
                Nothing ->
                    ( model, Cmd.none )

                Just newDocument ->
                    ( { model
                        | currentNodeBackup = extractDoc newDocument
                        , document = addSelectors newDocument
                        , selectedNode = Just id
                      }
                    , Cmd.none
                    )

        WheelEvent e ->
            let
                newDoc =
                    model.document
                        |> updateCurrent model.currentNodeBackup
                        |> zipUp
            in
            if e.deltaY > 0 then
                ( { model
                    | document =
                        Maybe.map addSelectors newDoc
                            |> Maybe.withDefault model.document
                    , currentNodeBackup =
                        Maybe.map extractDoc newDoc
                            |> Maybe.withDefault model.currentNodeBackup
                  }
                , Cmd.none
                )
            else
                ( model, Cmd.none )

        DeleteSelected ->
            let
                newDoc =
                    deleteCurrent model.document
            in
            ( { model
                | document =
                    Maybe.map addSelectors newDoc
                        |> Maybe.withDefault model.document
                , currentNodeBackup =
                    Maybe.map extractDoc newDoc
                        |> Maybe.withDefault model.currentNodeBackup
                , undoCache =
                    ( model.document, model.currentNodeBackup )
                        :: model.undoCache
                        |> List.take undoCacheDepth
              }
            , Cmd.none
            )

        Undo ->
            case model.undoCache of
                [] ->
                    ( model, Cmd.none )

                ( zipper, nodeBckp ) :: xs ->
                    ( { model
                        | document = zipper
                        , currentNodeBackup = nodeBckp
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
                    ++ (if model.controlDown then
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
                , documentView model
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
        , spacing 10
        ]
        [ mainMenu model.menuClicked [] model.menuFocused
        , row
            [ width fill
            , spacing 15
            , padding 15
            , Background.color (rgb 0.9 0.9 0.9)
            ]
            [ Input.button buttonStyle
                { onPress = Nothing
                , label =
                    row [ spacing 10 ]
                        [ el [] (html <| plusSquare)
                        , text "Ajouter"
                        ]
                }

            --, Input.button buttonStyle
            --    { onPress = Nothing
            --    , label =
            --     html <| minusSquare
            --    }
            , Input.button buttonStyle
                { onPress = Just DeleteSelected
                , label =
                    row [ spacing 10 ]
                        [ el [] (html <| xSquare)
                        , text "Supprimer"
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
        [ --, centerX
          scrollbarY
        , width fill

        --, height fill
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
                |> rewind
                |> extractDoc
                |> responsivePreFormat model.config
                |> renderDoc model.config
            ]
        ]


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
