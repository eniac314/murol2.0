module GeneralDirectoryEditor.GeneralDirHelpers exposing (..)

import Derberos.Date.Core exposing (addTimezoneMilliseconds, civilToPosix, newDateRecord, posixToCivil)
import Derberos.Date.Utils exposing (numberOfDaysInMonth, numberToMonth)
import GeneralDirectoryEditor.GeneralDirCommonTypes as Types exposing (..)
import Time exposing (..)


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


expiryDateToStr : Time.Zone -> Time.Posix -> String
expiryDateToStr zone d =
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
