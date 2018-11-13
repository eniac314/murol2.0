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
import Html as Html
import Html.Attributes as HtmlAttr
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.Icons exposing (chevronsDown, chevronsUp)
import Murmur3 exposing (hashString)
import Set exposing (..)
import Time exposing (..)


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


editFicheView :
    { config
        | maxHeight : Int
        , zone : Time.Zone
        , fileExplorer : FileExplorer.Model msg
        , logInfo : LogInfo
    }
    -> Model msg
    -> Element msg
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
                ([ nameVisualCont config model ]
                    ++ ([ catsActivsCont config model
                        , labOtRankCont config model
                        , contactsCont config model
                        , descrCont config model
                        ]
                            |> List.map (Element.map model.externalMsg)
                       )
                    ++ [ linkDocsCont config model
                       ]
                )
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
----------------
-- Containers --
----------------


containerStyle =
    [ padding 15
    , Background.color grey6
    , Border.rounded 5
    , width fill
    ]


nameVisualCont config model =
    row
        ([ spacing 20
         ]
            ++ containerStyle
        )
        [ Element.map model.externalMsg <| setNomEntite config model
        , setVisual config model
        ]


catsActivsCont config model =
    row
        ([ spacing 20 ] ++ containerStyle)
        [ setCats config model
        , setActivs config model
        ]


labOtRankCont config model =
    row
        ([ spacing 20 ] ++ containerStyle)
        [ setLabels config model
        , column
            [ spacing 15 ]
            [ setOt config model
            , setRank config model
            ]
        ]


contactsCont config model =
    column
        ([ spacing 20 ] ++ containerStyle)
        [ setAdresse config model
        , row
            ([ spacing 15 ] ++ formItemStyle)
            [ setTel config model
            , setFax config model
            ]
        , setEmails config model
        , setSite config model
        , setResponsables config model
        ]


descrCont config model =
    row ([ spacing 20 ] ++ containerStyle)
        [ setDescriptions config model ]


linkDocsCont config model =
    row ([ spacing 20 ] ++ containerStyle)
        [ Element.map model.externalMsg <| setLinkedDocs config model ]



-------------------------------------------------------------------------------
----------------
-- Form Items --
----------------


formItemStyle =
    [ padding 15
    , Background.color grey7
    , Border.rounded 5
    ]


setNomEntite config model =
    row
        ([ spacing 15 ] ++ formItemStyle)
        [ Input.text
            (textInputStyle ++ [ width (px 400) ])
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
                    (el [ Font.bold, Font.color grey1 ] (text "Nom entité:"))
            }
        ]


setVisual config model =
    column
        ([ spacing 15 ] ++ formItemStyle)
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
                if config.maxHeight < 800 then
                    400
                else
                    500
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
                { onPress = Just (model.externalMsg <| CloseVisualPicker)
                , label = text "Retour"
                }
            , Input.button (buttonStyle (FileExplorer.getSelectedImage config.fileExplorer /= Nothing))
                { onPress =
                    FileExplorer.getSelectedImage config.fileExplorer
                        |> Maybe.map (model.externalMsg << ConfirmVisual << .src)
                , label = text "Valider"
                }
            ]
        ]


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
            , Input.button
                (buttonStyle (model.selectedCatInFiche /= Nothing))
                { onPress =
                    Maybe.map (\_ -> RemoveCatFromFiche)
                        model.selectedCatInFiche
                , label = el [] (text "Modifier catégorie")
                }
            ]
        ]


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


setLabels config model =
    column
        ([ spacing 15 ] ++ formItemStyle)
        [ row
            [ spacing 15 ]
            [ column
                [ spacing 15
                , alignTop
                ]
                [ el [ Font.bold, Font.color grey1 ] (text "Labels disponibles")
                , column
                    [ Border.width 2
                    , Border.color grey3
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
                [ el [ Font.bold, Font.color grey1 ] (text "Labels fiche")
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
                    , Border.color grey3
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
            ]
        , row
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


setAdresse config model =
    row
        ([ width fill ]
            ++ formItemStyle
        )
        [ Input.text
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
                    (el [ Font.bold, Font.color grey1 ] (text "Adresse / Siège social"))
            }
        ]


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


setSite config model =
    row
        ([ spacing 15 ] ++ formItemStyle)
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


setResponsables config model =
    row
        ([ spacing 15 ] ++ formItemStyle)
        [ column
            [ spacing 15
            ]
            [ el [ Font.bold, Font.color grey1 ] (text "Responsables")
            , column
                [ Border.width 2
                , Border.color grey3
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


setDescriptions config model =
    column
        ([ spacing 15 ] ++ formItemStyle)
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


setLinkedDocs config model =
    column
        ([ spacing 15 ]
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
                , width (px 400)
                , height (px 200)
                , scrollbars
                ]
                (model.ficheBuffer.linkedDocs
                    |> List.map
                        (\ld ->
                            linkedDocView config.zone ld
                        )
                )
            , column
                [ spacing 15 ]
                [ Input.text
                    (textInputStyle
                        ++ [ width (px 180)
                           ]
                    )
                    { onChange =
                        SetLinkedDocLabel
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
                ]
            ]
        ]


linkedDocView zone ({ url, descr, label, expiryDate } as ld) =
    column
        [ spacing 15
        , Events.onClick (SelectLinkedDoc ld)
        ]
        [ newTabLink
            []
            { url = url
            , label = el [ Font.bold, Font.color grey1 ] (text label)
            }
        , Maybe.map (\d -> el [] (text d)) descr
            |> Maybe.withDefault Element.none
        , Maybe.map (\ed -> el [] (text <| expiryDateToStr zone ed)) expiryDate
            |> Maybe.withDefault Element.none
        ]
