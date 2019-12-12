module GeneralDirectoryEditor.GeneralDirCommonTypes exposing (..)

import Dict exposing (..)
import Http exposing (..)
import Internals.CommonHelpers exposing (PickerResult)
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
    , ficheBuffer : FicheBuffer
    , rightPanelDisplay : RightPanelDisplay
    , lockedFiches : List Fiche
    , debug : List String
    , loadingStatus : ToolLoadingStatus
    , externalMsg : Msg -> msg
    , currentTime : Posix
    , seed :
        Maybe Random.Seed

    --- MainForm variables
    , visualPickerOpen : Bool
    , docPickerOpen : Bool
    , labelVisualPickerOpen : Bool
    , labelPickerOpen : Bool
    , selectedCatInFiche : Maybe String
    , selectedAvailableCat : Maybe String
    , catBuffer : Maybe String
    , selectedActivInFiche : Maybe String
    , selectedAvailableActiv : Maybe String
    , activBuffer : Maybe String
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
    | SetCategorie String
    | ModifyCat
    | AddCatToFiche
    | RemoveCatFromFiche
      ---
    | SelectActivInFiche String
    | SelectAvailableActiv String
    | SetActivite String
    | ModifyActiv
    | AddActivToFiche
    | RemoveActivFromFiche
      ---
    | SelectLabelInFiche String
    | SelectAvailableLabel String
    | SetLabelName String
    | SetLabelLink String
    | SetLabelVisual PickerResult
    | AddLabelToFiche
    | RemoveLabelFromFiche
    | ModifyLabel
      --| CreateNewLabel
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
    | ConfirmVisual PickerResult
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
    | SetLinkedDocUrl PickerResult
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
    | SetInitialSeed Time.Posix
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


type alias FicheBuffer =
    { uuid : Maybe UUID
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


emptyFiche : FicheBuffer
emptyFiche =
    { uuid = Nothing
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


ficheToBuffer fiche =
    { uuid = Just fiche.uuid
    , categories = fiche.categories
    , natureActiv = fiche.natureActiv
    , refOt = fiche.refOt
    , label = fiche.label
    , rank = fiche.rank
    , nomEntite = fiche.nomEntite
    , responsables = fiche.responsables
    , adresse = fiche.adresse
    , telNumber = fiche.telNumber
    , fax = fiche.fax
    , email = fiche.email
    , site = fiche.site
    , pjaun = fiche.pjaun
    , visuel = fiche.visuel
    , description = fiche.description
    , linkedDocs = fiche.linkedDocs
    , ouverture = fiche.ouverture
    , lastEdit = fiche.lastEdit
    }



--type PickerResult
--    = PickedImage { url : String, width : Int, height : Int }
--    | PickedDoc String


type alias Label =
    { nom : String
    , logo :
        { url : String
        , width : Int
        , height : Int
        }
    , lien : String
    }


emptyLabel =
    Label "" { url = "", width = 0, height = 0 } ""


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
