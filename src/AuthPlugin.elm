module AuthPlugin exposing (LogInfo(..), Model, Msg, getLogInfo, init, update, view)

import DocumentEditorHelpers exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Lazy as Lazy
import Element.Region as Region
import Http exposing (..)
import Json.Decode as Decode exposing (..)
import Json.Encode as Encode exposing (..)
import Task exposing (..)
import Time exposing (..)


type LogInfo
    = LoggedIn
        { username : String
        , sessionId : String
        }
    | LoggedOut


type alias Model msg =
    { username : String
    , password : String
    , confirmPassword : String
    , logInfo : LogInfo
    , pluginMode : PluginMode
    , logs : List Log
    , zone : Time.Zone
    , externalMsg : Msg -> msg
    }


init externalMsg =
    { username = ""
    , password = ""
    , confirmPassword = ""
    , logInfo = LoggedOut
    , pluginMode = LoginMode Initial
    , logs = []
    , zone = Time.utc
    , externalMsg = externalMsg
    }


reset model =
    ( { model
        | username = ""
        , password = ""
        , confirmPassword = ""
        , pluginMode = LoginMode Initial
        , logs = []
      }
    , login model
    )


getLogInfo model =
    model.logInfo


type Status
    = Initial
    | Waiting
    | Success
    | Failure


type PluginMode
    = SignUpMode Status
    | LoginMode Status
    | LogoutMode Status


type Msg
    = SetUsername String
    | SetPassword String
    | SetConfirmPassword String
    | Login
    | ConfirmLogin (Result Http.Error LogInfo)
    | SignUp
    | ConfirmSignUp (Result Http.Error Bool)
    | Logout
    | ConfirmLogout (Result Http.Error Bool)
    | ChangePluginMode PluginMode
      --| GetFiles
      --| SetFiles (Result Http.Error (List String))
    | AddLog (Posix -> Log) Posix
    | Quit
    | NoOp


update msg model =
    let
        ( newModel, cmds, mbPluginAction ) =
            internalUpdate msg model
    in
    ( newModel, Cmd.map model.externalMsg cmds, mbPluginAction )


internalUpdate msg model =
    case msg of
        SetUsername s ->
            ( { model | username = s }
            , Cmd.none
            , Nothing
            )

        SetPassword s ->
            ( { model | password = s }
            , Cmd.none
            , Nothing
            )

        SetConfirmPassword s ->
            ( { model | confirmPassword = s }
            , Cmd.none
            , Nothing
            )

        Login ->
            ( { model
                | pluginMode = LoginMode Waiting
              }
            , login model
            , Nothing
            )

        ConfirmLogin res ->
            case res of
                Err e ->
                    ( { model
                        | logInfo = LoggedOut
                        , pluginMode = LoginMode Failure
                      }
                    , newLog
                        "Echec connexion"
                        (Just <| httpErrorToString e)
                        True
                    , Nothing
                    )

                Ok logInfo ->
                    ( { model
                        | logInfo = logInfo
                        , pluginMode = LoginMode Success
                      }
                    , Cmd.none
                    , Nothing
                    )

        SignUp ->
            ( { model
                | pluginMode = SignUpMode Waiting
              }
            , signUp model
            , Nothing
            )

        ConfirmSignUp res ->
            case res of
                Err e ->
                    ( { model | pluginMode = SignUpMode Failure }
                    , newLog
                        "Echec création compte"
                        (Just <| httpErrorToString e)
                        True
                    , Nothing
                    )

                Ok _ ->
                    ( { model | pluginMode = SignUpMode Success }
                    , Cmd.none
                    , Nothing
                    )

        Logout ->
            ( { model
                | pluginMode = LogoutMode Waiting
              }
            , logout
            , Nothing
            )

        ConfirmLogout res ->
            case res of
                Err e ->
                    ( { model | pluginMode = LogoutMode Failure }
                    , newLog
                        "Echec déconnexion"
                        (Just <| httpErrorToString e)
                        True
                    , Nothing
                    )

                Ok _ ->
                    ( { model
                        | pluginMode = LogoutMode Success
                        , logInfo = LoggedOut
                      }
                    , Cmd.none
                    , Nothing
                    )

        ChangePluginMode mode ->
            ( { model
                | pluginMode = mode
              }
            , Cmd.none
            , Nothing
            )

        AddLog l t ->
            ( { model | logs = l t :: model.logs }
            , Cmd.none
            , Nothing
            )

        Quit ->
            ( model, Cmd.none, Just PluginQuit )

        NoOp ->
            ( model, Cmd.none, Nothing )


newLog : String -> Maybe String -> Bool -> Cmd Msg
newLog message details isError =
    Task.perform
        (AddLog (Log message details isError))
        Time.now


login : Model msg -> Cmd Msg
login model =
    let
        body =
            Encode.object
                [ ( "username"
                  , Encode.string (.username model)
                  )
                , ( "password"
                  , Encode.string (.password model)
                  )
                ]
                |> Http.jsonBody

        request =
            Http.post "login.php" body decodeLoginResult
    in
    Http.send ConfirmLogin request


decodeLoginResult : Decoder LogInfo
decodeLoginResult =
    Decode.map2 (\a b -> LoggedIn { username = a, sessionId = b })
        (Decode.field "username" Decode.string)
        (Decode.field "sessionId" Decode.string)


signUp : Model msg -> Cmd Msg
signUp model =
    let
        body =
            Encode.object
                [ ( "username"
                  , Encode.string (.username model)
                  )
                , ( "password"
                  , Encode.string (.password model)
                  )
                ]
                |> Http.jsonBody

        request =
            Http.post "signup.php" body decodeSignupResult
    in
    Http.send ConfirmSignUp request


decodeSignupResult =
    Decode.field "signUpComplete" Decode.bool


logout : Cmd Msg
logout =
    let
        request =
            Http.get "logout.php" decodeLogoutResult
    in
    Http.send ConfirmLogout request


decodeLogoutResult =
    Decode.field "notLoggedIn" Decode.bool


view config model =
    Element.map model.externalMsg <|
        case model.pluginMode of
            SignUpMode status ->
                signUpView config status model

            LoginMode status ->
                loginView config status model

            LogoutMode status ->
                logoutView config status model


signUpView config status model =
    let
        initialView =
            column
                [ spacing 15 ]
                [ Input.text textInputStyle
                    { onChange =
                        SetUsername
                    , text =
                        model.username
                    , placeholder = Nothing
                    , label =
                        Input.labelLeft [ centerY ]
                            (el [ width (px 110) ] (text "Nom utilisateur: "))
                    }
                , Input.newPassword textInputStyle
                    { onChange =
                        SetPassword
                    , text =
                        model.password
                    , placeholder = Nothing
                    , label =
                        Input.labelLeft [ centerY ]
                            (el [ width (px 110) ] (text "Mot de passe: "))
                    , show = False
                    }
                , Input.newPassword textInputStyle
                    { onChange =
                        SetConfirmPassword
                    , text =
                        model.confirmPassword
                    , placeholder = Nothing
                    , label =
                        Input.labelLeft [ centerY ]
                            (el [ width (px 110) ] (text "Confirmation: "))
                    , show = False
                    }
                , row
                    [ spacing 15 ]
                    [ Input.button (buttonStyle True)
                        { onPress = Just SignUp
                        , label = text "Envoyer"
                        }
                    , Input.button (buttonStyle True)
                        { onPress = Just Quit
                        , label = text "Retour"
                        }
                    ]
                ]

        waitingView =
            column
                [ spacing 15 ]
                [ text "Traitement en cours, veuillez patienter" ]

        successView =
            column
                [ spacing 15 ]
                [ text "Inscription réussie!"
                , row [ spacing 15 ]
                    [ Input.button (buttonStyle True)
                        { onPress =
                            Just <| ChangePluginMode (LoginMode Initial)
                        , label = text "Connexion"
                        }
                    , Input.button (buttonStyle True)
                        { onPress = Just Quit
                        , label = text "Retour"
                        }
                    ]
                ]

        failureView =
            column
                [ spacing 15 ]
                [ text "Echec inscription!"
                , logsView model.logs model.zone
                , row [ spacing 15 ]
                    [ Input.button (buttonStyle True)
                        { onPress =
                            Just <| ChangePluginMode (SignUpMode Initial)
                        , label = text "Réessayer"
                        }
                    , Input.button (buttonStyle True)
                        { onPress =
                            Just <| ChangePluginMode (LoginMode Initial)
                        , label = text "Connexion"
                        }
                    , Input.button (buttonStyle True)
                        { onPress = Just Quit
                        , label = text "Retour"
                        }
                    ]
                ]
    in
    column
        [ padding 15
        , spacing 15
        , Font.size 16
        , alignTop
        ]
        [ text "Nouvel utilisateur: "
        , case status of
            Initial ->
                initialView

            Waiting ->
                waitingView

            Success ->
                successView

            Failure ->
                failureView
        ]


loginView config status model =
    let
        initialView =
            column
                [ spacing 15 ]
                [ Input.text textInputStyle
                    { onChange =
                        SetUsername
                    , text =
                        model.username
                    , placeholder = Nothing
                    , label =
                        Input.labelLeft [ centerY ]
                            (el [ width (px 110) ] (text "Nom utilisateur: "))
                    }
                , Input.currentPassword textInputStyle
                    { onChange =
                        SetPassword
                    , text =
                        model.password
                    , placeholder = Nothing
                    , label =
                        Input.labelLeft [ centerY ]
                            (el [ width (px 110) ] (text "Mot de passe: "))
                    , show = False
                    }
                , row [ spacing 15 ]
                    [ Input.button (buttonStyle True)
                        { onPress = Just Login
                        , label = text "Connexion"
                        }
                    , Input.button (buttonStyle True)
                        { onPress = Just <| ChangePluginMode (SignUpMode Initial)
                        , label = text "Nouvel utilisateur"
                        }
                    ]
                ]

        waitingView =
            column
                [ spacing 15 ]
                [ text "Traitement en cours, veuillez patienter" ]

        successView =
            column
                [ spacing 15 ]
                [ text "Connexion réussie!"
                , row [ spacing 15 ]
                    [ Input.button (buttonStyle True)
                        { onPress = Just <| ChangePluginMode (LogoutMode Initial)
                        , label = text "Deconnexion"
                        }
                    , Input.button (buttonStyle True)
                        { onPress = Just Quit
                        , label = text "Retour"
                        }
                    ]
                ]

        failureView =
            column
                [ spacing 15 ]
                [ text "Echec Connexion!"
                , logsView model.logs model.zone
                , row [ spacing 15 ]
                    [ Input.button (buttonStyle True)
                        { onPress =
                            Just <| ChangePluginMode (LoginMode Initial)
                        , label = text "Réessayer"
                        }
                    , Input.button (buttonStyle True)
                        { onPress = Just Quit
                        , label = text "Retour"
                        }
                    ]
                ]
    in
    column
        [ padding 15
        , spacing 15
        , Font.size 16
        , alignTop
        ]
        [ text "Connexion: "
        , case status of
            Initial ->
                initialView

            Waiting ->
                waitingView

            Success ->
                successView

            Failure ->
                failureView
        ]


logoutView config status model =
    let
        initialView =
            column
                [ spacing 15 ]
                [ Input.button (buttonStyle True)
                    { onPress = Just Logout
                    , label = text "Se déconnecter"
                    }
                ]

        waitingView =
            column
                [ spacing 15 ]
                [ text "Traitement en cours, veuillez patienter" ]

        successView =
            column
                [ spacing 15 ]
                [ text "Déconnexion réussie!"
                , row [ spacing 15 ]
                    [ Input.button (buttonStyle True)
                        { onPress = Just <| ChangePluginMode (LoginMode Initial)
                        , label = text "Connexion"
                        }
                    , Input.button (buttonStyle True)
                        { onPress = Just Quit
                        , label = text "Retour"
                        }
                    ]
                ]

        failureView =
            column
                [ spacing 15 ]
                [ text "Echec déconnexion!"
                , logsView model.logs model.zone
                , row [ spacing 15 ]
                    [ Input.button (buttonStyle True)
                        { onPress =
                            Just <| ChangePluginMode (LogoutMode Initial)
                        , label = text "Réessayer"
                        }
                    , Input.button (buttonStyle True)
                        { onPress = Just Quit
                        , label = text "Retour"
                        }
                    ]
                ]
    in
    column
        [ padding 15
        , spacing 15
        , Font.size 16
        , alignTop
        ]
        [ text "Déconnexion: "
        , case status of
            Initial ->
                initialView

            Waiting ->
                waitingView

            Success ->
                successView

            Failure ->
                failureView
        ]


logsView : List Log -> Time.Zone -> Element Msg
logsView logs zone =
    let
        formatTime =
            String.fromInt
                >> String.padLeft 2 '0'

        logView { message, mbDetails, isError, timeStamp } =
            column
                [ spacing 5
                , width (maximum 500 fill)
                ]
                [ row [ spacing 15 ]
                    [ el [ Font.color (rgb 0.7 0.7 0.7) ]
                        (text <|
                            formatTime (Time.toHour zone timeStamp)
                                ++ ":"
                                ++ formatTime (Time.toMinute zone timeStamp)
                        )
                    , el
                        [ if isError then
                            Font.color (rgb 1 0 0)
                          else
                            noAttr
                        ]
                        (text message)
                    ]
                , case mbDetails of
                    Nothing ->
                        Element.none

                    Just details ->
                        paragraph
                            [ paddingEach
                                { top = 0
                                , bottom = 0
                                , left = 20
                                , right = 0
                                }
                            , Font.size 12
                            ]
                            [ text details ]
                ]
    in
    column [ spacing 15 ]
        (List.map logView logs)
