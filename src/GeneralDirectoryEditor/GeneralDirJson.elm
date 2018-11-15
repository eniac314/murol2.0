module GeneralDirectoryEditor.GeneralDirJson exposing (..)

import Dict exposing (..)
import GeneralDirectoryEditor.GeneralDirCommonTypes as Types exposing (..)
import Http exposing (..)
import Json.Decode as D
import Json.Decode.Extra
import Json.Decode.Pipeline as P exposing (..)
import Json.Encode as E
import Set exposing (..)
import Time exposing (..)
import UUID exposing (..)


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
        , ( "lastEdit"
          , posixToMillis f.lastEdit
                |> E.int
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
encodeGenDirData { fiches } =
    E.object
        [ ( "fiches"
          , E.list encodeFiche
                (Dict.values fiches)
          )
        ]



--encodeCategorie { name, fields } =
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
        |> P.required "lastEdit" (D.map millisToPosix D.int)


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


updateFicheTask fiche sessionId =
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
    Http.toTask request


decodeSuccess : D.Decoder Bool
decodeSuccess =
    D.at [ "message" ] (D.succeed True)
