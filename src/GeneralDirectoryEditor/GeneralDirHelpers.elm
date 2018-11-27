module GeneralDirectoryEditor.GeneralDirHelpers exposing (..)

import Auth.AuthPlugin exposing (LogInfo(..))
import Dict exposing (..)
import GeneralDirectoryEditor.GeneralDirCommonTypes as Types exposing (..)
import GeneralDirectoryEditor.GeneralDirJson exposing (updateFicheTask)
import List.Extra exposing (setIf, uniqueBy)
import Set exposing (empty, insert)
import Task exposing (..)
import Time exposing (..)


computeCats fiches =
    Dict.foldr
        (\_ f acc ->
            List.foldr
                (\c acc_ ->
                    Set.insert c acc_
                )
                acc
                f.categories
        )
        Set.empty
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
        |> uniqueBy (\{ nom, logo, lien } -> nom ++ logo.url ++ lien)


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


validLinkedDoc { url, label } =
    url /= "" && label /= ""


validLabel { nom, logo, lien } =
    (nom /= "") && (logo.url /= "") && (lien /= "")


extractLabel model mbLabelName =
    Maybe.andThen
        (\l ->
            Dict.get l
                (model.labels
                    |> List.map (\l_ -> ( l_.nom, l_ ))
                    |> Dict.fromList
                )
        )
        mbLabelName


appendLabel mbLabel labelList =
    Maybe.map
        (\l ->
            uniqueBy
                (\l_ ->
                    .nom l_
                        ++ (.url << .logo) l_
                        ++ .lien l_
                )
            <|
                List.append
                    labelList
                    [ l ]
        )
        mbLabel
        |> Maybe.withDefault labelList


batchFichesUpdate logInfo fichesToUpdate =
    case logInfo of
        LoggedIn { sessionId } ->
            Cmd.batch <|
                List.map
                    (\f ->
                        Task.attempt (FicheUpdated f) <|
                            (Time.now
                                |> Task.andThen
                                    (\t ->
                                        let
                                            datedFb =
                                                { f | lastEdit = t }
                                        in
                                        updateFicheTask
                                            datedFb
                                            sessionId
                                    )
                            )
                    )
                    fichesToUpdate

        _ ->
            Cmd.none


filterAndUpdate model getter setter original new =
    Dict.foldr
        (\k f ( newDict, toUpdate ) ->
            if List.member original (getter f) then
                let
                    newVal =
                        setIf (\l -> l == original) new (getter f)

                    newFiche =
                        setter f newVal
                in
                ( Dict.insert k newFiche newDict
                , newFiche :: toUpdate
                )
            else
                ( Dict.insert k f newDict, toUpdate )
        )
        ( Dict.empty, [] )
        model.fiches


setFicheLabel fiche val =
    { fiche | label = val }


setFicheCat fiche val =
    { fiche | categories = val }


setFicheActiv fiche val =
    { fiche | natureActiv = val }


isValidFiche : Fiche -> Bool
isValidFiche f =
    (List.length f.categories >= 1)
        && (List.length f.natureActiv >= 1)
        && (f.nomEntite /= "")
        && (f.adresse /= "")
        && ((f.telNumber /= Nothing)
                || (List.length f.responsables >= 1)
           )
        && (f.visuel /= "")
