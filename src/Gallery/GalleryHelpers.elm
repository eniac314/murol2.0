module Gallery.GalleryHelpers exposing (..)

import Element exposing (..)
import Html as Html
import Html.Attributes as HtmlAttr
import Html.Events as HtmlEvents
import Json.Decode as Decode


type Direction
    = AnimateLeft
    | AnimateRight


type Drag
    = Drag Position Position


type alias Position =
    { x : Int
    , y : Int
    }


events : Maybe Drag -> ( Position -> msg, Position -> msg, msg ) -> List (Attribute msg)
events drag ( dragStart, dragAt, dragEnd ) =
    List.map htmlAttribute <|
        moveEvent drag ( dragStart, dragAt, dragEnd )
            ++ [ HtmlEvents.on "mousedown" (Decode.map dragStart decodePosition)
               , HtmlEvents.on "touchstart" (Decode.map dragStart decodePosition)
               ]


moveEvent : Maybe a -> ( Position -> msg, Position -> msg, msg ) -> List (Html.Attribute msg)
moveEvent drag ( dragStart, dragAt, dragEnd ) =
    case drag of
        Just _ ->
            [ HtmlEvents.preventDefaultOn "mousemove"
                (Decode.map (\p -> ( dragAt p, True )) decodePosition)
            , HtmlEvents.preventDefaultOn "touchmove"
                (Decode.map (\p -> ( dragAt p, True )) decodePosition)
            , HtmlEvents.on "mouseup" (Decode.succeed dragEnd)
            , HtmlEvents.on "mouseleave" (Decode.succeed dragEnd)
            , HtmlEvents.on "touchend" (Decode.succeed dragEnd)
            , HtmlEvents.on "touchcancel" (Decode.succeed dragEnd)
            ]

        Nothing ->
            []


decodePosition : Decode.Decoder Position
decodePosition =
    let
        decoder =
            Decode.map2 Position
                (Decode.field "pageX" (Decode.map floor Decode.float))
                (Decode.field "pageY" (Decode.map floor Decode.float))
    in
    Decode.oneOf [ decoder, Decode.at [ "touches", "0" ] decoder ]
