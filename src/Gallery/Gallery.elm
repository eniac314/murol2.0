module Gallery.Gallery exposing (..)

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
import Document.Document exposing (GalleryMeta, ImageMeta, dummyPic)
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
    , title : String
    , images : BiStream ImageMeta
    , mbDrag : Maybe Drag
    , mbAnim : Maybe ( Animation, Direction )
    , clock : Float
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


type Msg
    = Next
    | Previous
    | DragStart Position
    | DragAt Position
    | DragEnd
    | ImgLoaded String
    | Tick Posix
    | NoOp


subscriptions model =
    Sub.batch
        [ if model.mbAnim == Nothing && model.mbDrag == Nothing then
            Sub.none
          else
            onAnimationFrame Tick
        ]


init : String -> List ImageMeta -> (Msg -> msg) -> Model msg
init title images externalMsg =
    let
        stream =
            biStream images dummyPic
    in
    { loaded = Set.empty
    , images = stream
    , mbDrag = Nothing
    , mbAnim = Nothing
    , clock = 0
    , title = title
    , externalMsg = externalMsg
    }


update : { maxWidth : Int } -> Msg -> Model msg -> Model msg
update config msg model =
    case msg of
        Next ->
            model

        Previous ->
            model

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
                    let
                        newAnimFun x =
                            animation model.clock
                                |> from (toFloat x)
                                |> to (toFloat config.maxWidth)
                                |> speed 1
                                |> ease Ease.inOutExpo
                    in
                    if start.x - current_.x > 10 then
                        let
                            newAnim =
                                case model.mbAnim of
                                    Nothing ->
                                        Just
                                            ( newAnimFun current_.x
                                            , AnimateLeft
                                            )

                                    _ ->
                                        Nothing
                        in
                        { model
                            | mbAnim = newAnim
                            , mbDrag = Nothing
                        }
                    else if start.x - current_.x < -10 then
                        let
                            newAnim =
                                case model.mbAnim of
                                    Nothing ->
                                        Just
                                            ( newAnimFun current_.x
                                            , AnimateRight
                                            )

                                    _ ->
                                        Nothing
                        in
                        { model
                            | mbAnim = newAnim
                            , mbDrag = Nothing
                        }
                    else
                        { model | mbDrag = Nothing }

                Nothing ->
                    model

        _ ->
            model
