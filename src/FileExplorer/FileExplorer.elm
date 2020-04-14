port module FileExplorer.FileExplorer exposing
    ( Mode(..)
    , Model
    , Msg(..)
    , Root(..)
    , getSelectedDoc
    , getSelectedImage
    , indexPhototheque
    , init
    , load
    , loadingStatus
    , loadingView
    , pickerView
    , status
    , subscriptions
    , update
    , view
    )

import Auth.AuthPlugin exposing (LogInfo(..), cmdIfLogged, newLogIfLogged)
import Dict exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Keyed as Keyed
import Element.Lazy as Lazy
import File exposing (..)
import File.Select as Select exposing (..)
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


port toFileExplorerImageProcessor : Encode.Value -> Cmd msg


port fileExplorerProcessedImages : (Decode.Value -> msg) -> Sub msg


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

    --, logs : List Log
    , loadingStatus : ToolLoadingStatus
    , imageFiles : Maybe (List FsItem)
    , docFiles : Maybe (List FsItem)
    , lockedFsItems : List FsItem
    , canUpload : Bool
    , needToUpload : Bool

    --, filesToUpload_ : List FileToUpload
    , filesToUpload : Dict String File
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
    , fileSizes : Dict String Int
    , processedPics : Dict String ProcessedImage
    , processingQueue : List ( String, File )
    , bulkImageUploaderState : BulkImageUploadState
    , bulkUploadState : BulkUploadState
    , bulkImageUploadSize : BulkImageUploadSize
    , uploadProgress : Dict String ( Int, Int, Maybe UploadStatus )
    }


type BulkImageUploadSize
    = News -- 266x200
    | BlockLinks -- 300x225
    | Fiches -- 440x320
    | Regular -- 800x600


type BulkImageUploadState
    = Home
    | ImageProcessing
    | Upload


type BulkUploadState
    = BUHome
    | BUUpload


subscriptions model =
    Sub.map model.externalMsg <|
        Sub.batch
            ([ fileExplorerProcessedImages ImageProcessed
             ]
                ++ Dict.foldr
                    (\fn _ acc -> Http.track fn (GotProgress fn) :: acc)
                    []
                    model.uploadProgress
            )


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



--| LogsDisplay


type alias ImageFromFile =
    { contents : String
    , filename : String
    , width : Int
    , height : Int
    , filesize : Int
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
    , imageFiles = Nothing
    , docFiles = Nothing
    , loadingStatus = ToolLoadingWaiting
    , lockedFsItems = []
    , canUpload = False
    , needToUpload = False
    , filesToUpload = Dict.empty
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
    , fileSizes = Dict.empty
    , processedPics = Dict.empty
    , processingQueue = []
    , bulkImageUploaderState = Home
    , bulkUploadState = BUHome
    , bulkImageUploadSize = Regular
    , uploadProgress = Dict.empty
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


status model =
    combineStatus
        []


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
    | ToogleUploadView
    | SetImageUploadType UploadType
    | UploadImage FsItem
    | FilesRequested FsItem
    | FilesSelected FsItem File (List File)
    | ManualFileUpload String
      ------------------------
      -- Image bulk uploads --
      ------------------------
    | ImagesRequested
    | ImagesSelected File (List File)
    | Base64Img String String
    | ImageProcessed Decode.Value
    | SetImageSize BulkImageUploadSize
    | Reset
    | ManualUpload String
    | GoToUpload
    | GotProgress String Http.Progress
    | Uploaded String (Result Http.Error UploadStatus)
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


update : { a | logInfo : LogInfo, addLog : Log -> msg } -> Msg -> Model msg -> ( Model msg, Cmd msg, Maybe a )
update config msg model =
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
                    |> Cmd.map model.externalMsg
                , newLogIfLogged
                    config.logInfo
                    config.addLog
                    ("Requête: Nouveau dossier "
                        ++ model.newFolderNameBuffer
                        ++ " dans "
                        ++ getName fsItem
                    )
                    Nothing
                    False
                    True
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
                    |> Cmd.map model.externalMsg
                , newLogIfLogged
                    config.logInfo
                    config.addLog
                    ("Requête: Suppression " ++ getName fsItem)
                    Nothing
                    False
                    True
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
                            |> Cmd.map model.externalMsg
                        , newLogIfLogged
                            config.logInfo
                            config.addLog
                            ("Requête: Collage de"
                                ++ getName src
                                ++ " dans "
                                ++ getName dest
                            )
                            Nothing
                            False
                            True
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
                    |> Cmd.map model.externalMsg
                , newLogIfLogged
                    config.logInfo
                    config.addLog
                    ("Requête: Renommage " ++ getName fsItem)
                    Nothing
                    False
                    True
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
                        config.addLog
                        log
                        Nothing
                        False
                        True
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
                        config.addLog
                        "Echec requête"
                        (Just <| httpErrorToString e)
                        True
                        True
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
                        |> Cmd.map model.externalMsg
                    , Nothing
                    )

        FilesRequested fsItem ->
            ( model
            , Cmd.map model.externalMsg (selectFiles fsItem)
            , Nothing
            )

        FilesSelected fsItem first remaining ->
            let
                files =
                    first :: remaining
            in
            ( { model
                | filesToUpload =
                    List.map (\f -> ( File.name f, f )) files
                        |> Dict.fromList
                , uploadProgress =
                    List.map (\f -> ( File.name f, ( 0, File.size f, Nothing ) )) files
                        |> Dict.fromList
                , bulkUploadState = BUUpload
              }
            , Cmd.map model.externalMsg <|
                Cmd.batch
                    (List.map (\f -> cmdIfLogged config.logInfo (uploadFile fsItem f)) files)
            , Nothing
            )

        ManualFileUpload s ->
            case Dict.get s model.filesToUpload of
                Just f ->
                    ( { model
                        | uploadProgress =
                            Dict.insert s
                                ( 0
                                , File.size f
                                , Nothing
                                )
                                model.uploadProgress
                      }
                    , case ( config.logInfo, Maybe.map extractFsItem (getCurrentFilesys Full model) ) of
                        ( LoggedIn info, Just fsItem ) ->
                            Cmd.map model.externalMsg <|
                                uploadFile
                                    fsItem
                                    f
                                    info.sessionId

                        _ ->
                            Cmd.none
                    , Nothing
                    )

                _ ->
                    ( model
                    , Cmd.none
                    , Nothing
                    )

        ------------------------
        -- Image bulk uploads --
        ------------------------
        ImagesRequested ->
            ( model
            , Cmd.map model.externalMsg selectImages
            , Nothing
            )

        ImagesSelected first remaining ->
            let
                files =
                    first :: remaining

                fileSizes =
                    List.foldr
                        (\( n, f ) acc ->
                            Dict.insert
                                (File.name f)
                                (File.size f)
                                acc
                        )
                        model.fileSizes
                        (List.indexedMap (\n f -> ( n, f )) files)
            in
            ( { model
                | fileSizes = fileSizes
                , processingQueue =
                    List.indexedMap
                        (\n f -> ( File.name f, f ))
                        remaining
              }
            , Task.perform
                (Base64Img (File.name first))
                (File.toUrl first)
                |> Cmd.map model.externalMsg
            , Nothing
            )

        Base64Img filename data ->
            ( { model
                | bulkImageUploaderState = ImageProcessing
              }
            , processCmd model filename data
            , Nothing
            )

        ImageProcessed json ->
            case Decode.decodeValue decodeProcessedData json of
                Ok ({ content, filename } as pi) ->
                    let
                        ( cmd, processingQueue ) =
                            case model.processingQueue of
                                [] ->
                                    ( Cmd.none, [] )

                                ( filename_, file ) :: rest ->
                                    ( Task.perform
                                        (Base64Img filename_)
                                        (File.toUrl file)
                                        |> Cmd.map model.externalMsg
                                    , rest
                                    )
                    in
                    ( { model
                        | processingQueue = processingQueue
                        , processedPics =
                            Dict.insert filename pi model.processedPics
                      }
                    , cmd
                    , Nothing
                    )

                _ ->
                    ( model
                    , Cmd.none
                    , Nothing
                    )

        SetImageSize size ->
            ( { model | bulkImageUploadSize = size }
            , Cmd.none
            , Nothing
            )

        Reset ->
            ( { model
                | processedPics = Dict.empty
                , fileSizes = Dict.empty
                , processingQueue = []
                , bulkImageUploaderState = Home
                , bulkUploadState = BUHome
                , uploadProgress = Dict.empty
              }
            , Cmd.batch
                (List.map Http.cancel (Dict.keys model.uploadProgress))
                |> Cmd.map model.externalMsg
            , Nothing
            )

        ManualUpload s ->
            case Dict.get s model.processedPics of
                Just p ->
                    ( { model
                        | uploadProgress =
                            Dict.insert s
                                ( 0
                                , p.size
                                , Nothing
                                )
                                model.uploadProgress
                      }
                    , case ( config.logInfo, Maybe.map extractFsItem (getCurrentFilesys Full model) ) of
                        ( LoggedIn info, Just fsItem ) ->
                            Cmd.map model.externalMsg <|
                                uploadImageAuto
                                    fsItem
                                    p.filename
                                    p.content
                                    info.sessionId

                        _ ->
                            Cmd.none
                    , Nothing
                    )

                _ ->
                    ( model
                    , Cmd.none
                    , Nothing
                    )

        GoToUpload ->
            ( { model
                | bulkImageUploaderState = Upload
                , uploadProgress =
                    Dict.map
                        (\_ p ->
                            ( 0
                            , p.size
                            , Nothing
                            )
                        )
                        model.processedPics
              }
            , case ( config.logInfo, Maybe.map extractFsItem (getCurrentFilesys Full model) ) of
                ( LoggedIn info, Just fsItem ) ->
                    Cmd.map model.externalMsg <|
                        Cmd.batch
                            (Dict.foldr
                                (\k v acc ->
                                    uploadImageAuto
                                        fsItem
                                        v.filename
                                        v.content
                                        info.sessionId
                                        :: acc
                                )
                                []
                                model.processedPics
                                |> List.reverse
                            )

                _ ->
                    Cmd.none
            , Nothing
            )

        GotProgress filename progress ->
            case progress of
                Sending { sent, size } ->
                    ( { model
                        | uploadProgress =
                            Dict.update
                                filename
                                (\mv ->
                                    case mv of
                                        Nothing ->
                                            Nothing

                                        Just ( _, _, us ) ->
                                            Just ( sent, size, us )
                                )
                                model.uploadProgress
                      }
                    , Cmd.none
                    , Nothing
                    )

                Receiving { received, size } ->
                    ( model
                    , Cmd.none
                    , Nothing
                    )

        Uploaded filename res ->
            case res of
                Ok UploadSuccessful ->
                    let
                        newUploadProgress =
                            Dict.update
                                filename
                                (\mv ->
                                    case mv of
                                        Nothing ->
                                            Nothing

                                        Just ( sent, size, _ ) ->
                                            Just ( sent, size, Just UploadSuccessful )
                                )
                                model.uploadProgress

                        uploadDone =
                            Dict.values newUploadProgress
                                |> List.filter (\( _, _, s ) -> s == Just UploadSuccessful)
                                |> (\xs -> List.length xs == Dict.size newUploadProgress)
                    in
                    ( { model
                        | uploadProgress =
                            newUploadProgress
                      }
                    , if uploadDone then
                        cmdIfLogged
                            config.logInfo
                            (getFileList
                                model.root
                                (Dict.keys newUploadProgress)
                            )
                            |> Cmd.map model.externalMsg

                      else
                        Cmd.none
                    , Nothing
                    )

                Ok (UploadFailure e) ->
                    ( { model
                        | uploadProgress =
                            Dict.update
                                filename
                                (\mv ->
                                    case mv of
                                        Nothing ->
                                            Nothing

                                        Just ( sent, size, _ ) ->
                                            Just ( sent, size, Just <| UploadFailure e )
                                )
                                model.uploadProgress
                      }
                    , Cmd.none
                    , Nothing
                    )

                Err e ->
                    ( { model
                        | uploadProgress =
                            Dict.update
                                filename
                                (\mv ->
                                    case mv of
                                        Nothing ->
                                            Nothing

                                        Just ( sent, size, _ ) ->
                                            Just ( sent, size, Just <| UploadFailure (httpErrorToString e) )
                                )
                                model.uploadProgress
                      }
                    , Cmd.none
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
                , bulkImageUploaderState = Home
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
                                    ((saveButtonStyle <| model.cutBuffer /= Nothing)
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
                        [ Input.button ((deleteButtonStyle <| True) ++ [ Element.alignLeft ])
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

                --, column
                --    [ width (px 80)
                --    , clip
                --    , Font.size 12
                --    , paddingXY 0 5
                --    , Background.color (rgb255 121 51 123)
                --    , alignTop
                --    ]
                --    (List.map
                --        (\l ->
                --            el
                --                [ centerX
                --                , alignTop
                --                ]
                --                (text l)
                --        )
                --        (prettyName3 name 10)
                --    )
                , paragraph
                    [ width (px 80)
                    , height (px 55)
                    , clip
                    , Font.size 12
                    , paddingXY 0 5
                    , Font.center
                    , htmlAttribute <| HtmlAttr.style "word-wrap" "break-word"
                    ]
                    [ text name ]

                --    --<|
                --    --    prettyName3 name 10
                --    ]
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
                    , height (px 55)
                    , clip
                    , Font.size 12
                    , Font.center
                    , paddingXY 0 5
                    , htmlAttribute <| HtmlAttr.style "word-wrap" "break-word"
                    ]
                    [ text name ]

                --<| prettyName3 name 10 ]
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


bulkUploadView_ :
    { a
        | logInfo : LogInfo
    }
    -> Model msg
    -> Element Msg
bulkUploadView_ config model =
    let
        canEdit =
            model.uploadProgress
                |> Dict.foldr
                    (\_ ( _, _, us ) acc -> us :: acc)
                    []
                |> List.all (\us -> us == Just UploadSuccessful)

        progress ( sent, size, us ) =
            let
                p =
                    floor <| 100 * toFloat sent / toFloat size
            in
            if us == Just UploadSuccessful then
                100

            else
                min 99 p

        progressTotal =
            Dict.foldr
                (\k ( sent, size, _ ) ( totalSent, totalSize ) ->
                    ( sent + totalSent, size + totalSize )
                )
                ( 0, 0 )
                model.uploadProgress
                |> (\( tsent, tsize ) -> 100 * toFloat tsent / toFloat tsize)
                |> round
                |> (\t ->
                        if canEdit then
                            100

                        else
                            min 99 t
                   )
    in
    column
        [ spacing 15 ]
        [ column
            (itemStyle
                ++ [ width fill
                   , spacing 15
                   ]
            )
            ([ el
                [ Font.bold
                , Font.size 18
                ]
                (text "Mise en ligne")
             , row
                [ spacing 25 ]
                [ el [ width (px 140) ]
                    (text "Transfert fichier(s): ")
                , progressBar progressTotal --(Debug.log "total" progressTotal)
                ]
             ]
                ++ (Dict.map
                        (\filename ( sent, size, uploadStatus ) ->
                            row
                                [ spacing 15 ]
                                [ column
                                    [ alignTop
                                    , spacing 10
                                    ]
                                    [ el [ Font.color teal1 ] (text filename)
                                    , row
                                        [ spacing 15 ]
                                        [ case uploadStatus of
                                            Just (UploadFailure e) ->
                                                row
                                                    [ spacing 5 ]
                                                    [ text "Echec transfert: "
                                                    , el
                                                        [ Font.color (rgb255 217 83 79) ]
                                                        (text e)
                                                    ]

                                            _ ->
                                                text <|
                                                    "Transfert: "
                                                        ++ (progress ( sent, size, uploadStatus )
                                                                |> String.fromInt
                                                                |> String.padLeft 2 '0'
                                                                |> strCons "%"
                                                           )
                                        , case uploadStatus of
                                            Just (UploadFailure e) ->
                                                Input.button
                                                    (buttonStyle True)
                                                    { onPress = Just (ManualFileUpload filename)
                                                    , label = text "Réessayer"
                                                    }

                                            Just UploadSuccessful ->
                                                okMark

                                            _ ->
                                                Element.none
                                        ]
                                    ]
                                ]
                        )
                        model.uploadProgress
                        |> Dict.values
                   )
            )
        , row
            (itemStyle
                ++ [ spacing 15
                   , width fill
                   ]
            )
            [ Input.button
                (buttonStyle True)
                { onPress = Just Reset
                , label = text "Retour"
                }
            ]
        ]


bulkImageUploadView_ :
    { a
        | logInfo : LogInfo
    }
    -> Model msg
    -> Element Msg
bulkImageUploadView_ config model =
    let
        canEdit =
            model.uploadProgress
                |> Dict.foldr
                    (\_ ( _, _, us ) acc -> us :: acc)
                    []
                |> List.all (\us -> us == Just UploadSuccessful)

        progress ( sent, size, us ) =
            let
                p =
                    floor <| 100 * toFloat sent / toFloat size
            in
            if us == Just UploadSuccessful then
                100

            else
                min 99 p

        progressTotal =
            Dict.foldr
                (\k ( sent, size, _ ) ( totalSent, totalSize ) ->
                    ( sent + totalSent, size + totalSize )
                )
                ( 0, 0 )
                model.uploadProgress
                |> (\( tsent, tsize ) -> 100 * toFloat tsent / toFloat tsize)
                |> round
                |> (\t ->
                        if canEdit then
                            100

                        else
                            min 99 t
                   )
    in
    column
        [ spacing 15 ]
        [ column
            (itemStyle
                ++ [ width fill
                   , spacing 15
                   ]
            )
            ([ el
                [ Font.bold
                , Font.size 18
                ]
                (text "Mise en ligne")
             , row
                [ spacing 25 ]
                [ el [ width (px 140) ]
                    (text "Transfert image(s): ")
                , progressBar progressTotal
                ]
             ]
                ++ List.map
                    (\p ->
                        row
                            [ spacing 15 ]
                            [ el
                                [ padding 5
                                , Background.color grey6
                                , Border.rounded 5
                                ]
                                (el
                                    [ width (px 140)
                                    , height (px 105)
                                    , centerX
                                    , Background.uncropped p.content
                                    , Element.alignLeft
                                    ]
                                    Element.none
                                )
                            , column
                                [ alignTop
                                , spacing 10
                                ]
                                [ el [ Font.color teal1 ] (text p.filename)
                                , text <|
                                    "Taille originale: "
                                        ++ (Dict.get p.filename model.fileSizes
                                                |> Maybe.map Filesize.format
                                                |> Maybe.withDefault "Erreur"
                                           )
                                , text <|
                                    "Nouvelle taille: "
                                        ++ Filesize.format p.size
                                , row
                                    [ spacing 15 ]
                                    [ case Dict.get p.filename model.uploadProgress of
                                        Just ( _, _, Just (UploadFailure e) ) ->
                                            row
                                                [ spacing 5 ]
                                                [ text "Echec transfert: "
                                                , el
                                                    [ Font.color (rgb255 217 83 79) ]
                                                    (text e)
                                                ]

                                        _ ->
                                            text <|
                                                "Transfert: "
                                                    ++ (Dict.get p.filename model.uploadProgress
                                                            |> Maybe.map progress
                                                            |> Maybe.withDefault 0
                                                            |> String.fromInt
                                                            |> String.padLeft 2 '0'
                                                            |> strCons "%"
                                                       )
                                    , case Dict.get p.filename model.uploadProgress of
                                        Just ( _, _, Just (UploadFailure e) ) ->
                                            Input.button
                                                (buttonStyle True)
                                                { onPress = Just (ManualUpload p.filename)
                                                , label = text "Réessayer"
                                                }

                                        Just ( _, _, Just UploadSuccessful ) ->
                                            okMark

                                        _ ->
                                            Element.none
                                    ]
                                ]
                            ]
                    )
                    (Dict.values model.processedPics)
            )
        , row
            (itemStyle
                ++ [ spacing 15
                   , width fill
                   ]
            )
            [ Input.button
                (buttonStyle True)
                { onPress = Just Reset
                , label = text "Retour"
                }
            ]
        ]


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
                            (text "Mise à l'échelle automatique")
                        , Input.option
                            RegUpload
                            (text "Mise à l'échelle manuelle")
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
                            , bulkImageUploadView
                            ]

                    RegUpload ->
                        imageControllerView config model model.imageControllerMode
                ]

        bulkImageUploadView =
            column
                [ spacing 15 ]
                [ case model.bulkImageUploaderState of
                    Home ->
                        column
                            [ spacing 15 ]
                            [ Input.radioRow
                                [ spacing 15 ]
                                { onChange =
                                    SetImageSize
                                , options =
                                    [ Input.option
                                        News
                                        (text "image(s) actualités")
                                    , Input.option
                                        BlockLinks
                                        (text "image(s) bloc de liens")
                                    , Input.option
                                        Fiches
                                        (text "image(s) fiches")
                                    , Input.option
                                        Regular
                                        (text "image(s) page")
                                    ]
                                , selected =
                                    Just model.bulkImageUploadSize
                                , label = Input.labelLeft [] Element.none
                                }
                            , row
                                [ spacing 15 ]
                                [ Input.button
                                    (buttonStyle True)
                                    { onPress = Just ToogleUploadView
                                    , label = text "Retour"
                                    }
                                , Input.button
                                    (buttonStyle True)
                                    { onPress =
                                        Just ImagesRequested
                                    , label = text "Choix fichiers"
                                    }
                                ]
                            ]

                    Upload ->
                        bulkImageUploadView_ config model

                    ImageProcessing ->
                        imageProcessingView config model
                ]

        bulkUploadView =
            column
                [ spacing 15 ]
                [ case model.bulkUploadState of
                    BUHome ->
                        column
                            [ spacing 15 ]
                            [ row
                                [ spacing 15 ]
                                [ Input.button
                                    (buttonStyle True)
                                    { onPress = Just ToogleUploadView
                                    , label = text "Retour"
                                    }
                                , Input.button
                                    (buttonStyle True)
                                    { onPress =
                                        Maybe.map extractFsItem (getCurrentFilesys config.mode model)
                                            |> Maybe.map FilesRequested
                                    , label = text "Choix fichiers"
                                    }
                                ]
                            ]

                    BUUpload ->
                        bulkUploadView_ config model
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
        [ case modeRoot config.mode model.root of
            ImagesRoot ->
                imagesUploadView

            DocsRoot ->
                column
                    [ spacing 15 ]
                    [ text "Mettre des documents en ligne: "
                    , bulkUploadView
                    ]
        ]



-------------------------------------------------------------------------------


imageProcessingView :
    { a
        | logInfo : LogInfo
    }
    -> Model msg
    -> Element Msg
imageProcessingView config model =
    let
        canUpload =
            Dict.size model.fileSizes
                == Dict.size model.processedPics
    in
    column
        [ spacing 15 ]
        [ column
            (itemStyle
                ++ [ width fill
                   , spacing 15
                   ]
            )
            [ el
                []
                (text "Chargement et mise à  l'échelle des images...")
            , row
                [ spacing 15 ]
                [ el []
                    ((Dict.size model.processedPics
                        |> String.fromInt
                        |> String.padLeft 2 '0'
                     )
                        |> strCons " \\ "
                        |> (Dict.size model.fileSizes
                                |> String.fromInt
                                |> String.padLeft 2 '0'
                                |> strCons
                           )
                        |> text
                    )
                , if canUpload then
                    okMark

                  else
                    Element.none
                ]
            ]
        , row
            (itemStyle
                ++ [ spacing 15
                   , width fill
                   ]
            )
            [ Input.button
                (buttonStyle True)
                { onPress = Just Reset
                , label = text "Annuler"
                }
            , Input.button
                (buttonStyle canUpload)
                { onPress =
                    if canUpload then
                        Just GoToUpload

                    else
                        Nothing
                , label = text "Continuer"
                }
            ]
        ]



-------------------------------------------------------------------------------


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
                    , Input.button (saveButtonStyle True)
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
                    "Chargement info fichier réussi"
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


uploadImageAuto : FsItem -> String -> String -> String -> Cmd Msg
uploadImageAuto fsItem filename contents sessionId =
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
    Http.request
        { method = "POST"
        , headers = []
        , url = "uploadBase64PicAuto.php"
        , body = body
        , expect =
            Http.expectJson (Uploaded filename) decodeUploadStatus
        , timeout = Nothing --Just (120 * 1000)
        , tracker = Just filename
        }


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


uploadFile : FsItem -> File -> String -> Cmd Msg
uploadFile fsItem file sessionId =
    let
        uploadPath =
            getPath fsItem
                |> List.tail
                |> Maybe.map (String.join "/")
                |> Maybe.map
                    (\p ->
                        p ++ "/"
                    )
                |> Maybe.withDefault ""

        filename =
            File.name file

        body =
            Http.multipartBody
                [ Http.filePart "file" file
                , Http.stringPart "uploadPath" uploadPath
                , Http.stringPart "sessionId" sessionId
                ]
    in
    Http.request
        { method = "POST"
        , headers = []
        , url = "uploadDoc.php"
        , body = body
        , expect =
            Http.expectJson (Uploaded filename) decodeUploadStatus
        , timeout = Nothing --Just (120 * 1000)
        , tracker = Just filename
        }


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


type alias ProcessedImage =
    { filename : String
    , content : String
    , size : Int
    , width : Int
    , height : Int
    }


decodeProcessedData : Decode.Decoder ProcessedImage
decodeProcessedData =
    Decode.map5 ProcessedImage
        (Decode.field "filename" Decode.string)
        (Decode.field "content" Decode.string)
        (Decode.field "size" Decode.int)
        (Decode.field "width" Decode.int)
        (Decode.field "height" Decode.int)


selectImages : Cmd Msg
selectImages =
    Select.files [ "image/png", "image/jpeg" ] ImagesSelected


selectFiles : FsItem -> Cmd Msg
selectFiles fsItem =
    Select.files [] (FilesSelected fsItem)


processCmd model filename data =
    let
        ( w, h ) =
            case model.bulkImageUploadSize of
                News ->
                    ( 266, 200 )

                BlockLinks ->
                    ( 300, 225 )

                Fiches ->
                    ( 440, 320 )

                Regular ->
                    ( 800, 600 )
    in
    Cmd.map model.externalMsg
        (toFileExplorerImageProcessor <|
            Encode.object
                [ ( "imageData", Encode.string data )
                , ( "filename", Encode.string filename )
                , ( "maxHeight", Encode.int h )
                , ( "maxWidth", Encode.int w )
                , ( "needThumb", Encode.bool False )
                ]
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


prettyName3 : String -> Int -> List String
prettyName3 name n =
    let
        wds =
            String.words name

        liner done buffer rest =
            case rest of
                [] ->
                    done ++ [ String.join " " buffer ]

                w :: ws ->
                    if String.length (String.join " " (buffer ++ [ w ])) > n then
                        liner (done ++ [ String.join " " buffer ]) [ w ] ws

                    else
                        liner (done ++ [ String.join " " (buffer ++ [ w ]) ]) [] ws

        lines =
            liner [] [] wds
    in
    if List.length lines <= 3 then
        lines

    else
        case List.take 3 lines of
            a :: b :: c :: _ ->
                if String.length c >= n then
                    a
                        :: b
                        :: [ String.left n c ++ "..." ]
                    --|> String.join "\n"

                else
                    a
                        :: b
                        :: [ c ++ "..." ]

            --|> String.join "\n"
            otherwise ->
                []


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


itemStyle : List (Attribute msg)
itemStyle =
    [ padding 15
    , Background.color grey7
    , Border.rounded 5
    ]
