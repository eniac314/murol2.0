module FileExplorer.FileExplorer exposing (..)

import Auth.AuthPlugin exposing (LogInfo(..), cmdIfLogged)
import Dict exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Keyed as Keyed
import Element.Lazy as Lazy
import Filesize exposing (format)
import Html as Html
import Html.Attributes as HtmlAttr
import Html.Events as HtmlEvents exposing (preventDefaultOn)
import Http exposing (..)
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.Icons as Icons exposing (..)
import Internals.ToolHelpers exposing (..)
import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode
import List.Extra exposing (remove)
import String.Extra exposing (..)
import Task exposing (..)
import Time exposing (..)


type alias Model msg =
    { renameBuffer : String
    , newFolderNameBuffer : String
    , root : Root
    , mainPanelDisplay : MainPanelDisplay
    , externalMsg : Msg -> msg
    , mbIFilesys : Maybe Filesys
    , mbDFilesys : Maybe Filesys
    , lastLocation : Maybe FsItem
    , selectedFsItem : Maybe FsItem
    , cutBuffer : Maybe FsItem
    , logs : List Log
    , loadingStatus : ToolLoadingStatus
    , imageFiles : Maybe (List FsItem)
    , docFiles : Maybe (List FsItem)
    , lockedFsItems : List FsItem
    , canUpload : Bool
    , needToUpload : Bool
    , filesToUpload : List FileToUpload
    , imageUploadType : UploadType
    , debug : String
    , mbOriImageWidth : Maybe Int
    , mbOriImageHeight : Maybe Int
    , mbOriFileSize : Maybe Int
    , desiredWidth : Maybe Int
    , desiredHeight : Maybe Int
    , desiredFilename : Maybe String
    , desiredRotationAngle : Int
    , sliderValue : Float
    , needToResize : Bool
    , needToRotate : Bool
    , canResize : Bool
    , mbImageFromFile : Maybe ImageFromFile
    , imageControllerMode : ImageControllerMode
    }


subscriptions model =
    Sub.map model.externalMsg <|
        Sub.batch []


type Root
    = ImagesRoot
    | DocsRoot


type Mode
    = ReadOnly Root
    | ReadWrite Root
    | Full


modeRoot mode root =
    case mode of
        ReadOnly m ->
            m

        ReadWrite m ->
            m

        Full ->
            root


type MainPanelDisplay
    = FilesysDisplay
    | UploadDisplay
    | LogsDisplay


type alias ImageFromFile =
    { contents : String
    , filename : String
    , width : Int
    , height : Int
    , filesize : Int
    }


type alias FileToUpload =
    { filename : String
    , loaded : Float
    , total : Float
    , success : Bool
    }


type UploadType
    = BulkUpload
    | RegUpload


type ImageControllerMode
    = FileReader
    | Editor


init : Root -> (Msg -> msg) -> Model msg
init root externalMsg =
    { renameBuffer = ""
    , newFolderNameBuffer = ""
    , root = root
    , mainPanelDisplay = FilesysDisplay
    , externalMsg = externalMsg
    , mbIFilesys = Nothing
    , mbDFilesys = Nothing
    , lastLocation = Nothing
    , selectedFsItem = Nothing
    , cutBuffer = Nothing
    , logs = []
    , imageFiles = Nothing
    , docFiles = Nothing
    , loadingStatus = ToolLoadingWaiting
    , lockedFsItems = []
    , canUpload = False
    , needToUpload = False
    , filesToUpload = []
    , imageUploadType = RegUpload
    , debug = ""
    , mbOriImageWidth = Nothing
    , mbOriImageHeight = Nothing
    , mbOriFileSize = Nothing
    , desiredWidth = Nothing
    , desiredHeight = Nothing
    , desiredFilename = Nothing
    , desiredRotationAngle = 0
    , sliderValue = 100
    , needToResize = False
    , needToRotate = False
    , canResize = False
    , mbImageFromFile = Nothing
    , imageControllerMode = FileReader
    }


load : Model msg -> LogInfo -> Cmd msg
load model logInfo =
    --NOTE: load happens only after login
    case logInfo of
        LoggedIn { sessionId } ->
            Cmd.map model.externalMsg <|
                Cmd.batch
                    [ getFileList ImagesRoot [] sessionId
                    , getFileList DocsRoot [] sessionId
                    ]

        LoggedOut ->
            Cmd.none


loadingStatus model =
    model.loadingStatus


loadingView model =
    toolLoadingView "Chargement Explorateur de fichiers: " model


type Msg
    = ----------------
      -- Navigation --
      ----------------
      GoHome Mode
    | GoNext Mode
    | GoPrev Mode
    | GoTo Mode Path
    | SelectFsItem Mode FsItem
      ------------------------------
      -- Filesys modyfing Actions --
      ------------------------------
    | NewFolderInput String
    | NewFolder Mode FsItem
    | Delete Mode FsItem
    | Cut FsItem
    | Paste Mode FsItem
    | RenameInput String
    | Rename Mode FsItem
      ------------------
      -- Bulk Uploads --
      ------------------
    | RefreshFilesys (Maybe FsItem) String Root (Result Http.Error (List FsItem))
    | FilesToUpload Mode (List FileToUpload)
    | UploadFiles
    | ToogleUploadView
    | SetImageUploadType UploadType
    | UploadImage FsItem
      ---------------------
      -- ImageController --
      ---------------------
    | FileRead ImageFromFile
    | ImageRead ImageFromFile
    | UploadResult (Result Error ())
    | RotateRight
    | RotateLeft
    | Resize Float
    | SetResize
    | SetFilename String
    | ResetImageController
      ----------
      -- Logs --
      ----------
    | AddLog Log
    | ToogleLogsView
      ----------
      -- Misc --
      ----------
    | SetRoot Root
    | Debug String
    | NoOp



-------------------------------------------------------------------------------
------------
-- Update --
------------


getSelectedImage : Model msg -> Maybe { src : String, width : Int, height : Int }
getSelectedImage model =
    case model.selectedFsItem of
        Just (File { path, name, fileType, fileSize }) ->
            case fileType of
                ImageFile { width, height } ->
                    Just
                        { src = "/" ++ String.join "/" path
                        , width = width
                        , height = height
                        }

                _ ->
                    Nothing

        _ ->
            Nothing


getSelectedDoc : Model msg -> Maybe String
getSelectedDoc model =
    case model.selectedFsItem of
        Just (File { path, name, fileType, fileSize }) ->
            case fileType of
                RegFile ->
                    Just <|
                        "/"
                            ++ String.join
                                "/"
                                path

                _ ->
                    Nothing

        _ ->
            Nothing


update : { a | logInfo : LogInfo } -> Msg -> Model msg -> ( Model msg, Cmd msg, Maybe a )
update config msg model =
    -- NOTE : Le troisième élément du tuple est toujours égal à Nothing
    -- -> laissé au cas où.
    let
        ( newModel, cmds, mbPluginAction ) =
            internalUpdate config msg model
    in
    ( newModel, Cmd.map model.externalMsg cmds, mbPluginAction )


internalUpdate : { a | logInfo : LogInfo } -> Msg -> Model msg -> ( Model msg, Cmd Msg, Maybe a )
internalUpdate config msg model =
    case msg of
        ----------------
        -- Navigation --
        ----------------
        GoHome mode ->
            let
                f =
                    \mbFs ->
                        case Maybe.map rewindFilesys mbFs of
                            Nothing ->
                                mbFs

                            otherwise ->
                                otherwise

                newModel =
                    { model
                        | lastLocation =
                            Maybe.map extractFsItem (getCurrentFilesys mode model)
                        , selectedFsItem = Nothing
                    }
            in
            ( updateFilesys mode newModel f
            , Cmd.none
            , Nothing
            )

        GoNext mode ->
            case model.lastLocation of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just fsItem ->
                    let
                        f =
                            \mbFs ->
                                Maybe.map rewindFilesys mbFs
                                    |> Maybe.map
                                        (zipToFsItem (getPath fsItem))
                                    |> Maybe.withDefault mbFs

                        newModel =
                            { model
                                | lastLocation = Nothing
                                , selectedFsItem = Nothing
                            }
                    in
                    ( updateFilesys mode newModel f
                    , Cmd.none
                    , Nothing
                    )

        GoPrev mode ->
            let
                f =
                    \mbFs ->
                        case Maybe.andThen zipUpFilesys mbFs of
                            Nothing ->
                                mbFs

                            otherwise ->
                                otherwise

                newModel =
                    { model
                        | lastLocation =
                            getCurrentFilesys mode model
                                |> Maybe.map extractFsItem
                        , selectedFsItem = Nothing
                    }
            in
            ( updateFilesys mode newModel f
            , Cmd.none
            , Nothing
            )

        GoTo mode path ->
            let
                f =
                    \mbFs ->
                        Maybe.map rewindFilesys mbFs
                            |> Maybe.map
                                (zipToFsItem path)
                            |> Maybe.withDefault mbFs

                newModel =
                    { model
                        | lastLocation =
                            getCurrentFilesys mode model
                                |> Maybe.map extractFsItem
                        , selectedFsItem = Nothing
                    }
            in
            ( updateFilesys mode newModel f
            , Cmd.none
            , Nothing
            )

        SelectFsItem mode fsItem ->
            if model.selectedFsItem == Just fsItem then
                ( { model
                    | selectedFsItem = Nothing
                    , renameBuffer = ""
                    , newFolderNameBuffer = ""
                  }
                , Cmd.none
                , Nothing
                )
            else
                case Maybe.map extractFsItem (getCurrentFilesys mode model) of
                    Just (Folder meta children) ->
                        if List.member fsItem children then
                            ( { model
                                | selectedFsItem = Just fsItem
                                , renameBuffer = getName fsItem
                                , newFolderNameBuffer = ""
                              }
                            , Cmd.none
                            , Nothing
                            )
                        else
                            ( model, Cmd.none, Nothing )

                    _ ->
                        ( model, Cmd.none, Nothing )

        ------------------------------
        -- Filesys modyfing Actions --
        ------------------------------
        NewFolderInput s ->
            ( { model | newFolderNameBuffer = s }
            , Cmd.none
            , Nothing
            )

        NewFolder mode fsItem ->
            ( { model
                | selectedFsItem = Nothing
                , lockedFsItems =
                    fsItem :: model.lockedFsItems
              }
            , Cmd.batch
                [ cmdIfLogged
                    config.logInfo
                    (makeNewFolder fsItem
                        model.newFolderNameBuffer
                        (modeRoot mode model.root)
                    )
                , newLog
                    AddLog
                    ("Requête: Nouveau dossier "
                        ++ model.newFolderNameBuffer
                        ++ " dans "
                        ++ getName fsItem
                    )
                    Nothing
                    False
                ]
            , Nothing
            )

        Delete mode fsItem ->
            ( { model
                | selectedFsItem = Nothing
                , lockedFsItems =
                    fsItem :: model.lockedFsItems
              }
            , Cmd.batch
                [ cmdIfLogged
                    config.logInfo
                    (deleteFile fsItem (modeRoot mode model.root))
                , newLog
                    AddLog
                    ("Requête: Suppression " ++ getName fsItem)
                    Nothing
                    False
                ]
            , Nothing
            )

        Cut src ->
            ( { model
                | cutBuffer = Just src
                , lockedFsItems =
                    src :: model.lockedFsItems
              }
            , Cmd.none
            , Nothing
            )

        Paste mode dest ->
            case model.cutBuffer of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just src ->
                    ( { model | cutBuffer = Nothing }
                    , Cmd.batch
                        [ cmdIfLogged
                            config.logInfo
                            (pasteFile src dest (modeRoot mode model.root))
                        , newLog
                            AddLog
                            ("Requête: Collage de"
                                ++ getName src
                                ++ " dans "
                                ++ getName dest
                            )
                            Nothing
                            False
                        ]
                    , Nothing
                    )

        RenameInput newName ->
            ( { model | renameBuffer = newName }
            , Cmd.none
            , Nothing
            )

        Rename mode fsItem ->
            ( { model
                | selectedFsItem = Nothing
                , lockedFsItems =
                    fsItem :: model.lockedFsItems
              }
            , Cmd.batch
                [ cmdIfLogged
                    config.logInfo
                    (renameFile fsItem model.renameBuffer (modeRoot mode model.root))
                , newLog
                    AddLog
                    ("Requête: Renommage " ++ getName fsItem)
                    Nothing
                    False
                ]
            , Nothing
            )

        ------------------
        -- Bulk Uploads --
        ------------------
        RefreshFilesys mbToUnlock log root res ->
            case res of
                Ok fs ->
                    let
                        ( newDocFiles, newImageFiles ) =
                            case root of
                                ImagesRoot ->
                                    ( model.docFiles
                                    , Just fs
                                    )

                                DocsRoot ->
                                    ( Just fs
                                    , model.imageFiles
                                    )

                        ( newFilesys, currentPath ) =
                            case root of
                                ImagesRoot ->
                                    ( List.foldr (\f acc -> insert f "images" acc) Nothing fs
                                        |> Maybe.map initFileSys
                                    , Maybe.map extractFsItem model.mbIFilesys
                                        |> Maybe.map getPath
                                        |> Maybe.withDefault [ "images" ]
                                    )

                                DocsRoot ->
                                    ( List.foldr (\f acc -> insert f "baseDocumentaire" acc) Nothing fs
                                        |> Maybe.map initFileSys
                                    , Maybe.map extractFsItem model.mbDFilesys
                                        |> Maybe.map getPath
                                        |> Maybe.withDefault [ "baseDocumentaire" ]
                                    )

                        ( mbIFilesys, mbDFilesys ) =
                            --NOTE: tentative de remettre le zipper à la position occupée
                            --avant le rafraichissement
                            case root of
                                ImagesRoot ->
                                    ( case Maybe.andThen (zipToFsItem currentPath) newFilesys of
                                        Just result ->
                                            Just result

                                        Nothing ->
                                            newFilesys
                                    , model.mbDFilesys
                                    )

                                DocsRoot ->
                                    ( model.mbIFilesys
                                    , case Maybe.andThen (zipToFsItem currentPath) newFilesys of
                                        Just result ->
                                            Just result

                                        Nothing ->
                                            newFilesys
                                    )
                    in
                    ( { model
                        | mbIFilesys = mbIFilesys
                        , mbDFilesys = mbDFilesys
                        , imageFiles = newImageFiles
                        , docFiles = newDocFiles
                        , root = root
                        , loadingStatus =
                            case ( newImageFiles, newDocFiles ) of
                                ( Just _, Just _ ) ->
                                    ToolLoadingSuccess

                                _ ->
                                    model.loadingStatus
                        , lockedFsItems =
                            Maybe.map (\f -> List.Extra.remove f model.lockedFsItems) mbToUnlock
                                |> Maybe.withDefault model.lockedFsItems
                      }
                    , newLog
                        AddLog
                        log
                        Nothing
                        False
                    , Nothing
                    )

                Err e ->
                    ( { model
                        | loadingStatus =
                            if model.loadingStatus == ToolLoadingWaiting then
                                ToolLoadingFailure (httpErrorToString e)
                            else
                                model.loadingStatus
                        , lockedFsItems =
                            Maybe.map (\f -> List.Extra.remove f model.lockedFsItems) mbToUnlock
                                |> Maybe.withDefault model.lockedFsItems
                      }
                    , newLog
                        AddLog
                        "Echec requête: "
                        (Just <| httpErrorToString e)
                        True
                    , Nothing
                    )

        FilesToUpload mode files ->
            let
                uploadDone =
                    List.all identity (List.map .success files)
            in
            ( { model
                | filesToUpload = files
                , canUpload = True
                , needToUpload =
                    if uploadDone then
                        False
                    else
                        model.needToUpload
              }
            , if uploadDone then
                cmdIfLogged
                    config.logInfo
                    (getFileList
                        (modeRoot mode model.root)
                        (List.map .filename files)
                    )
              else
                Cmd.none
            , Nothing
            )

        UploadFiles ->
            ( { model | needToUpload = True }
            , Cmd.none
            , Nothing
            )

        ToogleUploadView ->
            let
                mainPanelDisplay =
                    case model.mainPanelDisplay of
                        UploadDisplay ->
                            FilesysDisplay

                        FilesysDisplay ->
                            UploadDisplay

                        LogsDisplay ->
                            FilesysDisplay
            in
            ( { model
                | mainPanelDisplay = mainPanelDisplay
                , canUpload = False
                , needToUpload = False
              }
            , Cmd.none
            , Nothing
            )

        SetImageUploadType ut ->
            ( { model
                | imageUploadType = ut
              }
            , Cmd.none
            , Nothing
            )

        UploadImage fsItem ->
            case model.mbImageFromFile of
                Nothing ->
                    ( model
                    , Cmd.none
                    , Nothing
                    )

                Just { filename, contents } ->
                    ( { model
                        | imageControllerMode = FileReader
                        , mbOriImageWidth = Nothing
                        , mbOriImageHeight = Nothing
                        , mbOriFileSize = Nothing
                        , desiredWidth = Nothing
                        , desiredHeight = Nothing
                        , desiredFilename = Nothing
                        , desiredRotationAngle = 0
                        , sliderValue = 100
                        , needToResize = False
                        , needToRotate = False
                        , canResize = False
                        , mbImageFromFile = Nothing
                        , mainPanelDisplay = FilesysDisplay
                      }
                    , cmdIfLogged
                        config.logInfo
                        (uploadImage
                            fsItem
                            (Maybe.withDefault filename model.desiredFilename)
                            contents
                        )
                    , Nothing
                    )

        ---------------------
        -- ImageController --
        ---------------------
        FileRead data ->
            let
                newImage =
                    { contents = data.contents
                    , filename = data.filename
                    , width = data.width
                    , height = data.height
                    , filesize = data.filesize
                    }
            in
            ( { model
                | mbImageFromFile = Just newImage
                , imageControllerMode = Editor
                , mbOriImageWidth = Just data.width
                , mbOriImageHeight = Just data.height
                , mbOriFileSize = Just data.filesize
                , needToResize = False
              }
            , Cmd.none
            , Nothing
            )

        ImageRead data ->
            let
                newImage =
                    { contents = data.contents
                    , filename = data.filename
                    , width = data.width
                    , height = data.height
                    , filesize = data.filesize
                    }
            in
            ( { model
                | mbImageFromFile = Just newImage
                , imageControllerMode = Editor
                , needToResize = False
                , needToRotate = False
                , canResize = False
              }
            , Cmd.none
            , Nothing
            )

        UploadResult (Ok ()) ->
            ( model
            , Cmd.none
            , Nothing
            )

        UploadResult (Err e) ->
            ( model
            , Cmd.none
            , Nothing
            )

        RotateRight ->
            ( { model
                | desiredRotationAngle =
                    modBy 360 (90 + model.desiredRotationAngle)
                , needToRotate = True
                , mbOriImageWidth = model.mbOriImageHeight
                , mbOriImageHeight = model.mbOriImageWidth
                , desiredWidth = model.desiredHeight
                , desiredHeight = model.desiredWidth
              }
            , Cmd.none
            , Nothing
            )

        RotateLeft ->
            ( { model
                | desiredRotationAngle =
                    modBy 360 (model.desiredRotationAngle - 90)
                , needToRotate = True
                , mbOriImageWidth = model.mbOriImageHeight
                , mbOriImageHeight = model.mbOriImageWidth
                , desiredWidth = model.desiredHeight
                , desiredHeight = model.desiredWidth
              }
            , Cmd.none
            , Nothing
            )

        Resize n ->
            case ( model.mbOriImageWidth, model.mbOriImageHeight ) of
                ( Just oriW, Just oriH ) ->
                    let
                        ratio =
                            toFloat oriW / toFloat oriH

                        desiredWidth =
                            toFloat oriW * n / 100

                        desiredHeight =
                            desiredWidth / ratio
                    in
                    ( { model
                        | sliderValue = n
                        , desiredWidth =
                            Just <| round desiredWidth
                        , desiredHeight =
                            Just <| round desiredHeight
                        , canResize = True
                      }
                    , Cmd.none
                    , Nothing
                    )

                _ ->
                    ( model, Cmd.none, Nothing )

        SetResize ->
            ( { model | needToResize = True }, Cmd.none, Nothing )

        SetFilename filename ->
            ( { model | desiredFilename = Just filename }
            , Cmd.none
            , Nothing
            )

        ResetImageController ->
            ( { model
                | imageControllerMode = FileReader
                , mbOriImageWidth = Nothing
                , mbOriImageHeight = Nothing
                , mbOriFileSize = Nothing
                , desiredWidth = Nothing
                , desiredHeight = Nothing
                , desiredRotationAngle = 0
                , sliderValue = 100
                , needToResize = False
                , needToRotate = False
                , canResize = False
                , mbImageFromFile = Nothing
              }
            , Cmd.none
            , Nothing
            )

        ----------
        -- Logs --
        ----------
        AddLog log ->
            ( { model | logs = log :: model.logs }
            , Cmd.none
            , Nothing
            )

        ToogleLogsView ->
            let
                mainPanelDisplay =
                    case model.mainPanelDisplay of
                        UploadDisplay ->
                            UploadDisplay

                        FilesysDisplay ->
                            LogsDisplay

                        LogsDisplay ->
                            FilesysDisplay
            in
            ( { model
                | mainPanelDisplay = mainPanelDisplay
              }
            , Cmd.none
            , Nothing
            )

        ----------
        -- Misc --
        ----------
        SetRoot root ->
            ( { model
                | root = root
              }
            , Cmd.none
            , Nothing
            )

        Debug s ->
            ( { model | debug = s }
            , Cmd.none
            , Nothing
            )

        NoOp ->
            ( model, Cmd.none, Nothing )



-------------------------------------------------------------------------------
--------------------
-- View functions --
--------------------


view : { maxHeight : Int, zone : Time.Zone, logInfo : LogInfo, mode : Mode } -> Model msg -> Element msg
view config model =
    Element.map model.externalMsg <|
        column
            [ spacing 15
            , Font.size 16
            , Font.family
                []
            , alignTop
            , padding 15
            , width fill
            , height (maximum config.maxHeight fill)
            ]
            [ mainInterface config model
            , row
                [ width fill
                , clip
                , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
                , height fill
                ]
                [ sidePanelView config model
                , case model.mainPanelDisplay of
                    FilesysDisplay ->
                        filesysView config model

                    LogsDisplay ->
                        logsView config model

                    UploadDisplay ->
                        uploadView config model
                ]
            ]


mainInterface : { b | mode : Mode } -> Model msg -> Element Msg
mainInterface config model =
    let
        iconSize =
            22
    in
    row
        [ spacing 15
        , width fill
        , Background.color (rgb 0.95 0.95 0.95)
        , paddingXY 15 10
        ]
        [ if config.mode == Full then
            Input.button
                (toogleButtonStyle (model.root == DocsRoot) True)
                { onPress =
                    Just <| SetRoot DocsRoot
                , label =
                    row [ spacing 10 ]
                        [ html <| Icons.fileText iconSize
                        ]
                }
          else
            Element.none
        , if config.mode == Full then
            Input.button
                (toogleButtonStyle (model.root == ImagesRoot) True)
                { onPress =
                    Just <| SetRoot ImagesRoot
                , label =
                    row [ spacing 10 ]
                        [ html <| Icons.imageIcon iconSize
                        ]
                }
          else
            Element.none
        , Input.button (buttonStyle True)
            { onPress =
                Just <| GoPrev config.mode
            , label =
                row [ spacing 10 ]
                    [ html <| Icons.chevronLeft iconSize
                    ]
            }
        , Input.button (buttonStyle (model.lastLocation /= Nothing))
            { onPress =
                if model.lastLocation /= Nothing then
                    Just <| GoNext config.mode
                else
                    Nothing
            , label =
                row [ spacing 10 ]
                    [ html <| Icons.chevronRight iconSize
                    ]
            }
        , Input.button (buttonStyle True)
            { onPress =
                Just <| GoHome config.mode
            , label =
                row [ spacing 10 ]
                    [ html <| Icons.home iconSize
                    ]
            }
        , clickablePath config model
        , case config.mode of
            ReadOnly _ ->
                Element.none

            _ ->
                Input.button
                    (toogleButtonStyle
                        (model.mainPanelDisplay == LogsDisplay)
                        (model.mainPanelDisplay /= UploadDisplay)
                    )
                    { onPress =
                        Just <| ToogleLogsView
                    , label =
                        row [ spacing 10 ]
                            [ html <| Icons.list iconSize
                            ]
                    }
        ]


clickablePath : { a | mode : Mode } -> Model msg -> Element Msg
clickablePath config model =
    let
        getEveryPaths acc path =
            case path of
                [] ->
                    acc

                current :: rest ->
                    getEveryPaths (( current, List.reverse path ) :: acc) rest

        fsItemView ( f, p ) =
            el
                [ Events.onClick (GoTo config.mode p)
                , paddingXY 2 4
                , pointer
                , mouseOver
                    [ Font.color (rgba 0.3 0.4 0.6 0.5) ]
                ]
                (text f)
    in
    wrappedRow
        [ width fill
        , Background.color (rgb 1 1 1)
        , padding 4
        , Border.rounded 5
        ]
        (Maybe.map extractFsItem (getCurrentFilesys config.mode model)
            |> Maybe.map getPath
            |> Maybe.withDefault []
            |> List.reverse
            |> getEveryPaths []
            |> List.map fsItemView
            |> List.intersperse (text "/")
            |> (\res -> text "/" :: res)
        )


sidePanelView : { a | mode : Mode } -> Model msg -> Element Msg
sidePanelView config model =
    let
        iconSize =
            22

        imagePreviewPanel meta imgSize =
            column
                [ width (px 300)
                , height fill
                , spacing 15
                , centerX
                , Font.family
                    [ Font.typeface "Arial" ]
                ]
                [ el
                    [ width (px 250)
                    , height (px 250)
                    , Background.color
                        (rgb 0.9 0.9 0.9)
                    , Border.rounded 5
                    , padding 0
                    , spacing 0
                    ]
                    (el
                        [ width (px 237)
                        , height (px 237)
                        , Background.uncropped (String.join "/" meta.path)
                        , Background.color (rgba 1 1 1 1)
                        , centerX
                        , centerY
                        ]
                        Element.none
                    )
                , el [ Font.center ]
                    (text <|
                        String.fromInt imgSize.width
                            ++ "x"
                            ++ String.fromInt imgSize.height
                            ++ "px"
                    )
                , Maybe.map
                    (\fs ->
                        el [ Font.center ]
                            (text <| Filesize.format fs)
                    )
                    meta.fileSize
                    |> Maybe.withDefault Element.none
                , Element.download
                    []
                    { url = String.join "/" meta.path
                    , label =
                        el
                            [ Font.color (rgb 0 0 1)
                            , Font.underline
                            ]
                            (text "Télécharger")
                    }
                ]

        folderInfoPanel fsItem =
            let
                folderInfo =
                    compileFolderInfo fsItem
            in
            column [ spacing 15 ]
                [ el [ Font.center ]
                    (text <| Filesize.format folderInfo.size)
                , el [ Font.center ]
                    (text <|
                        "Nbr fichiers: "
                            ++ String.fromInt folderInfo.nbrFiles
                    )
                , text <|
                    "Nbr dossiers: "
                        ++ String.fromInt folderInfo.nbrFolders
                ]

        regFilePreviewPanel meta =
            Element.download
                []
                { url = String.join "/" meta.path
                , label =
                    el
                        [ Font.color (rgb 0 0 1)
                        , Font.underline
                        ]
                        (text "Télécharger")
                }

        noSelectionControlsPanel =
            column
                [ spacing 15
                , width fill
                ]
                [ if config.mode == Full then
                    row
                        [ spacing 15
                        , width fill
                        ]
                        [ Keyed.el []
                            ( "newFolder"
                            , Input.text
                                (textInputStyle ++ [ width (px 195), spacing 0 ])
                                { onChange = NewFolderInput
                                , text = model.newFolderNameBuffer
                                , placeholder =
                                    Just (Input.placeholder [] (text "Nouveau dossier"))
                                , label =
                                    Input.labelLeft [] Element.none
                                }
                            )
                        , Input.button
                            (buttonStyle (model.newFolderNameBuffer /= "")
                                ++ [ Element.alignRight ]
                            )
                            { onPress =
                                if model.newFolderNameBuffer /= "" then
                                    Maybe.map extractFsItem (getCurrentFilesys config.mode model)
                                        |> Maybe.map (NewFolder config.mode)
                                else
                                    Nothing
                            , label =
                                row [ spacing 10 ]
                                    [ html <| Icons.folderPlus iconSize
                                    ]
                            }
                        ]
                  else
                    Element.none
                , case config.mode of
                    ReadOnly _ ->
                        Element.none

                    _ ->
                        row [ width fill ]
                            [ Input.button (buttonStyle True ++ [ Element.alignLeft ])
                                { onPress =
                                    Just ToogleUploadView
                                , label =
                                    row [ spacing 10 ]
                                        [ el [] (html <| Icons.upload iconSize)
                                        , text <| "Mettre en ligne"
                                        ]
                                }
                            , if config.mode == Full then
                                Input.button
                                    ((buttonStyle <| model.cutBuffer /= Nothing)
                                        ++ [ Element.alignRight ]
                                    )
                                    { onPress =
                                        if model.cutBuffer /= Nothing then
                                            Maybe.map (Paste config.mode << extractFsItem)
                                                (getCurrentFilesys config.mode model)
                                        else
                                            Nothing
                                    , label =
                                        row [ spacing 10 ]
                                            [ text "Coller"
                                            ]
                                    }
                              else
                                Element.none
                            ]
                ]

        selectionControlsPanel =
            column
                [ spacing 15
                , width fill
                ]
                [ case config.mode of
                    ReadOnly _ ->
                        Maybe.map getName model.selectedFsItem
                            |> Maybe.map (\s -> paragraph [] [ text s ])
                            |> Maybe.withDefault Element.none

                    _ ->
                        row
                            [ spacing 15
                            , width fill
                            ]
                            [ Keyed.el []
                                ( "rename"
                                , Input.text
                                    (textInputStyle ++ [ width (px 195), spacing 0 ])
                                    { onChange = RenameInput
                                    , text = model.renameBuffer
                                    , placeholder =
                                        Maybe.map getName model.selectedFsItem
                                            |> Maybe.map text
                                            |> Maybe.map (Input.placeholder [ clip ])
                                    , label =
                                        Input.labelLeft [] Element.none
                                    }
                                )
                            , Input.button
                                (buttonStyle
                                    (Maybe.map getName model.selectedFsItem
                                        |> Maybe.map (\n -> n /= model.renameBuffer)
                                        |> Maybe.withDefault False
                                    )
                                )
                                { onPress =
                                    if model.renameBuffer /= "" then
                                        Maybe.map (Rename config.mode) model.selectedFsItem
                                    else
                                        Nothing
                                , label =
                                    row [ spacing 10 ]
                                        [ text "Renommer"
                                        ]
                                }
                            ]
                , if config.mode == Full then
                    row
                        [ width fill ]
                        [ Input.button ((buttonStyle <| True) ++ [ Element.alignLeft ])
                            { onPress =
                                Maybe.map (Delete config.mode) model.selectedFsItem
                            , label =
                                row [ spacing 10 ]
                                    [ el [] (html <| xSquare iconSize)
                                    , text "Supprimer"
                                    ]
                            }
                        , Input.button ((buttonStyle <| (model.cutBuffer == Nothing)) ++ [ Element.alignRight ])
                            { onPress =
                                case model.cutBuffer of
                                    Nothing ->
                                        Maybe.map Cut model.selectedFsItem

                                    Just _ ->
                                        Nothing
                            , label =
                                row [ spacing 10 ]
                                    [ el [] (html <| scissors iconSize)
                                    , text "Couper"
                                    ]
                            }
                        ]
                  else
                    Element.none
                ]
    in
    column
        [ if
            config.mode
                == ReadOnly DocsRoot
                || (model.mainPanelDisplay == UploadDisplay && config.mode /= Full)
          then
            width (px 180)
          else
            width (px 330)
        , padding 15
        , alignTop
        , Background.color (rgb 0.95 0.95 0.95)
        , height fill
        , spacing 15
        , clip
        ]
        (case model.mainPanelDisplay of
            UploadDisplay ->
                []

            _ ->
                case model.selectedFsItem of
                    Nothing ->
                        [ noSelectionControlsPanel ]

                    Just fsItem ->
                        case fsItem of
                            Folder meta _ ->
                                [ selectionControlsPanel
                                , folderInfoPanel fsItem
                                ]

                            File meta ->
                                case meta.fileType of
                                    ImageFile imgSize ->
                                        [ selectionControlsPanel
                                        , imagePreviewPanel meta imgSize
                                        ]

                                    RegFile ->
                                        [ selectionControlsPanel
                                        , regFilePreviewPanel meta
                                        ]
        )


filesysView : { a | mode : Mode } -> Model msg -> Element Msg
filesysView config model =
    let
        fileView file { name, path, fileType } =
            column
                ([ padding 7
                 , mouseOver
                    (case Maybe.map (\fsItem -> getPath fsItem == path) model.selectedFsItem of
                        Just True ->
                            []

                        _ ->
                            [ Background.color (rgba 0.3 0.4 0.6 0.3) ]
                    )
                 , Border.rounded 5
                 , case Maybe.map (\fsItem -> getPath fsItem == path) model.selectedFsItem of
                    Just True ->
                        Background.color (rgba 0.3 0.4 0.6 0.5)

                    _ ->
                        noAttr
                 , onDoubleClick NoOp
                 , alignTop
                 ]
                    ++ (if List.member file model.lockedFsItems then
                            [ alpha 0.5 ]
                        else
                            [ pointer
                            , Events.onClick (SelectFsItem config.mode file)
                            ]
                       )
                )
                [ el
                    [ width (px 80)
                    , height (px 80)
                    , Background.color
                        (rgb 0.95 0.95 0.95)
                    , Border.rounded 5
                    , padding 0
                    , spacing 0
                    , htmlAttribute <| HtmlAttr.style "transition" "0.1s"
                    ]
                    (el
                        [ width (px 67)
                        , height (px 67)
                        , case fileType of
                            ImageFile _ ->
                                Background.uncropped (String.join "/" path)

                            RegFile ->
                                if String.contains ".pdf" name then
                                    Background.uncropped "/assets/images/pdf.svg"
                                else if String.contains ".ppt" name then
                                    Background.uncropped "/assets/images/ppt.svg"
                                else if String.contains ".doc" name then
                                    Background.uncropped "/assets/images/doc.svg"
                                else
                                    Background.uncropped "/assets/images/file.svg"
                        , Background.color (rgba 1 1 1 1)
                        , centerX
                        , centerY
                        ]
                        Element.none
                    )
                , paragraph
                    [ width (px 80)
                    , clip
                    , Font.size 12
                    , paddingXY 0 5
                    , Font.center
                    ]
                    [ text <|
                        prettyName name 10
                    ]
                ]

        folderView folder { name, path } =
            column
                ([ padding 7
                 , Border.rounded 5
                 , mouseOver
                    (case Maybe.map (\fsItem -> getPath fsItem == path) model.selectedFsItem of
                        Just True ->
                            []

                        _ ->
                            [ Background.color (rgba 0.3 0.4 0.6 0.3) ]
                    )
                 , htmlAttribute <| HtmlAttr.style "transition" "0.1s"
                 , alignTop
                 , case Maybe.map (\fsItem -> getPath fsItem == path) model.selectedFsItem of
                    Just True ->
                        Background.color (rgba 0.3 0.4 0.6 0.5)

                    _ ->
                        noAttr
                 ]
                    ++ (if List.member folder model.lockedFsItems then
                            [ alpha 0.5
                            , onDoubleClick NoOp
                            ]
                        else
                            [ pointer
                            , Events.onClick (SelectFsItem config.mode folder)
                            , onDoubleClick (GoTo config.mode path)
                            ]
                       )
                )
                [ el
                    [ width (px 80)
                    , height (px 80)
                    , Background.color (rgb 1 1 1)
                    , Background.uncropped "assets/images/folder.svg"
                    ]
                    Element.none
                , paragraph
                    [ width (px 80)
                    , clip
                    , Font.size 12
                    , Font.center
                    , paddingXY 0 5
                    ]
                    [ text <| prettyName name 10 ]
                ]

        contentView fsItem =
            case fsItem of
                File meta ->
                    fileView fsItem meta

                Folder meta _ ->
                    folderView fsItem meta
    in
    case getCurrentFilesys config.mode model of
        Nothing ->
            el [ alignTop ] (text "Erreur système de fichier")

        Just filesys ->
            case extractFsItem filesys of
                File meta ->
                    fileView (File meta) meta

                Folder meta contents ->
                    column
                        [ scrollbarY
                        , height fill
                        , width fill
                        , alignTop
                        , padding 15
                        ]
                        [ paragraph
                            [ spacing 5
                            ]
                            (List.partition
                                (\f ->
                                    case f of
                                        File _ ->
                                            True

                                        _ ->
                                            False
                                )
                                contents
                                |> (\( files, folders ) ->
                                        List.sortBy getName folders
                                            ++ List.sortBy getName files
                                   )
                                |> List.map contentView
                            )
                        ]


logsView : { a | mode : Mode, zone : Zone } -> Model msg -> Element Msg
logsView config model =
    column
        [ scrollbarY
        , height fill
        , width fill
        , alignTop
        , padding 15
        ]
        [ Internals.CommonHelpers.logsView model.logs config.zone ]


uploadView :
    { a | logInfo : Auth.AuthPlugin.LogInfo, mode : Mode }
    -> Model msg
    -> Element Msg
uploadView config model =
    let
        imagesUploadView =
            column
                [ spacing 15 ]
                [ Input.radioRow
                    [ spacing 15 ]
                    { onChange =
                        SetImageUploadType
                    , options =
                        [ Input.option
                            BulkUpload
                            (text "Chargement simple")
                        , Input.option
                            RegUpload
                            (text "Modifier et charger")
                        ]
                    , selected =
                        Just model.imageUploadType
                    , label = Input.labelLeft [] Element.none
                    }
                , case model.imageUploadType of
                    BulkUpload ->
                        column
                            [ spacing 15 ]
                            [ text "Mettre des images en ligne"
                            , bulkUploadView
                            ]

                    RegUpload ->
                        imageControllerView config model model.imageControllerMode
                ]

        bulkUploadView =
            column
                [ spacing 15 ]
                [ uploadControllerView
                , if model.canUpload then
                    column
                        [ spacing 10 ]
                        (List.map fileUploadStatusView model.filesToUpload
                            ++ [ row
                                    [ spacing 10 ]
                                    [ Input.button
                                        (buttonStyle <| True)
                                        { onPress =
                                            Just ToogleUploadView
                                        , label =
                                            row [ spacing 10 ]
                                                [ text "Retour"
                                                ]
                                        }
                                    , Input.button
                                        (buttonStyle <| True)
                                        { onPress =
                                            Just UploadFiles
                                        , label =
                                            row [ spacing 10 ]
                                                [ text "Envoyer"
                                                ]
                                        }
                                    ]
                               ]
                        )
                  else
                    Input.button
                        (buttonStyle <| True)
                        { onPress =
                            Just ToogleUploadView
                        , label =
                            row [ spacing 10 ]
                                [ text "Retour"
                                ]
                        }
                ]

        uploadControllerView =
            uploadController
                ([ HtmlEvents.on
                    "filesInput"
                    (decodeFilesToUpload (FilesToUpload config.mode))
                 , HtmlEvents.on
                    "uploadProgress"
                    (decodeFilesToUpload (FilesToUpload config.mode))
                 , if model.canUpload then
                    HtmlAttr.hidden True
                   else
                    noHtmlAttr
                 , Maybe.map extractFsItem (getCurrentFilesys config.mode model)
                    |> Maybe.andThen (List.tail << getPath)
                    |> Maybe.map (String.join "/")
                    |> Maybe.withDefault ""
                    |> (\p ->
                            HtmlAttr.property "uploadPath"
                                (Encode.string (p ++ "/"))
                       )
                 , case modeRoot config.mode model.root of
                    ImagesRoot ->
                        HtmlAttr.property "uploadScript"
                            (Encode.string "uploadPic.php")

                    DocsRoot ->
                        HtmlAttr.property "uploadScript"
                            (Encode.string "uploadDoc.php")
                 ]
                    ++ [ if model.needToUpload then
                            case config.logInfo of
                                LoggedOut ->
                                    noHtmlAttr

                                LoggedIn { sessionId } ->
                                    HtmlAttr.property "sendFiles"
                                        (Encode.string sessionId)
                         else
                            noHtmlAttr
                       ]
                )

        fileUploadStatusView { filename, loaded, total, success } =
            row
                [ spacing 15 ]
                [ el [] (text filename)
                , el []
                    (if total /= 0 then
                        text <|
                            (String.fromInt
                                (round <| 100 * loaded / total)
                                ++ "%"
                                ++ " "
                                ++ (if success then
                                        "ok"
                                    else
                                        "erreur"
                                   )
                            )
                     else
                        text "pret"
                    )

                --, el [] (text <| String.fromFloat total)
                ]
    in
    column
        [ scrollbarY
        , height fill
        , width fill
        , alignTop
        , padding 15
        , Font.family
            [ Font.typeface "Arial" ]
        ]
        [ case model.root of
            ImagesRoot ->
                imagesUploadView

            DocsRoot ->
                column
                    [ spacing 15 ]
                    [ text "Mettre des documents en ligne: "
                    , bulkUploadView
                    ]
        ]


uploadController : List (Html.Attribute msg) -> Element msg
uploadController attributes =
    -- NOTE : Custom element qui permet de mettre plusieurs fichiers
    -- en ligne d'un coup. Fonctionne pour les images, ou les docs
    el
        []
        (html <|
            Html.node "uploads-controller"
                attributes
                [ Html.input
                    [ HtmlAttr.type_ "file"
                    , HtmlAttr.attribute "multiple" "multiple"
                    ]
                    []
                ]
        )


imageControllerView :
    { a | mode : Mode }
    -> Model msg
    -> ImageControllerMode
    -> Element Msg
imageControllerView config model imgContMode =
    column
        [ spacing 15
        , Font.size 16
        , padding 15
        , alignTop
        ]
        [ case imgContMode of
            FileReader ->
                fileReaderView model

            Editor ->
                editView config model
        , imageController
            ([ HtmlEvents.on "fileRead" (decodeImageData FileRead)
             , HtmlEvents.on "imageRead" (decodeImageData ImageRead)
             , if imgContMode /= FileReader then
                HtmlAttr.hidden True
               else
                noHtmlAttr
             , if model.needToRotate then
                HtmlAttr.property "rotationAngle" (Encode.int model.desiredRotationAngle)
               else
                noHtmlAttr
             ]
                ++ (if model.needToResize then
                        [ (if model.desiredRotationAngle == 90 || model.desiredRotationAngle == 270 then
                            model.desiredWidth
                           else
                            model.desiredHeight
                          )
                            |> Maybe.map (\h -> Encode.int h)
                            |> Maybe.map (\val -> HtmlAttr.property "desiredSize" val)
                            |> Maybe.withDefault noHtmlAttr
                        ]
                    else
                        []
                   )
            )
        , case imgContMode of
            FileReader ->
                Input.button
                    (buttonStyle True)
                    { onPress = Just ToogleUploadView
                    , label = text "Retour"
                    }

            Editor ->
                Element.none
        ]


fileReaderView : Model msg -> Element Msg
fileReaderView model =
    column
        [ spacing 15 ]
        [ row
            [ spacing 15 ]
            [ el [] (text "Charger une image depuis votre PC: ")
            ]
        ]


imageController : List (Html.Attribute msg) -> Element.Element msg
imageController attributes =
    --Keyed.el []
    --    ( "test"
    --      --String.fromInt <| List.length attributes
    el []
        (html <|
            Html.node "image-controller"
                attributes
                [ Html.input
                    [ HtmlAttr.type_ "file"
                    ]
                    []
                ]
        )


editView : { a | mode : Mode } -> Model msg -> Element Msg
editView config model =
    let
        iconSize =
            18
    in
    case ( model.mbImageFromFile, model.mbOriImageWidth, model.mbOriImageHeight ) of
        ( Just f, Just oriW, Just oriH ) ->
            column
                [ spacing 15 ]
                [ row
                    [ spacing 15 ]
                    [ row
                        [ spacing 10
                        , width (px 500)
                        ]
                        [ Input.text textInputStyle
                            { onChange =
                                SetFilename
                            , text =
                                Maybe.withDefault f.filename model.desiredFilename
                            , placeholder = Nothing
                            , label =
                                Input.labelLeft [ centerY ]
                                    (el [ width (px 110) ] (text "Nom de fichier: "))
                            }
                        ]
                    , Input.button (buttonStyle True)
                        { onPress = Just RotateLeft
                        , label = el [] (html <| rotateCcw iconSize)
                        }
                    , Input.button (buttonStyle True)
                        { onPress = Just RotateRight
                        , label = el [] (html <| rotateCw iconSize)
                        }

                    -- text "Nom de fichier: "
                    --, text f.filename
                    ]
                , row
                    [ spacing 15 ]
                    [ row
                        [ spacing 10
                        , width (px 500)
                        ]
                        [ el [ width (px 110) ] (text "Dimensions: ")
                        , Input.slider
                            [ Element.height (Element.px 30)
                            , Element.width (px 250)

                            -- Here is where we're creating/styling the "track"
                            , Element.behindContent
                                (Element.el
                                    [ Element.width fill
                                    , Element.height (Element.px 2)
                                    , Element.centerY
                                    , Background.color (rgb 0.9 0.9 0.9)
                                    , Border.rounded 2
                                    ]
                                    Element.none
                                )
                            ]
                            { onChange = Resize
                            , label = Input.labelLeft [ centerY ] Element.none
                            , min = 0
                            , max = 100
                            , step = Just 1
                            , value = model.sliderValue
                            , thumb =
                                Input.defaultThumb
                            }
                        , el [ width (px 100) ]
                            (text <|
                                (model.desiredWidth
                                    |> Maybe.map String.fromInt
                                    |> Maybe.withDefault (String.fromInt oriW)
                                )
                                    ++ "x"
                                    ++ (model.desiredHeight
                                            |> Maybe.map String.fromInt
                                            |> Maybe.withDefault (String.fromInt oriH)
                                       )
                            )
                        ]
                    , Input.button (buttonStyle model.canResize)
                        { onPress =
                            if model.canResize then
                                Just SetResize
                            else
                                Nothing
                        , label = text "Redimensionner"
                        }
                    ]
                , row
                    [ spacing 15 ]
                    [ row
                        [ spacing 5 ]
                        [ el [] (text "Taille originale: ")
                        , el []
                            (text
                                (model.mbOriFileSize
                                    |> Maybe.map Filesize.format
                                    |> Maybe.withDefault "Erreur"
                                )
                            )
                        ]
                    , row
                        [ spacing 5 ]
                        [ el [] (text "Taille actuelle: ")
                        , el []
                            (text
                                (model.mbImageFromFile
                                    |> Maybe.map .filesize
                                    |> Maybe.map Filesize.format
                                    |> Maybe.withDefault "Erreur"
                                )
                            )
                        ]
                    ]
                , row
                    [ spacing 15 ]
                    [ Input.button (buttonStyle True)
                        { onPress = Just ResetImageController
                        , label = text "Nouveau fichier"
                        }
                    , Input.button (buttonStyle True)
                        { onPress = Just ToogleUploadView
                        , label = text "Retour"
                        }
                    , Input.button (buttonStyle True)
                        { onPress =
                            Maybe.map extractFsItem (getCurrentFilesys config.mode model)
                                |> Maybe.map UploadImage
                        , label = text "Valider et envoyer"
                        }
                    ]
                , text "Aperçu: "
                , el
                    [ width (maximum 650 fill)
                    , height (maximum 550 fill)
                    , scrollbars
                    ]
                    (image
                        [ centerY
                        , centerX
                        ]
                        { src = f.contents
                        , description = f.filename
                        }
                    )
                ]

        _ ->
            text "no file data"



-------------------------------------------------------------------------------
-----------------------------
-- Http and Json functions --
-----------------------------
-- Get Files --


getFileList : Root -> List String -> String -> Cmd Msg
getFileList root toRefresh sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                , ( "toRefresh", Encode.list Encode.string toRefresh )
                , encodeRoot root
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "getFiles.php"
        , body = body
        , expect =
            Http.expectJson
                (RefreshFilesys
                    Nothing
                    "Téléchargement info fichiers"
                    root
                )
                decodeFiles
        }


decodeFiles : Decode.Decoder (List FsItem)
decodeFiles =
    Decode.list decodeFile


decodeFile : Decode.Decoder FsItem
decodeFile =
    Decode.succeed
        (\p f mbImgSize mbFs isFolder ->
            if isFolder then
                Folder
                    { defMeta
                        | path = String.split "/" p
                        , name = f
                    }
                    []
            else
                File
                    { path =
                        String.split "/" p
                    , name = f
                    , fileType =
                        case mbImgSize of
                            Nothing ->
                                RegFile

                            Just size ->
                                ImageFile size
                    , fileSize = mbFs
                    }
        )
        |> Pipeline.required "path"
            Decode.string
        |> Pipeline.required "name"
            (Decode.string
                |> Decode.map
                    (\s ->
                        if String.contains "?" s then
                            leftOf "?" s
                        else
                            s
                    )
            )
        |> Pipeline.required "imgSize"
            (Decode.nullable <|
                Decode.map2
                    (\w h -> { width = w, height = h })
                    (Decode.field "width" Decode.int)
                    (Decode.field "height" Decode.int)
            )
        |> Pipeline.required "fileSize" (Decode.nullable Decode.int)
        |> Pipeline.optional "isFolder" Decode.bool False


deleteFile : FsItem -> Root -> String -> Cmd Msg
deleteFile fsItem root sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                , encodeRoot root
                , ( "path", encodeFsItemPath fsItem )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "deleteFile.php"
        , body = body
        , expect =
            Http.expectJson
                (RefreshFilesys
                    (Just fsItem)
                    ("Suppression: " ++ getName fsItem)
                    root
                )
                decodeFiles
        }



-- Rename file --


renameFile : FsItem -> String -> Root -> String -> Cmd Msg
renameFile fsItem newName root sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                , encodeRoot root
                , ( "newName"
                  , Encode.string newName
                  )
                , ( "path", encodeFsItemPath fsItem )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "renameFile.php"
        , body = body
        , expect =
            Http.expectJson
                (RefreshFilesys
                    (Just fsItem)
                    ("Renommage: " ++ getName fsItem)
                    root
                )
                decodeFiles
        }



-- Paste File


pasteFile : FsItem -> FsItem -> Root -> String -> Cmd Msg
pasteFile src dest root sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                , encodeRoot root
                , ( "srcPath", encodeFsItemPath src )
                , ( "destPath", encodeFsItemPath dest )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "pasteFile.php"
        , body = body
        , expect =
            Http.expectJson
                (RefreshFilesys
                    (Just src)
                    ("Collage: " ++ getName src)
                    root
                )
                decodeFiles
        }



-- New Folder


makeNewFolder : FsItem -> String -> Root -> String -> Cmd Msg
makeNewFolder fsItem folderName root sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                , encodeRoot root
                , ( "path", encodeFsItemPath fsItem )
                , ( "folderName", Encode.string folderName )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "newFolder.php"
        , body = body
        , expect =
            Http.expectJson
                (RefreshFilesys
                    (Just fsItem)
                    ("Création dossier: " ++ folderName)
                    root
                )
                decodeFiles
        }


encodeFsItemPath : FsItem -> Encode.Value
encodeFsItemPath fsItem =
    getPath fsItem
        |> String.join "/"
        |> (\s ->
                if String.contains "?" s then
                    leftOf "?" s
                else
                    s
           )
        |> Encode.string


encodeRoot : Root -> ( String, Encode.Value )
encodeRoot root =
    case root of
        ImagesRoot ->
            ( "root"
            , Encode.string "images"
            )

        DocsRoot ->
            ( "root"
            , Encode.string "baseDocumentaire"
            )



-- upload image


uploadImage : FsItem -> String -> String -> String -> Cmd Msg
uploadImage fsItem filename contents sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                , ( "filename", Encode.string filename )
                , ( "uploadPath"
                  , getPath fsItem
                        |> List.tail
                        |> Maybe.map (String.join "/")
                        |> Maybe.map
                            (\p ->
                                p ++ "/"
                            )
                        |> Maybe.withDefault ""
                        |> Encode.string
                  )
                , ( "contents", Encode.string contents )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "uploadBase64Pic.php"
        , body = body
        , expect =
            Http.expectJson
                (RefreshFilesys
                    (Just fsItem)
                    ("Mise en ligne image base64: " ++ filename)
                    ImagesRoot
                )
                decodeFiles
        }


decodeFilesToUpload : (List FileToUpload -> Msg) -> Decode.Decoder Msg
decodeFilesToUpload msg =
    Decode.at [ "target", "fileDict" ]
        (Decode.dict
            (Decode.succeed FileToUpload
                |> Pipeline.required "filename" Decode.string
                |> Pipeline.optional "loaded" Decode.float 0
                |> Pipeline.optional "total" Decode.float 0
                |> Pipeline.optional "success"
                    (Decode.oneOf
                        [ Decode.field "message" Decode.string
                            |> Decode.map (\_ -> True)
                        , Decode.field "serverError" Decode.string
                            |> Decode.map (\_ -> False)
                        ]
                    )
                    False
            )
            |> Decode.map Dict.values
            |> Decode.map msg
        )


decodeDebug : Decode.Decoder Msg
decodeDebug =
    Decode.succeed "debugger called"
        |> Decode.map Debug


decodeImageData : (ImageFromFile -> Msg) -> Decode.Decoder Msg
decodeImageData msg =
    Decode.at [ "target", "fileData" ]
        (Decode.map5 ImageFromFile
            (Decode.field "contents" Decode.string)
            (Decode.field "filename" Decode.string)
            (Decode.field "width" Decode.int)
            (Decode.field "height" Decode.int)
            (Decode.field "filesize" Decode.int)
            |> Decode.map msg
        )



-------------------------------------------------------------------------------
---------------------------------
-- Filesys types and functions --
---------------------------------


type FsItem
    = Folder Meta (List FsItem)
    | File Meta


type alias Meta =
    { path : Path
    , name : String
    , fileType : FileType
    , fileSize : Maybe Int
    }


defMeta =
    { path = []
    , name = ""
    , fileType = RegFile
    , fileSize = Nothing
    }


type FileType
    = ImageFile { width : Int, height : Int }
    | RegFile


type alias Path =
    List String


type alias Filesys =
    { current : FsItem
    , contexts : List Context
    }


type alias Context =
    { parent : Meta
    , left : List FsItem
    , right : List FsItem
    }


initFileSys : FsItem -> Filesys
initFileSys fsItem =
    { current = fsItem
    , contexts = []
    }


extractFsItem : Filesys -> FsItem
extractFsItem { current, contexts } =
    current


updateCurrFilesys : FsItem -> Filesys -> Filesys
updateCurrFilesys new filesys =
    { filesys | current = new }


rewindFilesys : Filesys -> Filesys
rewindFilesys filesys =
    case zipUpFilesys filesys of
        Nothing ->
            filesys

        Just filesys_ ->
            rewindFilesys filesys_


zipUpFilesys : Filesys -> Maybe Filesys
zipUpFilesys filesys =
    case filesys.contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            Just
                { filesys
                    | current = Folder parent (left ++ [ filesys.current ] ++ right)
                    , contexts = cs
                }


zipDownFilesys : (FsItem -> Bool) -> Filesys -> Maybe Filesys
zipDownFilesys p filesys =
    case filesys.current of
        File _ ->
            Nothing

        Folder _ [] ->
            Nothing

        Folder meta cs ->
            let
                ( l, r ) =
                    break p cs
            in
            case r of
                [] ->
                    Nothing

                f :: fs ->
                    Just
                        { filesys
                            | current = f
                            , contexts =
                                { parent = meta
                                , left = l
                                , right = fs
                                }
                                    :: filesys.contexts
                        }


zipToFsItem : Path -> Filesys -> Maybe Filesys
zipToFsItem path filesys =
    let
        helper remainingPath filesys_ =
            case remainingPath of
                [] ->
                    Nothing

                curr :: [] ->
                    if getName (extractFsItem filesys_) /= curr then
                        Nothing
                    else
                        Just filesys_

                curr :: next :: rest ->
                    if getName (extractFsItem filesys_) /= curr then
                        Nothing
                    else
                        zipDownFilesys (\fsItem -> getName fsItem == next) filesys_
                            |> Maybe.andThen (helper (next :: rest))
    in
    helper path filesys


delete : Filesys -> Maybe Filesys
delete { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            Just
                { current = Folder parent (left ++ right)
                , contexts = cs
                }


getName : FsItem -> String
getName fsItem =
    case fsItem of
        Folder { name } _ ->
            name

        File { name } ->
            name


getPath : FsItem -> Path
getPath fsItem =
    case fsItem of
        Folder { path } _ ->
            path

        File { path } ->
            path


getFileSize : FsItem -> Int
getFileSize fsItem =
    case fsItem of
        File { fileSize } ->
            Maybe.withDefault 0 fileSize

        Folder _ _ ->
            0


compileFolderInfo : FsItem -> { nbrFiles : Int, size : Int, nbrFolders : Int }
compileFolderInfo fsItem =
    let
        helper fsItem_ ({ nbrFiles, size, nbrFolders } as acc) =
            case fsItem_ of
                File { fileSize } ->
                    { acc
                        | size = Maybe.withDefault 0 fileSize + size
                        , nbrFiles = nbrFiles + 1
                    }

                Folder _ children ->
                    List.foldr
                        (\f acc_ -> helper f acc_)
                        { acc | nbrFolders = acc.nbrFolders + 1 }
                        children
    in
    helper fsItem { nbrFiles = 0, nbrFolders = -1, size = 0 }


insert : FsItem -> String -> Maybe FsItem -> Maybe FsItem
insert f rootName mbFsItem_ =
    -- NOTE: permet de de construire un syteme de fichiers à partir
    -- d'une liste de fichiers/repertoires vides et de leur chemins
    -- d'accès. L'ordre d'insertion n'est pas important, la fonction
    -- crée les repertoires intermédiaires au besoin.
    -- Les doublons sont ignorés.
    -- Format pour f:
    --     [ File (Meta [ "Images", "Folder1", "pic1"] "pic1")
    --     , Folder (Meta [ "Images" , "Folder1", "Folder3" ] "Folder3") []
    --     , Folder (Meta [ "Images" ] "Images") []
    --     ]
    -- LES REPERTOIRES DOIVENT ETRE VIDES!
    let
        helper path mbFsItem =
            case mbFsItem of
                Nothing ->
                    case path of
                        [] ->
                            helper
                                path
                                (Just <| Folder { defMeta | path = [ rootName ], name = rootName } [])

                        root :: _ ->
                            if root /= rootName then
                                Nothing
                            else
                                helper
                                    path
                                    (Just <| Folder { defMeta | path = [ rootName ], name = rootName } [])

                Just (Folder meta children) ->
                    case path of
                        [] ->
                            Just <| Folder meta children

                        curr :: [] ->
                            if curr /= meta.name then
                                Nothing
                            else if List.any (\c -> getName c == getName f) children then
                                Just <| Folder meta children
                            else
                                Just <| Folder meta (f :: children)

                        curr :: next :: rest ->
                            if curr /= meta.name then
                                Nothing
                            else
                                let
                                    ( l, r ) =
                                        break (\f_ -> getName f_ == next) children
                                in
                                case r of
                                    [] ->
                                        let
                                            newFolder =
                                                Folder
                                                    { defMeta
                                                        | name = next
                                                        , path = meta.path ++ [ next ]
                                                    }
                                                    []
                                        in
                                        helper (next :: rest) (Just newFolder)
                                            |> Maybe.andThen
                                                (\nsbt -> Just <| Folder meta (nsbt :: children))

                                    next_ :: rest_ ->
                                        helper (next :: rest) (Just next_)
                                            |> Maybe.andThen
                                                (\nsbt -> Just <| Folder meta (l ++ nsbt :: rest_))

                _ ->
                    Nothing
    in
    List.reverse (getPath f)
        |> List.tail
        |> Maybe.map List.reverse
        |> Maybe.andThen (\p -> helper p mbFsItem_)



-------------------------------------------------------------------------------
---------------------------
-- Misc helper functions --
---------------------------


updateFilesys : Mode -> Model msg -> (Maybe Filesys -> Maybe Filesys) -> Model msg
updateFilesys mode model f =
    case mode of
        Full ->
            case model.root of
                ImagesRoot ->
                    { model | mbIFilesys = f model.mbIFilesys }

                DocsRoot ->
                    { model | mbDFilesys = f model.mbDFilesys }

        mode_ ->
            case modeRoot mode_ model.root of
                ImagesRoot ->
                    { model | mbIFilesys = f model.mbIFilesys }

                DocsRoot ->
                    { model | mbDFilesys = f model.mbDFilesys }


getCurrentFilesys : Mode -> Model msg -> Maybe Filesys
getCurrentFilesys mode model =
    case mode of
        Full ->
            case model.root of
                ImagesRoot ->
                    model.mbIFilesys

                DocsRoot ->
                    model.mbDFilesys

        mode_ ->
            case modeRoot mode_ model.root of
                ImagesRoot ->
                    model.mbIFilesys

                DocsRoot ->
                    model.mbDFilesys


indexPhototheque : Model msg -> Dict String ( Bool, List ( String, String ) )
indexPhototheque model =
    let
        getPaths ( hq, acc ) files =
            case files of
                [] ->
                    ( hq, List.reverse acc )

                (Folder meta _) :: xs ->
                    if meta.name == "HQ" then
                        getPaths ( True, acc ) xs
                    else
                        getPaths ( hq, acc ) xs

                (File meta) :: xs ->
                    getPaths
                        ( hq
                        , ( meta.name
                          , "/" ++ String.join "/" meta.path
                          )
                            :: acc
                        )
                        xs
    in
    case
        getCurrentFilesys (ReadOnly ImagesRoot) model
            |> Maybe.map rewindFilesys
            |> Maybe.andThen (zipToFsItem [ "images", "phototheque" ])
            |> Maybe.map extractFsItem
    of
        Just (Folder _ galleries) ->
            List.foldr
                (\g acc ->
                    case g of
                        File meta ->
                            acc

                        Folder meta pictures ->
                            Dict.insert
                                meta.name
                                (getPaths ( False, [] ) pictures)
                                acc
                )
                Dict.empty
                galleries

        _ ->
            Dict.empty


break : (a -> Bool) -> List a -> ( List a, List a )
break p xs =
    let
        helper ys left =
            case ys of
                [] ->
                    ( left, [] )

                y :: ys_ ->
                    if p y then
                        ( List.reverse left, y :: ys_ )
                    else
                        helper ys_ (y :: left)
    in
    helper xs []


onDoubleClick : Msg -> Attribute Msg
onDoubleClick msg =
    let
        decodeNbrClicks =
            Decode.at [ "detail" ] Decode.int

        preventIfDoubleClick n =
            if n > 1 then
                ( msg, True )
            else
                ( NoOp, False )
    in
    preventDefaultOn "mousedown" (Decode.map preventIfDoubleClick decodeNbrClicks)
        |> htmlAttribute


prettyName2 : String -> Int -> String
prettyName2 name n =
    String.Extra.wrap n name
        |> String.lines
        |> (\res ->
                case res of
                    l1 :: l2 :: [] ->
                        if String.length l2 <= 3 && String.contains "." l1 then
                            let
                                newL1 =
                                    leftOfBack "." l1

                                newL2 =
                                    "." ++ rightOfBack "." l1 ++ l2
                            in
                            String.join "\n" [ newL1, newL2 ]
                        else
                            String.join "" res
                                |> String.Extra.wrap n

                    l1 :: l2 :: l3 :: _ ->
                        if String.length l3 <= 3 && String.contains "." l2 then
                            let
                                newL2 =
                                    leftOfBack "." l2

                                newL3 =
                                    "." ++ rightOfBack "." l2 ++ l3
                            in
                            String.join "\n" [ l1, newL2, newL3 ]
                        else
                            String.join "" [ l1, l2, String.Extra.ellipsis (n - 3) l3 ]
                                |> String.Extra.wrap n

                    _ ->
                        String.join "" res
                            |> String.Extra.wrap n
           )


prettyName : String -> Int -> String
prettyName name n =
    String.words name
        |> List.concatMap
            (\s ->
                let
                    l =
                        String.length s
                in
                if l >= n then
                    String.split "." s
                        |> String.join " ."
                        |> String.words
                else
                    [ s ]
            )
        |> List.concatMap
            (String.Extra.break
                n
            )
        |> (\xs ->
                if List.length xs > 3 then
                    List.indexedMap
                        (\i s ->
                            if i == 2 then
                                if String.length s >= 7 then
                                    String.left 7 s ++ "..."
                                else
                                    s ++ "..."
                            else
                                s
                        )
                        xs
                        |> List.take 3
                else
                    xs
           )
        |> customJoin [] n " "


customJoin : List String -> Int -> String -> List String -> String
customJoin acc n s xs =
    case xs of
        [] ->
            String.join s (List.reverse acc)

        xs1 :: xs2 :: rest ->
            if
                (String.length xs1 + String.length xs2)
                    <= n
                    && (String.contains "." xs1 || String.contains "." xs2)
            then
                customJoin ((xs1 ++ xs2) :: acc) n s rest
            else
                customJoin (xs1 :: acc) n s (xs2 :: rest)

        xs1 :: rest ->
            customJoin (xs1 :: acc) n s rest


pickerView :
    moduleMsg
    -> (PickerResult -> moduleMsg)
    -> Root
    ->
        { config
            | maxHeight : Int
            , zone : Time.Zone
            , fileExplorer : Model msg
            , logInfo : LogInfo
        }
    -> (moduleMsg -> msg)
    -> Element msg
pickerView backMsg confirmMsg root config externalMsg =
    let
        selector m =
            case root of
                ImagesRoot ->
                    getSelectedImage m
                        |> Maybe.map
                            (\{ src, width, height } ->
                                PickedImage
                                    { url = src
                                    , width = width
                                    , height = height
                                    }
                            )

                DocsRoot ->
                    getSelectedDoc m
                        |> Maybe.map PickedDoc
    in
    column
        [ height fill
        , paddingEach
            { top = 0
            , bottom = 15
            , left = 0
            , right = 0
            }
        ]
        [ view
            { maxHeight =
                if config.maxHeight < 800 then
                    400
                else
                    500
            , zone = config.zone
            , logInfo = config.logInfo
            , mode = ReadWrite root
            }
            config.fileExplorer
        , row
            [ spacing 15
            , paddingXY 15 0
            ]
            [ Input.button
                (buttonStyle True)
                { onPress = Just (externalMsg <| backMsg)
                , label = text "Retour"
                }
            , Input.button (buttonStyle (selector config.fileExplorer /= Nothing))
                { onPress =
                    selector config.fileExplorer
                        |> Maybe.map (externalMsg << confirmMsg)
                , label = text "Valider"
                }
            ]
        ]
