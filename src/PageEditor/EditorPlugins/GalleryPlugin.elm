port module PageEditor.EditorPlugins.GalleryPlugin exposing (..)

import Auth.AuthPlugin exposing (LogInfo)
import Dict exposing (..)
import Document.Document as Document exposing (..)
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
    , files : List File
    , base64Pics : Dict String String
    , processingQueue : List ( String, String )
    , idleWorkers : List Int
    , busyWorkers : List Int
    }


type Msg
    = ImagesRequested
    | ImagesSelected File (List File)
    | Base64Img String String
    | ImageProcessed Decode.Value
    | NoOp


init : Maybe GalleryMeta -> Int -> (Msg -> msg) -> Model msg
init mbGalleryMeta availableThreads externalMsg =
    { externalMsg = externalMsg
    , files = []
    , base64Pics = Dict.empty
    , processingQueue = []
    , idleWorkers = List.range 0 (availableThreads - 1)
    , busyWorkers = []
    }


update : Msg -> Model msg -> ( Model msg, Cmd msg, Maybe (EditorPluginResult GalleryMeta) )
update msg model =
    case msg of
        ImagesRequested ->
            ( model
            , Cmd.map model.externalMsg selectImages
            , Nothing
            )

        ImagesSelected first remainings ->
            let
                files =
                    first :: remainings
            in
            ( { model | files = files }
            , List.map (\f -> ( File.name f, File.toUrl f )) files
                |> List.map (\( fn, t ) -> Task.perform (Base64Img fn) t)
                |> Cmd.batch
                |> Cmd.map model.externalMsg
            , Nothing
            )

        Base64Img filename data ->
            case model.idleWorkers of
                [] ->
                    ( { model
                        | processingQueue = ( filename, data ) :: model.processingQueue
                      }
                    , Cmd.none
                    , Nothing
                    )

                nextWorker :: rest ->
                    let
                        packedData =
                            Encode.object
                                [ ( "nextWorker", Encode.int nextWorker )
                                , ( "imageData", Encode.string data )
                                , ( "filename", Encode.string filename )
                                ]
                    in
                    ( { model
                        | base64Pics = Dict.insert filename data model.base64Pics
                        , idleWorkers = rest
                        , busyWorkers = nextWorker :: model.busyWorkers
                      }
                    , Cmd.map model.externalMsg (toImageProcessor packedData)
                    , Nothing
                    )

        ImageProcessed json ->
            case Decode.decodeValue decodeProcessedData json of
                Ok { workerId, imageData, filename } ->
                    let
                        workers =
                            if model.processingQueue == [] then
                                workerId :: model.idleWorkers
                            else
                                model.idleWorkers

                        ( cmd, processingQueue ) =
                            case model.processingQueue of
                                [] ->
                                    ( Cmd.none, [] )

                                data :: rest ->
                                    ( Cmd.map model.externalMsg
                                        (toImageProcessor <|
                                            Encode.object
                                                [ ( "nextWorker", Encode.int workerId )
                                                , ( "imageData", Encode.string imageData )
                                                , ( "filename", Encode.string filename )
                                                ]
                                        )
                                    , rest
                                    )
                    in
                    ( { model
                        | idleWorkers = workers
                        , busyWorkers = List.Extra.remove workerId model.busyWorkers
                        , processingQueue = processingQueue
                      }
                    , cmd
                    , Nothing
                    )

                _ ->
                    ( model
                    , Cmd.none
                    , Nothing
                    )

        NoOp ->
            ( model
            , Cmd.none
            , Nothing
            )


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
            ]
            (column
                [ padding 15
                , spacing 15
                , alignTop
                ]
                [ Input.button
                    (buttonStyle True)
                    { onPress = Just ImagesRequested
                    , label = text "Charger images"
                    }
                , column
                    []
                    (List.map
                        (\( fn, d ) ->
                            image [] { src = d, description = fn }
                        )
                        (Dict.toList
                            model.base64Pics
                        )
                    )
                ]
            )



-------------------------------------------------------------------------------
-------------------
-- File handling --
-------------------


selectImages : Cmd Msg
selectImages =
    Select.files [ "image/png", "image/jpg" ] ImagesSelected



-------------------------------------------------------------------------------
-------------------
-- Json Handling --
-------------------


decodeProcessedData : Decode.Decoder { workerId : Int, filename : String, imageData : String }
decodeProcessedData =
    Decode.map3 (\wId fn im -> { workerId = wId, filename = fn, imageData = im })
        (Decode.field "workerId" Decode.int)
        (Decode.field "filename" Decode.string)
        (Decode.field "imageData" Decode.string)
