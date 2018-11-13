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
import Html as Html
import Html.Attributes as HtmlAttr
import Http exposing (..)
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.Icons exposing (chevronsDown, chevronsUp)
import Internals.ToolHelpers exposing (..)
import Json.Decode as D
import Json.Decode.Extra
import Json.Decode.Pipeline as P exposing (..)
import Json.Encode as E
import List.Extra exposing (elemIndex, remove, setIf, swapAt, unique, uniqueBy)
import Murmur3 exposing (hashString)
import Random exposing (..)
import Set exposing (..)
import Time exposing (..)
import UUID exposing (..)


type alias Model msg =
    { fiches : Dict String Fiche
    , categories : Dict String Categorie
    , activites : Set String
    , labels : List Label
    , nameFilter : Maybe String
    , catFilter : Maybe String
    , activFilter : Maybe String
    , labelFilter : Maybe String
    , selectedFiche : Maybe String
    , ficheBuffer : Fiche
    , rightPanelDisplay : RightPanelDisplay
    , lockedFiches : List Fiche
    , categoriesLocked : Bool
    , activitesLocked : Bool
    , labelsLocked : Bool
    , debug : List String
    , loadingStatus : ToolLoadingStatus
    , externalMsg : Msg -> msg
    , seed :
        Maybe Random.Seed

    --- MainForm variables
    , visualPickerOpen : Bool
    , selectedCatInFiche : Maybe String
    , selectedAvailableCat : Maybe String
    , selectedActivInFiche : Maybe String
    , selectedAvailableActiv : Maybe String
    , selectedLabelInFiche : Maybe String
    , selectedAvailableLabel : Maybe String
    , selectedResp : Maybe Responsable
    , respBuffer : Maybe Responsable
    , selectedEmail : Maybe String
    , emailBuffer : Maybe String
    , selectedDescr : Maybe String
    , descrBuffer : Maybe String
    , selectedLinkedDoc : Maybe LinkedDoc
    , linkedDocBuffer : Maybe LinkedDoc
    }


type Msg
    = ------------------------
      -- Msgs for LeftPanel --
      ------------------------
      FilterByName String
    | FilterByCat String
    | FilterByActiv String
    | FilterByLabel String
    | SelectFiche String
      ------------------
      -- Backend coms --
      ------------------
    | LoadGeneralDirectory (Result Http.Error GenDirData)
    | FicheUpdated Fiche (Result Http.Error Bool)
    | CategoriesUpdated (Dict String Categorie) (Result Http.Error Bool)
    | ActivitesUpdated (Set String) (Result Http.Error Bool)
    | LabelsUpdated (List Label) (Result Http.Error Bool)
      ----------------------
      -- EditFicheFormMgs --
      ----------------------
    | SelectCatInFiche String
    | SelectAvailableCat String
    | AddCatToFiche
    | RemoveCatFromFiche
      ---
    | SelectActivInFiche String
    | SelectAvailableActiv String
    | AddActivToFiche
    | RemoveActivFromFiche
      ---
    | SelectLabelInFiche String
    | SelectAvailableLabel String
    | AddLabelToFiche
    | RemoveLabelFromFiche
      ---
    | SetRefOtNbr String
    | SetRefOtLink String
      ---
    | SetStars String
    | SetEpis String
      ---
    | SetNomEntite String
      ---
    | SelectRespInFiche Responsable
    | SetRespPoste String
    | SetRespNom String
    | SetRespTelFixe String
    | SetRespTelPortable String
    | ModifyResp
    | AddResp
    | RemoveResp
      ---
    | SetAddress String
    | SetTelFixe String
    | SetTelPortable String
    | SetFax String
      ---
    | SelectEmailInFiche String
    | SetEmail String
    | ModifyEmail
    | AddEmail
    | RemoveEmail
      ---
    | SetSiteUrl String
    | SetSiteLabel String
    | SetPjaun String
      ---
    | OpenVisualPicker
    | CloseVisualPicker
    | ConfirmVisual String
      ---
    | SelectDescrInFiche String
    | SetDescription String
    | ModifyDescr
    | AddDescription
    | RemoveDescription
    | MoveDescrUp
    | MoveDescrDown
      ---
    | SelectLinkedDoc LinkedDoc
    | AddLinkedDoc
    | RemoveLinkedDoc
    | SetLinkedDocUrl String
    | SetLinkedDocLabel String
    | SetLinkedDocDescr String
    | SelectLinkedDocExpiry String
      ---
    | SetOuverture Ouverture
    | SaveFiche
    | RemoveFiche
      ----------
      -- Misc --
      ----------
    | SetRightPanelDisplay RightPanelDisplay
    | NoOp


type alias GenDirData =
    { fiches : Dict String Fiche
    , categories : Dict String Categorie
    , activites : Set String
    , labels : List Label
    }


type alias Fiche =
    { uuid : UUID
    , categories : List String
    , natureActiv : List String
    , refOt : Maybe ( Int, String )
    , label : List Label
    , rank : Rank
    , nomEntite : String
    , responsables : List Responsable
    , adresse : String
    , telNumber : Maybe TelNumber
    , fax : Maybe String
    , email : List String
    , site : Maybe ( String, String )
    , pjaun : Maybe String
    , visuel : String
    , description : List String
    , linkedDocs : List LinkedDoc
    , ouverture : Maybe Ouverture
    }


emptyFiche =
    { uuid = UUID.nil
    , categories = []
    , natureActiv = []
    , refOt = Nothing
    , label = []
    , rank = { stars = Nothing, epis = Nothing }
    , nomEntite = ""
    , responsables = []
    , adresse = ""
    , telNumber = Nothing
    , fax = Nothing
    , email = []
    , site = Nothing
    , pjaun = Nothing
    , visuel = ""
    , description = []
    , linkedDocs = []
    , ouverture = Nothing
    }


type alias Label =
    { nom : String
    , logo : String
    , lien : String
    }


type alias Rank =
    { stars : Maybe Int
    , epis : Maybe Int
    }


type alias Responsable =
    { poste : String
    , nom : String
    , tel : TelNumber
    }


emptyResp : Responsable
emptyResp =
    { nom = ""
    , poste = ""
    , tel = emptyTel
    }


type TelNumber
    = TelFixe String
    | TelPortable String
    | TelBoth ( String, String )


emptyTel =
    TelFixe ""


type Ouverture
    = Saisonniere
    | TteAnnee


type alias LinkedDoc =
    { url : String
    , label : String
    , descr : Maybe String
    , expiryDate : Maybe Posix
    }


emptyLinkedDoc =
    { url = ""
    , label = ""
    , descr = Nothing
    , expiryDate = Nothing
    }


type alias Categorie =
    { name : String
    , fields : List { field : Field, fieldType : FieldType }
    }


type Field
    = CategoriesField
    | NatureActivField
    | RefOtField
    | LabelField
    | RankField
    | NomEntiteField
    | ResponsablesField
    | AdresseField
    | TelNumberField
    | FaxField
    | EmailField
    | SiteField
    | PjaunField
    | VisuelField
    | DescriptionField
    | LinkedDocsField
    | OuvertureField


type FieldType
    = Obligatoire
    | Optionel
    | SansObject


type RightPanelDisplay
    = PreviewFiche
    | EditFiche


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


parseDate : String -> Maybe ( Int, Int, Int )
parseDate s =
    case
        String.split "/" s
            |> List.filterMap String.toInt
    of
        day :: month :: year :: [] ->
            if (year > 2000) && (year <= 2200) then
                case numberToMonth month of
                    Just validMonth ->
                        if
                            (day >= 1)
                                && (day <= numberOfDaysInMonth year validMonth)
                        then
                            Just ( day, month, year )
                        else
                            Nothing

                    _ ->
                        Nothing
            else
                Nothing

        _ ->
            Nothing


expiryDateToStr : Time.Zone -> Time.Posix -> String
expiryDateToStr zone d =
    let
        dateRec =
            posixToCivil d
    in
    String.fromInt dateRec.day
        ++ "/"
        ++ String.fromInt dateRec.month
        ++ "/"
        ++ String.fromInt dateRec.year


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


visualPickerView :
    { a
        | fileExplorer : FileExplorer.Model msg
        , logInfo : LogInfo
        , maxHeight : Int
        , zone : Zone
    }
    -> Model msg
    -> Element msg
visualPickerView config model =
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
                { onPress = Just (model.externalMsg CloseVisualPicker)
                , label = text "Retour"
                }
            , Input.button (buttonStyle (FileExplorer.getSelectedImage config.fileExplorer /= Nothing))
                { onPress =
                    FileExplorer.getSelectedImage config.fileExplorer
                        |> Maybe.map .src
                        |> Maybe.map (model.externalMsg << ConfirmVisual)
                , label = text "Valider"
                }
            ]
        ]


editFicheView :
    { config
        | maxHeight : Int
        , zone : Time.Zone
        , fileExplorer : FileExplorer.Model msg
    }
    -> Model msg
    -> Element Msg
editFicheView config model =
    let
        selectView selected handler entry =
            Keyed.el
                [ width fill
                , paddingXY 5 5
                , Events.onClick handler
                , pointer
                , if Just entry == selected then
                    Background.color
                        (rgba 0 0 1 0.3)
                  else
                    noAttr
                ]
                ( entry, text entry )

        linkedDocView { url, descr, label, expiryDate } =
            column
                [ spacing 15 ]
                [ newTabLink
                    []
                    { url = url
                    , label = el [ Font.bold ] (text label)
                    }
                , Maybe.map (\d -> el [] (text d)) descr
                    |> Maybe.withDefault Element.none
                , el [] (text <| expiryDateToStr config.zone expiryDate)
                ]
    in
    column
        [ spacing 20
        , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
        , clip
        , width fill
        , height fill
        ]
        [ el
            [ Font.bold
            , Font.size 18
            ]
            (text "Modification/création fiche")
        , column
            [ height (maximum (config.maxHeight - 120) fill)
            , scrollbarY
            , width fill
            , spacing 20
            ]
            [ Input.text
                textInputStyle
                { onChange =
                    SetNomEntite
                , text =
                    model.ficheBuffer.nomEntite

                --|> Maybe.withDefault ""
                , placeholder =
                    Nothing
                , label =
                    Input.labelLeft
                        [ centerY ]
                        (el [ Font.bold ] (text "Nom entité:"))
                }
            , row
                [ spacing 15 ]
                [ column
                    [ spacing 15
                    , alignTop
                    ]
                    [ el [ Font.bold ] (text "Catégories disponibles")
                    , column
                        [ Border.width 2
                        , Border.color (rgb 0.8 0.8 0.8)
                        , width (px 150)
                        , height (px 200)
                        , scrollbars
                        ]
                        (Dict.keys model.categories
                            |> List.map
                                (\e -> selectView model.selectedAvailableCat (SelectAvailableCat e) e)
                        )
                    ]
                , column
                    [ spacing 15
                    , alignTop
                    ]
                    [ el [ Font.bold ] (text "Catégories fiche")
                    , Input.text
                        (textInputStyle
                            ++ [ spacingXY 0 15
                               , width (px 180)
                               ]
                        )
                        { onChange =
                            SelectAvailableCat
                        , text =
                            model.selectedAvailableCat
                                |> Maybe.withDefault ""
                        , placeholder =
                            Just <|
                                Input.placeholder
                                    []
                                    (text "Nouvelle catégorie")
                        , label =
                            Input.labelLeft
                                []
                                Element.none
                        }
                    , column
                        [ Border.width 2
                        , Border.color (rgb 0.8 0.8 0.8)
                        , width (px 180)
                        , height (px 155)
                        , scrollbars
                        ]
                        (model.ficheBuffer.categories
                            |> List.map
                                (\e -> selectView model.selectedCatInFiche (SelectCatInFiche e) e)
                        )
                    ]
                , column
                    [ spacing 15

                    --, alignTop
                    ]
                    [ Input.button
                        (buttonStyle (model.selectedAvailableCat /= Nothing))
                        { onPress =
                            Maybe.map (\_ -> AddCatToFiche)
                                model.selectedAvailableCat
                        , label = el [] (text "Ajouter catégorie")
                        }
                    , Input.button
                        (buttonStyle (model.selectedCatInFiche /= Nothing))
                        { onPress =
                            Maybe.map (\_ -> RemoveCatFromFiche)
                                model.selectedCatInFiche
                        , label = el [] (text "Supprimer catégorie")
                        }
                    ]
                ]
            , row
                [ spacing 15 ]
                [ column
                    [ spacing 15
                    , alignTop
                    ]
                    [ el [ Font.bold ] (text "Activités disponibles")
                    , column
                        [ Border.width 2
                        , Border.color (rgb 0.8 0.8 0.8)
                        , width (px 150)
                        , height (px 200)
                        , scrollbars
                        ]
                        (Set.toList model.activites
                            |> List.map
                                (\e -> selectView model.selectedAvailableActiv (SelectAvailableActiv e) e)
                        )
                    ]
                , column
                    [ spacing 15
                    , alignTop
                    ]
                    [ el [ Font.bold ] (text "Activités fiche")
                    , Input.text
                        (textInputStyle
                            ++ [ spacingXY 0 15
                               , width (px 180)
                               ]
                        )
                        { onChange =
                            SelectAvailableActiv
                        , text =
                            model.selectedAvailableActiv
                                |> Maybe.withDefault ""
                        , placeholder =
                            Just <|
                                Input.placeholder
                                    []
                                    (text "Nouvelle activité")
                        , label =
                            Input.labelLeft
                                []
                                Element.none
                        }
                    , column
                        [ Border.width 2
                        , Border.color (rgb 0.8 0.8 0.8)
                        , width (px 180)
                        , height (px 155)
                        , scrollbars
                        ]
                        (model.ficheBuffer.natureActiv
                            |> List.map
                                (\e -> selectView model.selectedActivInFiche (SelectActivInFiche e) e)
                        )
                    ]
                , column
                    [ spacing 15

                    --, alignTop
                    ]
                    [ Input.button
                        (buttonStyle (model.selectedAvailableActiv /= Nothing))
                        { onPress =
                            Maybe.map (\_ -> AddActivToFiche)
                                model.selectedAvailableActiv
                        , label = el [] (text "Ajouter activité")
                        }
                    , Input.button
                        (buttonStyle (model.selectedActivInFiche /= Nothing))
                        { onPress =
                            Maybe.map (\_ -> RemoveActivFromFiche)
                                model.selectedActivInFiche
                        , label = el [] (text "Supprimer activité")
                        }
                    ]
                ]
            , row
                [ spacing 15 ]
                [ column
                    [ spacing 15
                    , alignTop
                    ]
                    [ el [ Font.bold ] (text "Labels disponibles")
                    , column
                        [ Border.width 2
                        , Border.color (rgb 0.8 0.8 0.8)
                        , width (px 150)
                        , height (px 200)
                        , scrollbars
                        ]
                        (List.map .nom model.labels
                            |> List.map
                                (\e ->
                                    selectView
                                        model.selectedAvailableLabel
                                        (SelectAvailableLabel e)
                                        e
                                )
                        )
                    ]
                , column
                    [ spacing 15
                    , alignTop
                    ]
                    [ el [ Font.bold ] (text "Labels fiche")
                    , Input.text
                        (textInputStyle
                            ++ [ spacingXY 0 15
                               , width (px 180)
                               ]
                        )
                        { onChange =
                            SelectAvailableLabel
                        , text =
                            model.selectedAvailableLabel
                                |> Maybe.withDefault ""
                        , placeholder =
                            Just <|
                                Input.placeholder
                                    []
                                    (text "Nouveau label")
                        , label =
                            Input.labelLeft
                                []
                                Element.none
                        }
                    , column
                        [ Border.width 2
                        , Border.color (rgb 0.8 0.8 0.8)
                        , width (px 180)
                        , height (px 155)
                        , scrollbars
                        ]
                        (model.ficheBuffer.label
                            |> List.map .nom
                            |> List.map
                                (\e ->
                                    selectView model.selectedLabelInFiche
                                        (SelectLabelInFiche e)
                                        e
                                )
                        )
                    ]
                , column
                    [ spacing 15

                    --, alignTop
                    ]
                    [ Input.button
                        (buttonStyle (model.selectedAvailableLabel /= Nothing))
                        { onPress =
                            Maybe.map (\_ -> AddLabelToFiche)
                                model.selectedAvailableLabel
                        , label = el [] (text "Ajouter label")
                        }
                    , Input.button
                        (buttonStyle (model.selectedLabelInFiche /= Nothing))
                        { onPress =
                            Maybe.map (\_ -> RemoveLabelFromFiche)
                                model.selectedLabelInFiche
                        , label = el [] (text "Supprimer label")
                        }
                    ]
                ]
            , row
                [ spacing 15 ]
                [ Input.text
                    (textInputStyle
                        ++ [ width (px 100)
                           ]
                    )
                    { onChange =
                        SetRefOtNbr
                    , text =
                        model.ficheBuffer.refOt
                            |> Maybe.map Tuple.first
                            |> Maybe.map String.fromInt
                            |> Maybe.withDefault ""
                    , placeholder =
                        Nothing
                    , label =
                        Input.labelLeft
                            [ centerY ]
                            (el [ Font.bold ] (text "Référence OT"))
                    }
                , Input.text
                    (textInputStyle
                        ++ [ width (px 100)
                           ]
                    )
                    { onChange =
                        SetRefOtLink
                    , text =
                        model.ficheBuffer.refOt
                            |> Maybe.map Tuple.second
                            |> Maybe.withDefault ""
                    , placeholder =
                        Nothing
                    , label =
                        Input.labelLeft
                            [ centerY ]
                            (el [ Font.bold ] (text "Lien OT"))
                    }
                ]
            , row
                [ spacing 15 ]
                [ Input.text
                    (textInputStyle
                        ++ [ width (px 100)
                           ]
                    )
                    { onChange =
                        SetStars
                    , text =
                        model.ficheBuffer.rank.stars
                            |> Maybe.map String.fromInt
                            |> Maybe.withDefault ""
                    , placeholder =
                        Nothing
                    , label =
                        Input.labelLeft
                            [ centerY ]
                            (el [ Font.bold ] (text "Etoiles"))
                    }
                , Input.text
                    (textInputStyle
                        ++ [ width (px 100)
                           ]
                    )
                    { onChange =
                        SetEpis
                    , text =
                        model.ficheBuffer.rank.epis
                            |> Maybe.map String.fromInt
                            |> Maybe.withDefault ""
                    , placeholder =
                        Nothing
                    , label =
                        Input.labelLeft
                            [ centerY ]
                            (el [ Font.bold ] (text "Epis"))
                    }
                ]
            , Input.text
                (textInputStyle
                    ++ [ width (px 300)
                       ]
                )
                { onChange =
                    SetAddress
                , text =
                    model.ficheBuffer.adresse
                , placeholder =
                    Nothing
                , label =
                    Input.labelLeft
                        [ centerY ]
                        (el [ Font.bold ] (text "Adresse / Siège social"))
                }
            , row
                [ spacing 15 ]
                [ Input.text
                    (textInputStyle
                        ++ [ width (px 120)
                           ]
                    )
                    { onChange =
                        SetTelFixe
                    , text =
                        Maybe.andThen getTFixe model.ficheBuffer.telNumber
                            |> Maybe.withDefault ""
                    , placeholder =
                        Nothing
                    , label =
                        Input.labelLeft
                            [ centerY ]
                            (el [ Font.bold ] (text "Tel. fixe"))
                    }
                , Input.text
                    (textInputStyle
                        ++ [ width (px 120)
                           ]
                    )
                    { onChange =
                        SetTelPortable
                    , text =
                        Maybe.andThen getTPortable model.ficheBuffer.telNumber
                            |> Maybe.withDefault ""
                    , placeholder =
                        Nothing
                    , label =
                        Input.labelLeft
                            [ centerY ]
                            (el [ Font.bold ] (text "Tel. portable"))
                    }
                ]
            , Input.text
                (textInputStyle
                    ++ [ width (px 300)
                       ]
                )
                { onChange =
                    SetFax
                , text =
                    model.ficheBuffer.fax
                        |> Maybe.withDefault ""
                , placeholder =
                    Nothing
                , label =
                    Input.labelLeft
                        [ centerY ]
                        (el [ Font.bold ] (text "Fax"))
                }
            , row
                [ spacing 15 ]
                [ column
                    [ spacing 15 ]
                    [ el [ Font.bold ] (text "Emails")
                    , column
                        [ Border.width 2
                        , Border.color (rgb 0.8 0.8 0.8)
                        , width (px 180)
                        , height (px 200)
                        , scrollbars
                        ]
                        (model.ficheBuffer.email
                            |> List.map
                                (\s ->
                                    selectView model.selectedEmail
                                        (SelectEmailInFiche s)
                                        s
                                )
                        )
                    ]
                , column
                    [ spacing 15 ]
                    (let
                        isExistingEmail =
                            Maybe.map
                                (\e ->
                                    List.member e model.ficheBuffer.email
                                )
                                model.emailBuffer
                                == Just True

                        canAddEmail =
                            (model.emailBuffer
                                /= Nothing
                            )
                                && (model.selectedEmail == Nothing)
                                && not isExistingEmail

                        canModify =
                            model.selectedEmail
                                /= Nothing
                                && (model.emailBuffer /= Just "")
                                && not isExistingEmail

                        canDeleteEmail =
                            model.selectedEmail
                                /= Nothing
                                && isExistingEmail
                     in
                     [ Input.text
                        (textInputStyle
                            ++ [ width (px 180)
                               , spacingXY 0 15
                               ]
                        )
                        { onChange =
                            SetEmail
                        , text =
                            model.emailBuffer
                                |> Maybe.withDefault ""
                        , placeholder =
                            Just <|
                                Input.placeholder
                                    []
                                    (text "Nouvel Email")
                        , label =
                            Input.labelLeft
                                []
                                Element.none
                        }
                     , Input.button
                        (buttonStyle canModify)
                        { onPress =
                            if canModify then
                                Just ModifyEmail
                            else
                                Nothing
                        , label = el [] (text "Modifier email")
                        }
                     , Input.button
                        (buttonStyle canAddEmail)
                        { onPress =
                            if canAddEmail then
                                Just AddEmail
                            else
                                Nothing
                        , label = el [] (text "Ajouter email")
                        }
                     , Input.button
                        (buttonStyle canDeleteEmail)
                        { onPress =
                            if canDeleteEmail then
                                Just RemoveEmail
                            else
                                Nothing
                        , label = el [] (text "Supprimer email")
                        }
                     ]
                    )
                ]
            , row
                [ spacing 15 ]
                [ Input.text
                    (textInputStyle
                        ++ [ width (px 180)
                           ]
                    )
                    { onChange =
                        SetSiteLabel
                    , text =
                        model.ficheBuffer.site
                            |> Maybe.map Tuple.first
                            |> Maybe.withDefault ""
                    , placeholder =
                        Nothing
                    , label =
                        Input.labelLeft
                            [ centerY ]
                            (el [ Font.bold ]
                                (text "Nom site")
                            )
                    }
                , Input.text
                    (textInputStyle
                        ++ [ width (px 180)
                           ]
                    )
                    { onChange =
                        SetSiteUrl
                    , text =
                        model.ficheBuffer.site
                            |> Maybe.map Tuple.second
                            |> Maybe.withDefault ""
                    , placeholder =
                        Nothing
                    , label =
                        Input.labelLeft
                            [ centerY ]
                            (el [ Font.bold ]
                                (text "Url site")
                            )
                    }
                ]
            , row
                [ spacing 15 ]
                [ column
                    [ spacing 15
                    ]
                    [ el [ Font.bold ] (text "Responsables")
                    , column
                        [ Border.width 2
                        , Border.color (rgb 0.8 0.8 0.8)
                        , width (px 180)
                        , height (px 200)
                        , scrollbars
                        ]
                        (model.ficheBuffer.responsables
                            |> List.map (\r -> ( r, .nom r ))
                            |> List.map
                                (\( r, e ) ->
                                    selectView (Maybe.map .nom model.selectedResp)
                                        (SelectRespInFiche r)
                                        e
                                )
                        )
                    ]
                , column
                    [ spacing 15 ]
                    [ Input.text
                        (textInputStyle
                            ++ [ width (px 180)
                               ]
                        )
                        { onChange =
                            SetRespNom
                        , text =
                            model.respBuffer
                                |> Maybe.map .nom
                                |> Maybe.withDefault ""
                        , placeholder =
                            Just <|
                                Input.placeholder
                                    []
                                    (text "Nom")
                        , label =
                            Input.labelLeft
                                []
                                Element.none
                        }
                    , Input.text
                        (textInputStyle
                            ++ [ width (px 180)
                               ]
                        )
                        { onChange =
                            SetRespPoste
                        , text =
                            model.respBuffer
                                |> Maybe.map .poste
                                |> Maybe.withDefault ""
                        , placeholder =
                            Just <|
                                Input.placeholder
                                    []
                                    (text "Poste")
                        , label =
                            Input.labelLeft
                                []
                                Element.none
                        }
                    , Input.text
                        (textInputStyle
                            ++ [ width (px 180)
                               ]
                        )
                        { onChange =
                            SetRespTelFixe
                        , text =
                            model.respBuffer
                                |> Maybe.map .tel
                                |> Maybe.andThen getTFixe
                                |> Maybe.withDefault ""
                        , placeholder =
                            Just <|
                                Input.placeholder
                                    []
                                    (text "Tel. fixe")
                        , label =
                            Input.labelLeft
                                []
                                Element.none
                        }
                    , Input.text
                        (textInputStyle
                            ++ [ width (px 180)
                               ]
                        )
                        { onChange =
                            SetRespTelPortable
                        , text =
                            model.respBuffer
                                |> Maybe.map .tel
                                |> Maybe.andThen getTPortable
                                |> Maybe.withDefault ""
                        , placeholder =
                            Just <|
                                Input.placeholder
                                    []
                                    (text "Tel. portable")
                        , label =
                            Input.labelLeft
                                []
                                Element.none
                        }
                    ]
                , column
                    [ spacing 15

                    --, alignTop
                    ]
                    (let
                        isExistingResp =
                            Maybe.map
                                (\r ->
                                    List.member r model.ficheBuffer.responsables
                                )
                                model.respBuffer
                                == Just True

                        canAddResp =
                            (model.respBuffer
                                /= Nothing
                            )
                                && (model.selectedResp == Nothing)
                                && not isExistingResp

                        canModify =
                            model.selectedResp
                                /= Nothing
                                && (model.respBuffer /= Just emptyResp)
                                && not isExistingResp

                        canDeleteResp =
                            model.selectedResp
                                /= Nothing
                                && isExistingResp
                     in
                     [ Input.button
                        (buttonStyle canModify)
                        { onPress =
                            if canModify then
                                Just ModifyResp
                            else
                                Nothing
                        , label = el [] (text "Modifier responsable")
                        }
                     , Input.button
                        (buttonStyle canAddResp)
                        { onPress =
                            if canAddResp then
                                Just AddResp
                            else
                                Nothing
                        , label = el [] (text "Ajouter responsable")
                        }
                     , Input.button
                        (buttonStyle canDeleteResp)
                        { onPress =
                            if canDeleteResp then
                                Just RemoveResp
                            else
                                Nothing
                        , label = el [] (text "Supprimer responsable")
                        }
                     ]
                    )
                ]
            , column
                [ spacing 15 ]
                [ column
                    [ spacing 15
                    ]
                    [ el [ Font.bold ] (text "Descriptions")
                    , column
                        [ Border.width 2
                        , Border.color (rgb 0.8 0.8 0.8)
                        , width (px 400)
                        , height (px 200)
                        , scrollbars
                        ]
                        (model.ficheBuffer.description
                            |> List.map
                                (\d ->
                                    selectView model.selectedDescr
                                        (SelectDescrInFiche d)
                                        d
                                )
                        )
                    ]
                , row [ spacing 15 ]
                    [ Keyed.el
                        []
                        ( "descrMultilineKey"
                            ++ (String.join "" model.ficheBuffer.description
                                    |> (\s -> s ++ Maybe.withDefault "" model.selectedDescr)
                                    |> hashString 0
                                    |> String.fromInt
                               )
                        , Input.multiline
                            [ width (px 400) ]
                            { onChange = SetDescription
                            , text =
                                model.descrBuffer
                                    |> Maybe.withDefault ""
                            , placeholder =
                                Just <|
                                    Input.placeholder []
                                        (text "Ajouter un paragraphe")
                            , label =
                                Input.labelHidden ""
                            , spellcheck = False
                            }
                        )
                    , column
                        [ spacing 15 ]
                        [ Input.button
                            (buttonStyle (model.selectedDescr /= Nothing))
                            { onPress =
                                Maybe.map (\_ -> MoveDescrUp)
                                    model.selectedDescr
                            , label = el [] (html <| chevronsUp 18)
                            }
                        , Input.button
                            (buttonStyle (model.selectedDescr /= Nothing))
                            { onPress =
                                Maybe.map (\_ -> MoveDescrDown)
                                    model.selectedDescr
                            , label = el [] (html <| chevronsDown 18)
                            }
                        ]
                    ]
                , row
                    [ spacing 15 ]
                    (let
                        isExisting =
                            Maybe.map
                                (\r ->
                                    List.member r model.ficheBuffer.description
                                )
                                model.descrBuffer
                                == Just True

                        canAdd =
                            (model.descrBuffer
                                /= Nothing
                            )
                                && (model.selectedDescr == Nothing)
                                && not isExisting

                        canModify =
                            model.selectedDescr
                                /= Nothing
                                && (model.descrBuffer /= Just "")
                                && not isExisting

                        canDelete =
                            model.selectedDescr
                                /= Nothing
                                && isExisting
                     in
                     [ Input.button
                        (buttonStyle canModify)
                        { onPress =
                            if canModify then
                                Just ModifyDescr
                            else
                                Nothing
                        , label = el [] (text "Modifier description")
                        }
                     , Input.button
                        (buttonStyle canAdd)
                        { onPress =
                            if canAdd then
                                Just AddDescription
                            else
                                Nothing
                        , label = el [] (text "Ajouter description")
                        }
                     , Input.button
                        (buttonStyle canDelete)
                        { onPress =
                            if canDelete then
                                Just RemoveDescription
                            else
                                Nothing
                        , label = el [] (text "Supprimer description")
                        }
                     ]
                    )
                ]
            ]
        , row
            [ spacing 15
            ]
            [ Input.button
                (buttonStyle True)
                { onPress = Just (SetRightPanelDisplay PreviewFiche)
                , label = el [] (text "Retour")
                }
            , Input.button
                (buttonStyle True)
                { onPress = Just SaveFiche
                , label = el [] (text "Sauvegarder fiche")
                }
            ]
        ]


getTFixe tel =
    case tel of
        TelFixe n ->
            Just n

        TelPortable n ->
            Nothing

        TelBoth ( n1, n2 ) ->
            Just n1


getTPortable tel =
    case tel of
        TelFixe n ->
            Nothing

        TelPortable n ->
            Just n

        TelBoth ( n1, n2 ) ->
            Just n2


fichePreview : Fiche -> Element msg
fichePreview f =
    column
        [ padding 15
        , spacing 15
        , Border.solid
        , Border.color (rgb255 127 127 127)
        , Border.width 2
        ]
        [ el
            [ width fill
            , Font.center
            , Font.bold
            ]
            (text f.nomEntite)
        , row
            [ spacing 15 ]
            [ el [ Font.bold ]
                (text "Catégories:")
            , wrappedRow
                [ spacing 15 ]
                (List.map text f.categories)
            ]
        , row
            [ spacing 15 ]
            [ el [ Font.bold ]
                (text "Nature activité:")
            , wrappedRow
                [ spacing 15 ]
                (List.map text f.natureActiv)
            ]
        , Maybe.map
            (\( n, s ) ->
                row [ spacing 15 ]
                    [ el
                        [ Font.bold ]
                        (text "Reférence Office de Tourisme:")
                    , newTabLink []
                        { url = s, label = el [] (text <| String.fromInt n) }
                    ]
            )
            f.refOt
            |> Maybe.withDefault Element.none
        , if not (List.isEmpty f.label) then
            row
                [ spacing 15 ]
                [ el [ Font.bold ]
                    (text "Labels:")
                , paragraph
                    []
                    (List.map (\l -> text l.nom) f.label)
                ]
          else
            Element.none
        , Maybe.map
            (\n ->
                row
                    [ spacing 15 ]
                    [ el
                        [ Font.bold ]
                        (text "Etoiles:")
                    , el [] (text <| String.fromInt n)
                    ]
            )
            f.rank.stars
            |> Maybe.withDefault Element.none
        , Maybe.map
            (\n ->
                row
                    [ spacing 15 ]
                    [ el
                        [ Font.bold ]
                        (text "Epis:")
                    , el [] (text <| String.fromInt n)
                    ]
            )
            f.rank.epis
            |> Maybe.withDefault Element.none
        , if not (List.isEmpty f.responsables) then
            row
                [ spacing 15 ]
                ([ el [ Font.bold ] (text "Responsables:")
                 ]
                    ++ List.map respPreview f.responsables
                )
          else
            Element.none
        , row
            [ spacing 15 ]
            [ el [ Font.bold ]
                (text "Adresse:")
            , el [] (text f.adresse)
            ]
        , Maybe.map
            telPreview
            f.telNumber
            |> Maybe.withDefault Element.none
        , Maybe.map
            (\fax ->
                row
                    [ spacing 15 ]
                    [ el [ Font.bold ]
                        (text "Fax:")
                    , el [] (text fax)
                    ]
            )
            f.fax
            |> Maybe.withDefault Element.none
        , if not (List.isEmpty f.email) then
            row
                [ spacing 15 ]
                [ el [ Font.bold ]
                    (text "Email(s):")
                , column
                    []
                    (List.map text f.email)
                ]
          else
            Element.none
        , Maybe.map
            (\( label, url ) ->
                row
                    [ spacing 15 ]
                    [ el [ Font.bold ]
                        (text "Site web:")
                    , newTabLink []
                        { url = url
                        , label = el [] (text label)
                        }
                    ]
            )
            f.site
            |> Maybe.withDefault Element.none
        , Maybe.map
            (\pj ->
                row
                    [ spacing 15 ]
                    [ el [ Font.bold ]
                        (text "Lien pages jaunes:")
                    , el [] (text pj)
                    ]
            )
            f.pjaun
            |> Maybe.withDefault Element.none
        , if not (List.isEmpty f.description) then
            column
                [ spacing 15 ]
                ([ el [ Font.bold ]
                    (text "Description:")
                 ]
                    ++ List.map (\d -> paragraph [] [ text d ]) f.description
                )
          else
            Element.none
        , case f.ouverture of
            Nothing ->
                row [ spacing 15 ]
                    [ el [ Font.bold ] (text "Ouvert:")
                    , el [] (text "toute l'année")
                    ]

            Just TteAnnee ->
                row [ spacing 15 ]
                    [ el [ Font.bold ] (text "Ouvert:")
                    , el [] (text "toute l'année")
                    ]

            Just Saisonniere ->
                row [ spacing 15 ]
                    [ el [ Font.bold ] (text "Ouvert:")
                    , el [] (text "en saison")
                    ]

        --, text <| canonical f.uuid
        ]


respPreview { poste, nom, tel } =
    column
        []
        [ el
            [ Font.bold ]
            (text nom)
        , row
            [ spacing 15 ]
            [ el [ Font.bold ] (text "Poste:")
            , el [] (text poste)
            ]
        , telPreview tel
        ]


telPreview tel =
    column
        [ spacing 15 ]
        (case tel of
            TelFixe s ->
                [ row
                    [ spacing 15 ]
                    [ el
                        [ Font.bold ]
                        (text "Tel. fixe:")
                    , el [] (text s)
                    ]
                ]

            TelPortable s ->
                [ row
                    [ spacing 15 ]
                    [ el
                        [ Font.bold ]
                        (text "Tel. portable:")
                    , el [] (text s)
                    ]
                ]

            TelBoth ( s1, s2 ) ->
                [ row
                    [ spacing 15 ]
                    [ el
                        [ Font.bold ]
                        (text "Tel. fixe:")
                    , el [] (text s1)
                    ]
                , row
                    [ spacing 15 ]
                    [ el
                        [ Font.bold ]
                        (text "Tel. portable:")
                    , el [] (text s2)
                    ]
                ]
        )



-------------------------------------------------------------------------------
-------------------
-- Json Encoding --
-------------------


encodeFiche : Fiche -> E.Value
encodeFiche f =
    E.object
        [ ( "uuid", E.string (UUID.canonical f.uuid) )
        , ( "categories", E.list E.string f.categories )
        , ( "natureActiv", E.list E.string f.natureActiv )
        , ( "refOt"
          , Maybe.map (\( n, s ) -> E.object [ ( "ref", E.int n ), ( "link", E.string s ) ]) f.refOt
                |> Maybe.withDefault E.null
          )
        , ( "label"
          , E.list
                encodeLabel
                f.label
          )
        , ( "rank"
          , E.object
                [ ( "stars"
                  , Maybe.map E.int f.rank.stars
                        |> Maybe.withDefault E.null
                  )
                , ( "epis"
                  , Maybe.map E.int f.rank.epis
                        |> Maybe.withDefault E.null
                  )
                ]
          )
        , ( "nomEntite", E.string f.nomEntite )
        , ( "responsables"
          , E.list
                (\r ->
                    E.object
                        [ ( "poste", E.string r.poste )
                        , ( "nom", E.string r.nom )
                        , ( "tel"
                          , encodeTel r.tel
                          )
                        ]
                )
                f.responsables
          )
        , ( "adresse", E.string f.adresse )
        , ( "telNumber"
          , Maybe.map encodeTel f.telNumber
                |> Maybe.withDefault E.null
          )
        , ( "fax"
          , Maybe.map E.string f.fax
                |> Maybe.withDefault E.null
          )
        , ( "email", E.list E.string f.email )
        , ( "site"
          , Maybe.map
                (\( l, url ) ->
                    E.object
                        [ ( "label", E.string l )
                        , ( "url", E.string url )
                        ]
                )
                f.site
                |> Maybe.withDefault E.null
          )
        , ( "pjaun"
          , Maybe.map E.string f.pjaun
                |> Maybe.withDefault E.null
          )
        , ( "visuel"
          , E.string f.visuel
          )
        , ( "description"
          , E.list E.string f.description
          )
        , ( "linkedDocs"
          , E.list
                (\ld ->
                    E.object
                        [ ( "url", E.string ld.url )
                        , ( "label", E.string ld.label )
                        , ( "descr"
                          , Maybe.map E.string ld.descr
                                |> Maybe.withDefault E.null
                          )
                        , ( "expiryDate"
                          , Maybe.map (E.int << posixToMillis) ld.expiryDate
                                |> Maybe.withDefault E.null
                          )
                        ]
                )
                f.linkedDocs
          )
        , ( "ouverture"
          , Maybe.map
                (\o ->
                    case o of
                        TteAnnee ->
                            E.string "TteAnnee"

                        Saisonniere ->
                            E.string "Saisonniere"
                )
                f.ouverture
                |> Maybe.withDefault E.null
          )
        ]


encodeLabel =
    \{ nom, logo, lien } ->
        E.object
            [ ( "nom", E.string nom )
            , ( "logo", E.string logo )
            , ( "lien", E.string lien )
            ]


encodeTel tel =
    case tel of
        TelFixe s ->
            E.object [ ( "TelFixe", E.string s ) ]

        TelPortable s ->
            E.object [ ( "TelPortable", E.string s ) ]

        TelBoth ( s1, s2 ) ->
            E.object
                [ ( "TelBoth"
                  , E.object
                        [ ( "TelFixe", E.string s1 )
                        , ( "TelPortable", E.string s2 )
                        ]
                  )
                ]


encodeGenDirData : GenDirData -> E.Value
encodeGenDirData { fiches, categories, activites, labels } =
    E.object
        [ ( "fiches"
          , E.list encodeFiche
                (Dict.values fiches)
          )
        , ( "categories"
          , E.list encodeCategorie
                (Dict.values categories)
          )
        , ( "activites", E.set E.string activites )
        , ( "labels", E.list encodeLabel labels )
        ]


encodeCategorie { name, fields } =
    E.object
        [ ( "name", E.string name )
        , ( "fields", E.list encodeFieldsMeta fields )
        ]


encodeFieldsMeta { field, fieldType } =
    E.object
        [ ( "field", encodeField field )
        , ( "fieldType", encodeFieldType fieldType )
        ]


encodeField field =
    case field of
        CategoriesField ->
            E.string "CategoriesField"

        NatureActivField ->
            E.string "NatureActivField"

        RefOtField ->
            E.string "RefOtField"

        LabelField ->
            E.string "LabelField"

        RankField ->
            E.string "RankField"

        NomEntiteField ->
            E.string "NomEntiteField"

        ResponsablesField ->
            E.string "ResponsablesField"

        AdresseField ->
            E.string "AdresseField"

        TelNumberField ->
            E.string "TelNumberField"

        FaxField ->
            E.string "FaxField"

        EmailField ->
            E.string "EmailField"

        SiteField ->
            E.string "SiteField"

        PjaunField ->
            E.string "PjaunField"

        VisuelField ->
            E.string "VisuelField"

        DescriptionField ->
            E.string "DescriptionField"

        LinkedDocsField ->
            E.string "LinkedDocsField"

        OuvertureField ->
            E.string "OuvertureField"


encodeFieldType ft =
    case ft of
        Obligatoire ->
            E.string "Obligatoire"

        Optionel ->
            E.string "Optionel"

        SansObject ->
            E.string "SansObject"



-------------------------------------------------------------------------------
--------------------
-- Json decoding  --
--------------------


decodeGenDirData : D.Decoder GenDirData
decodeGenDirData =
    D.succeed GenDirData
        |> P.required "fiches"
            (D.list decodeFiche
                |> D.map
                    (List.map
                        (\f -> ( canonical f.uuid, f ))
                    )
                |> D.map Dict.fromList
            )
        |> P.required "categories"
            (D.list decodeCategorie
                |> D.map (List.map (\c -> ( c.name, c )))
                |> D.map Dict.fromList
            )
        |> P.required "activites"
            (D.map Set.fromList
                (D.list D.string)
            )
        |> P.required "labels" (D.list decodeLabel)


decodeCategorie : D.Decoder Categorie
decodeCategorie =
    D.succeed Categorie
        |> P.required "name" D.string
        |> P.required "fields"
            (D.list
                (D.succeed (\f ft -> { field = f, fieldType = ft })
                    |> P.required "field" decodeField
                    |> P.required "fieldType" decodeFieldType
                )
            )


decodeField : D.Decoder Field
decodeField =
    D.string
        |> D.andThen
            (\str ->
                case str of
                    "CategoriesField" ->
                        D.succeed CategoriesField

                    "NatureActivField" ->
                        D.succeed NatureActivField

                    "RefOtField" ->
                        D.succeed RefOtField

                    "LabelField" ->
                        D.succeed LabelField

                    "RankField" ->
                        D.succeed RankField

                    "NomEntiteField" ->
                        D.succeed NomEntiteField

                    "ResponsablesField" ->
                        D.succeed ResponsablesField

                    "AdresseField" ->
                        D.succeed AdresseField

                    "TelNumberField" ->
                        D.succeed TelNumberField

                    "FaxField" ->
                        D.succeed FaxField

                    "EmailField" ->
                        D.succeed EmailField

                    "SiteField" ->
                        D.succeed SiteField

                    "PjaunField" ->
                        D.succeed PjaunField

                    "VisuelField" ->
                        D.succeed VisuelField

                    "DescriptionField" ->
                        D.succeed DescriptionField

                    "LinkedDocsField" ->
                        D.succeed LinkedDocsField

                    "OuvertureField" ->
                        D.succeed OuvertureField

                    somethingElse ->
                        D.fail <|
                            "Unknown fieldType: "
                                ++ somethingElse
            )


decodeFieldType : D.Decoder FieldType
decodeFieldType =
    D.string
        |> D.andThen
            (\str ->
                case str of
                    "Obligatoire" ->
                        D.succeed Obligatoire

                    "Optionel" ->
                        D.succeed Optionel

                    somethingElse ->
                        D.fail <|
                            "Unknown fieldType: "
                                ++ somethingElse
            )


decodeFiche : D.Decoder Fiche
decodeFiche =
    D.succeed Fiche
        |> P.required "uuid" decodeUUID
        |> P.required "categories" (D.list D.string)
        |> P.required "natureActiv" (D.list D.string)
        |> P.required "refOt" decodeRefOt
        |> P.required "label" (D.list decodeLabel)
        |> P.required "rank" decodeRank
        |> P.required "nomEntite" D.string
        |> P.required "responsables" (D.list decodeResp)
        |> P.required "adresse" D.string
        |> P.required "telNumber" (D.nullable decodeTel)
        |> P.required "fax" (D.nullable D.string)
        |> P.required "email" (D.list D.string)
        |> P.required "site" decodeSite
        |> P.required "pjaun" (D.nullable D.string)
        |> P.required "visuel" D.string
        |> P.required "description" (D.list D.string)
        |> P.required "linkedDocs" (D.list decodeLinkedDoc)
        |> P.required "ouverture" (D.nullable decodeOuverture)


decodeUUID : D.Decoder UUID
decodeUUID =
    D.string
        |> D.andThen
            (Json.Decode.Extra.fromResult << UUID.fromString)


decodeRefOt =
    D.nullable
        (D.succeed Tuple.pair
            |> P.required "ref" D.int
            |> P.required "link" D.string
        )


decodeLabel : D.Decoder Label
decodeLabel =
    D.succeed Label
        |> P.required "nom" D.string
        |> P.required "logo" D.string
        |> P.required "lien" D.string


decodeRank : D.Decoder Rank
decodeRank =
    D.succeed Rank
        |> P.required "stars" (D.nullable D.int)
        |> P.required "epis" (D.nullable D.int)


decodeResp : D.Decoder Responsable
decodeResp =
    D.succeed Responsable
        |> P.required "poste" D.string
        |> P.required "nom" D.string
        |> P.required "tel" decodeTel


decodeTel : D.Decoder TelNumber
decodeTel =
    D.oneOf
        [ D.succeed TelFixe
            |> P.required "TelFixe" D.string
        , D.succeed TelPortable
            |> P.required "TelPortable" D.string
        , D.succeed TelBoth
            |> P.required "TelBoth"
                (D.succeed Tuple.pair
                    |> P.required "TelFixe" D.string
                    |> P.required "TelPortable" D.string
                )
        ]


decodeSite =
    D.nullable
        (D.succeed Tuple.pair
            |> P.required "label" D.string
            |> P.required "url" D.string
        )


decodeLinkedDoc : D.Decoder LinkedDoc
decodeLinkedDoc =
    D.succeed LinkedDoc
        |> P.required "url" D.string
        |> P.required "label" D.string
        |> P.required "descr" (D.nullable D.string)
        |> P.required "expiryDate" (D.nullable (D.map millisToPosix D.int))


decodeOuverture : D.Decoder Ouverture
decodeOuverture =
    D.string
        |> D.andThen
            (\str ->
                case str of
                    "Saisonniere" ->
                        D.succeed Saisonniere

                    "TteAnnee" ->
                        D.succeed TteAnnee

                    somethingElse ->
                        D.fail <|
                            "Unknown ouverture: "
                                ++ somethingElse
            )



-------------------------------------------------------------------------------
--------------------
-- Http functions --
--------------------


getGeneralDirectory : String -> Cmd Msg
getGeneralDirectory sessionId =
    let
        body =
            E.object
                [ ( "sessionId"
                  , E.string sessionId
                  )
                ]
                |> Http.jsonBody

        request =
            Http.post "getGeneralDirectory.php" body decodeGenDirData
    in
    Http.send LoadGeneralDirectory request


updateFiche : Fiche -> String -> Cmd Msg
updateFiche fiche sessionId =
    let
        body =
            E.object
                [ ( "sessionId"
                  , E.string sessionId
                  )
                , ( "fiche"
                  , encodeFiche
                        fiche
                  )
                ]
                |> Http.jsonBody

        request =
            Http.post "updateFiche.php" body decodeSuccess
    in
    Http.send (FicheUpdated fiche) request


updateCategories : Dict String Categorie -> String -> Cmd Msg
updateCategories categories sessionId =
    let
        body =
            E.object
                [ ( "sessionId"
                  , E.string sessionId
                  )
                , ( "categories"
                  , E.list encodeCategorie
                        (Dict.values categories)
                  )
                ]
                |> Http.jsonBody

        request =
            Http.post "updateCategories.php" body decodeSuccess
    in
    Http.send (CategoriesUpdated categories) request


updateActivites : Set String -> String -> Cmd Msg
updateActivites activites sessionId =
    let
        body =
            E.object
                [ ( "sessionId"
                  , E.string sessionId
                  )
                , ( "activites"
                  , E.set E.string
                        activites
                  )
                ]
                |> Http.jsonBody

        request =
            Http.post "updateActivites.php" body decodeSuccess
    in
    Http.send (ActivitesUpdated activites) request


updateLabels : List Label -> String -> Cmd Msg
updateLabels labels sessionId =
    let
        body =
            E.object
                [ ( "sessionId"
                  , E.string sessionId
                  )
                , ( "labels"
                  , E.list encodeLabel labels
                  )
                ]
                |> Http.jsonBody

        request =
            Http.post "updateLabels.php" body decodeSuccess
    in
    Http.send (LabelsUpdated labels) request


decodeSuccess : D.Decoder Bool
decodeSuccess =
    D.at [ "message" ] (D.succeed True)



---------------------------------------------------------------------------------
----------------------
---- Export to excel--
----------------------
--fichesToJsonLink =
--    database (initialSeed 0)
--        |> (\( res, double, errors ) ->
--                List.map encodeFiche (Dict.values res)
--                    |> E.list identity
--                    |> E.encode 0
--                    |> (\data ->
--                            el []
--                                (html <|
--                                    Html.a
--                                        [ HtmlAttr.href <|
--                                            "data:application/octet-stream;charset=utf-16le;base64,"
--                                                ++ Base64.encode data
--                                        , HtmlAttr.download "database.json"
--                                        ]
--                                        [ Html.text "database.json" ]
--                                )
--                       )
--           )
---------------------------------------------------------------------------------
