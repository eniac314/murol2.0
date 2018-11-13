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
                config.maxHeight - 50
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
                { onPress = Just (model.externalMsg CloseVisualPicker)
                , label = text "Retour"
                }
            , Input.button (buttonStyle (FileExplorer.getSelectedImage config.fileExplorer /= Nothing))
                { onPress =
                    FileExplorer.getSelectedImage config.fileExplorer
                        |> Maybe.map .src
                        |> Maybe.map (model.externalMsg << ConfirmVisual)
                , label = text "Valider"
                }
            ]
        ]



--styleSelector model =
--    row
--        []
--        [ Input.text
--            [ Events.onClick StyleSelectorClick
--            --, Events.onLoseFocus BlurStyleSelector
--            , width (px 150)
--            , below <|
--                if model.styleSelectorFocused then
--                    column []
--                        (List.map
--                            (\s ->
--                                el
--                                    [ Events.onClick (SetStyle s)
--                                    , pointer
--                                    , mouseOver
--                                        [ Font.color (rgb 1 1 1)
--                                        , Background.color (rgb 0.7 0.7 0.7)
--                                        ]
--                                    , Background.color (rgb 1 1 1)
--                                    , width (px 150)
--                                    , paddingXY 15 5
--                                    ]
--                                    (text s)
--                            )
--                            (Dict.keys tableStyles)
--                        )
--                else
--                    Element.none
--            , spacing 15
--            , paddingXY 15 5
--            , focused [ Border.glow (rgb 1 1 1) 0 ]
--            ]
--            { onChange =
--                SetStyle
--            , text = model.styleSelectorInput
--            , placeholder = Just (Input.placeholder [] (el [] (text model.currentStyle)))
--            , label =
--                Input.labelLeft [ centerY ] (el [] (text "Style"))
--            }
--        ]


selectView selected handler entry =
    Keyed.el
        [ width fill
        , paddingXY 5 5
        , Events.onClick handler
        , pointer
        , if Just entry == selected then
            Background.color
                (rgba 0 0 1 0.3)
          else
            noAttr
        ]
        ( entry, text entry )


editFicheView :
    { config
        | maxHeight : Int
        , zone : Time.Zone
        , fileExplorer : FileExplorer.Model msg
    }
    -> Model msg
    -> Element Msg
editFicheView config model =
    let
        linkedDocView { url, descr, label, expiryDate } =
            column
                [ spacing 15 ]
                [ newTabLink
                    []
                    { url = url
                    , label = el [ Font.bold ] (text label)
                    }
                , Maybe.map (\d -> el [] (text d)) descr
                    |> Maybe.withDefault Element.none
                , el [] (text <| expiryDateToStr config.zone expiryDate)
                ]
    in
    column
        [ spacing 20
        , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
        , clip
        , width fill
        , height fill
        ]
        [ el
            [ Font.bold
            , Font.size 18
            ]
            (text "Modification/création fiche")
        , column
            [ height (maximum (config.maxHeight - 120) fill)
            , scrollbarY
            , width fill
            , spacing 20
            ]
            [ setNomEntite config model
            , setCats config model
            , setActivs config model
            , setLabels config model
            , setOt config model
            , setRank config model
            , setAdresse config model
            , setTel config model
            , setFax config model
            , setEmails config model
            , setSite config model
            , setResponsables config model
            , setDescriptions config model
            ]
        , row
            [ spacing 15
            ]
            [ Input.button
                (buttonStyle True)
                { onPress = Just (SetRightPanelDisplay PreviewFiche)
                , label = el [] (text "Retour")
                }
            , Input.button
                (buttonStyle True)
                { onPress = Just SaveFiche
                , label = el [] (text "Sauvegarder fiche")
                }
            ]
        ]


setNomEntite config model =
    Input.text
        textInputStyle
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
                (el [ Font.bold ] (text "Nom entité:"))
        }


setCats config model =
    row
        [ spacing 15 ]
        [ column
            [ spacing 15
            , alignTop
            ]
            [ el [ Font.bold ] (text "Catégories disponibles")
            , column
                [ Border.width 2
                , Border.color (rgb 0.8 0.8 0.8)
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
            [ el [ Font.bold ] (text "Catégories fiche")
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
                , Border.color (rgb 0.8 0.8 0.8)
                , width (px 180)
                , height (px 155)
                , scrollbars
                ]
                (model.ficheBuffer.categories
                    |> List.map
                        (\e -> selectView model.selectedCatInFiche (SelectCatInFiche e) e)
                )
            ]
        , column
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
            ]
        ]


setActivs config model =
    row
        [ spacing 15 ]
        [ column
            [ spacing 15
            , alignTop
            ]
            [ el [ Font.bold ] (text "Activités disponibles")
            , column
                [ Border.width 2
                , Border.color (rgb 0.8 0.8 0.8)
                , width (px 150)
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
            [ el [ Font.bold ] (text "Activités fiche")
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
                , Border.color (rgb 0.8 0.8 0.8)
                , width (px 180)
                , height (px 155)
                , scrollbars
                ]
                (model.ficheBuffer.natureActiv
                    |> List.map
                        (\e -> selectView model.selectedActivInFiche (SelectActivInFiche e) e)
                )
            ]
        , column
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
            ]
        ]


setLabels config model =
    row
        [ spacing 15 ]
        [ column
            [ spacing 15
            , alignTop
            ]
            [ el [ Font.bold ] (text "Labels disponibles")
            , column
                [ Border.width 2
                , Border.color (rgb 0.8 0.8 0.8)
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
            [ el [ Font.bold ] (text "Labels fiche")
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
                , Border.color (rgb 0.8 0.8 0.8)
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
        , column
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
        [ spacing 15 ]
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
                    (el [ Font.bold ] (text "Référence OT"))
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
                    (el [ Font.bold ] (text "Lien OT"))
            }
        ]


setRank config model =
    row
        [ spacing 15 ]
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
                    (el [ Font.bold ] (text "Etoiles"))
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
                    (el [ Font.bold ] (text "Epis"))
            }
        ]


setAdresse config model =
    Input.text
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
                (el [ Font.bold ] (text "Adresse / Siège social"))
        }


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
                    (el [ Font.bold ] (text "Tel. fixe"))
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
                    (el [ Font.bold ] (text "Tel. portable"))
            }
        ]


setFax config model =
    Input.text
        (textInputStyle
            ++ [ width (px 300)
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
                (el [ Font.bold ] (text "Fax"))
        }


setEmails config model =
    row
        [ spacing 15 ]
        [ column
            [ spacing 15 ]
            [ el [ Font.bold ] (text "Emails")
            , column
                [ Border.width 2
                , Border.color (rgb 0.8 0.8 0.8)
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
        [ spacing 15 ]
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
                    (el [ Font.bold ]
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
                    (el [ Font.bold ]
                        (text "Url site")
                    )
            }
        ]


setResponsables config model =
    row
        [ spacing 15 ]
        [ column
            [ spacing 15
            ]
            [ el [ Font.bold ] (text "Responsables")
            , column
                [ Border.width 2
                , Border.color (rgb 0.8 0.8 0.8)
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
        [ spacing 15 ]
        [ column
            [ spacing 15
            ]
            [ el [ Font.bold ] (text "Descriptions")
            , column
                [ Border.width 2
                , Border.color (rgb 0.8 0.8 0.8)
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
