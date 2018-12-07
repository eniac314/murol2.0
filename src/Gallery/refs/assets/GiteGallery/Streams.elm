module GiteGallery.Streams
    exposing
        ( BiStream
        , Stream
        , biStream
        , chunkBiStream
        , current
        , cycle
        , goTo
        , left
        , next
        , prev
        , right
        , takeNth
        , toList
        , updateCurrent
        )

import Dict
import List
import Tuple exposing (first, second)


-------------------------------------------------------------------------------
-- Streams --


type Stream a
    = Stream (() -> ( a, Stream a ))


nats : Stream Int
nats =
    let
        f n =
            Stream (\() -> ( n, f (n + 1) ))
    in
    f 1


takeNth : Int -> Stream a -> a
takeNth n (Stream s) =
    if n == 0 then
        first (s ())
    else
        takeNth (n - 1) (second (s ()))


toList : Stream a -> Int -> List a
toList (Stream s) n =
    if n == 0 then
        []
    else
        let
            ( v, s_ ) =
                s ()
        in
        v :: toList s_ (n - 1)


cycle : List a -> a -> Stream a
cycle xs def =
    let
        l =
            List.length xs

        dict =
            Dict.fromList (tag xs)

        safeGet i =
            Maybe.withDefault def (Dict.get (i % l) dict)

        f n =
            Stream (\() -> ( safeGet n, f (n + 1) ))
    in
    f 0


next : Stream a -> ( a, Stream a )
next (Stream s) =
    s ()


map : (a -> b) -> Stream a -> Stream b
map f s =
    let
        ( v, s_ ) =
            next s
    in
    Stream (\() -> ( f v, map f s_ ))



-------------------------------------------------------------------------------
-- BiStreams --


type alias BiStream a =
    { value : a
    , leftStr : Stream a
    , rightStr : Stream a
    , prev : Maybe a
    , size : Int
    , index : Int
    }


biStream : List a -> a -> BiStream a
biStream xs def =
    case xs of
        [] ->
            BiStream def (cycle [] def) (cycle [] def) Nothing 0 0

        x :: _ ->
            let
                l =
                    List.length xs

                dict =
                    Dict.fromList (tag xs)

                safeGet i =
                    Maybe.withDefault def (Dict.get (i % l) dict)

                leftStr n =
                    Stream (\() -> ( safeGet (l - n), leftStr (n + 1) ))

                rightStr n =
                    Stream (\() -> ( safeGet n, rightStr (n + 1) ))
            in
            BiStream x (leftStr 1) (rightStr 1) Nothing l 0


current : BiStream a -> a
current bs =
    .value bs


prev : BiStream a -> Maybe a
prev bs =
    .prev bs


updateCurrent : a -> BiStream a -> BiStream a
updateCurrent newCurrent bs =
    { bs | value = newCurrent }


updatePrev : Maybe a -> BiStream a -> BiStream a
updatePrev newPrev bs =
    { bs | prev = newPrev }


left : BiStream a -> BiStream a
left { value, leftStr, rightStr, prev, size, index } =
    let
        ( newCurrent, newLeft ) =
            next leftStr

        newRight =
            Stream (\() -> ( value, rightStr ))
    in
    BiStream newCurrent newLeft newRight (Just value) size ((index - 1) % size)


right : BiStream a -> BiStream a
right { value, leftStr, rightStr, prev, size, index } =
    let
        ( newCurrent, newRight ) =
            next rightStr

        newLeft =
            Stream (\() -> ( value, leftStr ))
    in
    BiStream newCurrent newLeft newRight (Just value) size ((index + 1) % size)


goTo : BiStream a -> (a -> Bool) -> BiStream a
goTo ({ value, leftStr, rightStr, prev, size } as bs) p =
    let
        helper bs =
            if p (current bs) then
                updatePrev prev bs
            else
                helper (right bs)
    in
    helper bs


integers =
    BiStream 0 (map (\n -> -n) nats) nats Nothing -1


test2 =
    biStream [ "blibli", "blouloub", "blublu" ] ""



-------------------------------------------------------------------------------
-- Misc --


tag : List a -> List ( Int, a )
tag xs =
    let
        go n xs =
            case xs of
                [] ->
                    []

                x :: xs_ ->
                    ( n, x ) :: go (n + 1) xs_
    in
    go 0 xs


chunk : Int -> List a -> a -> List (List a)
chunk n xs def =
    let
        str =
            cycle xs def

        takeAndRotate acc m s =
            if m == 0 then
                acc
            else
                takeAndRotate (toList s n :: acc) (m - 1) (Tuple.second (next s))
    in
    List.reverse (takeAndRotate [] (List.length xs) str)


chunkBiStream : Int -> BiStream a -> BiStream (List a)
chunkBiStream n ({ value, leftStr, rightStr, prev, size } as bs) =
    let
        takeN n bs acc =
            if n == 0 then
                List.reverse acc
            else
                takeN (n - 1) (right bs) (current bs :: acc)

        takeMChunk m bs acc =
            if m == 0 then
                List.reverse acc
            else
                takeMChunk (m - 1) (right bs) (takeN n bs [] :: acc)
    in
    biStream (takeMChunk size bs []) []
