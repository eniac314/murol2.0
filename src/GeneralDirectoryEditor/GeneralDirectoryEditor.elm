module GeneralDirectoryEditor.GeneralDirectoryEditor exposing (Model, Msg, ficheSelectorView, fichesData, formsView, init, internalUpdate, load, loadingStatus, loadingView, previewFicheView, update, view)

import Auth.AuthPlugin exposing (LogInfo(..), cmdIfLogged)
import Base64 exposing (..)
import Derberos.Date.Core exposing (civilToPosix, newDateRecord, posixToCivil)
import Derberos.Date.Utils exposing (numberOfDaysInMonth, numberToMonth)
import Dict exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events exposing (..)
import Element.Font as Font
import Element.Input as Input
import Element.Keyed as Keyed
import Element.Lazy exposing (lazy)
import FileExplorer.FileExplorer as FileExplorer
import GeneralDirectoryEditor.FichePreview exposing (..)
import GeneralDirectoryEditor.GeneralDirCommonTypes as Types exposing (..)
import GeneralDirectoryEditor.GeneralDirHelpers exposing (..)
import GeneralDirectoryEditor.GeneralDirJson exposing (..)
import GeneralDirectoryEditor.GeneralDirMainFormView exposing (..)
import Html as Html
import Html.Attributes as HtmlAttr
import Http exposing (..)
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.ToolHelpers exposing (..)
import Json.Decode as D
import Json.Decode.Extra
import Json.Decode.Pipeline as P exposing (..)
import Json.Encode as E
import List.Extra exposing (elemIndex, remove, setIf, swapAt, unique, uniqueBy)
import Random exposing (..)
import Set exposing (..)
import Task exposing (..)
import Time exposing (..)
import UUID exposing (..)


type alias Model msg =
    Types.Model msg


type alias Msg =
    Types.Msg


init externalMsg =
    ( { fiches = Dict.empty
      , categories = Set.empty
      , activites = Set.empty
      , labels = []
      , nameFilter = Nothing
      , catFilter = Nothing
      , activFilter = Nothing
      , labelFilter = Nothing
      , selectedFiche = Nothing
      , ficheBuffer = emptyFiche
      , rightPanelDisplay = PreviewFiche
      , lockedFiches = []
      , debug = []
      , loadingStatus = ToolLoadingWaiting
      , externalMsg = externalMsg
      , currentTime = Time.millisToPosix 0
      , seed =
            Nothing

      --- MainForm variables
      , visualPickerOpen = False
      , docPickerOpen = False
      , labelVisualPickerOpen = False
      , labelPickerOpen = False
      , selectedCatInFiche = Nothing
      , selectedAvailableCat = Nothing
      , catBuffer = Nothing
      , selectedActivInFiche = Nothing
      , selectedAvailableActiv = Nothing
      , selectedLabelInFiche = Nothing
      , activBuffer = Nothing
      , labelBuffer = Nothing
      , selectedAvailableLabel = Nothing
      , selectedResp = Nothing
      , respBuffer = Nothing
      , selectedEmail = Nothing
      , emailBuffer = Nothing
      , selectedDescr = Nothing
      , descrBuffer = Nothing
      , selectedLinkedDoc = Nothing
      , linkedDocBuffer = Nothing
      , expiryDateBuffer = Nothing
      }
    , Cmd.none
    )


load : Model msg -> LogInfo -> Cmd msg
load model logInfo =
    case logInfo of
        LoggedIn { sessionId } ->
            Cmd.map model.externalMsg <|
                Cmd.batch
                    [ getGeneralDirectory sessionId
                    , Task.perform SetInitialSeed Time.now
                    ]

        LoggedOut ->
            Cmd.none


loadingStatus model =
    model.loadingStatus


loadingView model =
    toolLoadingView "Chargement du répertoire général: "
        { loadingStatus = loadingStatus model }


fichesData model =
    model.fiches


update :
    { a
        | logInfo : LogInfo
        , zone : Zone
    }
    -> Msg
    -> Model msg
    -> ( Model msg, Cmd msg )
update config msg model =
    let
        ( newModel, cmds ) =
            internalUpdate config msg model
    in
    ( newModel, Cmd.map model.externalMsg cmds )


internalUpdate :
    { a
        | logInfo : LogInfo
        , zone : Zone
    }
    -> Msg
    -> Model msg
    -> ( Model msg, Cmd Msg )
internalUpdate config msg model =
    case msg of
        FilterByName nom ->
            ( { model | nameFilter = Just nom }
            , Cmd.none
            )

        FilterByCat cat ->
            ( { model
                | catFilter =
                    if model.catFilter == Just cat then
                        Nothing

                    else
                        Just cat
              }
            , Cmd.none
            )

        FilterByActiv activ ->
            ( { model
                | activFilter =
                    if model.activFilter == Just activ then
                        Nothing

                    else
                        Just activ
              }
            , Cmd.none
            )

        FilterByLabel label ->
            ( { model
                | labelFilter =
                    if model.labelFilter == Just label then
                        Nothing

                    else
                        Just label
              }
            , Cmd.none
            )

        SelectFiche s ->
            ( { model
                | selectedFiche =
                    if model.selectedFiche == Just s then
                        Nothing

                    else
                        Just s
                , ficheBuffer =
                    if model.selectedFiche == Just s then
                        emptyFiche

                    else
                        Dict.get s model.fiches
                            |> Maybe.map ficheToBuffer
                            |> Maybe.withDefault emptyFiche
              }
            , Cmd.none
            )

        LoadGeneralDirectory res ->
            case res of
                Ok { fiches } ->
                    let
                        categories =
                            computeCats fiches

                        activites =
                            computeActivs fiches

                        labels =
                            computeLabels fiches
                    in
                    ( { model
                        | fiches = fiches
                        , categories = categories
                        , activites = activites
                        , labels = labels
                        , loadingStatus = ToolLoadingSuccess
                      }
                    , Cmd.none
                    )

                Err e ->
                    ( { model
                        | debug = []
                        , loadingStatus = ToolLoadingFailure ""
                      }
                    , Cmd.none
                    )

        FicheUpdated fiche res ->
            case res of
                Ok True ->
                    ( { model
                        | lockedFiches =
                            List.Extra.remove fiche model.lockedFiches
                        , categories =
                            computeCats model.fiches
                        , activites =
                            computeActivs model.fiches
                        , labels =
                            computeLabels model.fiches
                      }
                    , Cmd.none
                    )

                _ ->
                    ( { model
                        | lockedFiches =
                            List.Extra.remove fiche model.lockedFiches
                        , fiches =
                            Dict.insert
                                (UUID.toString fiche.uuid)
                                fiche
                                model.fiches
                        , debug = fiche.nomEntite :: model.debug
                      }
                    , Cmd.none
                    )

        ----------------------
        -- EditFicheFormMgs --
        ----------------------
        SelectCatInFiche s ->
            ( { model
                | selectedCatInFiche =
                    if model.selectedCatInFiche == Just s then
                        Nothing

                    else
                        Just s
                , selectedAvailableCat = Nothing
                , catBuffer = Nothing
              }
            , Cmd.none
            )

        SelectAvailableCat s ->
            ( { model
                | selectedAvailableCat =
                    if model.selectedAvailableCat == Just s then
                        Nothing

                    else
                        Just s
                , catBuffer =
                    if model.selectedAvailableCat == Just s then
                        Nothing

                    else
                        Just s
                , selectedCatInFiche = Nothing
              }
            , Cmd.none
            )

        SetCategorie s ->
            ( { model | catBuffer = Just s }, Cmd.none )

        ModifyCat ->
            case ( model.selectedAvailableCat, model.catBuffer ) of
                ( Just avCat, Just newCat ) ->
                    if avCat == newCat then
                        ( model, Cmd.none )

                    else
                        let
                            ( newFiches, fichesToUpdate ) =
                                filterAndUpdate model .categories setFicheCat avCat newCat

                            fb =
                                model.ficheBuffer

                            newFb =
                                { fb | categories = setIf (\c -> c == avCat) newCat fb.categories }
                        in
                        ( { model
                            | fiches = newFiches
                            , ficheBuffer = newFb
                            , categories = computeCats newFiches
                            , lockedFiches = model.lockedFiches ++ fichesToUpdate
                            , selectedCatInFiche = Nothing
                            , catBuffer = Nothing
                            , selectedAvailableCat = Nothing
                          }
                        , batchFichesUpdate config.logInfo fichesToUpdate
                        )

                _ ->
                    ( model, Cmd.none )

        AddCatToFiche ->
            case ( model.selectedAvailableCat, model.catBuffer ) of
                ( Just avCat, Just newCat ) ->
                    if avCat == newCat then
                        let
                            newCatsFiche =
                                model.ficheBuffer.categories ++ [ newCat ]

                            fb =
                                model.ficheBuffer

                            newFb =
                                { fb | categories = newCatsFiche }
                        in
                        ( { model
                            | ficheBuffer = newFb
                            , selectedAvailableCat = Nothing
                            , catBuffer = Nothing
                          }
                        , Cmd.none
                        )

                    else
                        ( model, Cmd.none )

                ( Nothing, Just newCat ) ->
                    let
                        newCatsFiche =
                            model.ficheBuffer.categories ++ [ newCat ]

                        newCats =
                            Set.insert newCat model.categories

                        fb =
                            model.ficheBuffer

                        newFb =
                            { fb | categories = newCatsFiche }
                    in
                    ( { model
                        | ficheBuffer = newFb
                        , catBuffer = Nothing
                        , categories = newCats
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        RemoveCatFromFiche ->
            let
                fb =
                    model.ficheBuffer

                newCats =
                    Maybe.map
                        (\c -> List.Extra.remove c fb.categories)
                        model.selectedCatInFiche
                        |> Maybe.withDefault fb.categories

                newFb =
                    { fb | categories = newCats }
            in
            ( { model
                | ficheBuffer = newFb
                , selectedCatInFiche = Nothing
                , catBuffer = Nothing
                , selectedAvailableCat = Nothing
              }
            , Cmd.none
            )

        --
        SelectActivInFiche s ->
            ( { model
                | selectedActivInFiche =
                    if model.selectedActivInFiche == Just s then
                        Nothing

                    else
                        Just s
                , selectedAvailableActiv = Nothing
                , activBuffer = Nothing
              }
            , Cmd.none
            )

        SelectAvailableActiv s ->
            ( { model
                | selectedAvailableActiv =
                    if model.selectedAvailableActiv == Just s then
                        Nothing

                    else
                        Just s
                , activBuffer =
                    if model.selectedAvailableActiv == Just s then
                        Nothing

                    else
                        Just s
                , selectedActivInFiche = Nothing
              }
            , Cmd.none
            )

        SetActivite s ->
            ( { model | activBuffer = Just s }, Cmd.none )

        ModifyActiv ->
            case ( model.selectedAvailableActiv, model.activBuffer ) of
                ( Just avActiv, Just newActiv ) ->
                    if avActiv == newActiv then
                        ( model, Cmd.none )

                    else
                        let
                            ( newFiches, fichesToUpdate ) =
                                filterAndUpdate model .natureActiv setFicheActiv avActiv newActiv

                            fb =
                                model.ficheBuffer

                            newFb =
                                { fb | natureActiv = setIf (\c -> c == avActiv) newActiv fb.natureActiv }
                        in
                        ( { model
                            | fiches = newFiches
                            , ficheBuffer = newFb
                            , activites = computeActivs newFiches
                            , lockedFiches = model.lockedFiches ++ fichesToUpdate
                            , selectedActivInFiche = Nothing
                            , activBuffer = Nothing
                            , selectedAvailableActiv = Nothing
                          }
                        , batchFichesUpdate config.logInfo fichesToUpdate
                        )

                _ ->
                    ( model, Cmd.none )

        AddActivToFiche ->
            case ( model.selectedAvailableActiv, model.activBuffer ) of
                ( Just avActiv, Just newActiv ) ->
                    if avActiv == newActiv then
                        let
                            newActivFiche =
                                model.ficheBuffer.natureActiv ++ [ newActiv ]

                            fb =
                                model.ficheBuffer

                            newFb =
                                { fb | natureActiv = newActivFiche }
                        in
                        ( { model
                            | ficheBuffer = newFb
                            , selectedAvailableActiv = Nothing
                            , activBuffer = Nothing
                          }
                        , Cmd.none
                        )

                    else
                        ( model, Cmd.none )

                ( Nothing, Just newActiv ) ->
                    let
                        newActivFiche =
                            model.ficheBuffer.natureActiv ++ [ newActiv ]

                        newActivs =
                            Set.insert newActiv model.activites

                        fb =
                            model.ficheBuffer

                        newFb =
                            { fb | natureActiv = newActivFiche }
                    in
                    ( { model
                        | ficheBuffer = newFb
                        , activBuffer = Nothing
                        , activites = newActivs
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        RemoveActivFromFiche ->
            let
                fb =
                    model.ficheBuffer

                newActivs =
                    Maybe.map
                        (\a -> List.Extra.remove a fb.natureActiv)
                        model.selectedActivInFiche
                        |> Maybe.withDefault fb.categories

                newFb =
                    { fb | natureActiv = newActivs }
            in
            ( { model
                | ficheBuffer = newFb
                , selectedActivInFiche = Nothing
                , activBuffer = Nothing
                , selectedAvailableActiv = Nothing
              }
            , Cmd.none
            )

        --
        SelectLabelInFiche s ->
            ( { model
                | selectedLabelInFiche =
                    if model.selectedLabelInFiche == Just s then
                        Nothing

                    else
                        Just s
                , selectedAvailableLabel = Nothing
                , labelBuffer = Nothing
              }
            , Cmd.none
            )

        SelectAvailableLabel s ->
            ( { model
                | selectedAvailableLabel =
                    if model.selectedAvailableLabel == Just s then
                        Nothing

                    else
                        Just s
                , labelBuffer =
                    if model.selectedAvailableLabel == Just s then
                        Nothing

                    else
                        List.filter (\l -> l.nom == s) model.labels
                            |> List.head
                , selectedLabelInFiche = Nothing
              }
            , Cmd.none
            )

        SetLabelName s ->
            let
                baseLabel =
                    model.labelBuffer
                        |> Maybe.withDefault emptyLabel

                newLabel =
                    { baseLabel | nom = s }
            in
            ( { model | labelBuffer = Just newLabel }
            , Cmd.none
            )

        SetLabelLink s ->
            let
                baseLabel =
                    model.labelBuffer
                        |> Maybe.withDefault emptyLabel

                newLabel =
                    { baseLabel | lien = s }
            in
            ( { model | labelBuffer = Just newLabel }
            , Cmd.none
            )

        SetLabelVisual pr ->
            case pr of
                PickedImage { url, width, height } ->
                    let
                        baseLabel =
                            model.labelBuffer
                                |> Maybe.withDefault emptyLabel

                        newLabel =
                            { baseLabel
                                | logo =
                                    { url = url
                                    , width = width
                                    , height = height
                                    }
                            }
                    in
                    ( { model
                        | labelBuffer = Just newLabel
                        , labelVisualPickerOpen = False
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        AddLabelToFiche ->
            case ( model.selectedAvailableLabel, model.labelBuffer ) of
                ( Just _, Just _ ) ->
                    let
                        mbNewLabel =
                            extractLabel model model.selectedAvailableLabel

                        newFicheLabels =
                            appendLabel
                                mbNewLabel
                                model.ficheBuffer.label

                        newLabels =
                            appendLabel
                                mbNewLabel
                                model.labels

                        fb =
                            model.ficheBuffer

                        newFb =
                            { fb
                                | label = newFicheLabels
                            }
                    in
                    ( { model
                        | ficheBuffer = newFb
                        , labelBuffer = Nothing
                        , labels = newLabels
                      }
                    , Cmd.none
                    )

                ( Nothing, Just _ ) ->
                    case ( model.labelBuffer, Maybe.map validLabel model.labelBuffer ) of
                        ( Just newLabel, Just True ) ->
                            let
                                fb =
                                    model.ficheBuffer

                                newFb =
                                    { fb | label = fb.label ++ [ newLabel ] }
                            in
                            ( { model
                                | labels = model.labels ++ [ newLabel ]
                                , labelBuffer = Nothing
                                , ficheBuffer = newFb
                              }
                            , Cmd.none
                            )

                        _ ->
                            ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        RemoveLabelFromFiche ->
            let
                fb =
                    model.ficheBuffer

                mbLabel =
                    extractLabel model model.selectedLabelInFiche

                newLabels =
                    Maybe.map
                        (\l -> List.Extra.remove l fb.label)
                        mbLabel
                        |> Maybe.withDefault fb.label

                newFb =
                    { fb | label = newLabels }
            in
            ( { model
                | ficheBuffer = newFb
                , selectedLabelInFiche = Nothing
                , labelBuffer = Nothing
                , selectedAvailableLabel = Nothing
              }
            , Cmd.none
            )

        ModifyLabel ->
            --( model, Cmd.none )
            case
                ( extractLabel model model.selectedAvailableLabel
                , model.labelBuffer
                )
            of
                ( Just avLabel, Just newLabel ) ->
                    if avLabel == newLabel then
                        ( model, Cmd.none )

                    else
                        let
                            ( newFiches, fichesToUpdate ) =
                                filterAndUpdate model .label setFicheLabel avLabel newLabel

                            fb =
                                model.ficheBuffer

                            newFb =
                                { fb | label = setIf (\l -> l == avLabel) newLabel fb.label }
                        in
                        ( { model
                            | fiches = newFiches
                            , ficheBuffer = newFb
                            , labels = computeLabels newFiches
                            , lockedFiches = model.lockedFiches ++ fichesToUpdate
                            , selectedLabelInFiche = Nothing
                            , labelBuffer = Nothing
                            , selectedAvailableLabel = Nothing
                          }
                        , batchFichesUpdate config.logInfo fichesToUpdate
                        )

                _ ->
                    ( model, Cmd.none )

        SetRefOtNbr s ->
            let
                fb =
                    model.ficheBuffer

                baseRefOt =
                    Maybe.withDefault ( 0, "" ) fb.refOt

                newRefOt =
                    String.toInt s
                        |> Maybe.andThen
                            (\n ->
                                Just <|
                                    Tuple.mapFirst (always n)
                                        baseRefOt
                            )

                newFb =
                    { fb | refOt = newRefOt }
            in
            ( { model | ficheBuffer = newFb }
            , Cmd.none
            )

        SetRefOtLink s ->
            let
                fb =
                    model.ficheBuffer

                baseRefOt =
                    Maybe.withDefault ( 0, "" ) fb.refOt

                newRefOt =
                    Just <|
                        Tuple.mapSecond (always s)
                            baseRefOt

                newFb =
                    { fb | refOt = newRefOt }
            in
            ( { model | ficheBuffer = newFb }
            , Cmd.none
            )

        --
        SetStars s ->
            let
                fb =
                    model.ficheBuffer

                rank =
                    fb.rank

                newRank =
                    { rank | stars = String.toInt s }

                newFb =
                    { fb | rank = newRank }
            in
            ( { model | ficheBuffer = newFb }
            , Cmd.none
            )

        SetEpis s ->
            let
                fb =
                    model.ficheBuffer

                rank =
                    fb.rank

                newRank =
                    { rank | epis = String.toInt s }

                newFb =
                    { fb | rank = newRank }
            in
            ( { model | ficheBuffer = newFb }
            , Cmd.none
            )

        --
        SetNomEntite s ->
            let
                fb =
                    model.ficheBuffer

                newFb =
                    { fb | nomEntite = s }
            in
            ( { model | ficheBuffer = newFb }
            , Cmd.none
            )

        --
        SelectRespInFiche r ->
            ( { model
                | selectedResp =
                    if model.selectedResp == Just r then
                        Nothing

                    else
                        Just r
                , respBuffer =
                    if model.selectedResp == Just r then
                        Nothing

                    else
                        Just r
              }
            , Cmd.none
            )

        SetRespPoste s ->
            let
                baseResp =
                    model.respBuffer
                        |> Maybe.withDefault emptyResp

                newResp =
                    { baseResp | poste = s }
            in
            ( { model | respBuffer = Just newResp }
            , Cmd.none
            )

        SetRespNom s ->
            let
                baseResp =
                    model.respBuffer
                        |> Maybe.withDefault emptyResp

                newResp =
                    { baseResp | nom = s }
            in
            ( { model | respBuffer = Just newResp }
            , Cmd.none
            )

        SetRespTelFixe s ->
            let
                baseResp =
                    model.respBuffer
                        |> Maybe.withDefault emptyResp

                newTel =
                    case baseResp.tel of
                        TelFixe n ->
                            TelFixe s

                        TelPortable n ->
                            TelBoth ( s, n )

                        TelBoth ( n1, n2 ) ->
                            if s == "" then
                                TelPortable n2

                            else
                                TelBoth ( s, n2 )

                newResp =
                    { baseResp | tel = newTel }
            in
            ( { model | respBuffer = Just newResp }
            , Cmd.none
            )

        SetRespTelPortable s ->
            let
                baseResp =
                    model.respBuffer
                        |> Maybe.withDefault emptyResp

                newTel =
                    case baseResp.tel of
                        TelFixe n ->
                            if n == "" then
                                TelPortable s

                            else
                                TelBoth ( n, s )

                        TelPortable n ->
                            if s == "" then
                                TelFixe ""

                            else
                                TelPortable s

                        TelBoth ( n1, n2 ) ->
                            if s == "" then
                                TelFixe n1

                            else
                                TelBoth ( n1, s )

                newResp =
                    { baseResp | tel = newTel }
            in
            ( { model | respBuffer = Just newResp }
            , Cmd.none
            )

        ModifyResp ->
            case ( model.selectedResp, model.respBuffer ) of
                ( Just r1, Just r2 ) ->
                    let
                        fb =
                            model.ficheBuffer

                        newFb =
                            { fb
                                | responsables =
                                    setIf (\r -> r == r1) r2 fb.responsables
                            }
                    in
                    ( { model
                        | ficheBuffer = newFb
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        AddResp ->
            case model.respBuffer of
                Nothing ->
                    ( model, Cmd.none )

                Just r ->
                    if r == emptyResp then
                        ( model, Cmd.none )

                    else
                        let
                            fb =
                                model.ficheBuffer

                            newFb =
                                { fb
                                    | responsables =
                                        fb.responsables ++ [ r ]
                                }
                        in
                        ( { model
                            | ficheBuffer = newFb
                            , respBuffer = Nothing
                          }
                        , Cmd.none
                        )

        RemoveResp ->
            case model.selectedResp of
                Nothing ->
                    ( model, Cmd.none )

                Just r ->
                    let
                        fb =
                            model.ficheBuffer

                        newFb =
                            { fb
                                | responsables =
                                    List.Extra.remove r fb.responsables
                            }
                    in
                    ( { model
                        | ficheBuffer = newFb
                        , selectedResp = Nothing
                        , respBuffer = Nothing
                      }
                    , Cmd.none
                    )

        --
        SetAddress s ->
            let
                fb =
                    model.ficheBuffer

                newFb =
                    { fb | adresse = s }
            in
            ( { model | ficheBuffer = newFb }
            , Cmd.none
            )

        SetTelFixe s ->
            let
                fb =
                    model.ficheBuffer

                newTel =
                    case fb.telNumber of
                        Just (TelFixe n) ->
                            if s == "" then
                                Nothing

                            else
                                Just <| TelFixe s

                        Just (TelPortable n) ->
                            if s == "" then
                                Just (TelPortable n)

                            else
                                Just <| TelBoth ( s, n )

                        Just (TelBoth ( n1, n2 )) ->
                            if s == "" then
                                Just (TelPortable n2)

                            else
                                Just <| TelBoth ( s, n2 )

                        Nothing ->
                            if s == "" then
                                Nothing

                            else
                                Just <| TelFixe s

                newFb =
                    { fb | telNumber = newTel }
            in
            ( { model | ficheBuffer = newFb }
            , Cmd.none
            )

        SetTelPortable s ->
            let
                fb =
                    model.ficheBuffer

                newTel =
                    case fb.telNumber of
                        Just (TelFixe n) ->
                            if s == "" then
                                Just (TelFixe n)

                            else
                                Just <| TelBoth ( n, s )

                        Just (TelPortable n) ->
                            if s == "" then
                                Nothing

                            else
                                Just <| TelPortable s

                        Just (TelBoth ( n1, n2 )) ->
                            if s == "" then
                                Just (TelFixe n1)

                            else
                                Just <| TelBoth ( n1, s )

                        Nothing ->
                            if s == "" then
                                Nothing

                            else
                                Just <| TelPortable s

                newFb =
                    { fb | telNumber = newTel }
            in
            ( { model | ficheBuffer = newFb }
            , Cmd.none
            )

        SetFax s ->
            let
                fb =
                    model.ficheBuffer

                newFb =
                    { fb
                        | fax =
                            if s == "" then
                                Nothing

                            else
                                Just s
                    }
            in
            ( { model | ficheBuffer = newFb }
            , Cmd.none
            )

        --
        SelectEmailInFiche s ->
            ( { model
                | selectedEmail =
                    if model.selectedEmail == Just s then
                        Nothing

                    else
                        Just s
                , emailBuffer =
                    if model.selectedEmail == Just s then
                        Nothing

                    else
                        Just s
              }
            , Cmd.none
            )

        SetEmail s ->
            ( { model | emailBuffer = Just s }
            , Cmd.none
            )

        ModifyEmail ->
            case ( model.selectedEmail, model.emailBuffer ) of
                ( Just mail1, Just mail2 ) ->
                    let
                        fb =
                            model.ficheBuffer

                        newFb =
                            { fb | email = setIf (\m -> m == mail1) mail2 fb.email }
                    in
                    ( { model
                        | ficheBuffer = newFb
                        , selectedEmail = Nothing
                        , emailBuffer = Nothing
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        AddEmail ->
            case model.emailBuffer of
                Just mail ->
                    if mail == "" then
                        ( model, Cmd.none )

                    else
                        let
                            fb =
                                model.ficheBuffer

                            newFb =
                                { fb | email = fb.email ++ [ mail ] }
                        in
                        ( { model
                            | ficheBuffer = newFb
                            , emailBuffer = Nothing
                            , selectedEmail = Nothing
                          }
                        , Cmd.none
                        )

                Nothing ->
                    ( model, Cmd.none )

        RemoveEmail ->
            case model.selectedEmail of
                Nothing ->
                    ( model, Cmd.none )

                Just mail ->
                    let
                        fb =
                            model.ficheBuffer

                        newFb =
                            { fb | email = List.Extra.remove mail fb.email }
                    in
                    ( { model
                        | ficheBuffer = newFb
                        , selectedEmail = Nothing
                        , emailBuffer = Nothing
                      }
                    , Cmd.none
                    )

        --
        SetPjaun s ->
            let
                fb =
                    model.ficheBuffer

                newFb =
                    { fb
                        | pjaun =
                            if s == "" then
                                Nothing

                            else
                                Just s
                    }
            in
            ( { model | ficheBuffer = newFb }
            , Cmd.none
            )

        SetSiteUrl s ->
            let
                fb =
                    model.ficheBuffer

                newFb =
                    { fb
                        | site =
                            case fb.site of
                                Just ( l, url ) ->
                                    if l == "" && s == "" then
                                        Nothing

                                    else
                                        Just ( l, s )

                                Nothing ->
                                    if s == "" then
                                        Nothing

                                    else
                                        Just ( "", s )
                    }
            in
            ( { model | ficheBuffer = newFb }
            , Cmd.none
            )

        SetSiteLabel s ->
            let
                fb =
                    model.ficheBuffer

                newFb =
                    { fb
                        | site =
                            case fb.site of
                                Just ( l, url ) ->
                                    if s == "" && url == "" then
                                        Nothing

                                    else
                                        Just ( s, url )

                                Nothing ->
                                    if s == "" then
                                        Nothing

                                    else
                                        Just ( s, "" )
                    }
            in
            ( { model | ficheBuffer = newFb }
            , Cmd.none
            )

        OpenVisualPicker ->
            ( { model | visualPickerOpen = True }
            , Cmd.none
            )

        CloseVisualPicker ->
            ( { model | visualPickerOpen = False }
            , Cmd.none
            )

        OpenLabelVisualPicker ->
            ( { model | labelVisualPickerOpen = True }
            , Cmd.none
            )

        CloseLabelVisualPicker ->
            ( { model | labelVisualPickerOpen = False }
            , Cmd.none
            )

        OpenDocPicker ->
            ( { model | docPickerOpen = True }
            , Cmd.none
            )

        CloseDocPicker ->
            ( { model | docPickerOpen = False }
            , Cmd.none
            )

        ConfirmVisual pr ->
            case pr of
                PickedImage { url } ->
                    let
                        fb =
                            model.ficheBuffer

                        newFb =
                            { fb | visuel = url }
                    in
                    ( { model
                        | visualPickerOpen = False
                        , ficheBuffer = newFb
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        --
        SelectDescrInFiche s ->
            ( { model
                | selectedDescr =
                    if model.selectedDescr == Just s then
                        Nothing

                    else
                        Just s
                , descrBuffer =
                    if model.selectedDescr == Just s then
                        Nothing

                    else
                        Just s
              }
            , Cmd.none
            )

        SetDescription s ->
            ( { model | descrBuffer = Just s }
            , Cmd.none
            )

        ModifyDescr ->
            case ( model.selectedDescr, model.descrBuffer ) of
                ( Just d1, Just d2 ) ->
                    let
                        fb =
                            model.ficheBuffer

                        newFb =
                            { fb
                                | description =
                                    setIf (\d -> d == d1)
                                        d2
                                        fb.description
                            }
                    in
                    ( { model
                        | ficheBuffer = newFb
                        , selectedDescr = Nothing
                        , descrBuffer = Nothing
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        AddDescription ->
            case model.descrBuffer of
                Nothing ->
                    ( model, Cmd.none )

                Just d ->
                    if d == "" then
                        ( model, Cmd.none )

                    else
                        let
                            fb =
                                model.ficheBuffer

                            newFb =
                                { fb
                                    | description =
                                        fb.description ++ [ d ]
                                }
                        in
                        ( { model
                            | ficheBuffer = newFb
                            , descrBuffer = Nothing
                          }
                        , Cmd.none
                        )

        RemoveDescription ->
            case model.selectedDescr of
                Nothing ->
                    ( model, Cmd.none )

                Just d ->
                    let
                        fb =
                            model.ficheBuffer

                        newFb =
                            { fb
                                | description =
                                    List.Extra.remove d fb.description
                            }
                    in
                    ( { model
                        | ficheBuffer = newFb
                        , descrBuffer = Nothing
                        , selectedDescr = Nothing
                      }
                    , Cmd.none
                    )

        MoveDescrUp ->
            case
                model.selectedDescr
                    |> Maybe.andThen
                        (\d ->
                            elemIndex d model.ficheBuffer.description
                        )
            of
                Nothing ->
                    ( model, Cmd.none )

                Just n ->
                    let
                        fb =
                            model.ficheBuffer

                        newFb =
                            { fb
                                | description =
                                    swapAt (n - 1) n fb.description
                            }
                    in
                    ( { model | ficheBuffer = newFb }
                    , Cmd.none
                    )

        MoveDescrDown ->
            case
                model.selectedDescr
                    |> Maybe.andThen
                        (\d ->
                            elemIndex d model.ficheBuffer.description
                        )
            of
                Nothing ->
                    ( model, Cmd.none )

                Just n ->
                    let
                        fb =
                            model.ficheBuffer

                        newFb =
                            { fb
                                | description =
                                    swapAt (n + 1) n fb.description
                            }
                    in
                    ( { model | ficheBuffer = newFb }
                    , Cmd.none
                    )

        --
        SelectLinkedDoc ld ->
            ( { model
                | selectedLinkedDoc =
                    if model.selectedLinkedDoc == Just ld then
                        Nothing

                    else
                        Just ld
                , linkedDocBuffer =
                    if model.selectedLinkedDoc == Just ld then
                        Nothing

                    else
                        Just ld
                , expiryDateBuffer = Nothing
              }
            , Cmd.none
            )

        ModifyLinkedDoc ->
            case ( model.selectedLinkedDoc, model.linkedDocBuffer ) of
                ( Just ld1, Just ld2 ) ->
                    let
                        fb =
                            model.ficheBuffer

                        newFb =
                            { fb
                                | linkedDocs =
                                    setIf (\ld -> ld == ld1)
                                        ld2
                                        fb.linkedDocs
                            }
                    in
                    ( { model
                        | ficheBuffer = newFb
                        , selectedLinkedDoc = Nothing
                        , linkedDocBuffer = Nothing
                        , expiryDateBuffer = Nothing
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        AddLinkedDoc ->
            case model.linkedDocBuffer of
                Nothing ->
                    ( model, Cmd.none )

                Just ld ->
                    if not (validLinkedDoc ld) then
                        ( model, Cmd.none )

                    else
                        let
                            fb =
                                model.ficheBuffer

                            newFb =
                                { fb
                                    | linkedDocs =
                                        fb.linkedDocs ++ [ ld ]
                                }
                        in
                        ( { model
                            | ficheBuffer = newFb
                            , linkedDocBuffer = Nothing
                            , expiryDateBuffer = Nothing
                          }
                        , Cmd.none
                        )

        RemoveLinkedDoc ->
            case model.selectedLinkedDoc of
                Nothing ->
                    ( model, Cmd.none )

                Just ld ->
                    let
                        fb =
                            model.ficheBuffer

                        newFb =
                            { fb
                                | linkedDocs =
                                    List.Extra.remove ld fb.linkedDocs
                            }
                    in
                    ( { model
                        | ficheBuffer = newFb
                        , selectedLinkedDoc = Nothing
                        , linkedDocBuffer = Nothing
                        , expiryDateBuffer = Nothing
                      }
                    , Cmd.none
                    )

        SetLinkedDocUrl pr ->
            case pr of
                PickedDoc s ->
                    let
                        baseLD =
                            model.linkedDocBuffer
                                |> Maybe.withDefault emptyLinkedDoc

                        newLd =
                            { baseLD | url = s }
                    in
                    ( { model
                        | linkedDocBuffer = Just newLd
                        , docPickerOpen = False
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        SetLinkedDocLabel s ->
            let
                baseLD =
                    model.linkedDocBuffer
                        |> Maybe.withDefault emptyLinkedDoc

                newLd =
                    { baseLD | label = s }
            in
            ( { model | linkedDocBuffer = Just newLd }
            , Cmd.none
            )

        SetLinkedDocDescr s ->
            let
                baseLD =
                    model.linkedDocBuffer
                        |> Maybe.withDefault emptyLinkedDoc

                newLd =
                    { baseLD | descr = Just s }
            in
            ( { model | linkedDocBuffer = Just newLd }
            , Cmd.none
            )

        SetLinkedDocExpiry s ->
            case parseDate model.currentTime config.zone s of
                Nothing ->
                    let
                        baseLD =
                            model.linkedDocBuffer
                                |> Maybe.withDefault emptyLinkedDoc

                        newLd =
                            { baseLD | expiryDate = Nothing }
                    in
                    ( { model
                        | expiryDateBuffer = Just s
                        , linkedDocBuffer = Just newLd
                      }
                    , Cmd.none
                    )

                Just ( day, month, year ) ->
                    let
                        newTime =
                            newDateRecord year month day 0 0 0 0 config.zone
                                |> civilToPosix

                        baseLD =
                            model.linkedDocBuffer
                                |> Maybe.withDefault emptyLinkedDoc

                        newLd =
                            { baseLD | expiryDate = Just newTime }
                    in
                    ( { model
                        | linkedDocBuffer = Just newLd
                        , expiryDateBuffer = Nothing
                      }
                    , Cmd.none
                    )

        --
        SetOuverture o ->
            let
                fb =
                    model.ficheBuffer

                newFb =
                    { fb | ouverture = Just o }
            in
            ( { model | ficheBuffer = newFb }
            , Cmd.none
            )

        SaveFiche ->
            case model.seed of
                Just seed ->
                    let
                        fb =
                            model.ficheBuffer

                        ( uuid, newSeed ) =
                            case fb.uuid of
                                Just id ->
                                    ( id, seed )

                                Nothing ->
                                    Random.step UUID.generator seed

                        --if UUID.toString fb.uuid == UUID.nilString then
                        --    Random.step UUID.generator seed
                        --else
                        --    ( fb.uuid, seed )
                        toSave =
                            { uuid = uuid
                            , categories = fb.categories
                            , natureActiv = fb.natureActiv
                            , refOt = fb.refOt
                            , label = fb.label
                            , rank = fb.rank
                            , nomEntite = fb.nomEntite
                            , responsables = fb.responsables
                            , adresse = fb.adresse
                            , telNumber = fb.telNumber
                            , fax = fb.fax
                            , email = fb.email
                            , site = fb.site
                            , pjaun = fb.pjaun
                            , visuel = fb.visuel
                            , description = fb.description
                            , linkedDocs = fb.linkedDocs
                            , ouverture = fb.ouverture
                            , lastEdit = fb.lastEdit
                            }

                        newFiches =
                            Dict.insert
                                (UUID.toString uuid)
                                toSave
                                model.fiches
                    in
                    ( { model
                        | fiches = newFiches
                        , rightPanelDisplay = PreviewFiche
                        , lockedFiches = toSave :: model.lockedFiches
                        , selectedFiche = Just <| UUID.toString uuid
                        , ficheBuffer = { fb | uuid = Just uuid }
                        , seed = Just newSeed
                        , nameFilter = Nothing
                        , catFilter = Nothing
                        , activFilter = Nothing
                        , labelFilter = Nothing
                      }
                    , case config.logInfo of
                        LoggedIn { sessionId } ->
                            Task.attempt (FicheUpdated toSave) <|
                                (Time.now
                                    |> Task.andThen
                                        (\t ->
                                            let
                                                datedFb =
                                                    { toSave | lastEdit = t }
                                            in
                                            updateFicheTask
                                                datedFb
                                                sessionId
                                        )
                                )

                        _ ->
                            Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        RemoveFiche ->
            case
                model.ficheBuffer.uuid
                    |> Maybe.andThen (\id -> Dict.get (UUID.toString id) model.fiches)
            of
                Just f ->
                    let
                        newFiches =
                            Dict.remove (UUID.toString f.uuid) model.fiches
                    in
                    ( { model | fiches = newFiches }
                    , cmdIfLogged
                        config.logInfo
                        (removeFiche f)
                    )

                Nothing ->
                    ( model, Cmd.none )

        SetRightPanelDisplay d ->
            ( { model
                | rightPanelDisplay = d
                , ficheBuffer =
                    if d == PreviewFiche then
                        emptyFiche

                    else
                        model.ficheBuffer
                , selectedFiche =
                    if d == PreviewFiche then
                        Nothing

                    else
                        model.selectedFiche
                , visualPickerOpen = False
                , docPickerOpen = False
                , labelVisualPickerOpen = False
                , labelPickerOpen = False
                , selectedCatInFiche = Nothing
                , selectedAvailableCat = Nothing
                , catBuffer = Nothing
                , selectedActivInFiche = Nothing
                , selectedAvailableActiv = Nothing
                , selectedLabelInFiche = Nothing
                , activBuffer = Nothing
                , labelBuffer = Nothing
                , selectedAvailableLabel = Nothing
                , selectedResp = Nothing
                , respBuffer = Nothing
                , selectedEmail = Nothing
                , emailBuffer = Nothing
                , selectedDescr = Nothing
                , descrBuffer = Nothing
                , selectedLinkedDoc = Nothing
                , linkedDocBuffer = Nothing
                , expiryDateBuffer = Nothing
                , nameFilter = Nothing
                , catFilter = Nothing
                , activFilter = Nothing
                , labelFilter = Nothing
              }
            , Cmd.none
            )

        SetInitialSeed t ->
            ( { model
                | seed =
                    Just <|
                        Random.initialSeed (posixToMillis t)
                , currentTime = t
              }
            , Cmd.none
            )

        NoOp ->
            ( model, Cmd.none )



-------------------------------------------------------------------------------
--------------------
-- View functions --
--------------------


view :
    { config
        | maxHeight : Int
        , zone : Time.Zone
        , fileExplorer : FileExplorer.Model msg
        , logInfo : LogInfo
    }
    -> Model msg
    -> Element msg
view config model =
    row
        [ padding 15
        , spacing 15
        , width fill
        , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
        , clip
        , width fill
        , height (maximum config.maxHeight fill)
        ]
        [ if model.rightPanelDisplay == EditFiche then
            Element.none

          else
            Element.map model.externalMsg <| ficheSelectorView model
        , formsView config model
        ]


ficheSelectorView model =
    let
        isSelected name =
            case model.selectedFiche of
                Nothing ->
                    False

                Just id ->
                    Dict.get id model.fiches
                        |> Maybe.map (\f -> f.nomEntite == name)
                        |> Maybe.withDefault False

        filterView selected handler entry =
            Keyed.el
                [ width fill
                , paddingXY 5 5
                , Events.onClick handler
                , pointer
                , if Just entry == selected || isSelected entry then
                    Background.color
                        (rgba 0 0 1 0.3)

                  else
                    noAttr
                ]
                ( entry, text entry )

        nameFilterFun =
            case model.nameFilter of
                Just "" ->
                    always True

                Just name ->
                    \( k, f ) ->
                        String.contains
                            (String.toLower name)
                            (String.toLower f.nomEntite)

                Nothing ->
                    always True

        catFilterFun =
            case model.catFilter of
                Just cat ->
                    \( k, f ) -> List.member cat f.categories

                Nothing ->
                    always True

        activFilterFun =
            case model.activFilter of
                Just activ ->
                    \( k, f ) -> List.member activ f.natureActiv

                Nothing ->
                    always True

        labelFilterFun =
            case model.labelFilter of
                Just label ->
                    \( k, f ) ->
                        List.any (\l -> l.nom == label) f.label

                Nothing ->
                    always True

        filteredFiches =
            Dict.toList model.fiches
                |> List.filter nameFilterFun
                |> List.filter catFilterFun
                |> List.filter activFilterFun
                |> List.filter labelFilterFun
                |> List.sortBy (\( k, f ) -> String.toLower f.nomEntite)
    in
    column
        [ spacing 15
        , alignTop
        , Border.widthEach
            { top = 0
            , bottom = 0
            , left = 0
            , right = 2
            }
        , Border.color (rgb 0.8 0.8 0.8)
        , paddingEach
            { top = 0
            , bottom = 0
            , left = 0
            , right = 15
            }
        , width (px 780)
        , height fill
        , scrollbarY
        ]
        [ el
            [ Font.bold
            , Font.size 18
            ]
            (text "Selection fiche")
        , el containerStyle
            (row
                formItemStyle
                [ Input.text
                    (textInputStyle
                        ++ [ spacingXY 0 15
                           , width (px 400)
                           ]
                    )
                    { onChange =
                        FilterByName
                    , text =
                        model.nameFilter
                            |> Maybe.withDefault ""
                    , placeholder =
                        Just <|
                            Input.placeholder
                                []
                                (text "Filtrer par nom entité")
                    , label =
                        Input.labelLeft [] Element.none
                    }
                ]
            )
        , row
            ([ spacing 15 ]
                ++ containerStyle
            )
            [ column
                ([ spacing 15
                 , alignTop
                 ]
                    ++ formItemStyle
                )
                [ el
                    [ Font.bold
                    , Font.color grey1
                    ]
                    (text "Catégories ")
                , column
                    [ Border.width 2
                    , Border.color grey3
                    , width (px 150)
                    , height (px 200)
                    , scrollbars
                    ]
                    (Set.toList model.categories
                        |> List.map
                            (\e ->
                                selectView
                                    False
                                    model.catFilter
                                    (FilterByCat e)
                                    e
                            )
                    )
                ]
            , column
                ([ spacing 15
                 , alignTop
                 ]
                    ++ formItemStyle
                )
                [ el
                    [ Font.bold
                    , Font.color grey1
                    ]
                    (text "Nature activité")
                , column
                    [ Border.width 2
                    , Border.color grey3
                    , width (px 300)
                    , height (px 200)
                    , scrollbars
                    ]
                    (Set.toList model.activites
                        |> List.map
                            (\e ->
                                selectView False
                                    model.activFilter
                                    (FilterByActiv e)
                                    e
                            )
                    )
                ]
            , column
                ([ spacing 15
                 , alignTop
                 ]
                    ++ formItemStyle
                )
                [ el
                    [ Font.bold
                    , Font.color grey1
                    ]
                    (text "Labels")
                , column
                    [ Border.width 2
                    , Border.color grey3
                    , width (px 150)
                    , height (px 200)
                    , scrollbars
                    ]
                    (List.map .nom model.labels
                        |> List.map
                            (\e ->
                                selectView
                                    False
                                    model.labelFilter
                                    (FilterByLabel e)
                                    e
                            )
                    )
                ]
            ]
        , el [ Font.bold ]
            (text "Nom fiche entité")
        , column
            containerStyle
            [ column
                (formItemStyle
                    ++ [ spacing 15, width fill ]
                )
                [ el [ Font.bold ]
                    (text "Nom fiche entité")
                , column
                    [ Border.width 2
                    , Border.color grey3
                    , width fill
                    , height (px 480)
                    , scrollbars
                    ]
                    (filteredFiches
                        |> List.map (\( k, v ) -> ( k, v.nomEntite ))
                        |> List.map
                            (\( k, n ) ->
                                filterView model.selectedFiche (SelectFiche k) n
                            )
                    )
                ]
            ]
        ]


formsView config model =
    column
        [ alignTop
        , spacing 15
        , width fill
        , height fill
        ]
        [ case model.rightPanelDisplay of
            PreviewFiche ->
                Element.map model.externalMsg <| previewFicheView model

            EditFiche ->
                editFicheView config model
        ]


previewFicheView model =
    column
        [ spacing 15
        , width fill
        , scrollbarY
        , alignTop
        ]
        [ el
            [ Font.bold
            , Font.size 18
            ]
            (text "Aperçu fiche")
        , Maybe.andThen (\id -> Dict.get id model.fiches) model.selectedFiche
            |> Maybe.map (fichePreview (\_ -> NoOp) model.currentTime)
            |> Maybe.withDefault Element.none
        , row
            [ spacing 15 ]
            [ case model.selectedFiche of
                Nothing ->
                    Input.button
                        (buttonStyle True)
                        { onPress = Just (SetRightPanelDisplay EditFiche)
                        , label = el [] (text "Nouvelle fiche")
                        }

                Just _ ->
                    Input.button
                        (buttonStyle True)
                        { onPress = Just (SetRightPanelDisplay EditFiche)
                        , label = el [] (text "Modifier fiche")
                        }
            , Input.button
                (deleteButtonStyle (model.selectedFiche /= Nothing))
                { onPress =
                    Maybe.map (\_ -> RemoveFiche) model.selectedFiche
                , label = el [] (text "Supprimer fiche")
                }
            ]
        ]
