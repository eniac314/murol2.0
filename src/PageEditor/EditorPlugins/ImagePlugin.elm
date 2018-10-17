module PageEditor.EditorPlugins.ImagePlugin exposing (..)

import Browser exposing (element)
import Dict exposing (..)
import Document.Document exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Keyed as Keyed
import Element.Lazy as Lazy
import Element.Region as Region
import FileExplorer.FileExplorer as FileExplorer
import Html as Html
import Html.Attributes as HtmlAttr
import Html.Events as HtmlEvents
import Http exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.Icons exposing (alignCenter, alignLeft, alignRight, rotateCcw, rotateCw)
import Json.Decode as Decode
import Json.Encode as Encode
import PageEditor.Internals.DocumentEditorHelpers exposing (..)
import PageEditor.Internals.DummyFileSys exposing (dummyImageList)


type alias Model msg =
    { mode : Mode
    , externalMsg : Msg -> msg

    ----------------------------
    -- Image Attribute Editor --
    ----------------------------
    , mbCaption : Maybe String
    , alignment : Alignment
    , mbImageMeta : Maybe ImageMeta
    , imageAttrs : List DocAttribute
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


type Msg
    = ---------------------------
      -- Image Attribute Editor--
      ---------------------------
      SetAlignment Alignment
    | SetCaption String
    | SelectImage { src : String, width : Int, height : Int }
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


init mbInput externalMsg =
    ( { mode = ImageAttributeEditor
      , externalMsg = externalMsg

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
      }
    , Cmd.map externalMsg <|
        Cmd.none
    )


open config mbInput externalMsg =
    ( { mode = ImageAttributeEditor
      , externalMsg = externalMsg

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
      }
    , Cmd.none
    )


update config msg model =
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

        ----------
        -- Misc --
        ----------
        SelectImage { src, width, height } ->
            let
                newImageMeta =
                    { src = UrlSrc src
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
              }
            , Cmd.none
            , Nothing
            )

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
                        EditorPluginData
                            ( imageMeta
                            , setAligment model.alignment model.imageAttrs
                            )
                    )

        Quit ->
            ( model
            , Cmd.none
            , Just EditorPluginQuit
            )

        NoOp ->
            ( model, Cmd.none, Nothing )


view config model =
    column
        [ height fill
        , width fill
        , scrollbarY
        ]
        [ case model.mode of
            ImageAttributeEditor ->
                Element.map model.externalMsg <|
                    imageAttributeEditorView config model

            ImagePicker ->
                imagePickerView config model
        ]


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
            , height (maximum 525 fill)
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
        [ height fill
        , paddingEach
            { top = 0
            , bottom = 15
            , left = 0
            , right = 0
            }
        ]
        [ FileExplorer.view
            { maxHeight =
                config.maxHeight - 50
            , zone = config.zone
            , logInfo = config.logInfo
            , mode = FileExplorer.ReadWrite FileExplorer.ImagesRoot
            }
            config.fileExplorer
        , row
            [ spacing 15
            , paddingXY 15 0
            ]
            [ Input.button
                (buttonStyle True)
                { onPress = Just (model.externalMsg <| ChangeMode ImageAttributeEditor)
                , label = text "Retour"
                }
            , Input.button (buttonStyle (FileExplorer.getSelectedImage config.fileExplorer /= Nothing))
                { onPress =
                    FileExplorer.getSelectedImage config.fileExplorer
                        |> Maybe.map (model.externalMsg << SelectImage)
                , label = text "Valider"
                }
            ]
        ]


subscriptions model =
    Sub.batch []


iconSize =
    18
