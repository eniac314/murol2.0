module Internals.CommonHelpers exposing (..)

import Http exposing (Error(..))
import Time exposing (Posix)


type alias Log =
    { message : String
    , mbDetails : Maybe String
    , isError : Bool
    , timeStamp : Posix
    }


httpErrorToString : Http.Error -> String
httpErrorToString e =
    case e of
        BadUrl s ->
            "Url invalide: " ++ s

        Timeout ->
            "Délai d'attente dépassé"

        NetworkError ->
            "Erreur de réseau"

        BadStatus resp ->
            "Erreur serveur: "
                ++ String.fromInt resp.status.code
                ++ " - "
                ++ resp.status.message

        BadPayload decodingError resp ->
            "Erreur décodage: " ++ decodingError
