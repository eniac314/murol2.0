module Filesys exposing (..)


type FsItem
    = Folder Meta (List FsItem)
    | File Meta


type alias Meta =
    { path : List String
    , name : String
    }


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
                            Nothing

                        curr :: [] ->
                            if curr /= meta.name then
                                Nothing
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
    helper (List.reverse (getPath f)) mbFsItem_


dummyFiles =
    [ File (Meta [ "Folder1", "Images" ] "pic1")
    , File (Meta [ "Folder1", "Images" ] "pic2")
    , File (Meta [ "Folder2", "Folder1", "Images" ] "pic3")
    , File (Meta [ "Folder1", "Images" ] "pic4")
    , Folder (Meta [ "Folder1", "Images" ] "Folder3") []
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
