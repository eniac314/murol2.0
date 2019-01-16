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
import Dict exposing (..)
import Document.Document exposing (GalleryMeta, ImageMeta, ImageSrc(..), dummyPic)
import Document.DocumentViews.StyleSheets exposing (PreviewMode, docMaxWidth)
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
import Gallery.GalleryHelpers exposing (..)
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
    , images : BiStream (List ImageMeta)
    , mbDrag : Maybe Drag
    , mbAnim : Maybe ( Animation, Direction )
    , clock : Float
    , externalMsg : Msg -> msg
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
            images
                |> (\xs -> biStream xs dummyPic)
                |> chunkBiStream 3
    in
    { loaded = Set.empty
    , images = stream
    , mbDrag = Nothing
    , mbAnim = Nothing
    , clock = 0
    , title = title
    , externalMsg = externalMsg
    }



-------------------------------------------------------------------------------
-------------
-- Update ---
-------------


update : Config a msg -> Msg -> Model msg -> Model msg
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
                                |> to (toFloat (maxWidth config))
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

        ImgLoaded src ->
            { model | loaded = Set.insert src model.loaded }

        NoOp ->
            model



-------------------------------------------------------------------------------
--------------------
-- View functions --
--------------------


type alias Config a msg =
    { a
        | width : Int
        , height : Int
        , editMode : Bool
        , previewMode : PreviewMode
        , galleries : Dict String (Model msg)
    }


maxWidth config =
    min config.width
        (docMaxWidth ( config.width, config.height ) config.editMode config.previewMode)
        - 40


view : Config a msg -> Model msg -> Element msg
view config model =
    let
        w =
            maxWidth config

        h =
            min 600 (round <| toFloat w / 1.333333)
    in
    Element.map model.externalMsg <|
        column
            [ spacing 15 ]
            [ el
                [ centerX
                , clipX
                , width (px w)
                , height (px h)
                ]
                (chunkView config model (current model.images))
            ]


chunkView : Config a msg -> Model msg -> List ImageMeta -> Element Msg
chunkView config model chunk =
    case chunk of
        l :: c :: r :: [] ->
            Lazy.lazy
                (\mc ->
                    row
                        (events model.mbDrag ( DragStart, DragAt, DragEnd )
                            ++ [ mc ]
                        )
                        [ picView config model l
                        , picView config model c
                        , picView config model r
                        ]
                )
                (moveChunk config model)

        _ ->
            Element.none


moveChunk config model =
    let
        w =
            maxWidth config

        animFun =
            case model.mbAnim of
                Nothing ->
                    -- necessary in order to center the row
                    moveLeft (toFloat w)

                Just ( anim, AnimateLeft ) ->
                    moveLeft (toFloat w + animate model.clock anim)

                Just ( anim, AnimateRight ) ->
                    moveRight ((toFloat <| -1 * w) + animate model.clock anim)
    in
    case model.mbDrag of
        Nothing ->
            animFun

        Just (Drag start stop) ->
            if start.x - stop.x <= 0 then
                moveRight (toFloat <| (-1 * w) + abs (start.x - stop.x))
            else
                moveLeft (toFloat <| w + start.x - stop.x)


picView : Config a msg -> Model msg -> ImageMeta -> Element Msg
picView config model { src, size } =
    let
        w =
            maxWidth config

        h =
            min 600 (round <| toFloat w / 1.333333)
    in
    case src of
        UrlSrc src_ ->
            el
                ([ width (px w)
                 , height (px h)
                 , if Set.member src_ model.loaded then
                    Background.uncropped src_
                   else
                    Background.uncropped "/assets/images/loading.gif"
                 ]
                    ++ unselectable
                )
                (html <|
                    Html.img
                        [ HtmlAttr.hidden True
                        , HtmlEvents.on "load" (Decode.succeed (ImgLoaded src_))
                        , HtmlAttr.src src_
                        ]
                        []
                )

        _ ->
            Element.none



-------------------------------------------------------------------------------
------------------
-- Misc Helpers --
------------------
