module GeneralDirectoryEditor.GeneralDirectoryEditor exposing (..)

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
import Time exposing (..)
import UUID exposing (..)


type alias Model msg =
    Types.Model msg


type alias Msg =
    Types.Msg


init externalMsg =
    ( { fiches = Dict.empty
      , categories = Dict.empty
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
      , categoriesLocked = False
      , activitesLocked = False
      , labelsLocked = False
      , debug = []
      , loadingStatus = ToolLoadingWaiting
      , externalMsg = externalMsg
      , seed =
            Nothing

      --- MainForm variables
      , visualPickerOpen = False
      , selectedCatInFiche = Nothing
      , selectedAvailableCat = Nothing
      , selectedActivInFiche = Nothing
      , selectedAvailableActiv = Nothing
      , selectedLabelInFiche = Nothing
      , selectedAvailableLabel = Nothing
      , selectedResp = Nothing
      , respBuffer = Nothing
      , selectedEmail = Nothing
      , emailBuffer = Nothing
      , selectedDescr = Nothing
      , descrBuffer = Nothing
      , selectedLinkedDoc = Nothing
      , linkedDocBuffer = Nothing
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
                    ]

        LoggedOut ->
            Cmd.none


loadingStatus model =
    model.loadingStatus


loadingView model =
    toolLoadingView "Chargement du répertoire général: "
        { loadingStatus = loadingStatus model }


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
                            |> Maybe.withDefault emptyFiche
              }
            , Cmd.none
            )

        LoadGeneralDirectory res ->
            case res of
                Ok { fiches, categories, activites, labels } ->
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
                      }
                    , Cmd.none
                    )

                _ ->
                    ( { model
                        | lockedFiches =
                            List.Extra.remove fiche model.lockedFiches
                        , fiches =
                            Dict.insert
                                (canonical fiche.uuid)
                                fiche
                                model.fiches
                        , debug = fiche.nomEntite :: model.debug
                      }
                    , Cmd.none
                    )

        CategoriesUpdated backup res ->
            case res of
                Ok True ->
                    ( { model | categoriesLocked = False }
                    , Cmd.none
                    )

                _ ->
                    ( { model
                        | categoriesLocked = False
                        , categories = backup
                      }
                    , Cmd.none
                    )

        ActivitesUpdated backup res ->
            case res of
                Ok True ->
                    ( { model | activitesLocked = False }
                    , Cmd.none
                    )

                _ ->
                    ( { model
                        | activitesLocked = False
                        , activites = backup
                      }
                    , Cmd.none
                    )

        LabelsUpdated backup res ->
            case res of
                Ok True ->
                    ( { model | labelsLocked = False }
                    , Cmd.none
                    )

                _ ->
                    ( { model
                        | labelsLocked = False
                        , labels = backup
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
              }
            , Cmd.none
            )

        AddCatToFiche ->
            let
                newCats =
                    Maybe.map
                        (\c ->
                            unique <|
                                List.append
                                    model.ficheBuffer.categories
                                    [ c ]
                        )
                        model.selectedAvailableCat
                        |> Maybe.withDefault model.ficheBuffer.categories

                fb =
                    model.ficheBuffer

                newFb =
                    { fb
                        | categories = newCats
                    }
            in
            ( { model
                | ficheBuffer = newFb
                , selectedAvailableCat = Nothing
              }
            , Cmd.none
            )

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
              }
            , Cmd.none
            )

        AddActivToFiche ->
            let
                newActivs =
                    Maybe.map
                        (\a ->
                            unique <|
                                List.append
                                    model.ficheBuffer.natureActiv
                                    [ a ]
                        )
                        model.selectedAvailableActiv
                        |> Maybe.withDefault model.ficheBuffer.natureActiv

                fb =
                    model.ficheBuffer

                newFb =
                    { fb
                        | natureActiv = newActivs
                    }
            in
            ( { model
                | ficheBuffer = newFb
                , selectedAvailableActiv = Nothing
              }
            , Cmd.none
            )

        RemoveActivFromFiche ->
            let
                fb =
                    model.ficheBuffer

                newActivs =
                    Maybe.map
                        (\a -> List.Extra.remove a fb.natureActiv)
                        model.selectedActivInFiche
                        |> Maybe.withDefault fb.natureActiv

                newFb =
                    { fb | natureActiv = newActivs }
            in
            ( { model
                | ficheBuffer = newFb
                , selectedActivInFiche = Nothing
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
              }
            , Cmd.none
            )

        AddLabelToFiche ->
            let
                mbNewLabel =
                    Maybe.andThen
                        (\l ->
                            Dict.get l
                                (model.labels
                                    |> List.map (\l_ -> ( l_.nom, l_ ))
                                    |> Dict.fromList
                                )
                        )
                        model.selectedAvailableLabel

                newLabels =
                    Maybe.map
                        (\l ->
                            uniqueBy
                                (\l_ ->
                                    .nom l_
                                        ++ .logo l_
                                        ++ .lien l_
                                )
                            <|
                                List.append
                                    model.ficheBuffer.label
                                    [ l ]
                        )
                        mbNewLabel
                        |> Maybe.withDefault model.ficheBuffer.label

                fb =
                    model.ficheBuffer

                newFb =
                    { fb
                        | label = newLabels
                    }
            in
            ( { model
                | ficheBuffer = newFb
                , selectedAvailableLabel = Nothing
              }
            , Cmd.none
            )

        RemoveLabelFromFiche ->
            let
                fb =
                    model.ficheBuffer

                mbLabel =
                    Maybe.andThen
                        (\l ->
                            Dict.get l
                                (model.labels
                                    |> List.map (\l_ -> ( l_.nom, l_ ))
                                    |> Dict.fromList
                                )
                        )
                        model.selectedLabelInFiche

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
              }
            , Cmd.none
            )

        --
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
                            TelBoth ( n, s )

                        TelPortable n ->
                            TelPortable s

                        TelBoth ( n1, n2 ) ->
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
                            Just <| TelFixe s

                        Just (TelPortable n) ->
                            Just <| TelBoth ( s, n )

                        Just (TelBoth ( n1, n2 )) ->
                            Just <| TelBoth ( s, n2 )

                        Nothing ->
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
                            Just <| TelBoth ( n, s )

                        Just (TelPortable n) ->
                            Just <| TelPortable s

                        Just (TelBoth ( n1, n2 )) ->
                            Just <| TelBoth ( n1, s )

                        Nothing ->
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
                    { fb | fax = Just s }
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
                      }
                    , Cmd.none
                    )

        --
        SetPjaun s ->
            let
                fb =
                    model.ficheBuffer

                newFb =
                    { fb | pjaun = Just s }
            in
            ( { model | ficheBuffer = newFb }
            , Cmd.none
            )

        SetSiteUrl s ->
            let
                fb =
                    model.ficheBuffer

                baseSite =
                    Maybe.withDefault ( "", "" ) fb.site

                newFb =
                    { fb
                        | site =
                            Just (Tuple.mapSecond (always s) baseSite)
                    }
            in
            ( { model | ficheBuffer = newFb }
            , Cmd.none
            )

        SetSiteLabel s ->
            let
                fb =
                    model.ficheBuffer

                baseSite =
                    Maybe.withDefault ( "", "" ) fb.site

                newFb =
                    { fb
                        | site =
                            Just (Tuple.mapFirst (always s) baseSite)
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

        ConfirmVisual s ->
            ( model
            , Cmd.none
            )

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
              }
            , Cmd.none
            )

        AddLinkedDoc ->
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
                                    fb.linkedDocs ++ [ ld ]
                            }
                    in
                    ( { model
                        | ficheBuffer = newFb
                        , selectedLinkedDoc = Nothing
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
                      }
                    , Cmd.none
                    )

        SetLinkedDocUrl s ->
            let
                baseLD =
                    model.selectedLinkedDoc
                        |> Maybe.withDefault emptyLinkedDoc

                newLd =
                    { baseLD | url = s }
            in
            ( { model | selectedLinkedDoc = Just newLd }
            , Cmd.none
            )

        SetLinkedDocLabel s ->
            let
                baseLD =
                    model.selectedLinkedDoc
                        |> Maybe.withDefault emptyLinkedDoc

                newLd =
                    { baseLD | label = s }
            in
            ( { model | selectedLinkedDoc = Just newLd }
            , Cmd.none
            )

        SetLinkedDocDescr s ->
            let
                baseLD =
                    model.selectedLinkedDoc
                        |> Maybe.withDefault emptyLinkedDoc

                newLd =
                    { baseLD | descr = Just s }
            in
            ( { model | selectedLinkedDoc = Just newLd }
            , Cmd.none
            )

        SelectLinkedDocExpiry s ->
            case parseDate s of
                Nothing ->
                    ( model, Cmd.none )

                Just ( day, month, year ) ->
                    let
                        newTime =
                            newDateRecord year month day 0 0 0 0 config.zone
                                |> civilToPosix

                        baseLD =
                            model.selectedLinkedDoc
                                |> Maybe.withDefault emptyLinkedDoc

                        newLd =
                            { baseLD | expiryDate = Just newTime }
                    in
                    ( { model | selectedLinkedDoc = Just newLd }
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
                        ( uuid, newSeed ) =
                            Random.step UUID.generator seed

                        fb =
                            model.ficheBuffer

                        newFb =
                            { fb | uuid = uuid }

                        newFiches =
                            Dict.insert
                                (canonical uuid)
                                newFb
                                model.fiches
                    in
                    ( { model
                        | fiches = newFiches
                        , rightPanelDisplay = PreviewFiche
                        , lockedFiches = newFb :: model.lockedFiches
                        , selectedFiche = Just newFb.nomEntite
                        , ficheBuffer = emptyFiche
                      }
                    , cmdIfLogged
                        config.logInfo
                        (updateFiche newFb)
                    )

                _ ->
                    ( model, Cmd.none )

        RemoveFiche ->
            ( model
            , Cmd.none
            )

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
              }
            , Cmd.none
            )

        NoOp ->
            ( model, Cmd.none )


computeCats fiches =
    Dict.foldr
        (\_ f acc ->
            List.foldr
                (\c acc_ ->
                    Dict.insert c { name = c, fields = [] } acc_
                )
                acc
                f.categories
        )
        Dict.empty
        fiches


computeActivs fiches =
    Dict.foldr
        (\_ f acc ->
            List.foldr
                (\a acc_ -> Set.insert a acc_)
                acc
                f.natureActiv
        )
        Set.empty
        fiches


computeLabels fiches =
    Dict.foldr
        (\_ f acc ->
            List.foldr
                (\l acc_ -> l :: acc_)
                acc
                f.label
        )
        []
        fiches
        |> uniqueBy (\{ nom, logo, lien } -> nom ++ logo ++ lien)



-------------------------------------------------------------------------------
--------------------
-- View functions --
--------------------


view :
    { config
        | maxHeight : Int
        , zone : Time.Zone
        , fileExplorer : FileExplorer.Model msg
    }
    -> Model msg
    -> Element msg
view config model =
    Element.map model.externalMsg <|
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
                ficheSelectorView model
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
                        String.startsWith
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
        ]
        [ el
            [ Font.bold
            , Font.size 18
            ]
            (text "Selection fiche")
        , Input.text
            (textInputStyle ++ [ spacingXY 0 15 ])
            { onChange =
                FilterByName
            , text =
                model.nameFilter
                    |> Maybe.withDefault ""
            , placeholder =
                Just <|
                    Input.placeholder
                        []
                        (text "filtrer par nom entité")
            , label =
                Input.labelLeft [] Element.none
            }
        , row
            [ spacing 15
            ]
            [ column [ spacing 15 ]
                [ el [ Font.bold ] (text "Catégories")
                , column
                    [ Border.width 2
                    , Border.color (rgb 0.8 0.8 0.8)
                    , width (px 150)
                    , height (px 200)
                    , scrollbars
                    ]
                    (Dict.keys model.categories
                        |> List.map
                            (\e -> filterView model.catFilter (FilterByCat e) e)
                    )
                ]
            , column [ spacing 15 ]
                [ el [ Font.bold ] (text "Nature activités")
                , column
                    [ Border.width 2
                    , Border.color (rgb 0.8 0.8 0.8)
                    , width (px 300)
                    , height (px 200)
                    , scrollbars
                    ]
                    (Set.toList model.activites
                        |> List.map
                            (\e -> filterView model.activFilter (FilterByActiv e) e)
                    )
                ]
            , column [ spacing 15 ]
                [ el [ Font.bold ] (text "Labels")
                , column
                    [ Border.width 2
                    , Border.color (rgb 0.8 0.8 0.8)
                    , width (px 150)
                    , height (px 200)
                    , scrollbars
                    ]
                    (model.labels
                        |> List.map .nom
                        |> List.map
                            (\e -> filterView model.labelFilter (FilterByLabel e) e)
                    )
                ]
            ]
        , el [ Font.bold ]
            (text "Nom fiche entité")
        , column
            [ Border.width 2
            , Border.color (rgb 0.8 0.8 0.8)
            , width (px 630)
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


formsView config model =
    column
        [ alignTop
        , spacing 15
        , width fill
        ]
        [ case model.rightPanelDisplay of
            PreviewFiche ->
                previewFicheView model

            EditFiche ->
                editFicheView config model
        ]


previewFicheView model =
    column
        [ spacing 15 ]
        [ el
            [ Font.bold
            , Font.size 18
            ]
            (text "Aperçu fiche")
        , Maybe.andThen (\id -> Dict.get id model.fiches) model.selectedFiche
            |> Maybe.map fichePreview
            |> Maybe.withDefault Element.none
        , case model.selectedFiche of
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
        ]
