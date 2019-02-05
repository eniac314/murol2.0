port module Internals.Contact exposing (..)

import Delay exposing (after)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Keyed as Keyed
import Html exposing (i)
import Html.Attributes exposing (class, style)
import Http exposing (Error)
import Internals.CommonHelpers exposing (httpErrorToString)
import Internals.CommonStyleHelpers exposing (buttonStyle, grey7, red4, textInputStyle)
import Json.Decode as Decode
import Json.Encode as Encode
import Task exposing (..)


port loadCaptcha : () -> Cmd msg


port captcha_port : (String -> msg) -> Sub msg


subscriptions : Model msg -> Sub msg
subscriptions model =
    Sub.map model.externalMsg <| captcha_port CaptchaResponse


type alias Model msg =
    { name : String
    , company : String
    , email : String
    , phone : String
    , topic : String
    , message : String
    , captchaLoaded : Bool
    , captchaResp : String
    , error : String
    , sent : Bool
    , processed : Bool
    , externalMsg : Msg -> msg
    }


type Msg
    = SetName String
    | SetCompany String
    | SetEmail String
    | SetPhone String
    | SetTopic String
    | SetMessage String
    | LoadCaptcha
    | CaptchaResponse String
    | Send
    | ProcessHttpResult (Result Error Res)
    | Reset


type Res
    = ServerCom String
    | ServerError String


init : (Msg -> msg) -> Model msg
init externalMsg =
    { name = ""
    , company = ""
    , email = ""
    , phone = ""
    , topic = ""
    , message = ""
    , captchaLoaded = False
    , captchaResp = ""
    , sent = False
    , processed = False
    , error = ""
    , externalMsg = externalMsg
    }



--, Cmd.map externalMsg <|
--    Cmd.batch [ Delay.after 1000 Delay.Millisecond LoadCaptcha ]


update : Msg -> Model msg -> ( Model msg, Cmd msg )
update msg model =
    case msg of
        SetName s ->
            let
                newModel =
                    { model | name = s }
            in
            ( newModel, loadCaptcha_ newModel )

        SetCompany s ->
            let
                newModel =
                    { model | company = s }
            in
            ( newModel, loadCaptcha_ newModel )

        SetEmail s ->
            let
                newModel =
                    { model | email = s }
            in
            ( newModel, loadCaptcha_ newModel )

        SetPhone s ->
            let
                newModel =
                    { model | phone = s }
            in
            ( newModel, loadCaptcha_ newModel )

        SetTopic s ->
            let
                newModel =
                    { model | topic = s }
            in
            ( newModel, loadCaptcha_ newModel )

        SetMessage s ->
            let
                newModel =
                    { model | message = s }
            in
            ( newModel, loadCaptcha_ newModel )

        LoadCaptcha ->
            ( { model | captchaLoaded = True }
            , Cmd.map model.externalMsg <| loadCaptcha ()
            )

        CaptchaResponse s ->
            ( { model | captchaResp = s }, Cmd.none )

        ProcessHttpResult res ->
            let
                newModel =
                    case res of
                        Err e ->
                            { model
                                | error = httpErrorToString e
                            }

                        Ok (ServerError e) ->
                            { model
                                | error = e
                            }

                        Ok (ServerCom m) ->
                            { model | sent = False, processed = True }
            in
            ( newModel, Cmd.none )

        Send ->
            ( { model
                | sent = True
              }
            , Cmd.map model.externalMsg <|
                sendContactInfo model (.captchaResp model)
            )

        Reset ->
            ( init model.externalMsg, Cmd.none )


loadCaptcha_ model =
    if not model.captchaLoaded && canLoadCaptcha model then
        toCmd model LoadCaptcha
    else
        Cmd.none


toCmd model c =
    Task.perform (\_ -> model.externalMsg c) (Task.succeed "")


view : Model msg -> Element msg
view model =
    Element.map model.externalMsg <|
        if .processed model then
            column
                [ spacing 20
                , padding 10
                , width (px 600)
                , Border.rounded 5
                , Background.color (rgb 1 1 1)
                ]
                [ text "Votre message à bien été envoyé"
                , Input.button
                    (buttonStyle True
                        ++ [ width (px 150)
                           ]
                    )
                    { onPress = Just Reset
                    , label = text "Nouveau message"
                    }
                ]
        else
            column
                [ spacing 20
                , padding 10
                , width (px 600)
                , Border.rounded 5
                , Background.color (rgb 1 1 1)
                ]
                [ wrappedRow
                    [ spacing 15 ]
                    [ Input.text
                        (textInputStyle ++ [ width (px 270), Background.color grey7 ])
                        { onChange = SetName
                        , text = model.name
                        , label =
                            mandatoryLabel "Nom et prénom:"
                        , placeholder = Nothing
                        }
                    , Input.text
                        (textInputStyle ++ [ width (px 270), Background.color grey7 ])
                        { onChange = SetCompany
                        , text = model.company
                        , label =
                            Input.labelAbove [] (text "Société:")
                        , placeholder = Nothing
                        }
                    ]
                , wrappedRow
                    [ spacing 15 ]
                    [ Input.text
                        (textInputStyle ++ [ width (px 270), Background.color grey7 ])
                        { onChange = SetEmail
                        , text = model.email
                        , label =
                            mandatoryLabel "Email:"
                        , placeholder = Nothing
                        }
                    , Input.text
                        (textInputStyle ++ [ width (px 270), Background.color grey7 ])
                        { onChange = SetPhone
                        , text = model.phone
                        , label =
                            Input.labelAbove [] (text "Téléphone:")
                        , placeholder = Nothing
                        }
                    ]
                , row
                    []
                    [ Input.text
                        (textInputStyle ++ [ width (px 270), Background.color grey7 ])
                        { onChange = SetTopic
                        , text = model.topic
                        , label =
                            mandatoryLabel "Sujet:"
                        , placeholder = Nothing
                        }
                    ]
                , Input.multiline
                    [ spacing 5
                    , width fill
                    , padding 5
                    , height (px 100)
                    , Background.color grey7
                    ]
                    { onChange = SetMessage
                    , text = model.message
                    , label =
                        mandatoryLabel "Votre message:"
                    , placeholder = Nothing
                    , spellcheck = False
                    }
                , if .sent model then
                    Element.none
                  else
                    el
                        [ htmlAttribute <| Html.Attributes.class "g-recaptcha"
                        ]
                        Element.none
                , if .sent model then
                    row
                        []
                        [ text "Traitement en cours, veuillez patienter... "
                        , html (Html.i [ Html.Attributes.class "fa fa-spinner fa-pulse" ] [])
                        ]
                  else
                    Input.button
                        (buttonStyle (validate model)
                            ++ [ width (px 150)
                               ]
                        )
                        { onPress =
                            if validate model then
                                Just Send
                            else
                                Nothing
                        , label = text "Envoyer"
                        }
                ]


mandatoryLabel s =
    Input.labelAbove
        []
        (row
            [ width (px 270)
            ]
            [ text s
            , el
                [ Font.color red4
                ]
                (text "*")
            ]
        )


canLoadCaptcha model =
    (not <| String.isEmpty model.name)
        && (not <| String.isEmpty model.email)
        && (not <| String.isEmpty model.topic)
        && (not <| String.isEmpty model.message)


validate model =
    canLoadCaptcha model
        && (not <| String.isEmpty model.captchaResp)


decodeServerCom =
    Decode.map ServerCom
        (Decode.field "message" Decode.string)


decodeServerError =
    Decode.map ServerError
        (Decode.field "serverError" Decode.string)


decodeRes : Decode.Decoder Res
decodeRes =
    Decode.oneOf
        [ decodeServerCom
        , decodeServerError
        ]


sendContactInfo : Model msg -> String -> Cmd Msg
sendContactInfo model resp =
    let
        body =
            Encode.object
                [ ( "name", Encode.string (.name model) )
                , ( "company", Encode.string (.company model) )
                , ( "email", Encode.string (.email model) )
                , ( "phone", Encode.string (.phone model) )
                , ( "topic", Encode.string (.topic model) )
                , ( "message", Encode.string (.message model) )
                , ( "captchaResponse", Encode.string resp )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "/contact.php"
        , body = body
        , expect = Http.expectJson ProcessHttpResult decodeRes
        }
