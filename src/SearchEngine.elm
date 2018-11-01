port module SearchEngine exposing (..)

import Delay exposing (..)
import Dict exposing (..)
import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline exposing (..)
import Json.Encode as Encode exposing (..)
import Set exposing (..)


port outbound : String -> Cmd msg


port inbound : (String -> msg) -> Sub msg


main : Program () Model Msg
main =
    Platform.worker
        { init = init
        , update = update
        , subscriptions = subscriptions
        }


init flags =
    ( { searchStr = ""
      , searchWords = []
      }
    , Cmd.none
    )


subscriptions model =
    inbound processInput


processInput : String -> Msg
processInput s =
    decodeString
        (Decode.oneOf
            [ decodeAction
            , decodeSearchStr
            ]
        )
        s
        |> Result.withDefault NoOp


decodeAction : Decode.Decoder Msg
decodeAction =
    Decode.string
        |> Decode.andThen
            (\str ->
                case str of
                    "<Cmd -> Search>" ->
                        succeed Search

                    "<Cmd -> Reset>" ->
                        succeed Reset

                    _ ->
                        fail <|
                            "Unknown command"
            )


decodeSearchStr : Decode.Decoder Msg
decodeSearchStr =
    Decode.field "SearchStr" Decode.string
        |> Decode.map SearchStr



--type alias SearchResult =
--    ( List String, Dict String ( Int, Set String ) )


encodeSearchResult : SearchResult -> String
encodeSearchResult ( keywords, results ) =
    Encode.object
        [ ( "keywords", Encode.list Encode.string keywords )
        , ( "results"
          , Encode.dict
                identity
                (\( score, keywords_ ) ->
                    Encode.object
                        [ ( "score"
                          , Encode.int score
                          )
                        , ( "keywords"
                          , Encode.set Encode.string keywords_
                          )
                        ]
                )
                results
          )
        ]
        |> Encode.encode 0


type alias Model =
    { searchStr : String
    , searchWords : List String
    }


type Msg
    = SearchStr String
    | Search
    | Reset
    | NoOp


update msg model =
    case msg of
        SearchStr s ->
            let
                lower =
                    String.toLower s

                wrds =
                    String.words lower
            in
            ( { model
                | searchStr = lower
                , searchWords = wrds
              }
            , Cmd.none
            )

        Search ->
            ( model
            , searchM metadata
                (List.filter irrelevant
                    (.searchWords model)
                )
                |> encodeSearchResult
                |> outbound
            )

        Reset ->
            init ()

        NoOp ->
            ( model, Cmd.none )


type alias Metadata =
    Dict Keyword (List String)


type alias Keyword =
    String


type alias SearchResult =
    ( List String, Dict String ( Int, Set String ) )


irrelevant =
    \w ->
        w
            /= "et"
            && w
            /= "de"
            && w
            /= "des"
            && w
            /= "le"
            && w
            /= "la"
            && w
            /= "les"
            && w
            /= "a"
            && w
            /= "au"
            && w
            /= "en"
            && w
            /= "dans"
            && w
            /= "se"


search : Metadata -> String -> ( List String, Dict String ( Int, Set String ) )
search meta key =
    let
        l =
            String.length key

        burst s =
            String.words s
                |> List.filter irrelevant
                |> List.map (\v -> ( v, s ))

        toTrim =
            Dict.keys meta
                |> List.foldr (\k acc -> burst k ++ acc) []

        filterMatch ( w, k ) acc =
            let
                score =
                    sift3Distance w key
            in
            if score < 1.5 then
                ( k, 15 - (round score * 10) ) :: acc
            else
                acc

        trimmed =
            List.foldr
                filterMatch
                []
                toTrim

        incrOccur k m val =
            case val of
                Nothing ->
                    Just ( m, Set.singleton k )

                Just ( n, keySet ) ->
                    Just ( n + 5, Set.insert k keySet )
    in
    ( List.map Tuple.first trimmed
    , List.foldr
        (\( k, m ) acc ->
            case Dict.get k meta of
                Nothing ->
                    acc

                Just vs ->
                    List.foldr (\uuid acc_ -> Dict.update uuid (incrOccur k m) acc_) acc vs
        )
        Dict.empty
        trimmed
    )


searchM : Metadata -> List String -> ( List String, Dict String ( Int, Set String ) )
searchM meta keys =
    let
        results =
            List.map (search meta) keys

        combineWeigtedRes oldDict newDict =
            let
                onlyLeft k v1 acc =
                    Dict.insert k v1 acc

                inBoth k ( v1, ks1 ) ( v2, ks2 ) acc =
                    Dict.insert k ( v1 + v2, Set.union ks1 ks2 ) acc

                onlyRight k v2 acc =
                    Dict.insert k v2 acc
            in
            Dict.merge onlyLeft inBoth onlyRight oldDict newDict Dict.empty

        ( keySet, combRes ) =
            List.foldr
                (\( kwds, res ) ( kwdsAcc, resAcc ) ->
                    ( Set.union kwdsAcc (Set.fromList kwds), combineWeigtedRes resAcc res )
                )
                ( Set.empty, Dict.empty )
                results
    in
    ( Set.toList keySet, combRes )


sift3Distance : String -> String -> Float
sift3Distance s1 s2 =
    let
        s1Len =
            String.length s1

        s2Len =
            String.length s2
    in
    if s1Len == 0 then
        toFloat s2Len
    else if s2Len == 0 then
        toFloat s1Len
    else
        let
            common =
                lcs (String.toList s1) (String.toList s2)
        in
        (toFloat (s1Len + s2Len) / 2) - toFloat (List.length common)


lcs : List a -> List a -> List a
lcs xs ys =
    lcsHelper xs ys ( 0, 0 ) Dict.empty
        |> Dict.get ( 0, 0 )
        |> Maybe.map Tuple.second
        |> Maybe.withDefault []


lcsHelper : List a -> List a -> ( Int, Int ) -> Dict ( Int, Int ) ( Int, List a ) -> Dict ( Int, Int ) ( Int, List a )
lcsHelper xs ys position memo =
    case ( Dict.get position memo, xs, ys ) of
        ( Nothing, x :: xRest, y :: yRest ) ->
            let
                nextYPos =
                    Tuple.mapSecond ((+) 1) position

                nextXPos =
                    Tuple.mapFirst ((+) 1) position

                newMemo =
                    memo
                        |> lcsHelper xs yRest nextYPos
                        |> lcsHelper xRest ys nextXPos

                best =
                    maxListTuple
                        (get nextXPos newMemo)
                        (get nextYPos newMemo)
                        |> consIfEqual x y
            in
            Dict.insert position best newMemo

        _ ->
            memo


maxOffset =
    5


get : ( Int, Int ) -> Dict ( Int, Int ) ( Int, List a ) -> ( Int, List a )
get position memo =
    Dict.get position memo |> Maybe.withDefault ( 0, [] )


maxListTuple : ( Int, List a ) -> ( Int, List a ) -> ( Int, List a )
maxListTuple ( xLen, xs ) ( yLen, ys ) =
    if yLen > xLen then
        ( yLen, ys )
    else
        ( xLen, xs )


consIfEqual : a -> a -> ( Int, List a ) -> ( Int, List a )
consIfEqual x y ( listLen, list ) =
    if x == y then
        ( listLen + 1, x :: list )
    else
        ( listLen, list )


keywordsToMetadata : Set ( String, String ) -> Metadata
keywordsToMetadata keywords =
    Set.foldr
        (\( keyword, uuid ) acc ->
            Dict.update
                keyword
                (\mbUuids ->
                    case mbUuids of
                        Just uuids ->
                            Just <| uuid :: uuids

                        Nothing ->
                            Just [ uuid ]
                )
                acc
        )
        Dict.empty
        keywords


metadata : Metadata
metadata =
    Dict.fromList
        [ ( "accueil"
          , [ ( "index.html", "Page d'accueil" ) ]
          )
        , ( "actualités"
          , [ ( "index.html", "Page d'accueil" ) ]
          )
        , ( "agenda"
          , [ ( "Animation.html", "Animation" )
            , ( "index.html", "Page d'accueil" )
            ]
          )
        , ( "animation"
          , [ ( "Animation.html", "Animation" )
            , ( "AnimationEstivale.html", "Animation estivale" )
            , ( "LesSeniors.html", "Les seniors" )
            ]
          )
        , ( "tourisme"
          , [ ( "OfficeDeTourisme.html", "Office de tourisme" )
            , ( "DécouvrirMurol.html", "Découvrir Murol" )
            , ( "Hébergements.html", "Hébergements" )
            , ( "Restaurants.html", "Restaurants" )
            , ( "Carte&Plan.html", "Carte et plan" )
            , ( "AnimationEstivale.html", "AnimationEstivale" )
            ]
          )
        , ( "découvrir"
          , [ ( "DécouvrirMurol.html", "Découvrir Murol" )
            , ( "LaCommune.html", "La commune" )
            ]
          )
        , ( "château"
          , [ ( "DécouvrirMurol.html", "Découvrir Murol" )
            , ( "Sortir.html", "Sortir" )
            , ( "Patrimoine.html", "Patrimoine" )
            , ( "Photothèque.html", "Photothèque" )
            ]
          )
        , ( "beaune"
          , [ ( "DécouvrirMurol.html?bloc=02", "Beaune le froid" )
            , ( "DécouvrirMurol.html", "Découvrir Murol" )
            , ( "Patrimoine.html", "Patrimoine" )
            ]
          )
        , ( "volcan"
          , [ ( "DécouvrirMurol.html", "Découvrir Murol" )
            , ( "Patrimoine.html", "Patrimoine" )
            ]
          )
        , ( "tartaret"
          , [ ( "DécouvrirMurol.html", "Découvrir Murol" )
            , ( "Patrimoine.html", "Patrimoine" )
            ]
          )
        , ( "lac chambon"
          , [ ( "DécouvrirMurol.html", "Découvrir Murol" )
            ]
          )
        , ( "promener"
          , [ ( "DécouvrirMurol.html", "Découvrir Murol" )
            ]
          )
        , ( "promenade"
          , [ ( "DécouvrirMurol.html", "Découvrir Murol" )
            ]
          )
        , ( "voie verte"
          , [ ( "DécouvrirMurol.html", "Découvrir Murol" )
            ]
          )
        , ( "chautignat"
          , [ ( "DécouvrirMurol.html", "Découvrir Murol" )
            ]
          )
        , ( "groire"
          , [ ( "DécouvrirMurol.html", "Découvrir Murol" )
            ]
          )
        , ( "chassagne"
          , [ ( "DécouvrirMurol.html", "Découvrir Murol" )
            ]
          )
        , ( "ballats"
          , [ ( "DécouvrirMurol.html", "Découvrir Murol" )
            ]
          )
        , ( "hébergements"
          , [ ( "Hébergements.html", "Hébergements" )
            ]
          )
        , ( "logement"
          , [ ( "Hébergements.html", "Hébergements" )
            ]
          )
        , ( "loger"
          , [ ( "Hébergements.html", "Hébergements" )
            ]
          )
        , ( "hotels"
          , [ ( "Hébergements.html", "Hébergements" )
            ]
          )
        , ( "camping"
          , [ ( "Hébergements.html", "Hébergements" )
            ]
          )
        , ( "résidence"
          , [ ( "Hébergements.html", "Hébergements" )
            ]
          )
        , ( "chambres"
          , [ ( "Hébergements.html", "Hébergements" )
            ]
          )
        , ( "gite"
          , [ ( "Hébergements.html", "Hébergements" )
            ]
          )
        , ( "meublé"
          , [ ( "Hébergements.html", "Hébergements" )
            ]
          )
        , ( "villages vacances"
          , [ ( "Hébergements.html", "Hébergements" )
            ]
          )
        , ( "famille plus"
          , [ ( "Hébergements.html", "Hébergements" )
            , ( "Restaurants.html", "Restaurants" )
            ]
          )
        , ( "camping-car"
          , [ ( "Hébergements.html", "Hébergements" )
            ]
          )
        , ( "restaurants"
          , [ ( "Restaurants.html", "Restaurants" )
            ]
          )
        , ( "bar"
          , [ ( "Restaurants.html", "Restaurants" )
            ]
          )
        , ( "brasserie"
          , [ ( "Restaurants.html", "Restaurants" )
            ]
          )
        , ( "carte"
          , [ ( "Carte&Plan.html", "Carte & Plan" )
            ]
          )
        , ( "plan"
          , [ ( "Carte&Plan.html", "Carte & Plan" )
            ]
          )
        , ( "accès"
          , [ ( "Carte&Plan.html", "Carte & Plan" )
            ]
          )
        , ( "route"
          , [ ( "Carte&Plan.html", "Carte & Plan" )
            ]
          )
        , ( "vie locale"
          , [ ( "VieScolaire.html", "Vie scolaire" )
            , ( "PériEtExtra-scolaire.html", "Péri et extra-scolaire" )
            , ( "LesAdos.html", "Les ados" )
            , ( "LesSeniors.html", "Les seniors" )
            , ( "Santé.html", "Santé" )
            , ( "Transports.html", "Transports" )
            , ( "GestionDesDéchets.html", "Gestion des déchets" )
            , ( "Animaux.html", "Animaux" )
            ]
          )
        , ( "école"
          , [ ( "VieScolaire.html", "Vie scolaire" )
            , ( "PériEtExtra-scolaire.html", "Péri et extra-scolaire" )
            ]
          )
        , ( "périscolaire"
          , [ ( "PériEtExtra-scolaire.html", "Péri et extra-scolaire" )
            ]
          )
        , ( "maternelle"
          , [ ( "VieScolaire.html", "Vie scolaire" )
            ]
          )
        , ( "élémentaire"
          , [ ( "VieScolaire.html", "Vie scolaire" )
            ]
          )
        , ( "secondaire"
          , [ ( "VieScolaire.html", "Vie scolaire" )
            ]
          )
        , ( "collège"
          , [ ( "VieScolaire.html", "Vie scolaire" )
            ]
          )
        , ( "cantine"
          , [ ( "PériEtExtra-scolaire.html", "Péri et extra-scolaire" )
            ]
          )
        , ( "restaurant scolaire"
          , [ ( "PériEtExtra-scolaire.html", "Péri et extra-scolaire" )
            ]
          )
        , ( "garderie"
          , [ ( "PériEtExtra-scolaire.html", "Péri et extra-scolaire" )
            ]
          )
        , ( "tap"
          , [ ( "PériEtExtra-scolaire.html", "Péri et extra-scolaire" )
            ]
          )
        , ( "temps d'activités périscolaire"
          , [ ( "PériEtExtra-scolaire.html", "Péri et extra-scolaire" )
            ]
          )
        , ( "centre loisirs"
          , [ ( "PériEtExtra-scolaire.html", "Péri et extra-scolaire" )
            ]
          )
        , ( "transports scolaire"
          , [ ( "PériEtExtra-scolaire.html", "Péri et extra-scolaire" )
            ]
          )
        , ( "activités jeunesse"
          , [ ( "PériEtExtra-scolaire.html", "Péri et extra-scolaire" )
            ]
          )
        , ( "sivom"
          , [ ( "PériEtExtra-scolaire.html", "Péri et extra-scolaire" )
            , ( "LesSeniors.html", "Les seniors" )
            ]
          )
        , ( "ados"
          , [ ( "LesAdos.html", "Les ados" )
            ]
          )
        , ( "jeunes"
          , [ ( "LesAdos.html", "Les ados" )
            ]
          )
        , ( "argent de poche"
          , [ ( "LesAdos.html", "Les ados" )
            ]
          )
        , ( "séniors"
          , [ ( "LesSeniors.html", "Les seniors" )
            ]
          )
        , ( "actvités"
          , [ ( "LesSeniors.html", "Les seniors" )
            ]
          )
        , ( "service"
          , [ ( "LesSeniors.html", "Les seniors" )
            ]
          )
        , ( "santé"
          , [ ( "Santé.html", "Santé" )
            ]
          )
        , ( "médecin"
          , [ ( "Santé.html", "Santé" )
            ]
          )
        , ( "infirmier"
          , [ ( "Santé.html", "Santé" )
            ]
          )
        , ( "dentiste"
          , [ ( "Santé.html", "Santé" )
            ]
          )
        , ( "kiné"
          , [ ( "Santé.html", "Santé" )
            ]
          )
        , ( "cabinet médical"
          , [ ( "Santé.html", "Santé" )
            ]
          )
        , ( "pédicure"
          , [ ( "Santé.html", "Santé" )
            ]
          )
        , ( "podologue"
          , [ ( "Santé.html", "Santé" )
            ]
          )
        , ( "pharmacie"
          , [ ( "Santé.html", "Santé" )
            , ( "Commerces.html", "Commerces" )
            ]
          )
        , ( "transport"
          , [ ( "Transports.html", "Transports" )
            , ( "PériEtExtra-scolaire.html", "Péri et extra-scolaire" )
            , ( "Commerces.html", "Commerces" )
            ]
          )
        , ( "desserte"
          , [ ( "Transports.html", "Transports" )
            ]
          )
        , ( "covoiturage"
          , [ ( "Transports.html", "Transports" )
            ]
          )
        , ( "déneigement"
          , [ ( "Transports.html", "Transports" )
            ]
          )
        , ( "vie économique"
          , [ ( "Agriculture.html", "Agriculture" )
            , ( "Commerces.html", "Commerces" )
            , ( "Entreprises.html", "Entreprises" )
            , ( "OffresD'emploi.html", "Offres d'emploi" )
            ]
          )
        , ( "agriculture"
          , [ ( "Agriculture.html", "Agriculture" )
            ]
          )
        , ( "fromage"
          , [ ( "Agriculture.html", "Agriculture" )
            ]
          )
        , ( "commerce"
          , [ ( "Commerces.html", "Commerces" )
            ]
          )
        , ( "informatique"
          , [ ( "Commerces.html", "Commerces" )
            ]
          )
        , ( "boucherie"
          , [ ( "Commerces.html", "Commerces" )
            ]
          )
        , ( "garage"
          , [ ( "Commerces.html", "Commerces" )
            ]
          )
        , ( "alimentation"
          , [ ( "Commerces.html", "Commerces" )
            ]
          )
        , ( "supermarché"
          , [ ( "Commerces.html", "Commerces" )
            ]
          )
        , ( "poste"
          , [ ( "Commerces.html", "Commerces" )
            ]
          )
        , ( "banque"
          , [ ( "Commerces.html", "Commerces" )
            ]
          )
        , ( "terroir"
          , [ ( "Commerces.html", "Commerces" )
            ]
          )
        , ( "souvenir"
          , [ ( "Commerces.html", "Commerces" )
            ]
          )
        , ( "artisanat"
          , [ ( "Commerces.html", "Commerces" )
            ]
          )
        , ( "assurance"
          , [ ( "Commerces.html", "Commerces" )
            ]
          )
        , ( "location"
          , [ ( "Commerces.html", "Commerces" )
            , ( "SallesMunicipales.html", "Salles municipales" )
            ]
          )
        , ( "vêtement"
          , [ ( "Commerces.html", "Commerces" )
            ]
          )
        , ( "entreprise"
          , [ ( "Entreprises.html", "Entreprises" )
            ]
          )
        , ( "electricien"
          , [ ( "Entreprises.html", "Entreprises" )
            ]
          )
        , ( "maçon"
          , [ ( "Entreprises.html", "Entreprises" )
            ]
          )
        , ( "quincallerie"
          , [ ( "Entreprises.html", "Entreprises" )
            ]
          )
        , ( "plomberie"
          , [ ( "Entreprises.html", "Entreprises" )
            ]
          )
        , ( "peintre"
          , [ ( "Entreprises.html", "Entreprises" )
            ]
          )
        , ( "mairie"
          , [ ( "LaCommune.html", "La commune" )
            , ( "ConseilMunicipal.html", "Conseil municipal" )
            , ( "Délibérations.html", "Délibérations" )
            , ( "Commissions.html", "Commissions" )
            , ( "CCAS.html", "CCAS" )
            , ( "VosDémarches.html", "Vos démarches" )
            , ( "SallesMunicipales.html", "Salles municipales" )
            , ( "HorairesEtContact.html.html", "Horaires et contact" )
            ]
          )
        , ( "conseil municipal"
          , [ ( "ConseilMunicipal.html", "Conseil municipal" )
            ]
          )
        , ( "maire"
          , [ ( "ConseilMunicipal.html", "Conseil municipal" )
            ]
          )
        , ( "adjoint"
          , [ ( "ConseilMunicipal.html", "Conseil municipal" )
            ]
          )
        , ( "conseillers municipaux"
          , [ ( "ConseilMunicipal.html", "Conseil municipal" )
            ]
          )
        , ( "délibérations"
          , [ ( "Délibérations.html", "Délibérations" )
            ]
          )
        , ( "commission"
          , [ ( "Commissions.html", "Commissions" )
            ]
          )
        , ( "ccas"
          , [ ( "CCAS.html", "CCAS" )
            ]
          )
        , ( "centre communal d'action sociale"
          , [ ( "CCAS.html", "CCAS" )
            ]
          )
        , ( "aide"
          , [ ( "CCAS.html", "CCAS" )
            ]
          )
        , ( "secours"
          , [ ( "CCAS.html", "CCAS" )
            ]
          )
        , ( "démarches"
          , [ ( "VosDémarches.html", "Vos démarches" )
            ]
          )
        , ( "papiers"
          , [ ( "VosDémarches.html", "Vos démarches" )
            ]
          )
        , ( "documents"
          , [ ( "VosDémarches.html", "Vos démarches" )
            ]
          )
        , ( "carte identité"
          , [ ( "VosDémarches.html", "Vos démarches" )
            ]
          )
        , ( "passeport"
          , [ ( "VosDémarches.html", "Vos démarches" )
            ]
          )
        , ( "permis de conduire"
          , [ ( "VosDémarches.html", "Vos démarches" )
            ]
          )
        , ( "véhicule"
          , [ ( "VosDémarches.html", "Vos démarches" )
            ]
          )
        , ( "etat civil"
          , [ ( "VosDémarches.html", "Vos démarches" )
            ]
          )
        , ( "liste électorale"
          , [ ( "VosDémarches.html", "Vos démarches" )
            ]
          )
        , ( "service civique"
          , [ ( "VosDémarches.html", "Vos démarches" )
            ]
          )
        , ( "salle"
          , [ ( "SallesMunicipales.html", "Salles municipales" )
            ]
          )
        , ( "matériel"
          , [ ( "SallesMunicipales.html", "Salles municipales" )
            ]
          )
        , ( "horaires"
          , [ ( "HorairesEtContact.html", "Horaires et contact" )
            ]
          )
        , ( "contact"
          , [ ( "HorairesEtContact.html", "Horaires et contact" )
            ]
          )
        , ( "téléphone"
          , [ ( "HorairesEtContact.html", "Horaires et contact" )
            ]
          )
        , ( "mail"
          , [ ( "HorairesEtContact.html", "Horaires et contact" )
            ]
          )
        , ( "culture et loisirs"
          , [ ( "Artistes.html", "Artistes" )
            , ( "Associations.html", "Associations" )
            , ( "Sortir.html", "Sortir" )
            , ( "Patrimoine.html", "Patrimoine" )
            , ( "SportsEtDétente.html", "Sports et détente" )
            , ( "Photothèque.html", "Photothèque" )
            ]
          )
        , ( "artiste"
          , [ ( "Artistes.html", "Artistes" )
            ]
          )
        , ( "festival d'art"
          , [ ( "Artistes.html", "Artistes" )
            , ( "Photothèque.html", "Photothèque" )
            ]
          )
        , ( "associations"
          , [ ( "Associations.html", "Associations" )
            ]
          )
        , ( "culture"
          , [ ( "Associations.html", "Associations" )
            ]
          )
        , ( "solidarité"
          , [ ( "Associations.html", "Associations" )
            ]
          )
        , ( "sport"
          , [ ( "Associations.html", "Associations" )
            , ( "SportsEtDétente.html", "Sports et détente" )
            ]
          )
        , ( "professionnel"
          , [ ( "Associations.html", "Associations" )
            ]
          )
        , ( "sortir"
          , [ ( "Sortir.html", "Sortir" )
            ]
          )
        , ( "musée des peintres"
          , [ ( "Sortir.html", "Sortir" )
            , ( "Patrimoine.html", "Patrimoine" )
            ]
          )
        , ( "environs"
          , [ ( "Sortir.html", "Sortir" )
            ]
          )
        , ( "cinéma"
          , [ ( "Sortir.html", "Sortir" )
            ]
          )
        , ( "patrimoine"
          , [ ( "Patrimoine.html", "Patrimoine" )
            ]
          )
        , ( "parc"
          , [ ( "Patrimoine.html", "Patrimoine" )
            ]
          )
        , ( "prélong"
          , [ ( "Patrimoine.html", "Patrimoine" )
            ]
          )
        , ( "église"
          , [ ( "Patrimoine.html", "Patrimoine" )
            ]
          )
        , ( "moulin"
          , [ ( "Patrimoine.html", "Patrimoine" )
            ]
          )
        , ( "archéologie"
          , [ ( "Patrimoine.html", "Patrimoine" )
            ]
          )
        , ( "détente"
          , [ ( "SportsEtDétente.html", "Sports et détente" )
            ]
          )
        , ( "rugby"
          , [ ( "SportsEtDétente.html", "Sports et détente" )
            ]
          )
        , ( "tennis de table"
          , [ ( "SportsEtDétente.html", "Sports et détente" )
            ]
          )
        , ( "gymnastique"
          , [ ( "SportsEtDétente.html", "Sports et détente" )
            ]
          )
        , ( "qi gong"
          , [ ( "SportsEtDétente.html", "Sports et détente" )
            ]
          )
        , ( "équitation"
          , [ ( "SportsEtDétente.html", "Sports et détente" )
            ]
          )
        , ( "chorale"
          , [ ( "SportsEtDétente.html", "Sports et détente" )
            ]
          )
        , ( "tarot"
          , [ ( "SportsEtDétente.html", "Sports et détente" )
            ]
          )
        , ( "photothèque"
          , [ ( "Photothèque.html", "Photothèque" )
            ]
          )
        , ( "paysage"
          , [ ( "Photothèque.html", "Photothèque" )
            ]
          )
        , ( "médiévales"
          , [ ( "Photothèque.html", "Photothèque" )
            ]
          )
        , ( "14 juillet"
          , [ ( "Photothèque.html", "Photothèque" )
            ]
          )
        , ( "révolution"
          , [ ( "Photothèque.html", "Photothèque" )
            ]
          )
        , ( "journée des murolais"
          , [ ( "Photothèque.html", "Photothèque" )
            ]
          )
        , ( "diaporama"
          , [ ( "Photothèque.html", "Photothèque" )
            ]
          )
        , ( "documentation"
          , [ ( "BulletinsMunicipaux.html", "Bulletins municipaux" )
            , ( "MurolInfos.html", "Murol Infos" )
            , ( "Délibérations.html", "Délibérations" )
            , ( "GestionDesRisques.html", "Gestion des risques" )
            , ( "Elections.html", "Elections" )
            , ( "AutresPublications.html", "Autres publications" )
            , ( "VillageFleuri.html", "Village fleuri" )
            ]
          )
        , ( "bulletin"
          , [ ( "BulletinsMunicipaux.html", "Bulletins municipaux" )
            ]
          )
        , ( "murol infos"
          , [ ( "MurolInfos.html", "Murol Infos" )
            ]
          )
        , ( "risques"
          , [ ( "GestionDesRisques.html", "Gestion des risques" )
            ]
          )
        , ( "dicrim"
          , [ ( "GestionDesRisques.html", "Gestion des risques" )
            ]
          )
        , ( "élections"
          , [ ( "Elections.html", "Elections" )
            ]
          )
        , ( "publications"
          , [ ( "AutresPublications.html", "Autres publications" )
            ]
          )
        , ( "développement durable"
          , [ ( "AutresPublications.html", "Autres publications" )
            ]
          )
        , ( "compostage"
          , [ ( "AutresPublications.html", "Autres publications" )
            ]
          )
        , ( "station tourisme"
          , [ ( "AutresPublications.html", "Autres publications" )
            ]
          )
        , ( "pavillon bleu"
          , [ ( "AutresPublications.html", "Autres publications" )
            ]
          )
        , ( "fleuri"
          , [ ( "VillageFleuri.html", "Village fleuri" )
            ]
          )
        , ( "petites annonces"
          , [ ( "PetitesAnnonces.html", "Petites annonces" )
            ]
          )
        ]
        |> Dict.map (\k v -> List.map (\( p, n ) -> n) v)
