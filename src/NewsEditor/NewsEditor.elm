module NewsEditor.NewsEditor exposing (..)

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
import FileExplorer.FileExplorer as FileExplorer
import Html exposing (map)
import Html.Attributes as HtmlAttr
import Http exposing (..)
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.Icons as Icons exposing (checkSquare, square)
import Internals.ToolHelpers exposing (..)
import Json.Decode as D
import Json.Encode as E
import PageEditor.EditorPlugins.TextBlockPlugin as TextBlockPlugin
import PageEditor.Internals.DocumentEditorHelpers exposing (..)
import PageTreeEditor.PageTreeEditor as PageTreeEditor exposing (Model)
import Random exposing (..)
import Set exposing (..)
import String.Extra exposing (pluralize)
import Task exposing (..)
import Time exposing (..)
import UUID exposing (..)


type alias Model msg =
    { news : Dict String News
    , buffer : Maybe News
    , expiryBuffer : String
    , contentPreview : Bool
    , checkedNews : Set String
    , textBlockPlugin : TextBlockPlugin.Model msg
    , picPickerOpen : Bool
    , seed : Maybe Random.Seed
    , currentTime : Posix
    , newsEditorMode : NewsEditorMode
    , loadingStatus : ToolLoadingStatus
    , externalMsg : Msg -> msg
    }


type NewsEditorMode
    = NewsSelector
    | NewsEditor


init : (Msg -> msg) -> ( Model msg, Cmd msg )
init externalMsg =
    let
        ( newTextBlockPlugin, textBlockPluginCmds ) =
            TextBlockPlugin.init [] Nothing (externalMsg << TextBlockPluginMsg)
    in
    ( { news = Dict.empty
      , buffer = Nothing
      , expiryBuffer = ""
      , contentPreview = False
      , checkedNews = Set.empty
      , textBlockPlugin = newTextBlockPlugin
      , picPickerOpen = False
      , seed = Nothing
      , currentTime = millisToPosix 0
      , newsEditorMode = NewsSelector
      , loadingStatus = ToolLoadingWaiting
      , externalMsg = externalMsg
      }
    , textBlockPluginCmds
    )


load : Model msg -> LogInfo -> Cmd msg
load model logInfo =
    case logInfo of
        LoggedIn { sessionId } ->
            Cmd.map model.externalMsg <|
                Cmd.batch
                    [ Task.perform SetTimeAndInitSeed Time.now
                    , getAllTheNews sessionId
                    ]

        LoggedOut ->
            Cmd.none


loadingStatus model =
    model.loadingStatus


loadingView model =
    toolLoadingView "Chargement des actualités: "
        { loadingStatus = loadingStatus model }


type Msg
    = LoadNews (Result Http.Error (Dict String News))
    | ToogleNews String
    | SetTitle String
    | SetExpiry String
    | EditContent
    | ToNewsSelector
    | ToogleContentPreview
    | RemoveNews
    | NewsRemoved (List String) (Result Http.Error Bool)
    | OpenPicPicker
    | ClosePicPicker
    | ConfirmPic PickerResult
    | SaveNews
    | NewsSaved (Result Http.Error Bool)
    | TextBlockPluginMsg TextBlockPlugin.Msg
    | SetTimeAndInitSeed Time.Posix
    | NoOp


getNewsDict model =
    model.news



-------------------------------------------------------------------------------
------------
-- Update --
------------


update :
    { a
        | logInfo : LogInfo
        , zone : Zone
        , pageTreeEditor : PageTreeEditor.Model msg
    }
    -> Msg
    -> Model msg
    -> ( Model msg, Cmd msg )
update config msg model =
    let
        ( newModel, cmds ) =
            internalUpdate config msg model
    in
    ( newModel, cmds )


internalUpdate :
    { a
        | logInfo : LogInfo
        , zone : Zone
        , pageTreeEditor : PageTreeEditor.Model msg
    }
    -> Msg
    -> Model msg
    -> ( Model msg, Cmd msg )
internalUpdate config msg model =
    case msg of
        LoadNews res ->
            case res of
                Ok newsDict ->
                    ( { model
                        | news = newsDict
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

        ToogleNews id ->
            ( { model
                | buffer =
                    if Set.member id model.checkedNews then
                        Nothing
                    else
                        Dict.get id model.news
                , checkedNews =
                    if Set.member id model.checkedNews then
                        Set.remove id model.checkedNews
                    else
                        Set.insert id model.checkedNews
              }
            , Cmd.none
            )

        SetTitle title ->
            let
                baseNews =
                    model.buffer
                        |> Maybe.withDefault emptyNews

                newBuffer =
                    { baseNews | title = title }
            in
            ( { model | buffer = Just newBuffer }, Cmd.none )

        SetExpiry s ->
            case parseDate model.currentTime config.zone s of
                Nothing ->
                    let
                        baseNews =
                            model.buffer
                                |> Maybe.withDefault emptyNews

                        newBuffer =
                            { baseNews | expiry = millisToPosix 0 }
                    in
                    ( { model
                        | expiryBuffer = s
                        , buffer = Just newBuffer
                      }
                    , Cmd.none
                    )

                Just ( day, month, year ) ->
                    let
                        newTime =
                            newDateRecord year month day 0 0 0 0 config.zone
                                |> civilToPosix

                        baseNews =
                            model.buffer
                                |> Maybe.withDefault emptyNews

                        newBuffer =
                            { baseNews | expiry = newTime }
                    in
                    ( { model
                        | expiryBuffer = s
                        , buffer = Just newBuffer
                      }
                    , Cmd.none
                    )

        EditContent ->
            let
                baseContent =
                    Maybe.andThen .content model.buffer
                        |> Maybe.withDefault
                            { tbElems = []
                            , attrs = []
                            }

                ( newTextBlockPlugin, textBlockPluginCmds ) =
                    TextBlockPlugin.init baseContent.attrs
                        (Just baseContent.tbElems)
                        (model.externalMsg << TextBlockPluginMsg)
            in
            ( { model
                | newsEditorMode = NewsEditor
                , textBlockPlugin = newTextBlockPlugin
              }
            , textBlockPluginCmds
            )

        ToNewsSelector ->
            ( { model
                | newsEditorMode = NewsSelector
                , buffer = Nothing
                , expiryBuffer = ""
                , contentPreview = False
                , checkedNews = Set.empty
                , picPickerOpen = False
              }
            , Cmd.none
            )

        ToogleContentPreview ->
            ( { model | contentPreview = not model.contentPreview }
            , Cmd.none
            )

        RemoveNews ->
            ( model
            , cmdIfLogged
                config.logInfo
                (removeNews
                    (Set.toList model.checkedNews)
                )
                |> Cmd.map model.externalMsg
            )

        NewsRemoved ids res ->
            case res of
                Ok True ->
                    ( { model
                        | news =
                            List.foldr
                                (\id acc -> Dict.remove id acc)
                                model.news
                                ids
                        , checkedNews = Set.empty
                        , buffer = Nothing
                        , newsEditorMode = NewsSelector
                        , expiryBuffer = ""
                        , contentPreview = False
                        , picPickerOpen = False
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        OpenPicPicker ->
            ( { model | picPickerOpen = True }
            , Cmd.none
            )

        ClosePicPicker ->
            ( { model | picPickerOpen = False }
            , Cmd.none
            )

        ConfirmPic pr ->
            case pr of
                PickedImage { url, width, height } ->
                    let
                        baseNews =
                            model.buffer
                                |> Maybe.withDefault emptyNews

                        newPic =
                            Pic url width height

                        newBuffer =
                            { baseNews | pic = Just newPic }
                    in
                    ( { model
                        | picPickerOpen = False
                        , buffer = Just newBuffer
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        SaveNews ->
            case ( model.buffer, config.logInfo, model.seed ) of
                ( Just news, LoggedIn { sessionId }, Just seed ) ->
                    let
                        ( uuid, newSeed ) =
                            if news.uuid == UUID.nil then
                                Random.step UUID.generator seed
                            else
                                ( news.uuid, seed )

                        newBuffer =
                            { news | uuid = uuid }
                    in
                    ( { model
                        | newsEditorMode = NewsSelector
                        , buffer = Just newBuffer
                        , seed = Just newSeed
                      }
                    , (Time.now
                        |> Task.andThen
                            (\t ->
                                setNews
                                    t
                                    newBuffer
                                    sessionId
                            )
                      )
                        |> Task.attempt NewsSaved
                        |> Cmd.map model.externalMsg
                    )

                _ ->
                    ( model, Cmd.none )

        NewsSaved res ->
            case ( res, model.buffer ) of
                ( Ok True, Just n ) ->
                    ( { model
                        | news =
                            Dict.insert (canonical n.uuid) { n | date = model.currentTime } model.news
                        , buffer = Nothing
                        , expiryBuffer = ""
                        , contentPreview = False
                        , picPickerOpen = False
                        , checkedNews = Set.empty
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        TextBlockPluginMsg textBlockMsg ->
            let
                ( newTextBlockPlugin, textBlockPluginCmds, mbEditorPluginResult ) =
                    TextBlockPlugin.update
                        { pageTreeEditor = config.pageTreeEditor }
                        textBlockMsg
                        model.textBlockPlugin

                baseNews =
                    model.buffer
                        |> Maybe.withDefault emptyNews

                newBuffer =
                    { baseNews
                        | content =
                            Just <| TextBlockPlugin.parserOutput newTextBlockPlugin
                    }
            in
            ( { model
                | buffer = Just newBuffer
                , textBlockPlugin = newTextBlockPlugin
              }
            , Cmd.batch
                [ textBlockPluginCmds
                ]
            )

        SetTimeAndInitSeed t ->
            ( { model
                | currentTime = t
                , seed = Just <| initialSeed (posixToMillis t)
              }
            , Cmd.none
            )

        NoOp ->
            ( model, Cmd.none )



-------------------------------------------------------------------------------
----------
-- View --
----------


type alias ViewConfig config msg =
    { config
        | maxHeight : Int
        , zone : Time.Zone
        , fileExplorer : FileExplorer.Model msg
        , pageTreeEditor : PageTreeEditor.Model msg
        , logInfo : LogInfo
    }


view : ViewConfig config msg -> Model msg -> Element msg
view config model =
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
        [ case model.newsEditorMode of
            NewsSelector ->
                Element.map model.externalMsg <|
                    newsSelectorView config model

            NewsEditor ->
                newsEditorView config model
        ]


newsSelectorView : ViewConfig config msg -> Model msg -> Element Msg
newsSelectorView config model =
    column
        (containerStyle ++ [ spacing 15 ])
        [ row
            (itemStyle
                ++ [ spacing 15
                   , width (px 940)
                   ]
            )
            [ Input.button
                (buttonStyle (model.buffer == Nothing))
                { onPress =
                    case model.buffer of
                        Nothing ->
                            Just EditContent

                        _ ->
                            Nothing
                , label = text "Créer actualité"
                }
            , Input.button
                (buttonStyle (model.buffer /= Nothing))
                { onPress =
                    Maybe.map (always EditContent) model.buffer
                , label = text "Modifier actualité"
                }
            , Input.button
                (buttonStyle (not <| Set.isEmpty model.checkedNews))
                { onPress =
                    if not <| Set.isEmpty model.checkedNews then
                        Just RemoveNews
                    else
                        Nothing
                , label =
                    Set.size model.checkedNews
                        |> (\n ->
                                if n > 1 then
                                    "Supprimer actualités"
                                else
                                    "Supprimer actualité"
                           )
                        |> text
                }
            ]
        , column
            (itemStyle
                ++ [ spacing 10
                   , width fill
                   ]
            )
            [ row
                [ width fill
                , spacing 15
                , paddingXY 10 0
                ]
                [ el
                    [ Font.bold ]
                    (text "Titre actualité")
                , el
                    [ Font.bold
                    , alignRight
                    , width (px 150)
                    ]
                    (text "Date de création")
                , el
                    [ Font.bold
                    , alignRight
                    , width (px 163)
                    ]
                    (text "Limite de validité")
                ]
            , column
                [ Border.width 2
                , Border.color grey3
                , width (minimum 800 fill)
                , height (px 435)
                , scrollbars
                ]
                (Dict.toList model.news
                    |> List.map
                        (\( id, n ) ->
                            checkView
                                (Set.member id model.checkedNews)
                                (Maybe.map (\b -> canonical b.uuid == id) model.buffer
                                    == Just True
                                )
                                id
                                n.title
                                config.zone
                                n.date
                                n.expiry
                        )
                )
            ]
        ]


checkView : Bool -> Bool -> String -> String -> Zone -> Posix -> Posix -> Element Msg
checkView isChecked isBuffer newsId title zone date expiry =
    Keyed.row
        [ width fill
        , paddingXY 5 5
        , pointer
        , Events.onClick (ToogleNews newsId)
        , mouseOver
            [ if isBuffer then
                Background.color grey4
              else
                Background.color grey5
            ]
        , if isBuffer then
            Background.color grey4
          else
            noAttr
        , spacing 10
        ]
        [ ( title
          , row [ spacing 10 ]
                [ if isChecked then
                    el [ Font.color grey1 ]
                        (html <| checkSquare 18)
                  else
                    el [ Font.color grey1 ]
                        (html <| square 18)
                , el [ Font.color grey2 ]
                    (text title)
                ]
          )
        , ( title
          , el
                [ alignRight
                , width (px 150)
                ]
                (text <| dateToStr zone date)
          )
        , ( title
          , el
                [ alignRight
                , width (px 150)
                ]
                (text <| dateToStr zone expiry)
          )
        ]


newsEditorView : ViewConfig config msg -> Model msg -> Element msg
newsEditorView config model =
    let
        textBlockConfig =
            { fileExplorer = config.fileExplorer
            , logInfo = config.logInfo
            , maxHeight = 400
            , pageTreeEditor = config.pageTreeEditor
            , zone = config.zone
            }
    in
    row
        (containerStyle
            ++ [ spacing 15
               ]
        )
        [ column [ spacing 15 ]
            [ row
                (itemStyle
                    ++ [ width (px 705)
                       ]
                )
                [ el
                    [ below <|
                        if not model.picPickerOpen then
                            Element.none
                        else
                            el
                                [ Background.color (rgb 1 1 1)
                                , width (minimum 850 (maximum 920 shrink))
                                , Border.shadow
                                    { offset = ( 4, 4 )
                                    , size = 5
                                    , blur = 10
                                    , color = rgba 0 0 0 0.45
                                    }
                                ]
                                (visualPickerView config model)
                    ]
                    Element.none
                , column
                    [ spacing 10 ]
                    [ el [ Font.bold ] (text "Titre actualité")
                    , Input.text
                        (textInputStyle ++ [ width (px 500), spacing 0 ])
                        { onChange = model.externalMsg << SetTitle
                        , label = Input.labelHidden ""
                        , placeholder = Nothing
                        , text =
                            Maybe.map .title model.buffer
                                |> Maybe.withDefault ""
                        }
                    ]
                , column
                    [ alignRight
                    , spacing 10
                    ]
                    [ el [ Font.bold ] (text "Limite validité")
                    , Input.text
                        (textInputStyle
                            ++ [ width (px 150)
                               , if Maybe.map .expiry model.buffer /= (Just <| millisToPosix 0) then
                                    Font.color green4
                                 else
                                    Font.color red4
                               ]
                        )
                        { onChange = model.externalMsg << SetExpiry
                        , label = Input.labelHidden ""
                        , placeholder =
                            Just <| Input.placeholder [ clip ] (text "jj/mm/aaaa")
                        , text =
                            case Maybe.map .expiry model.buffer of
                                Nothing ->
                                    model.expiryBuffer

                                Just t ->
                                    if t == millisToPosix 0 then
                                        model.expiryBuffer
                                    else
                                        dateToStr config.zone t
                        }
                    ]
                ]
            , column
                (itemStyle ++ [ spacing 10 ])
                [ row
                    [ width fill ]
                    [ el [ Font.bold ] (text "Contenu actualité")
                    , Input.button
                        (buttonStyle True ++ [ alignRight ])
                        { onPress =
                            Just <|
                                model.externalMsg ToogleContentPreview
                        , label =
                            if model.contentPreview then
                                text "Edition"
                            else
                                text "Aperçu"
                        }
                    ]
                , if model.contentPreview then
                    el
                        [ width (px 675)
                        , height (px 396)
                        ]
                        (TextBlockPlugin.textBlockPreview
                            model.textBlockPlugin
                            (renderConfig model.externalMsg)
                        )
                  else
                    TextBlockPlugin.newsEditorView textBlockConfig model.textBlockPlugin
                ]
            ]
        , column
            [ spacing 15
            , alignTop
            , height fill
            ]
            [ setVisual config model
            , row
                (itemStyle
                    ++ [ spaceEvenly
                       , alignBottom
                       , width fill
                       ]
                )
                [ Input.button
                    (buttonStyle
                        (Maybe.map validNews model.buffer
                            |> Maybe.withDefault False
                        )
                    )
                    { onPress =
                        case Maybe.map validNews model.buffer of
                            Just True ->
                                Just (model.externalMsg SaveNews)

                            _ ->
                                Nothing
                    , label = text "Sauvegarder"
                    }
                , Input.button
                    (buttonStyle True)
                    { onPress = Just (model.externalMsg ToNewsSelector)
                    , label = text "Retour"
                    }
                ]
            ]
        ]


setVisual : ViewConfig config msg -> Model msg -> Element msg
setVisual config model =
    column
        (itemStyle
            ++ [ spacing 15
               , alignTop
               ]
        )
        [ row
            []
            [ el
                [ Font.bold ]
                (text "Image ")
            , el
                []
                (text "(optionnel)")
            ]
        , el
            [ width (px 190)
            , height (px 190)
            , Background.color grey5
            ]
            (el
                [ width (px 178)
                , height (px 178)
                , Background.uncropped
                    (model.buffer
                        |> Maybe.andThen .pic
                        |> Maybe.map .url
                        |> Maybe.withDefault ""
                    )
                , centerX
                , centerY
                ]
                Element.none
            )
        , Input.button
            (buttonStyle True)
            { onPress =
                Just <| model.externalMsg OpenPicPicker
            , label =
                row
                    []
                    [ el [] (text "Choisir")
                    ]
            }
        ]


visualPickerView : ViewConfig config msg -> Model msg -> Element msg
visualPickerView config model =
    FileExplorer.pickerView
        ClosePicPicker
        ConfirmPic
        FileExplorer.ImagesRoot
        config
        model.externalMsg


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



-------------------------------------------------------------------------------
-----------------
-- Json / Http --
-----------------


getNews : Int -> Cmd Msg
getNews currentTime =
    let
        body =
            E.object
                [ ( "currentTime"
                  , E.int currentTime
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "getNews.php"
        , body = body
        , expect = Http.expectJson LoadNews decodeNewsDict
        }


getAllTheNews : String -> Cmd Msg
getAllTheNews sessionId =
    let
        body =
            E.object
                [ ( "sessionId"
                  , E.string sessionId
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "getAllTheNews.php"
        , body = body
        , expect = Http.expectJson LoadNews decodeNewsDict
        }


setNews : Posix -> News -> String -> Task Http.Error Bool
setNews currentTime news sessionId =
    let
        datedNews =
            { news | date = currentTime }

        body =
            E.object
                [ ( "news"
                  , encodeNews datedNews
                  )
                , ( "sessionId"
                  , E.string sessionId
                  )
                ]
                |> Http.jsonBody
    in
    Http.task
        { method = "Post"
        , headers = []
        , url = "setNews.php"
        , body = body
        , resolver = jsonResolver decodeSuccess
        , timeout = Nothing
        }


removeNews : List String -> String -> Cmd Msg
removeNews idsToRemove sessionId =
    let
        body =
            E.object
                [ ( "idsToRemove"
                  , E.list E.string idsToRemove
                  )
                , ( "sessionId"
                  , E.string sessionId
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "removeNews.php"
        , body = body
        , expect = Http.expectJson (NewsRemoved idsToRemove) decodeSuccess
        }


decodeNewsDict : D.Decoder (Dict String News)
decodeNewsDict =
    D.list decodeNews
        |> D.map
            (\newsList ->
                List.map (\news -> ( canonical news.uuid, news ))
                    newsList
            )
        |> D.map Dict.fromList


decodeSuccess : D.Decoder Bool
decodeSuccess =
    D.at [ "message" ] (D.succeed True)



-------------------------------------------------------------------------------
------------------
-- Misc helpers --
------------------


renderConfig : (Msg -> msg) -> Config msg
renderConfig externalMsg =
    { width = 1920
    , height = 1080
    , mainInterfaceHeight = 75
    , customElems = Dict.empty
    , zipperHandlers = Nothing
    , editMode = True
    , previewMode = PreviewScreen
    , containersBkgColors = False
    , season = Spring
    , currentTime = Time.millisToPosix 0
    , zone = Time.utc
    , pageIndex = Dict.empty
    , fiches = Dict.empty
    , openedFiches = Set.empty
    , openFicheMsg = always (externalMsg NoOp)
    , news = Dict.empty
    , openedNews = Set.empty
    , openNewsMsg = always (externalMsg NoOp)
    , galleries = Dict.empty
    }


validNews { title, content, expiry } =
    title
        /= ""
        && (content /= Nothing)
        && (Maybe.map .tbElems content /= Nothing)
        && (Maybe.map .tbElems content /= Just [])
        && (expiry /= millisToPosix 0)
