module DocumentZipper
    exposing
        ( DocZipper
        , addNewInside
        , addNewLeft
        , addNewRight
        , addZipperHandlers
        , deleteCurrent
        , extractDoc
        , initZip
        , rewind
        , safeDeleteCurrent
        , swapLeft
        , swapRight
        , updateCurrent
        , zipDown
        , zipLeft
        , zipRight
        , zipToUid
        , zipUp
        )

import Document exposing (..)
import DocumentEditorHelpers exposing (..)
import Html.Events exposing (on, onMouseOut, onMouseOver)


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


updateCurrent : Document -> DocZipper -> DocZipper
updateCurrent new { current, contexts } =
    { current = new, contexts = contexts }



-------------------------------
-- Moving the zipper position--
-------------------------------


rewind : DocZipper -> DocZipper
rewind docZipper =
    case zipUp docZipper of
        Nothing ->
            docZipper

        Just docZipper_ ->
            rewind docZipper_


rewindLeft : DocZipper -> DocZipper
rewindLeft docZipper =
    case zipLeft docZipper of
        Nothing ->
            docZipper

        Just docZipper_ ->
            rewindLeft docZipper_


rewindRight : DocZipper -> DocZipper
rewindRight docZipper =
    case zipRight docZipper of
        Nothing ->
            docZipper

        Just docZipper_ ->
            rewindRight docZipper_


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


zipDownPath : List Int -> DocZipper -> Maybe DocZipper
zipDownPath path document =
    case path of
        [] ->
            Just document

        uid :: xs ->
            case zipDown (hasUid uid) document of
                Nothing ->
                    Nothing

                Just child ->
                    zipDownPath xs child



-- NOTE: On the page left is up, right is down!


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


zipToUid : Int -> DocZipper -> Maybe DocZipper
zipToUid uid docZipper =
    let
        helper ({ current, contexts } as zipper) =
            if getUid current == uid then
                Just zipper
            else
                case current of
                    Cell _ ->
                        Nothing

                    Container _ children ->
                        let
                            nextStep child =
                                zipDown (\d -> getUid d == getUid child) zipper
                                    |> Maybe.andThen helper
                        in
                        List.filterMap nextStep children
                            |> List.head
    in
    helper (rewind docZipper)



----------------------
-- Zipper mutations --
----------------------
-- NOTE: On the page left is up, right is down!


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



--NOTE: all functions altering the zipper by creating a new cell or container
--zip the selection to the new element.


addNewLeft : Int -> DocZipper -> Maybe DocZipper
addNewLeft nextUid { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            { current = current
            , contexts =
                { parent = parent
                , left = left ++ [ emptyCell nextUid ]
                , right = right
                }
                    :: cs
            }
                |> zipLeft


addNewRight : Int -> DocZipper -> Maybe DocZipper
addNewRight nextUid { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            { current = current
            , contexts =
                { parent = parent
                , left = left
                , right = emptyCell nextUid :: right
                }
                    :: cs
            }
                |> zipRight


addNewInside : Int -> DocZipper -> Maybe DocZipper
addNewInside nextUid { current, contexts } =
    case current of
        Container cv xs ->
            Just
                { current = Container cv (emptyCell nextUid :: xs)
                , contexts = contexts
                }

        Cell _ ->
            Nothing


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



--------------------
-- Zipper handlers--
--------------------


addZipperHandlers : DocZipper -> DocZipper
addZipperHandlers dz =
    -- NOTE: Add ZipperAttr attributes in order to make the zipper clickable.
    -- The view handlers are in Editor.model.config.handlers and are applied
    -- by the renderAttr function in DocumentView.elm
    let
        { current, contexts } =
            addHandlerToNeighbours dz

        handlers uid =
            -- NOTE: these are using to navigate down the Document zipper.
            [ ZipperAttr uid OnContainerClick
            , ZipperAttr uid OnContainerDblClick
            , ZipperAttr uid OnContainerMouseOver
            ]

        addHandlersToChild doc =
            addAttrs doc (handlers (getUid doc))

        addHandlerToNeighbours doc =
            -- NOTE: this handler is used to rewind the zipper when one clicks
            -- outside the selected subtree
            let
                path =
                    getPath doc
                        |> Tuple.first
                        |> List.tail
                        |> Maybe.withDefault []

                newDoc =
                    applyToContexts
                        (\d ->
                            addAttrs d
                                [ ZipperAttr
                                    (getUid d)
                                    OnNeighbourClick
                                ]
                        )
                        (getPath doc
                            |> Tuple.first
                        )
                        doc
            in
            zipDownPath path newDoc
                |> Maybe.withDefault doc

        currentWithCssSelectors =
            toogleClass "selected" current
    in
    case currentWithCssSelectors of
        Container nv children ->
            { contexts = contexts
            , current = Container nv (List.map addHandlersToChild children)
            }

        Cell ({ cellContent, id, attrs } as lv) ->
            -- NOTE: this handler is used to start editing the selected cell
            -- by double clicking on it.
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



---------------------
-- Helper functions--
---------------------


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


getPath : DocZipper -> ( List Int, DocZipper )
getPath document =
    let
        helper doc acc =
            case zipUp doc of
                Nothing ->
                    ( getUid (extractDoc doc) :: acc, doc )

                Just parent ->
                    helper parent (getUid (extractDoc doc) :: acc)
    in
    helper document []


applyToContexts : (Document -> Document) -> List Int -> DocZipper -> DocZipper
applyToContexts f path zipper =
    -- Note: Apply f to every Container and cell except
    --  * the selection subtree
    --  * the containers making up the selection subtree's path
    let
        document =
            rewind zipper
                |> extractDoc

        uid =
            getUid (extractDoc zipper)

        shouldNotApply currentUid =
            List.member currentUid path || (currentUid == uid)

        helper doc =
            let
                currentUid =
                    getUid doc
            in
            case doc of
                Cell lv ->
                    if currentUid == uid then
                        doc
                    else
                        f doc

                Container cv xs ->
                    if List.member currentUid path then
                        if currentUid == uid then
                            doc
                        else
                            Container cv (List.map helper xs)
                    else
                        f (Container cv (List.map helper xs))
    in
    helper document
        |> initZip
