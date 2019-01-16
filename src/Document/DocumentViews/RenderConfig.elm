module Document.DocumentViews.RenderConfig exposing (Config)

import Dict exposing (Dict)
import Document.Document exposing (..)
import Document.DocumentViews.StyleSheets exposing (..)
import Element exposing (Element)
import Gallery.Gallery as Gallery exposing (Model)
import GeneralDirectoryEditor.GeneralDirCommonTypes exposing (Fiche)
import Set exposing (Set)
import Time exposing (Posix, Zone)


type alias Config msg =
    { width : Int
    , height : Int
    , mainInterfaceHeight : Int
    , customElems :
        Dict String (Element msg)
    , zipperHandlers : Maybe (ZipperHandlers msg)
    , editMode : Bool
    , previewMode : PreviewMode
    , containersBkgColors : Bool
    , season : Season
    , currentTime : Posix
    , zone : Zone
    , pageIndex : Dict String String
    , fiches : Dict String Fiche
    , openedFiches : Set String
    , openFicheMsg : String -> msg
    , news : Dict String News
    , openedNews : Set String
    , openNewsMsg : String -> msg
    , galleries : Dict String (Gallery.Model msg)
    }
