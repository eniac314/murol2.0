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
    , mbOriImageWidth : Maybe Int
    , mbOriImageHeight : Maybe Int
    , desiredWidth : Maybe Int
    , desiredHeight : Maybe Int
    , sliderValue : Float
    , needToResize : Bool
    , mbImage : Maybe Image
    , mode : Mode
    }


type alias Image =
    { contents : String
    , filename : String
    , width : Int
    , height : Int
    }


type Mode
    = FileReader
    | Edit


type Msg
    = UploadImage
    | FileRead Image
    | ImageRead Image
    | UploadResult (Result Error ())
    | RotateRight
    | RotateLeft
    | Resize Float
    | SetResize
    | SetFilename String
    | ChangeMode Mode
    | SaveAndQuit
    | Quit
    | Reset
    | NoOp


decodeImageData msg =
    Decode.at [ "target", "fileData" ]
        (Decode.map4 Image
            (Decode.field "contents" Decode.string)
            (Decode.field "filename" Decode.string)
            (Decode.field "width" Decode.int)
            (Decode.field "height" Decode.int)
            |> Decode.map msg
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
      , mbOriImageWidth = Nothing
      , mbOriImageHeight = Nothing
      , desiredWidth = Nothing
      , desiredHeight = Nothing
      , sliderValue = 100
      , needToResize = False
      , mbImage = Nothing
      , mode = FileReader
      }
    , Cmd.none
    )


update msg model =
    case msg of
        UploadImage ->
            case model.mbImage of
                Nothing ->
                    ( model, Cmd.none )

                Just file ->
                    ( model, uploadImage file )

        FileRead data ->
            let
                newImage =
                    { contents = data.contents
                    , filename = data.filename
                    , width = data.width
                    , height = data.height
                    }
            in
                ( { model
                    | mbImage = Just newImage
                    , mode = Edit
                    , mbOriImageWidth = Just data.width
                    , mbOriImageHeight = Just data.height
                    , needToResize = False
                  }
                , Cmd.none
                )

        ImageRead data ->
            let
                newImage =
                    { contents = data.contents
                    , filename = data.filename
                    , width = data.width
                    , height = data.height
                    }
            in
                ( { model
                    | mbImage = Just newImage
                    , mode = Edit
                    , needToResize = False
                  }
                , Cmd.none
                )

        UploadResult (Ok ()) ->
            ( model, Cmd.none )

        UploadResult (Err e) ->
            ( model, Cmd.none )

        RotateRight ->
            ( model, Cmd.none )

        RotateLeft ->
            ( model, Cmd.none )

        Resize n ->
            case ( model.mbOriImageWidth, model.mbOriImageHeight ) of
                ( Just oriW, Just oriH ) ->
                    let
                        ratio =
                            toFloat oriW / toFloat oriH

                        desiredWidth =
                            toFloat oriW * n / 100

                        desiredHeight =
                            desiredWidth / ratio
                    in
                        ( { model
                            | sliderValue = n
                            , desiredWidth =
                                Just <| round desiredWidth
                            , desiredHeight =
                                Just <| round desiredHeight
                          }
                        , Cmd.none
                        )

                _ ->
                    ( model, Cmd.none )

        SetResize ->
            ( { model | needToResize = True }, Cmd.none )

        SetFilename filename ->
            ( model, Cmd.none )

        ChangeMode mode ->
            ( model, Cmd.none )

        SaveAndQuit ->
            ( model, Cmd.none )

        Quit ->
            ( model, Cmd.none )

        Reset ->
            ( model, Cmd.none )

        NoOp ->
            ( model, Cmd.none )


view model =
    layout
        []
    <|
        column
            [ spacing 15
            , Font.size 16
            , padding 15
            ]
            [ case model.mode of
                FileReader ->
                    fileReaderView model

                Edit ->
                    editView model
            , fileReader
                ([ HtmlAttr.style "id" model.id
                 , HtmlEvents.on "fileRead" (decodeImageData FileRead)
                 , HtmlEvents.on "imageRead" (decodeImageData ImageRead)
                 , if model.mode /= FileReader then
                    HtmlAttr.hidden True
                   else
                    noHtmlAttr
                 ]
                    ++ (if model.needToResize then
                            [ --model.desiredWidth
                              --    |> Maybe.map (\w -> Encode.int w)
                              --    |> Maybe.map (\val -> HtmlAttr.property "desiredWidth" val)
                              --    |> Maybe.withDefault noHtmlAttr
                              model.desiredHeight
                                |> Maybe.map (\h -> Encode.int h)
                                |> Maybe.map (\val -> HtmlAttr.property "desiredSize" val)
                                |> Maybe.withDefault noHtmlAttr
                            ]
                        else
                            []
                       )
                )
            ]


fileReaderView model =
    column
        [ spacing 15 ]
        [ row
            [ spacing 15 ]
            [ el [] (text "Charger une image depuis votre PC: ")
            ]
        ]


fileReader attributes =
    el []
        (html <|
            Html.node "file-reader"
                attributes
                [ Html.input
                    [ HtmlAttr.type_ "file"
                    ]
                    []
                ]
        )


editView model =
    case ( model.mbImage, model.mbOriImageWidth, model.mbOriImageHeight ) of
        ( Just f, Just oriW, Just oriH ) ->
            column
                [ spacing 15 ]
                [ row
                    [ spacing 15 ]
                    [ row
                        [ spacing 10 ]
                        [ text "Nom de fichier: "
                        , text f.filename
                        ]
                    , row
                        [ spacing 10 ]
                        [ text "Dimensions originales:"
                        , text <|
                            String.fromInt oriW
                                ++ "x"
                                ++ String.fromInt oriH
                        ]
                    ]
                , row
                    [ spacing 15 ]
                    [ Input.button (buttonStyle True)
                        { onPress = Just SetResize
                        , label = text "Redimensionner"
                        }
                    , row
                        [ spacing 10 ]
                        [ Input.slider
                            [ Element.height (Element.px 30)
                            , Element.width (px 225)
                              -- Here is where we're creating/styling the "track"
                            , Element.behindContent
                                (Element.el
                                    [ Element.width (fill)
                                    , Element.height (Element.px 2)
                                    , Element.centerY
                                    , Background.color (rgb 0.9 0.9 0.9)
                                    , Border.rounded 2
                                    ]
                                    Element.none
                                )
                            ]
                            { onChange = Resize
                            , label = Input.labelLeft [ centerY ] (Element.none)
                            , min = 0
                            , max = 100
                            , step = Just 1
                            , value = model.sliderValue
                            , thumb =
                                Input.defaultThumb
                            }
                        , text <|
                            (model.desiredWidth
                                |> Maybe.map String.fromInt
                                |> Maybe.withDefault (String.fromInt oriW)
                            )
                                ++ "x"
                                ++ (model.desiredHeight
                                        |> Maybe.map String.fromInt
                                        |> Maybe.withDefault (String.fromInt oriH)
                                   )
                        ]
                    ]
                , el
                    [ width (maximum 650 fill)
                    , height (maximum 550 fill)
                    , scrollbars
                    ]
                    (image
                        []
                        { src = f.contents
                        , description = f.filename
                        }
                    )
                ]

        _ ->
            text "no file data"


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


property name value =
    htmlAttribute <| HtmlAttr.property name value


noAttr =
    htmlAttribute <| HtmlAttr.class ""


noHtmlAttr =
    HtmlAttr.class ""
