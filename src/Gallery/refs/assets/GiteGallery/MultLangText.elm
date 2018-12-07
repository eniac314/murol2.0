module GiteGallery.MultLangText exposing (..)

import Date exposing (..)
import Dict exposing (..)
import Element exposing (..)
import Http exposing (Error)
import Json.Decode as Decode
import Json.Encode as Encode


type alias MultLangStr =
    { en : String
    , fr : String
    }


type Language
    = English
    | French


textM : Language -> MultLangStr -> Element style variation msg
textM l ms =
    case l of
        English ->
            text (.en ms)

        French ->
            text (.fr ms)


strM : Language -> MultLangStr -> String
strM l ms =
    case l of
        English ->
            .en ms

        French ->
            .fr ms


toStr l =
    case l of
        English ->
            "en"

        French ->
            "fr"


fromStr l =
    if l == "en" || l == "English" then
        English
    else
        French


(+++) m1 m2 =
    MultLangStr (.en m1 ++ .en m2)
        (.fr m1 ++ .fr m2)


mEmpty =
    MultLangStr ""
        ""


mGoBack =
    MultLangStr "Go back"
        "Retour"


mKitchen =
    MultLangStr "The kitchen"
        "La cuisine"


mRoom1 =
    MultLangStr "Room 1"
        "Chambre 1"


mRoom2 =
    MultLangStr "Room 2"
        "Chambre 2"


mDiningRoom =
    MultLangStr "The dining room"
        "La salle à manger"


mParlor =
    MultLangStr "The parlor"
        "Le salon"


mBathroom =
    MultLangStr "The bathroom"
        "La salle de bain"
