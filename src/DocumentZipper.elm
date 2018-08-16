module DocumentZipper exposing (..)

import Document exposing (..)
import Element exposing (..)
import Element.Events as Events
import Html.Events exposing (on, onMouseOut, onMouseOver)


type alias DocZipper msg =
    { current : Document msg
    , contexts : List (Context msg)
    }


type alias Context msg =
    { parent : NodeValue msg
    , left : List (Document msg)
    , right : List (Document msg)
    }


initZip : Document msg -> DocZipper msg
initZip doc =
    { current = doc
    , contexts = []
    }


extractDoc : DocZipper msg -> Document msg
extractDoc { current, contexts } =
    current


updateCurrent : Document msg -> DocZipper msg -> DocZipper msg
updateCurrent new { current, contexts } =
    { current = new, contexts = contexts }


rewind : DocZipper msg -> DocZipper msg
rewind docZipper =
    case zipUp docZipper of
        Nothing ->
            docZipper

        Just docZipper_ ->
            rewind docZipper_


zipUp : DocZipper msg -> Maybe (DocZipper msg)
zipUp { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            Just
                { current = Node parent (left ++ [ current ] ++ right)
                , contexts = cs
                }


zipDown : (Document msg -> Bool) -> DocZipper msg -> Maybe (DocZipper msg)
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


zipLeft : DocZipper msg -> Maybe (DocZipper msg)
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


zipRight : DocZipper msg -> Maybe (DocZipper msg)
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


addSelectors :
    { click : Int -> msg
    , dblClick : Int -> msg
    , mouseEnter : Int -> msg
    , mouseLeave : Int -> msg
    }
    -> DocZipper msg
    -> DocZipper msg
addSelectors handlers ({ current, contexts } as dz) =
    let
        selectors id =
            [ StyleElementAttr (Events.onClick (handlers.click id.uid))
            , StyleElementAttr (Events.onDoubleClick (handlers.dblClick id.uid))
            , StyleElementAttr (Events.onMouseEnter (handlers.mouseEnter id.uid))
            , StyleElementAttr (Events.onMouseLeave (handlers.mouseLeave id.uid))
            ]

        addSelector doc =
            case doc of
                Leaf ({ leafContent, id, attrs } as lv) ->
                    Leaf
                        { lv
                            | attrs =
                                selectors id ++ attrs
                        }

                Node ({ nodeLabel, id, attrs } as nv) children ->
                    Node
                        { nv
                            | attrs =
                                selectors id ++ attrs
                        }
                        children
    in
    case toogleClass "selected" current of
        Node nv children ->
            { dz
                | current = Node nv (List.map addSelector children)
            }

        _ ->
            dz
