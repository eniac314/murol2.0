port module FileExplorer.FileExplorer exposing (..)

import Auth.AuthPlugin exposing (LogInfo(..))
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Lazy as Lazy
import Filesize exposing (format)
import Html.Attributes as HtmlAttr
import Html.Events exposing (preventDefaultOn)
import Http exposing (..)
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.Icons as Icons exposing (..)
import Internals.ToolHelpers exposing (..)
import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode
import String.Extra exposing (..)
import Task exposing (..)
import Time exposing (..)


type alias Model msg =
    { renameBuffer : String
    , root : Root
    , displayMode : DisplayMode
    , externalMsg : Msg -> msg
    , mbFilesys : Maybe Filesys
    , lastLocation : Maybe FsItem
    , selectedFsItem : Maybe FsItem
    , logs : List Log
    , loadingSatus : ToolLoadingSatus
    }


subscriptions model =
    Sub.map model.externalMsg <|
        --Sub.batch [ Time.every 1000 CheckLogInfo ]
        Sub.batch []


type Root
    = ImagesRoot
    | DocsRoot


type DisplayMode
    = ReadOnly
    | ReadWrite


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


init root displayMode externalMsg =
    { renameBuffer = ""
    , root = root
    , displayMode = displayMode
    , externalMsg = externalMsg
    , mbFilesys = Nothing
    , lastLocation = Nothing
    , selectedFsItem = Nothing
    , logs = []
    , loadingSatus = ToolLoadingWaiting
    }


load model logInfo =
    case logInfo of
        LoggedIn { sessionId } ->
            Cmd.map model.externalMsg (getFileList model.root sessionId)

        LoggedOut ->
            Cmd.none


loadingStatus model =
    model.loadingSatus


loadingView model =
    toolLoadingView "Chargement Explorateur de fichiers: " model


type Msg
    = GoHome
    | GoNext
    | GoPrev
    | GoTo Path
    | SelectFsItem FsItem
    | NewFile
    | NewFolder
    | Delete
    | Rename String
    | Refresh
    | SetRoot Root
    | CheckLogInfo Time.Posix
    | RefreshFilesys Root (Result Http.Error (List FsItem))
    | AddLog (Posix -> Log) Posix
    | NoOp



-------------------------------------------------------------------------------
------------
-- Update --
------------


update config msg model =
    let
        ( newModel, cmds, mbPluginAction ) =
            internalUpdate config msg model
    in
    ( newModel, Cmd.map model.externalMsg cmds, mbPluginAction )


internalUpdate config msg model =
    case msg of
        GoHome ->
            ( { model
                | mbFilesys =
                    let
                        newFilesys =
                            model.mbFilesys
                                |> Maybe.map rewindFilesys
                    in
                    case newFilesys of
                        Nothing ->
                            model.mbFilesys

                        otherwise ->
                            otherwise
                , lastLocation =
                    Maybe.map extractFsItem model.mbFilesys
              }
            , Cmd.none
            , Nothing
            )

        GoNext ->
            case model.lastLocation of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just fsItem ->
                    ( { model
                        | mbFilesys =
                            model.mbFilesys
                                |> Maybe.map rewindFilesys
                                |> Maybe.map
                                    (zipToFsItem (getPath fsItem))
                                |> Maybe.withDefault model.mbFilesys
                        , lastLocation = Nothing
                      }
                    , Cmd.none
                    , selectedFilename model
                    )

        GoPrev ->
            ( { model
                | mbFilesys =
                    case Maybe.andThen zipUpFilesys model.mbFilesys of
                        Nothing ->
                            model.mbFilesys

                        otherwise ->
                            otherwise
                , lastLocation =
                    Maybe.map extractFsItem model.mbFilesys
              }
            , Cmd.none
            , selectedFilename model
            )

        SelectFsItem fsItem ->
            ( { model | selectedFsItem = Just fsItem }
            , Cmd.none
            , selectedFilename model
            )

        GoTo path ->
            ( { model
                | mbFilesys =
                    model.mbFilesys
                        |> Maybe.map rewindFilesys
                        |> Maybe.map
                            (zipToFsItem path)
                        |> Maybe.withDefault model.mbFilesys
                , lastLocation =
                    Maybe.map extractFsItem model.mbFilesys
              }
            , Cmd.none
            , selectedFilename model
            )

        NewFile ->
            ( model, Cmd.none, Nothing )

        NewFolder ->
            ( model, Cmd.none, Nothing )

        Delete ->
            ( { model
                | mbFilesys =
                    Maybe.map
                        delete
                        model.mbFilesys
                        |> Maybe.withDefault model.mbFilesys
                , lastLocation = Nothing
              }
            , Cmd.none
            , selectedFilename model
            )

        Rename newName ->
            ( model, Cmd.none, Nothing )

        SetRoot root ->
            ( { model | root = root }
            , case config.logInfo of
                LoggedIn { sessionId } ->
                    getFileList root sessionId

                LoggedOut ->
                    Cmd.none
            , Nothing
            )

        CheckLogInfo _ ->
            case config.logInfo of
                LoggedOut ->
                    ( { model | mbFilesys = Nothing }, Cmd.none, Nothing )

                LoggedIn { sessionId } ->
                    case model.mbFilesys of
                        Nothing ->
                            ( model
                            , getFileList model.root sessionId
                            , Nothing
                            )

                        _ ->
                            ( model, Cmd.none, Nothing )

        Refresh ->
            ( model
            , case config.logInfo of
                LoggedIn { sessionId } ->
                    getFileList model.root sessionId

                LoggedOut ->
                    Cmd.none
            , Nothing
            )

        RefreshFilesys root res ->
            case res of
                Ok fs ->
                    ( { model
                        | mbFilesys =
                            case root of
                                ImagesRoot ->
                                    List.foldr (\f acc -> insert f "images" acc) Nothing fs
                                        |> Maybe.map initFileSys

                                DocsRoot ->
                                    List.foldr (\f acc -> insert f "baseDocumentaire" acc) Nothing fs
                                        |> Maybe.map initFileSys
                        , lastLocation = Nothing
                        , loadingSatus = ToolLoadingSuccess
                      }
                    , Cmd.none
                    , Nothing
                    )

                Err e ->
                    ( { model | loadingSatus = ToolLoadingFailure (httpErrorToString e) }
                    , Cmd.none
                    , Nothing
                    )

        AddLog l t ->
            ( { model | logs = l t :: model.logs }
            , Cmd.none
            , Nothing
            )

        NoOp ->
            ( model, Cmd.none, Nothing )


newLog : String -> Maybe String -> Bool -> Cmd Msg
newLog message details isError =
    Task.perform
        (AddLog (Log message details isError))
        Time.now


selectedFilename : Model msg -> Maybe FsItem
selectedFilename { mbFilesys } =
    mbFilesys
        |> Maybe.andThen
            (Just << extractFsItem)



-------------------------------------------------------------------------------
-----------------------------
-- Http and Json functions --
-----------------------------


getFileList : Root -> String -> Cmd Msg
getFileList root sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                , case root of
                    ImagesRoot ->
                        ( "root"
                        , Encode.string "images"
                        )

                    DocsRoot ->
                        ( "root"
                        , Encode.string "baseDocumentaire"
                        )
                ]
                |> Http.jsonBody

        decoder =
            case root of
                ImagesRoot ->
                    decodeImages

                DocsRoot ->
                    decodeDocs

        request =
            Http.post "getFiles.php" body decodeImages
    in
    Http.send (RefreshFilesys root) request


decodeImages =
    Decode.list decodeFile


decodeDocs =
    Decode.list decodeFile


decodeFile =
    Decode.succeed
        (\p f mbImgSize mbFs ->
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
        |> Pipeline.required "path" Decode.string
        |> Pipeline.required "name" Decode.string
        |> Pipeline.required "imgSize"
            (Decode.nullable <|
                Decode.map2
                    (\w h -> { width = w, height = h })
                    (Decode.field "width" Decode.int)
                    (Decode.field "height" Decode.int)
            )
        |> Pipeline.required "fileSize" (Decode.nullable Decode.int)



-------------------------------------------------------------------------------
--------------------
-- View functions --
--------------------


view config model =
    Element.map model.externalMsg <|
        column
            [ spacing 20
            , Font.size 16
            , Font.family
                [ Font.monospace ]
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
                , filesysView config model
                ]
            ]


mainInterface config model =
    let
        iconSize =
            22
    in
    row
        [ spacing 15
        , width fill
        ]
        [ Input.button
            (toogleButtonStyle (model.root == DocsRoot) True
             --++ [ Background.color (rgba 0.3 0.4 0.6 0.5) ]
            )
            { onPress =
                Just <| SetRoot DocsRoot
            , label =
                row [ spacing 10 ]
                    [ html <| Icons.folder iconSize
                    ]
            }
        , Input.button
            (toogleButtonStyle (model.root == ImagesRoot) True
             --++ [ Background.color (rgba 0.3 0.4 0.6 0.5) ]
            )
            { onPress =
                Just <| SetRoot ImagesRoot
            , label =
                row [ spacing 10 ]
                    [ html <| Icons.imageIcon iconSize
                    ]
            }
        , Input.button (buttonStyle True)
            { onPress =
                Just <| GoPrev
            , label =
                row [ spacing 10 ]
                    [ html <| Icons.chevronLeft iconSize
                    ]
            }
        , Input.button (buttonStyle (model.lastLocation /= Nothing))
            { onPress =
                if model.lastLocation /= Nothing then
                    Just <| GoNext
                else
                    Nothing
            , label =
                row [ spacing 10 ]
                    [ html <| Icons.chevronRight iconSize
                    ]
            }
        , Input.button (buttonStyle True)
            { onPress =
                Just <| GoHome
            , label =
                row [ spacing 10 ]
                    [ html <| Icons.home iconSize
                    ]
            }
        , clickablePath config model
        ]


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
                [ Events.onClick (GoTo p)
                , paddingXY 2 5
                , pointer
                , mouseOver
                    [ Font.color (rgba 0.3 0.4 0.6 0.5) ]
                ]
                (text f)
    in
    wrappedRow
        [ width fill ]
        (Maybe.map extractFsItem model.mbFilesys
            |> Maybe.map getPath
            |> Maybe.withDefault []
            |> List.reverse
            |> getEveryPaths []
            |> List.map fsItemView
            |> List.intersperse (text "/")
            |> (\res -> text "/" :: res)
        )


sidePanelView config model =
    let
        imagePreviewPanel meta imgSize =
            column
                [ width (px 300)
                , spacing 15
                , centerX
                ]
                [ el
                    [ width (px 250)
                    , height (px 250)
                    , Background.color
                        (rgb 0.95 0.95 0.95)
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
                , text <|
                    prettyName meta.name 20
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
                ]

        folderInfoPanel fsItem =
            el [ Font.center ]
                (text <| Filesize.format (computeSize fsItem))

        regFilePreviewPanel meta =
            Element.none

        noSelectionControlsPanel =
            column []
                [ text "controls coming soon!" ]
    in
    column
        [ width (px 330)
        , padding 15
        , alignTop
        ]
        [ case model.selectedFsItem of
            Nothing ->
                noSelectionControlsPanel

            Just fsItem ->
                case fsItem of
                    Folder meta _ ->
                        folderInfoPanel fsItem

                    File meta ->
                        case meta.fileType of
                            ImageFile imgSize ->
                                imagePreviewPanel meta imgSize

                            RegFile ->
                                regFilePreviewPanel meta
        ]


filesysView config model =
    let
        fileView file { name, path, fileType } =
            column
                [ pointer
                , padding 7
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
                , Events.onClick (SelectFsItem file)
                , alignTop
                ]
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
                [ padding 7
                , pointer
                , Border.rounded 5
                , mouseOver
                    (case Maybe.map (\fsItem -> getPath fsItem == path) model.selectedFsItem of
                        Just True ->
                            []

                        _ ->
                            [ Background.color (rgba 0.3 0.4 0.6 0.3) ]
                    )
                , htmlAttribute <| HtmlAttr.style "transition" "0.1s"
                , Events.onClick (SelectFsItem folder)
                , onDoubleClick (GoTo path)
                , alignTop
                , case Maybe.map (\fsItem -> getPath fsItem == path) model.selectedFsItem of
                    Just True ->
                        Background.color (rgba 0.3 0.4 0.6 0.5)

                    _ ->
                        noAttr
                ]
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
    case model.mbFilesys of
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



-------------------------------------------------------------------------------
----------------------
-- Filesys functions--
----------------------


fsItemToElement model config fsItem =
    let
        iEv handler msg =
            handler (model.externalMsg msg)

        paddingOffset n =
            paddingEach
                { top = 0
                , left = n * 10
                , right = 0
                , bottom = 0
                }

        helper offset f =
            case f of
                File { name, path } ->
                    [ row
                        [ paddingOffset offset
                        , spacing 10
                        ]
                        [ el
                            [ Font.bold
                            , iEv
                                Events.onClick
                                (GoTo path)
                            ]
                            (text name)
                        , el
                            [ Font.size 14
                            , Font.color (rgb 0.7 0.7 0.7)
                            ]
                            (text <| String.join "/" path)
                        ]
                    ]

                Folder { name, path } children ->
                    [ row
                        [ paddingOffset offset
                        , spacing 10
                        ]
                        [ el
                            [ Font.bold
                            , Font.color (rgba 0 0 1 0.5)
                            , iEv
                                Events.onClick
                                (GoTo path)
                            ]
                            (text name)
                        , el
                            [ Font.size 14
                            , Font.color (rgb 0.7 0.7 0.7)
                            ]
                            (text <| String.join "/" path)
                        ]
                    ]
                        ++ List.concatMap (helper (offset + 4)) children
    in
    column
        [ spacing 10 ]
        (helper 0 fsItem)


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
    --Debug.log "running zipUp" <|
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


computeSize : FsItem -> Int
computeSize fsItem =
    case fsItem of
        File { fileSize } ->
            Maybe.withDefault 0 fileSize

        Folder _ children ->
            List.foldr (\f acc -> acc + computeSize f) 0 children


insert : FsItem -> String -> Maybe FsItem -> Maybe FsItem
insert f rootName mbFsItem_ =
    -- NOTE: permet de de construire un syteme de fichiers à partir
    -- d'une liste de fichiers/repertoires vides et de leur chemins
    -- d'accès. L'odre d'insertion n'est pas important, la fonction
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
                            else if List.member f children then
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
