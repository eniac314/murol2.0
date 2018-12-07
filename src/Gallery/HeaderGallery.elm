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
import Browser.Events exposing (onAnimationFrame)
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
    , frameBuffer : Int
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
    | Animate Direction
    | DragStart Position
    | DragAt Position
    | DragEnd
    | Tick Posix
    | ImgLoaded String
    | NoOp


subscriptions model =
    Sub.batch
        [ onAnimationFrame Tick
        , Time.every 15000 (always <| Animate AnimateLeft)
        ]



--onAnimationFrame Tick


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
    , frameBuffer = 0
    , externalMsg = externalMsg
    }


update : Msg -> Model msg -> Model msg
update msg model =
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

        Animate dir ->
            let
                newAnim =
                    case ( model.mbAnim, dir, model.mbDrag ) of
                        ( Nothing, AnimateLeft, Nothing ) ->
                            Just
                                ( animation model.clock
                                    |> from 0
                                    |> to 1000
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
            --if model.frameBuffer == 2 then
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
                , frameBuffer = 0
            }

        --else
        --    { model | frameBuffer = model.frameBuffer + 1 }
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

        --, Background.color (rgba 1 0 1 0.3)
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
                        , picView model config c [] --(events model.mbDrag)
                        , picView model config r []
                        ]
                )
                (moveChunk model)

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


moveChunk model =
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
            moveLeft (1000 + animOffset)

        Just (Drag start stop) ->
            if start.x - stop.x <= 0 then
                moveRight (toFloat <| -1000 + abs (start.x - stop.x))
            else
                moveLeft (toFloat <| 1000 + start.x - stop.x)



-- EVENTS


events : Maybe Drag -> List (Attribute Msg)
events drag =
    List.map htmlAttribute <|
        moveEvent drag
            ++ [ HtmlEvents.on "mousedown" (Decode.map DragStart decodePosition)
               , HtmlEvents.on "touchstart" (Decode.map DragStart decodePosition)
               , HtmlEvents.on "keydown" (Decode.andThen keycodeToMsg decodeKeyboard)
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


decodeKeyboard : Decode.Decoder Int
decodeKeyboard =
    Decode.field "keyCode" Decode.int


decodePosition : Decode.Decoder Position
decodePosition =
    let
        decoder =
            Decode.map2 Position
                (Decode.field "pageX" (Decode.map floor Decode.float))
                (Decode.field "pageY" (Decode.map floor Decode.float))
    in
    Decode.oneOf [ decoder, Decode.at [ "touches", "0" ] decoder ]


keycodeToMsg : Int -> Decode.Decoder Msg
keycodeToMsg keyCode =
    case keyCode of
        37 ->
            Decode.succeed Previous

        39 ->
            Decode.succeed Next

        _ ->
            Decode.fail "Unknown key"
