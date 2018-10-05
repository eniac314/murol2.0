module FilesysPlugin exposing (..)

import AuthPlugin exposing (LogInfo(..))
import Browser exposing (element)
import DocumentEditorHelpers exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Lazy as Lazy
import Html.Attributes as HtmlAttr
import Html.Events exposing (preventDefaultOn)
import Http exposing (..)
import Icons exposing (..)
import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode
import String.Extra exposing (..)


type alias Model msg =
    { renameBuffer : String
    , root : Root
    , displayMode : DisplayMode
    , externalMsg : Msg -> msg
    , mbFilesys : Maybe Filesys
    , lastLocation : Path
    , selectedFsItem : Path
    , error : String
    }


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
    }


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


init root displayMode logInfo externalMsg =
    ( { renameBuffer = ""
      , root = root
      , displayMode = displayMode
      , externalMsg = externalMsg
      , mbFilesys = Nothing
      , lastLocation = []
      , selectedFsItem = []
      , error = ""
      }
    , case logInfo of
        LoggedIn { sessionId } ->
            Cmd.map externalMsg (getFileList root sessionId)

        LoggedOut ->
            Cmd.none
    )


type Msg
    = GoHome
    | GoNext
    | GoPrev
    | GoTo Path
    | SelectFsItem Path
    | NewFile
    | NewFolder
    | Delete
    | Rename String
    | Refresh
    | RefreshFilesys Root (Result Http.Error (List FsItem))
    | NoOp


update config msg model =
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
                        |> Maybe.map getPath
                        |> Maybe.withDefault []
              }
            , Cmd.none
            , Nothing
            )

        GoNext ->
            case model.lastLocation of
                [] ->
                    ( model, Cmd.none, Nothing )

                path ->
                    ( { model
                        | mbFilesys =
                            model.mbFilesys
                                |> Maybe.map rewindFilesys
                                |> Maybe.map
                                    (zipToFsItem path)
                                |> Maybe.withDefault model.mbFilesys
                        , lastLocation = []
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
                        |> Maybe.map getPath
                        |> Maybe.withDefault []
              }
            , Cmd.none
            , selectedFilename model
            )

        SelectFsItem path ->
            ( { model | selectedFsItem = path }
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
                        |> Maybe.map getPath
                        |> Maybe.withDefault []
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
                , lastLocation = []
              }
            , Cmd.none
            , selectedFilename model
            )

        Rename newName ->
            ( model, Cmd.none, Nothing )

        Refresh ->
            ( model
            , case config.logInfo of
                LoggedIn { sessionId } ->
                    Cmd.map model.externalMsg (getFileList model.root sessionId)

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
                                    List.foldr (\f acc -> insert f "Base Documentaire" acc) Nothing fs
                                        |> Maybe.map initFileSys
                        , lastLocation = []
                      }
                    , Cmd.none
                    , Nothing
                    )

                Err e ->
                    ( { model | error = "can't refresh" }, Cmd.none, Nothing )

        NoOp ->
            ( model, Cmd.none, Nothing )


selectedFilename : Model msg -> Maybe FsItem
selectedFilename { mbFilesys } =
    mbFilesys
        |> Maybe.andThen
            (Just << extractFsItem)



--type alias FilesysConfig msg =
--    { filesys = Maybe Filesys
--    }


defFilesysConfig externalMsg =
    { fileList = dummyFiles
    , externalMsg = externalMsg
    }



--getFileList root =
--    case root of
--        ImagesRoot ->
--            Http.get "http://localhost:3000/images" decodeImages
--                |> Http.send (RefreshFilesys root)
--        _ ->
--            Cmd.none


getFileList : Root -> String -> Cmd Msg
getFileList root sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                ]
                |> Http.jsonBody

        request =
            Http.post "getFiles.php" body decodeImages
    in
    Http.send (RefreshFilesys root) request


decodeImages =
    Decode.list decodeImage


decodeImage =
    Decode.succeed
        (\p f ->
            File
                { path =
                    String.split "/" p

                --|> List.reverse
                , name = f
                }
        )
        |> Pipeline.required "path" Decode.string
        |> Pipeline.required "name" Decode.string


onDoubleClick : (Msg -> msg) -> Msg -> Attribute msg
onDoubleClick externalMsg msg =
    let
        decodeNbrClicks =
            Decode.at [ "detail" ] Decode.int

        preventIfDoubleClick n =
            if n > 1 then
                ( externalMsg msg, True )
            else
                ( externalMsg NoOp, False )
    in
    preventDefaultOn "mousedown" (Decode.map preventIfDoubleClick decodeNbrClicks)
        |> htmlAttribute


view config model =
    column
        [ spacing 20
        , Font.size 16
        , Font.family
            [ Font.monospace ]
        , alignTop
        , padding 15
        , scrollbarY
        , height (minimum config.maxHeight fill)
        , width fill
        ]
        [ mainInterface model config
        , filesysView model config

        --, model.mbFilesys
        --    --|> Maybe.map rewindFilesys
        --    |> Maybe.map extractFsItem
        --    |> Maybe.map (fsItemToElement model config)
        --    |> Maybe.withDefault (text "wrong FsItem")
        --, text <| Debug.toString <|  dummyFiles
        ]



--fsItemToElement : FilesysConfig msg -> FsItem -> Element msg
--fsItemToElement : Model ->


mainInterface model config =
    let
        iconSize =
            22
    in
    row [ spacing 15 ]
        [ Input.button (buttonStyle True)
            { onPress =
                Just <| model.externalMsg GoPrev
            , label =
                row [ spacing 10 ]
                    [ html <| Icons.chevronLeft iconSize
                    ]
            }
        , Input.button (buttonStyle (model.lastLocation /= []))
            { onPress =
                if model.lastLocation /= [] then
                    Just <| model.externalMsg GoNext
                else
                    Nothing
            , label =
                row [ spacing 10 ]
                    [ html <| Icons.chevronRight iconSize
                    ]
            }
        , Input.button (buttonStyle True)
            { onPress =
                Just <| model.externalMsg GoHome
            , label =
                row [ spacing 10 ]
                    [ html <| Icons.home iconSize
                    ]
            }
        , Input.button (buttonStyle True)
            { onPress =
                Just <| model.externalMsg Refresh
            , label =
                row [ spacing 10 ]
                    [ html <| Icons.refreshCw iconSize
                    ]
            }
        ]


filesysView model config =
    let
        iEv handler msg =
            handler (model.externalMsg msg)

        fileView { name, path } =
            case model.root of
                ImagesRoot ->
                    column
                        [ pointer
                        , padding 7
                        , mouseOver
                            (if model.selectedFsItem == path then
                                []
                             else
                                [ Background.color (rgba 0.3 0.4 0.6 0.3) ]
                            )
                        , Border.rounded 5
                        , if model.selectedFsItem == path then
                            Background.color (rgba 0.3 0.4 0.6 0.5)
                          else
                            noAttr
                        , iEv Events.onClick (SelectFsItem path)
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
                                , Background.uncropped (String.join "/" path)
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

                DocsRoot ->
                    column
                        [ padding 7 ]
                        [ el
                            [ width (px 80)
                            , height (px 80)
                            , Border.width 1
                            , Border.color (rgb 0.8 0.8 0.8)
                            , Background.color (rgb 1 1 1)
                            , iEv Events.onClick (SelectFsItem path)
                            ]
                            Element.none
                        , el
                            [ htmlAttribute <| HtmlAttr.style "word-wrap" "break-word"
                            , width (px 80)
                            ]
                            (text name)
                        ]

        folderView { name, path } =
            column
                ([ padding 7
                 , pointer
                 , Border.rounded 5
                 , mouseOver
                    (if model.selectedFsItem == path then
                        []
                     else
                        [ Background.color (rgba 0.3 0.4 0.6 0.3) ]
                    )
                 , htmlAttribute <| HtmlAttr.style "transition" "0.1s"
                 , iEv Events.onClick (SelectFsItem path)
                 , onDoubleClick model.externalMsg (GoTo path)
                 , alignTop
                 ]
                    ++ (if model.selectedFsItem == path then
                            [ Background.color (rgba 0.3 0.4 0.6 0.5)
                            ]
                        else
                            []
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
                    fileView meta

                Folder meta _ ->
                    folderView meta
    in
    case model.mbFilesys of
        Nothing ->
            text "Erreur système de fichier"

        Just filesys ->
            case extractFsItem filesys of
                File meta ->
                    fileView meta

                Folder meta contents ->
                    wrappedRow
                        [ spacing 5 ]
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
                                (Just <| Folder (Meta [ rootName ] rootName) [])

                        root :: _ ->
                            if root /= rootName then
                                Nothing
                            else
                                helper
                                    path
                                    (Just <| Folder (Meta [ rootName ] rootName) [])

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
                                                    { name = next
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


dummyFiles =
    [ File (Meta (List.reverse [ "pic1", "Folder1", "Images" ]) "pic1")
    , File (Meta (List.reverse [ "pic2", "Folder1", "Images" ]) "pic2")
    , File (Meta (List.reverse [ "pic2", "Folder1", "Images" ]) "pic2")
    , File (Meta (List.reverse [ "pic3", "Folder2", "Folder1", "Images" ]) "pic3")
    , File (Meta (List.reverse [ "test", "Folder4", "Folder2", "Folder1", "Images" ]) "test")
    , File (Meta (List.reverse [ "pic4", "Folder1", "Images" ]) "pic4")
    ]


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
