module GeneralDirectoryEditor.GeneralDirHelpers exposing (..)

import Derberos.Date.Core exposing (addTimezoneMilliseconds, civilToPosix, newDateRecord, posixToCivil)
import Derberos.Date.Utils exposing (numberOfDaysInMonth, numberToMonth)
import GeneralDirectoryEditor.GeneralDirCommonTypes as Types exposing (..)
import Time exposing (..)
import Dict exposing (..)
import List.Extra exposing (uniqueBy, setIf)
import Task exposing (..)
import Auth.AuthPlugin exposing (LogInfo(..))
import GeneralDirectoryEditor.GeneralDirJson exposing (updateFicheTask)
import Set exposing (insert, empty)


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
        |> uniqueBy (\{ nom, logo, lien } -> nom ++ logo ++ lien)


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


parseDate : String -> Maybe ( Int, Int, Int )
parseDate s =
    case
        String.split "/" s
            |> List.filterMap String.toInt
    of
        day :: month :: year :: [] ->
            if (year > 2000) && (year <= 2200) then
                case numberToMonth (month - 1) of
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


dateToStr : Time.Zone -> Time.Posix -> String
dateToStr zone d =
    let
        dateRec =
            posixToCivil (addTimezoneMilliseconds zone d)
    in
        (String.fromInt dateRec.day
            |> String.padLeft 2 '0'
        )
            ++ "/"
            ++ (String.fromInt dateRec.month
                    |> String.padLeft 2 '0'
               )
            ++ "/"
            ++ String.fromInt dateRec.year


validLinkedDoc { url, label } =
    url /= "" && label /= ""


validLabel { nom, logo, lien } =
    (nom /= "") && (logo /= "") && (lien /= "")


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
                        ++ .logo l_
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
