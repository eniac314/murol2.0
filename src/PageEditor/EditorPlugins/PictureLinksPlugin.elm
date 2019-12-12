module PageEditor.EditorPlugins.PictureLinksPlugin exposing (..)

import Auth.AuthPlugin exposing (LogInfo)
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
import GeneralDirectoryEditor.GeneralDirCommonTypes exposing (Fiche, Label)
import GeneralDirectoryEditor.GeneralDirHelpers exposing (..)
import Html exposing (Html)
import Html.Attributes as Attr
import Internals.CommonStyleHelpers exposing (..)
import List.Extra exposing (findIndex, swapAt)
import PageEditor.Internals.DocumentEditorHelpers exposing (..)
import Random exposing (..)
import Time exposing (Zone)
import UUID exposing (..)


type alias Model msg =
    { externalMsg : Msg -> msg
    , buffer : List InternalPicLink
    , urlBuffer : Maybe String
    , imagePickerOpen : Bool
    , selectedPic : Maybe String
    , seed : Random.Seed
    }


type alias InternalPicLink =
    { uuid : UUID
    , picLink : PictureLink
    }


type Msg
    = NoOp
    | OpenPicker
    | ClosePicker
    | NewPicLink { src : String, width : Int, height : Int }
    | UrlInput String
    | SetUrl
    | MovePicUp
    | MovePicDown
    | RemovePic
    | SelectPic String
    | Quit
    | SaveAndQuit


init : List PictureLink -> (Msg -> msg) -> Model msg
init input externalMsg =
    let
        ( newBuffer, newSeed ) =
            List.foldr
                (\pl ( acc, seed ) ->
                    let
                        ( uuid, ns ) =
                            Random.step UUID.generator seed
                    in
                    ( { uuid = uuid
                      , picLink = pl
                      }
                        :: acc
                    , ns
                    )
                )
                ( [], initialSeed 0 )
                input
    in
    { externalMsg = externalMsg
    , buffer = newBuffer
    , urlBuffer = Nothing
    , imagePickerOpen = False
    , selectedPic = Nothing
    , seed = newSeed
    }


update : Msg -> Model msg -> ( Model msg, Maybe (EditorPluginResult (List PictureLink)) )
update msg model =
    case msg of
        OpenPicker ->
            ( { model | imagePickerOpen = True }
            , Nothing
            )

        ClosePicker ->
            ( { model | imagePickerOpen = False }
            , Nothing
            )

        NewPicLink { src, width, height } ->
            let
                newPicLink =
                    { uuid = uuid
                    , picLink =
                        { url = ""
                        , img =
                            { src = UrlSrc src
                            , caption = Nothing
                            , size =
                                { imgWidth = width
                                , imgHeight = height
                                }
                            }
                        }
                    }

                ( uuid, newSeed ) =
                    Random.step UUID.generator model.seed
            in
            ( { model
                | buffer = model.buffer ++ [ newPicLink ]
                , seed = newSeed
                , imagePickerOpen = False
              }
            , Nothing
            )

        UrlInput s ->
            ( { model | urlBuffer = Just s }, Nothing )

        SetUrl ->
            case ( model.selectedPic, model.urlBuffer ) of
                ( Just uuid, Just url ) ->
                    let
                        newBuffer =
                            List.map
                                (\pl ->
                                    if UUID.toString pl.uuid == uuid then
                                        let
                                            picLink =
                                                pl.picLink
                                        in
                                        { pl | picLink = { picLink | url = url } }

                                    else
                                        pl
                                )
                                model.buffer
                    in
                    ( { model
                        | buffer = newBuffer
                        , urlBuffer = Nothing
                      }
                    , Nothing
                    )

                _ ->
                    ( model, Nothing )

        MovePicUp ->
            case
                model.selectedPic
                    |> Maybe.andThen
                        (\s ->
                            findIndex (\p -> UUID.toString p.uuid == s) model.buffer
                        )
            of
                Nothing ->
                    ( model, Nothing )

                Just n ->
                    ( { model | buffer = swapAt (n - 1) n model.buffer }
                    , Nothing
                    )

        MovePicDown ->
            case
                model.selectedPic
                    |> Maybe.andThen
                        (\s ->
                            findIndex (\p -> UUID.toString p.uuid == s) model.buffer
                        )
            of
                Nothing ->
                    ( model, Nothing )

                Just n ->
                    ( { model | buffer = swapAt (n + 1) n model.buffer }
                    , Nothing
                    )

        RemovePic ->
            case model.selectedPic of
                Nothing ->
                    ( model, Nothing )

                Just s ->
                    ( { model | buffer = List.filter (\p -> UUID.toString p.uuid /= s) model.buffer }
                    , Nothing
                    )

        SelectPic s ->
            ( { model
                | selectedPic =
                    if model.selectedPic == Just s then
                        Nothing

                    else
                        Just s
                , urlBuffer =
                    if model.selectedPic == Just s then
                        Nothing

                    else
                        List.filter (\p -> UUID.toString p.uuid == s) model.buffer
                            |> List.head
                            |> Maybe.map (.url << .picLink)
              }
            , Nothing
            )

        SaveAndQuit ->
            ( model
            , List.map .picLink model.buffer
                |> EditorPluginData
                |> Just
            )

        Quit ->
            ( model, Just EditorPluginQuit )

        NoOp ->
            ( model, Nothing )


view :
    { a
        | fileExplorer : FileExplorer.Model msg
        , logInfo : LogInfo
        , zone : Time.Zone
    }
    -> Model msg
    -> Element msg
view config model =
    column
        [ height fill
        , width fill
        , scrollbarY
        , padding 15
        , spacing 15
        ]
        [ column
            (containerStyle ++ [ spacing 15 ])
            [ row
                (itemStyle
                    ++ [ spacing 15
                       , width fill
                       , below <|
                            if not model.imagePickerOpen then
                                Element.none

                            else
                                el
                                    [ Background.color (rgb 1 1 1)
                                    , width (minimum 850 (maximum 920 shrink))
                                    , Border.shadow
                                        { offset = ( 4, 4 )
                                        , size = 5
                                        , blur = 10
                                        , color = rgba 0 0 0 0.45
                                        }
                                    ]
                                    (imagePickerView config model)
                       ]
                )
                [ Input.button
                    (buttonStyle True)
                    { onPress =
                        Just (model.externalMsg OpenPicker)
                    , label =
                        text "Nouveau lien image"
                    }
                , Input.button
                    (buttonStyle (model.selectedPic /= Nothing))
                    { onPress =
                        Maybe.map (always (model.externalMsg MovePicUp))
                            model.selectedPic
                    , label =
                        text "Monter"
                    }
                , Input.button
                    (buttonStyle (model.selectedPic /= Nothing))
                    { onPress =
                        Maybe.map (always (model.externalMsg MovePicDown))
                            model.selectedPic
                    , label =
                        text "Descendre"
                    }
                , Input.button
                    (buttonStyle (model.selectedPic /= Nothing))
                    { onPress =
                        Maybe.map (always <| model.externalMsg RemovePic)
                            model.selectedPic
                    , label =
                        text "Supprimer"
                    }
                ]
            , row
                (itemStyle ++ [ spacing 15 ])
                [ Input.text
                    (textInputStyle
                        ++ [ width (px 400)
                           , spacing 10
                           ]
                    )
                    { onChange = model.externalMsg << UrlInput
                    , text =
                        model.urlBuffer
                            |> Maybe.withDefault ""
                    , placeholder = Nothing
                    , label =
                        Input.labelLeft
                            [ centerY ]
                            (text "Lien associé")
                    }
                , Input.button
                    (buttonStyle (model.urlBuffer /= Nothing && model.selectedPic /= Nothing))
                    { onPress =
                        if model.urlBuffer /= Nothing && model.selectedPic /= Nothing then
                            Just <| model.externalMsg SetUrl

                        else
                            Nothing
                    , label =
                        text "Valider"
                    }
                ]
            , Element.map
                model.externalMsg
              <|
                case model.buffer of
                    [] ->
                        Element.none

                    _ ->
                        column
                            (itemStyle
                                ++ [ spacing 15
                                   , width fill
                                   ]
                            )
                            (picLinkListView model.selectedPic model.buffer)
            ]
        , row
            [ spacing 15 ]
            [ Input.button
                (buttonStyle True)
                { onPress =
                    Just (model.externalMsg Quit)
                , label =
                    text "Retour"
                }
            , Input.button
                (buttonStyle (model.buffer /= []))
                { onPress =
                    if model.buffer /= [] then
                        Just <| model.externalMsg SaveAndQuit

                    else
                        Nothing
                , label =
                    text "Valider et quitter"
                }
            ]
        ]


picLinkListView : Maybe String -> List InternalPicLink -> List (Element Msg)
picLinkListView mbSelected xs =
    let
        picLinkView { uuid, picLink } =
            row
                [ spacing 15
                , width fill
                , pointer
                , padding 7
                , Border.rounded 5
                , if Just (UUID.toString uuid) == mbSelected then
                    Background.color grey5

                  else
                    noAttr
                , mouseOver
                    [ Background.color grey6 ]
                , Events.onClick <| SelectPic (UUID.toString uuid)
                ]
                [ el
                    [ width (px 100)
                    , height (px 100)
                    , Background.uncropped
                        (case picLink.img.src of
                            UrlSrc s ->
                                s

                            _ ->
                                ""
                        )
                    ]
                    Element.none
                , paragraph
                    []
                    [ text
                        (if picLink.url == "" then
                            "pas de lien associé"

                         else
                            picLink.url
                        )
                    ]
                ]
    in
    List.map picLinkView xs



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


imagePickerView :
    { a
        | fileExplorer : FileExplorer.Model msg
        , logInfo : LogInfo
        , zone : Time.Zone
    }
    -> Model msg
    -> Element msg
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
                500
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
                { onPress = Just (model.externalMsg <| ClosePicker)
                , label = text "Retour"
                }
            , Input.button (buttonStyle (FileExplorer.getSelectedImage config.fileExplorer /= Nothing))
                { onPress =
                    FileExplorer.getSelectedImage config.fileExplorer
                        |> Maybe.map (model.externalMsg << NewPicLink)
                , label = text "Valider"
                }
            ]
        ]
