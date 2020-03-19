module MurolAdmin exposing (Flags, LoadingStatus(..), Model, Msg(..), Tool(..), init, main, notificationsPanelView, subscriptions, tabView, update, view)

import Auth.AuthPlugin as Auth
import Browser exposing (document)
import Browser.Dom as Dom
import Browser.Events exposing (onKeyDown, onKeyUp, onResize)
import Dict exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Lazy exposing (lazy)
import FileExplorer.FileExplorer as FileExplorer
import GeneralDirectoryEditor.GeneralDirectoryEditor as GeneralDirectoryEditor exposing (..)
import Help.Help as Help exposing (..)
import Html exposing (Html)
import Html.Attributes as HtmlAttr
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.Icons exposing (chevronsDown, chevronsUp, messageSquare, save, wifi, wifiOff)
import Internals.ToolHelpers exposing (..)
import Json.Decode as D
import Json.Encode as E
import NewsEditor.NewsEditor as NewsEditor exposing (..)
import PageEditor.PageEditor as PageEditor
import PageTreeEditor.PageTreeEditor as PageTreeEditor exposing (..)
import Publications.Publications as Publications
import Random exposing (Seed, initialSeed)
import Task exposing (perform)
import Time exposing (Posix, Zone, here, millisToPosix, posixToMillis, utc)


main : Program Flags Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Flags =
    { currentTime : Int
    }


type alias Model =
    { pageEditor : PageEditor.Model Msg
    , pageTreeEditor : PageTreeEditor.Model Msg
    , fileExplorer : FileExplorer.Model Msg
    , generalDirectory : GeneralDirectoryEditor.Model Msg
    , newsEditor : NewsEditor.Model Msg
    , publications : Publications.Model Msg
    , authTool : Auth.Model Msg
    , help : Help.Model Msg
    , loadingStatus : LoadingStatus
    , currentTool : Tool
    , winWidth : Int
    , winHeight : Int
    , zone : Time.Zone
    , logs : Dict.Dict Int ( Log, Bool )
    , logsOpen : Bool
    , seed : Random.Seed
    , trixStates : Dict String String
    }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ FileExplorer.subscriptions model.fileExplorer
        , if model.currentTool == PageEditorTool then
            PageEditor.subscriptions model.pageEditor

          else
            Sub.none
        , Publications.subscriptions model.publications
        , if model.currentTool == NewsEditorTool then
            NewsEditor.subscriptions model.newsEditor

          else
            Sub.none
        , Auth.subscriptions model.authTool
        , Help.subscriptions model.help
        , onResize WinResize
        ]


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        newFileExplorer =
            FileExplorer.init
                FileExplorer.ImagesRoot
                FileExplorerMsg

        newPageTreeEditor =
            PageTreeEditor.init
                PageTreeEditorMsg

        ( newPageEditor, pageEditorCmds ) =
            PageEditor.init Nothing PageEditorMsg

        ( newGeneralDirectory, generalDirectoryCmds ) =
            GeneralDirectoryEditor.init GeneralDirectoryMsg

        ( newNewsEditor, newEditorCmds ) =
            NewsEditor.init NewsEditorMsg

        publications =
            Publications.init PublicationsMsg

        ( newAuthTool, authToolCmds ) =
            Auth.init AuthMsg

        ( help, helpCmd ) =
            Help.init HelpMsg
    in
    ( { pageEditor = newPageEditor
      , pageTreeEditor = newPageTreeEditor
      , fileExplorer = newFileExplorer
      , generalDirectory = newGeneralDirectory
      , newsEditor = newNewsEditor
      , publications = publications
      , authTool = newAuthTool
      , help = help
      , loadingStatus = WaitingForLogin
      , currentTool = AuthTool
      , winWidth = 1920
      , winHeight = 1080
      , zone = Time.utc
      , logs = Dict.empty
      , logsOpen = False
      , seed = initialSeed flags.currentTime
      , trixStates = Dict.empty
      }
    , Cmd.batch
        [ pageEditorCmds
        , generalDirectoryCmds
        , authToolCmds
        , helpCmd
        , Task.perform CurrentViewport Dom.getViewport
        , Task.perform SetZone Time.here
        ]
    )


type LoadingStatus
    = WaitingForLogin
    | Loading
    | Ready


type Msg
    = AuthMsg Auth.Msg
    | Launch
    | FileExplorerMsg FileExplorer.Msg
    | ReloadFiles
    | PageEditorMsg PageEditor.Msg
    | PageTreeEditorMsg PageTreeEditor.Msg
    | GeneralDirectoryMsg GeneralDirectoryEditor.Msg
    | NewsEditorMsg NewsEditor.Msg
    | PublicationsMsg Publications.Msg
    | HelpMsg Help.Msg
    | GoToHelp ( Int, String )
    | GotTrixState D.Value
    | SetCurrentTool Tool
    | CurrentViewport Dom.Viewport
    | WinResize Int Int
    | SetZone Time.Zone
    | AddLog Log
    | ToogleLogs
    | ToogleLog Int
    | NoOp


type Tool
    = PageEditorTool
    | FileExplorerTool
    | AuthTool
    | PageTreeTool
    | GeneralDirectoryTool
    | NewsEditorTool
    | PublicationsTool
    | HelpTool


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Launch ->
            ( { model
                | loadingStatus = Ready
                , currentTool = PageEditorTool
              }
            , Cmd.none
            )

        ReloadFiles ->
            ( model
            , FileExplorer.load model.fileExplorer (Auth.getLogInfo model.authTool)
            )

        FileExplorerMsg fileExplorerMsg ->
            let
                ( newFileExplorer, fileExplorerCmds, mbEditorPluginResult ) =
                    FileExplorer.update
                        { logInfo = Auth.getLogInfo model.authTool
                        , addLog = AddLog
                        }
                        fileExplorerMsg
                        model.fileExplorer
            in
            ( { model | fileExplorer = newFileExplorer }
            , Cmd.batch [ fileExplorerCmds ]
            )

        AuthMsg authToolMsg ->
            let
                logInfo =
                    Auth.getLogInfo newAuthTool

                ( newAuthTool, authToolCmds, mbToolResult ) =
                    Auth.update { addLog = AddLog } authToolMsg model.authTool

                ( newLoadingStatus, loadingCmds ) =
                    if
                        model.loadingStatus
                            == WaitingForLogin
                            && logInfo
                            /= Auth.LoggedOut
                    then
                        ( Loading
                        , [ GeneralDirectoryEditor.load model.generalDirectory logInfo
                          , PageTreeEditor.load model.pageTreeEditor logInfo
                          , FileExplorer.load model.fileExplorer logInfo
                          , NewsEditor.load model.newsEditor logInfo
                          , Publications.load model.publications logInfo
                          ]
                        )

                    else
                        ( model.loadingStatus, [] )
            in
            ( { model
                | authTool = newAuthTool
                , loadingStatus = newLoadingStatus
                , currentTool =
                    if mbToolResult == Just ToolQuit then
                        PageEditorTool

                    else
                        model.currentTool
              }
            , Cmd.batch <|
                [ authToolCmds ]
                    ++ loadingCmds
            )

        PageEditorMsg pageEditorMsg ->
            let
                ( newPageEditor, pageEditorCmds, mbToolResult ) =
                    PageEditor.update
                        { fileExplorer = model.fileExplorer
                        , pageTreeEditor = model.pageTreeEditor
                        , loadedContent =
                            PageTreeEditor.loadedContent model.pageTreeEditor
                        , genDirEditor = model.generalDirectory
                        , logInfo = Auth.getLogInfo model.authTool
                        , reloadFilesMsg = ReloadFiles
                        , zone = model.zone
                        , addLog = AddLog
                        }
                        pageEditorMsg
                        model.pageEditor
            in
            ( { model | pageEditor = newPageEditor }
            , pageEditorCmds
            )

        PageTreeEditorMsg pageTreeEditorMsg ->
            let
                ( newPageTreeEditor, pageTreeEditorCmds ) =
                    PageTreeEditor.update
                        { logInfo = Auth.getLogInfo model.authTool
                        , currentDocument =
                            PageEditor.currentDocument model.pageEditor
                        , addLog = AddLog
                        }
                        pageTreeEditorMsg
                        model.pageTreeEditor
            in
            ( { model | pageTreeEditor = newPageTreeEditor }
            , pageTreeEditorCmds
            )

        GeneralDirectoryMsg generalDirectoryMsg ->
            let
                ( newGeneralDirectory, generalDirectoryCmds ) =
                    GeneralDirectoryEditor.update
                        { logInfo = Auth.getLogInfo model.authTool
                        , zone = model.zone
                        , addLog = AddLog
                        }
                        generalDirectoryMsg
                        model.generalDirectory
            in
            ( { model
                | generalDirectory = newGeneralDirectory
              }
            , generalDirectoryCmds
            )

        NewsEditorMsg newsEditorMsg ->
            let
                ( newNewsEditor, newsEditorCmds ) =
                    NewsEditor.update
                        { logInfo = Auth.getLogInfo model.authTool
                        , zone = model.zone
                        , pageTreeEditor = model.pageTreeEditor
                        , addLog = AddLog
                        }
                        newsEditorMsg
                        model.newsEditor
            in
            ( { model
                | newsEditor = newNewsEditor
              }
            , newsEditorCmds
            )

        PublicationsMsg publicationsMsg ->
            let
                ( newPublications, newPubCmds ) =
                    Publications.update
                        { logInfo = Auth.getLogInfo model.authTool
                        , zone = model.zone
                        , reloadFilesMsg = ReloadFiles
                        , addLog = AddLog
                        }
                        publicationsMsg
                        model.publications
            in
            ( { model
                | publications = newPublications
              }
            , newPubCmds
            )

        HelpMsg helpMsg ->
            let
                ( newHelp, helpCmd ) =
                    Help.update () helpMsg model.help
            in
            ( { model
                | help = newHelp
                , currentTool = HelpTool
              }
            , helpCmd
            )

        GoToHelp id ->
            let
                ( newHelp, helpCmd ) =
                    Help.externalUpdate id model.help
            in
            ( { model | help = newHelp }
            , helpCmd
            )

        GotTrixState value ->
            let
                decodeTrixState =
                    D.map2 Tuple.pair
                        (D.field "tool" D.string)
                        (D.field "state" D.string)
            in
            case D.decodeValue decodeTrixState value of
                Ok ( tool, state ) ->
                    ( { model | trixStates = Dict.insert tool state model.trixStates }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        SetCurrentTool t ->
            ( { model | currentTool = t }
            , Cmd.batch
                []
            )

        CurrentViewport vp ->
            ( { model
                | winWidth = round vp.viewport.width
                , winHeight = round vp.viewport.height
              }
            , Cmd.none
            )

        WinResize width height ->
            ( { model
                | winHeight = height
                , winWidth = width
              }
            , Cmd.none
            )

        SetZone zone ->
            ( { model | zone = zone }
            , Cmd.none
            )

        AddLog log ->
            let
                ( logHash, newSeed ) =
                    hashLog model.seed log

                newLogs =
                    safeInsert (\k -> k + 1) logHash ( log, False ) model.logs
            in
            ( { model
                | logs = newLogs
                , seed = newSeed
              }
            , Cmd.none
            )

        ToogleLogs ->
            ( { model | logsOpen = not model.logsOpen }
            , Cmd.none
            )

        --CloseLogs ->
        --    ( { model | logsOpen = False }
        --    , Cmd.none
        --    )
        ToogleLog h ->
            ( { model
                | logs =
                    Dict.update
                        h
                        (Maybe.andThen
                            (\( l, isOpen ) ->
                                Just ( l, not isOpen )
                            )
                        )
                        model.logs
              }
            , Cmd.none
            )

        NoOp ->
            ( model, Cmd.none )


view : Model -> Browser.Document Msg
view model =
    { title = "MurolAdmin"
    , body =
        [ Element.layoutWith
            { options =
                [ focusStyle
                    { borderColor = Nothing
                    , backgroundColor = Nothing
                    , shadow = Nothing
                    }
                ]
            }
            [ width fill
            , height (maximum model.winHeight fill)
            , Font.size 16

            --, Font.family
            --      [ Font.typeface "Lora" ]
            ]
            (case model.loadingStatus of
                WaitingForLogin ->
                    column
                        [ centerX
                        , centerY
                        , Background.color grey6
                        , Border.rounded 5
                        , padding 15
                        , spacing 15
                        ]
                        [ el
                            [ Font.center
                            , Background.color (rgb 1 1 1)
                            , width fill
                            , padding 15
                            ]
                            (text "MurolAdmin")
                        , column
                            [ spacing 15
                            , padding 15
                            , centerX
                            , centerY
                            , Background.color (rgb 1 1 1)
                            ]
                            [ Auth.view { zone = model.zone } model.authTool ]
                        ]

                Loading ->
                    let
                        loadingComplete =
                            List.all (\ls -> ls == ToolLoadingSuccess)
                                [ FileExplorer.loadingStatus model.fileExplorer
                                , PageTreeEditor.loadingStatus model.pageTreeEditor
                                , GeneralDirectoryEditor.loadingStatus model.generalDirectory
                                , NewsEditor.loadingStatus model.newsEditor
                                ]
                    in
                    column
                        [ centerX
                        , centerY
                        , Background.color grey6
                        , Border.rounded 5
                        , padding 15
                        , spacing 15
                        ]
                        [ el
                            [ Font.center
                            , Background.color (rgb 1 1 1)
                            , width fill
                            , padding 15
                            ]
                            (text "MurolAdmin")
                        , column
                            [ spacing 15
                            , padding 15
                            , centerX
                            , centerY
                            , Background.color (rgb 1 1 1)
                            ]
                            [ FileExplorer.loadingView model.fileExplorer
                            , PageTreeEditor.loadingView model.pageTreeEditor
                            , GeneralDirectoryEditor.loadingView model.generalDirectory
                            , NewsEditor.loadingView model.newsEditor
                            , Publications.loadingView model.publications
                            , Input.button (buttonStyle loadingComplete)
                                { onPress = Just Launch
                                , label =
                                    text "Commencer"
                                }
                            ]
                        ]

                Ready ->
                    column
                        [ paddingEach
                            { top = 5
                            , left = 0
                            , right = 0
                            , bottom = 0
                            }
                        , width fill
                        , height (maximum model.winHeight fill)
                        , htmlAttribute (HtmlAttr.style "flex-shrink" "1")

                        --, clip
                        ]
                        [ row
                            [ Border.widthEach
                                { top = 0
                                , bottom = 2
                                , left = 0
                                , right = 0
                                }
                            , spacing 5
                            , paddingEach
                                { top = 0
                                , bottom = 0
                                , left = 5
                                , right = 0
                                }
                            , width fill
                            , Border.color
                                (rgb 0.8 0.8 0.8)
                            ]
                            [ tabView model.currentTool
                                PageEditorTool
                                "Editeur de page"
                            , tabView model.currentTool
                                NewsEditorTool
                                "Editeur actualités"
                            , tabView model.currentTool
                                GeneralDirectoryTool
                                "Répertoire général"
                            , tabView model.currentTool
                                PageTreeTool
                                "Structure du site"
                            , tabView model.currentTool
                                FileExplorerTool
                                "Explorateur de fichiers"
                            , tabView model.currentTool
                                PublicationsTool
                                "Publications"
                            , tabView model.currentTool
                                AuthTool
                                "Authentification"
                            , tabView model.currentTool
                                HelpTool
                                "Aide"
                            ]
                        , case model.currentTool of
                            PageEditorTool ->
                                PageEditor.view
                                    { logInfo = Auth.getLogInfo model.authTool
                                    , fileExplorer = model.fileExplorer
                                    , pageTreeEditor = model.pageTreeEditor
                                    , genDirEditor = model.generalDirectory
                                    , newsEditor = model.newsEditor
                                    , zone = model.zone
                                    }
                                    model.pageEditor

                            FileExplorerTool ->
                                FileExplorer.view
                                    { maxHeight =
                                        model.winHeight - 70
                                    , zone = model.zone
                                    , logInfo = Auth.getLogInfo model.authTool
                                    , mode = FileExplorer.Full
                                    }
                                    model.fileExplorer

                            AuthTool ->
                                Auth.view { zone = model.zone } model.authTool

                            PageTreeTool ->
                                PageTreeEditor.view
                                    { maxHeight =
                                        model.winHeight - 70
                                    , zone = model.zone
                                    , logInfo = Auth.getLogInfo model.authTool
                                    , mode = PageTreeEditor.Full
                                    }
                                    model.pageTreeEditor

                            GeneralDirectoryTool ->
                                GeneralDirectoryEditor.view
                                    { maxHeight =
                                        model.winHeight - 70
                                    , zone = model.zone
                                    , fileExplorer = model.fileExplorer
                                    , logInfo = Auth.getLogInfo model.authTool
                                    }
                                    model.generalDirectory

                            NewsEditorTool ->
                                NewsEditor.view
                                    { maxHeight =
                                        model.winHeight - 70
                                    , zone = model.zone
                                    , fileExplorer = model.fileExplorer
                                    , pageTreeEditor = model.pageTreeEditor
                                    , logInfo = Auth.getLogInfo model.authTool
                                    }
                                    model.newsEditor

                            PublicationsTool ->
                                Publications.view
                                    { maxHeight =
                                        model.winHeight - 70
                                    , zone = model.zone
                                    , logInfo = Auth.getLogInfo model.authTool
                                    }
                                    model.publications

                            HelpTool ->
                                Help.view
                                    { maxHeight =
                                        model.winHeight - 70
                                    , maxWidth =
                                        model.winWidth
                                    }
                                    model.help
                        , notificationsPanelView model
                        ]
            )
        ]
    }


tabView : Tool -> Tool -> String -> Element Msg
tabView currentTool tool s =
    el
        ([ Events.onClick (SetCurrentTool tool)
         , Border.widthEach
            { top = 2
            , bottom = 0
            , left = 2
            , right = 2
            }
         , Border.roundEach
            { topLeft = 8
            , topRight = 8
            , bottomLeft = 0
            , bottomRight = 0
            }
         , if currentTool == tool then
            Background.color (rgb 1 1 1)

           else
            Background.color (rgb 0.9 0.9 0.9)
         ]
            ++ (if currentTool == tool then
                    [ Border.color (rgb 0.8 0.8 0.8)
                    ]

                else
                    [ Border.color (rgb 0.9 0.9 0.9)
                    , pointer
                    , mouseOver
                        [ Background.color (rgb 0.95 0.95 0.95)
                        ]
                    ]
               )
        )
        (el
            ([]
                ++ (if currentTool == tool then
                        [ Border.roundEach
                            { topLeft = 8
                            , topRight = 8
                            , bottomLeft = 0
                            , bottomRight = 0
                            }
                        , paddingEach
                            { top = 3
                            , bottom = 7
                            , left = 12
                            , right = 12
                            }
                        , Border.color (rgb 1 1 1)
                        , moveDown 2
                        , Background.color (rgb 1 1 1)
                        ]

                    else
                        [ paddingEach
                            { top = 5
                            , bottom = 5
                            , left = 12
                            , right = 12
                            }
                        ]
                   )
            )
            (text s)
        )


comsMonitorView : Model -> Element Msg
comsMonitorView model =
    row
        [ alignRight
        , spacing 15
        , paddingEach { sides | right = 15 }
        , Border.color (rgb 0.8 0.8 0.8)
        , Border.widthEach { sides | left = 2 }
        , paddingXY 15 0
        ]
        [ el
            [ Font.color
                (case savingStatus model of
                    Waiting ->
                        yellow4

                    Failure ->
                        red6

                    _ ->
                        grey6
                )
            , width (px 20)
            ]
            (html <| save 18)
        , el
            [ Font.color
                (if Auth.isLogged model.authTool.logInfo then
                    green4

                 else
                    red6
                )
            , width (px 20)
            ]
            (html <|
                if Auth.isLogged model.authTool.logInfo then
                    wifi 18

                else
                    wifiOff 18
            )
        ]


savingStatus : Model -> Status
savingStatus model =
    combineStatus
        [ Auth.status model.authTool
        , PageTreeEditor.status model.pageTreeEditor
        , FileExplorer.status model.fileExplorer
        , NewsEditor.status model.newsEditor
        ]


notificationsPanelView : Model -> Element Msg
notificationsPanelView model =
    let
        logs =
            Dict.toList model.logs
                |> List.sortBy (posixToMillis << .timeStamp << Tuple.first << Tuple.second)
                |> List.reverse

        newest =
            List.filter (\( _, ( l, _ ) ) -> .isImportant l) logs
                |> List.head
    in
    row
        [ width fill
        , height (px 35)
        , Border.color (rgb 0.8 0.8 0.8)
        , Border.widthEach { sides | top = 2 }
        , above
            (logsViewPanel model.logsOpen logs model.zone ToogleLog)
        , spacing 15
        , alignBottom
        ]
        [ el
            [ Border.color (rgb 0.8 0.8 0.8)
            , Border.widthEach { sides | right = 2 }
            , paddingXY 10 0
            ]
            (html <| messageSquare 22)
        , case newest of
            Just ( _, ( l, _ ) ) ->
                logTitleView l model.zone

            _ ->
                Element.none
        , el
            [ alignRight
            , Events.onClick ToogleLogs
            ]
            (if model.logsOpen then
                html <| chevronsDown 22

             else
                html <| chevronsUp 22
            )
        , comsMonitorView model
        ]


logsViewPanel : Bool -> List ( Int, ( Log, Bool ) ) -> Time.Zone -> (Int -> Msg) -> Element Msg
logsViewPanel logsOpen logs zone toogleLog =
    if logsOpen then
        column
            [ width fill
            , Border.color (rgb 0.8 0.8 0.8)
            , Border.widthEach { sides | top = 2 }
            , Background.color (rgb 1 1 1)
            , moveUp 2
            ]
            [ el
                [ Font.bold
                , Border.color (rgb 0.8 0.8 0.8)
                , Border.widthEach { sides | bottom = 2 }
                , width fill
                , paddingXY 10 5
                ]
                (text "Historique des notifications")
            , column
                [ height (px 200)
                , scrollbarY
                , width fill
                ]
                (logsDictView logs zone toogleLog)
            ]

    else
        Element.none
