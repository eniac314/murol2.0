module GiteGallery.GiteGallery exposing (..)

import Dict exposing (..)
import Element exposing (Device, classifyDevice)
import GiteGallery.GiteGalleryData exposing (..)
import GiteGallery.GiteGalleryView exposing (view)
import GiteGallery.MultLangText exposing (Language(..), fromStr)
import GiteGallery.Streams exposing (..)
import GiteGallery.Types exposing (..)
import Set exposing (..)
import Task exposing (perform)
import Window exposing (..)


type alias Model =
    GiteGallery.Types.Model


type alias Msg =
    GiteGallery.Types.Msg


type alias Language =
    GiteGallery.MultLangText.Language


toLanguage =
    fromStr


view =
    GiteGallery.GiteGalleryView.view


init =
    { blocs = blocs
    , currentBloc = Nothing
    , loaded = Set.empty
    , device = classifyDevice { width = 1920, height = 1080 }
    , chunkSize = 0
    }
        ! [ getWinSize ]


getWinSize =
    Task.perform Resizes Window.size


subscriptions model =
    Sub.batch [ resizes Resizes ]


update msg model =
    case msg of
        Default ->
            model ! []

        SetCurrentBloc s ->
            { model
                | currentBloc = Dict.get s model.blocs
                , loaded = Set.empty
            }
                ! []

        ShowBlocList ->
            { model
                | currentBloc = Nothing
                , loaded = Set.empty
            }
                ! []

        PicLoaded addr ->
            { model | loaded = Set.insert addr model.loaded } ! []

        ShowPrevPic ->
            case .currentBloc model of
                Nothing ->
                    model ! []

                Just bc ->
                    let
                        newPictures =
                            left (.pictures bc)

                        newChunks =
                            if List.member (current newPictures) (current bc.chunks) then
                                bc.chunks
                            else
                                left bc.chunks
                    in
                    { model
                        | currentBloc =
                            Just
                                { bc
                                    | pictures = newPictures
                                    , chunks = newChunks
                                }
                    }
                        ! []

        ShowNextPic ->
            case .currentBloc model of
                Nothing ->
                    model ! []

                Just bc ->
                    let
                        newPictures =
                            right (.pictures bc)

                        newChunks =
                            if List.member (current newPictures) (current bc.chunks) then
                                bc.chunks
                            else
                                right bc.chunks
                    in
                    { model
                        | currentBloc =
                            Just
                                { bc
                                    | pictures = newPictures
                                    , chunks = newChunks
                                }
                    }
                        ! []

        ShowPic s ->
            case .currentBloc model of
                Nothing ->
                    model ! []

                Just bc ->
                    let
                        newPics =
                            goTo (.pictures bc) (\p -> .addr p == s)
                    in
                    { model | currentBloc = Just { bc | pictures = newPics } } ! []

        Resizes size ->
            let
                newDevice =
                    classifyDevice size

                chunkSize =
                    deviceToChunkSize newDevice

                newBlocs =
                    updateChunks (deviceToChunkSize newDevice) model.blocs

                newCurrentBloc =
                    case .currentBloc model of
                        Nothing ->
                            Nothing

                        Just oriBc ->
                            case Dict.get oriBc.id newBlocs of
                                Nothing ->
                                    Nothing

                                Just bc ->
                                    if List.member (current oriBc.pictures) (current bc.chunks) then
                                        Just { bc | pictures = oriBc.pictures }
                                    else
                                        Just
                                            { bc
                                                | pictures = oriBc.pictures
                                                , chunks =
                                                    goTo bc.chunks
                                                        (List.member (current oriBc.pictures))
                                            }
            in
            { model
                | device = newDevice
                , blocs = newBlocs
                , chunkSize = chunkSize
                , currentBloc = newCurrentBloc
            }
                ! []


updateChunks : Int -> Dict Int BlocContent -> Dict Int BlocContent
updateChunks chunkSize blocs =
    Dict.map (\_ val -> { val | chunks = chunkBiStream chunkSize val.pictures }) blocs


deviceToChunkSize : Device -> Int
deviceToChunkSize device =
    if device.phone then
        2
    else if device.tablet then
        3
    else if device.desktop then
        4
    else
        5
