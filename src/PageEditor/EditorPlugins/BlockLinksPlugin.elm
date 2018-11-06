module PageEditor.EditorPlugins.BlockLinksPlugin exposing (..)

import Auth.AuthPlugin exposing (LogInfo)
import Dict exposing (..)
import Document.Document as Document exposing (..)
import Document.DocumentViews.DocumentView exposing (renderBlocksLinksMeta)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Lazy as Lazy
import Element.Region as Region
import FileExplorer.FileExplorer as FileExplorer
import Html exposing (Html)
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.Icons as Icons exposing (externalLink)
import List.Extra exposing (findIndex, swapAt, zip)
import PageEditor.Internals.DocumentEditorHelpers exposing (..)
import PageTreeEditor.PageTreeEditor as PageTreeEditor
import Set exposing (empty)
import Time exposing (Zone)
import UUID exposing (canonical)


type alias Model msg =
    { blocks : Dict Int BlockLinkMeta
    , selectedBlock : Maybe Int
    , labelPromptInput : Maybe String
    , externalLinkInput : Maybe String
    , selector : Selector
    , linkType : LinkType
    , externalMsg : Msg -> msg
    }


type Msg
    = SetSelector Selector
    | ConfirmDocUrl String
    | SelectImage String
    | ConfirmInternalPageUrl String
    | LabelPromptInput String
    | UpdateLabel
    | ExternalLinkPromptInput String
    | ConfirmExternalLink
    | SetLinkType LinkType
    | SelectBlock Int
    | AddBlock
    | RemoveBlock
    | Move Direction
    | Quit
    | SaveAndQuit
    | NoOp


type Selector
    = Closed
    | SelectingImages
    | SelectingLink


type LinkType
    = InternalLink
    | DocLink
    | ExternalLink


type Direction
    = Left
    | Right


init : Maybe (List BlockLinkMeta) -> (Msg -> msg) -> Model msg
init mbInput externalMsg =
    { blocks =
        Maybe.map (List.indexedMap Tuple.pair) mbInput
            |> Maybe.map Dict.fromList
            |> Maybe.withDefault Dict.empty
    , selectedBlock = Nothing
    , labelPromptInput = Nothing
    , externalLinkInput = Nothing
    , selector = Closed
    , linkType = InternalLink
    , externalMsg = externalMsg
    }


update : Msg -> Model msg -> ( Model msg, Maybe (EditorPluginResult CellContent) )
update msg model =
    case msg of
        SetSelector sel ->
            ( { model | selector = sel }
            , Nothing
            )

        ConfirmDocUrl url ->
            case model.selectedBlock of
                Just id ->
                    ( { model
                        | blocks =
                            Dict.update
                                id
                                (\mbVal ->
                                    case mbVal of
                                        Just val ->
                                            Just
                                                { val
                                                    | url = url
                                                    , targetBlank = True
                                                }

                                        Nothing ->
                                            Nothing
                                )
                                model.blocks
                        , selector = Closed
                      }
                    , Nothing
                    )

                Nothing ->
                    ( model, Nothing )

        ConfirmInternalPageUrl url ->
            case model.selectedBlock of
                Just id ->
                    ( { model
                        | blocks =
                            Dict.update
                                id
                                (\mbVal ->
                                    case mbVal of
                                        Just val ->
                                            Just
                                                { val
                                                    | url = url
                                                    , targetBlank = False
                                                }

                                        Nothing ->
                                            Nothing
                                )
                                model.blocks
                        , selector = Closed
                      }
                    , Nothing
                    )

                Nothing ->
                    ( model, Nothing )

        ExternalLinkPromptInput s ->
            ( { model | externalLinkInput = Just s }
            , Nothing
            )

        ConfirmExternalLink ->
            case ( model.selectedBlock, model.externalLinkInput ) of
                ( Just id, Just url ) ->
                    ( { model
                        | blocks =
                            Dict.update
                                id
                                (\mbVal ->
                                    case mbVal of
                                        Just val ->
                                            Just
                                                { val
                                                    | url = url
                                                    , targetBlank = True
                                                }

                                        Nothing ->
                                            Nothing
                                )
                                model.blocks
                        , selector = Closed
                      }
                    , Nothing
                    )

                _ ->
                    ( model, Nothing )

        SelectImage url ->
            case model.selectedBlock of
                Just id ->
                    ( { model
                        | blocks =
                            Dict.update
                                id
                                (\mbVal ->
                                    case mbVal of
                                        Just val ->
                                            Just { val | image = url }

                                        Nothing ->
                                            Nothing
                                )
                                model.blocks
                        , selector = Closed
                        , labelPromptInput = Nothing
                        , externalLinkInput = Nothing
                      }
                    , Nothing
                    )

                Nothing ->
                    ( model, Nothing )

        LabelPromptInput s ->
            ( { model | labelPromptInput = Just s }
            , Nothing
            )

        UpdateLabel ->
            case ( model.selectedBlock, model.labelPromptInput ) of
                ( Just id, Just newLabel ) ->
                    ( { model
                        | blocks =
                            Dict.update
                                id
                                (\mbVal ->
                                    case mbVal of
                                        Just val ->
                                            Just { val | label = newLabel }

                                        Nothing ->
                                            Nothing
                                )
                                model.blocks
                      }
                    , Nothing
                    )

                _ ->
                    ( model, Nothing )

        SetLinkType lt ->
            ( { model | linkType = lt }
            , Nothing
            )

        SelectBlock n ->
            ( { model | selectedBlock = Just n }
            , Nothing
            )

        AddBlock ->
            let
                newBlock =
                    { image = ""
                    , label = ""
                    , targetBlank = False
                    , url = ""
                    }

                nextId =
                    1
                        + (Dict.keys model.blocks
                            |> List.foldr (\k acc -> max k acc) 0
                          )
            in
            ( { model
                | blocks =
                    Dict.insert
                        nextId
                        newBlock
                        model.blocks
              }
            , Nothing
            )

        RemoveBlock ->
            case model.selectedBlock of
                Just id ->
                    ( { model
                        | blocks = Dict.remove id model.blocks
                      }
                    , Nothing
                    )

                Nothing ->
                    ( model, Nothing )

        SaveAndQuit ->
            ( model
            , Dict.values model.blocks
                |> BlockLinks
                |> EditorPluginData
                |> Just
            )

        Move dir ->
            case model.selectedBlock of
                Just n ->
                    let
                        xs =
                            Dict.toList model.blocks

                        l =
                            List.length xs

                        ( indexes, values ) =
                            List.unzip xs

                        mbInd =
                            findIndex (\( j, _ ) -> j == n) xs

                        newIndexes =
                            Maybe.map
                                (\i ->
                                    if dir == Left then
                                        swapAt i (i - 1) indexes
                                    else
                                        swapAt i (i + 1) indexes
                                )
                                mbInd
                                |> Maybe.withDefault indexes

                        newBlocks =
                            zip newIndexes values
                                |> Dict.fromList

                        selection =
                            if model.blocks == newBlocks then
                                Just n
                            else if dir == Left then
                                Just <| n - 1
                            else
                                Just <| n + 1
                    in
                    ( { model
                        | blocks = newBlocks
                        , selectedBlock = selection
                      }
                    , Nothing
                    )

                --        case dir of
                --            Left ->
                Nothing ->
                    ( model
                    , Nothing
                    )

        Quit ->
            ( model, Just EditorPluginQuit )

        NoOp ->
            ( model
            , Nothing
            )


view :
    { a
        | fileExplorer : FileExplorer.Model msg
        , pageTreeEditor : PageTreeEditor.Model msg
        , logInfo : Auth.AuthPlugin.LogInfo
        , zone : Time.Zone
    }
    -> Document.Config msg
    -> Model msg
    -> Element.Element msg
view config renderConfig model =
    column
        [ spacing 15
        , padding 15
        , alignTop
        , width fill
        ]
        [ topInterfaceView config renderConfig model
        , blockLinksPreview renderConfig model
        , Element.map model.externalMsg <|
            bottomInterfaceView
        ]


topInterfaceView :
    { a
        | fileExplorer : FileExplorer.Model msg
        , pageTreeEditor : PageTreeEditor.Model msg
        , logInfo : Auth.AuthPlugin.LogInfo
        , zone : Time.Zone
    }
    -> Document.Config msg
    -> Model msg
    -> Element.Element msg
topInterfaceView config renderConfig model =
    column
        [ spacing 15
        , below <|
            if model.selector == Closed then
                Element.none
            else
                el
                    [ Background.color (rgb 1 1 1)
                    , width (px 850)
                    , Border.shadow
                        { offset = ( 4, 4 )
                        , size = 5
                        , blur = 10
                        , color = rgba 0 0 0 0.45
                        }
                    ]
                    (dropDownView config renderConfig model)
        ]
        [ row
            [ spacing 15 ]
            [ Input.text
                (textInputStyle ++ [ width (px 300) ])
                { onChange =
                    model.externalMsg << LabelPromptInput
                , text =
                    if model.labelPromptInput == Nothing then
                        Maybe.andThen (\id -> Dict.get id model.blocks) model.selectedBlock
                            |> Maybe.map .label
                            |> Maybe.withDefault ""
                    else
                        model.labelPromptInput
                            |> Maybe.withDefault ""
                , placeholder = Nothing
                , label =
                    Input.labelLeft [] (el [ centerY ] (text "Nom du bloc: "))
                }
            , Input.button
                (buttonStyle (model.labelPromptInput /= Nothing))
                { onPress = Just <| model.externalMsg UpdateLabel
                , label = text "Valider"
                }
            , Input.button
                (buttonStyle
                    (model.selectedBlock
                        /= Nothing
                        && (model.selector == Closed)
                    )
                )
                { onPress =
                    Maybe.map
                        (\_ -> model.externalMsg (SetSelector SelectingImages))
                        model.selectedBlock
                , label = text "Modifier Image"
                }
            , Input.button
                (buttonStyle
                    (model.selectedBlock
                        /= Nothing
                        && (model.selector == Closed)
                    )
                )
                { onPress =
                    Maybe.map
                        (\_ -> model.externalMsg (SetSelector SelectingLink))
                        model.selectedBlock
                , label = text "Modifier lien"
                }
            ]
        , row
            [ spacing 15 ]
            [ Input.button
                (buttonStyle True)
                { onPress =
                    Just <| model.externalMsg AddBlock
                , label = text "Nouveau bloc"
                }
            , Input.button
                (buttonStyle (model.selectedBlock /= Nothing))
                { onPress =
                    Maybe.map (\_ -> model.externalMsg RemoveBlock)
                        model.selectedBlock
                , label = text "Supprimer bloc"
                }
            , Input.button
                (buttonStyle (model.selectedBlock /= Nothing))
                { onPress =
                    Maybe.map (\_ -> model.externalMsg (Move Left))
                        model.selectedBlock
                , label = text "Déplacer à gauche"
                }
            , Input.button
                (buttonStyle (model.selectedBlock /= Nothing))
                { onPress =
                    Maybe.map (\_ -> model.externalMsg (Move Right))
                        model.selectedBlock
                , label = text "Déplacer à droite"
                }
            ]
        ]


dropDownView config renderConfig model =
    case model.selector of
        SelectingImages ->
            imagePickerView config renderConfig model

        SelectingLink ->
            column
                [ spacing 15
                , width fill
                ]
                [ Input.radioRow
                    [ padding 15
                    , spacing 15
                    ]
                    { onChange =
                        model.externalMsg << SetLinkType
                    , options =
                        [ Input.option InternalLink (text "Lien interne")
                        , Input.option DocLink (text "Lien document")
                        , Input.option ExternalLink (text "Lien externe")
                        ]
                    , selected = Just model.linkType
                    , label = Input.labelHidden ""
                    }
                , case model.linkType of
                    InternalLink ->
                        chooseInternalPageView
                            model
                            renderConfig
                            config.pageTreeEditor
                            config.zone
                            config.logInfo

                    DocLink ->
                        chooseDocView
                            model
                            renderConfig
                            config.fileExplorer
                            config.zone
                            config.logInfo

                    ExternalLink ->
                        column
                            [ spacing 15
                            , padding 15
                            ]
                            [ row
                                [ spacing 15 ]
                                [ Input.text
                                    (textInputStyle ++ [ width (px 300) ])
                                    { onChange =
                                        model.externalMsg << ExternalLinkPromptInput
                                    , text =
                                        if model.externalLinkInput == Nothing then
                                            Maybe.andThen (\id -> Dict.get id model.blocks) model.selectedBlock
                                                |> Maybe.map
                                                    (\block ->
                                                        if block.targetBlank then
                                                            block.url
                                                        else
                                                            ""
                                                    )
                                                |> Maybe.withDefault ""
                                        else
                                            model.externalLinkInput
                                                |> Maybe.withDefault ""
                                    , placeholder = Nothing
                                    , label =
                                        Input.labelLeft [ centerY ] (el [] (text "Url lien externe: "))
                                    }
                                ]
                            , row
                                [ spacing 15 ]
                                [ Input.button
                                    (buttonStyle True)
                                    { onPress = Just (model.externalMsg <| SetSelector Closed)
                                    , label = text "Retour"
                                    }
                                , Input.button
                                    (buttonStyle (model.externalLinkInput /= Nothing))
                                    { onPress =
                                        Maybe.map (\_ -> model.externalMsg ConfirmExternalLink)
                                            model.externalLinkInput
                                    , label = text "Valider"
                                    }
                                ]
                            ]
                ]

        Closed ->
            Element.none


chooseDocView :
    Model msg
    -> Document.Config msg
    -> FileExplorer.Model msg
    -> Time.Zone
    -> LogInfo
    -> Element.Element msg
chooseDocView model renderConfig fileExplorer zone logInfo =
    column
        [ paddingEach
            { top = 0
            , bottom = 15
            , left = 0
            , right = 0
            }
        , spacing 15
        ]
        [ row
            [ paddingXY 15 0 ]
            [ el [] (text "Document: ")
            , el
                [ Font.family
                    [ Font.monospace ]
                ]
                (Maybe.andThen (\id -> Dict.get id model.blocks) model.selectedBlock
                    |> Maybe.map .url
                    |> Maybe.map
                        (\url ->
                            if String.startsWith "/baseDocumentaire" url then
                                url
                            else
                                ""
                        )
                    |> Maybe.withDefault ""
                    |> (\t ->
                            paragraph
                                [ Font.family
                                    [ Font.monospace ]
                                ]
                                [ text t ]
                       )
                )
            ]
        , FileExplorer.view
            { maxHeight =
                if renderConfig.height < 800 then
                    400
                else
                    500
            , zone = zone
            , logInfo = logInfo
            , mode = FileExplorer.ReadOnly FileExplorer.DocsRoot
            }
            fileExplorer
        , row
            [ padding 15 ]
            [ Input.button
                (buttonStyle True)
                { onPress = Just (model.externalMsg <| SetSelector Closed)
                , label = text "Retour"
                }
            , el [ paddingXY 15 0 ]
                (Input.button
                    (buttonStyle (FileExplorer.getSelectedDoc fileExplorer /= Nothing) ++ [ alignTop ])
                    { onPress =
                        Maybe.map (model.externalMsg << ConfirmDocUrl)
                            (FileExplorer.getSelectedDoc fileExplorer)
                    , label =
                        row [ spacing 5 ]
                            [ el [] (html <| Icons.externalLink iconSize)
                            , el [] (text "Valider")
                            ]
                    }
                )
            ]
        ]


chooseInternalPageView :
    Model msg
    -> Document.Config msg
    -> PageTreeEditor.Model msg
    -> Time.Zone
    -> LogInfo
    -> Element.Element msg
chooseInternalPageView model renderConfig pageTreeEditor zone logInfo =
    column
        [ paddingEach
            { top = 0
            , bottom = 15
            , left = 0
            , right = 0
            }
        , spacing 15
        , width fill
        ]
        [ row
            [ paddingXY 15 0 ]
            [ el [] (text "Url: ")
            , el
                [ Font.family
                    [ Font.monospace ]
                ]
                (Maybe.andThen (\id -> Dict.get id model.blocks) model.selectedBlock
                    |> Maybe.map .url
                    |> Maybe.andThen
                        (\url ->
                            PageTreeEditor.getPathFromId
                                pageTreeEditor
                                url
                        )
                    |> Maybe.withDefault ""
                    |> text
                )
            ]
        , PageTreeEditor.view
            { maxHeight =
                if renderConfig.height < 800 then
                    400
                else
                    500
            , zone = zone
            , logInfo = logInfo
            , mode = PageTreeEditor.Select
            }
            pageTreeEditor
        , row
            [ padding 15 ]
            [ Input.button
                (buttonStyle True)
                { onPress = Just (model.externalMsg <| SetSelector Closed)
                , label = text "Retour"
                }
            , el [ paddingXY 15 0 ]
                (Input.button
                    (buttonStyle (PageTreeEditor.internalPageSelectedPageInfo pageTreeEditor /= Nothing) ++ [ alignTop ])
                    { onPress =
                        PageTreeEditor.internalPageSelectedPageInfo pageTreeEditor
                            |> Maybe.andThen .mbContentId
                            |> Maybe.map canonical
                            |> Maybe.map (model.externalMsg << ConfirmInternalPageUrl)
                    , label =
                        row [ spacing 5 ]
                            [ el [] (html <| Icons.externalLink iconSize)
                            , el [] (text "Valider")
                            ]
                    }
                )
            ]
        ]


imagePickerView :
    { a
        | fileExplorer : FileExplorer.Model msg
        , logInfo : LogInfo
        , zone : Zone
    }
    -> Document.Config msg
    -> Model msg
    -> Element msg
imagePickerView config renderConfig model =
    column
        [ height fill
        , paddingEach
            { top = 0
            , bottom = 15
            , left = 0
            , right = 0
            }
        ]
        [ FileExplorer.view
            { maxHeight =
                if renderConfig.height < 800 then
                    400
                else
                    500
            , zone = config.zone
            , logInfo = config.logInfo
            , mode = FileExplorer.ReadWrite FileExplorer.ImagesRoot
            }
            config.fileExplorer
        , row
            [ spacing 15
            , paddingXY 15 0
            ]
            [ Input.button
                (buttonStyle True)
                { onPress = Just (model.externalMsg <| SetSelector Closed)
                , label = text "Retour"
                }
            , Input.button (buttonStyle (FileExplorer.getSelectedImage config.fileExplorer /= Nothing))
                { onPress =
                    FileExplorer.getSelectedImage config.fileExplorer
                        |> Maybe.map (model.externalMsg << SelectImage << .src)
                , label = text "Valider"
                }
            ]
        ]


blockLinksPreview : Document.Config msg -> Model msg -> Element msg
blockLinksPreview config model =
    wrappedRow
        [ width fill
        , height (maximum 600 fill)
        , scrollbarY
        ]
        (Dict.foldr
            (\id block acc ->
                el
                    [ Events.onClick (model.externalMsg <| SelectBlock id)
                    , if model.selectedBlock == Just id then
                        Border.shadow
                            { offset = ( 4, 4 )
                            , size = 5
                            , blur = 10
                            , color = rgba 0 0 0 0.45
                            }
                      else
                        noAttr
                    , padding 7
                    ]
                    (renderBlocksLinksMeta
                        config
                        { uid = 0
                        , docStyleId = Nothing
                        , htmlId = Nothing
                        , classes = Set.empty
                        }
                        []
                        block
                    )
                    :: acc
            )
            []
            model.blocks
        )


bottomInterfaceView : Element Msg
bottomInterfaceView =
    row
        [ spacing 15
        , paddingEach
            { top = 0
            , bottom = 15
            , right = 0
            , left = 0
            }
        ]
        [ Input.button (buttonStyle True)
            { onPress = Just Quit
            , label = text "Quitter"
            }
        , Input.button (buttonStyle True)
            { onPress = Just SaveAndQuit
            , label = text "Valider et Quitter"
            }
        ]


iconSize =
    18
