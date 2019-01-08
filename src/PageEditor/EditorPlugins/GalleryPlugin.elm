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
    { externalMsg : Msg -> msg
    , fileSizes : Dict String Int
    , base64Pics : Dict String String
    , processedPics : Dict String ProcessedImage
    , processing : Bool
    , processingQueue : List ( String, String )
    }


type Msg
    = ImagesRequested
    | ImagesSelected File (List File)
    | Base64Img String String
    | ImageProcessed Decode.Value
    | Quit
    | NoOp


init : Maybe GalleryMeta -> Int -> (Msg -> msg) -> Model msg
init mbGalleryMeta availableThreads externalMsg =
    { externalMsg = externalMsg
    , fileSizes = Dict.empty
    , base64Pics = Dict.empty
    , processedPics = Dict.empty
    , processing = False
    , processingQueue = []
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
                [ debug config model ]
            )


debug config model =
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


pickExistingFolder :
    { a
        | fileExplorer : FileExplorer.Model msg
        , logInfo : LogInfo
        , zone : Time.Zone
    }
    -> Model msg
    -> Element Msg
pickExistingFolder config model =
    column
        (itemStyle
            ++ [ spacing 15
               , width fill
               ]
        )
        [ row
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
