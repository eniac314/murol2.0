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
    { parent : NodeValue
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
                Node _ children ->
                    if p doc then
                        [ doc_ ]
                    else
                        List.concatMap helper children

                Leaf _ ->
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
                { current = Node parent (left ++ [ current ] ++ right)
                , contexts = cs
                }


zipDown : (Document -> Bool) -> DocZipper -> Maybe DocZipper
zipDown p { current, contexts } =
    case current of
        Leaf _ ->
            Nothing

        Node _ [] ->
            Nothing

        Node nv ds ->
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
    let
        newDoc =
            Leaf
                { leafContent = EmptyLeaf
                , id =
                    { uid = nextUid
                    , styleId = Nothing
                    , classes = Set.empty
                    }
                , attrs = []
                }
    in
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            Just
                { current = current
                , contexts =
                    { parent = parent
                    , left = left ++ [ newDoc ]
                    , right = right
                    }
                        :: cs
                }


addNewRight : Int -> DocZipper -> Maybe DocZipper
addNewRight nextUid { current, contexts } =
    let
        newDoc =
            Leaf
                { leafContent = EmptyLeaf
                , id =
                    { uid = nextUid
                    , styleId = Nothing
                    , classes = Set.empty
                    }
                , attrs = []
                }
    in
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            Just
                { current = current
                , contexts =
                    { parent = parent
                    , left = left
                    , right = newDoc :: right
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
                { current = Node parent (left ++ right)
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
addZipperHandlers ({ current, contexts } as dz) =
    let
        handlers id =
            [ ZipperAttr id.uid OnClick
            , ZipperAttr id.uid OnDblClick
            , ZipperAttr id.uid OnMouseOver
            ]

        addHandlersToChild doc =
            case doc of
                Leaf ({ leafContent, id, attrs } as lv) ->
                    Leaf
                        { lv
                            | attrs =
                                handlers id ++ attrs
                        }

                Node ({ nodeLabel, id, attrs } as nv) children ->
                    Node
                        { nv
                            | attrs =
                                handlers id ++ attrs
                        }
                        children
    in
    case toogleClass "selected" current of
        Node nv children ->
            { dz
                | current = Node nv (List.map addHandlersToChild children)
            }

        Leaf ({ leafContent, id, attrs } as lv) ->
            let
                newLeaf =
                    Leaf
                        { lv
                            | attrs =
                                ZipperAttr id.uid OnLeafClick :: attrs
                        }
            in
            { dz
                | current = newLeaf
            }
