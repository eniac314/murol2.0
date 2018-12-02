port module MurolAdmin exposing (..)

import Auth.AuthPlugin as Auth
import Browser exposing (document)
import Browser.Dom as Dom
import Browser.Events exposing (onKeyDown, onKeyUp, onResize)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Lazy exposing (lazy)
import FileExplorer.FileExplorer as FileExplorer
import GeneralDirectoryEditor.GeneralDirectoryEditor as GeneralDirectoryEditor exposing (..)
import Html exposing (Html)
import Html.Attributes as HtmlAttr
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.ToolHelpers exposing (..)
import NewsEditor.NewsEditor as NewsEditor exposing (..)
import PageEditor.PageEditor as PageEditor
import PageTreeEditor.PageTreeEditor as PageTreeEditor exposing (..)
import Task exposing (perform)
import Time exposing (Posix, Zone, here, millisToPosix, utc)


main : Program () Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Model =
    { pageEditor : PageEditor.Model Msg
    , pageTreeEditor : PageTreeEditor.Model Msg
    , fileExplorer : FileExplorer.Model Msg
    , generalDirectory : GeneralDirectoryEditor.Model Msg
    , newsEditor : NewsEditor.Model Msg
    , authTool : Auth.Model Msg
    , loadingStatus : LoadingStatus
    , currentTool : Tool
    , winWidth : Int
    , winHeight : Int
    , zone : Time.Zone
    }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ FileExplorer.subscriptions model.fileExplorer
        , PageEditor.subscriptions model.pageEditor
        , onResize WinResize

        --, Time.every 120000 (always CheckSessionStatus)
        ]


init : flags -> ( Model, Cmd Msg )
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
    in
    ( { pageEditor = newPageEditor
      , pageTreeEditor = newPageTreeEditor
      , fileExplorer = newFileExplorer
      , generalDirectory = newGeneralDirectory
      , newsEditor = newNewsEditor
      , authTool = Auth.init AuthMsg
      , loadingStatus = WaitingForLogin
      , currentTool = AuthTool
      , winWidth = 1920
      , winHeight = 1080
      , zone = Time.utc
      }
    , Cmd.batch
        [ pageEditorCmds
        , generalDirectoryCmds
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
      --| CheckSessionStatus
    | FileExplorerMsg FileExplorer.Msg
    | PageEditorMsg PageEditor.Msg
    | PageTreeEditorMsg PageTreeEditor.Msg
    | GeneralDirectoryMsg GeneralDirectoryEditor.Msg
    | NewsEditorMsg NewsEditor.Msg
    | SetCurrentTool Tool
    | CurrentViewport Dom.Viewport
    | WinResize Int Int
    | SetZone Time.Zone
    | NoOp


type Tool
    = PageEditorTool
    | FileExplorerTool
    | AuthTool
    | PageTreeTool
    | GeneralDirectoryTool
    | NewsEditorTool


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

        --CheckSessionStatus ->
        --    case Auth.getLogInfo model.authTool of
        --        LoggedIn sessionId ->
        --            ( model
        --            , checkSessionStatus sessionId
        --            )
        --        _ ->
        --            ( model, Cmd.none )
        FileExplorerMsg fileExplorerMsg ->
            let
                ( newFileExplorer, fileExplorerCmds, mbEditorPluginResult ) =
                    FileExplorer.update
                        { logInfo = Auth.getLogInfo model.authTool
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
                    Auth.update authToolMsg model.authTool

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
                        }
                        newsEditorMsg
                        model.newsEditor
            in
            ( { model
                | newsEditor = newNewsEditor
              }
            , newsEditorCmds
            )

        SetCurrentTool t ->
            ( { model | currentTool = t }
            , Cmd.none
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

        NoOp ->
            ( model, Cmd.none )


view : Model -> Browser.Document Msg
view model =
    { title = "MurolAdmin"
    , body =
        [ Element.layout
            [ width fill
            , height (maximum model.winHeight fill)
            , Font.size 16

            --, Font.family
            --      [ Font.typeface "Lora" ]
            ]
            (case model.loadingStatus of
                WaitingForLogin ->
                    Auth.view { zone = model.zone } model.authTool

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
                        [ spacing 15
                        , width fill
                        , padding 15
                        ]
                        [ FileExplorer.loadingView model.fileExplorer
                        , PageTreeEditor.loadingView model.pageTreeEditor
                        , GeneralDirectoryEditor.loadingView model.generalDirectory
                        , NewsEditor.loadingView model.newsEditor
                        , Input.button (buttonStyle loadingComplete)
                            { onPress = Just Launch
                            , label =
                                text "Commencer"
                            }
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
                                AuthTool
                                "Authentification"
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
                                        model.winHeight - 35
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
                                        model.winHeight - 35
                                    , zone = model.zone
                                    , logInfo = Auth.getLogInfo model.authTool
                                    , mode = PageTreeEditor.Full
                                    }
                                    model.pageTreeEditor

                            GeneralDirectoryTool ->
                                GeneralDirectoryEditor.view
                                    { maxHeight =
                                        model.winHeight - 35
                                    , zone = model.zone
                                    , fileExplorer = model.fileExplorer
                                    , logInfo = Auth.getLogInfo model.authTool
                                    }
                                    model.generalDirectory

                            NewsEditorTool ->
                                NewsEditor.view
                                    { maxHeight =
                                        model.winHeight - 35
                                    , zone = model.zone
                                    , fileExplorer = model.fileExplorer
                                    , pageTreeEditor = model.pageTreeEditor
                                    , logInfo = Auth.getLogInfo model.authTool
                                    }
                                    model.newsEditor
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
