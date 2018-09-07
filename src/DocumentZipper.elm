module DocumentZipper exposing (..)

import Document exposing (..)
import Element exposing (..)
import Element.Events as Events
import Html.Events exposing (on, onMouseOut, onMouseOver)
import Set exposing (empty)


type alias DocZipper =
    { current : Document
    , contexts : List Context
    }


type alias Context =
    { parent : ContainerValue
    , left : List Document
    , right : List Document
    }


initZip : Document -> DocZipper
initZip doc =
    { current = doc
    , contexts = []
    }


extractDoc : DocZipper -> Document
extractDoc { current, contexts } =
    current


findInCurrent : DocZipper -> (Document -> Bool) -> List Document
findInCurrent docZipper p =
    let
        doc =
            extractDoc docZipper

        helper doc_ =
            case doc of
                Container _ children ->
                    if p doc then
                        [ doc_ ]
                    else
                        List.concatMap helper children

                Cell _ ->
                    if p doc then
                        [ doc_ ]
                    else
                        []
    in
    helper doc


updateCurrent : Document -> DocZipper -> DocZipper
updateCurrent new { current, contexts } =
    { current = new, contexts = contexts }


rewind : DocZipper -> DocZipper
rewind docZipper =
    case zipUp docZipper of
        Nothing ->
            docZipper

        Just docZipper_ ->
            rewind docZipper_


zipUp : DocZipper -> Maybe DocZipper
zipUp { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            Just
                { current = Container parent (left ++ [ current ] ++ right)
                , contexts = cs
                }


zipDown : (Document -> Bool) -> DocZipper -> Maybe DocZipper
zipDown p { current, contexts } =
    case current of
        Cell _ ->
            Nothing

        Container _ [] ->
            Nothing

        Container nv ds ->
            let
                ( l, r ) =
                    break p ds
            in
            case r of
                [] ->
                    Nothing

                d :: ds_ ->
                    Just
                        { current = d
                        , contexts =
                            { parent = nv
                            , left = l
                            , right = ds_
                            }
                                :: contexts
                        }



-- On the page left is up, right is down!


zipLeft : DocZipper -> Maybe DocZipper
zipLeft { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            case List.reverse left of
                [] ->
                    Nothing

                d :: ds ->
                    Just
                        { current = d
                        , contexts =
                            { parent = parent
                            , left = List.reverse ds
                            , right = current :: right
                            }
                                :: cs
                        }


zipRight : DocZipper -> Maybe DocZipper
zipRight { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            case right of
                [] ->
                    Nothing

                d :: ds ->
                    Just
                        { current = d
                        , contexts =
                            { parent = parent
                            , left = left ++ [ current ]
                            , right = ds
                            }
                                :: cs
                        }


swapLeft : DocZipper -> Maybe DocZipper
swapLeft { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            case List.reverse left of
                [] ->
                    Nothing

                d :: ds ->
                    Just
                        { current = current
                        , contexts =
                            { parent = parent
                            , left = List.reverse ds
                            , right = d :: right
                            }
                                :: cs
                        }


addNewLeft : Int -> DocZipper -> Maybe DocZipper
addNewLeft nextUid { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            Just
                { current = current
                , contexts =
                    { parent = parent
                    , left = left ++ [ emptyCell nextUid ]
                    , right = right
                    }
                        :: cs
                }


addNewRight : Int -> DocZipper -> Maybe DocZipper
addNewRight nextUid { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            Just
                { current = current
                , contexts =
                    { parent = parent
                    , left = left
                    , right = emptyCell nextUid :: right
                    }
                        :: cs
                }


swapRight : DocZipper -> Maybe DocZipper
swapRight { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            case right of
                [] ->
                    Nothing

                d :: ds ->
                    Just
                        { current = current
                        , contexts =
                            { parent = parent
                            , left = left ++ [ d ]
                            , right = ds
                            }
                                :: cs
                        }


deleteCurrent : DocZipper -> Maybe DocZipper
deleteCurrent { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            Just
                { current = Container parent (left ++ right)
                , contexts = cs
                }


safeDeleteCurrent : Int -> DocZipper -> Maybe DocZipper
safeDeleteCurrent nextUid { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            if left == [] && right == [] then
                Just
                    { current = Container parent [ emptyCell nextUid ]
                    , contexts = cs
                    }
            else
                Just
                    { current = Container parent (left ++ right)
                    , contexts = cs
                    }


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


addZipperHandlers : DocZipper -> DocZipper
addZipperHandlers dz =
    let
        { current, contexts } =
            addHandlerToNeighbours dz

        handlers uid =
            [ ZipperAttr uid OnContainerClick
            , ZipperAttr uid OnContainerDblClick
            , ZipperAttr uid OnContainerMouseOver
            ]

        addHandlersToChild doc =
            addAttrs doc (handlers (getUid doc))

        addHandlerToNeighbours doc =
            let
                currentUid =
                    getUid (extractDoc doc)
            in
            zipUp doc
                |> Maybe.andThen
                    (\parent ->
                        case extractDoc parent of
                            Cell _ ->
                                Nothing

                            Container nv xs ->
                                Just <|
                                    updateCurrent
                                        (Container nv <|
                                            List.map
                                                (\neighbour ->
                                                    let
                                                        nUid =
                                                            getUid neighbour
                                                    in
                                                    if nUid /= currentUid then
                                                        addAttrs neighbour
                                                            [ ZipperAttr
                                                                nUid
                                                                OnNeighbourClick
                                                            ]
                                                    else
                                                        neighbour
                                                )
                                                xs
                                        )
                                        parent
                    )
                |> Maybe.andThen (zipDown (hasUid currentUid))
                |> Maybe.withDefault doc
    in
    case toogleClass "selected" current of
        Container nv children ->
            { contexts = contexts
            , current = Container nv (List.map addHandlersToChild children)
            }

        Cell ({ cellContent, id, attrs } as lv) ->
            let
                newCell =
                    Cell
                        { lv
                            | attrs =
                                ZipperAttr id.uid OnCellClick :: attrs
                        }
            in
            { contexts = contexts
            , current = newCell
            }
