module Gallery.HeaderGallery exposing (..)

import Animation
    exposing
        ( Animation
        , animate
        , animation
        , duration
        , ease
        , from
        , getDuration
        , isDone
        , retarget
        , speed
        , to
        )
import Browser.Events exposing (Visibility(..), onAnimationFrame, onKeyDown, onVisibilityChange)
import Delay exposing (after)
import Ease exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Keyed as Keyed
import Element.Lazy as Lazy
import Element.Region as Region
import Html as Html
import Html.Attributes as HtmlAttr
import Html.Events as HtmlEvents
import Internals.CommonStyleHelpers exposing (..)
import Internals.Streams exposing (..)
import Json.Decode as Decode
import Set exposing (..)
import Time exposing (Posix, every, millisToPosix, posixToMillis)


type alias Model msg =
    { loaded : Set String
    , images : BiStream (List Image)
    , mbDrag : Maybe Drag
    , mbAnim : Maybe ( Animation, Direction )
    , clock : Float
    , visibility : Visibility
    , externalMsg : Msg -> msg
    }


type Direction
    = AnimateLeft
    | AnimateRight


type Drag
    = Drag Position Position


type alias Position =
    { x : Int
    , y : Int
    }


type alias Image =
    { src : String
    , id : Int
    }


type Msg
    = Next
    | Previous
    | Animate Direction Posix
    | DragStart Position
    | DragAt Position
    | DragEnd
    | Tick Posix
    | ImgLoaded String
    | VisibilityChange Visibility
    | NoOp


subscriptions model =
    Sub.batch
        [ if model.mbAnim == Nothing then
            Sub.none
          else
            onAnimationFrame Tick
        , if model.visibility == Hidden then
            Sub.none
          else
            Time.every 15000 (Animate AnimateLeft)
        , onVisibilityChange VisibilityChange
        ]


init : List String -> (Msg -> msg) -> Model msg
init imgs externalMsg =
    let
        stream =
            List.indexedMap
                (\n s -> Image s n)
                imgs
                |> (\xs -> biStream xs (Image "" -1))
                |> chunkBiStream 3
    in
    { loaded = Set.empty
    , images = stream
    , mbDrag = Nothing
    , mbAnim = Nothing
    , clock = 0
    , visibility = Visible
    , externalMsg = externalMsg
    }


update : { maxWidth : Int } -> Msg -> Model msg -> Model msg
update config msg model =
    case msg of
        Next ->
            { model
                | images = right (.images model)
                , mbDrag = Nothing
            }

        Previous ->
            { model
                | images = left (.images model)
                , mbDrag = Nothing
            }

        Animate dir t ->
            let
                newClock =
                    toFloat <| posixToMillis t

                newAnim =
                    case ( model.mbAnim, dir ) of
                        ( Nothing, AnimateLeft ) ->
                            Just
                                ( animation newClock
                                    |> from 0
                                    |> to (toFloat config.maxWidth)
                                    |> speed 1
                                    |> ease Ease.inOutExpo
                                , AnimateLeft
                                )

                        _ ->
                            Nothing
            in
            { model | mbAnim = newAnim }

        DragStart position ->
            { model
                | mbDrag = Just (Drag position position)
            }

        DragAt position ->
            let
                updateDrag current_ (Drag start _) =
                    Drag start current_
            in
            { model
                | mbDrag =
                    Maybe.map (updateDrag position) model.mbDrag
            }

        DragEnd ->
            case model.mbDrag of
                Just (Drag start current_) ->
                    if start.x - current_.x > 100 then
                        { model
                            | images = right (.images model)
                            , mbDrag = Nothing
                        }
                    else if start.x - current_.x < -100 then
                        { model
                            | images = left (.images model)
                            , mbDrag = Nothing
                        }
                    else
                        { model | mbDrag = Nothing }

                Nothing ->
                    model

        ImgLoaded src ->
            { model | loaded = Set.insert src model.loaded }

        Tick t ->
            let
                newClock =
                    toFloat <| posixToMillis t

                ( newAnim, newImages ) =
                    case model.mbAnim of
                        Just ( anim, AnimateLeft ) ->
                            if isDone newClock anim then
                                ( Nothing, right (.images model) )
                            else
                                ( model.mbAnim, model.images )

                        Just ( anim, AnimateRight ) ->
                            if isDone newClock anim then
                                ( Nothing, left (.images model) )
                            else
                                ( model.mbAnim, model.images )

                        _ ->
                            ( model.mbAnim, model.images )
            in
            { model
                | clock = newClock
                , mbAnim = newAnim
                , images = newImages
            }

        VisibilityChange visibility ->
            { model | visibility = visibility }

        NoOp ->
            model


view : { maxWidth : Int } -> Model msg -> Element msg
view config model =
    Element.map model.externalMsg <|
        galleryView model config


galleryView model config =
    el
        [ centerX
        , clipX
        , width (px config.maxWidth)
        , height (px (round (toFloat config.maxWidth / 5)))
        ]
        (chunkView model config (current model.images))


chunkView model config chunk =
    case chunk of
        l :: c :: r :: [] ->
            Lazy.lazy
                (\mc ->
                    row
                        (events model.mbDrag
                            ++ [ mc ]
                        )
                        [ picView model config l []
                        , picView model config c []
                        , picView model config r []
                        ]
                )
                (moveChunk config model)

        _ ->
            Element.none


picView model config { src } attrs =
    el
        ([ width (px config.maxWidth)
         , height (px (round (toFloat config.maxWidth / 5)))
         , if Set.member src model.loaded then
            Background.image src
           else
            Background.uncropped "/assets/images/loading.gif"
         ]
            ++ attrs
            ++ unselectable
        )
        (html <|
            Html.img
                [ HtmlAttr.hidden True
                , HtmlEvents.on "load" (Decode.succeed (ImgLoaded src))
                , HtmlAttr.src src
                ]
                []
        )


moveChunk config model =
    let
        animOffset =
            case model.mbAnim of
                Nothing ->
                    0

                Just ( anim, _ ) ->
                    animate model.clock anim
    in
    case model.mbDrag of
        Nothing ->
            moveLeft (toFloat config.maxWidth + animOffset)

        Just (Drag start stop) ->
            if start.x - stop.x <= 0 then
                moveRight (toFloat <| (-1 * config.maxWidth) + abs (start.x - stop.x))
            else
                moveLeft (toFloat <| config.maxWidth + start.x - stop.x)



-- EVENTS


events : Maybe Drag -> List (Attribute Msg)
events drag =
    List.map htmlAttribute <|
        moveEvent drag
            ++ [ HtmlEvents.on "mousedown" (Decode.map DragStart decodePosition)
               , HtmlEvents.on "touchstart" (Decode.map DragStart decodePosition)
               ]


moveEvent : Maybe a -> List (Html.Attribute Msg)
moveEvent drag =
    case drag of
        Just _ ->
            [ HtmlEvents.preventDefaultOn "mousemove"
                (Decode.map (\p -> ( DragAt p, True )) decodePosition)
            , HtmlEvents.preventDefaultOn "touchmove"
                (Decode.map (\p -> ( DragAt p, True )) decodePosition)
            , HtmlEvents.on "mouseup" (Decode.succeed DragEnd)
            , HtmlEvents.on "mouseleave" (Decode.succeed DragEnd)
            , HtmlEvents.on "touchend" (Decode.succeed DragEnd)
            , HtmlEvents.on "touchcancel" (Decode.succeed DragEnd)
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
