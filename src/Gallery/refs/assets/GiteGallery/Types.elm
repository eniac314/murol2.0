module GiteGallery.Types exposing (..)

import Dict exposing (..)
import Element exposing (..)
import GiteGallery.MultLangText exposing (..)
import GiteGallery.Streams exposing (..)
import GiteGallery.StyleSheet exposing (MyStyle, Variation)
import Html exposing (..)
import Set exposing (..)
import Window exposing (Size)


type alias Model =
    { blocs : Dict Int BlocContent
    , currentBloc : Maybe BlocContent
    , loaded : Set String
    , device : Device
    , chunkSize : Int
    }


type Msg
    = Default
    | SetCurrentBloc Int
    | ShowBlocList
    | ShowPrevPic
    | ShowNextPic
    | ShowPic String
    | PicLoaded String
    | Resizes Size



--| PicUnloaded String


type alias BlocContent =
    { id : Int
    , title : MultLangStr
    , thumbnail : Picture
    , pictures : BiStream Picture
    , chunks : BiStream (List Picture)
    , description : Language -> Element MyStyle Variation Msg
    }


type alias Picture =
    { addr : String
    , caption : MultLangStr
    }
