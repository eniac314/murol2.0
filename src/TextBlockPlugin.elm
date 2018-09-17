module TextBlockPlugin exposing (DocTextBlock, Msg, init, update, view)

--exposing (Html, node, option, select, text, textarea)

import Browser exposing (element)
import Delay exposing (..)
import Dict exposing (..)
import Document exposing (..)
import DocumentEditorHelpers exposing (..)
import DocumentView exposing (renderTextBlock)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Keyed as Keyed
import Element.Lazy as Lazy
import Element.Region as Region
import Hex exposing (fromString)
import Html as Html
import Html.Attributes as HtmlAttr
import Html.Events as HtmlEvents
import Icons exposing (..)
import Json.Decode as Decode
import Json.Encode as Encode
import Parser exposing (..)
import Random as Random
import Set exposing (..)
import StyleSheets exposing (StyleSheet, defaulStyleSheet)


type alias DocTextBlock =
    { rawInput : String
    , parsedInput : Result (List DeadEnd) (List Element)
    , selected : Maybe Selection
    , cursorPos : Maybe Int
    , output : List TextBlockElement
    , setSelection : Maybe Encode.Value
    , trackedData : Dict Int TrackedData
    , currentTrackedData : Maybe TrackedData
    , nextUid : Int
    , wholeTextBlocAttr : List DocAttribute
    , headingLevel : Maybe Int
    , internalUrlSelectorOpen : Bool
    , selectedInternalPage : Maybe String
    , selectedFolder : Maybe String
    , selectedFile : Maybe String
    , colorPickerOpen : Maybe String
    , randomInt : Int

    --, config : Config Msg
    }


type Msg
    = ---------------------------
      -- Textarea Manipulation --
      ---------------------------
      TextInput String
    | InsertTrackingTag TrackedDataKind
    | NewSelection Selection
    | SetSelection
      -----------------------
      -- TextBloc messages --
      -----------------------
    | SetTextBlocFont String
    | SetTextBlocFontSize String
    | SetTextBlocAlignment
    | SetTextBlocBold
    | SetTextBlocItalic
      -----------------------
      -- Headings messages --
      -----------------------
    | SelectHeadingLevel String
    | ConfirmHeadingLevel Int
      -----------------------------
      -- External Links messages --
      -----------------------------
    | SetUrl Int String
      -----------------------------
      -- Internal Links messages --
      -----------------------------
    | SetInternalLinkKind Int Bool
    | InternalUrlSelectorClick
    | InternalUrlSelectorClickOff
    | SelectInternalPage String
    | ConfirmInternalPageUrl Int
    | SelectFolder String
    | SelectFile String
    | ConfirmFileUrl Int
      ---------------------------
      -- Inline Style messages --
      ---------------------------
    | SetTextColor Int String
    | SetBackgroundColor Int String
    | SetInlineFont Int String
    | SetInlineFontSize Int String
    | SetInlineBold Int
    | SetInlineItalic Int
      ----------
      -- Misc --
      ----------
    | ColorPickerClick String
    | ColorPickerClickOff
    | SaveAndQuit
    | Quit
    | NewRandom Int
    | NoOp


type alias Selection =
    { start : Int
    , finish : Int
    , sel : String
    }



--main : Program () DocTextBlock Msg
--main =
--    Browser.element
--        { init =
--            init
--                [ FontSize 16
--                , Font "Arial"
--                ]
--                []
--        , update =
--            \model msg ->
--                let
--                    ( newModel, cmd, maybeOutput ) =
--                        update model msg
--                in
--                ( newModel, cmd )
--        , view = view
--        , subscriptions = subscriptions
--        }


subscriptions model =
    Sub.none



--init attrs input flags =


init attrs mbInput =
    let
        { resultString, trackedData, nextUid } =
            fromTextBloc
                (Maybe.withDefault
                    []
                    mbInput
                )
    in
    case run textBlock resultString of
        Ok res ->
            let
                newTrackedData =
                    updateTrackedData (Dict.fromList trackedData) res
            in
            ( { rawInput = resultString
              , parsedInput = Ok []
              , selected = Nothing
              , cursorPos = Nothing
              , output =
                    List.filterMap (toTextBlocElement newTrackedData) res
              , setSelection = Nothing
              , trackedData = newTrackedData
              , currentTrackedData = Nothing
              , nextUid = nextUid
              , wholeTextBlocAttr =
                    case List.filter isFontSizeAttr attrs of
                        [] ->
                            FontSize 16 :: attrs

                        _ ->
                            attrs
              , headingLevel = Nothing
              , internalUrlSelectorOpen = False
              , selectedInternalPage = Nothing
              , selectedFolder = Nothing
              , selectedFile = Nothing
              , colorPickerOpen = Nothing

              --, config =
              --      { width = 500
              --      , height = 800
              --      , styleSheet = defaulStyleSheet
              --      , containersBkgColors = False
              --      , customElems = Dict.empty
              --      , editMode = False
              --      , mainInterfaceHeight = 0
              --      , onLoadMsg = \_ -> NoOp
              --      , sizesDict = Dict.empty
              --      , zipperHandlers = Nothing
              --      }
              , randomInt = 0
              }
            , Cmd.none
            )

        Err _ ->
            ( { rawInput = resultString
              , parsedInput = Ok []
              , selected = Nothing
              , cursorPos = Nothing
              , output = []
              , setSelection = Nothing
              , trackedData = Dict.empty
              , currentTrackedData = Nothing
              , nextUid = 0
              , wholeTextBlocAttr =
                    attrs
              , headingLevel = Nothing
              , internalUrlSelectorOpen = False
              , selectedInternalPage = Nothing
              , selectedFolder = Nothing
              , selectedFile = Nothing
              , colorPickerOpen = Nothing

              --, config =
              --      { width = 500
              --      , height = 800
              --      , styleSheet = defaulStyleSheet
              --      , containersBkgColors = False
              --      , customElems = Dict.empty
              --      , editMode = False
              --      , mainInterfaceHeight = 0
              --      , onLoadMsg = \_ -> NoOp
              --      , sizesDict = Dict.empty
              --      , zipperHandlers = Nothing
              , randomInt = 0

              --      }
              }
            , Cmd.none
            )


update : Msg -> DocTextBlock -> ( DocTextBlock, Cmd Msg, Maybe (PluginResult ( List TextBlockElement, List DocAttribute )) )
update msg model =
    case msg of
        ---------------------------
        -- Textarea Manipulation --
        ---------------------------
        TextInput s ->
            case run textBlock s of
                Ok res ->
                    let
                        newTrackedData =
                            updateTrackedData model.trackedData res
                    in
                    ( { model
                        | rawInput = s
                        , parsedInput = Ok res
                        , trackedData = newTrackedData
                        , currentTrackedData =
                            getSelectedTrackedData model.cursorPos newTrackedData
                        , nextUid = findNextAvailableUid newTrackedData
                        , output = List.filterMap (toTextBlocElement newTrackedData) res
                      }
                    , Cmd.batch
                        [ Random.generate NewRandom (Random.int 0 10000) ]
                    , Nothing
                    )

                Err _ ->
                    ( model, Cmd.none, Nothing )

        InsertTrackingTag tdKind ->
            case insertTrackingTag model.rawInput model.selected model.nextUid tdKind of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just newRawInput ->
                    let
                        newParsedInput =
                            run textBlock newRawInput

                        newTrackedData =
                            Result.map (updateTrackedData model.trackedData) newParsedInput
                                |> Result.withDefault model.trackedData
                    in
                    ( { model
                        | rawInput = newRawInput
                        , parsedInput = newParsedInput
                        , trackedData = newTrackedData
                        , nextUid = findNextAvailableUid newTrackedData
                        , currentTrackedData =
                            getSelectedTrackedData (Maybe.map (\s -> s.start + 1) model.selected) newTrackedData
                        , output =
                            Result.map
                                (List.filterMap
                                    (toTextBlocElement newTrackedData)
                                )
                                newParsedInput
                                |> Result.withDefault model.output
                      }
                    , Cmd.batch
                        [ after 5 Millisecond SetSelection
                        , Random.generate NewRandom (Random.int 0 10000)
                        ]
                    , Nothing
                    )

        NewSelection s ->
            ( { model
                | selected =
                    if s.start == s.finish then
                        Nothing
                    else
                        Just s
                , cursorPos =
                    if s.start == s.finish then
                        Just s.start
                    else
                        Nothing
                , currentTrackedData =
                    if s.start == s.finish then
                        getSelectedTrackedData (Just s.start) model.trackedData
                    else
                        Nothing
                , setSelection =
                    if s.start == s.finish then
                        Maybe.map
                            (\td -> encodeSelection td.meta.start td.meta.stop)
                            (getSelectedTrackedData (Just s.start) model.trackedData)
                    else
                        Nothing
              }
            , Cmd.batch
                [ Random.generate NewRandom (Random.int 0 10000) ]
            , Nothing
            )

        SetSelection ->
            ( { model
                | setSelection =
                    Maybe.map
                        (\td -> encodeSelection td.meta.start td.meta.stop)
                        model.currentTrackedData
              }
            , Cmd.batch
                [ Random.generate NewRandom (Random.int 0 10000) ]
            , Nothing
            )

        -----------------------
        -- TextBloc messages --
        -----------------------
        SetTextBlocFont font ->
            ( { model
                | wholeTextBlocAttr =
                    updateAttrs isFontAttr Font font model.wholeTextBlocAttr
              }
            , Cmd.batch
                [ Random.generate NewRandom (Random.int 0 10000) ]
            , Nothing
            )

        SetTextBlocFontSize fontSize ->
            case String.toInt fontSize of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just fSize ->
                    ( { model
                        | wholeTextBlocAttr =
                            updateAttrs isFontSizeAttr FontSize fSize model.wholeTextBlocAttr
                      }
                    , Cmd.batch
                        [ Random.generate NewRandom (Random.int 0 10000) ]
                    , Nothing
                    )

        SetTextBlocAlignment ->
            ( { model
                | wholeTextBlocAttr =
                    updateAttrs (\a -> a == Justify) (\_ -> Justify) () model.wholeTextBlocAttr
              }
            , Cmd.batch
                [ Random.generate NewRandom (Random.int 0 10000) ]
            , Nothing
            )

        SetTextBlocBold ->
            ( { model
                | wholeTextBlocAttr =
                    updateAttrs (\a -> a == Bold) (\_ -> Bold) () model.wholeTextBlocAttr
              }
            , Cmd.batch
                [ Random.generate NewRandom (Random.int 0 10000) ]
            , Nothing
            )

        SetTextBlocItalic ->
            ( { model
                | wholeTextBlocAttr =
                    updateAttrs (\a -> a == Italic) (\_ -> Italic) () model.wholeTextBlocAttr
              }
            , Cmd.batch
                [ Random.generate NewRandom (Random.int 0 10000) ]
            , Nothing
            )

        -----------------------
        -- Headings messages --
        -----------------------
        SelectHeadingLevel strLevel ->
            ( { model | headingLevel = String.toInt strLevel }
            , Cmd.batch
                [ Random.generate NewRandom (Random.int 0 10000) ]
            , Nothing
            )

        ConfirmHeadingLevel uid ->
            case model.headingLevel of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just level ->
                    case Dict.get uid model.trackedData of
                        Nothing ->
                            ( model, Cmd.none, Nothing )

                        Just ({ attrs, meta, dataKind } as td) ->
                            let
                                newTrackedData =
                                    { td | dataKind = Heading level }

                                newTrackedDataDict =
                                    Dict.insert
                                        uid
                                        newTrackedData
                                        model.trackedData
                            in
                            ( { model
                                | trackedData = newTrackedDataDict
                                , currentTrackedData = Just newTrackedData
                                , headingLevel = Nothing
                                , output =
                                    Result.map
                                        (List.filterMap
                                            (toTextBlocElement newTrackedDataDict)
                                        )
                                        model.parsedInput
                                        |> Result.withDefault model.output
                              }
                            , Cmd.batch
                                [ Random.generate NewRandom (Random.int 0 10000) ]
                            , Nothing
                            )

        -----------------------------
        -- External Links messages --
        -----------------------------
        SetUrl uid url ->
            case Dict.get uid model.trackedData of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just ({ attrs, meta, dataKind } as td) ->
                    let
                        newTrackedData =
                            { td | dataKind = ExternalLink url }

                        newTrackedDataDict =
                            Dict.insert
                                uid
                                newTrackedData
                                model.trackedData
                    in
                    ( { model
                        | trackedData = newTrackedDataDict
                        , currentTrackedData = Just newTrackedData
                        , output =
                            Result.map
                                (List.filterMap
                                    (toTextBlocElement newTrackedDataDict)
                                )
                                model.parsedInput
                                |> Result.withDefault model.output
                      }
                    , Cmd.batch
                        [ Random.generate NewRandom (Random.int 0 10000) ]
                    , Nothing
                    )

        -----------------------------
        -- Internal Links messages --
        -----------------------------
        SetInternalLinkKind uid isDoc ->
            case Dict.get uid model.trackedData of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just ({ attrs, meta, dataKind } as td) ->
                    case dataKind of
                        InternalLink _ url ->
                            let
                                newTrackedData =
                                    { td | dataKind = InternalLink isDoc url }

                                newTrackedDataDict =
                                    Dict.insert
                                        uid
                                        newTrackedData
                                        model.trackedData
                            in
                            ( { model
                                | trackedData = newTrackedDataDict
                                , currentTrackedData = Just newTrackedData
                              }
                            , Cmd.batch
                                [ Random.generate NewRandom (Random.int 0 10000) ]
                            , Nothing
                            )

                        _ ->
                            ( model, Cmd.none, Nothing )

        InternalUrlSelectorClick ->
            ( { model
                | internalUrlSelectorOpen = not model.internalUrlSelectorOpen
              }
            , Cmd.batch
                [ Random.generate NewRandom (Random.int 0 10000) ]
            , Nothing
            )

        InternalUrlSelectorClickOff ->
            ( { model
                | internalUrlSelectorOpen = False
              }
            , Cmd.batch
                [ Random.generate NewRandom (Random.int 0 10000) ]
            , Nothing
            )

        SelectInternalPage p ->
            ( { model | selectedInternalPage = Just p }
            , Cmd.batch
                [ Random.generate NewRandom (Random.int 0 10000) ]
            , Nothing
            )

        ConfirmInternalPageUrl uid ->
            case model.selectedInternalPage of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just url ->
                    case Dict.get uid model.trackedData of
                        Nothing ->
                            ( model, Cmd.none, Nothing )

                        Just ({ attrs, meta, dataKind } as td) ->
                            let
                                newTrackedData =
                                    { td | dataKind = InternalLink False url }

                                newTrackedDataDict =
                                    Dict.insert
                                        uid
                                        newTrackedData
                                        model.trackedData
                            in
                            ( { model
                                | trackedData = newTrackedDataDict
                                , currentTrackedData = Just newTrackedData
                                , internalUrlSelectorOpen = False
                                , selectedInternalPage = Nothing
                                , output =
                                    Result.map
                                        (List.filterMap
                                            (toTextBlocElement newTrackedDataDict)
                                        )
                                        model.parsedInput
                                        |> Result.withDefault model.output
                              }
                            , Cmd.batch
                                [ Random.generate NewRandom (Random.int 0 10000) ]
                            , Nothing
                            )

        SelectFolder f ->
            ( { model | selectedFolder = Just f }
            , Cmd.batch
                [ Random.generate NewRandom (Random.int 0 10000) ]
            , Nothing
            )

        SelectFile f ->
            ( { model | selectedFile = Just f }
            , Cmd.batch
                [ Random.generate NewRandom (Random.int 0 10000) ]
            , Nothing
            )

        ConfirmFileUrl uid ->
            case model.selectedFile of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just url ->
                    case Dict.get uid model.trackedData of
                        Nothing ->
                            ( model, Cmd.none, Nothing )

                        Just ({ attrs, meta, dataKind } as td) ->
                            let
                                newTrackedData =
                                    { td | dataKind = InternalLink True url }

                                newTrackedDataDict =
                                    Dict.insert
                                        uid
                                        newTrackedData
                                        model.trackedData
                            in
                            ( { model
                                | trackedData = newTrackedDataDict
                                , currentTrackedData = Just newTrackedData
                                , internalUrlSelectorOpen = False
                                , selectedFile = Nothing
                                , output =
                                    Result.map
                                        (List.filterMap
                                            (toTextBlocElement newTrackedDataDict)
                                        )
                                        model.parsedInput
                                        |> Result.withDefault model.output
                              }
                            , Cmd.batch
                                [ Random.generate NewRandom (Random.int 0 10000) ]
                            , Nothing
                            )

        ---------------------------
        -- Inline Style messages --
        ---------------------------
        SetTextColor uid color ->
            case Dict.get uid model.trackedData of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just ({ attrs, meta, dataKind } as td) ->
                    let
                        newAttrs =
                            updateAttrs isFontColorAttr FontColor (hexColorToDocColor color) attrs

                        newTrackedData =
                            { td | attrs = newAttrs }

                        newTrackedDataDict =
                            Dict.insert
                                uid
                                newTrackedData
                                model.trackedData
                    in
                    ( { model
                        | trackedData = newTrackedDataDict
                        , currentTrackedData = Just newTrackedData
                        , colorPickerOpen = Nothing
                        , output =
                            Result.map
                                (List.filterMap
                                    (toTextBlocElement newTrackedDataDict)
                                )
                                model.parsedInput
                                |> Result.withDefault model.output
                      }
                    , Cmd.batch
                        [ Random.generate NewRandom (Random.int 0 10000) ]
                    , Nothing
                    )

        SetBackgroundColor uid color ->
            case Dict.get uid model.trackedData of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just ({ attrs, meta, dataKind } as td) ->
                    let
                        newAttrs =
                            updateAttrs isBackgroundColorAttr BackgroundColor (hexColorToDocColor color) attrs

                        newTrackedData =
                            { td | attrs = newAttrs }

                        newTrackedDataDict =
                            Dict.insert
                                uid
                                newTrackedData
                                model.trackedData
                    in
                    ( { model
                        | trackedData = newTrackedDataDict
                        , currentTrackedData = Just newTrackedData
                        , colorPickerOpen = Nothing
                        , output =
                            Result.map
                                (List.filterMap
                                    (toTextBlocElement newTrackedDataDict)
                                )
                                model.parsedInput
                                |> Result.withDefault model.output
                      }
                    , Cmd.batch
                        [ Random.generate NewRandom (Random.int 0 10000) ]
                    , Nothing
                    )

        SetInlineFont uid font ->
            case Dict.get uid model.trackedData of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just ({ attrs, meta, dataKind } as td) ->
                    let
                        newAttrs =
                            updateAttrs isFontAttr Font font attrs

                        newTrackedData =
                            { td | attrs = newAttrs }

                        newTrackedDataDict =
                            Dict.insert
                                uid
                                newTrackedData
                                model.trackedData
                    in
                    ( { model
                        | trackedData = newTrackedDataDict
                        , currentTrackedData = Just newTrackedData
                        , output =
                            Result.map
                                (List.filterMap
                                    (toTextBlocElement newTrackedDataDict)
                                )
                                model.parsedInput
                                |> Result.withDefault model.output
                      }
                    , Cmd.batch
                        [ Random.generate NewRandom (Random.int 0 10000) ]
                    , Nothing
                    )

        SetInlineFontSize uid fontSize ->
            case String.toInt fontSize of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just fSize ->
                    case Dict.get uid model.trackedData of
                        Nothing ->
                            ( model, Cmd.none, Nothing )

                        Just ({ attrs, meta, dataKind } as td) ->
                            let
                                newAttrs =
                                    updateAttrs isFontSizeAttr FontSize fSize attrs

                                newTrackedData =
                                    { td | attrs = newAttrs }

                                newTrackedDataDict =
                                    Dict.insert
                                        uid
                                        newTrackedData
                                        model.trackedData
                            in
                            ( { model
                                | trackedData = newTrackedDataDict
                                , currentTrackedData = Just newTrackedData
                                , output =
                                    Result.map
                                        (List.filterMap
                                            (toTextBlocElement newTrackedDataDict)
                                        )
                                        model.parsedInput
                                        |> Result.withDefault model.output
                              }
                            , Cmd.batch
                                [ Random.generate NewRandom (Random.int 0 10000) ]
                            , Nothing
                            )

        SetInlineBold uid ->
            case Dict.get uid model.trackedData of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just ({ attrs, meta, dataKind } as td) ->
                    let
                        newAttrs =
                            updateAttrs (\a -> a == Bold) (\_ -> Bold) () attrs

                        newTrackedData =
                            { td | attrs = newAttrs }

                        newTrackedDataDict =
                            Dict.insert
                                uid
                                newTrackedData
                                model.trackedData
                    in
                    ( { model
                        | trackedData = newTrackedDataDict
                        , currentTrackedData = Just newTrackedData
                        , output =
                            Result.map
                                (List.filterMap
                                    (toTextBlocElement newTrackedDataDict)
                                )
                                model.parsedInput
                                |> Result.withDefault model.output
                      }
                    , Cmd.batch
                        [ Random.generate NewRandom (Random.int 0 10000) ]
                    , Nothing
                    )

        SetInlineItalic uid ->
            case Dict.get uid model.trackedData of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just ({ attrs, meta, dataKind } as td) ->
                    let
                        newAttrs =
                            updateAttrs (\a -> a == Italic) (\_ -> Italic) () attrs

                        newTrackedData =
                            { td | attrs = newAttrs }

                        newTrackedDataDict =
                            Dict.insert
                                uid
                                newTrackedData
                                model.trackedData
                    in
                    ( { model
                        | trackedData = newTrackedDataDict
                        , currentTrackedData = Just newTrackedData
                        , output =
                            Result.map
                                (List.filterMap
                                    (toTextBlocElement newTrackedDataDict)
                                )
                                model.parsedInput
                                |> Result.withDefault model.output
                      }
                    , Cmd.batch
                        [ Random.generate NewRandom (Random.int 0 10000) ]
                    , Nothing
                    )

        ----------
        -- Misc --
        ----------
        ColorPickerClick name ->
            ( { model
                | colorPickerOpen =
                    case model.colorPickerOpen of
                        Just _ ->
                            Nothing

                        Nothing ->
                            Just name
              }
            , Cmd.batch
                [ Random.generate NewRandom (Random.int 0 10000) ]
            , Nothing
            )

        ColorPickerClickOff ->
            ( { model | colorPickerOpen = Nothing }
            , Cmd.batch
                [ Random.generate NewRandom (Random.int 0 10000) ]
            , Nothing
            )

        SaveAndQuit ->
            ( model
            , Cmd.none
            , Just <|
                PluginData
                    ( model.output
                    , model.wholeTextBlocAttr
                    )
            )

        Quit ->
            ( model
            , Cmd.none
            , Just PluginQuit
            )

        NewRandom n ->
            ( { model | randomInt = n }, Cmd.none, Nothing )

        NoOp ->
            ( model, Cmd.none, Nothing )



-------------------------------------------------------------------------------
-------------------
-- View functions --
-------------------


iconSize =
    18


view model config =
    --Element.layout [] <|
    column
        ([ padding 15
         , spacing 15
         ]
            ++ (if model.internalUrlSelectorOpen then
                    [ Events.onClick InternalUrlSelectorClickOff ]
                else if not (model.colorPickerOpen == Nothing) then
                    [ Events.onClick ColorPickerClickOff ]
                else
                    []
               )
        )
        [ interfaceView model
        , row
            [ spacing 30 ]
            [ column
                [ alignTop
                , spacing 20
                ]
                [ customTextArea
                    [ width fill
                    ]
                    model.cursorPos
                    model.setSelection
                    model.rawInput
                ]
            , textBlocPreview model config
            ]
        , row
            [ spacing 15
            , Font.size 16
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
        , Element.paragraph [] [ text <| String.fromInt model.randomInt ]
        , Element.paragraph []
            [ text <|
                case model.colorPickerOpen of
                    Nothing ->
                        "Nothing"

                    Just s ->
                        s
            ]
        ]


interfaceView model =
    column
        [ spacing 15
        ]
        [ row
            [ spacing 15
            , Font.size 16

            --, Background.color (rgba 0.3 1 0.5 0.5)
            , width fill
            ]
            [ Input.button
                (buttonStyle (not <| model.selected == Nothing))
                { onPress =
                    Just (InsertTrackingTag <| Heading 1)
                , label =
                    row [ spacing 5 ]
                        [ el [] (html <| type_ iconSize)
                        , el [] (text "Titre")
                        ]
                }
            , Input.button
                (buttonStyle (not <| model.selected == Nothing))
                { onPress = Just (InsertTrackingTag <| InternalLink False "")
                , label =
                    row [ spacing 5 ]
                        [ el [] (html <| link2 iconSize)
                        , el [] (text "Lien interne")
                        ]
                }
            , Input.button
                (buttonStyle (not <| model.selected == Nothing))
                { onPress = Just (InsertTrackingTag <| ExternalLink "")
                , label =
                    row [ spacing 5 ]
                        [ el [] (html <| Icons.externalLink iconSize)
                        , el [] (text "lien externe")
                        ]
                }
            , Input.button
                (buttonStyle (not <| model.selected == Nothing))
                { onPress = Just (InsertTrackingTag <| InlineStyled)
                , label =
                    row [ spacing 5 ]
                        [ el [] (html <| tag iconSize)
                        , el [] (text "Tag")
                        ]
                }
            ]
        , Keyed.row
            [ width fill
            , height (px 30)
            , Font.size 16
            ]
            ([ case model.currentTrackedData of
                Nothing ->
                    textBlockStyleView model

                Just ({ meta, attrs, dataKind } as td) ->
                    case dataKind of
                        Heading level ->
                            headingView model.headingLevel td

                        InternalLink isDoc url ->
                            internalLinkView
                                { isDoc = isDoc
                                , url = url
                                , pagesList = dummyInternalPageList
                                , fileList = dummyFileList
                                , selectorOpen = model.internalUrlSelectorOpen
                                , selectedInternalPage = model.selectedInternalPage
                                , selectedFolder = model.selectedFolder
                                , selectedFile = model.selectedFile
                                , td = td
                                }

                        ExternalLink url ->
                            externalLinkView url td

                        InlineStyled ->
                            inlineStyleView model td
             ]
                |> List.foldr
                    (\e ( n, acc ) ->
                        ( n + 1
                        , ( String.fromInt n, e ) :: acc
                        )
                    )
                    ( model.randomInt, [] )
                |> Tuple.second
            )
        ]



-- TODO: remove model?


textBlockStyleView model =
    let
        fontOptionView selectedFont f =
            Html.option
                [ HtmlAttr.value f
                , HtmlAttr.selected (selectedFont == (Just <| Font f))
                ]
                [ Html.text f ]

        fontSizeOptionView selectedSize fs =
            let
                selected =
                    String.toInt fs
                        |> Maybe.map (\fs_ -> selectedSize == (Just <| FontSize fs_))
                        |> Maybe.withDefault False
            in
            Html.option
                [ HtmlAttr.value fs
                , HtmlAttr.selected selected
                ]
                [ Html.text fs ]
    in
    row
        [ spacing 15

        --, Background.color (rgba 1 0 0.5 0.5)
        ]
        [ el
            []
            (html <|
                Html.select
                    [ HtmlEvents.onInput SetTextBlocFont
                    ]
                    (List.map
                        (fontOptionView
                            (List.filter isFontAttr model.wholeTextBlocAttr
                                |> List.head
                            )
                        )
                        fonts
                    )
            )
        , el
            []
            (html <|
                Html.select
                    [ HtmlEvents.onInput SetTextBlocFontSize
                    ]
                    (List.map
                        (fontSizeOptionView
                            (List.filter isFontSizeAttr model.wholeTextBlocAttr
                                |> List.head
                            )
                        )
                        fontSizes
                    )
            )
        , Input.button
            (toogleButtonStyle
                (List.member Justify model.wholeTextBlocAttr)
                (model.selected == Nothing)
            )
            { onPress = Just SetTextBlocAlignment
            , label =
                row [ spacing 5 ]
                    [ el [] (html <| alignJustify iconSize)
                    ]
            }
        , Input.button
            (toogleButtonStyle
                (List.member Bold model.wholeTextBlocAttr)
                (model.selected == Nothing)
            )
            { onPress = Just SetTextBlocBold
            , label =
                row [ spacing 5 ]
                    [ el [] (html <| bold iconSize)
                    ]
            }
        , Input.button
            (toogleButtonStyle
                (List.member Italic model.wholeTextBlocAttr)
                (model.selected == Nothing)
            )
            { onPress = Just SetTextBlocItalic
            , label =
                row [ spacing 5 ]
                    [ el [] (html <| italic iconSize)
                    ]
            }
        ]


headingView level { meta, attrs, dataKind } =
    row [ spacing 15 ]
        [ el []
            (html <|
                Html.select
                    [ HtmlEvents.onInput SelectHeadingLevel

                    --, HtmlAttr.disabled (lev == Nothing)
                    --, HtmlAttr.value (Maybe.map String.fromInt level |> Maybe.withDefault "")
                    ]
                    [ Html.option
                        [ HtmlAttr.value "1"
                        , HtmlAttr.selected (dataKind == Heading 1)
                        ]
                        [ Html.text "Niveau 1" ]
                    , Html.option
                        [ HtmlAttr.value "2"
                        , HtmlAttr.selected (dataKind == Heading 2)
                        ]
                        [ Html.text "Niveau 2" ]
                    , Html.option
                        [ HtmlAttr.value "3"
                        , HtmlAttr.selected (dataKind == Heading 3)
                        ]
                        [ Html.text "Niveau 3" ]
                    ]
            )
        , Input.button
            (buttonStyle (not (level == Nothing)) ++ [ alignTop ])
            { onPress = Just (ConfirmHeadingLevel meta.uid)
            , label =
                row [ spacing 5 ]
                    [ el [] (html <| Icons.externalLink iconSize)
                    , el [] (text "Valider")
                    ]
            }
        ]


internalLinkView config =
    row
        [ spacing 15
        , below <|
            if config.selectorOpen then
                column
                    [ htmlAttribute <|
                        HtmlEvents.stopPropagationOn "click" (Decode.succeed ( NoOp, True ))
                    , Background.color (rgb 0.95 0.95 0.95)

                    --, Border.width 1
                    --, Border.color (rgb 0.8 0.8 0.8)
                    ]
                    [ if config.isDoc then
                        chooseDocView config.td.meta.uid config.selectedFolder config.selectedFile config.fileList
                      else
                        chooseInternalPageView config.td.meta.uid config.selectedInternalPage config.pagesList
                    ]
            else
                Element.none
        ]
        [ row [ spacing 5 ]
            [ el [ Font.bold ] (text "Lien pour: ")
            , el [] (text config.td.meta.value)
            ]
        , Input.text
            [ width (px 150)
            , spacing 5
            , paddingXY 15 5
            , focused [ Border.glow (rgb 1 1 1) 0 ]
            , Font.family
                [ Font.monospace
                ]
            , Events.onClick InternalUrlSelectorClick
            ]
            { onChange = SetUrl config.td.meta.uid
            , text = config.url
            , placeholder = Nothing
            , label =
                Input.labelLeft
                    [ centerY
                    , Font.bold
                    ]
                    (Element.text "Url: ")
            }
        , Input.radioRow
            [ spacing 15 ]
            { onChange =
                SetInternalLinkKind config.td.meta.uid
            , options =
                [ Input.option
                    False
                    (text "page interne")
                , Input.option
                    True
                    (text "document")
                ]
            , selected =
                Just config.isDoc
            , label = Input.labelLeft [] Element.none
            }
        ]


chooseDocView uid mbFolder mbFile fileList =
    row
        [ padding 15
        , spacing 15
        ]
        [ column
            [ width (px 200)
            , height (px 150)
            , Border.width 1
            , Border.color (rgb 0.8 0.8 0.8)
            , scrollbarY
            , Background.color (rgb 1 1 1)
            ]
            (List.map (entryView mbFolder SelectFolder) (Dict.keys fileList))
        , column
            [ width (px 350)
            , height (px 150)
            , Border.width 1
            , Border.color (rgb 0.8 0.8 0.8)
            , clipX
            , scrollbarY
            , Background.color (rgb 1 1 1)
            ]
            (Maybe.andThen (\folder -> Dict.get folder fileList) mbFolder
                |> Maybe.map (List.map (entryView mbFile SelectFile))
                |> Maybe.withDefault []
            )
        , Input.button
            (buttonStyle (not (mbFile == Nothing)) ++ [ alignTop ])
            { onPress =
                if not (mbFile == Nothing) then
                    Just (ConfirmFileUrl uid)
                else
                    Nothing
            , label =
                row [ spacing 5 ]
                    [ el [] (html <| Icons.externalLink iconSize)
                    , el [] (text "Valider")
                    ]
            }
        ]


chooseInternalPageView uid mbSelected pagesList =
    row
        [ padding 15
        , spacing 15
        ]
        [ column
            [ width (px 200)
            , height (px 150)
            , Border.width 1
            , Border.color (rgb 0.8 0.8 0.8)
            , scrollbarY
            ]
            (List.map (entryView mbSelected SelectInternalPage) pagesList)
        , Input.button
            (buttonStyle (not (mbSelected == Nothing)) ++ [ alignTop ])
            { onPress =
                if not (mbSelected == Nothing) then
                    Just (ConfirmInternalPageUrl uid)
                else
                    Nothing
            , label =
                row [ spacing 5 ]
                    [ el [] (html <| Icons.externalLink iconSize)
                    , el [] (text "Valider")
                    ]
            }
        ]


externalLinkView : String -> TrackedData -> Element.Element Msg
externalLinkView url { meta, attrs, dataKind } =
    row [ spacing 15 ]
        [ row [ spacing 5 ]
            [ el [ Font.bold ] (text "Lien pour: ")
            , el [] (text meta.value)
            ]
        , Input.text
            [ width (px 150)
            , spacing 5
            , paddingXY 15 5
            , focused [ Border.glow (rgb 1 1 1) 0 ]
            , Font.family
                [ Font.monospace
                ]
            ]
            { onChange = SetUrl meta.uid
            , text = url
            , placeholder = Nothing
            , label =
                Input.labelLeft
                    [ centerY
                    , Font.bold
                    ]
                    (Element.text "Url: ")
            }
        ]


inlineStyleView model ({ meta, attrs, dataKind } as td) =
    let
        fontOptionView selectedFont f =
            Html.option
                [ HtmlAttr.value f
                , HtmlAttr.selected (selectedFont == (Just <| Font f))
                ]
                [ Html.text f ]

        fontSizeOptionView selectedSize fs =
            let
                selected =
                    String.toInt fs
                        |> Maybe.map (\fs_ -> selectedSize == (Just <| FontSize fs_))
                        |> Maybe.withDefault False
            in
            Html.option
                [ HtmlAttr.value fs
                , HtmlAttr.selected selected
                ]
                [ Html.text fs ]
    in
    Keyed.row [ spacing 15 ]
        ([ Input.button
            (toogleButtonStyle
                (List.member Bold attrs)
                True
            )
            { onPress = Just (SetInlineBold meta.uid)
            , label =
                row [ spacing 5 ]
                    [ el [] (html <| bold iconSize)
                    ]
            }
         , Input.button
            (toogleButtonStyle
                (List.member Italic attrs)
                True
            )
            { onPress = Just (SetInlineItalic meta.uid)
            , label =
                row [ spacing 5 ]
                    [ el [] (html <| italic iconSize)
                    ]
            }
         , el
            []
            (html <|
                Html.select
                    [ HtmlEvents.onInput (SetInlineFont meta.uid)
                    ]
                    (List.map
                        (fontOptionView
                            (List.filter isFontAttr attrs
                                |> List.head
                            )
                        )
                        fonts
                    )
            )
         , el
            []
            (html <|
                Html.select
                    [ HtmlEvents.onInput (SetInlineFontSize meta.uid)
                    ]
                    (List.map
                        (fontSizeOptionView
                            (List.filter isFontSizeAttr attrs
                                |> List.head
                            )
                        )
                        fontSizes
                    )
            )
         , Keyed.el
            []
            ( String.fromInt model.randomInt
            , colorPicker
                model.colorPickerOpen
                (List.filter isFontColorAttr attrs
                    |> List.head
                )
                "Couleur du texte"
                SetTextColor
                meta.uid
            )
         , colorPicker
            model.colorPickerOpen
            (List.filter isBackgroundColorAttr attrs
                |> List.head
            )
            "Couleur du fond"
            SetBackgroundColor
            meta.uid
         ]
            |> List.foldr
                (\e ( n, acc ) ->
                    ( n + 1
                    , ( String.fromInt n, e ) :: acc
                    )
                )
                ( model.randomInt, [] )
            |> Tuple.second
        )


customTextArea attrs cursorPos setSelection rawInput =
    el attrs
        (html <|
            Html.node "custom-textarea"
                ([ HtmlEvents.onInput TextInput
                 , HtmlEvents.on "Selection" decodeSelection
                 ]
                    ++ (case setSelection of
                            Just selection ->
                                [ HtmlAttr.property "selection" selection ]

                            Nothing ->
                                []
                       )
                )
                [ Html.textarea
                    [ HtmlAttr.style "font-family" "Arial"
                    , HtmlAttr.style "font-size" "16px"
                    , HtmlAttr.cols 60
                    , HtmlAttr.style "height" "500px"
                    , HtmlAttr.style "spellcheck" "false"
                    , HtmlAttr.value rawInput
                    ]
                    []
                ]
        )


textBlocPreview model config =
    Element.map (\_ -> NoOp) <|
        column
            [ width (minimum 500 fill)
            , spacing 20
            , alignTop
            ]
            (renderTextBlock
                config
                model.wholeTextBlocAttr
                model.output
            )


colorPicker colorPickerOpen currentColor label msg uid =
    let
        currentColor_ =
            case currentColor of
                Just (FontColor (DocColor r g b)) ->
                    rgb r g b

                Just (BackgroundColor (DocColor r g b)) ->
                    rgb r g b

                _ ->
                    rgb 1 1 1

        colorPanView mbMsg color =
            el
                ([ width (px 14)
                 , height (px 14)
                 , Background.color (hexToColor color)
                 , Border.width 1
                 , Border.color (rgb 0 0 0)
                 , pointer
                 , mouseOver
                    [ Border.color (rgb 0.9 0.9 0.9) ]
                 ]
                    ++ (case mbMsg of
                            Just msg_ ->
                                [ Events.onClick (msg_ uid color) ]

                            Nothing ->
                                []
                       )
                )
                Element.none

        colors =
            chunks 12 webColors
                --(List.sortBy (\( n, c ) -> c) webColors)
                |> List.map
                    (\r ->
                        row [ spacing 3 ]
                            (List.map
                                (\( n, c ) ->
                                    colorPanView (Just msg) c
                                )
                                r
                            )
                    )
    in
    el
        [ below <|
            el
                [ --htmlAttribute <|
                  --    HtmlEvents.stopPropagationOn "click" (Decode.succeed ( NoOp, True ))
                  Background.color (rgb 0.95 0.95 0.95)
                ]
                (case colorPickerOpen of
                    Just l ->
                        if l == label then
                            column
                                [ spacing 3
                                , padding 10
                                ]
                                colors
                        else
                            Element.none

                    Nothing ->
                        Element.none
                )
        ]
        (Input.button
            (buttonStyle True)
            { onPress = Just (ColorPickerClick label)
            , label =
                row [ spacing 10 ]
                    [ el [] (text label)
                    , el
                        [ width (px 14)
                        , height (px 14)
                        , Background.color currentColor_
                        , Border.width 1
                        , Border.color (rgb 0 0 0)
                        ]
                        Element.none
                    ]
            }
        )



-------------------------------------------------------------------------------
----------------------
-- TextBlock Parser --
----------------------


type Element
    = ParagraphElement (List Primitive)
    | UListElement (List Primitive)
    | HeadingElement PrimitiveMeta
    | Singleton Primitive


type Primitive
    = InternalLinkPrimitive PrimitiveMeta
    | ExternalLinkPrimitive PrimitiveMeta
    | InlineStylePrimitive PrimitiveMeta
    | TextPrimitive String
    | WordPrimitive String


type alias PrimitiveMeta =
    { start : Int
    , stop : Int
    , uid : Int
    , value : String
    }


textBlock : Parser (List Element)
textBlock =
    let
        helper elems =
            oneOf
                [ Parser.map (\_ -> Done (List.reverse elems)) end
                , succeed (\h -> Loop (h :: elems))
                    |= heading
                    |> backtrackable
                , succeed (\ul -> Loop (ul :: elems))
                    |= uList
                    |> backtrackable
                , succeed (\p -> Loop (p :: elems))
                    |= paragraph
                ]
    in
    loop [] helper


paragraph : Parser Element
paragraph =
    let
        helper prims =
            oneOf
                [ Parser.map (\_ -> Done (List.reverse prims)) break
                , Parser.map (\_ -> Done (List.reverse prims)) end
                , succeed (\p -> Loop (p :: prims))
                    |= primitive
                ]
    in
    loop [] helper
        |> Parser.map groupWordsIntoText
        |> Parser.map ParagraphElement


uList : Parser Element
uList =
    let
        helper prims =
            oneOf
                [ Parser.map (\_ -> Done (List.reverse prims)) break
                , Parser.map (\_ -> Done (List.reverse prims)) end
                , succeed (\p -> Loop (p :: prims))
                    |= primitive
                ]
    in
    succeed identity
        |. spaces
        |. keyword "*"
        |. spaces
        |= (loop [] helper
                |> Parser.map groupWordsIntoText
           )
        |> Parser.map UListElement


heading : Parser Element
heading =
    succeed
        (\start uid val stop ->
            HeadingElement
                { start = start
                , stop = stop
                , uid = uid
                , value = val
                }
        )
        |. spaces
        |= getOffset
        |. symbol "<"
        |. spaces
        |. token "titre"
        |. spaces
        |= int
        |. spaces
        |. symbol ">"
        |= (chompUntil "<"
                |> getChompedString
           )
        |. keyword "</>"
        |= getOffset
        |. oneOf
            [ end
            , spaces
            ]


primitive : Parser Primitive
primitive =
    oneOf
        [ backtrackable allPrimitivesButText
        , word
        ]


allPrimitivesButText : Parser Primitive
allPrimitivesButText =
    oneOf
        [ backtrackable internalLink
        , backtrackable externalLink
        , inlineStyle
        ]



-- NOTE: There is no text Parser, WordPrimitive are transformed into
-- TextPrimitive by the groupWordsIntoText function.


word : Parser Primitive
word =
    succeed identity
        |. spaces
        |= (chompWhile (\c -> not <| c == ' ' || c == '\t' || c == '\n')
                |> getChompedString
           )
        |> Parser.map WordPrimitive


internalLink : Parser Primitive
internalLink =
    succeed
        (\start uid val stop ->
            InternalLinkPrimitive
                { start = start
                , stop = stop
                , uid = uid
                , value = val
                }
        )
        |. spaces
        |= getOffset
        |. symbol "<"
        |. spaces
        |. keyword "lien-interne"
        |. spaces
        |= int
        |. spaces
        |. symbol ">"
        |= (chompUntil "<"
                |> getChompedString
           )
        |. keyword "</>"
        |= getOffset


externalLink : Parser Primitive
externalLink =
    succeed
        (\start uid val stop ->
            ExternalLinkPrimitive
                { start = start
                , stop = stop
                , uid = uid
                , value = val
                }
        )
        |. spaces
        |= getOffset
        |. symbol "<"
        |. spaces
        |. keyword "lien-externe"
        |. spaces
        |= int
        |. spaces
        |. symbol ">"
        |= (chompUntil "<"
                |> getChompedString
           )
        |. keyword "</>"
        |= getOffset


inlineStyle : Parser Primitive
inlineStyle =
    succeed
        (\start uid val stop ->
            InlineStylePrimitive
                { start = start
                , stop = stop
                , uid = uid
                , value = val
                }
        )
        |. spaces
        |= getOffset
        |. symbol "<"
        |. spaces
        |. keyword "style"
        |. spaces
        |= int
        |. spaces
        |. symbol ">"
        |= (chompUntil "<"
                |> getChompedString
           )
        |. keyword "</>"
        |= getOffset



-- misc


break : Parser ()
break =
    succeed ()
        |. reallyspaces
        |. keyword "\n"
        |. spaces
        |> backtrackable


reallyspaces : Parser ()
reallyspaces =
    chompWhile (\c -> c == ' ')



-------------------------------------------------------------------------------
---------------------------
-- Tracked Data functions--
---------------------------
-- NOTE: This exists in order to allow DocAttributes to be affected to some
-- primitives. These DocAttributes are stored in the model and not
-- in the input string in order to reduce visual clutter.


type alias TrackedData =
    { meta : PrimitiveMeta
    , attrs : List DocAttribute
    , dataKind : TrackedDataKind
    }


type TrackedDataKind
    = InternalLink Bool String
    | ExternalLink String
    | Heading Int
    | InlineStyled


updateTrackedData : Dict Int TrackedData -> List Element -> Dict Int TrackedData
updateTrackedData currentTrackedData elems =
    let
        getTrackedPrim =
            \p ->
                case p of
                    InternalLinkPrimitive pm ->
                        Just
                            { meta = pm
                            , attrs = []
                            , dataKind = InternalLink False ""
                            }

                    ExternalLinkPrimitive pm ->
                        Just
                            { meta = pm
                            , attrs = []
                            , dataKind = ExternalLink ""
                            }

                    InlineStylePrimitive pm ->
                        Just
                            { meta = pm
                            , attrs = []
                            , dataKind = InlineStyled
                            }

                    _ ->
                        Nothing

        newTrackedDataList =
            List.filterMap
                (\e ->
                    case e of
                        HeadingElement meta ->
                            Just
                                [ { meta = meta
                                  , attrs = []
                                  , dataKind = Heading 1
                                  }
                                ]

                        ParagraphElement xs ->
                            Just <| List.filterMap getTrackedPrim xs

                        UListElement xs ->
                            Just <| List.filterMap getTrackedPrim xs

                        Singleton p ->
                            getTrackedPrim p
                                |> Maybe.map (\td -> [ td ])
                )
                elems
                |> List.concat
    in
    newTrackedDataList
        |> List.map (\td -> ( td.meta.uid, td ))
        |> (\tds ->
                --NOTE: Keep existing attributes
                List.foldr
                    (\( uid, td ) acc ->
                        Dict.update
                            uid
                            (\mbValue ->
                                case mbValue of
                                    Nothing ->
                                        Just td

                                    Just { meta, attrs, dataKind } ->
                                        Just
                                            { meta = td.meta
                                            , attrs = attrs
                                            , dataKind = dataKind
                                            }
                            )
                            acc
                    )
                    currentTrackedData
                    tds
           )
        |> (\d ->
                -- NOTE: Remove obsolete tracked data
                let
                    newKeys =
                        List.map (.meta >> .uid) newTrackedDataList
                in
                List.foldr
                    (\k acc ->
                        if not (List.member k newKeys) then
                            Dict.remove k acc
                        else
                            acc
                    )
                    d
                    (Dict.keys d)
           )


getSelectedTrackedData : Maybe Int -> Dict Int TrackedData -> Maybe TrackedData
getSelectedTrackedData mbCursorPos trackedDataDict =
    case mbCursorPos of
        Nothing ->
            Nothing

        Just cursorPos ->
            let
                isCursorInTrackedData td =
                    cursorPos
                        >= td.meta.start
                        && cursorPos
                        < td.meta.stop
            in
            Dict.toList trackedDataDict
                |> List.map Tuple.second
                |> List.filter isCursorInTrackedData
                |> List.head


findNextAvailableUid : Dict Int TrackedData -> Int
findNextAvailableUid trackedData =
    Dict.keys trackedData
        |> List.foldr max 0
        |> (\n -> n + 1)



-------------------------------------------------------------------------------
-----------------------
-- makeTag functions --
-----------------------
--NOTE: These function insert tracked tag into the input string


insertTrackingTag : String -> Maybe Selection -> Int -> TrackedDataKind -> Maybe String
insertTrackingTag rawInput selection nextUid tdKind =
    case tdKind of
        InternalLink _ _ ->
            insertTagHelper rawInput selection nextUid "lien-interne"

        ExternalLink _ ->
            insertTagHelper rawInput selection nextUid "lien-externe"

        Heading _ ->
            insertTagHelper
                rawInput
                selection
                nextUid
                "titre"

        InlineStyled ->
            insertTagHelper rawInput selection nextUid "style"


insertTagHelper : String -> Maybe Selection -> Int -> String -> Maybe String
insertTagHelper rawInput selection nextUid tagname =
    case selection of
        Nothing ->
            Nothing

        Just { start, finish, sel } ->
            let
                firstHalf =
                    String.left start rawInput

                secondHalf =
                    String.dropLeft finish rawInput

                needSpace =
                    String.trim secondHalf
                        |> (\s ->
                                not <|
                                    String.startsWith "." s
                                        || String.startsWith "," s
                           )

                newLink =
                    " <"
                        ++ tagname
                        ++ " "
                        ++ String.fromInt nextUid
                        ++ "> "
                        ++ sel
                        ++ (if needSpace then
                                " </> "
                            else
                                "</>"
                           )
            in
            Just (firstHalf ++ newLink ++ secondHalf)



-------------------------------------------------------------------------------
---------------------------------
-- toTextBlocElement functions --
---------------------------------


toTextBlocElement : Dict Int TrackedData -> Element -> Maybe TextBlockElement
toTextBlocElement trackedData elem =
    case elem of
        ParagraphElement prims ->
            Just <|
                Paragraph []
                    (List.filterMap (toTextBlockPrimitive trackedData) prims)

        UListElement prims ->
            Just <|
                UList []
                    [ List.filterMap (toTextBlockPrimitive trackedData) prims
                    ]

        HeadingElement { uid, value } ->
            case
                Dict.get uid trackedData
                    |> Maybe.map (\td -> ( td.attrs, td.dataKind ))
            of
                Just ( attrs, Heading level ) ->
                    Just <| Document.Heading attrs ( level, value )

                _ ->
                    Nothing

        Singleton prim ->
            Maybe.map TBPrimitive (toTextBlockPrimitive trackedData prim)


toTextBlockPrimitive : Dict Int TrackedData -> Primitive -> Maybe TextBlockPrimitive
toTextBlockPrimitive trackedData prim =
    case prim of
        ExternalLinkPrimitive { uid, value } ->
            case
                Dict.get uid trackedData
                    |> Maybe.map (\td -> ( td.attrs, td.dataKind ))
            of
                Just ( attrs, ExternalLink url ) ->
                    Just <|
                        Document.Link
                            attrs
                            { targetBlank = True
                            , url = url
                            , label = value
                            }

                _ ->
                    Nothing

        InternalLinkPrimitive { uid, value } ->
            case
                Dict.get uid trackedData
                    |> Maybe.map (\td -> ( td.attrs, td.dataKind ))
            of
                Just ( attrs, InternalLink isFile url ) ->
                    Just <|
                        Document.Link
                            attrs
                            { targetBlank = isFile
                            , url = url
                            , label = value
                            }

                _ ->
                    Nothing

        InlineStylePrimitive { uid, value } ->
            case
                Dict.get uid trackedData
                    |> Maybe.map (\td -> ( td.attrs, td.dataKind ))
            of
                Just ( attrs, InlineStyled ) ->
                    Just <|
                        Document.Text attrs value

                _ ->
                    Nothing

        TextPrimitive value ->
            Just <| Document.Text [] value

        _ ->
            Nothing



-------------------------------------------------------------------------------
-----------------------------------
-- FromTextBloc functions --
-----------------------------------


type alias ProcessedInput =
    { resultString : String
    , trackedData : List ( Int, TrackedData )
    , nextUid : Int
    }


defmeta uid value =
    { start = 0
    , stop = 0
    , uid = uid
    , value = value
    }


fromTextBloc : List TextBlockElement -> ProcessedInput
fromTextBloc tbes =
    let
        fixSymbols s =
            String.replace " </> ." "</> ." s
                |> String.replace " </> ," "</> ,"
    in
    List.foldr
        (\tbe { resultString, trackedData, nextUid } ->
            let
                newProcessedInput =
                    fromTextBlocElement nextUid tbe
            in
            { resultString =
                newProcessedInput.resultString ++ " " ++ resultString
            , trackedData =
                newProcessedInput.trackedData ++ trackedData
            , nextUid = nextUid + newProcessedInput.nextUid
            }
        )
        { resultString = ""
        , trackedData = []
        , nextUid = 0
        }
        tbes
        |> (\res -> { res | resultString = fixSymbols res.resultString })


fromTextBlocElement : Int -> TextBlockElement -> ProcessedInput
fromTextBlocElement nextUid_ tbe =
    case tbe of
        Paragraph _ tbps ->
            List.foldr
                (\tbp { resultString, trackedData, nextUid } ->
                    let
                        newProcessedInput =
                            fromTextBlocPrimitive nextUid tbp
                    in
                    { resultString =
                        newProcessedInput.resultString ++ " " ++ resultString
                    , trackedData =
                        newProcessedInput.trackedData ++ trackedData
                    , nextUid = nextUid + 1
                    }
                )
                { resultString = ""
                , trackedData = []
                , nextUid = nextUid_
                }
                tbps
                |> (\res ->
                        { res | resultString = res.resultString ++ "\n\n" }
                   )

        UList _ tbps ->
            let
                processLi li nextUid__ =
                    List.foldr
                        (\tbp { resultString, trackedData, nextUid } ->
                            let
                                newProcessedInput =
                                    fromTextBlocPrimitive nextUid tbp
                            in
                            { resultString =
                                newProcessedInput.resultString ++ " " ++ resultString
                            , trackedData =
                                newProcessedInput.trackedData ++ trackedData
                            , nextUid = nextUid + 1
                            }
                        )
                        { resultString = ""
                        , trackedData = []
                        , nextUid = nextUid__
                        }
                        li
                        |> (\res ->
                                { res | resultString = "* " ++ res.resultString ++ "\n" }
                           )
            in
            List.foldr
                (\li { resultString, trackedData, nextUid } ->
                    let
                        newProcessedInput =
                            processLi li nextUid
                    in
                    { resultString =
                        newProcessedInput.resultString ++ resultString
                    , trackedData =
                        newProcessedInput.trackedData ++ trackedData
                    , nextUid = nextUid + newProcessedInput.nextUid
                    }
                )
                { resultString = ""
                , trackedData = []
                , nextUid = nextUid_
                }
                tbps

        Document.Heading _ ( level, value ) ->
            { resultString =
                "< titre "
                    ++ String.fromInt nextUid_
                    ++ " > "
                    ++ value
                    ++ " </>\n"
            , trackedData =
                [ ( nextUid_
                  , { meta = defmeta nextUid_ value
                    , attrs = []
                    , dataKind = Heading level
                    }
                  )
                ]
            , nextUid = nextUid_ + 1
            }

        TBPrimitive prim ->
            fromTextBlocPrimitive nextUid_ prim


fromTextBlocPrimitive : Int -> TextBlockPrimitive -> ProcessedInput
fromTextBlocPrimitive nextUid tbp =
    case tbp of
        Text [] s ->
            { resultString = s
            , trackedData = []
            , nextUid = nextUid
            }

        Text attrs s ->
            { resultString =
                "< style "
                    ++ String.fromInt nextUid
                    ++ " > "
                    ++ s
                    ++ " </>"
            , trackedData =
                [ ( nextUid
                  , { meta = defmeta nextUid s
                    , attrs = attrs
                    , dataKind = InlineStyled
                    }
                  )
                ]
            , nextUid = nextUid + 1
            }

        Link attrs { targetBlank, url, label } ->
            { resultString =
                (if targetBlank then
                    "< lien-externe "
                 else
                    "< lien-interne "
                )
                    ++ String.fromInt nextUid
                    ++ " > "
                    ++ label
                    ++ " </>"
            , trackedData =
                [ ( nextUid
                  , { meta = defmeta nextUid label
                    , attrs = attrs
                    , dataKind =
                        if targetBlank then
                            ExternalLink url
                        else
                            InternalLink
                                (String.startsWith "/baseDocumentaire" url)
                                url
                    }
                  )
                ]
            , nextUid = nextUid + 1
            }



-------------------------------------------------------------------------------
----------
-- Misc --
----------


groupWordsIntoText : List Primitive -> List Primitive
groupWordsIntoText prims =
    -- NOTE: this functions concatenate all adjacent WordPrimitive primitives into
    -- TextPrimitive.
    let
        helper buffer acc xs =
            case xs of
                [] ->
                    case buffer of
                        [] ->
                            List.reverse acc

                        _ ->
                            List.reverse buffer
                                |> String.join " "
                                |> TextPrimitive
                                |> (\nw -> List.reverse (nw :: acc))

                x :: xs_ ->
                    case x of
                        WordPrimitive w ->
                            helper (w :: buffer) acc xs_

                        _ ->
                            case buffer of
                                [] ->
                                    helper buffer (x :: acc) xs_

                                _ ->
                                    helper
                                        []
                                        (List.reverse buffer
                                            |> String.join " "
                                            |> TextPrimitive
                                            |> (\nw -> x :: nw :: acc)
                                        )
                                        xs_
    in
    helper [] [] prims


encodeSelection : Int -> Int -> Encode.Value
encodeSelection start stop =
    Encode.object
        [ ( "start", Encode.int start )
        , ( "stop", Encode.int stop )
        ]


decodeSelection : Decode.Decoder Msg
decodeSelection =
    Decode.at [ "target", "selection" ]
        (Decode.map3 Selection
            (Decode.field "start" Decode.int)
            (Decode.field "finish" Decode.int)
            (Decode.field "sel" Decode.string)
            |> Decode.map NewSelection
        )


toogleButtonStyle isPressed isActive =
    [ Border.rounded 5
    , Font.center
    , centerY
    , padding 5
    , focused [ Border.glow (rgb 1 1 1) 0 ]
    ]
        ++ (if isActive then
                [ Background.color (rgb 0.9 0.9 0.9)
                , Border.width 1
                , Border.color (rgb 0.9 0.9 0.9)
                , mouseOver
                    [ Font.color (rgb 0.3 0.3 0.3)
                    ]
                ]
                    ++ (if isPressed then
                            []
                        else
                            [ Background.color (rgb 1 1 1)
                            , Border.width 1
                            , Border.color (rgb 0.9 0.9 0.9)
                            ]
                       )
            else
                [ Background.color (rgb 0.95 0.95 0.95)
                , Font.color (rgb 0.7 0.7 0.7)
                , htmlAttribute <| HtmlAttr.style "cursor" "default"
                , Border.width 1
                , Border.color (rgb 0.95 0.95 0.95)
                ]
           )


buttonStyle isActive =
    [ Border.rounded 5
    , Font.center
    , centerY
    , padding 5
    , focused [ Border.glow (rgb 1 1 1) 0 ]
    ]
        ++ (if isActive then
                [ Background.color (rgb 0.9 0.9 0.9)
                , mouseOver [ Font.color (rgb 255 255 255) ]
                , Border.width 1
                , Border.color (rgb 0.9 0.9 0.9)
                ]
            else
                [ Background.color (rgb 0.95 0.95 0.95)
                , Font.color (rgb 0.7 0.7 0.7)
                , htmlAttribute <| HtmlAttr.style "cursor" "default"
                , Border.width 1
                , Border.color (rgb 0.95 0.95 0.95)
                ]
           )


entryView : Maybe String -> (String -> Msg) -> String -> Element.Element Msg
entryView mbSel msg e =
    el
        [ Events.onClick (msg e)
        , pointer
        , mouseOver
            [ Font.color (rgb 1 1 1)
            , Background.color (rgb 0.7 0.7 0.7)
            ]
        , case mbSel of
            Just sel ->
                if sel == e then
                    Background.color (rgb 0.8 0.8 0.8)
                else
                    Background.color (rgb 1 1 1)

            _ ->
                Background.color (rgb 1 1 1)
        , width fill
        , paddingXY 15 5
        ]
        (text e)


hexToColor : String -> Color
hexToColor hexColor =
    let
        hexColor_ =
            String.toLower hexColor

        red =
            String.left 2 hexColor_
                |> Hex.fromString
                |> Result.withDefault 0
                |> toFloat

        green =
            String.dropLeft 2 hexColor_
                |> String.left 2
                |> Hex.fromString
                |> Result.withDefault 0
                |> toFloat

        blue =
            String.dropLeft 4 hexColor_
                |> String.left 2
                |> Hex.fromString
                |> Result.withDefault 0
                |> toFloat
    in
    rgb (red / 255) (green / 255) (blue / 255)


hexColorToDocColor : String -> DocColor
hexColorToDocColor hexColor =
    let
        hexColor_ =
            String.toLower hexColor

        red =
            String.left 2 hexColor_
                |> Hex.fromString
                |> Result.withDefault 0
                |> toFloat

        green =
            String.dropLeft 2 hexColor_
                |> String.left 2
                |> Hex.fromString
                |> Result.withDefault 0
                |> toFloat

        blue =
            String.dropLeft 4 hexColor_
                |> String.left 2
                |> Hex.fromString
                |> Result.withDefault 0
                |> toFloat
    in
    DocColor (red / 255) (green / 255) (blue / 255)


chunks n xs =
    let
        helper acc ys =
            case ys of
                [] ->
                    List.reverse acc

                _ ->
                    helper (List.take n ys :: acc) (List.drop n ys)
    in
    helper [] xs


updateAttrs p c val attrs =
    let
        helper acc xs =
            case xs of
                [] ->
                    List.reverse (c val :: acc)

                x :: xs_ ->
                    if c val == x then
                        List.reverse acc ++ xs_
                    else if p x then
                        List.reverse (c val :: acc) ++ xs_
                    else
                        helper (x :: acc) xs_
    in
    helper [] attrs


isFontAttr a =
    case a of
        Font _ ->
            True

        _ ->
            False


isFontColorAttr a =
    case a of
        FontColor _ ->
            True

        _ ->
            False


isBackgroundColorAttr a =
    case a of
        BackgroundColor _ ->
            True

        _ ->
            False


isFontSizeAttr a =
    case a of
        FontSize _ ->
            True

        _ ->
            False


fonts =
    [ "Arial"
    , "Helvetica"
    , "Times New Roman"
    , "Times"
    , "Courier New"
    , "Courier"
    , "Verdana"
    , "Georgia"
    , "Palatino"
    , "Garamond"
    , "Bookman"
    , "Comic Sans MS"
    , "Trebuchet MS"
    , "Arial Black"
    , "Impact"
    ]


fontSizes =
    [ "6"
    , "7"
    , "8"
    , "9"
    , "10"
    , "11"
    , "12"
    , "13"
    , "14"
    , "15"
    , "16"
    , "18"
    , "20"
    , "22"
    , "24"
    , "26"
    , "28"
    , "32"
    , "36"
    , "40"
    , "44"
    , "48"
    , "54"
    , "60"
    , "66"
    , "72"
    , "80"
    , "88"
    , "96"
    ]


dummyInternalPageList =
    [ "Agriculture"
    , "AnimationEstivale"
    , "Animation"
    , "Animaux"
    , "Annee2016"
    , "Annee2017"
    , "Annee2018"
    , "Artistes"
    , "Associations"
    , "AutomneHiver"
    , "LaCommune"
    , "LesSeniors"
    , "Patrimoine"
    , "PériEtExtra-scolaire"
    , "PatrimoinePhoto"
    , "Photothèque"
    , "Restaurants"
    , "Sortir"
    , "Transports"
    , "VieScolaire"
    , "VillageFleuri"
    ]


dummyFileList =
    Dict.fromList
        [ ( "ados"
          , [ "Document d'information argent de poche.pdf"
            , "Dossier d'inscription argent de poche 2018.pdf"
            , "Dossier d'inscription argent de poche.pdf"
            , "plaquette été 2018 argent de poche.pdf"
            , "plaquette printemps 2017 argent de poche.pdf"
            ]
          )
        , ( "animation"
          , [ "affiche14juillet2016.pdf"
            , "affiche14juillet2017.pdf"
            , "affiche14juillet2018.pdf"
            , "afficheFestivalArt2018.pdf"
            , "animations SIVOM 2017.pdf"
            , "concert église 19-8-18.pdf"
            , "expo 2018 amis du vieux murol.pdf"
            , "expos estivales 2017.pdf"
            , "programme1 2016.pdf"
            , "programme 1 juillet 2017.pdf"
            , "programme2 2016.pdf"
            , "programme 2 juillet 2017.pdf"
            , "programme3 2016.pdf"
            , "programme3 aout 2017.pdf"
            , "programme4 2016.pdf"
            , "programme 4 aout 2017.pdf"
            , "programme des animations de la vallée verte juillet 2018.pdf"
            , "programme Médiévales 2018.pdf"
            , "www.villes-et-villages-fleuris.com_presse_presentationFR.pdf"
            ]
          )
        , ( "bulletin"
          , []
          )
        , ( "commerces"
          , []
          )
        , ( "conseilMunicipal"
          , []
          )
        , ( "decouvrirMurol"
          , []
          )
        , ( "DeliberationsConseil"
          , []
          )
        , ( "environnement"
          , []
          )
        , ( "murolInfo"
          , []
          )
        , ( "offresEmploi"
          , []
          )
        , ( "periscolaire"
          , []
          )
        , ( "villageFleuri"
          , []
          )
        ]


sample =
    """
Murol

Le bourg de Murol est implanté dans un écrin de verdure à 850 mètres d'altitude, dans la vallée de la Couze Chambon, sur le versant Est du massif du Sancy.

Le bourg de Murol est implanté dans un écrin de verdure à 850 mètres d'altitude, dans la vallée de la Couze Chambon, sur le versant Est du massif du Sancy.

Enchâssé entre le volcan boisé du
Tartaret le promontoire du
château de Murol et le puy de Bessolles, le village vous ravira par ses sites remarquables et pittoresques.

Le chateau

Au pied du château, découvrez le parc arboré du Prélong où se trouvent le
musée des Peintres de l’Ecole de Murols et le musée archéologique.
    """



--<titre-2 9> un joli titre </>
--<titre-2 0> un joli titre </><titre-2 0> un joli titre </><titre-2 0> un joli titre </><titre-2 0> un joli titre </>
--Le bourg de Murol est implanté dans un écrin de verdure à 850 mètres d'altitude, dans la vallée de la Couze Chambon, sur le versant Est du massif du Sancy.
--Le bourg de Murol est implanté dans un écrin de verdure à 850 mètres d'altitude, dans la vallée de la Couze Chambon, sur le versant Est du massif du Sancy.
--Enchâssé entre le volcan boisé du
--Tartaret le promontoire du
--château de Murol et le puy de  <lien-externe 0> Bessolles</> , le village vous ravira par ses sites remarquables et pittoresques.
--Au pied du  <lien-interne 0> château</>,  découvrez le parc arboré du Prélong où se trouvent le
--musée des Peintres de l’Ecole de Murols et le musée archéologique.


webColors =
    [ ( "maroon", "800000" )
    , ( "dark red", "8B0000" )
    , ( "brown", "A52A2A" )
    , ( "firebrick", "B22222" )
    , ( "crimson", "DC143C" )
    , ( "red", "FF0000" )
    , ( "tomato", "FF6347" )
    , ( "coral", "FF7F50" )
    , ( "indian red", "CD5C5C" )
    , ( "light coral", "F08080" )
    , ( "dark salmon", "E9967A" )
    , ( "salmon", "FA8072" )
    , ( "light salmon", "FFA07A" )
    , ( "orange red", "FF4500" )
    , ( "dark orange", "FF8C00" )
    , ( "orange", "FFA500" )
    , ( "gold", "FFD700" )
    , ( "dark golden rod", "B8860B" )
    , ( "golden rod", "DAA520" )
    , ( "pale golden rod", "EEE8AA" )
    , ( "dark khaki", "BDB76B" )
    , ( "khaki", "F0E68C" )
    , ( "olive", "808000" )
    , ( "yellow", "FFFF00" )
    , ( "yellow green", "9ACD32" )
    , ( "dark olive green", "556B2F" )
    , ( "olive drab", "6B8E23" )
    , ( "lawn green", "7CFC00" )
    , ( "chart reuse", "7FFF00" )
    , ( "green yellow", "ADFF2F" )
    , ( "dark green", "006400" )
    , ( "green", "008000" )
    , ( "forest green", "228B22" )
    , ( "lime", "00FF00" )
    , ( "lime green", "32CD32" )
    , ( "light green", "90EE90" )
    , ( "pale green", "98FB98" )
    , ( "dark sea green", "8FBC8F" )
    , ( "medium spring green", "00FA9A" )
    , ( "spring green", "0F0FF7F" )
    , ( "sea green", "2E8B57" )
    , ( "medium aqua marine", "66CDAA" )
    , ( "medium sea green", "3CB371" )
    , ( "light sea green", "20B2AA" )
    , ( "dark slate gray", "2F4F4F" )
    , ( "teal", "008080" )
    , ( "dark cyan", "008B8B" )
    , ( "aqua", "00FFFF" )
    , ( "cyan", "00FFFF" )
    , ( "light cyan", "E0FFFF" )
    , ( "dark turquoise", "00CED1" )
    , ( "turquoise", "40E0D0" )
    , ( "medium turquoise", "48D1CC" )
    , ( "pale turquoise", "AFEEEE" )
    , ( "aqua marine", "7FFFD4" )
    , ( "powder blue", "B0E0E6" )
    , ( "cadet blue", "5F9EA0" )
    , ( "steel blue", "4682B4" )
    , ( "corn flower blue", "6495ED" )
    , ( "deep sky blue", "00BFFF" )
    , ( "dodger blue", "1E90FF" )
    , ( "light blue", "ADD8E6" )
    , ( "sky blue", "87CEEB" )
    , ( "light sky blue", "87CEFA" )
    , ( "midnight blue", "191970" )
    , ( "navy", "000080" )
    , ( "dark blue", "00008B" )
    , ( "medium blue", "0000CD" )
    , ( "blue", "0000FF" )
    , ( "royal blue", "4169E1" )
    , ( "blue violet", "8A2BE2" )
    , ( "indigo", "4B0082" )
    , ( "dark slate blue", "483D8B" )
    , ( "slate blue", "6A5ACD" )
    , ( "medium slate blue", "7B68EE" )
    , ( "medium purple", "9370DB" )
    , ( "dark magenta", "8B008B" )
    , ( "dark violet", "9400D3" )
    , ( "dark orchid", "9932CC" )
    , ( "medium orchid", "BA55D3" )
    , ( "purple", "800080" )
    , ( "thistle", "D8BFD8" )
    , ( "plum", "DDA0DD" )
    , ( "violet", "EE82EE" )
    , ( "magenta / fuchsia", "FF00FF" )
    , ( "orchid", "DA70D6" )
    , ( "medium violet red", "C71585" )
    , ( "pale violet red", "DB7093" )
    , ( "deep pink", "FF1493" )
    , ( "hot pink", "FF69B4" )
    , ( "light pink", "FFB6C1" )
    , ( "pink", "FFC0CB" )
    , ( "antique white", "FAEBD7" )
    , ( "beige", "F5F5DC" )
    , ( "bisque", "FFE4C4" )
    , ( "blanched almond", "FFEBCD" )
    , ( "wheat", "F5DEB3" )
    , ( "corn silk", "FFF8DC" )
    , ( "lemon chiffon", "FFFACD" )
    , ( "light golden rod yellow", "FAFAD2" )
    , ( "light yellow", "FFFFE0" )
    , ( "saddle brown", "8B4513" )
    , ( "sienna", "A0522D" )
    , ( "chocolate", "D2691E" )
    , ( "peru", "CD853F" )
    , ( "sandy brown", "F4A460" )
    , ( "burly wood", "DEB887" )
    , ( "tan", "D2B48C" )
    , ( "rosy brown", "BC8F8F" )
    , ( "moccasin", "FFE4B5" )
    , ( "navajo white", "FFDEAD" )
    , ( "peach puff", "FFDAB9" )
    , ( "misty rose", "FFE4E1" )
    , ( "lavender blush", "FFF0F5" )
    , ( "linen", "FAF0E6" )
    , ( "old lace", "FDF5E6" )
    , ( "papaya whip", "FFEFD5" )
    , ( "sea shell", "FFF5EE" )
    , ( "mint cream", "F5FFFA" )
    , ( "slate gray", "708090" )
    , ( "light slate gray", "778899" )
    , ( "light steel blue", "B0C4DE" )
    , ( "lavender", "E6E6FA" )
    , ( "floral white", "FFFAF0" )
    , ( "alice blue", "F0F8FF" )
    , ( "ghost white", "F8F8FF" )
    , ( "honeydew", "F0FFF0" )
    , ( "ivory", "FFFFF0" )
    , ( "azure", "F0FFFF" )
    , ( "snow", "FFFAFA" )
    , ( "black", "000000" )
    , ( "dim gray / dim grey", "696969" )
    , ( "gray / grey", "808080" )
    , ( "dark gray / dark grey", "A9A9A9" )
    , ( "silver", "C0C0C0" )
    , ( "light gray / light grey", "D3D3D3" )
    , ( "gainsboro", "DCDCDC" )
    , ( "white smoke", "F5F5F5" )
    , ( "white", "FFFFFF" )
    ]
