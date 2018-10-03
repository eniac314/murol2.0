module VideoPlugin exposing (..)

import Dict exposing (..)
import Document exposing (..)
import DocumentEditorHelpers exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Lazy as Lazy
import Element.Region as Region
import Html exposing (Html)
import Html.Attributes as Attr
import Icons exposing (..)


type alias Model msg =
    { pastedHtml : Maybe String
    , mbVideoMeta : Maybe VideoMeta
    , videoAttrs : List DocAttribute
    , newSrc : Maybe String
    , alignment : Alignment
    , frameBorder : Bool
    , suggestions : Bool
    , controls : Bool
    , privacy : Bool
    , title : Bool
    , startAt : Maybe Int
    , size : VideoSize
    , sizeRatio : Float
    , error : String
    , externalMsg : Msg -> msg
    }


type Msg
    = SetEmbedString String
    | ParseHtml
    | SetAlignment Alignment
    | CheckFrameBorder Bool
    | CheckControls Bool
    | CheckPrivacy Bool
    | CheckTitle Bool
    | CheckSuggestions Bool
    | SetStartAt String
    | SetWidth String
    | SetHeight String
    | Quit
    | SaveAndQuit
    | NoOp


init : Maybe ( VideoMeta, List DocAttribute ) -> (Msg -> msg) -> Model msg
init mbInput externalMsg =
    { pastedHtml = Nothing
    , mbVideoMeta =
        Maybe.map Tuple.first mbInput
    , videoAttrs =
        Maybe.map Tuple.second mbInput
            |> Maybe.withDefault []
    , newSrc = Nothing
    , alignment =
        Maybe.map (findAlignment << Tuple.second) mbInput
            |> Maybe.withDefault ACenter
    , frameBorder =
        Maybe.map (.frameBorder << Tuple.first) mbInput
            |> Maybe.withDefault False
    , suggestions =
        Maybe.map (.suggestions << Tuple.first) mbInput
            |> Maybe.withDefault False
    , controls =
        Maybe.map (.controls << Tuple.first) mbInput
            |> Maybe.withDefault False
    , privacy =
        Maybe.map (.privacy << Tuple.first) mbInput
            |> Maybe.withDefault False
    , title =
        Maybe.map (.title << Tuple.first) mbInput
            |> Maybe.withDefault False
    , startAt =
        Maybe.andThen (.startAt << Tuple.first) mbInput
    , size =
        Maybe.map (.size << Tuple.first) mbInput
            |> Maybe.withDefault
                (VideoSize 560 314)

    --, width =
    --    Maybe.map (.videoWidth << .size << Tuple.first) mbInput
    --        |> Maybe.withDefault 560
    --, height =
    --    Maybe.map (.videoHeight << .size << Tuple.first) mbInput
    --        |> Maybe.withDefault 315
    , sizeRatio =
        Maybe.map
            (\mbI ->
                let
                    ( w, h ) =
                        Tuple.first mbI
                            |> .size
                            |> (\s ->
                                    ( toFloat s.videoWidth
                                    , toFloat s.videoHeight
                                    )
                               )
                in
                w / h
            )
            mbInput
            |> Maybe.withDefault (560 / 315)
    , error = ""
    , externalMsg = externalMsg
    }


update : Msg -> Model msg -> ( Model msg, Maybe (PluginResult ( VideoMeta, List DocAttribute )) )
update msg model =
    case msg of
        SetEmbedString s ->
            ( { model | pastedHtml = Just s }, Nothing )

        ParseHtml ->
            case Maybe.andThen parseHtml model.pastedHtml of
                Nothing ->
                    ( model, Nothing )

                Just res ->
                    ( { model
                        | newSrc = res.newSrc
                        , frameBorder = res.frameBorder
                        , suggestions = res.suggestions
                        , controls = res.controls
                        , privacy = res.privacy
                        , title = res.title
                        , startAt = res.startAt
                        , size = VideoSize res.width res.height
                        , sizeRatio = toFloat res.width / toFloat res.height
                      }
                    , Nothing
                    )

        SetAlignment alignment ->
            ( { model | alignment = alignment }
            , Nothing
            )

        CheckFrameBorder bool ->
            ( { model | frameBorder = bool }, Nothing )

        CheckControls bool ->
            ( { model | controls = bool }, Nothing )

        CheckPrivacy bool ->
            ( { model | privacy = bool }, Nothing )

        CheckTitle bool ->
            ( { model | title = bool }, Nothing )

        CheckSuggestions bool ->
            ( { model | suggestions = bool }, Nothing )

        SetStartAt s ->
            case parseTime s of
                Nothing ->
                    ( model, Nothing )

                Just t ->
                    ( { model | startAt = Just t }, Nothing )

        SetWidth s ->
            case String.toInt s of
                Just w ->
                    ( { model
                        | size = VideoSize w (round (toFloat w / model.sizeRatio))
                      }
                    , Nothing
                    )

                Nothing ->
                    ( model, Nothing )

        SetHeight s ->
            case String.toInt s of
                Just h ->
                    ( { model
                        | size = VideoSize (round (toFloat h * model.sizeRatio)) h
                      }
                    , Nothing
                    )

                Nothing ->
                    ( model, Nothing )

        SaveAndQuit ->
            case model.newSrc of
                Nothing ->
                    case model.mbVideoMeta of
                        Nothing ->
                            ( model, Nothing )

                        Just vm ->
                            let
                                newVideoMeta =
                                    { src = vm.src
                                    , size =
                                        model.size

                                    --VideoSize model.width model.height
                                    , frameBorder = model.frameBorder
                                    , suggestions = model.suggestions
                                    , controls = model.controls
                                    , privacy = model.privacy
                                    , title = model.title
                                    , startAt = model.startAt
                                    , hosting = Youtube
                                    }
                            in
                            ( model
                            , Just <|
                                PluginData
                                    ( newVideoMeta
                                    , setAligment model.alignment model.videoAttrs
                                    )
                            )

                Just url ->
                    let
                        newVideoMeta =
                            { src = url
                            , size = model.size
                            , frameBorder = model.frameBorder
                            , suggestions = model.suggestions
                            , controls = model.controls
                            , privacy = model.privacy
                            , title = model.title
                            , startAt = model.startAt
                            , hosting = Youtube
                            }
                    in
                    ( model
                    , Just <|
                        PluginData
                            ( newVideoMeta
                            , setAligment model.alignment model.videoAttrs
                            )
                    )

        Quit ->
            ( model
            , Just PluginQuit
            )

        NoOp ->
            ( model, Nothing )


view config model =
    Element.map model.externalMsg <|
        column
            [ spacing 15
            , padding 15
            , alignTop
            , Font.size 16
            , width fill
            , height fill
            , scrollbars
            ]
            [ text "Insérer / Modifier une video:"
            , column
                [ spacing 10
                , width (px 500)
                ]
                [ Input.multiline
                    [ width fill ]
                    { onChange = SetEmbedString
                    , text =
                        model.pastedHtml
                            |> Maybe.withDefault ""
                    , placeholder = Nothing
                    , label =
                        Input.labelAbove
                            []
                            (text "Copier ici le code d'intégration:")
                    , spellcheck = False
                    }
                , Input.button
                    (buttonStyle (model.pastedHtml /= Nothing))
                    { onPress =
                        if model.pastedHtml /= Nothing then
                            Just ParseHtml
                        else
                            Nothing
                    , label = text "Valider"
                    }
                ]
            , column
                [ spacing 15 ]
                [ text "Alignement: "
                , row
                    [ spacing 15 ]
                    [ Input.button (toogleButtonStyle (model.alignment == ALeft) True)
                        { onPress = Just (SetAlignment ALeft)
                        , label = el [] (html <| Icons.alignLeft iconSize)
                        }
                    , Input.button (toogleButtonStyle (model.alignment == ACenter) True)
                        { onPress = Just (SetAlignment ACenter)
                        , label = el [] (html <| Icons.alignCenter iconSize)
                        }
                    , Input.button (toogleButtonStyle (model.alignment == ARight) True)
                        { onPress = Just (SetAlignment ARight)
                        , label = el [] (html <| Icons.alignRight iconSize)
                        }
                    ]
                , text "Options: "
                , row
                    [ spacing 15 ]
                    [ Input.checkbox
                        []
                        { onChange = CheckFrameBorder
                        , icon = checkIcon
                        , checked = model.frameBorder
                        , label =
                            Input.labelLeft
                                []
                                (text "Bordure")
                        }
                    , Input.checkbox
                        []
                        { onChange = CheckTitle
                        , icon = checkIcon
                        , checked = model.title
                        , label =
                            Input.labelLeft
                                []
                                (text "Afficher titre")
                        }
                    , Input.checkbox
                        []
                        { onChange = CheckControls
                        , icon = checkIcon
                        , checked = model.controls
                        , label =
                            Input.labelLeft
                                []
                                (text "Commandes")
                        }
                    , Input.checkbox
                        []
                        { onChange = CheckSuggestions
                        , icon = checkIcon
                        , checked = model.suggestions
                        , label =
                            Input.labelLeft
                                []
                                (text "Suggestions")
                        }
                    , Input.checkbox
                        []
                        { onChange = CheckPrivacy
                        , icon = checkIcon
                        , checked = model.privacy
                        , label =
                            Input.labelLeft
                                []
                                (text "Mode privé")
                        }
                    ]
                , row
                    [ spacing 15 ]
                    [ Input.text
                        (textInputStyle ++ [ width (px 50) ])
                        { onChange = SetWidth
                        , text = String.fromInt model.size.videoWidth
                        , placeholder = Nothing
                        , label =
                            Input.labelLeft
                                [ centerY ]
                                (text "largeur: ")
                        }
                    , Input.text
                        (textInputStyle ++ [ width (px 50) ])
                        { onChange = SetHeight
                        , text = String.fromInt model.size.videoHeight
                        , placeholder = Nothing
                        , label =
                            Input.labelLeft
                                [ centerY ]
                                (text "hauteur: ")
                        }
                    , Input.text
                        (textInputStyle ++ [ width (px 100) ])
                        { onChange = SetStartAt
                        , text =
                            Maybe.map String.fromInt model.startAt
                                |> Maybe.withDefault ""
                        , placeholder =
                            Just <|
                                Input.placeholder
                                    []
                                    (text "hh:mm:ss")
                        , label =
                            Input.labelLeft
                                [ centerY ]
                                (text "Commencer lecture à: ")
                        }
                    ]
                ]
            , case model.newSrc of
                Just url ->
                    el []
                        (html <|
                            Html.iframe
                                [ Attr.src <|
                                    buildYoutubeUrl url model
                                , Attr.width model.size.videoWidth
                                , Attr.height model.size.videoHeight
                                , if model.frameBorder then
                                    noHtmlAttr
                                  else
                                    Attr.attribute "frameborder" "0"
                                , Attr.attribute "allowfullscreen" "true"
                                , Attr.attribute "allow" "autoplay; encrypted-media"
                                ]
                                []
                        )

                Nothing ->
                    case model.mbVideoMeta of
                        Just vidMeta ->
                            el []
                                (html <|
                                    Html.iframe
                                        [ Attr.src <|
                                            buildYoutubeUrl vidMeta.src model
                                        , Attr.width model.size.videoWidth
                                        , Attr.height model.size.videoHeight
                                        , if model.frameBorder then
                                            noHtmlAttr
                                          else
                                            Attr.attribute "frameborder" "0"
                                        , Attr.attribute "allowfullscreen" "true"
                                        , Attr.attribute "allow" "autoplay; encrypted-media"
                                        ]
                                        []
                                )

                        Nothing ->
                            Element.none
            , row
                [ spacing 15
                ]
                [ Input.button (buttonStyle True)
                    { onPress = Just Quit
                    , label = text "Quitter"
                    }
                , Input.button (buttonStyle True)
                    { onPress = Just SaveAndQuit
                    , label = text "Valider et Quitter"
                    }
                ]
            ]


iconSize =
    18


checkIcon =
    \c ->
        if c then
            html <| checkSquare 15
        else
            html <| square 15


sample1 =
    """<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/Dg58WYCvBv0?start=180" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    """


parseHtml str =
    let
        propDict =
            String.replace "<iframe " "" str
                |> String.replace "></iframe>" ""
                |> String.dropRight 10
                |> String.words
                |> List.concatMap (String.split "?")
                |> List.map (String.split "=")
                |> List.filterMap
                    (\mbPair ->
                        case mbPair of
                            property :: [] ->
                                Just ( property, "True" )

                            property :: value :: [] ->
                                Just ( property, String.replace "\"" "" value )

                            _ ->
                                Nothing
                    )
                |> Dict.fromList

        mbNewSrc =
            Dict.get "src" propDict
                |> Maybe.map (String.split "/")
                |> Maybe.map List.reverse
                |> Maybe.map List.head
    in
    case mbNewSrc of
        Just newSrc ->
            Just <|
                { newSrc = newSrc
                , frameBorder =
                    Dict.get "frameborder" propDict
                        |> Maybe.map (\v -> v == "1")
                        |> Maybe.withDefault False
                , suggestions =
                    Dict.get "rel" propDict
                        |> Maybe.map (\v -> v == "1")
                        |> Maybe.withDefault False
                , controls =
                    Dict.get "controls" propDict
                        |> Maybe.map (\v -> not (v == "0"))
                        |> Maybe.withDefault True
                , privacy =
                    Dict.get "src" propDict
                        |> Maybe.map (String.contains "nocookie")
                        |> Maybe.withDefault False
                , title =
                    Dict.get "showinfo" propDict
                        |> Maybe.map (\v -> not (v == "0"))
                        |> Maybe.withDefault True
                , startAt =
                    Dict.get "start" propDict
                        |> Maybe.andThen String.toInt
                , width =
                    Dict.get "width" propDict
                        |> Maybe.andThen String.toInt
                        |> Maybe.withDefault 560
                , height =
                    Dict.get "height" propDict
                        |> Maybe.andThen String.toInt
                        |> Maybe.withDefault 315
                }

        Nothing ->
            Nothing


parseTime str =
    case String.split ":" str of
        [] ->
            Nothing

        ss :: [] ->
            String.toInt ss

        mm :: ss :: [] ->
            case ( String.toInt mm, String.toInt ss ) of
                ( Just mm_, Just ss_ ) ->
                    Just <| mm_ * 60 + ss_

                _ ->
                    Nothing

        hh :: mm :: ss :: [] ->
            case ( String.toInt hh, String.toInt mm, String.toInt ss ) of
                ( Just hh_, Just mm_, Just ss_ ) ->
                    Just <| hh_ * 3600 + mm_ * 60 + ss_

                _ ->
                    Nothing

        _ ->
            Nothing
