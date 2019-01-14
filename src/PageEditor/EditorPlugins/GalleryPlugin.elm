port module PageEditor.EditorPlugins.GalleryPlugin exposing (..)

import Auth.AuthPlugin exposing (LogInfo(..))
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
import Http exposing (..)
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.Icons exposing (checkSquare, square)
import Json.Decode as Decode
import Json.Encode as Encode
import List.Extra exposing (remove)
import PageEditor.Internals.DocumentEditorHelpers exposing (..)
import Random exposing (..)
import String.Extra exposing (toSentenceCase)
import Task exposing (..)
import Time exposing (Posix, Zone, now, posixToMillis)
import UUID exposing (canonical)


port toImageProcessor : Encode.Value -> Cmd msg


port processedImages : (Decode.Value -> msg) -> Sub msg


subscription : Model msg -> Sub Msg
subscription model =
    Sub.batch
        ([ processedImages ImageProcessed
         ]
            ++ Dict.foldr
                (\fn _ acc -> Http.track fn (GotProgress fn) :: acc)
                []
                model.uploadProgress
        )


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
    , seed : Maybe Random.Seed
    , uploadProgress : Dict String ( Int, Maybe UploadStatus )
    , externalMsg : Msg -> msg
    }


type Msg
    = ImagesRequested
    | ImagesSelected File (List File)
    | Base64Img String String
    | ImageProcessed Decode.Value
    | GalleryTitlePrompt String
    | CaptionPrompt String String
    | ToogleKeepHqAssets Bool
    | PickGallery String (List ( String, String ))
    | SetInitialSeed Posix
    | GotProgress String Http.Progress
    | Uploaded String (Result Http.Error UploadStatus)
    | Reset
    | GoToUpload
    | GoToEdit
    | SaveAndQuit
    | Quit
    | NoOp


type PluginState
    = Home
    | ImageProcessing
    | Upload
    | GalleryEditor


init : Maybe GalleryMeta -> Int -> (Msg -> msg) -> ( Model msg, Cmd msg )
init mbGalleryMeta availableThreads externalMsg =
    ( { pluginState =
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
      , seed = Nothing
      , uploadProgress = Dict.empty
      , externalMsg = externalMsg
      }
    , Cmd.map externalMsg <|
        Cmd.batch
            [ Task.perform SetInitialSeed Time.now
            ]
    )


update : { a | logInfo : LogInfo } -> Msg -> Model msg -> ( Model msg, Cmd msg, Maybe (EditorPluginResult GalleryMeta) )
update config msg model =
    case msg of
        ImagesRequested ->
            ( model
            , Cmd.map model.externalMsg selectImages
            , Nothing
            )

        ImagesSelected first remaining ->
            let
                indexName n =
                    String.fromInt n
                        |> String.padLeft 3 '0'
                        |> strCons ".jpg"

                files =
                    first :: remaining

                fileSizes =
                    List.foldr
                        (\( n, f ) acc ->
                            Dict.insert
                                (indexName n)
                                (File.size f)
                                acc
                        )
                        model.fileSizes
                        (List.indexedMap (\n f -> ( n, f )) files)
            in
            ( { model
                | fileSizes = fileSizes
              }
            , List.map (\f -> ( File.name f, File.toUrl f )) files
                |> List.indexedMap
                    (\n ( fn, t ) ->
                        Task.perform
                            (Base64Img
                                (indexName n)
                            )
                            t
                    )
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
                        , base64Pics =
                            if not model.keepHQAssets then
                                Dict.remove filename model.base64Pics
                            else
                                model.base64Pics
                      }
                    , cmd
                    , Nothing
                    )

                _ ->
                    ( model
                    , Cmd.none
                    , Nothing
                    )

        PickGallery title pics ->
            case model.seed of
                Nothing ->
                    ( model
                    , Cmd.none
                    , Nothing
                    )

                Just seed ->
                    let
                        ( newSeed, galleryMeta ) =
                            makeGalleryMeta title pics seed
                    in
                    ( { model
                        | seed = Just newSeed
                        , output = Just galleryMeta
                        , pluginState = GalleryEditor
                      }
                    , Cmd.none
                    , Nothing
                    )

        SetInitialSeed t ->
            ( { model | seed = Just <| Random.initialSeed (posixToMillis t) }
            , Cmd.none
            , Nothing
            )

        GotProgress filename progress ->
            case progress of
                Sending { sent, size } ->
                    ( { model
                        | uploadProgress =
                            Dict.update
                                filename
                                (\mv ->
                                    case mv of
                                        Nothing ->
                                            Nothing

                                        Just ( _, us ) ->
                                            Just ( round <| 100 * toFloat sent / toFloat size, us )
                                )
                                model.uploadProgress
                      }
                    , Cmd.none
                    , Nothing
                    )

                Receiving { received, size } ->
                    ( model
                    , Cmd.none
                    , Nothing
                    )

        Uploaded filename res ->
            case res of
                Ok UploadSuccessful ->
                    ( { model
                        | uploadProgress =
                            Dict.insert
                                filename
                                ( 100, Just UploadSuccessful )
                                model.uploadProgress
                      }
                    , Cmd.none
                    , Nothing
                    )

                Ok (UploadFailure e) ->
                    ( { model
                        | uploadProgress =
                            Dict.update
                                filename
                                (\mv ->
                                    case mv of
                                        Nothing ->
                                            Nothing

                                        Just ( n, _ ) ->
                                            Just ( n, Just <| UploadFailure e )
                                )
                                model.uploadProgress
                      }
                    , Cmd.none
                    , Nothing
                    )

                Err _ ->
                    ( model
                    , Cmd.none
                    , Nothing
                    )

        Reset ->
            ( { model
                | base64Pics = Dict.empty
                , processedPics = Dict.empty
                , fileSizes = Dict.empty
                , processing = False
                , processingQueue = []
                , pluginState = Home
                , output = Nothing
                , uploadProgress = Dict.empty
              }
            , Cmd.none
            , Nothing
            )

        GoToUpload ->
            ( { model
                | pluginState = Upload
                , uploadProgress =
                    Dict.map
                        (\_ _ -> ( 0, Nothing ))
                        model.processedPics
              }
            , case ( config.logInfo, model.galleryTitleInput ) of
                ( LoggedIn info, Just title ) ->
                    Cmd.map model.externalMsg <|
                        Cmd.batch
                            (Dict.foldr
                                (\k v acc ->
                                    uploadImage
                                        title
                                        v.filename
                                        v.content
                                        v.thumb
                                        (if model.keepHQAssets then
                                            Dict.get v.filename model.base64Pics
                                         else
                                            Nothing
                                        )
                                        info.sessionId
                                        :: acc
                                )
                                []
                                model.processedPics
                                |> List.reverse
                            )

                _ ->
                    Cmd.none
            , Nothing
            )

        GoToEdit ->
            case ( model.seed, model.galleryTitleInput ) of
                ( Just seed, Just title ) ->
                    let
                        pics =
                            List.map
                                (\fn ->
                                    ( fn
                                    , "images/phototheque/"
                                        ++ title
                                        ++ "/"
                                        ++ fn
                                    )
                                )
                                (Dict.keys model.processedPics)

                        ( newSeed, galleryMeta ) =
                            makeGalleryMeta title pics seed
                    in
                    ( { model
                        | base64Pics = Dict.empty
                        , processedPics = Dict.empty
                        , fileSizes = Dict.empty
                        , processing = False
                        , processingQueue = []
                        , pluginState = GalleryEditor
                        , seed = Just newSeed
                        , output = Just galleryMeta
                        , uploadProgress = Dict.empty
                      }
                    , Cmd.none
                    , Nothing
                    )

                _ ->
                    ( model
                    , Cmd.none
                    , Nothing
                    )

        SaveAndQuit ->
            case model.output of
                Nothing ->
                    ( model
                    , Cmd.none
                    , Nothing
                    )

                Just galleryMeta ->
                    ( model
                    , Cmd.none
                    , Just (EditorPluginData galleryMeta)
                    )

        Quit ->
            ( { model
                | base64Pics = Dict.empty
                , processedPics = Dict.empty
                , processing = False
                , processingQueue = []
                , output = Nothing
                , uploadProgress = Dict.empty
              }
            , Cmd.none
            , Just EditorPluginQuit
            )

        GalleryTitlePrompt s ->
            ( { model | galleryTitleInput = Just s }
            , Cmd.none
            , Nothing
            )

        CaptionPrompt src caption ->
            case model.output of
                Nothing ->
                    ( model
                    , Cmd.none
                    , Nothing
                    )

                Just output ->
                    let
                        newOutput =
                            { output
                                | images =
                                    List.Extra.updateIf
                                        (\i -> i.src == UrlSrc src)
                                        (\i -> { i | caption = Just caption })
                                        output.images
                            }
                    in
                    ( { model | output = Just newOutput }
                    , Cmd.none
                    , Nothing
                    )

        ToogleKeepHqAssets b ->
            ( { model | keepHQAssets = b }
            , Cmd.none
            , Nothing
            )

        NoOp ->
            ( model
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

                    Upload ->
                        uploadView config model

                    ImageProcessing ->
                        imageProcessingView config model

                    GalleryEditor ->
                        galleryEditorView config model
                )
            )



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
            , label = text "Annuler"
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
    let
        phototheque =
            FileExplorer.indexPhototheque config.fileExplorer
                |> Dict.toList

        galleryPreview ( name, pics ) =
            column
                [ spacing 10
                , padding 10
                , width (px 150)
                , alignTop
                , Background.color grey5
                , mouseOver
                    [ Background.color grey6 ]
                , Border.rounded 5
                , pointer
                , Events.onClick
                    (PickGallery name pics)
                ]
                [ el
                    [ Font.bold
                    , width fill
                    , Font.center
                    , clip
                    ]
                    (text <| toSentenceCase name)
                , el
                    [ width (px 140)
                    , height (px 105)
                    , centerX
                    , List.head pics
                        |> Maybe.map Tuple.second
                        |> Maybe.withDefault ""
                        |> Background.uncropped
                    ]
                    Element.none
                , el
                    [ width fill
                    , Font.center
                    ]
                    (text <| "Nbr images: " ++ String.fromInt (List.length pics))
                ]
    in
    column
        (itemStyle
            ++ [ width fill
               , spacing 15
               ]
        )
        [ el
            [ Font.bold
            , Font.size 18
            ]
            (text "Utiliser une galerie existante")
        , wrappedRow
            [ spacing 15
            , width fill
            ]
            (List.map galleryPreview phototheque)
        ]



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
        canUpload =
            Dict.size model.fileSizes
                == Dict.size model.processedPics
    in
    [ column
        (itemStyle
            ++ [ width fill
               , spacing 15
               ]
        )
        [ el
            []
            (text "Chargement et mise à  l'échelle des images...")
        , el []
            ((Dict.size model.processedPics
                |> String.fromInt
                |> String.padLeft 2 '0'
             )
                |> strCons " \\ "
                |> (Dict.size model.fileSizes
                        |> String.fromInt
                        |> String.padLeft 2 '0'
                        |> strCons
                   )
                |> text
            )
        ]
    , row
        (itemStyle
            ++ [ spacing 15
               , width fill
               ]
        )
        [ Input.button
            (buttonStyle True)
            { onPress = Just Reset
            , label = text "Annuler"
            }
        , Input.button
            (buttonStyle canUpload)
            { onPress =
                if canUpload then
                    Just GoToUpload
                else
                    Nothing
            , label = text "Continuer"
            }
        ]
    ]



-------------------------------------------------------------------------------


uploadView :
    { a
        | fileExplorer : FileExplorer.Model msg
        , logInfo : LogInfo
        , zone : Time.Zone
    }
    -> Model msg
    -> List (Element Msg)
uploadView config model =
    let
        canEdit =
            model.uploadProgress
                |> Dict.foldr
                    (\_ ( _, us ) acc -> us :: acc)
                    []
                |> List.all (\us -> us == Just UploadSuccessful)
    in
    [ column
        (itemStyle
            ++ [ width fill
               , spacing 15
               ]
        )
        ([ el
            [ Font.bold
            , Font.size 18
            ]
            (text "Mise en ligne")
         ]
            ++ List.map
                (\p ->
                    row
                        [ spacing 15 ]
                        [ el
                            [ padding 5
                            , Background.color grey6
                            , Border.rounded 5
                            ]
                            (el
                                [ width (px 140)
                                , height (px 105)
                                , centerX
                                , Background.uncropped p.content
                                , alignLeft
                                ]
                                Element.none
                            )
                        , column
                            [ alignTop
                            , spacing 10
                            ]
                            [ el [ Font.color teal1 ] (text p.filename)
                            , text <|
                                "Taille originale: "
                                    ++ (Dict.get p.filename model.fileSizes
                                            |> Maybe.map Filesize.format
                                            |> Maybe.withDefault "Erreur"
                                       )
                            , text <|
                                "Nouvelle taille: "
                                    ++ Filesize.format p.size
                            , text <|
                                "Transfert: "
                                    ++ (Dict.get p.filename model.uploadProgress
                                            |> Maybe.map Tuple.first
                                            |> Maybe.withDefault 0
                                            |> String.fromInt
                                            |> String.padLeft 2 '0'
                                            |> strCons "%"
                                       )
                            ]
                        ]
                )
                (Dict.values model.processedPics)
        )
    , row
        (itemStyle
            ++ [ spacing 15
               , width fill
               ]
        )
        [ Input.button
            (buttonStyle True)
            { onPress = Just Reset
            , label = text "Annuler"
            }
        , Input.button
            (buttonStyle canEdit)
            { onPress =
                if canEdit then
                    Just GoToEdit
                else
                    Nothing
            , label = text "Continuer"
            }
        ]
    ]



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
    case model.output of
        Nothing ->
            []

        Just output ->
            [ column
                (itemStyle
                    ++ [ spacing 15
                       , width fill
                       ]
                )
                ([ el
                    [ Font.bold
                    , Font.size 18
                    ]
                    (text "Ajout / modification légendes")
                 ]
                    ++ List.map captionEditorView output.images
                )
            , row
                (itemStyle
                    ++ [ spacing 15
                       , width fill
                       ]
                )
                [ Input.button
                    (buttonStyle True)
                    { onPress = Just Reset
                    , label = text "Retour"
                    }
                , Input.button
                    (buttonStyle True)
                    { onPress = Just Quit
                    , label = text "Annuler"
                    }
                , Input.button
                    (buttonStyle True)
                    { onPress = Just SaveAndQuit
                    , label = text "Valider et quitter"
                    }
                ]
            ]


captionEditorView : ImageMeta -> Element Msg
captionEditorView { src, caption } =
    case src of
        UrlSrc src_ ->
            row
                [ width fill
                , Background.color grey5
                , Border.rounded 5
                , padding 5
                , spacing 15
                ]
                [ el
                    [ padding 5
                    , Background.color grey6
                    , Border.rounded 5
                    ]
                    (el
                        [ width (px 140)
                        , height (px 105)
                        , centerX
                        , Background.uncropped src_
                        , alignLeft
                        ]
                        Element.none
                    )
                , Input.text
                    (textInputStyle ++ [ alignLeft ])
                    { onChange = CaptionPrompt src_
                    , text =
                        caption
                            |> Maybe.withDefault ""
                    , placeholder =
                        Just <| Input.placeholder [] (text "Legende optionnelle")
                    , label =
                        Input.labelHidden ""
                    }
                ]

        _ ->
            Element.none



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


uploadImage : String -> String -> String -> String -> Maybe String -> String -> Cmd Msg
uploadImage title filename contents thumb mbHdef sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                , ( "title", Encode.string title )
                , ( "filename", Encode.string filename )
                , ( "contents", Encode.string contents )
                , ( "thumb", Encode.string thumb )
                , ( "HDef"
                  , Maybe.map Encode.string mbHdef
                        |> Maybe.withDefault Encode.null
                  )
                ]
                |> Http.jsonBody
    in
    Http.request
        { method = "POST"
        , headers = []
        , url = "photothequeUpload.php"
        , body = body
        , expect = Http.expectJson (Uploaded filename) decodeUploadStatus
        , timeout = Nothing
        , tracker = Just filename
        }



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


type UploadStatus
    = UploadSuccessful
    | UploadFailure String


decodeUploadStatus : Decode.Decoder UploadStatus
decodeUploadStatus =
    Decode.oneOf
        [ Decode.field "serverError" Decode.string
            |> Decode.map UploadFailure
        , Decode.field "message" Decode.string
            |> Decode.map (always UploadSuccessful)
        ]



-------------------------------------------------------------------------------
------------------
-- Misc Helpers --
------------------


makeGalleryMeta : String -> List ( String, String ) -> (Random.Seed -> ( Random.Seed, GalleryMeta ))
makeGalleryMeta title pics =
    \seed ->
        let
            ( uuid, newSeed ) =
                Random.step UUID.generator seed
        in
        ( newSeed
        , { uuid = uuid
          , title = title
          , images =
                List.map
                    (\( n, p ) ->
                        { dummyPic | src = UrlSrc p }
                    )
                    pics
          }
        )


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
