module GeneralDirectoryEditor.GeneralDirMainFormView exposing (..)

import Auth.AuthPlugin exposing (LogInfo(..), cmdIfLogged)
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
import GeneralDirectoryEditor.GeneralDirCommonTypes as Types exposing (..)
import GeneralDirectoryEditor.GeneralDirHelpers exposing (..)
import Html
import Html.Attributes as HtmlAttr
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.Icons exposing (chevronsDown, chevronsUp)
import Murmur3 exposing (hashString)
import Set exposing (..)
import Time exposing (..)


type alias ViewConfig config msg =
    { config
        | maxHeight : Int
        , zone : Time.Zone
        , fileExplorer : FileExplorer.Model msg
        , logInfo : LogInfo
    }


editFicheView : ViewConfig config msg -> Model msg -> Element msg
editFicheView config model =
    column
        [ spacing 20
        , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
        , clip
        , width fill
        , height fill
        ]
        [ el
            [ Font.bold
            , Font.color grey1
            , Font.size 18
            ]
            (text "Modification/création fiche")
        , column
            [ height (maximum (config.maxHeight - 120) fill)
            , scrollbarY
            , width fill
            , inFront <|
                if not model.visualPickerOpen then
                    Element.none
                else
                    el
                        [ Background.color (rgb 1 1 1)
                        , width (px 850)
                        , Border.shadow
                            { offset = ( 4, 4 )
                            , size = 5
                            , blur = 10
                            , color = rgba 0 0 0 0.45
                            }
                        ]
                        (visualPickerView config model)
            ]
            [ column
                [ spacing 35 ]
                [ nameVisualCont config model
                , catsActivsCont config model
                , labOtRankCont config model
                , contactsCont config model
                , descrCont config model
                , linkDocsCont config model
                , ouvertureCont config model
                ]
            ]
        , row
            [ spacing 15
            ]
            [ Input.button
                (buttonStyle True)
                { onPress = Just (model.externalMsg <| SetRightPanelDisplay PreviewFiche)
                , label = el [] (text "Retour")
                }
            , Input.button
                (buttonStyle True)
                { onPress = Just (model.externalMsg SaveFiche)
                , label = el [] (text "Sauvegarder fiche")
                }
            ]
        ]



-------------------------------------------------------------------------------
-------------------------------------------------------------------------------
----------------
-- Containers --
----------------


nameVisualCont : ViewConfig config msg -> Model msg -> Element msg
nameVisualCont config model =
    row
        ([ spacing 20
         ]
            ++ containerStyle
        )
        [ Element.map model.externalMsg <| setNomEntite config model
        , setVisual config model
        ]


catsActivsCont : ViewConfig config msg -> Model msg -> Element msg
catsActivsCont config model =
    Element.map model.externalMsg <|
        row
            ([ spacing 20 ] ++ containerStyle)
            [ setCats config model
            , setActivs config model
            ]


labOtRankCont : ViewConfig config msg -> Model msg -> Element msg
labOtRankCont config model =
    row
        ([ spacing 20
         ]
            ++ containerStyle
        )
        [ setLabels config model
        , Element.map model.externalMsg <|
            column
                [ spacing 15
                , alignTop
                , alignRight
                ]
                [ setOt config model
                , setRank config model
                ]
        ]


contactsCont : ViewConfig config msg -> Model msg -> Element msg
contactsCont config model =
    Element.map model.externalMsg <|
        column
            ([ spacing 20 ] ++ containerStyle)
            [ setAdresse config model
            , row
                ([ spacing 15
                 , width fill
                 ]
                    ++ formItemStyle
                )
                [ setTel config model
                , setFax config model
                ]
            , setEmails config model
            , setSite config model
            , setResponsables config model
            ]


descrCont : ViewConfig config msg -> Model msg -> Element msg
descrCont config model =
    Element.map model.externalMsg <|
        row ([ spacing 20 ] ++ containerStyle)
            [ setDescriptions config model ]


linkDocsCont : ViewConfig config msg -> Model msg -> Element msg
linkDocsCont config model =
    row ([ spacing 20 ] ++ containerStyle)
        [ setLinkedDocs config model ]


ouvertureCont : ViewConfig config msg -> Model msg -> Element msg
ouvertureCont config model =
    Element.map model.externalMsg <|
        column
            containerStyle
            [ setOuverture config model ]



-------------------------------------------------------------------------------
-------------------------------------------------------------------------------
----------------
-- Form Items --
----------------
-------------------------------------------------------------------------------
-----------------
-- Nom entitté --
-----------------


setNomEntite : ViewConfig config msg -> Model msg -> Element Msg
setNomEntite config model =
    row
        ([ spacing 15
         , alignTop
         ]
            ++ formItemStyle
        )
        [ Input.text
            (textInputStyle ++ [ width (px 500) ])
            { onChange =
                SetNomEntite
            , text =
                model.ficheBuffer.nomEntite
            , placeholder =
                Nothing
            , label =
                Input.labelLeft
                    [ centerY ]
                    (el [ Font.bold, Font.color grey1 ] (text "Nom entité:"))
            }
        ]



-------------------------------------------------------------------------------
-----------------
-- Main Visual --
-----------------


setVisual : ViewConfig config msg -> Model msg -> Element msg
setVisual config model =
    column
        ([ spacing 15
         , alignRight
         ]
            ++ formItemStyle
        )
        [ el
            [ width (px 150)
            , height (px 113)
            , Background.color grey5
            ]
            (el
                [ width (px 138)
                , height (px 104)
                , Background.image
                    model.ficheBuffer.visuel
                , centerX
                , centerY
                ]
                Element.none
            )
        , Input.button
            (buttonStyle True)
            { onPress =
                Just <| model.externalMsg OpenVisualPicker
            , label =
                el [] (text "Choisir visuel")
            }
        ]



-------------------------------------------------------------------------------
----------------
-- Categories --
----------------


setCats : ViewConfig config msg -> Model msg -> Element Msg
setCats config model =
    column
        ([ spacing 15 ] ++ formItemStyle)
        [ row
            [ spacing 15 ]
            [ column
                [ spacing 15
                , alignTop
                ]
                [ el [ Font.bold, Font.color grey1 ] (text "Catégories disponibles")
                , column
                    [ Border.width 2
                    , Border.color grey3
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
                [ el [ Font.bold, Font.color grey1 ] (text "Catégories fiche")
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
                    , Border.color grey3
                    , width (px 180)
                    , height (px 155)
                    , scrollbars
                    ]
                    (model.ficheBuffer.categories
                        |> List.map
                            (\e -> selectView model.selectedCatInFiche (SelectCatInFiche e) e)
                    )
                ]
            ]
        , row
            [ spacing 15
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
            , Input.button
                (buttonStyle (model.selectedCatInFiche /= Nothing))
                { onPress =
                    Maybe.map (\_ -> RemoveCatFromFiche)
                        model.selectedCatInFiche
                , label = el [] (text "Modifier catégorie")
                }
            ]
        ]



-------------------------------------------------------------------------------
----------------------
-- Nature activités --
----------------------


setActivs : ViewConfig config msg -> Model msg -> Element Msg
setActivs config model =
    column
        ([ spacing 15 ] ++ formItemStyle)
        [ row
            [ spacing 15 ]
            [ column
                [ spacing 15
                , alignTop
                ]
                [ el [ Font.bold, Font.color grey1 ] (text "Activités disponibles")
                , column
                    [ Border.width 2
                    , Border.color grey3
                    , width (px 350)
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
                [ el [ Font.bold, Font.color grey1 ] (text "Activités fiche")
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
                    , Border.color grey3
                    , width (px 180)
                    , height (px 155)
                    , scrollbars
                    ]
                    (model.ficheBuffer.natureActiv
                        |> List.map
                            (\e -> selectView model.selectedActivInFiche (SelectActivInFiche e) e)
                    )
                ]
            ]
        , row
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
            , Input.button
                (buttonStyle (model.selectedActivInFiche /= Nothing))
                { onPress =
                    Maybe.map (\_ -> RemoveActivFromFiche)
                        model.selectedActivInFiche
                , label = el [] (text "Modifier activité")
                }
            ]
        ]



-------------------------------------------------------------------------------
------------
-- Labels --
------------


setLabels : ViewConfig config msg -> Model msg -> Element msg
setLabels config model =
    column
        ([ spacing 15
         ]
            ++ formItemStyle
        )
        [ el
            [ below <|
                if not model.labelVisualPickerOpen then
                    Element.none
                else
                    el
                        [ Background.color (rgb 1 1 1)
                        , width (px 850)
                        , Border.shadow
                            { offset = ( 4, 4 )
                            , size = 5
                            , blur = 10
                            , color = rgba 0 0 0 0.45
                            }
                        ]
                        (labelVisualPickerView config model)
            ]
            Element.none
        , row
            [ spacing 15
            ]
            [ Element.map model.externalMsg <|
                column
                    [ spacing 15
                    , alignTop
                    ]
                    [ el [ Font.bold, Font.color grey1 ] (text "Labels disponibles")
                    , column
                        [ Border.width 2
                        , Border.color grey3
                        , width (px 150)
                        , height (px 242)
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
            , Element.map model.externalMsg <|
                column
                    [ spacing 15
                    , alignTop
                    ]
                    [ el [ Font.bold, Font.color grey1 ] (text "Labels fiche")
                    , column
                        [ Border.width 2
                        , Border.color grey3
                        , width (px 180)
                        , height (px 242)
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
                , alignTop
                ]
                [ el
                    [ Font.bold
                    , Font.color grey1
                    ]
                    (text "Créer / Modifier label")
                , Element.map model.externalMsg <|
                    Input.text
                        (textInputStyle
                            ++ [ spacingXY 0 15
                               , width (px 180)
                               ]
                        )
                        { onChange =
                            SetLabelName
                        , text =
                            model.labelBuffer
                                |> Maybe.map .nom
                                |> Maybe.withDefault ""
                        , placeholder =
                            Just <|
                                Input.placeholder
                                    []
                                    (text "Nom label")
                        , label =
                            Input.labelLeft
                                []
                                Element.none
                        }
                , Element.map model.externalMsg <|
                    Input.text
                        (textInputStyle
                            ++ [ spacingXY 0 15
                               , width (px 180)
                               ]
                        )
                        { onChange =
                            SetLabelLink
                        , text =
                            model.labelBuffer
                                |> Maybe.map .lien
                                |> Maybe.withDefault ""
                        , placeholder =
                            Just <|
                                Input.placeholder
                                    []
                                    (text "Lien label")
                        , label =
                            Input.labelLeft
                                []
                                Element.none
                        }
                , setLabelVisual config model
                ]
            ]
        , Element.map model.externalMsg <|
            row
                [ spacing 15
                , width fill
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
                , el
                    [ paddingEach
                        { top = 0
                        , right = 0
                        , left = 103
                        , bottom = 0
                        }
                    ]
                    (Input.button
                        ([]
                            ++ buttonStyle
                                (Maybe.map validLabel model.labelBuffer
                                    |> (\res -> res == Just True)
                                )
                        )
                        { onPress =
                            Maybe.map validLabel model.labelBuffer
                                |> Maybe.map
                                    (\_ ->
                                        if model.selectedAvailableLabel /= Nothing then
                                            ModifyLabel
                                        else
                                            CreateNewLabel
                                    )
                        , label =
                            el []
                                (if model.selectedAvailableLabel /= Nothing then
                                    text "Modifier label"
                                 else
                                    text "Créer label"
                                )
                        }
                    )
                ]
        ]


setLabelVisual : ViewConfig config msg -> Model msg -> Element msg
setLabelVisual config model =
    column
        [ spacing 15
        ]
        [ el
            [ width (px 150)
            , height (px 113)
            , Background.color grey5
            ]
            (el
                [ width (px 138)
                , height (px 104)
                , Background.uncropped
                    (model.labelBuffer
                        |> Maybe.map .logo
                        |> Maybe.withDefault ""
                    )
                , centerX
                , centerY
                ]
                Element.none
            )
        , Input.button
            (buttonStyle True)
            { onPress =
                Just <| model.externalMsg OpenLabelVisualPicker
            , label =
                el [] (text "Choisir visuel")
            }
        ]



-------------------------------------------------------------------------------
------------------------
-- Office de tourisme --
------------------------


setOt : ViewConfig config msg -> Model msg -> Element Msg
setOt config model =
    row
        ([ spacing 15 ] ++ formItemStyle)
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
                    (el [ Font.bold, Font.color grey1 ] (text "Référence OT"))
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
                    (el [ Font.bold, Font.color grey1 ] (text "Lien OT"))
            }
        ]



-------------------------------------------------------------------------------
-----------------------
-- Rank (stars, epis)--
-----------------------


setRank : ViewConfig config msg -> Model msg -> Element Msg
setRank config model =
    row
        ([ spacing 15
         , width fill
         , alignTop
         ]
            ++ formItemStyle
        )
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
                    (el [ Font.bold, Font.color grey1 ] (text "Etoiles"))
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
                    (el [ Font.bold, Font.color grey1 ] (text "Epis"))
            }
        ]



-------------------------------------------------------------------------------
-------------
-- Address --
-------------


setAdresse : ViewConfig config msg -> Model msg -> Element Msg
setAdresse config model =
    row
        ([ width fill ]
            ++ formItemStyle
        )
        [ Input.text
            (textInputStyle
                ++ [ width (px 400)
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
                    (el [ Font.bold, Font.color grey1 ] (text "Adresse / Siège social"))
            }
        ]



-------------------------------------------------------------------------------
-----------------
-- Tel numbers --
-----------------


setTel : ViewConfig config msg -> Model msg -> Element Msg
setTel config model =
    row
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
                    (el [ Font.bold, Font.color grey1 ] (text "Tel. fixe"))
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
                    (el [ Font.bold, Font.color grey1 ] (text "Tel. portable"))
            }
        ]



-------------------------------------------------------------------------------
---------
-- fax --
---------


setFax : ViewConfig config msg -> Model msg -> Element Msg
setFax config model =
    Input.text
        (textInputStyle
            ++ [ width (px 120)
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
                (el [ Font.bold, Font.color grey1 ] (text "Fax"))
        }



-------------------------------------------------------------------------------
------------
-- Emails --
------------


setEmails : ViewConfig config msg -> Model msg -> Element Msg
setEmails config model =
    row
        ([ spacing 15
         , width fill
         ]
            ++ formItemStyle
        )
        [ column
            [ spacing 15 ]
            [ el [ Font.bold, Font.color grey1 ] (text "Emails")
            , column
                [ Border.width 2
                , Border.color grey3
                , width (px 400)
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



-------------------------------------------------------------------------------
----------
-- Site --
----------


setSite : ViewConfig config msg -> Model msg -> Element Msg
setSite config model =
    row
        ([ spacing 15
         , width fill
         ]
            ++ formItemStyle
        )
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
                    (el [ Font.bold, Font.color grey1 ]
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
                    (el [ Font.bold, Font.color grey1 ]
                        (text "Url site")
                    )
            }
        ]



-------------------------------------------------------------------------------
------------------
-- Responsables --
------------------


setResponsables : ViewConfig config msg -> Model msg -> Element Msg
setResponsables config model =
    row
        ([ spacing 15
         , width fill
         ]
            ++ formItemStyle
        )
        [ column
            [ spacing 15
            ]
            [ el [ Font.bold, Font.color grey1 ] (text "Responsables")
            , column
                [ Border.width 2
                , Border.color grey3
                , width (px 400)
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
            [ spacing 15 ]
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



-------------------------------------------------------------------------------
------------------
-- Descriptions --
------------------


setDescriptions : ViewConfig config msg -> Model msg -> Element Msg
setDescriptions config model =
    column
        ([ spacing 15
         , width fill
         ]
            ++ formItemStyle
        )
        [ column
            [ spacing 15
            ]
            [ el [ Font.bold, Font.color grey1 ] (text "Descriptions")
            , column
                [ Border.width 2
                , Border.color grey3
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



-------------------------------------------------------------------------------
---------------
-- LinkedDocs--
---------------


setLinkedDocs : ViewConfig config msg -> Model msg -> Element msg
setLinkedDocs config model =
    column
        ([ spacing 15
         , width fill
         ]
            ++ formItemStyle
        )
        [ el
            [ Font.bold
            , Font.color grey1
            ]
            (text "Documents associés")
        , row
            [ spacing 15 ]
            [ column
                [ Border.width 2
                , Border.color grey3
                , width (px 600)
                , height (px 200)
                , scrollbars
                ]
                (model.ficheBuffer.linkedDocs
                    |> List.map
                        (\ld ->
                            linkedDocView model.externalMsg config.zone model.selectedLinkedDoc ld
                        )
                )
            , column
                [ spacing 15 ]
                [ Input.text
                    (textInputStyle
                        ++ [ width (px 220)
                           , spacingXY 0 15
                           ]
                    )
                    { onChange =
                        model.externalMsg << SetLinkedDocLabel
                    , text =
                        model.linkedDocBuffer
                            |> Maybe.map .label
                            |> Maybe.withDefault ""
                    , placeholder =
                        Just <|
                            Input.placeholder
                                []
                                (text "Titre du document")
                    , label =
                        Input.labelLeft
                            []
                            Element.none
                    }
                , Input.text
                    (textInputStyle
                        ++ [ width (px 220)
                           , spacingXY 0 15
                           ]
                    )
                    { onChange =
                        model.externalMsg << SetLinkedDocDescr
                    , text =
                        model.linkedDocBuffer
                            |> Maybe.andThen .descr
                            |> Maybe.withDefault ""
                    , placeholder =
                        Just <|
                            Input.placeholder
                                []
                                (text "Remarques/commentaires")
                    , label =
                        Input.labelLeft
                            []
                            Element.none
                    }
                , Input.text
                    (textInputStyle
                        ++ [ width (px 220)
                           , if Maybe.andThen .expiryDate model.linkedDocBuffer /= Nothing then
                                Font.color green4
                             else
                                Font.color red4
                           , spacingXY 0 15
                           ]
                    )
                    { onChange =
                        model.externalMsg << SetLinkedDocExpiry
                    , text =
                        case Maybe.andThen .expiryDate model.linkedDocBuffer of
                            Nothing ->
                                model.expiryDateBuffer
                                    |> Maybe.withDefault ""

                            Just t ->
                                expiryDateToStr config.zone t
                    , placeholder =
                        Just <|
                            Input.placeholder
                                []
                                (text "Date expiration (jj/mm/aaaa))")
                    , label =
                        Input.labelLeft
                            []
                            Element.none
                    }
                , el
                    []
                    (Input.button
                        (buttonStyle True)
                        { onPress =
                            Just (model.externalMsg OpenDocPicker)
                        , label = el [] (text "Sélectionner document")
                        }
                    )
                ]
            ]
        , row
            [ spacing 15
            , above <|
                if not model.docPickerOpen then
                    Element.none
                else
                    el
                        [ Background.color (rgb 1 1 1)
                        , width (px 850)
                        , Border.shadow
                            { offset = ( 4, 4 )
                            , size = 5
                            , blur = 10
                            , color = rgba 0 0 0 0.45
                            }
                        ]
                        (docPickerView config model)
            ]
            (let
                isExisting =
                    Maybe.map
                        (\ld ->
                            List.member ld model.ficheBuffer.linkedDocs
                        )
                        model.linkedDocBuffer
                        == Just True

                canAdd =
                    (Maybe.map validLinkedDoc model.linkedDocBuffer
                        |> (\res -> res == Just True)
                    )
                        && (model.selectedLinkedDoc == Nothing)
                        && not isExisting

                canModify =
                    model.selectedLinkedDoc
                        /= Nothing
                        && (model.linkedDocBuffer /= Just emptyLinkedDoc)
                        && not isExisting

                canDelete =
                    model.selectedLinkedDoc
                        /= Nothing
                        && isExisting
             in
             [ Input.button
                (buttonStyle canModify)
                { onPress =
                    if canModify then
                        Just (model.externalMsg ModifyLinkedDoc)
                    else
                        Nothing
                , label = el [] (text "Modifier document")
                }
             , Input.button
                (buttonStyle canAdd)
                { onPress =
                    if canAdd then
                        Just (model.externalMsg AddLinkedDoc)
                    else
                        Nothing
                , label = el [] (text "Ajouter document")
                }
             , Input.button
                (buttonStyle canDelete)
                { onPress =
                    if canDelete then
                        Just (model.externalMsg RemoveLinkedDoc)
                    else
                        Nothing
                , label = el [] (text "Supprimer document")
                }
             ]
            )
        ]


linkedDocView : (Msg -> msg) -> Time.Zone -> Maybe LinkedDoc -> LinkedDoc -> Element msg
linkedDocView externalMsg zone selected ({ url, descr, label, expiryDate } as ld) =
    let
        fileName =
            String.split "/" url
                |> List.filter (\x -> x /= "")
                |> List.reverse
                |> List.head
                |> Maybe.withDefault ""

        expiryDateStr =
            Maybe.map (expiryDateToStr zone) expiryDate

        key =
            Maybe.map hashLinkedDoc selected
                |> Maybe.withDefault "NoLinkedDoc"
                |> (\res -> res ++ hashLinkedDoc ld)
    in
    Keyed.column
        [ spacing 15
        , Events.onClick (externalMsg <| SelectLinkedDoc ld)
        , pointer
        , padding 5
        , if Just ld == selected then
            Background.color
                grey4
          else
            noAttr
        , width fill
        , height shrink
        ]
        (List.map (\e -> ( key, e )) <|
            [ row
                [ width fill ]
                [ el
                    [ Font.bold
                    , Font.color grey1
                    , width (px 300)
                    , clip
                    ]
                    (text label)
                , el
                    [ Font.size 12
                    , alignRight
                    , width (maximum 300 fill)
                    , clip
                    ]
                    (text fileName)
                ]
            , row
                [ width fill ]
                [ Maybe.map (\d -> el [] (text d)) descr
                    |> Maybe.withDefault Element.none
                , Maybe.map
                    (\ed ->
                        el [ alignRight ]
                            (text <| ed)
                    )
                    expiryDateStr
                    |> Maybe.withDefault Element.none
                ]
            ]
        )



-------------------------------------------------------------------------------
---------------
-- Ouverture --
---------------


setOuverture : ViewConfig config msg -> Model msg -> Element Msg
setOuverture config model =
    column
        ([ spacing 15
         , width fill
         ]
            ++ formItemStyle
        )
        [ el
            [ Font.bold
            , Font.color grey1
            ]
            (text "Période d'ouverture")
        , Input.radioRow
            [ spacing 15 ]
            { onChange = SetOuverture
            , options =
                [ Input.option TteAnnee (text "Toute l'année")
                , Input.option Saisonniere (text "Saisonniere")
                ]
            , selected =
                case model.ficheBuffer.ouverture of
                    Just o ->
                        Just o

                    Nothing ->
                        Just TteAnnee
            , label = Input.labelHidden ""
            }
        ]



-------------------------------------------------------------------------------
-------------------------------------------------------------------------------
----------------------
-- Helper functions --
----------------------


selectView : Maybe String -> Msg -> String -> Element Msg
selectView selected handler entry =
    Keyed.el
        [ width fill
        , paddingXY 5 5
        , Events.onClick handler
        , pointer
        , if Just entry == selected then
            Background.color
                grey4
          else
            noAttr
        , Font.color grey2
        ]
        ( entry, text entry )


containerStyle : List (Attribute msg)
containerStyle =
    [ padding 15
    , Background.color grey6
    , Border.rounded 5
    , width fill
    ]


formItemStyle : List (Attribute msg)
formItemStyle =
    [ padding 15
    , Background.color grey7
    , Border.rounded 5
    ]


hashLinkedDoc : LinkedDoc -> String
hashLinkedDoc { url, descr, label, expiryDate } =
    ("linkedDocViewKey: "
        ++ url
        ++ label
        ++ Maybe.withDefault "descr" descr
        ++ (Maybe.map (toMillis utc) expiryDate
                |> Maybe.map String.fromInt
                |> Maybe.withDefault "expiryDate"
           )
    )
        |> hashString 0
        |> String.fromInt


visualPickerView : ViewConfig config msg -> Model msg -> Element msg
visualPickerView config model =
    pickerView
        CloseVisualPicker
        ConfirmVisual
        FileExplorer.ImagesRoot
        config
        model


labelVisualPickerView : ViewConfig config msg -> Model msg -> Element msg
labelVisualPickerView config model =
    pickerView
        CloseLabelVisualPicker
        SetLabelVisual
        FileExplorer.ImagesRoot
        config
        model


docPickerView : ViewConfig config msg -> Model msg -> Element msg
docPickerView config model =
    pickerView
        CloseDocPicker
        SetLinkedDocUrl
        FileExplorer.DocsRoot
        config
        model


pickerView :
    Msg
    -> (String -> Msg)
    -> FileExplorer.Root
    -> ViewConfig config msg
    -> Model msg
    -> Element msg
pickerView backMsg confirmMsg root config model =
    let
        selector =
            case root of
                FileExplorer.ImagesRoot ->
                    Maybe.map .src << FileExplorer.getSelectedImage

                FileExplorer.DocsRoot ->
                    FileExplorer.getSelectedDoc
    in
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
                if config.maxHeight < 800 then
                    400
                else
                    500
            , zone = config.zone
            , logInfo = config.logInfo
            , mode = FileExplorer.ReadWrite root
            }
            config.fileExplorer
        , row
            [ spacing 15
            , paddingXY 15 0
            ]
            [ Input.button
                (buttonStyle True)
                { onPress = Just (model.externalMsg <| backMsg)
                , label = text "Retour"
                }
            , Input.button (buttonStyle (selector config.fileExplorer /= Nothing))
                { onPress =
                    selector config.fileExplorer
                        |> Maybe.map (model.externalMsg << confirmMsg)
                , label = text "Valider"
                }
            ]
        ]
