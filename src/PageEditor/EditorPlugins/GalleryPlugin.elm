port module PageEditor.EditorPlugins.GalleryPlugin exposing (..)

import Auth.AuthPlugin exposing (LogInfo)
import Dict exposing (..)
import Document.Document as Document exposing (..)
import Document.Json.DocumentDecoder as DocumentDecoder
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Lazy as Lazy
import Element.Region as Region
import File exposing (..)
import File.Select as Select exposing (..)
import FileExplorer.FileExplorer as FileExplorer
import Filesize exposing (..)
import Html exposing (Html)
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.Icons exposing (checkSquare, square)
import Json.Decode as Decode
import Json.Encode as Encode
import List.Extra exposing (remove)
import PageEditor.Internals.DocumentEditorHelpers exposing (..)
import Task exposing (..)
import Time exposing (Zone)
import UUID exposing (canonical)


port toImageProcessor : Encode.Value -> Cmd msg


port processedImages : (Decode.Value -> msg) -> Sub msg


subscription : Model msg -> Sub Msg
subscription model =
    processedImages ImageProcessed


type alias Model msg =
    { pluginState : PluginState
    , fileSizes : Dict String Int
    , base64Pics : Dict String String
    , processedPics : Dict String ProcessedImage
    , processing : Bool
    , processingQueue : List ( String, String )
    , galleryTitleInput : Maybe String
    , keepHQAssets : Bool
    , output : Maybe GalleryMeta
    , externalMsg : Msg -> msg
    }


type Msg
    = ImagesRequested
    | ImagesSelected File (List File)
    | Base64Img String String
    | ImageProcessed Decode.Value
    | GalleryTitlePrompt String
    | ToogleKeepHqAssets Bool
    | Quit
    | NoOp


type PluginState
    = Home
    | ImageProcessing
    | UploadConfirmation
    | GalleryEditor


init : Maybe GalleryMeta -> Int -> (Msg -> msg) -> Model msg
init mbGalleryMeta availableThreads externalMsg =
    { pluginState =
        if mbGalleryMeta == Nothing then
            Home
        else
            GalleryEditor
    , fileSizes = Dict.empty
    , base64Pics = Dict.empty
    , processedPics = Dict.empty
    , processing = False
    , processingQueue = []
    , galleryTitleInput = Nothing
    , keepHQAssets = False
    , output = mbGalleryMeta
    , externalMsg = externalMsg
    }


update : Msg -> Model msg -> ( Model msg, Cmd msg, Maybe (EditorPluginResult GalleryMeta) )
update msg model =
    case msg of
        ImagesRequested ->
            ( model
            , Cmd.map model.externalMsg selectImages
            , Nothing
            )

        ImagesSelected first remaining ->
            let
                files =
                    first :: remaining

                fileSizes =
                    List.foldr
                        (\f acc ->
                            Dict.insert
                                (File.name f)
                                (File.size f)
                                acc
                        )
                        model.fileSizes
                        files

                --first :: remaining
            in
            ( { model
                | fileSizes = fileSizes
              }
            , List.map (\f -> ( File.name f, File.toUrl f )) files
                |> List.map (\( fn, t ) -> Task.perform (Base64Img fn) t)
                |> Cmd.batch
                |> Cmd.map model.externalMsg
            , Nothing
            )

        Base64Img filename data ->
            let
                ( cmd, processingQueue ) =
                    if model.processing then
                        ( Cmd.none
                        , ( filename, data ) :: model.processingQueue
                        )
                    else
                        ( processCmd model filename data
                        , model.processingQueue
                        )
            in
            ( { model
                | base64Pics = Dict.insert filename data model.base64Pics
                , processingQueue = processingQueue
                , processing = True
                , pluginState = ImageProcessing
              }
            , cmd
            , Nothing
            )

        ImageProcessed json ->
            case Decode.decodeValue decodeProcessedData json of
                Ok ({ content, filename } as pi) ->
                    let
                        ( cmd, processingQueue, processing ) =
                            case model.processingQueue of
                                [] ->
                                    ( Cmd.none, [], False )

                                ( filename_, data_ ) :: rest ->
                                    ( processCmd model filename_ data_
                                    , rest
                                    , True
                                    )
                    in
                    ( { model
                        | processingQueue = processingQueue
                        , processing = processing
                        , processedPics =
                            Dict.insert filename pi model.processedPics
                        , base64Pics = Dict.remove filename model.base64Pics
                      }
                    , cmd
                    , Nothing
                    )

                _ ->
                    ( model
                    , Cmd.none
                    , Nothing
                    )

        Quit ->
            ( model
            , Cmd.none
            , Just EditorPluginQuit
            )

        GalleryTitlePrompt s ->
            ( { model | galleryTitleInput = Just s }
            , Cmd.none
            , Nothing
            )

        ToogleKeepHqAssets b ->
            ( { model | keepHQAssets = b }
            , Cmd.none
            , Nothing
            )

        NoOp ->
            ( { model
                | base64Pics = Dict.empty
                , processedPics = Dict.empty
                , processing = False
                , processingQueue = []
              }
            , Cmd.none
            , Nothing
            )


processCmd model filename data =
    Cmd.map model.externalMsg
        (toImageProcessor <|
            Encode.object
                [ ( "imageData", Encode.string data )
                , ( "filename", Encode.string filename )
                ]
        )



-------------------------------------------------------------------------------
--------------------
-- View functions --
--------------------


view :
    { a
        | fileExplorer : FileExplorer.Model msg
        , logInfo : LogInfo
        , zone : Time.Zone
    }
    -> Model msg
    -> Element msg
view config model =
    Element.map model.externalMsg <|
        el
            [ width fill
            , height fill
            , scrollbarY
            , padding 15
            ]
            (column
                ([ spacing 15
                 , alignTop
                 , width (px 800)
                 ]
                    ++ containerStyle
                )
                (case model.pluginState of
                    Home ->
                        homeView config model

                    UploadConfirmation ->
                        uploadConfirmationView config model

                    ImageProcessing ->
                        imageProcessingView config model

                    GalleryEditor ->
                        galleryEditorView config model
                )
            )


debug config model =
    let
        phototheque =
            FileExplorer.indexPhototheque config.fileExplorer
                |> Dict.toList

        galleryPreview ( name, pics ) =
            column
                [ spacing 15
                , alignTop
                ]
                (el [ Font.bold ]
                    (text name)
                    :: List.map (text << Tuple.first) pics
                )
    in
    column
        (itemStyle
            ++ [ spacing 15
               , width fill
               ]
        )
        [ text <|
            "Processing: "
                ++ (if model.processing then
                        "on"
                    else
                        "off"
                   )
        , text <| "processed: " ++ String.fromInt (Dict.size model.processedPics)
        , text <| "remaining: " ++ String.fromInt (List.length model.processingQueue)
        , wrappedRow
            [ spacing 15 ]
            (List.map galleryPreview phototheque)
        , Input.button
            (buttonStyle True)
            { onPress = Just ImagesRequested
            , label = text "Charger images"
            }
        , column
            [ spacing 15 ]
            (List.map
                (\p ->
                    row
                        [ spacing 15 ]
                        [ el
                            [ width (px 233)
                            , height (px 175)
                            , Background.uncropped p.content
                            ]
                            Element.none
                        , column
                            [ alignTop
                            , spacing 15
                            ]
                            [ text p.filename
                            , text <|
                                "Taille originale: "
                                    ++ (Dict.get p.filename model.fileSizes
                                            |> Maybe.map Filesize.format
                                            |> Maybe.withDefault "Erreur"
                                       )
                            , text <|
                                "Taille: "
                                    ++ Filesize.format p.size
                            ]
                        ]
                )
                (Dict.values model.processedPics)
            )
        , Input.button
            (buttonStyle True)
            { onPress = Just Quit
            , label = text "Retour"
            }
        ]



-------------------------------------------------------------------------------


homeView :
    { a
        | fileExplorer : FileExplorer.Model msg
        , logInfo : LogInfo
        , zone : Time.Zone
    }
    -> Model msg
    -> List (Element Msg)
homeView config model =
    [ column
        (itemStyle
            ++ [ spacing 15
               , width fill
               ]
        )
        [ el
            [ Font.bold
            , Font.size 18
            ]
            (text "Créer une nouvelle gallerie")
        , row
            [ width fill
            , spacing 15
            ]
            [ Input.text
                textInputStyle
                { onChange = GalleryTitlePrompt
                , text =
                    model.galleryTitleInput
                        |> Maybe.withDefault ""
                , placeholder =
                    Just <| Input.placeholder [] (text "Nom de la galerie")
                , label =
                    Input.labelHidden ""
                }
            , Input.checkbox
                [ spacing 5 ]
                { onChange = ToogleKeepHqAssets
                , icon =
                    \b ->
                        if b then
                            el [ Font.color grey1 ]
                                (html <| checkSquare 18)
                        else
                            el [ Font.color grey1 ]
                                (html <| square 18)
                , checked = model.keepHQAssets
                , label =
                    Input.labelLeft [] (text "images HD")
                }
            , Input.button
                (buttonStyle (model.galleryTitleInput /= Nothing))
                { onPress = Just ImagesRequested
                , label = text "Nouvelle galerie"
                }
            ]
        ]
    , galleryPickerView config model
    , row
        (itemStyle
            ++ [ spacing 15
               , width fill
               ]
        )
        [ Input.button
            (buttonStyle True)
            { onPress = Just Quit
            , label = text "Retour"
            }
        ]
    ]


galleryPickerView :
    { a
        | fileExplorer : FileExplorer.Model msg
        , logInfo : LogInfo
        , zone : Time.Zone
    }
    -> Model msg
    -> Element Msg
galleryPickerView config model =
    column
        (itemStyle
            ++ [ spacing 15
               , width fill
               ]
        )
        []



-------------------------------------------------------------------------------


imageProcessingView :
    { a
        | fileExplorer : FileExplorer.Model msg
        , logInfo : LogInfo
        , zone : Time.Zone
    }
    -> Model msg
    -> List (Element Msg)
imageProcessingView config model =
    let
        phototheque =
            FileExplorer.indexPhototheque config.fileExplorer
                |> Dict.toList

        galleryPreview ( name, pics ) =
            column
                [ spacing 15
                , alignTop
                ]
                (el [ Font.bold ]
                    (text name)
                    :: List.map (text << Tuple.first) pics
                )
    in
    []



-------------------------------------------------------------------------------


uploadConfirmationView :
    { a
        | fileExplorer : FileExplorer.Model msg
        , logInfo : LogInfo
        , zone : Time.Zone
    }
    -> Model msg
    -> List (Element Msg)
uploadConfirmationView config model =
    []



-------------------------------------------------------------------------------


galleryEditorView :
    { a
        | fileExplorer : FileExplorer.Model msg
        , logInfo : LogInfo
        , zone : Time.Zone
    }
    -> Model msg
    -> List (Element Msg)
galleryEditorView config model =
    []



-------------------------------------------------------------------------------
-------------------
-- File handling --
-------------------


selectImages : Cmd Msg
selectImages =
    Select.files [ "image/png", "image/jpg" ] ImagesSelected



-------------------------------------------------------------------------------
--------------------
-- Http functions --
--------------------
-------------------------------------------------------------------------------
-------------------
-- Json Handling --
-------------------


type alias ProcessedImage =
    { filename : String
    , content : String
    , thumb : String
    , size : Int
    , width : Int
    , height : Int
    }


decodeProcessedData : Decode.Decoder ProcessedImage
decodeProcessedData =
    Decode.map6 ProcessedImage
        (Decode.field "filename" Decode.string)
        (Decode.field "content" Decode.string)
        (Decode.field "thumb" Decode.string)
        (Decode.field "size" Decode.int)
        (Decode.field "width" Decode.int)
        (Decode.field "height" Decode.int)


decodeGalleryMeta : Decode.Decoder Document.GalleryMeta
decodeGalleryMeta =
    Decode.map3 Document.GalleryMeta
        (Decode.field "uuid" DocumentDecoder.decodeUUID)
        (Decode.field "title" Decode.string)
        (Decode.field "images" (Decode.list DocumentDecoder.decodeImageMeta))



-------------------------------------------------------------------------------
------------------
-- Misc Helpers --
------------------


containerStyle : List (Attribute msg)
containerStyle =
    [ padding 15
    , Background.color grey6
    , Border.rounded 5
    ]


itemStyle : List (Attribute msg)
itemStyle =
    [ padding 15
    , Background.color grey7
    , Border.rounded 5
    ]
