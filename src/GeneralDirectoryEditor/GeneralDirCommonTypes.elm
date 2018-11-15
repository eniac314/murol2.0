module GeneralDirectoryEditor.GeneralDirCommonTypes exposing (..)

import Dict exposing (..)
import Http exposing (..)
import Internals.ToolHelpers exposing (..)
import Random exposing (..)
import Set exposing (..)
import Time exposing (..)
import UUID exposing (..)


type alias Model msg =
    { fiches : Dict String Fiche
    , categories : Set String
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
    , debug : List String
    , loadingStatus : ToolLoadingStatus
    , externalMsg : Msg -> msg
    , seed :
        Maybe Random.Seed

    --- MainForm variables
    , visualPickerOpen : Bool
    , docPickerOpen : Bool
    , labelVisualPickerOpen : Bool
    , labelPickerOpen : Bool
    , selectedCatInFiche : Maybe String
    , selectedAvailableCat : Maybe String
    , selectedActivInFiche : Maybe String
    , selectedAvailableActiv : Maybe String
    , selectedLabelInFiche : Maybe String
    , labelBuffer : Maybe Label
    , selectedAvailableLabel : Maybe String
    , selectedResp : Maybe Responsable
    , respBuffer : Maybe Responsable
    , selectedEmail : Maybe String
    , emailBuffer : Maybe String
    , selectedDescr : Maybe String
    , descrBuffer : Maybe String
    , selectedLinkedDoc : Maybe LinkedDoc
    , linkedDocBuffer : Maybe LinkedDoc
    , expiryDateBuffer : Maybe String
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
      ----------------------
      -- EditFicheFormMgs --
      ----------------------
    | SelectCatInFiche String
    | SelectAvailableCat String
    | ModifyCat
    | AddCatToFiche
    | RemoveCatFromFiche
      ---
    | SelectActivInFiche String
    | SelectAvailableActiv String
    | ModifyActiv
    | AddActivToFiche
    | RemoveActivFromFiche
      ---
    | SelectLabelInFiche String
    | SelectAvailableLabel String
    | SetLabelName String
    | SetLabelLink String
    | SetLabelVisual String
    | AddLabelToFiche
    | RemoveLabelFromFiche
    | ModifyLabel
    | CreateNewLabel
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
    | OpenLabelVisualPicker
    | CloseLabelVisualPicker
    | OpenDocPicker
    | CloseDocPicker
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
    | ModifyLinkedDoc
    | AddLinkedDoc
    | RemoveLinkedDoc
    | SetLinkedDocUrl String
    | SetLinkedDocLabel String
    | SetLinkedDocDescr String
    | SetLinkedDocExpiry String
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
    , lastEdit : Time.Posix
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
    , lastEdit = Time.millisToPosix 0
    }


type alias Label =
    { nom : String
    , logo : String
    , lien : String
    }


emptyLabel =
    Label "" "" ""


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


type RightPanelDisplay
    = PreviewFiche
    | EditFiche
