module Filesys exposing (..)

import Browser exposing (element)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input


type FsItem
    = Folder Meta (List FsItem)
    | File Meta


type alias Meta =
    { path : List String
    , name : String
    }


type alias Filesys =
    { current : FsItem
    , contexts : List Context
    }


type alias Context =
    { parent : Meta
    , left : List FsItem
    , right : List FsItem
    }


main : Program () Model Msg
main =
    Browser.element
        { init = \_ -> init Nothing
        , update =
            \model msg ->
                let
                    ( newModel, cmd, maybeOutput ) =
                        update model msg
                in
                ( newModel, cmd )
        , view = view { picListing = [] }
        , subscriptions = subscriptions
        }


type alias Model =
    { filesys : Maybe Filesys
    }


type Msg
    = GoHome
    | GoNext
    | GoPrev
    | GoTo (List String)
    | NewFile
    | NewFolder
    | Delete
    | Rename String


init mbInput =
    ( { filesys =
            List.foldr (\f acc -> insert f "Images" acc) Nothing dummyFiles
                |> Maybe.map initFileSys
      }
    , Cmd.none
    )


subscriptions model =
    Sub.batch []


update msg model =
    case msg of
        GoHome ->
            ( model, Cmd.none, Nothing )

        GoNext ->
            ( model, Cmd.none, Nothing )

        GoPrev ->
            ( model, Cmd.none, Nothing )

        GoTo path ->
            ( model, Cmd.none, Nothing )

        NewFile ->
            ( model, Cmd.none, Nothing )

        NewFolder ->
            ( model, Cmd.none, Nothing )

        Delete ->
            ( model, Cmd.none, Nothing )

        Rename newName ->
            ( model, Cmd.none, Nothing )


view config model =
    layout
        [ Font.size 16
        , Font.family
            [ Font.monospace ]
        ]
        (column
            [ spacing 20 ]
            [ model.filesys
                |> Maybe.map rewindFilesys
                |> Maybe.map extractFsItem
                |> Maybe.map fsItemToElement
                |> Maybe.withDefault (text "wrong FsItem")

            --, text <| Debug.toString <| List.foldr (\f acc -> insert f "Images" acc) Nothing dummyFiles
            ]
        )


initFileSys : FsItem -> Filesys
initFileSys fsItem =
    { current = fsItem
    , contexts = []
    }


extractFsItem : Filesys -> FsItem
extractFsItem { current, contexts } =
    current


updateCurrFilesys : FsItem -> Filesys -> Filesys
updateCurrFilesys new { current, contexts } =
    { current = new, contexts = contexts }


rewindFilesys : Filesys -> Filesys
rewindFilesys filesys =
    case zipUpFilesys filesys of
        Nothing ->
            filesys

        Just filesys_ ->
            rewindFilesys filesys_


zipUpFilesys : Filesys -> Maybe Filesys
zipUpFilesys { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            Just
                { current = Folder parent (left ++ [ current ] ++ right)
                , contexts = cs
                }


zipDownFilesys : (FsItem -> Bool) -> Filesys -> Maybe Filesys
zipDownFilesys p { current, contexts } =
    case current of
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
                        { current = f
                        , contexts =
                            { parent = meta
                            , left = l
                            , right = fs
                            }
                                :: contexts
                        }


zipToFsItem : FsItem -> Filesys -> Maybe Filesys
zipToFsItem f filesys =
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
    helper (List.reverse (getPath f)) filesys


getName : FsItem -> String
getName fsItem =
    case fsItem of
        Folder { name } _ ->
            name

        File { name } ->
            name


getPath : FsItem -> List String
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
    --     [ File (Meta [ "pic1", "Folder1", "Images" ] "pic1")
    --     , Folder (Meta [ "Folder3", "Folder1", "Images" ] "Folder3") []
    --     , Folder (Meta [ "Images" ] "Images") []
    --     ]
    -- LES REPERTOIRES DOIVENT ETRE VIDES!
    let
        helper reversePath mbFsItem =
            case mbFsItem of
                Nothing ->
                    case reversePath of
                        [] ->
                            helper
                                reversePath
                                (Just <| Folder (Meta [ rootName ] rootName) [])

                        root :: _ ->
                            if root /= rootName then
                                Nothing
                            else
                                helper
                                    reversePath
                                    (Just <| Folder (Meta [ rootName ] rootName) [])

                Just (Folder meta children) ->
                    case reversePath of
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
                                                    , path = next :: meta.path
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
    List.tail (getPath f)
        |> Maybe.map List.reverse
        |> Maybe.andThen (\p -> helper p mbFsItem_)


dummyFiles =
    [ File (Meta [ "pic1", "Folder1", "Images" ] "pic1")
    , File (Meta [ "pic2", "Folder1", "Images" ] "pic2")
    , File (Meta [ "pic2", "Folder1", "Images" ] "pic2")
    , File (Meta [ "pic3", "Folder2", "Folder1", "Images" ] "pic3")
    , File (Meta [ "test", "Folder4", "Folder2", "Folder1", "Images" ] "test")
    , File (Meta [ "pic4", "Folder1", "Images" ] "pic4")
    , Folder (Meta [ "Folder3", "Folder1", "Images" ] "Folder3") []
    , Folder (Meta [ "Folder3", "Folder1", "Images" ] "Folder3") []
    , Folder (Meta [ "Images" ] "Images") []
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


fsItemToElement : FsItem -> Element msg
fsItemToElement fsItem =
    let
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
                        [ el [ Font.bold ]
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
