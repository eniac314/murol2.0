module ImagePlugin exposing (..)

import Browser exposing (element)
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
import Http exposing (..)
import Json.Decode as Decode
import Json.Encode as Encode


type alias Model =
    { id : String
    , mbOriImage : Maybe Image
    , mbFinalImage : Maybe Image
    , debug : Maybe Decode.Value
    }


type alias Image =
    { contents : String
    , filename : String
    , width : Int
    , height : Int
    }


type Msg
    = UploadImage
    | ImageRead Image
    | UploadResult (Result Error ())


decodeImageData =
    Decode.at [ "target", "fileData" ]
        (Decode.map4 Image
            (Decode.field "contents" Decode.string)
            (Decode.field "filename" Decode.string)
            (Decode.field "width" Decode.int)
            (Decode.field "height" Decode.int)
            |> Decode.map ImageRead
        )


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


init : () -> ( Model, Cmd Msg )
init flags =
    ( { id = "InputId"
      , mbOriImage = Nothing
      , mbFinalImage = Nothing
      , debug = Nothing
      }
    , Cmd.none
    )


update msg model =
    case msg of
        UploadImage ->
            case model.mbFinalImage of
                Nothing ->
                    ( model, Cmd.none )

                Just file ->
                    ( model, uploadImage file )

        ImageRead data ->
            let
                newImage =
                    { contents = data.contents
                    , filename = data.filename
                    , width = data.width
                    , height = data.height
                    }
            in
                ( { model | mbOriImage = Just newImage }, Cmd.none )

        UploadResult (Ok ()) ->
            ( model, Cmd.none )

        UploadResult (Err e) ->
            ( model, Cmd.none )


view model =
    layout
        [ Font.size 16
        , padding 15
        ]
    <|
        column
            [ spacing 15 ]
            [ row
                [ spacing 15 ]
                [ fileReader
                    [ HtmlAttr.style "id" model.id
                    , HtmlEvents.on "fileRead" decodeImageData
                    ]
                , Input.button (buttonStyle True)
                    { onPress = Just UploadImage
                    , label = text "Upload"
                    }
                ]
            , case .mbOriImage model of
                Nothing ->
                    text "no file data"

                Just f ->
                    image
                        []
                        { src = f.contents
                        , description = f.filename
                        }
            ]


buttonStyle isActive =
    [ Border.rounded 5
    , Font.center
    , centerY
    , padding 5
    , focused [ Border.glow (rgb 1 1 1) 0 ]
    ]
        ++ (if isActive then
                [ Background.color (rgb 0.9 0.9 0.9)
                , mouseOver [ Font.color (rgb 255 255 255) ]
                , Border.width 1
                , Border.color (rgb 0.9 0.9 0.9)
                ]
            else
                [ Background.color (rgb 0.95 0.95 0.95)
                , Font.color (rgb 0.7 0.7 0.7)
                , htmlAttribute <| HtmlAttr.style "cursor" "default"
                , Border.width 1
                , Border.color (rgb 0.95 0.95 0.95)
                ]
           )



--div
--[]
--[ div
--    []
--    [ fileReader
--        [ id model.id
--        , on "fileRead"
--            decodeImageData
--        ]
--    , button [ onClick UploadImage ]
--        [ text "submit" ]
--    , br [] []
--, case .mbImage model of
--    Nothing ->
--        text "no file data"
--    Just f ->
--        img
--            [ src f.contents
--            , title f.filename
--            ]
--            []
--, text <| Debug.toString model
--]
--]


fileReader attributes =
    html <|
        Html.node "file-reader"
            attributes
            [ Html.input
                [ HtmlAttr.type_ "file"
                ]
                []
            ]


subscriptions model =
    Sub.batch []


uploadImage : Image -> Cmd Msg
uploadImage file =
    Http.send UploadResult (fileUploadRequest file)


fileUploadRequest : Image -> Http.Request ()
fileUploadRequest { contents, filename } =
    let
        body =
            Encode.object
                [ ( "contents", Encode.string contents )
                , ( "filename", Encode.string filename )
                ]
    in
        Http.post "fileUpload.php" (jsonBody body) (Decode.succeed ())
