module GiteGallery.StyleSheet exposing (..)

import Color
import Style exposing (..)
import Style.Background as Background
import Style.Border as Border
import Style.Color as Color
import Style.Font as Font
import Style.Shadow as Shadow
import Style.Transition as Transition
import Time exposing (millisecond)


type MyStyle
    = None
    | BlocsView
    | BlocThumbNail
    | BlocThumbnailPic
    | BlocThumbTitleContainer
    | BlocThumbTitle
    | LoadingGif
    | BlocView
    | BlocTitle
    | LeftBlocPanel
    | BlocCurrentPic
    | PrevNext
    | Prev
    | Next
    | NextArrow
    | LoadingLayer
    | SliderSpinner
    | RightBlocPanel
    | Chunks
    | ChunkThumb Opacity
    | ChunkThumbPic
    | PicIndex


type Opacity
    = Full
    | Dimmed


type Variation
    = Normal


stylesheet =
    Style.styleSheet
        [ Style.style BlocThumbNail
            [ Style.cursor "pointer"
            , hover
                [ Style.opacity 0.8
                , Transition.transitions [ Transition.Transition 0 (250 * millisecond) "ease" [ "all" ] ]
                ]
            ]
        , Style.style BlocThumbTitleContainer
            [ Color.background (Color.rgba 255 255 255 0.5)
            , Border.solid
            , Border.all 3
            , Color.border (Color.rgb 101 51 61)
            ]
        , Style.style BlocThumbTitle
            [ Font.uppercase
            , Font.size 24
            , Font.center
            , Font.typeface [ Font.font "times" ]
            , Color.text (Color.rgb 101 51 61)
            ]
        , Style.style BlocView
            []
        , Style.style BlocTitle
            [ Font.uppercase
            , Font.size 24
            , Font.typeface [ Font.font "times" ]
            , Color.text (Color.rgb 101 51 61)
            ]
        , Style.style BlocCurrentPic
            []
        , Style.style PrevNext
            [--Color.background (Color.rgba 0 255 255 0.5)
            ]
        , Style.style Prev
            [ Font.size 56
            , Color.text Color.white
            , Style.opacity 0
            , Style.cursor "pointer"
            , hover
                [ Color.background (Color.rgba 255 255 255 0)
                , Style.opacity 1
                , Transition.transitions [ Transition.Transition 0 (750 * millisecond) "ease" [ "all" ] ]
                ]
            ]
        , Style.style Next
            [ Font.size 56
            , Color.text Color.white
            , Style.opacity 0
            , Style.cursor "pointer"
            , hover
                [ Color.background (Color.rgba 255 255 255 0)
                , Style.opacity 1
                , Transition.transitions [ Transition.Transition 0 (750 * millisecond) "ease" [ "all" ] ]
                ]
            ]
        , Style.style NextArrow
            [ Font.alignRight
            ]
        , Style.style LoadingLayer
            [ Color.background (Color.rgba 255 255 255 0.5)

            --Background.image "images/sliderLoading.gif"
            --Style.opacity 0.3
            ]
        , Style.style SliderSpinner
            [ Font.size 48
            , Color.text (Color.rgba 255 255 255 0.8)
            , Font.center
            ]
        , Style.style (ChunkThumb Full)
            []
        , Style.style (ChunkThumb Dimmed)
            [ Style.opacity 0.5
            , Style.cursor "pointer"
            , hover
                [ Style.opacity 1
                , Transition.transitions [ Transition.Transition 0 (250 * millisecond) "ease" [ "all" ] ]
                ]
            ]
        , Style.style PicIndex
            [ Font.alignRight
            ]
        ]
