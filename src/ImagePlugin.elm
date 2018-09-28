module ImagePlugin exposing (..)

import Browser exposing (element)
import Dict exposing (..)
import Document exposing (..)
import DocumentEditorHelpers exposing (..)
import DummyFileSys exposing (dummyImageList)
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
    { mode : Mode

    ----------------------------
    -- Image Attribute Editor --
    ----------------------------
    , mbCaption : Maybe String
    , alignment : Alignment
    , mbImageMeta : Maybe ImageMeta
    , imageAttrs : List DocAttribute

    ---------------------------
    -- Internal Image Picker --
    ---------------------------
    , selectedImage : Maybe ( String, ( Int, Int ) )

    ---------------------------------------
    -- Image Controller (load and resize)--
    ---------------------------------------
    , id : String
    , mbOriImageWidth : Maybe Int
    , mbOriImageHeight : Maybe Int
    , mbOriFileSize : Maybe Int
    , desiredWidth : Maybe Int
    , desiredHeight : Maybe Int
    , desiredFilename : Maybe String
    , desiredRotationAngle : Int
    , sliderValue : Float
    , needToResize : Bool
    , needToRotate : Bool
    , canResize : Bool
    , mbImageFromFile : Maybe ImageFromFile
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


type Msg
    = ---------------------------
      -- Image Attribute Editor--
      ---------------------------
      SetAlignment Alignment
    | SetCaption String
      ------------------
      -- Image Picker --
      ------------------
    | SelectImage ( String, ( Int, Int ) )
    | ConfirmSelected
      ---------------------
      -- ImageController --
      ---------------------
    | FileRead ImageFromFile
    | ImageRead ImageFromFile
    | UploadResult (Result Error ())
    | RotateRight
    | RotateLeft
    | Resize Float
    | SetResize
    | SetFilename String
    | ResetImageController
    | ConfirmNewImage
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



--main : Program () Model Msg
--main =
--    Browser.element
--        { init = (_ -> init Nothing)
--        , update =
--            \model msg ->
--                let
--                    ( newModel, cmd, maybeOutput ) =
--                        update model msg
--                in
--                ( newModel, cmd )
--        , view = view { picListing = [] }
--        , subscriptions = subscriptions
--        }


init : Maybe ( ImageMeta, List DocAttribute ) -> ( Model, Cmd Msg )
init mbInput =
    ( { mode = ImageAttributeEditor

      ----------------------------
      -- Image Attribute Editor --
      ----------------------------
      , mbCaption =
            Maybe.andThen (.caption << Tuple.first) mbInput
      , alignment =
            Maybe.map (findAlignment << Tuple.second) mbInput
                |> Maybe.withDefault ACenter
      , mbImageMeta =
            Maybe.map Tuple.first mbInput
      , imageAttrs =
            Maybe.map Tuple.second mbInput
                |> Maybe.withDefault []

      ---------------------------
      -- Internal Image Picker --
      ---------------------------
      , selectedImage = Nothing

      ---------------------------------------
      -- Image Controller (load and resize)--
      ---------------------------------------
      , id = "InputId"
      , mbOriImageWidth = Nothing
      , mbOriImageHeight = Nothing
      , mbOriFileSize = Nothing
      , desiredWidth = Nothing
      , desiredHeight = Nothing
      , desiredFilename = Nothing
      , desiredRotationAngle = 0
      , sliderValue = 100
      , needToResize = False
      , needToRotate = False
      , canResize = False
      , mbImageFromFile = Nothing
      }
    , Cmd.none
    )


update msg model =
    case msg of
        ---------------------------
        -- Image Attribute Editor--
        ---------------------------
        SetAlignment alignment ->
            ( { model | alignment = alignment }
            , Cmd.none
            , Nothing
            )

        SetCaption caption ->
            ( { model | mbCaption = Just caption }
            , Cmd.none
            , Nothing
            )

        ------------------
        -- Image Picker --
        ------------------
        SelectImage data ->
            ( { model | selectedImage = Just data }
            , Cmd.none
            , Nothing
            )

        ConfirmSelected ->
            case model.selectedImage of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just ( url, ( width, height ) ) ->
                    let
                        newImageMeta =
                            { src = UrlSrc ("images/" ++ url)
                            , caption =
                                model.mbCaption
                            , size =
                                { imgWidth = width
                                , imgHeight = height
                                }
                            }
                    in
                    ( { model
                        | mbImageMeta = Just newImageMeta
                        , mode = ImageAttributeEditor
                      }
                    , Cmd.none
                    , Nothing
                    )

        ---------------------
        -- ImageController --
        ---------------------
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
            , Nothing
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
            , Nothing
            )

        UploadResult (Ok ()) ->
            ( model, Cmd.none, Nothing )

        UploadResult (Err e) ->
            ( model, Cmd.none, Nothing )

        RotateRight ->
            ( { model
                | desiredRotationAngle =
                    modBy 360 (90 + model.desiredRotationAngle)
                , needToRotate = True
                , mbOriImageWidth = model.mbOriImageHeight
                , mbOriImageHeight = model.mbOriImageWidth
                , desiredWidth = model.desiredHeight
                , desiredHeight = model.desiredWidth
              }
            , Cmd.none
            , Nothing
            )

        RotateLeft ->
            ( { model
                | desiredRotationAngle =
                    modBy 360 (model.desiredRotationAngle - 90)
                , needToRotate = True
                , mbOriImageWidth = model.mbOriImageHeight
                , mbOriImageHeight = model.mbOriImageWidth
                , desiredWidth = model.desiredHeight
                , desiredHeight = model.desiredWidth
              }
            , Cmd.none
            , Nothing
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
                    , Nothing
                    )

                _ ->
                    ( model, Cmd.none, Nothing )

        SetResize ->
            ( { model | needToResize = True }, Cmd.none, Nothing )

        SetFilename filename ->
            ( { model | desiredFilename = Just filename }
            , Cmd.none
            , Nothing
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
            , Nothing
            )

        ConfirmNewImage ->
            case model.mbImageFromFile of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just { contents, filename, width, height } ->
                    let
                        newImageMeta =
                            { src = Inline filename contents
                            , caption = model.mbCaption
                            , size =
                                { imgWidth = width
                                , imgHeight = height
                                }
                            }
                    in
                    ( { model
                        | mode = ImageAttributeEditor
                        , mbImageMeta = Just newImageMeta
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
                    , Nothing
                    )

        ----------
        -- Misc --
        ----------
        ChangeMode mode ->
            ( { model | mode = mode }
            , Cmd.none
            , Nothing
            )

        SaveAndQuit ->
            case model.mbImageMeta of
                Nothing ->
                    ( model, Cmd.none, Nothing )

                Just imageMeta ->
                    ( model
                    , Cmd.none
                    , Just <|
                        PluginData
                            ( imageMeta
                            , setAligment model.alignment model.imageAttrs
                            )
                    )

        Quit ->
            ( model
            , Cmd.none
            , Just PluginQuit
            )

        NoOp ->
            ( model, Cmd.none, Nothing )


view config model =
    --layout
    --    []
    --<|
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
        , alignTop
        ]
        [ text "Insérer / Modifier une Image:"
        , text "Alignement: "
        , row
            [ spacing 15 ]
            [ Input.button (toogleButtonStyle (model.alignment == ALeft) True)
                { onPress = Just (SetAlignment ALeft)
                , label = el [] (html <| alignLeft iconSize)
                }
            , Input.button (toogleButtonStyle (model.alignment == ACenter) True)
                { onPress = Just (SetAlignment ACenter)
                , label = el [] (html <| alignCenter iconSize)
                }
            , Input.button (toogleButtonStyle (model.alignment == ARight) True)
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
                    Maybe.withDefault "" model.mbCaption
                , placeholder = Nothing
                , label =
                    Input.labelLeft [ centerY ]
                        (el [ width (px 110) ] (text "Légende: "))
                }
            ]
        , row [ spacing 15 ]
            [ case model.mbImageMeta of
                Nothing ->
                    Element.none

                Just _ ->
                    text "Aperçu: "
            , Input.button (buttonStyle True)
                { onPress = Just (ChangeMode ImagePicker)
                , label =
                    case model.mbImageMeta of
                        Nothing ->
                            el [] (text "Nouvelle Image")

                        Just _ ->
                            el [] (text "Remplacer Image")
                }
            ]
        , el
            [ width (maximum 650 fill)
            , height (maximum 550 fill)
            , scrollbars
            ]
            (image
                [ centerY
                , centerX
                ]
                { src =
                    Maybe.map .src model.mbImageMeta
                        |> Maybe.map
                            (\src ->
                                case src of
                                    Inline _ base64 ->
                                        base64

                                    UrlSrc url ->
                                        url
                            )
                        |> Maybe.withDefault ""
                , description =
                    Maybe.withDefault "" model.mbCaption
                }
            )
        , row
            [ spacing 15
            ]
            [ Input.button (buttonStyle True)
                { onPress = Just Quit
                , label = text "Quitter"
                }
            , Input.button (buttonStyle True)
                { onPress = Just SaveAndQuit
                , label = text "Valider et Quitter"
                }
            ]
        ]


imagePickerView config model =
    column
        [ spacing 15
        , Font.size 16
        , padding 15
        , alignTop
        ]
        [ row [ width fill ]
            [ text "Choisir image existante: "
            , Maybe.map
                (\( url, ( w, h ) ) ->
                    el [ Element.alignRight ]
                        (text <|
                            String.fromInt w
                                ++ "x"
                                ++ String.fromInt h
                        )
                )
                model.selectedImage
                |> Maybe.withDefault Element.none
            ]
        , row
            [ spacing 15
            ]
            [ column
                [ width (px 200)
                , height (px 300)
                , Border.width 1
                , Border.color (rgb 0.8 0.8 0.8)
                , scrollbarY
                , Background.color (rgb 1 1 1)
                ]
                (List.map (entryView model.selectedImage SelectImage) dummyImageList)
            , el
                [ width (px 350)
                , height (px 300)
                , Border.width 1
                , Border.color (rgb 0.8 0.8 0.8)
                , Background.color (rgb 1 1 1)
                , case model.selectedImage of
                    Nothing ->
                        noAttr

                    Just ( url, ( w, h ) ) ->
                        Background.uncropped ("images/" ++ url)
                ]
                Element.none
            ]
        , row
            [ spacing 15
            ]
            [ Input.button (buttonStyle True)
                { onPress = Just (ChangeMode (ImageController FileReader))
                , label = text "Charger une nouvelle image"
                }
            , Input.button
                (buttonStyle True)
                { onPress = Just (ChangeMode ImageAttributeEditor)
                , label = text "Retour"
                }
            , Input.button (buttonStyle True)
                { onPress = Just ConfirmSelected
                , label = text "Valider"
                }
            ]
        ]



--entryView : Maybe ( String, ( Int, Int ) ) -> (String -> Msg) -> ( String, ( Int, Int ) ) -> Element.Element Msg


entryView mbSel msg (( url, ( w, h ) ) as e) =
    el
        [ Events.onClick (msg e)
        , pointer
        , mouseOver
            [ Font.color (rgb 1 1 1)
            , Background.color (rgb 0.7 0.7 0.7)
            ]
        , case mbSel of
            Just sel ->
                if sel == e then
                    Background.color (rgb 0.8 0.8 0.8)
                else
                    Background.color (rgb 1 1 1)

            _ ->
                Background.color (rgb 1 1 1)
        , width fill
        , paddingXY 15 5
        ]
        (text url)


imageControllerView model imgContMode =
    column
        [ spacing 15
        , Font.size 16
        , padding 15
        , alignTop
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
        , case imgContMode of
            FileReader ->
                Input.button
                    (buttonStyle True)
                    { onPress = Just (ChangeMode ImageAttributeEditor)
                    , label = text "Retour"
                    }

            Editor ->
                Element.none
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
                    , Input.button (buttonStyle True)
                        { onPress = Just ConfirmNewImage
                        , label = text "Valider"
                        }
                    ]
                , text "Aperçu: "
                , el
                    [ width (maximum 650 fill)
                    , height (maximum 550 fill)
                    , scrollbars
                    ]
                    (image
                        [ centerY
                        , centerX
                        ]
                        { src = f.contents
                        , description = f.filename
                        }
                    )
                ]

        _ ->
            text "no file data"


subscriptions model =
    Sub.batch []


iconSize =
    18
