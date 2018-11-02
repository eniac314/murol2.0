port module SearchEngine exposing (..)

import Delay exposing (..)
import Dict exposing (..)
import Http exposing (..)
import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode exposing (..)
import Set exposing (..)


port outbound : String -> Cmd msg


port inbound : (String -> msg) -> Sub msg


type alias Model =
    { searchStr : String
    , searchWords : List String
    , metadata : Metadata
    }


type Msg
    = LoadKeywords (Result Http.Error (Set ( String, String )))
    | SearchStr String
    | Search
    | Reset
    | NoOp


type alias Metadata =
    Dict Keyword (List String)


type alias Keyword =
    String


type alias SearchResult =
    ( List String, Dict String ( Int, Set String ) )


main : Program () Model Msg
main =
    Platform.worker
        { init = init
        , update = update
        , subscriptions = subscriptions
        }


init flags =
    ( { searchStr = ""
      , searchWords = []
      , metadata = Dict.empty
      }
    , getKeywords
    )


subscriptions model =
    inbound processInput


update msg model =
    case msg of
        LoadKeywords res ->
            case res of
                Ok keywords ->
                    ( { model
                        | metadata =
                            keywordsToMetadata keywords
                      }
                    , Cmd.none
                    )

                Err e ->
                    ( model
                    , Cmd.none
                    )

        SearchStr s ->
            let
                lower =
                    String.toLower s

                wrds =
                    String.words lower
            in
            ( { model
                | searchStr = lower
                , searchWords = wrds
              }
            , Cmd.none
            )

        Search ->
            ( model
            , searchM model.metadata
                (List.filter irrelevant
                    (.searchWords model)
                )
                |> encodeSearchResult
                |> outbound
            )

        Reset ->
            init ()

        NoOp ->
            ( model, Cmd.none )



-------------------------------------------------------------------------------
----------------------
-- Search algorithm --
----------------------


search : Metadata -> String -> ( List String, Dict String ( Int, Set String ) )
search meta key =
    let
        l =
            String.length key

        burst s =
            String.words s
                |> List.filter irrelevant
                |> List.map (\v -> ( v, s ))

        toTrim =
            Dict.keys meta
                |> List.foldr (\k acc -> burst k ++ acc) []

        filterMatch ( w, k ) acc =
            let
                score =
                    sift3Distance w key
            in
            if score < 1.5 then
                ( k, 15 - (round score * 10) ) :: acc
            else
                acc

        trimmed =
            List.foldr
                filterMatch
                []
                toTrim

        incrOccur k m val =
            case val of
                Nothing ->
                    Just ( m, Set.singleton k )

                Just ( n, keySet ) ->
                    Just ( n + 5, Set.insert k keySet )
    in
    ( List.map Tuple.first trimmed
    , List.foldr
        (\( k, m ) acc ->
            case Dict.get k meta of
                Nothing ->
                    acc

                Just vs ->
                    List.foldr (\uuid acc_ -> Dict.update uuid (incrOccur k m) acc_) acc vs
        )
        Dict.empty
        trimmed
    )


searchM : Metadata -> List String -> ( List String, Dict String ( Int, Set String ) )
searchM meta keys =
    let
        results =
            List.map (search meta) keys

        combineWeigtedRes oldDict newDict =
            let
                onlyLeft k v1 acc =
                    Dict.insert k v1 acc

                inBoth k ( v1, ks1 ) ( v2, ks2 ) acc =
                    Dict.insert k ( v1 + v2, Set.union ks1 ks2 ) acc

                onlyRight k v2 acc =
                    Dict.insert k v2 acc
            in
            Dict.merge onlyLeft inBoth onlyRight oldDict newDict Dict.empty

        ( keySet, combRes ) =
            List.foldr
                (\( kwds, res ) ( kwdsAcc, resAcc ) ->
                    ( Set.union kwdsAcc (Set.fromList kwds), combineWeigtedRes resAcc res )
                )
                ( Set.empty, Dict.empty )
                results
    in
    ( Set.toList keySet, combRes )


sift3Distance : String -> String -> Float
sift3Distance s1 s2 =
    let
        s1Len =
            String.length s1

        s2Len =
            String.length s2
    in
    if s1Len == 0 then
        toFloat s2Len
    else if s2Len == 0 then
        toFloat s1Len
    else
        let
            common =
                lcs (String.toList s1) (String.toList s2)
        in
        (toFloat (s1Len + s2Len) / 2) - toFloat (List.length common)


lcs : List a -> List a -> List a
lcs xs ys =
    lcsHelper xs ys ( 0, 0 ) Dict.empty
        |> Dict.get ( 0, 0 )
        |> Maybe.map Tuple.second
        |> Maybe.withDefault []


lcsHelper : List a -> List a -> ( Int, Int ) -> Dict ( Int, Int ) ( Int, List a ) -> Dict ( Int, Int ) ( Int, List a )
lcsHelper xs ys position memo =
    case ( Dict.get position memo, xs, ys ) of
        ( Nothing, x :: xRest, y :: yRest ) ->
            let
                nextYPos =
                    Tuple.mapSecond ((+) 1) position

                nextXPos =
                    Tuple.mapFirst ((+) 1) position

                newMemo =
                    memo
                        |> lcsHelper xs yRest nextYPos
                        |> lcsHelper xRest ys nextXPos

                best =
                    maxListTuple
                        (get nextXPos newMemo)
                        (get nextYPos newMemo)
                        |> consIfEqual x y
            in
            Dict.insert position best newMemo

        _ ->
            memo


maxOffset =
    5


get : ( Int, Int ) -> Dict ( Int, Int ) ( Int, List a ) -> ( Int, List a )
get position memo =
    Dict.get position memo |> Maybe.withDefault ( 0, [] )


maxListTuple : ( Int, List a ) -> ( Int, List a ) -> ( Int, List a )
maxListTuple ( xLen, xs ) ( yLen, ys ) =
    if yLen > xLen then
        ( yLen, ys )
    else
        ( xLen, xs )


consIfEqual : a -> a -> ( Int, List a ) -> ( Int, List a )
consIfEqual x y ( listLen, list ) =
    if x == y then
        ( listLen + 1, x :: list )
    else
        ( listLen, list )



-------------------------------------------------------------------------------
-------------------
-- Json functions--
-------------------


processInput : String -> Msg
processInput s =
    decodeString
        (Decode.oneOf
            [ decodeAction
            , decodeSearchStr
            ]
        )
        s
        |> Result.withDefault NoOp


decodeAction : Decode.Decoder Msg
decodeAction =
    Decode.string
        |> Decode.andThen
            (\str ->
                case str of
                    "<Cmd -> Search>" ->
                        succeed Search

                    "<Cmd -> Reset>" ->
                        succeed Reset

                    _ ->
                        fail <|
                            "Unknown command"
            )


decodeSearchStr : Decode.Decoder Msg
decodeSearchStr =
    Decode.field "SearchStr" Decode.string
        |> Decode.map SearchStr


encodeSearchResult : SearchResult -> String
encodeSearchResult ( keywords, results ) =
    Encode.object
        [ ( "keywords", Encode.list Encode.string keywords )
        , ( "results"
          , Encode.dict
                identity
                (\( score, keywords_ ) ->
                    Encode.object
                        [ ( "score"
                          , Encode.int score
                          )
                        , ( "keywords"
                          , Encode.set Encode.string keywords_
                          )
                        ]
                )
                results
          )
        ]
        |> Encode.encode 0


getKeywords : Cmd Msg
getKeywords =
    let
        body =
            Encode.object
                []
                |> Http.jsonBody

        request =
            Http.post "/getKeywords.php" body decodeKeywords
    in
    Http.send LoadKeywords request


decodeKeywords : Decode.Decoder (Set.Set ( String, String ))
decodeKeywords =
    Decode.list decodeKeyword
        |> Decode.map Set.fromList


decodeKeyword : Decode.Decoder ( String, String )
decodeKeyword =
    Decode.succeed (\k cid -> ( k, cid ))
        |> Pipeline.required "keyword" Decode.string
        |> Pipeline.required "contentId" Decode.string



-------------------------------------------------------------------------------
----------
-- Misc --
----------


keywordsToMetadata : Set ( String, String ) -> Metadata
keywordsToMetadata keywords =
    Set.foldr
        (\( keyword, uuid ) acc ->
            Dict.update
                keyword
                (\mbUuids ->
                    case mbUuids of
                        Just uuids ->
                            Just <| uuid :: uuids

                        Nothing ->
                            Just [ uuid ]
                )
                acc
        )
        Dict.empty
        keywords


irrelevant =
    \w ->
        w
            /= "et"
            && w
            /= "de"
            && w
            /= "des"
            && w
            /= "le"
            && w
            /= "la"
            && w
            /= "les"
            && w
            /= "a"
            && w
            /= "au"
            && w
            /= "en"
            && w
            /= "dans"
            && w
            /= "se"
