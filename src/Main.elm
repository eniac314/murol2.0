module Main exposing (main)

import Browser
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Html exposing (Html)


type alias Model =
    { popupOpen : Bool
    , selectedOption : String
    }


initialModel : Model
initialModel =
    { popupOpen = False
    , selectedOption = ""
    }


type Msg
    = PopupClick
    | PopupClosed
    | SetOption String


update : Msg -> Model -> Model
update msg model =
    case msg of
        PopupClick ->
            { model | popupOpen = not model.popupOpen }

        PopupClosed ->
            { model | popupOpen = False }

        SetOption s ->
            { model | selectedOption = s }


view : Model -> Html Msg
view model =
    layout [] <|
        column
            ([ width fill
             , height (px 500)
             , Background.color (rgb 0.9 0.9 0.9)
             , padding 15
             ]
                ++ (if model.popupOpen then
                        [ Events.onClick PopupClosed ]
                    else
                        []
                   )
            )
            [ selector model ]


main : Program () Model Msg
main =
    Browser.sandbox
        { init = initialModel
        , view = view
        , update = update
        }


selector model =
    row
        []
        [ Input.text
            [ Events.onClick PopupClick

            --, Events.onLoseFocus BlurStyleSelector
            , width (px 150)
            , below <|
                if model.popupOpen then
                    column []
                        (List.map
                            (\s ->
                                el
                                    [ Events.onClick (SetOption s)
                                    , pointer
                                    , mouseOver
                                        [ Font.color (rgb 1 1 1)
                                        , Background.color (rgb 0.7 0.7 0.7)
                                        ]
                                    , Background.color (rgb 1 1 1)
                                    , width (px 150)
                                    , paddingXY 15 5
                                    ]
                                    (text s)
                            )
                            [ "Option 1"
                            , "Option 2"
                            , "Option 3"
                            ]
                        )
                else
                    Element.none
            , spacing 15
            , paddingXY 15 5
            , focused [ Border.glow (rgb 1 1 1) 0 ]
            ]
            { onChange =
                SetOption
            , text = model.selectedOption
            , placeholder = Just (Input.placeholder [] (el [] (text model.selectedOption)))
            , label =
                Input.labelLeft [ centerY ] (el [] (text "options"))
            }
        ]
