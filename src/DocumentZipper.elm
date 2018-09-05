module DocumentZipper exposing (..)

import Document exposing (..)
import Element exposing (..)
import Element.Events as Events
import Html.Events exposing (on, onMouseOut, onMouseOver)


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


addSelectors : DocZipper -> DocZipper
addSelectors ({ current, contexts } as dz) =
    let
        nodeSelectors id =
            [ ZipperAttr id.uid OnNodeClick
            , ZipperAttr id.uid OnNodeDblClick
            , ZipperAttr id.uid OnNodeMouseOver
            ]

        leafSelectors id =
            [ ZipperAttr id.uid OnLeafClick
            , ZipperAttr id.uid OnLeafMouseOver
            ]

        addSelector doc =
            case doc of
                Leaf ({ leafContent, id, attrs } as lv) ->
                    Leaf
                        { lv
                            | attrs =
                                nodeSelectors id ++ attrs
                        }

                Node ({ nodeLabel, id, attrs } as nv) children ->
                    Node
                        { nv
                            | attrs =
                                nodeSelectors id ++ attrs
                        }
                        children
    in
    case toogleClass "selected" current of
        --case current of
        Node nv children ->
            { dz
                | current = Node nv (List.map addSelector children)
            }

        Leaf lv ->
            --dz
            { dz
                | current = Leaf lv
            }
