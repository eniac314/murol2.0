module GeneralDirectoryEditor.GeneralDirectoryEditor exposing (..)

import Base64 exposing (..)
import Dict exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events exposing (..)
import Element.Font as Font
import Element.Input as Input
import Element.Lazy exposing (lazy)
import Html as Html
import Html.Attributes as HtmlAttr
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Json.Decode as D
import Json.Encode as E
import Json.Decode.Pipeline as P exposing (..)
import List.Extra exposing (unique, uniqueBy, remove)
import Random exposing (..)
import Set exposing (..)
import UUID exposing (..)
import Time exposing (..)
import Auth.AuthPlugin exposing (LogInfo(..), cmdIfLogged)
import Http exposing (..)
import Json.Decode.Extra
import Element.Keyed as Keyed


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
    , rightPanelDiplay : RightPanelDiplay
    , lockedFiches : List Fiche
    , categoriesLocked : Bool
    , activitesLocked : Bool
    , labelsLocked : Bool
    , debug : List String
    , externalMsg : Msg -> msg
    }


type Msg
    = FilterByName String
    | FilterByCat String
    | FilterByActiv String
    | FilterByLabel String
    | SelectFiche String
    | LoadGeneralDirectory (Result Http.Error GenDirData)
    | FicheUpdated Fiche (Result Http.Error Bool)
    | CategoriesUpdated (Dict String Categorie) (Result Http.Error Bool)
    | ActivitesUpdated (Set String) (Result Http.Error Bool)
    | LabelsUpdated (List Label) (Result Http.Error Bool)
    | BatchUpdateFiches
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


type TelNumber
    = TelFixe String
    | TelPortable String
    | TelBoth ( String, String )


type Ouverture
    = Saisonniere
    | TteAnnee


type alias LinkedDoc =
    { url : String
    , label : String
    , descr : Maybe String
    , expiryDate : Posix
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


type RightPanelDiplay
    = PreviewFiche
    | EditFiche
    | NewFiche
    | EditCat
    | EditActiv
    | EditLabel


init externalMsg =
    let
        data =
            databaseRes (database (initialSeed 0))

        cats =
            Dict.foldr
                (\_ f acc ->
                    List.foldr
                        (\c acc_ ->
                            Dict.insert c ({ name = c, fields = [] }) acc_
                        )
                        acc
                        f.categories
                )
                Dict.empty
                data

        activ =
            Dict.foldr
                (\_ f acc ->
                    List.foldr
                        (\a acc_ -> Set.insert a acc_)
                        acc
                        f.natureActiv
                )
                Set.empty
                data

        labels =
            Dict.foldr
                (\_ f acc ->
                    List.foldr
                        (\l acc_ -> l :: acc_)
                        acc
                        f.label
                )
                []
                data
                |> uniqueBy (\{ nom, logo, lien } -> nom ++ logo ++ lien)
    in
        ( { fiches = data
          , categories = cats
          , activites = activ
          , labels = labels
          , nameFilter = Nothing
          , catFilter = Nothing
          , activFilter = Nothing
          , labelFilter = Nothing
          , selectedFiche = Nothing
          , rightPanelDiplay = PreviewFiche
          , lockedFiches = []
          , categoriesLocked = False
          , activitesLocked = False
          , labelsLocked = False
          , debug = []
          , externalMsg = externalMsg
          }
        , Cmd.none
        )


update :
    { a
        | logInfo : LogInfo
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
                    Just s
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
                      }
                    , Cmd.none
                    )

                Err _ ->
                    ( model, Cmd.none )

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

        BatchUpdateFiches ->
            ( model
            , Dict.values model.fiches
                |> List.reverse
                |> (List.map
                        (\f ->
                            cmdIfLogged
                                config.logInfo
                                (updateFiche f)
                        )
                   )
                |> Cmd.batch
            )

        NoOp ->
            ( model, Cmd.none )


view : Model msg -> Element msg
view model =
    Element.map model.externalMsg <|
        row
            [ padding 15
            , spacing 15
            ]
            [ ficheSelectorView model
            , formsView model
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
                ( entry, (text entry) )

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
            ]
            [ Input.text
                textInputStyle
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
                        , width (px 200)
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
                        , width (px 200)
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
                        , width (px 200)
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
                , height (px 500)
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


formsView model =
    column
        [ alignTop
        , spacing 15
        ]
        [ Maybe.andThen (\id -> Dict.get id model.fiches) model.selectedFiche
            |> Maybe.map fichePreview
            |> Maybe.withDefault Element.none
        , fichesToJsonLink
        , text <| "nbr Fiches: " ++ (String.fromInt <| Dict.size model.fiches)
        , Input.button (buttonStyle True)
            { onPress = Just BatchUpdateFiches
            , label = text "batch update"
            }
        , text <| "nbr erreurs: " ++ (String.fromInt <| List.length model.debug)
        , column
            [ spacing 10
            , height (px 250)
            , scrollbarY
            ]
            (List.map text model.debug)
        , column
            [ spacing 10
            , height (px 250)
            , scrollbarY
            ]
            (Dict.filter
                (\k v -> not <| (List.member v.nomEntite) model.debug)
                model.fiches
                |> Dict.values
                |> List.map .nomEntite
                |> List.map text
            )
        ]


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
                    , link []
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
                , paragraph
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
                    , link []
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
                    ++ (List.map (\d -> paragraph [] [ text d ]) f.description)
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
        , text <| canonical f.uuid
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
                        , ( "expiryDate", E.int (posixToMillis ld.expiryDate) )
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
    (\{ nom, logo, lien } ->
        E.object
            [ ( "nom", E.string nom )
            , ( "logo", E.string logo )
            , ( "lien", E.string lien )
            ]
    )


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
            |> P.required "label" D.string
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
        |> P.required "expiryDate" (D.map millisToPosix D.int)


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



-------------------------------------------------------------------------------
-----------------------
-- Conversion données--
-----------------------


toMbStr s =
    if s == "" then
        Nothing
    else
        Just s


toTelNbr t =
    case String.split " / " t of
        fixe :: portable :: [] ->
            TelBoth ( fixe, portable )

        tel :: [] ->
            if String.startsWith "06" tel then
                TelPortable t
            else
                TelFixe t

        _ ->
            TelFixe t



-------------------------------------------------------------------------------


type LabelOld
    = FamillePlus
    | NoLabel


type alias TableEntry =
    { name : String
    , label : LabelOld
    , stars : Maybe Int
    , epis : String
    , refOt : Maybe ( String, String )
    , descr : List String
    , addr : String
    , tel : String
    , fax : String
    , mail : String
    , site : String
    , pjaun : String
    , pics : List String
    }


emptyTe =
    TableEntry "" NoLabel Nothing "" Nothing [] "" "" "" "" "" "" []


tableEntryToFiche : String -> String -> TableEntry -> Fiche
tableEntryToFiche cat activ tEntry =
    { uuid = UUID.nil
    , categories = [ cat ]
    , natureActiv =
        if activ /= "" then
            [ activ ]
        else
            []
    , refOt =
        Maybe.andThen
            (\( ref, link ) ->
                Just
                    ( Maybe.withDefault 0 (String.toInt ref)
                    , link
                    )
            )
            tEntry.refOt
    , label =
        case tEntry.label of
            FamillePlus ->
                [ { nom = "FamillePlus"
                  , logo = ""
                  , lien = ""
                  }
                ]

            _ ->
                []
    , rank =
        { stars = tEntry.stars
        , epis =
            String.words tEntry.epis
                |> List.head
                |> Maybe.andThen String.toInt
        }
    , nomEntite = tEntry.name
    , responsables = []
    , adresse = tEntry.addr
    , telNumber = Just <| toTelNbr tEntry.tel
    , fax = toMbStr tEntry.fax
    , email =
        if tEntry.mail == "" then
            []
        else
            [ tEntry.mail ]
    , site =
        toMbStr tEntry.site
            |> Maybe.map (\s -> ( tEntry.name, s ))
    , pjaun = toMbStr tEntry.pjaun
    , visuel = ""
    , description = tEntry.descr
    , linkedDocs = []
    , ouverture = Nothing
    }



-------------------------------------------------------------------------------


type alias Entreprise =
    { name : String
    , descr : List String
    , addr : String
    , tel : String
    , fax : String
    , mail : String
    , site : String
    }


defArt =
    Entreprise "" [] "" "" "" "" ""


entrepriseToFiche : String -> Entreprise -> Fiche
entrepriseToFiche activ e =
    { uuid = UUID.nil
    , categories = [ "Entreprise" ]
    , natureActiv = [ activ ]
    , refOt = Nothing
    , label = []
    , rank = { stars = Nothing, epis = Nothing }
    , nomEntite = e.name
    , responsables = []
    , adresse = e.addr
    , telNumber = Just <| toTelNbr e.tel
    , fax = toMbStr e.fax
    , email =
        if e.mail == "" then
            []
        else
            [ e.mail ]
    , site =
        toMbStr e.site
            |> Maybe.map (\s -> ( e.name, s ))
    , pjaun = Nothing
    , visuel = ""
    , description = e.descr
    , linkedDocs = []
    , ouverture = Nothing
    }



-------------------------------------------------------------------------------


type alias Commerce =
    { name : String
    , descr : List String
    , addr : String
    , tel : String
    , fax : String
    , mail : String
    , site : String
    , pjaun : String
    , refOt : Maybe ( String, String )
    }


defCom =
    Commerce "" [] "" "" "" "" "" "" Nothing


commerceToFiche : String -> Ouverture -> Commerce -> Fiche
commerceToFiche activ ouverture com =
    { uuid = UUID.nil
    , categories = [ "Commerce" ]
    , natureActiv = [ activ ]
    , refOt =
        Maybe.andThen
            (\( ref, link ) ->
                Just
                    ( Maybe.withDefault 0 (String.toInt ref)
                    , link
                    )
            )
            com.refOt
    , label = []
    , rank = { stars = Nothing, epis = Nothing }
    , nomEntite = com.name
    , responsables = []
    , adresse = com.addr
    , telNumber = Just <| toTelNbr com.tel
    , fax = toMbStr com.fax
    , email =
        if com.mail == "" then
            []
        else
            [ com.mail ]
    , site =
        toMbStr com.site
            |> Maybe.map (\s -> ( com.name, s ))
    , pjaun = toMbStr com.pjaun
    , visuel = ""
    , description = com.descr
    , linkedDocs = []
    , ouverture = Just ouverture
    }



-------------------------------------------------------------------------------


type alias Assoc =
    { nom : String
    , preci : String
    , domaine : String
    , siege : String
    , affil : String
    , resp : List { poste : String, nom : String, tel : String }
    , mails : List String
    , sites : List String
    , logo : String
    , cat : Category
    }


type Category
    = Culture
    | Sport
    | Pro


emptyAssoc =
    Assoc "" "" "" "" "" [] [] [] "" Culture


assocToFiche : Assoc -> Fiche
assocToFiche assoc =
    { uuid = UUID.nil
    , categories =
        [ "Association" ]
    , natureActiv =
        case assoc.cat of
            Culture ->
                [ "Culture, Evénementiel, Solidarité" ]

            Pro ->
                [ "Professionnel" ]

            Sport ->
                [ "Sport" ]
    , refOt = Nothing
    , label = []
    , rank = { stars = Nothing, epis = Nothing }
    , nomEntite = assoc.nom
    , responsables =
        List.map (\{ poste, nom, tel } -> Responsable poste nom (toTelNbr tel)) assoc.resp
    , adresse = assoc.siege
    , telNumber = Nothing
    , fax = Nothing
    , email = assoc.mails
    , site =
        case assoc.sites of
            [] ->
                Nothing

            x :: xs ->
                Just x
                    |> Maybe.map (\s -> ( assoc.nom, s ))
    , pjaun = Nothing
    , visuel = ""
    , description =
        [ assoc.preci, assoc.domaine, assoc.affil ]
            |> List.filter (\s -> s /= "")
    , linkedDocs = []
    , ouverture = Nothing
    }



-------------------------------------------------------------------------------
-----------------
-- Agriculture --
-----------------


type alias Agriculteur =
    { name : String
    , descr : List String
    , addr : String
    , tel : String
    , fax : String
    , mail : String
    , site : String
    , refOt : Maybe ( String, String )
    }


defAgri =
    Agriculteur "" [] "" "" "" "" "" Nothing


type alias AgriculteurMap =
    Dict String (List Agriculteur)


agriToFiche : Agriculteur -> Fiche
agriToFiche agri =
    { uuid = UUID.nil
    , categories = [ "Agriculture" ]
    , natureActiv = [ "Agriculteur & producteur de fromages" ]
    , refOt =
        Maybe.andThen
            (\( ref, link ) ->
                Just
                    ( Maybe.withDefault 0 (String.toInt ref)
                    , link
                    )
            )
            agri.refOt
    , label = []
    , rank = { stars = Nothing, epis = Nothing }
    , nomEntite = agri.name
    , responsables = []
    , adresse = agri.addr
    , telNumber = Just <| toTelNbr agri.tel
    , fax = toMbStr agri.fax
    , email =
        if agri.mail /= "" then
            [ agri.mail ]
        else
            []
    , site = Nothing
    , pjaun = Nothing
    , visuel = ""
    , description = agri.descr
    , linkedDocs = []
    , ouverture = Nothing
    }



-------------------------------------------------------------------------------
----------------------
-- Database builder --
----------------------


setUUIDS : Random.Seed -> List Fiche -> ( Random.Seed, List Fiche )
setUUIDS seed fs =
    List.foldr
        (\f ( s, xs ) ->
            let
                ( uuid, newSeed ) =
                    Random.step UUID.generator s

                newFiche =
                    { f | uuid = uuid }
            in
                ( newSeed, newFiche :: xs )
        )
        ( seed, [] )
        fs


doublonValide : Fiche -> Fiche -> Bool
doublonValide f1 f2 =
    (f1.refOt == f2.refOt)
        && (f1.label == f2.label)
        && (f1.rank == f2.rank)
        && (f1.nomEntite == f2.nomEntite)
        && (f1.responsables == f2.responsables)
        && (f1.adresse == f2.adresse)
        && (f1.telNumber == f2.telNumber)
        && (f1.fax == f2.fax)
        && (f1.email == f2.email)
        && (f1.site == f2.site)
        && (f1.visuel == f2.visuel)
        && (f1.description == f2.description)


mergeMultiple : Dict String Fiche -> ( Dict String Fiche, List ( Fiche, Fiche ), List ( Fiche, Fiche ) )
mergeMultiple data =
    let
        mergeFun _ f ( acc, doubles, errors ) =
            case Dict.filter (\k v -> v.nomEntite == f.nomEntite) acc |> Dict.values of
                [] ->
                    ( Dict.insert (canonical f.uuid) f acc, doubles, errors )

                f2 :: xs ->
                    if doublonValide f f2 then
                        let
                            newFiche =
                                { f2
                                    | categories = unique <| f2.categories ++ f.categories
                                    , natureActiv = unique <| f2.natureActiv ++ f.natureActiv
                                }
                        in
                            ( Dict.insert (canonical f2.uuid) newFiche acc
                            , ( f, f2 ) :: doubles
                            , errors
                            )
                    else
                        ( acc, doubles, ( f, f2 ) :: errors )
    in
        Dict.foldr mergeFun ( Dict.empty, [], [] ) data


databaseRes ( r, _, _ ) =
    r


databaseDbl ( _, d, _ ) =
    d


databaseErr ( _, _, e ) =
    e


database seed =
    let
        hebergements =
            azureva
                ++ hotels
                ++ campings
                ++ aires
                ++ chambresHotes
                ++ meubles

        commerces =
            commercesYL
                ++ commercesSummer

        data =
            hebergements
                ++ restaurants
                ++ entreprises
                ++ commerces
                ++ associations
                ++ agriculteurs
    in
        setUUIDS seed data
            |> Tuple.second
            |> List.map (\f -> ( canonical f.uuid, f ))
            |> Dict.fromList
            |> mergeMultiple



-------------------------------------------------------------------------------
--------------------
-- Export to excel--
--------------------


fichesToJsonLink =
    database (initialSeed 0)
        |> (\( res, double, errors ) ->
                List.map encodeFiche (Dict.values res)
                    |> E.list identity
                    |> E.encode 0
                    |> (\data ->
                            el []
                                (html <|
                                    Html.a
                                        [ HtmlAttr.href <|
                                            "data:application/octet-stream;charset=utf-16le;base64,"
                                                ++ Base64.encode data
                                        , HtmlAttr.download "database.json"
                                        ]
                                        [ Html.text "database.json" ]
                                )
                       )
           )



-------------------------------------------------------------------------------
------------------
-- Hebergements --
------------------
--|> Dict.foldr


azureva =
    List.map (tableEntryToFiche "Hébergements" "Village vacance")
        [ { emptyTe
            | name = "Azureva"
            , label = FamillePlus
            , stars = Just 2
            , refOt = Just ( "922722", "https://www.sancy.com/hebergement-collectif/azureva-murol/" )
            , addr = "route de Jassat 63790 MUROL"
            , descr =
                [ "1 à 6 personnes, 250 lits"
                , "Contact: azurèva MUROL - Villages & Résidences de Vacances"
                ]
            , tel = "04 73 88 58 58"
            , fax = "04 73 88 58 00"
            , site = "http://www.azureva-vacances.com/"
          }
        ]


hotels =
    List.map (tableEntryToFiche "Hébergements" "Hotel")
        [ { emptyTe
            | stars = Just 2
            , name = "Résidence des Dômes"
            , addr = "rue de Groire, 63790 Murol"
            , refOt = Just ( "922010", "https://www.sancy.com/hebergement-collectif/residence-des-domes//" )
            , tel = "04 73 88 60 13"
            , fax = "04 73 88 80 05"
            , mail = "domes4@wanadoo.fr"
            , site = "http://www.lesdomes.com"
            , descr = [ "Résidence de tourisme" ]
          }
        , { emptyTe
            | stars = Nothing
            , refOt = Just ( "918257", "https://www.sancy.com/hotel/hotel-du-parc/" )
            , name = "Hotel du Parc"
            , addr = "rue George Sand 63790 MUROL"
            , tel = "04 73 88 60 08 / 07 70 30 29 10"
            , fax = "04 73 88 64 44"
            , descr = [ "Hôtel restaurant" ]
          }
        , { emptyTe
            | stars = Just 2
            , name = "Hotel les Volcans"
            , addr = "rue George Sand 63790 MUROL"
            , tel = "04 73 88 80 19"
            , descr = [ "Hôtel" ]
          }
        , { emptyTe
            | stars = Just 2
            , refOt = Just ( "918292", "https://www.sancy.com/hotel/hotel-des-pins/" )
            , name = "Hotel des Pins"
            , addr = "rue du Levat 63790 MUROL"
            , tel = "04 73 88 60 50"
            , fax = "04 73 88 60 29"
            , descr = [ "Hôtel restaurant" ]
          }
        , { emptyTe
            | stars = Nothing
            , name = "Hôtel du Domaine du Lac Chambon"
            , refOt = Just ( "918276", "https://www.sancy.com/hotel/hotel-domaine-du-lac-chambon/" )
            , addr = "Allée de la Plage 63790 MUROL"
            , tel = "04 44 05 21 58"
            , descr = [ "Hôtel restaurant" ]
          }
          --]
        , { emptyTe
            | stars = Just 3
            , name = "Hotel de Paris"
            , refOt = Just ( "917440", "https://www.sancy.com/hotel/hotel-de-paris/" )
            , addr = "Rue de la Vieille Tour 63790 Murol"
            , tel = "04 73 88 19 09"
            , descr = [ "Hôtel" ]
            , mail = "hoteldeparis.murol@orange.fr"
            , site = "http://hoteldeparis-murol.com/"
          }
        ]


campings =
    List.map (tableEntryToFiche "Hébergements" "Camping")
        [ { emptyTe
            | stars = Just 3
            , label = FamillePlus
            , refOt = Just ( "924637", "https://www.sancy.com/camping/domaine-du-marais/" )
            , name = "Domaine du marais"
            , descr = [ "chalets mobile homes piscine" ]
            , addr = "Le Marais - 63790 MUROL"
            , tel = "04 73 88 85 85"
            , fax = "04 73 88 64 63"
            , site = "http://www.domaine-du-marais.com"
          }
        , { emptyTe
            | stars = Just 3
            , label = FamillePlus
            , refOt = Just ( "924640", "https://www.sancy.com/camping/camping-le-repos-du-baladin/" )
            , name = "Le Repos du Baladin"
            , addr = "Groire - 63790 Murol"
            , tel = "04 73 88 61 93"
            , fax = "04 73 88 66 41"
            , mail = "reposbaladin@free.fr"
            , site = "http://www.camping-auvergne-france.com"
            , descr = [ "mobile homes piscine" ]
          }
        , { emptyTe
            | stars = Just 3
            , label = FamillePlus
            , refOt = Just ( "924631", "https://www.sancy.com/camping/le-domaine-du-lac-chambon/" )
            , name = "Domaine du Lac"
            , addr = "Allée de la Plage, 63790 MUROL"
            , tel = "04 44 05 21 58"
            , descr = [ "mobile homes chalet" ]
            , site = "http://www.domaine-lac-chambon.fr"
          }
        , { emptyTe
            | stars = Just 3
            , label = FamillePlus
            , refOt = Just ( "924636", "https://www.sancy.com/camping/les-fougeres/" )
            , name = "Les Fougères"
            , addr = "Pont du Marais - 63790 MUROL"
            , tel = "04 73 88 67 08"
            , fax = "04 73 88 64 63"
            , mail = "contact@les-fougeres.com"
            , site = "http://www.les-fougeres.com"
            , descr = [ "chalets mobile homes piscine" ]
          }
        , --{ emptyTe |
          --  stars = Just 4
          --, name  = "Camping de la Rybeyre"
          --, addr  = "Jassat - 63790 MUROL"
          --, tel   = "04 73 88 64 29"
          --, fax   = "04 73 88 68 41"
          --, mail  = "laribeyre@free.fr"
          --}
          --,
          { emptyTe
            | stars = Just 4
            , label = FamillePlus
            , refOt = Just ( "924641", "https://www.sancy.com/camping/camping-leurope/" )
            , name = "Camping de l'Europe"
            , addr = "Route de Jassat - 63790 - Murol"
            , tel = "04 73 88 60 46"
            , fax = "04 73 88 69 57"
            , mail = "contact@camping-europe-murol.com"
            , site = "http://www.camping-europe-murol.com"
            , descr = [ "mobile homes piscine" ]
          }
        ]


aires =
    List.map (tableEntryToFiche "Hébergements" "Aire de service et d'accueil")
        [ { emptyTe
            | descr = [ "aire de service et d'accueil" ]
            , refOt = Just ( "924666", "https://www.sancy.com/camping/aire-de-service-et-daccueil-du-domaine-du-lac/" )
            , name = "Domaine du Lac Chambon"
            , addr = "Allée de la Plage 63790 MUROL"
            , tel = "04 44 05 21 58"
            , site = "http://www.domaine-lac-chambon.fr"
          }
        , { emptyTe
            | descr = [ "aire de service et d'accueil" ]
            , refOt = Just ( "924669", "https://www.sancy.com/camping/aire-de-service-et-daccueil-leurope/" )
            , stars = Just 4
            , name = "L'Europe"
            , addr = "route de Jassat 63790 MUROL"
            , mail = "contact@camping-europe-murol.com"
            , site = "http://www.camping-europe-murol.com"
          }
        ]


chambresHotes =
    List.map (tableEntryToFiche "Hébergements" "Chambre d'hotes")
        [ { emptyTe
            | stars = Just 2
            , name = "La Clé des champs"
            , refOt = Just ( "921341", "https://www.sancy.com/chambre-hotes/la-cle-des-champs/" )
            , addr = "Route de Groire - 63790 MUROL"
            , tel = "04 73 88 66 29 / 06 21 49 42 94"
          }
        , { emptyTe
            | stars = Nothing
            , name = "Marie Roche"
            , refOt = Just ( "921361", "https://www.sancy.com/chambre-hotes/marie-roche/" )
            , addr = "Groire - 63790 MUROL"
            , tel = "04 73 88 64 99 / 06 11 57 97 72"
          }
        , --{ emptyTe |
          --  stars = Nothing
          --, name  = "Auvergne France homes"
          --, addr  = "303 rue Pardaniche - 63790 MUROL"
          --, tel   = "04 73 88 81 65"
          --}
          --,
          { emptyTe
            | stars = Nothing
            , name = "Le Dolmen"
            , addr = "La Chassagne 63790 MUROL"
            , tel = "04 73 88 81 67"
          }
        ]


meubles =
    List.map (tableEntryToFiche "Hébergements" "Meublés")
        [ { emptyTe
            | epis = "2 épis"
            , stars = Just 3
            , name = "La Cacode"
            , refOt = Just ( "2800891", "https://www.sancy.com/meubles-gites/la-cacode/" )
            , descr = [ "Maison 4 personnes", "Contact: Mme CLEMENT Marie-Paule" ]
            , addr = "La Chassagne - 63790 Murol"
            , tel = "04 73 65 36 00"
            , mail = "lachassagne@hotmail.fr"
            , site = "http://lachassagne.e-monsite.com/"
          }
        , { emptyTe
            | stars = Just 3
            , name = "La Quiétude"
            , refOt = Just ( "4609702", "https://www.sancy.com/meubles-gites/la-quietude/" )
            , label = FamillePlus
            , descr = [ "Maison 8 personnes", "Contact: Mme PLANEIX Suzanne" ]
            , addr = "Rue de Groire 63790 MUROL"
            , tel = "04 73 78 65 08 - 06 95 29 30 48"
            , mail = "suzanne.planeix@orange.fr"
          }
        , { emptyTe
            | stars = Just 3
            , name = "Gite Bergogne"
            , refOt = Just ( "2885", "http://www.sancy.com/hebergements/detail/2885/murol/gite-bergogne" )
            , descr = [ "Maison mitoyenne 8 personnes", "Contact: centrale de réservation du Sancy" ]
            , addr = "Beaune le froid - 63790 MUROL"
            , tel = "04 73 65 36 00"
          }
        , { emptyTe
            | stars = Just 3
            , name = "Villa Mathieu"
            , refOt = Nothing
            , descr = [ "6 à 8 personnes", "Contact: Mme MATHIEU Anne-Marie" ]
            , addr = "Place de l'hôtel de ville - 63790 MUROL"
            , tel = "04 73 93 69 19 / 07 50 35 54 63"
          }
        , { emptyTe
            | stars = Just 2
            , name = "Entre château et volcans / Jonquilles"
            , refOt = Just ( "3699", "http://www.sancy.com/hebergements/detail/3699/murol/entre-chateau-et-volcans-jonquilles" )
            , label = FamillePlus
            , descr = [ "Appartement 2 personnes", "Contact: Mme DEBOUT Véronique" ]
            , addr = "route de Besse - 63790 MUROL"
            , tel = "04 73 88 67 56 / 06 28 06 81 77"
            , site = "http://www.entre-chateau-et-volcans.fr"
          }
        , { emptyTe
            | stars = Just 2
            , name = "le Chapuzadou"
            , refOt = Just ( "4622601", "https://www.sancy.com/meubles-gites/le-chapuzadou/" )
            , descr = [ "Maison 3 personnes", "Contact: Mme CLEMENT Marie-Paule" ]
            , addr = "La Chassagne - 63790 Murol"
            , tel = "04 73 65 36 00"
            , mail =
                "lachassagne@hotmail.fr"
                --, site  = "http://lachassagne.e-monsite.com/"
          }
        , { emptyTe
            | stars = Just 2
            , name = "Les Cigales"
            , refOt = Just ( "4622806", "https://www.sancy.com/meubles-gites/les-cigales/" )
            , descr = [ "Appartement 5 personnes", "Contact: Mme JULIEN Simone" ]
            , addr = "Rue de Groire - 63790 MUROL"
            , tel = "04 73 88 80 87"
          }
        , { emptyTe
            | stars = Just 2
            , name = "La Clé des champs"
            , refOt = Just ( "4622644", "https://www.sancy.com/meubles-gites/la-cle-des-champs/" )
            , descr = [ "4 personnes", "Contact: M. & Mme DELPEUX Annie et François" ]
            , addr = "Route de Groire - 63790 MUROL"
            , tel = "04 73 88 66 29 - / 06 21 49 42 94 - 06 77 11 62 06"
          }
        , { emptyTe
            | stars = Just 2
            , name = "Les Elfes n°6"
            , label = FamillePlus
            , refOt = Just ( "3125", "http://www.sancy.com/hebergements/detail/3125/murol/les-elfes-n6" )
            , descr = [ "Appartement 4 personnes, Contact: Mme JUAN Alice" ]
            , addr = "Route de Jassat - 63790 MUROL"
            , tel = "04 73 88 61 16 - Portable : 06 88 76 81 70 - joignable : de 9h à 20h"
            , mail = "les.elfes@orange.fr"
          }
        , { emptyTe
            | stars = Just 2
            , name = "Les Genêts"
            , refOt = Just ( "4622949", "https://www.sancy.com/meubles-gites/les-genets/" )
            , descr = [ "Appartement 4 personnes", "Contact: M. NOTHEISEN Marc" ]
            , addr = "Rue d'Estaing - 63790 MUROL"
            , tel = "03 86 73 72 25 / 06 83 59 00 67"
            , mail = "monique-notheisen@orange.fr"
            , site = "http://lesgenets.murol.monsite-orange.fr"
          }
        , { emptyTe
            | stars = Just 2
            , name = "Résidence Clair logis n°1"
            , refOt = Just ( "1468", "http://www.sancy.com/hebergements/detail/1468/murol/residence-clair-logis-n1" )
            , descr = [ "Appartement 3 personnes", "Contact: M. LAPORTE Rémy" ]
            , addr = "Rue George Sand - 63790 MUROL"
            , tel = "04 73 88 65 43"
          }
        , { emptyTe
            | stars = Just 2
            , name = "Résidence Clair logis n°2"
            , refOt = Just ( "1469", "http://www.sancy.com/hebergements/detail/1469/murol/residence-clair-logis-n2" )
            , descr = [ "Appartement 4 personnes", "Contact: M. LAPORTE Rémy" ]
            , addr = "Rue George Sand - 63790 MUROL"
            , tel = "04 73 88 65 43"
          }
        , { emptyTe
            | stars = Just 2
            , name = "Villa Roux"
            , refOt = Just ( "2800984", "https://www.sancy.com/meubles-gites/villa-roux/" )
            , descr =
                [ "Maison mitoyenne 6 personnes"
                , "Contact: M. ROUX André"
                ]
            , addr = "Beaune-le-Froid - 63790 MUROL"
            , tel = "04 73 87 51 47"
          }
        , { emptyTe
            | stars = Just 2
            , name = "Villa Roux"
            , refOt = Just ( "2800985", "https://www.sancy.com/meubles-gites/villa-roux-2/" )
            , descr =
                [ "Maison mitoyenne 4 personnes"
                , "Contact: M. ROUX André"
                ]
            , addr = "Beaune-le-Froid - 63790 MUROL"
            , tel = "04 73 87 51 47"
          }
        , { emptyTe
            | stars = Just 1
            , name = "Villa Roux"
            , refOt = Just ( "2880170", "https://www.sancy.com/meubles-gites/villa-roux-3/" )
            , descr =
                [ "Maison mitoyenne 5 personnes"
                , "Contact: M. ROUX André"
                ]
            , addr = "Beaune-le-Froid - 63790 MUROL"
            , tel = "04 73 87 51 47"
          }
        , { emptyTe
            | stars = Just 1
            , name = "Mon Gai Repos"
            , refOt = Just ( "2880152", "https://www.sancy.com/meubles-gites/mon-gai-repos/" )
            , descr =
                [ "Appartement 2 personnes"
                , "Contact: Mme POMMIER-DESSERRE Madeleine"
                ]
            , addr = "Groire - 63790 MUROL"
            , tel = "04 73 88 60 65 / 06 63 71 70 03"
          }
        , { emptyTe
            | name = "La Christaline"
            , refOt = Just ( "1453", "http://www.sancy.com/hebergements/detail/1453/murol/la-christaline" )
            , descr =
                [ "Studio 2 personnes"
                , "Contact: M. HENRY Christian"
                ]
            , tel = "04 73 88 66 19/ 05 63 75 45 24/ 06 87 97 35 40"
            , addr = "Groire – 63790 MUROL"
            , mail = "henrymurol@orange.fr"
            , site = "http://murolsejourplus.wifeo.com"
          }
        , { emptyTe
            | name = "La Christaline"
            , refOt = Just ( "6586", "http://www.sancy.com/hebergements/detail/6586/murol/la-christaline" )
            , descr =
                [ "Appartement 5 personnes"
                , "Contact: M. HENRY Christian"
                ]
            , tel = "04 73 88 66 19/ 05 63 75 45 24/ 06 87 97 35 40"
            , addr = "Groire – 63790 MUROL"
            , mail = "henrymurol@orange.fr"
            , site = "http://murolsejourplus.wifeo.com"
          }
        , { emptyTe
            | name = "Résidence de Michèle"
            , descr =
                [ "6 appartements 2 à 4 personnes"
                , "Contact: Mme GONTELLE Fanny"
                ]
            , tel = "04 73 88 68 68 / 06 22 33 41 13"
            , addr = "Rue du Tartaret - 63790 MUROL"
            , mail = "residencedemichele@orange.fr"
            , site = "http://residencedemichele.monsite-orange.fr"
          }
        , { emptyTe
            | name = "Résidence de Michèle"
            , stars = Just 3
            , descr =
                [ "Appartement 2 à 4 personnes"
                , "Contact: Mme GONTELLE Fanny"
                ]
            , tel = "04 73 88 68 68 / 06 22 33 41 13"
            , addr = "Rue du Tartaret - 63790 MUROL"
            , mail = "residencedemichele@orange.fr"
            , site = "http://residencedemichele.monsite-orange.fr"
          }
        , { emptyTe
            | name = "Gîte de groupe le Dolmen"
            , refOt = Just ( "925767", "https://www.sancy.com/hebergement-collectif/gite-de-groupe-le-dolmen/" )
            , descr = [ "Gîte de groupe 25 personnes" ]
            , tel = "04 73 61 49 64 / 06 42 90 73 53"
            , addr = "La Chassagne 63790 MUROL"
          }
        , { emptyTe
            | name = "Gîte Roux 1"
            , stars = Just 3
            , refOt = Just ( "3473", "http://www.sancy.com/hebergements/detail/3473/murol/gite-roux-1" )
            , descr =
                [ "Maison mitoyenne 5 personnes"
                , "Contact: centrale de réservation du Sancy"
                ]
            , tel = "04 73 65 36 00"
            , addr = "Beaune-le-Froid 63790 MUROL"
          }
        , { emptyTe
            | name = "Gîte Roux 2"
            , stars = Just 2
            , refOt = Just ( "3476", "http://www.sancy.com/hebergements/detail/3476/murol/gite-roux-2" )
            , descr =
                [ "Maison mitoyenne 6 personnes"
                , "Contact: centrale de réservation du Sancy"
                ]
            , tel = "04 73 65 36 00"
            , addr = "Beaune-le-Froid 63790 MUROL"
          }
        , { emptyTe
            | name = "Gîte Roux 3"
            , stars = Just 3
            , refOt = Just ( "3475", "http://www.sancy.com/hebergements/detail/3475/murol/gite-roux-3" )
            , descr =
                [ "Maison mitoyenne 5 personnes"
                , "Contact: centrale de réservation du Sancy"
                ]
            , tel = "04 73 65 36 00"
            , addr = "Beaune-le-Froid 63790 MUROL"
          }
        , { emptyTe
            | name = "Gîte Scopa"
            , refOt = Just ( "7611", "http://www.sancy.com/hebergements/detail/7611/murol/gite-scopa" )
            , stars = Just 3
            , descr =
                [ "Maison 4 personnes"
                , "Contact: ARVERNHA RESORTS"
                ]
            , tel = "04 73 88 66 46"
            , addr = "Rue Auguste Chauderon 63790 MUROL"
          }
        , { emptyTe
            | name = "Gîte Servier"
            , stars = Just 3
            , refOt = Just ( "8194", "http://www.sancy.com/hebergements/detail/8194/murol/gite-servier" )
            , descr =
                [ "Maison 6 personnes"
                , "Contact: centrale de réservation du Sancy"
                ]
            , tel = "04 73 65 36 00"
            , addr = "rue du Lavoir Beaune-le-Froid 63790 MUROL"
          }
        , { emptyTe
            | name = "la Vie de Château"
            , stars = Just 3
            , refOt = Just ( "4609790", "https://www.sancy.com/meubles-gites/la-vie-de-chateau/" )
            , descr =
                [ "Maison mitoyenne 6 personnes"
                , "Contact: ARVERNHA RESORTS"
                ]
            , tel = "04 73 88 66 46"
            , addr = "rue de Chabrol 63790 MUROL"
            , site = "https://www.facebook.com/media/set/?set=a.1629845623934236.1073741840.1629845083934290&type=1&l=8fb08fb351"
          }
        , { emptyTe
            | name = "la Villa blanche"
            , stars = Just 3
            , refOt = Just ( "4609550", "https://www.sancy.com/meubles-gites/la-villa-blanche/" )
            , descr =
                [ "Maison 11 personnes"
                , "Contact: Mme DABERT-PANCRACIO Amélie"
                ]
            , tel = "04 73 88 61 06"
            , fax = "04 73 88 63 53"
            , addr = "rue de la Pardaniche, 63790 Murol"
          }
        , { emptyTe
            | name = "le Chalet des Noisettes"
            , stars = Just 3
            , refOt = Just ( "4609512", "https://www.sancy.com/meubles-gites/chalet-des-noisettes/" )
            , descr =
                [ "Chalet 4 personnes"
                , "Contact: ARVERNHA RESORTS"
                ]
            , tel = "04 73 88 66 46"
            , addr = "Allée de la Plage 63790 MUROL"
            , site = "https://www.facebook.com/media/set/?set=a.1630069510578514.1073741857.1629845083934290&type=1&l=84432e8458"
          }
        , { emptyTe
            | name = "les Fayards"
            , stars = Just 3
            , descr =
                [ "3 chalets 5 personnes"
                , "Contact: Mme AUBERTY Corinne"
                ]
            , tel = "04 73 88 64 28"
            , addr = "Groire"
            , mail = "auberty.francois@orange.fr"
            , site = "http://les.fayards.free.fr"
          }
        , { emptyTe
            | name = "les Fushias"
            , stars = Just 2
            , refOt = Just ( "4622970", "https://www.sancy.com/meubles-gites/les-fushias/" )
            , descr =
                [ "Appartement 2 personnes"
                , "Contact: Mme PEUCH Jeanine "
                ]
            , tel = "04 73 88 68 28"
            , addr = "rue de Groire 63790 MUROL"
          }
        , { emptyTe
            | name = "Villa Bel-Hêtre"
            , stars = Just 4
            , refOt = Just ( "2809608", "https://www.sancy.com/meubles-gites/villa-bel-hetre/" )
            , descr =
                [ "Maison 8 personnes"
                , "Contact: ARVERNHA RESORTS"
                ]
            , tel = "04 73 88 66 46"
            , addr = "Chemin de Groire 63790 MUROL"
            , site = "https://www.facebook.com/media/set/?set=a.1629845500600915.1073741838.1629845083934290&type=1&l=a1bb153598"
          }
        , { emptyTe
            | name = "Villa Marie Louise étage"
            , stars = Just 3
            , refOt = Just ( "5302", "http://www.sancy.com/hebergements/detail/5302/murol/villa-marie-louise-etage" )
            , descr =
                [ "Appartement 6 personnes"
                , "Contact: Mme GUITTARD Crystel"
                ]
            , tel = "04 73 61 31 47 / 06 88 18 10 56"
            , addr = "Groire 63790 MUROL"
          }
        , { emptyTe
            | name = "Les Vergers du Sancy"
            , refOt = Nothing
            , epis = "3 épis"
            , descr =
                [ "Maison 2 personnes"
                , "Contact: Mme PICOT Monique"
                ]
            , tel = "04 73 88 65 79 / 06 84 29 28 25"
            , addr = "La Chassagne 63790 MUROL"
            , mail = "philippe.picot@orange.fr"
            , site = "http://gite-vergers-sancy.com/"
          }
        , { emptyTe
            | name = "Gîte de Jassaguet"
            , refOt = Just ( "4609653", "https://www.sancy.com/meubles-gites/gite-de-jassaguet/" )
            , descr = [ "Maison 4 personnes" ]
            , tel = "04 73 88 66 46"
            , addr = "Rue Jassaguet 63790 Murol"
            , mail = ""
            , site = "https://www.facebook.com/media/set/?set=a.1630071440578321.1073741858.1629845083934290&type=1&l=b3f317a2ed"
          }
        , { emptyTe
            | name = "Chalet Papon"
            , refOt = Just ( "4746146", "https://www.sancy.com/meubles-gites/chalet-papon/" )
            , descr = [ "Maison 6 personnes" ]
            , tel = "04 73 35 69 82"
            , addr = "Route de Clermont, Beaune le Froid 63790 Murol"
            , mail = ""
            , site = ""
          }
        , { emptyTe
            | name = "Les Fougeoles"
            , refOt = Just ( "4622448", "https://www.sancy.com/meubles-gites/les-fougeolles/" )
            , descr =
                [ "Maison 4 personnes"
                ]
            , tel = "04 73 88 48 48"
            , addr = "Pied du Puy de Tartaret, 63790 Murol"
            , mail = ""
            , site = ""
          }
        , { emptyTe
            | name = "Gîte chez Cadi"
            , refOt = Just ( "2801001", "https://www.sancy.com/meubles-gites/gite-chez-cadi/" )
            , stars = Just 3
            , descr =
                [ "Maison 6 personnes"
                ]
            , tel = "04 73 65 36 00"
            , addr = "Rue du Lavoir - Beaune le Froid, 63790 Murol"
            , mail = ""
            , site = ""
          }
        , { emptyTe
            | stars = Just 2
            , name = "Gîte des Dômes"
            , addr = "rue de Groire, 63790 Murol"
            , refOt = Just ( "4845395", "https://www.sancy.com/hebergement-collectif/gite-des-domes/" )
            , tel = "04 73 88 60 13"
            , fax = "04 73 88 80 05"
            , mail = "domes4@wanadoo.fr"
            , site = "http://www.lesdomes.com"
            , descr = [ "Gîte de groupe" ]
          }
        , { emptyTe
            | name = "Appartement agréable"
            , refOt = Just ( "4633164", "https://www.sancy.com/meubles-gites/appartement-agreable/" )
            , descr =
                [ "Meublé 4 personnes"
                ]
            , tel = "06 58 63 06 27"
            , addr = "Le Pré-long, 63790 Murol"
            , mail = ""
            , site = ""
          }
        , { emptyTe
            | name = "La maison de Mémé"
            , stars = Just 3
            , refOt = Just ( "4632842", "https://www.sancy.com/meubles-gites/la-maison-de-meme/" )
            , descr = [ "Maison 4 personnes" ]
            , tel = "04 73 61 31 47"
            , addr = "Groire, 63790 Murol"
            , mail = ""
            , site = "http://www.gitesdegroire.com/"
          }
        , { emptyTe
            | name = "Le petit Lutess"
            , refOt = Just ( "4631153", "https://www.sancy.com/meubles-gites/le-petit-lutess/" )
            , descr = [ "Appartement 4 personnes" ]
            , tel = "04 73 88 66 46"
            , addr = "1 rue de Chabrol, 63790 Murol"
            , mail = "contact@arvernha-resorts.com"
            , site = "https://www.facebook.com/media/set/?set=a.1749357098649754.1073741872.1629845083934290&type=1&l=e85b755304"
          }
        , { emptyTe
            | name = "Les gîtes du paradis - n°3"
            , refOt = Just ( "4631141", "https://www.sancy.com/meubles-gites/les-gites-du-paradis-n3/" )
            , descr =
                [ "Maison 4 personnes"
                ]
            , tel = "06 63 25 56 47"
            , addr = "Rue Charreton, 63790 Murol"
            , mail = ""
            , site = ""
          }
        , { emptyTe
            | name = "Les gîtes du paradis - n°2"
            , refOt = Just ( "4631140", "https://www.sancy.com/meubles-gites/les-gites-du-paradis-n2/" )
            , descr =
                [ "Maison 4 personnes"
                ]
            , tel = "06 63 25 56 47"
            , addr = "Rue Charreton, 63790 Murol"
            , mail = ""
            , site = ""
          }
        , { emptyTe
            | name = "Les gîtes du paradis - n°1"
            , refOt = Just ( "4631139", "https://www.sancy.com/meubles-gites/les-gites-du-paradis-n1/" )
            , descr =
                [ "Maison 6 personnes"
                ]
            , tel = "06 63 25 56 47"
            , addr = "Rue Charreton, 63790 Murol"
            , mail = ""
            , site = ""
          }
        , { emptyTe
            | name = "Gîte les Iris"
            , stars = Just 2
            , refOt = Just ( "2800988", "https://www.sancy.com/meubles-gites/gite-les-iris/" )
            , descr =
                [ "Maison 6 personnes"
                ]
            , tel = "04 73 65 36 00"
            , addr = "Beaune-le-Froid, 63790 Murol"
            , mail = ""
            , site = ""
          }
        , { emptyTe
            | name = "Gîte les Mésanges"
            , stars = Just 3
            , refOt = Just ( "2800987", "https://www.sancy.com/meubles-gites/gite-les-mesanges-2/" )
            , descr =
                [ "Maison 5 personnes"
                ]
            , tel = "04 73 65 36 00"
            , addr = "Beaune-le-Froid, 63790 Murol"
            , mail = ""
            , site = ""
          }
        , { emptyTe
            | name = "Gîte les Hirondelles"
            , refOt = Just ( "2800986", "https://www.sancy.com/meubles-gites/gite-les-hirondelles/" )
            , stars = Just 3
            , descr =
                [ "Maison 5 personnes"
                ]
            , tel = "04 73 65 36 00"
            , addr = "Beaune-le-Froid, 63790 Murol"
            , mail = ""
            , site = ""
          }
        , { emptyTe
            | name = "Gîte le Beaune... heure"
            , stars = Just 3
            , refOt = Just ( "2800862", "https://www.sancy.com/meubles-gites/gite-le-beaune-heure/" )
            , descr =
                [ "Maison 8 personnes"
                ]
            , tel = "0473653600"
            , addr = "Beaune-le-Froid, 63790 Murol"
            , mail = ""
            , site = ""
          }
          --,
          --{ emptyTe |
          --  name  = ""
          --, refOt = Just ("","")
          --, descr = [""
          --          , "Contact: "]
          --, tel   = ""
          --, addr  = ""
          --, mail  = ""
          --, site  = ""
          --}
          --{ emptyTe |
          --  name  = "Les Homes de Vire Vent"
          --, descr = ["5 personnes"
          --          , "Melle Fanny Gontelle"]
          --, tel   = "04 73 69 76 64    Port : 06 07 30 95 43"
          --, addr  = "route de Jassat - 63790 MUROL"
          --, mail  = "legoueix.nicole@club-internet.fr"
          --, site  = "http://www.les-homes-de-virevent.com"
          --}
        ]



-------------------------------------------------------------------------------
-----------------
-- Restaurants --
-----------------


restaurants =
    List.map (tableEntryToFiche "Restaurants" "")
        [ { emptyTe
            | name = "Les Sancy'Elles"
            , addr = "63790 Beaune le Froid -MUROL"
            , refOt = Just ( "7980", "http://www.sancy.com/activites/detail/7980/murol/les-sancy-elles" )
            , descr = [ "Restaurant crêperie" ]
            , tel = "04 73 88 81 18 / 06 29 39 04 77"
          }
        , { emptyTe
            | name = "A jour et nuit"
            , addr = "Rue d'Estaing - 63790 MUROL"
            , descr = [ "Bar brasserie restaurant" ]
            , tel = "04 73 88 64 82"
          }
        , { emptyTe
            | name = "Au Montagnard"
            , addr = "Rue d'Estaing - 63790 MUROL"
            , descr = [ "Plat à emporter au restaurant" ]
            , tel =
                "04 73 88 61 52"
                --, mail  = "restaurant.aumontagnard@orange.fr"
            , site = "http://restaurantaumontagnard.wifeo.com/"
          }
        , { emptyTe
            | name = "les Pins"
            , descr = [ "Restaurant" ]
            , addr = "Rue du Levat 63790 MUROL"
            , tel = "04 73 88 60 50"
            , site = "http://www.hoteldespins-murol.com"
          }
        , { emptyTe
            | name = "T-Me"
            , refOt = Just ( "4653973", "https://www.sancy.com/restaurant/t-me/" )
            , descr = [ "Bar/bistrot restaurant pizzeria brasserie pub/bar de nuit" ]
            , addr = "route de Besse 63790 MUROL"
            , tel = "09 81 36 69 58 / 06 68 48 00 04"
            , mail = "t-me@hotmail.fr"
          }
        , { emptyTe
            | name = "L'imprevu"
            , descr = [ "Bureau de tabac bar" ]
            , addr = "Rue Pierre Céleirol 63790 MUROL"
            , tel = "04 73 87 99 61"
          }
        , { emptyTe
            | name = "Snack pizzeria  les Fougères le Domaine du Marais"
            , refOt = Just ( "4654087", "https://www.sancy.com/restaurant/snack-pizzeria-les-fougeres-domaine-du-marais/" )
            , descr = [ "restaurant pizzeria sandwicherie snack" ]
            , addr = "Le Marais, 63790 MUROL"
            , tel = "04 73 88 67 08 "
          }
        , { emptyTe
            | name = "Crêperie Le George Sand"
            , refOt = Just ( "4654040", "https://www.sancy.com/restaurant/creperie-george-sand/" )
            , descr = [ "Restaurant crêperie" ]
            , addr = "Rue George Sand 63790 MUROL"
            , tel = "06 28 29 55 99"
            , site = "http://www.sancy.com/activites/detail/4050/murol/creperie-le-george-sand"
          }
        , { emptyTe
            | name = "Auberge de la Plage"
            , descr = [ "bar brasserie restaurant" ]
            , addr = "La Plage de Murol 63790 MUROL"
            , tel = "04 73 88 67 90"
          }
        , { emptyTe
            | name = "le Domaine du Lac"
            , label = FamillePlus
            , refOt = Just ( "4654050", "https://www.sancy.com/restaurant/le-restaurant-du-domaine-du-lac/" )
            , descr = [ "Bar/bistrot brasserie restaurant" ]
            , addr = "Plage de Murol 63790 MUROL"
            , tel = "04 44 05 21 58"
            , mail = "lac.chambon@wanadoo.fr"
          }
        , { emptyTe
            | name = "Le Picotin"
            , descr = [ "Restaurant pizzeria" ]
            , refOt = Just ( "4654005", "https://www.sancy.com/restaurant/le-picotin/" )
            , label = FamillePlus
            , addr = "Rue George Sand - 63790 MUROL"
            , tel = "04 73 62 37 10 / 06 83 00 11 85"
          }
        , { emptyTe
            | name = "L'Arbalète"
            , refOt = Just ( "4654060", "https://www.sancy.com/restaurant/larbalete/" )
            , addr = "Rue George Sand - 63790 Murol"
            , tel = "04 73 88 85 79"
            , mail = "restaurantlarbalete@gmail.com"
          }
        ]



-------------------------------------------------------------------------------
-----------------
-- Entreprises --
-----------------


entreprises =
    List.foldr (\( k, v ) acc -> List.map (entrepriseToFiche k) v ++ acc)
        []
        [ ( "Electricité générale"
          , [ { defArt
                | name = "Boulhol Cougoul (Sarl)"
                , addr = "Groire 63790 MUROL"
                , tel = "04 73 88 67 33"
              }
            , { defArt
                | name = "Cattarelli Rémi"
                , addr = "route de Besse - 63790 MUROL"
                , tel = "06 86 18 16 54"
                , mail = "remi.cattarelli@orange.fr"
                , site = "http://electymurol.wifeo.com"
              }
            , { defArt
                | name = "Sancy Electricité"
                , addr = "chemin des sables 63790 MUROL"
                , tel = "04 73 88 67 16"
              }
            ]
          )
        , ( "Electricité et petits travaux du bâtiment"
          , [ { defArt
                | name = "Olivier Dhainaut"
                , addr = "Groire 63790 MUROL"
                , tel = "04 73 88 66 33 ou 06 99 40 17 08"
                , mail = "ace.dhainaut@neuf.fr"
              }
            ]
          )
        , ( "Maçonnerie"
          , [ { defArt
                | name = "Bouche Benoît (SARL)"
                , addr = "Beaune Le Froid 63790 MUROL"
                , tel = "04 73 88 80 72"
              }
            ]
          )
        , ( "Plomberie"
          , [ { defArt
                | name = "Bouche Nicolas"
                , addr = "Rue George Sand 63790 MUROL"
                , tel = "06 64 10 74 78"
              }
            ]
          )
          --,("Peintre en bâtiment"
          -- , [{ defArt |
          --      name   = "Peuch Gérard"
          --    , addr   = "rue de Groire 63790 MUROL"
          --    , tel    = "04 7388 6033"
          --    }]
          -- )
        , ( "Marché de demi-gros et détail"
          , [ { defArt
                | name = "Jallet Fruits et légumes"
                , addr = "route de Besse 63790 MUROL"
                , tel = "04 73 88 66 82"
                , fax = "04 73 88 64 88"
              }
            ]
          )
        , ( "Quincaillerie"
          , [ { defArt
                | name = "Legoueix Père et Fils (SARL)"
                , addr = "rue du Tartaret 63790 MUROL"
                , tel = "04 7388 6621"
                , fax = "04 73 88 80 39"
              }
            ]
          )
        , ( "Plâtrerie/peinture"
          , [ { defArt
                | name = "Sébastien Bouche"
                , addr = "Beaune-le-Froid 63790 MUROL"
                , tel = "06 18 70 41 71"
              }
            ]
          )
          --,(""
          -- , [{ defArt |
          --      name   = ""
          --    , descr  = ""
          --    , addr   = ""
          --    , tel    = ""
          --    , fax    = ""
          --    }]
          -- )
          --,(""
          -- , [{ defArt |
          --      name   = ""
          --    , descr  = ""
          --    , addr   = ""
          --    , tel    = ""
          --    , fax    = ""
          --    }]
          -- )
          --,("Reprographie"
          -- , [{ defArt |
          --      name   = "Chazay Yvon"
          --    , descr  = ["création - impression - dépannage informatique"]
          --    , addr   = "rue Georges Sand 63790 Murol"
          --    , tel    = "06 2451 7696"
          --    , mail   = "murol.repro@sfr.fr"
          --    }]
          -- )
          --,("Taxi"
          -- , [{ defArt |
          --      name   = "Amblard Taxi"
          --    , addr   = "La Chassagne 63790 MUROL"
          --    , tel    = "04 7388 6937 ou 06 7455 1533"
          --    }
          --   ,
          --    { defArt |
          --      name   = "Miseroux Taxi"
          --    , addr   = "Groire 63790 MUROL"
          --    , tel    = "04 7388 8112"
          --    , site   = "www.taxi-murol.com"
          --    }]
          -- )
          --,("Boulanger"
          -- , [{ defArt |
          --      name   = "Bigand Michel"
          --    , addr   = "Rue Chabrol - 63790 MUROL"
          --    , tel    = "04 7388 6024"
          --    }]
          -- )
          --,("Boucherie"
          -- , [{ defArt |
          --      addr   = "Rue Chabrol - 63790 MUROL"
          --    , tel    = "04 7388 6905"
          --    }]
          -- )
          --,("Coiffure"
          -- , [{ defArt |
          --      name   = "Béal Patricia"
          --    , addr   = "rue Estaing 63790 MUROL"
          --    , tel    = "04 7388 6059"
          --    }]
          -- )
          --,("Création et travail du cuir"
          -- , [{ defArt |
          --      name   = "Peaux de vaches création"
          --    , addr   = "Rue de Chabrol 63790 MUROL"
          --    , tel    = "047378 1653"
          --    , mail   = "marc.humbert.cuir@orange.fr"
          --    , site   = "http://www.peaux-de-vaches-creation.com"
          --    }]
          -- )
        ]


commercesYL =
    List.foldr (\( k, v ) acc -> List.map (commerceToFiche k TteAnnee) v ++ acc)
        []
        [ ( "Alimentation"
          , [ { defCom
                | name = "Petit Casino"
                , descr = [ "Alimentation générale" ]
                , addr = "rue Pierre Céleirol - 63790 MUROL"
                , tel = "04 73 88 80 13"
              }
            , { defCom
                | name = "Supermarché SPAR"
                , refOt = Just ( "4662103", "https://www.sancy.com/commerce-service/spar/" )
                , descr = [ "Alimentation générale", "Service drive et livraison: www.sparmurol.fr" ]
                , addr = "Rue de Besse - 63790 MUROL"
                , tel = "04 73 88 60 45 "
                , fax = "04 73 88 66 60"
              }
            , { defCom
                | name = "Vival"
                , refOt = Just ( "4662124", "https://www.sancy.com/commerce-service/vival-2/" )
                , descr = [ "Alimentation générale" ]
                , addr = "Rue Chabrol - 63790 MUROL"
                , tel = "04 73 88 61 56"
              }
            ]
          )
        , ( "Assurances"
          , [ { defCom
                | name = "AXA assurances Verdier"
                , addr = "Rue George Sand 63790 MUROL"
                , tel = "04 73 88 68 77"
                , fax = "04 73 88 63 79"
              }
            ]
          )
        , ( "Poste banque distributeur"
          , [ { defCom
                | name = "La poste la Banque Postale"
                , refOt = Just ( "6246", "http://www.sancy.com/activites/detail/6246/murol/la-poste" )
                , descr = [ "services postaux et bancaires distributeur de billets" ]
                , addr = "Rue George Sand 63790 MUROL"
                , tel = "04 73 88 61 49 - National: 36 31"
                , site = "http://www.laposte.fr"
              }
            , { defCom
                | name = "Distributeur SPAR"
                , refOt = Just ( "4700279", "https://www.sancy.com/commerce-service/distributeur-automatique-de-billets/" )
                , descr = [ "Distributeur de billets" ]
                , addr = "Route de Besse 63790 MUROL"
              }
            ]
          )
        , ( "Boucherie"
          , [ { defCom
                | name = "La Pièce du Boucher"
                , refOt = Just ( "4662160", "https://www.sancy.com/commerce-service/la-piece-du-boucher/" )
                , addr = "Rue George Sand 63790 MUROL"
                , tel = "04 73 87 77 48"
              }
            ]
          )
        , ( "Prestataires"
          , [ { defCom
                | name = "Auvergne Escapade"
                , refOt = Just ( "4716925", "https://www.sancy.com/commerce-service/auvergne-escapade/" )
                , addr = "Beaune-le-Froid - 63790 MUROL"
                , tel = "06 86 89 34 87"
                , descr = [ "Randonnées pédestres guidées et raquettes à neige en hiver" ]
                , site = "http://www.auvergne-escapade.com/"
              }
            , { defCom
                | name = "Bureau Montagne Auvergne Sancy Volcans"
                , refOt = Just ( "4716923", "https://www.sancy.com/commerce-service/bureau-montagne-auvergne-sancy-volcans/" )
                , addr = "Bp 11 - 63790 MUROL"
                , tel = "06 41 66 90 80"
                , descr = [ "Raquettes à neige. Randonnées sur les volcans, lever de soleil, orientation, VTT, astronomie, tir à l'arc." ]
                , site = "http://www.bureaumontagne.com/"
              }
            ]
          )
        , ( "Boulangerie"
          , [ { defCom
                | name = "Le fournil du château"
                , addr =
                    "Rue George Sand - 63790 MUROL"
                    --, tel    = "04 7388 6024"
                , mail = "lefournilduchâteau.murol@gmail.com"
                , descr = [ "Facebook: fb/lefournil.murol" ]
              }
            ]
          )
          --,("Café"
          -- , [{ defCom |
          --      name   = "Café de la côte"
          --    , addr   = "Rue Chabrol - 63790 MUROL"
          --    , tel    = "06 7941 0811"
          --    }]
          -- )
        , ( "Art de la maison - cadeaux - souvenirs"
          , [ { defCom
                | name = "Le grenier du château"
                , refOt = Just ( "4672387", "https://www.sancy.com/commerce-service/le-grenier-du-chateau/" )
                , addr = "Rue Georges Sand - 63790 MUROL"
                , tel = "04 73 88 95 28"
                , mail = "le-grenier-du-chateau@sfr.fr"
                , descr = [ "Art de la maison, cadeaux, souvenirs" ]
              }
            ]
          )
          --,("Coiffure"
          -- , [{ defCom |
          --      name   = "Beal Patricia"
          --    , descr  = ["Coiffure mixte"]
          --    , addr   = "Rue Estaing - 63790 MUROL"
          --    , tel    = "04 73 88 60 59"
          --    }]
          -- )
        , ( "Garage"
          , [ { defCom
                | name = "Garage de l'Avenir"
                , descr = [ "Réparations toutes marques, carburants" ]
                , addr = "Le Marais - 63790 MUROL"
                , refOt =
                    Just ( "4668358", "https://www.sancy.com/commerce-service/garage-de-lavenir/" )
                    --, tel    = "04 7388 6022"
                    --, fax    =  "04 73 88 61 33"
              }
            , { defCom
                | name = "Murol Moto Sport"
                , descr = [ "Vente réparations toutes marques" ]
                , addr = "route de Besse - 63790 MUROL"
                , tel = "06 78 08 35 74"
                , fax = "04 76 88 66 60"
                , mail =
                    "cattarellisacha@orange.fr"
                    --, site   = "http://murolmotosport.wifeo.com"
              }
            , { defCom
                | name = "Sancy Bike Service"
                , descr = [ "Réparation et entretien de vélos, VTT, cyclos. Vente pièces et accessoires." ]
                , addr = "Rue du Tartaret - 63790 MUROL"
                , tel = "0676121929"
                , refOt =
                    Just ( "4768953", "https://www.sancy.com/commerce-service/sancy-bike-service/" )
                    --, fax    = "04 76 88 66 60"
                , mail = "ebikeattitude@gmail.com"
                , site = "https://www.sancybikeservice.com/"
              }
            ]
          )
        , ( "Laverie"
          , [ { defCom
                | name = "Laverie des Aloés"
                , addr = "Rue Chabrol - 63790 MUROL"
                , descr =
                    [ "Ouvert 7 jours / 7 – toute l’année de 8h à 22h"
                    , "lave-linge 6 et 18 kg/ sèche linge"
                    ]
                , tel = "06 72 16 78 46"
                , mail = "laverielesaloes@gmail.com"
              }
            ]
            --,
            --{ defCom |
            --  name   = "Blanchisserie et vente de linge de maison"
            --, addr   = "Rue Chabrol - 63790 MUROL"
            --, tel    = "06 52 43 52 52"
            --, mail   = "lavaloes@gmail.com"
            --, descr  = ["Ouvert toute l’année"
            --           ,"Lundi et jeudi de 14h00 à 19h30 (juillet/août 22h00)"
            --           ,"Mercredi de 09h00 à 13h00"
            --           ,"Vendredi et samedi de 9h30 à 12h30 / 14h00 à 19h30"
            --           ,"Dimanche de 9h30 à 12h30"]
            --}]
          )
        , ( "Pharmacie"
          , [ { defCom
                | name = "Pharmacie Brassier"
                , refOt = Just ( "4666016", "https://www.sancy.com/commerce-service/pharmacie-brassier/" )
                , addr = "Rue Estaing - 63790 MUROL"
                , tel = "04 73 88 60 42"
              }
            ]
          )
        , ( "Artisanat d'Art, galerie d'art, antiquité"
          , [ { defCom
                | name = "Atelier ST Christophe"
                , addr = "Rue George Sand 63790 MUROL"
                , refOt = Just ( "4681516", "https://www.sancy.com/commerce-service/atelier-saint-christophe-murol-feerie/" )
                , tel = "04 63 22 68 15"
                , descr = [ "Création de bijoux" ]
              }
            , { defCom
                | name = "Atelier Hotantik by Fab"
                , addr = "Rue Chabrol 63790 MUROL"
                , tel = "06 80 00 11 09"
                , descr = [ "Sculpture, ferronnerie" ]
              }
              --,
              --{ defCom |
              --   name   = "Galerie d'Art"
              -- , addr   = "Rue George Sand 63790 MUROL"
              --}
            ]
          )
        , ( "Transport"
          , [ { defCom
                | name = "Amblard Taxi"
                , refOt = Just ( "3922", "http://www.sancy.com/activites/detail/3922/murol/taxi-amblard" )
                , addr = "La Chassagne 63790 MUROL"
                , tel = "04 73 88 69 37 / 06 74 55 15 33"
                , descr = [ "Taxi, transport malade assis" ]
              }
            , { defCom
                | name = "Taxi Maryline"
                , refOt = Just ( "4666800", "https://www.sancy.com/commerce-service/sancy-taxi-maryline-2/" )
                , addr = "Le Bourg 63790 MUROL"
                , tel = "04 73 88 81 12 / 06 89 56 25 94"
                , mail = "sancytaxi@orange.fr"
                , descr = [ "Taxi, transport malade assis" ]
              }
            , { defCom
                | name = "Navette Azureva "
                , refOt = Just ( "4849676", "https://www.sancy.com/commerce-service/navette-azureva-murol-besse-super-besse/" )
                , tel = "04 73 88 58 58"
                , descr = [ "ligne Murol Superbesse" ]
              }
              --,
              --{ defCom |
              --   name   = "Navette publique"
              -- , refOt  = Just ("6505","http://www.sancy.com/activites/detail/6505/murol/ligne-reguliere-chambon-murol-st-nectaire-clermont")
              -- , tel    = "04 73 88 62 62 / 04 73 88 60 67"
              -- , descr  = ["ligne pour Clermont Ferrand"]
              --}
            ]
          )
        , ( " Informatique: dépannage, graphiste, créateur"
          , [ { defCom
                | name = "Volcanographics"
                , descr = [ "Site internet, logo…" ]
                , addr = "Groire 63790 MUROL"
                , tel = "04 73 62 11 07 / 06 81 86 69 43"
                , mail = "contact@volcanographics.com"
                , site = "http://www.volcanographics.com"
              }
            , { defCom
                | name = "Yvon CHAZEY"
                , descr = [ "Création, reprographie, dépannage" ]
                , addr = "Rue George Sand 63790 MUROL"
                , tel = "06 24 51 76 96"
                , mail = "murol.repro@sfr.fr"
              }
            ]
          )
          --, ( "Artisanat d'Art, galerie d'art, antiquité"
          --  , [ { defCom
          --        | name = "Atelier ST Christophe"
          --        , addr = "Rue George Sand 63790 MUROL"
          --        , tel = "04 63 22 68 15"
          --        , descr = [ "Création de bijoux" ]
          --      }
          --    , { defCom
          --        | name = "Atelier Hotantik by Fab"
          --        , addr = "Rue Chabrol 63790 MUROL"
          --        , tel = "06 80 00 11 09"
          --        , descr = [ "Sculpture, ferronnerie" ]
          --      }
          --    --,
          --    --{ defCom |
          --    --   name   = "Galerie d'Art"
          --    -- , addr   = "Rue George Sand 63790 MUROL"
          --    --}
          --    ]
          --  )
        , ( "Produit du terroir"
          , [ { defCom
                | name = "Les Caves du château"
                , refOt = Just ( "4662107", "https://www.sancy.com/commerce-service/les-caves-du-chateau/" )
                , descr = [ "caviste, fromager, produits du terroir" ]
                , addr = "Place du pont - 63790 MUROL"
                , tel = "04 73 88 63 34"
              }
            , { defCom
                | name = "la Musardiere"
                , descr = [ "Produits du terroir, souvenirs" ]
                , addr = "Rue d'Estaing 63790 MUROL"
                , tel = "04 73 88 69 09"
              }
            ]
          )
        ]


commercesSummer =
    List.foldr (\( k, v ) acc -> List.map (commerceToFiche k Saisonniere) v ++ acc)
        []
        [ ( "Art de la maison - cadeaux - souvenirs"
          , [ { defCom
                | name = "Legoueix père et fils (été)"
                , refOt = Just ( "6111", "http://www.sancy.com/activites/detail/6111/murol/magasin-legoueix" )
                , addr = "Rue du Tartaret 63790 MUROL"
                , tel = "04 73 88 66 21"
                , descr = [ "Souvenirs" ]
              }
            ]
          )
        , ( "Artisanat d'Art, galerie d'art, antiquité"
          , [ { defCom
                | name = "Cuir Cath"
                , refOt = Just ( "4795036", "https://www.sancy.com/commerce-service/artisanat-dart-cuir-cath-2/" )
                , addr = "Rue George Sand 63790 MUROL"
                , tel = "06 11 89 14 52"
                , mail = "cuircath63@orange.fr"
                , descr = [ "Création maroquinerie" ]
              }
            ]
          )
        , ( "Produit du terroir"
          , [ { defCom
                | name = "Lou Cava'yo"
                , refOt = Just ( "8059", "http://www.sancy.com/activites/detail/8059/murol/lou-cava-yo" )
                , addr = "Rue Georges Sand - 63790 MUROL"
                , tel = "06 31 44 19 80"
                , descr = [ "Fromager, produits du terroir" ]
              }
            , { defCom
                | name = "Les saveurs d'antan"
                , descr = [ "Produits du terroir" ]
                , addr = "Le Marais - 63790 MUROL"
                , tel = "04 73 88 69 23"
              }
            ]
          )
        , ( "Alimentation"
          , [ { defCom
                | name = "Jallet"
                , descr = [ "Fruits et légumes" ]
                , addr = "Le Marais 63790 MUROL"
              }
            ]
          )
        , ( "Location de materiel skis raquettes"
          , [ { defCom
                | name = "Legoueix père et fils (hiver)"
                , refOt = Just ( "4682148", "https://www.sancy.com/commerce-service/legoueix-skishop/" )
                , descr = []
                , addr = "Rue du Tartaret 63790 MUROL"
                , tel = "04 73 88 66 21"
              }
            ]
          )
        , ( "Location de Pedal’eau"
          , [ { defCom
                | name = "plage Murol du lac Chambon"
                , refOt = Just ( "4716921", "https://www.sancy.com/commerce-service/location-de-pedaleau/" )
                , descr =
                    []
                , addr = "plage Murol du lac Chambon"
                , tel =
                    "06 08 58 40 30"
                    --, site  = ""
              }
            ]
          )
        , ( "Vêtements"
          , [ -- { defCom |
              --   name   = "Altitude cottayshop"
              -- , addr   = "rue Georges Sand - 63790 MUROL"
              -- , tel    = ""
              -- , descr  = ["Ouvert du 1 juillet au 30 septembre de 10h00 à 13h00 et de 15h00 à 20h00"
              --            , "Chaussures de randonnée - vêtements divers"]
              -- }
              --,
              { defCom
                | name = "Toutiveti"
                , addr = "Route de Besse - parking supermarché SPAR - 63790 MUROL"
                , refOt = Just ( "4679489", "https://www.sancy.com/commerce-service/toutiveti-vetements/" )
                , tel = "06 76 66 97 47"
                , mail = "toutiveti@hotmail.fr"
                , descr = [ "Vêtements/chaussures - hommes/femmes/enfants " ]
              }
            ]
          )
        , ( "Location poneys"
          , [ { defCom
                | name = "Western Poneys"
                , refOt = Just ( "4716916", "https://www.sancy.com/commerce-service/western-poneys/" )
                , descr =
                    [ "Location poneys en main pour enfant accompagné d'un adulte."
                    , "Automne hiver 2018-19"
                    , ""
                    , "Balades à poneys sur réservation le mercredi de 14h à 16h"
                    , "Ouvertures ponctuelles week-ends et jours fériés ou vacances scolaires suivant vos demandes et suivant météo. "
                    , "Consultez les horaires et jours d'ouverture sur notre site internet, régulièrement mis à jour :"
                    ]
                , addr = "Route de Besse 63790 MUROL, à coté du supermaché SPAR"
                , tel = "06 66 85 24 10 ou 06 63 41 22 47"
                , site = "http://western-poneys.wifeo.com/"
              }
            ]
          )
        ]



-------------------------------------------------------------------------------
------------------
-- Associations --
------------------


associations =
    List.map assocToFiche
        [ { emptyAssoc
            | nom = "Amicale des chasseurs murolais"
            , domaine = "société de chasse"
            , siege = "mairie de Murol 63790 MUROL"
            , affil = "Fédération départementale des chasseurs du Puy-de-Dôme"
            , resp =
                [ { poste = "Coprésident"
                  , nom = "Laurent GASCHON"
                  , tel = "06 45 28 96 84"
                  }
                , { poste = "Coprésident"
                  , nom = "Guy Roche"
                  , tel = "04 73 88 65 99"
                  }
                ]
                --, mails    = ["laurent.gaschon@laposte.net"]
            , cat = Sport
          }
        , { emptyAssoc
            | nom = "Amicale des Sapeurs Pompiers"
            , domaine = "actions en faveur des sapeurs pompiers, organisation de festivités sur la commune"
            , siege = "Mairie de Murol"
            , resp =
                [ { poste = "Président"
                  , nom = "Yannick COHERIER"
                  , tel = "04 73 88 64 38"
                  }
                ]
            , mails = [ "yannick632009@live.fr" ]
            , sites = [ "http://pompiersdemurol.wifeo.com" ]
          }
        , { emptyAssoc
            | nom = "Association Bougn’Arts"
            , domaine = "organiser des festivals et des manifestations culturelles\n                - créer, organiser et promouvoir des animations et spectacles\n                de rues ainsi que des animations pédagogiques\n                - rassembler des artisans et des artistes à l’occasion de fêtes,\n                foires, marchés artisanaux et marchés à thèmes."
            , siege = "« Les Aloès » Rue de Chabrol – 63790 Murol"
            , resp =
                [ { poste = "Présidente"
                  , nom = "Bénédicte Manfri"
                  , tel = "06 72 16 78 46"
                  }
                ]
            , mails = [ "associationbougnarts@orange.fr" ]
          }
        , { emptyAssoc
            | nom = "Association Culture et Patrimoine de la Vallée Verte ACPVV"
            , domaine = "organisation de manifestations sur le massif du Sancy\n                 (fêtes de villages, Sancy Deuch…)"
            , resp =
                [ { poste = "Président"
                  , nom = "Henri-Frédéric LEGRAND"
                  , tel = "06 08 68 65 45"
                  }
                ]
            , mails =
                [ "hfl63@orange.fr" ]
                --, sites    = ["http://www.acme63.com"]
          }
        , { emptyAssoc
            | nom = "Association Couleurs et motifs"
            , domaine = "promouvoir, encourager, développer \n                 la pratique des arts, favoriser les talents\n                  par tous les moyens existants. "
            , siege = "Allée de la Plage 63790 Murol"
            , resp =
                [ { poste = "Présidente"
                  , nom = "Jacqueline GODARD"
                  , tel = ""
                  }
                ]
            , mails = [ "jacqueline.godard@free.fr" ]
          }
        , { emptyAssoc
            | nom = "Association culturelle et sportive de Beaune-le-froid"
            , domaine = "activité ski de fond"
            , siege = "Beaune-le-Froid 63790 MUROL"
            , resp =
                [ { poste = "Président"
                  , nom = "Yannick LATREILLE"
                  , tel = "04 73 88 81 18"
                  }
                ]
            , mails =
                [ "yannick-latreille@hotmail.fr" ]
                --, cat = Sport
          }
        , { emptyAssoc
            | nom = "Association culturelle et sportive de Beaune-le-froid"
            , domaine = "activité ski de fond"
            , siege = "Beaune-le-Froid 63790 MUROL"
            , resp =
                [ { poste = "Président"
                  , nom = "Yannick LATREILLE"
                  , tel = "04 73 88 81 18"
                  }
                ]
            , mails = [ "yannick-latreille@hotmail.fr" ]
            , cat = Sport
          }
        , { emptyAssoc
            | nom = "Association de la Foire du Saint Nectaire de Beaune-le-Froid"
            , domaine = "organisation de manifestations agricoles, promotion du \n                 Saint Nectaire fermier et des produits régionaux, activités d’animation dans la commune"
            , siege = "Mairie de Murol"
            , resp =
                [ { poste = "Présidente"
                  , nom = "Pierrette TOURREIX"
                  , tel = "04 73 35 97 71"
                  }
                ]
            , mails = [ "pierrette.tourreix@orange.fr" ]
          }
        , { emptyAssoc
            | nom = "Association de parents d'élèves des écoles de Murol et de Chambon sur Lac"
            , domaine = "contribuer et favoriser les activités scolaires et extra- scolaires"
            , siege = "Mairie de Murol"
            , resp =
                [ { poste = "Présidente"
                  , nom = "Dominique BIGAND"
                  , tel = "06 89 59 22 94"
                  }
                ]
            , mails = [ "ape.murolchambon@laposte.net" ]
          }
        , { emptyAssoc
            | nom = "Association des Amis du Musée de Murol (AAMM)"
            , domaine = "soutenir, faire connaître et promouvoir le musée des peintres de l’Ecole de Murol"
            , siege = "rue de Chabrol, 63790 MUROL"
            , resp =
                [ { poste = "Président"
                  , nom = "Dr Bernard LAPALUS"
                  , tel = "04 73 37 10 88"
                  }
                ]
            , mails = []
          }
        , { emptyAssoc
            | nom = "Association des jeunes de Murol"
            , siege = "La chassagne Murol"
            , resp =
                [ { poste = "Président"
                  , nom = "Victor LAGEIX"
                  , tel = ""
                  }
                ]
            , mails = [ "victor.lageix@laposte.net" ]
          }
        , { emptyAssoc
            | nom = "Association Intercommunale des Anciens Combattants"
            , preci = "Section de Chambon sur Lac, Murol, Saint Nectaire"
            , domaine = "transmettre le devoir de mémoire aux jeunes générations, assurer la solidarité"
            , siege = "rue Charreton, 63790 MUROL"
            , resp =
                [ { poste = "Vice Président pour Murol"
                  , nom = "Georges GAUFFIER"
                  , tel = "04 73 83 62 02"
                  }
                ]
          }
        , { emptyAssoc
            | nom = "Association Médiévale de Murol - Auvergne (AMMA)"
            , domaine = "promouvoir et sauvegarder le patrimoine médiéval de la commune de Murol"
            , siege = "La rivière route de Saint-Nectaire 63790 Murol"
            , resp =
                [ { poste = "Président"
                  , nom = "Vincent Salesse"
                  , tel = "06 09 04 67 92"
                  }
                ]
            , mails = [ "amma.murol@laposte.net" ]
          }
        , { emptyAssoc
            | nom = "Association Sancy Celtique"
            , domaine = "organisation de festival"
            , siege = "La rivière route de Saint-Nectaire 63790 Murol"
            , resp =
                [ { poste = "Président"
                  , nom = "Jérôme GODARD"
                  , tel = "04 73 26 02 00"
                  }
                ]
            , mails = [ "amma.murol@laposte.net" ]
          }
        , { emptyAssoc
            | nom = "Association Sportive des écoles de Murol et de Chambon sur Lac (A.S.E.M.C.)"
            , domaine = "contribuer à l’éducation des enfants par la pratique d’activités physiques et sportives"
            , siege = "école primaire de Chambon sur Lac"
            , affil = "USEP Sancy, les Hermines"
            , resp =
                [ { poste = "Président"
                  , nom = "Claude Bourret"
                  , tel = "04 73 88 68 16"
                  }
                ]
            , mails = [ "ecole.chambon-sur-lac.63@ac-clermont.fr" ]
            , cat = Sport
          }
        , { emptyAssoc
            | nom = "Bureau Montagne Auvergne Sancy Volcans"
            , domaine = "activités sportives de pleine nature grand public"
            , siege = "mairie de Murol Adresse : BP11 63790 MUROL"
            , resp =
                [ { poste = "Président"
                  , nom = "Alexandre PRUNYI"
                  , tel = ""
                  }
                ]
            , mails = [ "bertrandgoimard@hotmail.com", "contact@guides-asv.com" ]
            , cat = Sport
          }
        , { emptyAssoc
            | nom = "Bureau Montagne Auvergne Sancy Volcans"
            , domaine = "activités sportives de pleine nature grand public"
            , siege = "mairie de Murol Adresse : BP11 63790 MUROL"
            , resp =
                [ { poste = "Président"
                  , nom = "Alexandre PRUNYI"
                  , tel = ""
                  }
                ]
            , mails = [ "bertrandgoimard@hotmail.com", "contact@guides-asv.com" ]
            , cat = Pro
          }
          --, { emptyAssoc |
          --  nom     = "Chambre syndicale des commerçants des marchés du Puy de Dôme (CSCM du 63)"
          --, domaine = "organisation de la Foire du Terroir de Murol"
          --, siege   = "BP 30016 63401 CHAMALIERES"
          --, affil   = ""
          --, resp = [{ poste = "Vice-Président"
          --          , nom   = "Rémy VALLAT"
          --          , tel   = "04 7173 6263"
          --          }]
          --, mails    = ["remy.vallat@wanadoo.fr"]
          --}
        , { emptyAssoc
            | nom = "Collectif développement des commerçants Murolais 63"
            , domaine = "développement de l'activité commerciale"
            , siege = "rue Georges Sand - 63790 MUROL"
            , resp =
                [ { poste = "Président"
                  , nom = "Jean-Jacques ROUCHVARGER"
                  , tel = "06 32 97 02 19"
                  }
                ]
            , mails = [ "njrorganisation@orange.fr" ]
            , cat = Pro
          }
        , { emptyAssoc
            | nom = "COSA63"
            , domaine = "organisation de forums associatifs"
            , resp =
                [ { poste = "Contact"
                  , nom = "Anne-marie DOTTE"
                  , tel = "06 81 00 20 32"
                  }
                , { poste = "Contact"
                  , nom = "Elisabeth CROZET"
                  , tel = "06 30 03 80 69"
                  }
                ]
            , mails = [ "lecosa63@gmail.com" ]
          }
        , { emptyAssoc
            | nom = "COSA63"
            , domaine = "organisation de forums associatifs"
            , resp =
                [ { poste = "Contact"
                  , nom = "Anne-marie DOTTE"
                  , tel = "06 81 00 20 32"
                  }
                , { poste = "Contact"
                  , nom = "Elisabeth CROZET"
                  , tel = "06 30 03 80 69"
                  }
                ]
            , mails = [ "lecosa63@gmail.com" ]
            , cat = Sport
          }
        , { emptyAssoc
            | nom = "Don de Sang bénévole du Canton de Besse"
            , domaine = "organiser les collectes de sang sur le canton"
            , siege = "3, cour des miracles 63610 BESSE"
            , resp =
                [ { poste = "Président"
                  , nom = "Pierre SOULIER "
                  , tel = "04 73 79 50 70"
                  }
                ]
            , cat = Pro
          }
        , { emptyAssoc
            | nom = "L'Ensemble Instrumental de la Vallée Verte (EIVV)"
            , siege = "Lac Chambon - 63790 Chambon sur lac"
            , domaine = "participer aux manifestations officielles, créer un tissu social \n                 entre les musiciens de la région du sancy \n                 et être fédérateur de toutes les personnes qui \n                 aiment la musique d’harmonie. "
            , resp =
                [ { poste = "Président"
                  , nom = "Jean-louis REBOUFFAT"
                  , tel = "04 73 88 63 08"
                  }
                ]
            , mails = [ "jeanlouis.rebouffat@sfr.fr" ]
          }
        , { emptyAssoc
            | nom = "Elément Terre"
            , domaine = "éducation à l’environnement des scolaires, organisation de classes de découvertes"
            , siege = "Mairie de Murol BP 11- 63 790 MUROL "
            , resp =
                [ { poste = "Présidente"
                  , nom = "Claire FAYE"
                  , tel = ""
                  }
                ]
            , mails = [ "contact@element-terre.org" ]
            , sites = [ "http://www.element-terre.org" ]
          }
        , { emptyAssoc
            | nom = "Elément Terre"
            , domaine = "éducation à l’environnement des scolaires, organisation de classes de découvertes"
            , siege = "Mairie de Murol BP 11- 63 790 MUROL "
            , resp =
                [ { poste = "Présidente"
                  , nom = "Claire FAYE"
                  , tel = ""
                  }
                ]
            , mails = [ "contact@element-terre.org" ]
            , sites = [ "http://www.element-terre.org" ]
            , cat = Pro
          }
        , { emptyAssoc
            | nom = "Groupement de défense contre les ennemis des cultures"
            , domaine = "lutte contre les nuisibles"
            , siege = "Chautignat - 63790 MUROL"
            , resp =
                [ { poste = "Président"
                  , nom = "Jean-Marie PEROL"
                  , tel = "04 73 88 68 90"
                  }
                ]
            , cat = Pro
          }
        , { emptyAssoc
            | nom = "Groupement pastorale de la Couialle"
            , siege = "Mairie de Murol - 63 790 MUROL"
            , resp =
                [ { poste = "Président"
                  , nom = "Angélique Lair"
                  , tel = "04 73 88 81 10"
                  }
                ]
            , cat = Pro
          }
        , { emptyAssoc
            | nom = "JEEP Appellation Origine Contrôlée (JEEP AOC)"
            , domaine = "rassembler les amateurs de Jeep et véhicules assimilés"
            , siege = "Groire - 63790 MUROL"
            , resp =
                [ { poste = "Président"
                  , nom = "Bruno CATTARELLI "
                  , tel = "06 70 02 06 28"
                  }
                ]
            , mails = [ "jeepaoc@gmail.com, info@jeepaoc.com, jeepaoc.infoclub@orange.fr" ]
            , sites = [ "http://www.jeepaoc.com" ]
          }
        , { emptyAssoc
            | nom = "La Gaule Murolaise"
            , domaine = "société de Pêche"
            , siege = "Les rives - lac Chambon 63790 Chambon sur lac"
            , affil = "fédération de pêche du Puy de Dôme et du milieu aquatique (LEMPDES)"
            , resp =
                [ { poste = "Président"
                  , nom = "Emmanuel LABASSE"
                  , tel = "04 73 88 64 09"
                  }
                ]
            , cat = Sport
          }
          --,
          --{ emptyAssoc |
          --  nom     = "La Main Gauche"
          --, domaine = "club sportif de pétanque"
          --, siege   = "bar Intimyté, route de Besse, 63790 MUROL "
          --, resp = [{ poste = "Président"
          --          , nom   = "Christophe GUITTARD"
          --          , tel   = "06 2851 2802"
          --          }]
          --, cat = Sport
          --}
        , { emptyAssoc
            | nom = "Le XV de la Vallée Verte"
            , domaine = "rugby"
            , siege = "Restaurant « Les Baladins », 63790 St Nectaire"
            , resp =
                [ { poste = "Président"
                  , nom = "Stéphane Crégut"
                  , tel = "06 12 56 30 47"
                  }
                ]
            , mails = [ "lexvdelavalleeverte@hotmail.fr", "julien.boucheix@orange.fr", "contact@stephane-cregut.fr" ]
            , cat = Sport
          }
        , { emptyAssoc
            | nom = "Les Amis du Vieux Murol"
            , domaine = "association des personnes du troisième âge"
            , affil = "fédération « les Aînés Ruraux » Clermont-Ferrand"
            , siege = "mairie de Murol, 63790 MUROL"
            , resp =
                [ { poste = "Président"
                  , nom = "Pierrette TOURREIX"
                  , tel = "04 73 35 97 71"
                  }
                ]
            , mails = [ "pierrette.tourreix@orange.fr" ]
          }
        , --{ emptyAssoc |
          --  nom     = "Les Chevaucheurs"
          --, domaine = "organisation de manifestations culturelles (reconstitution historique, combats, spectacle équestre…)"
          --, siege   = "18 rue Guyot Dessaigne 63114 AUTHEZAT"
          --, resp = [{ poste = "Président"
          --          , nom   = "Pascal BONY"
          --          , tel   = "07 7792 1530"
          --          }]
          --, mails    = ["hagranyms@hotmail.fr"]
          --}
          --,
          { emptyAssoc
            | nom = "Murol Remparts du Sancy"
            , domaine = "organisation de festivals et de manifestations culturelles (fête du 14 juillet)"
            , siege = "mairie, 63790 MUROL"
            , resp =
                [ { poste = "Présidente"
                  , nom = "Bénédicte MANFRI "
                  , tel = "06 72 16 78 46"
                  }
                ]
            , mails = [ "assmurolrempart@gmail.com" ]
          }
        , { emptyAssoc
            | nom = "Natur’ Sancy"
            , domaine = "Activité de pleine nature, tout public\n                 Protection du patrimoine naturel en milieu montagnard,\n                 activités liées à la découverte du patrimoine."
            , siege = "route de Besse, 63790 MUROL"
            , resp =
                [ { poste = "Présidente"
                  , nom = "Véronique DEBOUT"
                  , tel = "04 73 88 67 56"
                  }
                ]
            , mails = [ "natur.sancy@gmail.com" ]
            , sites = [ "http://natursancy.blogspot.fr/" ]
          }
        , { emptyAssoc
            | nom = "Rencontre et détente"
            , domaine = "activités gymniques"
            , siege = "rue du Tartaret 63790 MUROL"
            , resp =
                [ { poste = "Présidente"
                  , nom = "Sylvie Legoueix"
                  , tel = "04 73 88 66 21"
                  }
                ]
            , cat = Sport
          }
        , { emptyAssoc
            | nom = "Société de Chasse"
            , domaine = "société de chasse"
            , siege = "Beaune le Froid 63790 MUROL"
            , affil = "Fédération départementale des chasseurs du Puy-de-Dôme"
            , resp =
                [ { poste = "Président"
                  , nom = "Laurent PLANEIX"
                  , tel = "04 73 88 60 74"
                  }
                ]
            , cat = Sport
          }
        , { emptyAssoc
            | nom = "Syndicat agricole"
            , domaine = "syndicat professionnel"
            , siege = "mairie de Murol 63790 MUROL"
            , resp =
                [ { poste = "Présidente"
                  , nom = "Angélique LAIR"
                  , tel = "04 73 88 81 10"
                  }
                ]
            , mails = [ "angelique.lair84@orange.fr" ]
            , cat = Pro
          }
        , { emptyAssoc
            | nom = "Syndicat hôtelier"
            , domaine = "syndicat professionnel"
            , siege = "rue de la Vieille Tour 63790 MUROL"
            , resp =
                [ { poste = "Présidente"
                  , nom = "Amélie DABERT"
                  , tel = "04 73 88 61 06 "
                  }
                ]
            , mails = [ "amelie.dabert@wanadoo.FR" ]
            , cat = Pro
          }
        , { emptyAssoc
            | nom = "Système d'Echange Local \"S.SancyEL\""
            , domaine = "association à caractère social permettant à ses membres de procéder\n                 à des échanges de biens, de services et de savoirs, sans avoir recours à la monnaie. "
            , siege = "3 impasse de la Vernoze - Champeix"
            , resp =
                [ { poste = "Coprésidente"
                  , nom = "Annie JONCOUX"
                  , tel = "04 43 12 61 98 ou 06 9850 4297"
                  }
                , { poste = "Coprésidente"
                  , nom = "Livia VAN EIJLE"
                  , tel = "04 7388 6489"
                  }
                ]
            , mails =
                [ "annie.joncoux@sfr.fr"
                , " Livia.vaneijle@wanadoo.fr"
                , "j-p.lanaro@orange.fr"
                ]
          }
          --,
          --{ emptyAssoc |
          --  nom     = "Les Scieurs d’Antan des Monts des Dômes"
          --, domaine = "organisation de manifestations culturelles,
          --             faire revivre les vieux métiers de la terre"
          --, siege   = "6, allée de Rivassol 63 830 NOHANENT"
          --, resp = [{ poste = "Président"
          --          , nom   = "Maurice BARD"
          --          , tel   = "04 7362 8487"
          --          }]
          --}
          --,
          --{ emptyAssoc |
          --  nom     = "Académie de la Gentiane"
          --, mails    = ["academiegentiane@orange.fr"]
          --}
        , { emptyAssoc
            | nom = "Camping qualité Auvergne"
            , domaine = "charte professionnelle de qualité"
            , affil = "Camping Qualité national"
            , siege = "Jassat 63790 MUROL"
            , resp =
                [ { poste = "Présidente"
                  , nom = "Sylvie JORY"
                  , tel = ""
                  }
                ]
            , cat = Pro
          }
        , { emptyAssoc
            | nom = "Auvergne Escapade"
            , domaine = "Accompagnateurs en montagne"
            , siege = "Beaune-le-Froid 63790 Murol"
            , resp =
                [ { poste = "Président"
                  , nom = "Jean Luc Ranvier"
                  , tel = "04 73 88 85 78 - 06 86 89 34 87"
                  }
                ]
            , mails = [ "info@auvergne-escapade.com" ]
            , sites = [ "http://www.auvergne-escapade.com" ]
            , cat = Sport
          }
        , { emptyAssoc
            | nom = "Auvergne Escapade"
            , domaine = "Accompagnateurs en montagne"
            , siege = "Beaune-le-Froid 63790 Murol"
            , resp =
                [ { poste = "Président"
                  , nom = "Jean Luc Ranvier"
                  , tel = "04 73 88 85 78 - 06 86 89 34 87"
                  }
                ]
            , mails = [ "info@auvergne-escapade.com" ]
            , sites = [ "http://www.auvergne-escapade.com" ]
            , cat = Pro
          }
        ]


agriculteurs =
    List.map agriToFiche
        [ { defAgri
            | name = "GAEC de Chautignat"
            , addr = "Chautignat 63790 Murol"
            , tel = "04 73 88 81 92"
          }
        , { defAgri
            | name = "Tourreix Pascal"
            , addr = "Beaune-le-Froid 63790 Murol"
            , tel = "04 73 88 62 34"
          }
        , { defAgri
            | name = "GAEC Tixier"
            , addr = "Beaune-le-Froid 63790 Murol"
            , tel = "04 73 88 81 10"
            , refOt = Just ( "4658145", "https://www.sancy.com/producteur/gaec-tixier/" )
          }
        , { defAgri
            | name = "GAEC des Monts Dores"
            , addr = "Beaune-le-Froid 63790 Murol "
            , tel = "04 73 88 64 75 "
            , refOt = Just ( "4658139", "https://www.sancy.com/producteur/gaec-des-monts-dore/" )
          }
        , { defAgri
            | name = "GAEC des Noisetiers"
            , addr = "Beaune-le-Froid 63790 Murol"
            , tel = "04 73 88 66 32 "
          }
        , { defAgri
            | name = "GAEC de la route des caves"
            , addr = "Beaune-le-Froid 63790 Murol "
            , tel = "04 73 88 65 85"
            , refOt = Just ( "4658143", "https://www.sancy.com/producteur/gaec-de-la-route-des-caves-ferme-roux/" )
          }
        , { defAgri
            | name = "Laurent PLANEIX"
            , addr = "Beaune-le-Froid 63790 Murol"
            , tel = "04 73 88 60 74 "
          }
        , { defAgri
            | name = "Philippe BEAL"
            , addr = "Les Ballats 63790 Murol"
            , tel = "04 73 88 60 47 "
          }
        , { defAgri
            | name = "Daniel BOUCHE"
            , addr = "Beaune-le-Froid 63790 Murol"
            , tel = "04 73 88 67 28 "
          }
        ]
