module TextBlock exposing (..)

import Browser exposing (element)
import Document exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Lazy as Lazy
import Element.Region as Region
import Html exposing (Html, i, node, textarea)
import Html.Attributes as Attr
import Html.Events as HtmlEvents
import Icons exposing (..)
import Json.Decode as Decode


type alias DocTextBlock =
    { rawInput : String
    , selected : Maybe Selection
    , nbrCols : Maybe Int
    }


type alias TextBlock =
    List TextBlockElement


type TextBlockElement
    = TBParagraph (List TextBlockPrimitive)
    | UList (List Li)
    | TextBlockPrimitive


type alias Li =
    List TextBlockPrimitive


type TextBlockPrimitive
    = Text String
    | Link LinkMeta
    | Bold String


type Msg
    = NoOp
    | NewSelection Selection
    | ClearSelection
    | TextInput String
    | Loaded String


type alias Selection =
    { start : Int
    , finish : Int
    , sel : String
    }


main : Program () DocTextBlock Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


subscriptions model =
    Sub.none


init flags =
    ( { rawInput = ""
      , selected = Nothing
      , nbrCols = Nothing
      }
    , Cmd.none
    )


update msg model =
    case msg of
        TextInput s ->
            ( { model | rawInput = s }
            , Cmd.none
            )

        NewSelection s ->
            ( { model
                | selected =
                    if s.start == s.finish then
                        Nothing
                    else
                        Just s
              }
            , Cmd.none
            )

        ClearSelection ->
            ( { model | selected = Nothing }
            , Cmd.none
            )

        Loaded n ->
            ( { model | nbrCols = String.toInt n }
            , Cmd.none
            )

        NoOp ->
            ( model, Cmd.none )


view model =
    Element.layout [] <|
        column
            [ padding 15
            , spacing 15
            ]
            [ interfaceView model
            , customTextArea
                [ width fill ]
            , paragraph [ width (maximum 500 fill) ]
                [ text <| Debug.toString model ]
            ]


interfaceView model =
    row [ spacing 10 ]
        [ Input.button buttonStyle
            { onPress = Nothing
            , label = html <| link2
            }
        , Input.button
            buttonStyle
            { onPress = Nothing
            , label = html <| externalLink
            }
        , Input.button buttonStyle
            { onPress = Nothing
            , label = html <| bold
            }
        , Input.button
            buttonStyle
            { onPress = Nothing
            , label = html <| list
            }
        ]


textBlocPreview model =
    column []
        []


customTextArea attrs =
    el attrs
        (html <|
            node "custom-textarea"
                [ HtmlEvents.onInput TextInput
                , HtmlEvents.on "Selection" decodeSelection
                , HtmlEvents.on "Loaded" decodeLoaded
                ]
                [ textarea
                    [ --Attr.style "resize" "none"
                      Attr.style "font-family" "Arial"
                    , Attr.style "font-size" "16px"
                    , Attr.cols 60
                    , Attr.style "height" "500px"
                    , Attr.style "spellcheck" "false"
                    ]
                    []
                ]
        )



--computeHeight


decodeSelection =
    Decode.at [ "target", "selection" ]
        (Decode.map3 Selection
            (Decode.field "start" Decode.int)
            (Decode.field "finish" Decode.int)
            (Decode.field "sel" Decode.string)
            |> Decode.map NewSelection
        )


decodeLoaded =
    Decode.map Loaded <|
        Decode.at [ "target", "cols" ] Decode.string


buttonStyle =
    [ Border.rounded 5
    , Font.center
    , centerY
    , paddingXY 5 3
    , mouseOver
        [ Background.color (rgb 0.9 0.9 0.9) ]
    ]
