port module MurolAdmin exposing (..)

import Auth.AuthPlugin as Auth
import Browser exposing (document)
import Browser.Dom as Dom
import Browser.Events exposing (onKeyDown, onKeyUp, onResize)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events exposing (..)
import Element.Font as Font
import Element.Input as Input
import Element.Lazy exposing (lazy)
import FileExplorer.FileExplorer as FileExplorer
import Internals.CommonHelpers exposing (..)
import Internals.ToolHelpers exposing (..)
import PageEditor.PageEditor as PageEditor


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
    , authPlugin : Auth.Model Msg
    , loadingStatus : LoadingStatus
    }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ FileExplorer.subscriptions model.fileExplorer
        , PageEditor.subscriptions model.pageEditor
        ]


init : flags -> ( Model, Cmd Msg )
init flags =
    let
        ( newFileExplorer, filesysPluginCmds ) =
            FileExplorer.init
                FileExplorer.ImagesRoot
                FileExplorer.ReadOnly
                Auth.LoggedOut
                FileExplorerMsg

        ( newPageEditor, pageEditorCmds ) =
            PageEditor.init Nothing PageEditorMsg
    in
    ( { pageEditor = newPageEditor
      , pageTreeEditor = ()
      , fileExplorer = newFileExplorer
      , generalDirectory = ()
      , newsEditor = ()
      , authPlugin = Auth.init AuthMsg
      , loadingStatus = WaitingForLogin
      }
    , Cmd.batch
        [ pageEditorCmds ]
    )


type LoadingStatus
    = WaitingForLogin
    | Loading
    | Error
    | Ready


type Msg
    = NoOp
    | AuthMsg Auth.Msg
    | FileExplorerMsg FileExplorer.Msg
    | PageEditorMsg PageEditor.Msg


view model =
    { title = "MurolAdmin"
    , body =
        [ Element.layout
            []
            Element.none
        ]
    }


update msg model =
    case msg of
        FileExplorerMsg fileExplorerMsg ->
            let
                ( newFileExplorer, fileExplorerCmds, mbEditorPluginResult ) =
                    FileExplorer.update
                        { logInfo = Auth.getLogInfo model.authPlugin }
                        fileExplorerMsg
                        model.fileExplorer
            in
            ( { model | fileExplorer = newFileExplorer }
            , Cmd.batch [ fileExplorerCmds ]
            )

        AuthMsg authPluginMsg ->
            let
                ( newAuthPlugin, authPluginCmds, mbPluginAction ) =
                    Auth.update authPluginMsg model.authPlugin
            in
            ( { model
                | authPlugin = newAuthPlugin

                --, currentTool =
                --    if mbToolResult == Just ToolQuit then
                --        Nothing
                --    else
                --        model.currentTool
              }
            , authPluginCmds
            )

        PageEditorMsg pageEditorMsg ->
            let
                ( newPageEditor, pageEditorCmds, mbToolResult ) =
                    PageEditor.update pageEditorMsg model.pageEditor
            in
            ( { model | pageEditor = newPageEditor }
            , pageEditorCmds
            )

        NoOp ->
            ( model, Cmd.none )
