module ImagePlugin exposing (..)

import Browser exposing (element)
import Document exposing (..)
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
import Icons exposing (alignCenter, alignLeft, alignRight, rotateCcw, rotateCw)
import Json.Decode as Decode
import Json.Encode as Encode


type alias Model =
    { id : String
    , mbOriImageWidth : Maybe Int
    , mbOriImageHeight : Maybe Int
    , mbOriFileSize : Maybe Int
    , mbCaption : Maybe String
    , desiredWidth : Maybe Int
    , desiredHeight : Maybe Int
    , desiredFilename : Maybe String
    , desiredRotationAngle : Int
    , sliderValue : Float
    , needToResize : Bool
    , needToRotate : Bool
    , canResize : Bool
    , mbImageFromFile : Maybe ImageFromFile
    , mode : Mode
    }


type alias ImageFromFile =
    { contents : String
    , filename : String
    , width : Int
    , height : Int
    , filesize : Int
    }


type Mode
    = ImageAttributeEditor
    | ImagePicker
    | ImageController ImageControllerMode


type ImageControllerMode
    = FileReader
    | Editor


type Alignement
    = ARight
    | ACenter
    | ALeft


type Msg
    = ---------------------------
      -- Image Attribute Editor--
      ---------------------------
      SetAlignment Alignement
    | SetCaption String
      ---------------------
      -- ImageController --
      ---------------------
      --| UploadImage
    | FileRead ImageFromFile
    | ImageRead ImageFromFile
    | UploadResult (Result Error ())
    | RotateRight
    | RotateLeft
    | Resize Float
    | SetResize
    | SetFilename String
    | ResetImageController
      ----------
      -- Misc --
      ----------
    | ChangeMode Mode
    | SaveAndQuit
    | Quit
    | NoOp


decodeImageData msg =
    Decode.at [ "target", "fileData" ]
        (Decode.map5 ImageFromFile
            (Decode.field "contents" Decode.string)
            (Decode.field "filename" Decode.string)
            (Decode.field "width" Decode.int)
            (Decode.field "height" Decode.int)
            (Decode.field "filesize" Decode.int)
            |> Decode.map msg
        )


main : Program () Model Msg
main =
    Browser.element
        { init = init Nothing
        , update = update
        , view = view { picListing = [] }
        , subscriptions = subscriptions
        }


init : Maybe ImageMeta -> () -> ( Model, Cmd Msg )
init mbInput flags =
    ( { id = "InputId"
      , mbOriImageWidth =
            Maybe.map (.imgWidth << .size) mbInput
      , mbOriImageHeight =
            Maybe.map (.imgHeight << .size) mbInput
      , mbOriFileSize = Nothing
      , mbCaption = Maybe.andThen .caption mbInput
      , desiredWidth = Nothing
      , desiredHeight = Nothing
      , desiredFilename =
            Maybe.map .src mbInput
                |> Maybe.andThen
                    (\src ->
                        case src of
                            UrlSrc filename ->
                                Just filename

                            Inline filename _ ->
                                Just filename
                    )
      , desiredRotationAngle = 0
      , sliderValue = 100
      , needToResize = False
      , needToRotate = False
      , canResize = False
      , mbImageFromFile = Nothing
      , mode = ImageController FileReader
      }
    , Cmd.none
    )


update msg model =
    case msg of
        ---------------------------
        -- Image Attribute Editor--
        ---------------------------
        SetAlignment alignment ->
            ( model, Cmd.none )

        SetCaption caption ->
            ( model, Cmd.none )

        ---------------------
        -- ImageController --
        ---------------------
        --UploadImage ->
        --    case model.mbImageFromFile of
        --        Nothing ->
        --            ( model, Cmd.none )
        --        Just file ->
        --            ( model, uploadImage file )
        FileRead data ->
            let
                newImage =
                    { contents = data.contents
                    , filename = data.filename
                    , width = data.width
                    , height = data.height
                    , filesize = data.filesize
                    }
            in
            ( { model
                | mbImageFromFile = Just newImage
                , mode = ImageController Editor
                , mbOriImageWidth = Just data.width
                , mbOriImageHeight = Just data.height
                , mbOriFileSize = Just data.filesize
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
                    , filesize = data.filesize
                    }
            in
            ( { model
                | mbImageFromFile = Just newImage
                , mode = ImageController Editor
                , needToResize = False
                , needToRotate = False
                , canResize = False
              }
            , Cmd.none
            )

        UploadResult (Ok ()) ->
            ( model, Cmd.none )

        UploadResult (Err e) ->
            ( model, Cmd.none )

        RotateRight ->
            ( { model
                | desiredRotationAngle =
                    modBy 360 (90 + model.desiredRotationAngle)
                , needToRotate = True
                , mbOriImageWidth = model.mbOriImageHeight
                , mbOriImageHeight = model.mbOriImageWidth
              }
            , Cmd.none
            )

        RotateLeft ->
            ( { model
                | desiredRotationAngle =
                    modBy 360 (model.desiredRotationAngle - 90)
                , needToRotate = True
                , mbOriImageWidth = model.mbOriImageHeight
                , mbOriImageHeight = model.mbOriImageWidth
              }
            , Cmd.none
            )

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
                        , canResize = True
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        SetResize ->
            ( { model | needToResize = True }, Cmd.none )

        SetFilename filename ->
            ( { model | desiredFilename = Just filename }
            , Cmd.none
            )

        ResetImageController ->
            ( { model
                | mode = ImageController FileReader
                , mbOriImageWidth = Nothing
                , mbOriImageHeight = Nothing
                , mbOriFileSize = Nothing
                , desiredWidth = Nothing
                , desiredHeight = Nothing
                , desiredRotationAngle = 0
                , sliderValue = 100
                , needToResize = False
                , needToRotate = False
                , canResize = False
                , mbImageFromFile = Nothing
              }
            , Cmd.none
            )

        ----------
        -- Misc --
        ----------
        ChangeMode mode ->
            ( model, Cmd.none )

        SaveAndQuit ->
            ( model, Cmd.none )

        Quit ->
            ( model, Cmd.none )

        NoOp ->
            ( model, Cmd.none )


view config model =
    layout
        []
    <|
        case model.mode of
            ImageAttributeEditor ->
                imageAttributeEditorView config model

            ImagePicker ->
                imagePickerView config model

            ImageController imgContMode ->
                imageControllerView model imgContMode


imageAttributeEditorView config model =
    column
        [ spacing 15
        , Font.size 16
        , padding 15
        ]
        [ text "Alignement: "
        , row
            [ spacing 15 ]
            [ Input.button (toogleButtonStyle True True)
                { onPress = Just (SetAlignment ARight)
                , label = el [] (html <| alignLeft iconSize)
                }
            , Input.button (toogleButtonStyle True True)
                { onPress = Just (SetAlignment ACenter)
                , label = el [] (html <| alignCenter iconSize)
                }
            , Input.button (toogleButtonStyle True True)
                { onPress = Just (SetAlignment ARight)
                , label = el [] (html <| alignRight iconSize)
                }
            ]
        , row
            [ spacing 15 ]
            [ Input.text textInputStyle
                { onChange =
                    SetCaption
                , text =
                    "Nothing"
                , placeholder = Nothing
                , label =
                    Input.labelLeft [ centerY ]
                        (el [ width (px 110) ] (text "Légende: "))
                }
            ]
        ]


imagePickerView config model =
    Element.none


imageControllerView model imgContMode =
    column
        [ spacing 15
        , Font.size 16
        , padding 15
        ]
        [ case imgContMode of
            FileReader ->
                fileReaderView model

            Editor ->
                editView model
        , imageController
            ([ HtmlAttr.style "id" model.id
             , HtmlEvents.on "fileRead" (decodeImageData FileRead)
             , HtmlEvents.on "imageRead" (decodeImageData ImageRead)
             , if imgContMode /= FileReader then
                HtmlAttr.hidden True
               else
                noHtmlAttr
             , if model.needToRotate then
                HtmlAttr.property "rotationAngle" (Encode.int model.desiredRotationAngle)
               else
                noHtmlAttr
             ]
                ++ (if model.needToResize then
                        [ (if model.desiredRotationAngle == 90 || model.desiredRotationAngle == 270 then
                            model.desiredWidth
                           else
                            model.desiredHeight
                          )
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


imageController attributes =
    --Keyed.el []
    --    ( "test"
    --      --String.fromInt <| List.length attributes
    el []
        (html <|
            Html.node "image-controller"
                attributes
                [ Html.input
                    [ HtmlAttr.type_ "file"
                    ]
                    []
                ]
        )


editView model =
    case ( model.mbImageFromFile, model.mbOriImageWidth, model.mbOriImageHeight ) of
        ( Just f, Just oriW, Just oriH ) ->
            column
                [ spacing 15 ]
                [ row
                    [ spacing 15 ]
                    [ row
                        [ spacing 10
                        , width (px 500)
                        ]
                        [ Input.text textInputStyle
                            { onChange =
                                SetFilename
                            , text =
                                Maybe.withDefault f.filename model.desiredFilename
                            , placeholder = Nothing
                            , label =
                                Input.labelLeft [ centerY ]
                                    (el [ width (px 110) ] (text "Nom de fichier: "))
                            }
                        ]
                    , Input.button (buttonStyle True)
                        { onPress = Just RotateLeft
                        , label = el [] (html <| rotateCcw iconSize)
                        }
                    , Input.button (buttonStyle True)
                        { onPress = Just RotateRight
                        , label = el [] (html <| rotateCw iconSize)
                        }

                    -- text "Nom de fichier: "
                    --, text f.filename
                    ]
                , row
                    [ spacing 15 ]
                    [ row
                        [ spacing 10
                        , width (px 500)
                        ]
                        [ el [ width (px 110) ] (text "Dimensions: ")
                        , Input.slider
                            [ Element.height (Element.px 30)
                            , Element.width (px 250)

                            -- Here is where we're creating/styling the "track"
                            , Element.behindContent
                                (Element.el
                                    [ Element.width fill
                                    , Element.height (Element.px 2)
                                    , Element.centerY
                                    , Background.color (rgb 0.9 0.9 0.9)
                                    , Border.rounded 2
                                    ]
                                    Element.none
                                )
                            ]
                            { onChange = Resize
                            , label = Input.labelLeft [ centerY ] Element.none
                            , min = 0
                            , max = 100
                            , step = Just 1
                            , value = model.sliderValue
                            , thumb =
                                Input.defaultThumb
                            }
                        , el [ width (px 100) ]
                            (text <|
                                (model.desiredWidth
                                    |> Maybe.map String.fromInt
                                    |> Maybe.withDefault (String.fromInt oriW)
                                )
                                    ++ "x"
                                    ++ (model.desiredHeight
                                            |> Maybe.map String.fromInt
                                            |> Maybe.withDefault (String.fromInt oriH)
                                       )
                            )
                        ]
                    , Input.button (buttonStyle model.canResize)
                        { onPress =
                            if model.canResize then
                                Just SetResize
                            else
                                Nothing
                        , label = text "Redimensionner"
                        }
                    ]
                , row
                    [ spacing 15 ]
                    [ row
                        [ spacing 5 ]
                        [ el [] (text "Taille originale: ")
                        , el []
                            (text
                                (model.mbOriFileSize
                                    |> Maybe.map String.fromInt
                                    |> Maybe.map (\s -> s ++ " kb")
                                    |> Maybe.withDefault "0 kb"
                                )
                            )
                        ]
                    , row
                        [ spacing 5 ]
                        [ el [] (text "Taille actuelle: ")
                        , el []
                            (text
                                (model.mbImageFromFile
                                    |> Maybe.map .filesize
                                    |> Maybe.map String.fromInt
                                    |> Maybe.map (\s -> s ++ " kb")
                                    |> Maybe.withDefault "0 kb"
                                )
                            )
                        ]
                    ]
                , row
                    [ spacing 15 ]
                    [ Input.button (buttonStyle True)
                        { onPress = Just ResetImageController
                        , label = text "Nouveau fichier"
                        }
                    , Input.button (buttonStyle True)
                        { onPress = Just (ChangeMode ImagePicker)
                        , label = text "Retour"
                        }
                    ]
                , text "Aperçu: "
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



--uploadImage : Image -> Cmd Msg
--uploadImage file =
--    Http.send UploadResult (fileUploadRequest file)
--fileUploadRequest : Image -> Http.Request ()
--fileUploadRequest { contents, filename } =
--    let
--        body =
--            Encode.object
--                [ ( "contents", Encode.string contents )
--                , ( "filename", Encode.string filename )
--                ]
--    in
--    Http.post "fileUpload.php" (jsonBody body) (Decode.succeed ())


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


toogleButtonStyle isPressed isActive =
    [ Border.rounded 5
    , Font.center
    , centerY
    , padding 5
    , focused [ Border.glow (rgb 1 1 1) 0 ]
    ]
        ++ (if isActive then
                [ Background.color (rgb 0.9 0.9 0.9)
                , Border.width 1
                , Border.color (rgb 0.9 0.9 0.9)
                , mouseOver
                    [ Font.color (rgb 0.3 0.3 0.3)
                    ]
                ]
                    ++ (if isPressed then
                            []
                        else
                            [ Background.color (rgb 1 1 1)
                            , Border.width 1
                            , Border.color (rgb 0.9 0.9 0.9)
                            ]
                       )
            else
                [ Background.color (rgb 0.95 0.95 0.95)
                , Font.color (rgb 0.7 0.7 0.7)
                , htmlAttribute <| HtmlAttr.style "cursor" "default"
                , Border.width 1
                , Border.color (rgb 0.95 0.95 0.95)
                ]
           )


textInputStyle =
    [ width (px 250)
    , paddingXY 5 5
    , spacing 15
    , focused [ Border.glow (rgb 1 1 1) 0 ]
    ]


property name value =
    htmlAttribute <| HtmlAttr.property name value


noAttr =
    htmlAttribute <| HtmlAttr.class ""


noHtmlAttr =
    HtmlAttr.class ""


iconSize =
    18
