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
import Html.Attributes as HtmlAttr
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.ToolHelpers exposing (..)
import PageEditor.PageEditor as PageEditor
import Task exposing (perform)


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
    , pageTreeEditor : ()
    , fileExplorer : FileExplorer.Model Msg
    , generalDirectory : ()
    , newsEditor : ()
    , authTool : Auth.Model Msg
    , loadingStatus : LoadingStatus
    , currentTool : Tool
    , winWidth : Int
    , winHeight : Int
    }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ FileExplorer.subscriptions model.fileExplorer
        , PageEditor.subscriptions model.pageEditor
        , onResize WinResize
        ]


init : flags -> ( Model, Cmd Msg )
init flags =
    let
        newFileExplorer =
            FileExplorer.init
                FileExplorer.ImagesRoot
                FileExplorer.ReadOnly
                FileExplorerMsg

        ( newPageEditor, pageEditorCmds ) =
            PageEditor.init Nothing PageEditorMsg
    in
    ( { pageEditor = newPageEditor
      , pageTreeEditor = ()
      , fileExplorer = newFileExplorer
      , generalDirectory = ()
      , newsEditor = ()
      , authTool = Auth.init AuthMsg
      , loadingStatus = WaitingForLogin
      , currentTool = AuthTool
      , winWidth = 1920
      , winHeight = 1080
      }
    , Cmd.batch
        [ pageEditorCmds
        , Task.perform CurrentViewport Dom.getViewport
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
    | PageEditorMsg PageEditor.Msg
    | SetCurrentTool Tool
    | CurrentViewport Dom.Viewport
    | WinResize Int Int
    | NoOp


type Tool
    = PageEditorTool
    | FileExplorerTool
    | AuthTool
    | SiteTreeTool
    | GeneralDirectoryTool
    | NewsEditorTool


update msg model =
    case msg of
        Launch ->
            ( { model
                | loadingStatus = Ready
                , currentTool = PageEditorTool
              }
            , Cmd.none
            )

        FileExplorerMsg fileExplorerMsg ->
            let
                ( newFileExplorer, fileExplorerCmds, mbEditorPluginResult ) =
                    FileExplorer.update
                        { logInfo = Auth.getLogInfo model.authTool }
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
                        , [ FileExplorer.load model.fileExplorer logInfo ]
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
                    PageEditor.update pageEditorMsg model.pageEditor
            in
            ( { model | pageEditor = newPageEditor }
            , pageEditorCmds
            )

        SetCurrentTool t ->
            ( { model | currentTool = t }, Cmd.none )

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

        NoOp ->
            ( model, Cmd.none )


view model =
    { title = "MurolAdmin"
    , body =
        [ Element.layout
            [ width fill
            , height (maximum model.winHeight fill)
            , Font.size 16
            ]
            (case model.loadingStatus of
                WaitingForLogin ->
                    Auth.view () model.authTool

                Loading ->
                    let
                        loadingComplete =
                            List.all (\ls -> ls == ToolLoadingSuccess)
                                [ FileExplorer.loadingStatus model.fileExplorer ]
                    in
                    column
                        [ spacing 15
                        , width fill
                        , padding 15
                        ]
                        [ FileExplorer.loadingView model.fileExplorer
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
                                SiteTreeTool
                                "Structure du site"
                            , tabView model.currentTool
                                NewsEditorTool
                                "Editeur actualités"
                            , tabView model.currentTool
                                FileExplorerTool
                                "Explorateur de fichiers"
                            , tabView model.currentTool
                                GeneralDirectoryTool
                                "Répertoire général"
                            , tabView model.currentTool
                                AuthTool
                                "Authentification"
                            ]
                        , case model.currentTool of
                            PageEditorTool ->
                                PageEditor.view
                                    { logInfo = Auth.getLogInfo model.authTool
                                    }
                                    model.pageEditor

                            FileExplorerTool ->
                                FileExplorer.view
                                    { maxHeight =
                                        --model.config.height - model.config.mainInterfaceHeight
                                        model.winHeight - 35
                                    }
                                    model.fileExplorer

                            AuthTool ->
                                Auth.view () model.authTool

                            SiteTreeTool ->
                                Element.none

                            GeneralDirectoryTool ->
                                Element.none

                            NewsEditorTool ->
                                Element.none
                        ]
            )
        ]
    }


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

                    --, moveDown 3
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
