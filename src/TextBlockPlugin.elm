module TextBlockPlugin exposing (..)

import Browser exposing (element)
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
import Html exposing (Html, i, node, textarea)
import Html.Attributes as Attr
import Html.Events as HtmlEvents
import Icons exposing (..)
import Json.Decode as Decode
import Parser exposing (..)


type alias DocTextBlock =
    { rawInput : String
    , selected : Maybe Selection
    , cursorPos : Maybe Int
    , nbrCols : Maybe Int
    , parsedContent : List TextBlockElement
    , parserDebug : String

    --, links : List PrimitiveMeta
    }


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
      , cursorPos = Nothing
      , nbrCols = Nothing
      , parsedContent = []
      , parserDebug = ""

      --, links = []
      }
    , Cmd.none
    )


update msg model =
    case msg of
        TextInput s ->
            case run textBlock s of
                Ok res ->
                    ( { model
                        | rawInput = s
                        , parserDebug =
                            Debug.toString res

                        --, links =
                        --    getLinks res
                      }
                    , Cmd.none
                    )

                Err _ ->
                    ( model, Cmd.none )

        NewSelection s ->
            ( { model
                | selected =
                    if s.start == s.finish then
                        Nothing
                    else
                        Just s
                , cursorPos =
                    if s.start == s.finish then
                        Just s.start
                    else
                        Nothing
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
            , customTextArea [ width fill ] model.cursorPos
            , Element.paragraph [ width (maximum 500 fill) ]
                [ Element.text <| Debug.toString model.selected ]
            , Element.paragraph [ width (maximum 500 fill) ]
                [ Element.text <| Debug.toString model.cursorPos ]
            , Element.paragraph [ width (maximum 500 fill) ]
                [ Element.text <| Debug.toString model.parserDebug ]
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


customTextArea attrs cursorPos =
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



-------------------------------------------------------------------------------
----------------------
-- TextBlock Parser --
----------------------


type alias LinkRef =
    Int


type alias HeadingRef =
    Int


type Element
    = ParagraphElement (List Primitive)
    | UListElement (List Primitive)
    | Singleton Primitive


type Primitive
    = LinkPrimitive PrimitiveMeta
    | HeadingPrimitive PrimitiveMeta
    | InlineStylePrimitive PrimitiveMeta
    | TextPrimitive String
    | WordPrimitive String


type alias PrimitiveMeta =
    { start : Int
    , stop : Int
    , uid : Int
    , value : String
    }


textBlock : Parser (List Element)
textBlock =
    let
        helper elems =
            oneOf
                [ Parser.map (\_ -> Done (List.reverse elems)) end
                , succeed (\ul -> Loop (ul :: elems))
                    |= uList
                    |> backtrackable
                , succeed (\p -> Loop (p :: elems))
                    |= paragraph
                ]
    in
    loop [] helper


paragraph : Parser Element
paragraph =
    let
        helper prims =
            oneOf
                [ Parser.map (\_ -> Done (List.reverse prims)) break
                , Parser.map (\_ -> Done (List.reverse prims)) end
                , succeed (\p -> Loop (p :: prims))
                    |= primitive
                ]
    in
    loop [] helper
        |> Parser.map groupWordsIntoText
        |> Parser.map ParagraphElement


uList : Parser Element
uList =
    let
        helper prims =
            oneOf
                [ Parser.map (\_ -> Done (List.reverse prims)) break
                , Parser.map (\_ -> Done (List.reverse prims)) end
                , succeed (\p -> Loop (p :: prims))
                    |= primitive
                ]
    in
    succeed identity
        |. spaces
        |. keyword "*"
        |. spaces
        |= (loop [] helper
                |> Parser.map groupWordsIntoText
           )
        |> Parser.map UListElement


reallyspaces : Parser ()
reallyspaces =
    chompWhile (\c -> c == ' ')


break =
    succeed ()
        |. reallyspaces
        |. keyword "\n"
        |. spaces
        |> backtrackable


link : Parser Primitive
link =
    succeed
        (\start uid val stop ->
            LinkPrimitive
                { start = start
                , stop = stop
                , uid = uid
                , value = val
                }
        )
        |. spaces
        |= getOffset
        |. symbol "<"
        |. spaces
        |. keyword "lien"
        |. spaces
        |= int
        |. spaces
        |. symbol ">"
        |= (chompUntil "<"
                |> getChompedString
           )
        |. keyword "</>"
        |= getOffset


heading : Parser Primitive
heading =
    succeed
        (\start uid val stop ->
            HeadingPrimitive
                { start = start
                , stop = stop
                , uid = uid
                , value = val
                }
        )
        |. spaces
        |= getOffset
        |. symbol "<"
        |. spaces
        |. token "titre-"
        |. int
        |. spaces
        |= int
        |. spaces
        |. symbol ">"
        |= (chompUntil "<"
                |> getChompedString
           )
        |. keyword "</>"
        |= getOffset


inlineStyle : Parser Primitive
inlineStyle =
    succeed
        (\start uid val stop ->
            InlineStylePrimitive
                { start = start
                , stop = stop
                , uid = uid
                , value = val
                }
        )
        |. spaces
        |= getOffset
        |. symbol "<"
        |. spaces
        |. keyword "style"
        |. spaces
        |= int
        |. spaces
        |. symbol ">"
        |= (chompUntil "<"
                |> getChompedString
           )
        |. keyword "</>"
        |= getOffset


primitive : Parser Primitive
primitive =
    oneOf
        [ backtrackable allPrimitivesButText
        , word
        ]


allPrimitivesButText : Parser Primitive
allPrimitivesButText =
    oneOf
        [ backtrackable link
        , backtrackable inlineStyle
        , heading
        ]


word : Parser Primitive
word =
    succeed identity
        |. spaces
        |= (chompWhile (\c -> not <| c == ' ' || c == '\t' || c == '\n')
                |> getChompedString
           )
        |> Parser.map WordPrimitive


groupWordsIntoText : List Primitive -> List Primitive
groupWordsIntoText prims =
    let
        helper buffer acc xs =
            case xs of
                [] ->
                    case buffer of
                        [] ->
                            List.reverse acc

                        _ ->
                            List.reverse buffer
                                |> String.join " "
                                |> TextPrimitive
                                |> (\nw -> List.reverse (nw :: acc))

                x :: xs_ ->
                    case x of
                        WordPrimitive w ->
                            helper (w :: buffer) acc xs_

                        _ ->
                            case buffer of
                                [] ->
                                    helper buffer (x :: acc) xs_

                                _ ->
                                    helper
                                        []
                                        (List.reverse buffer
                                            |> String.join " "
                                            |> TextPrimitive
                                            |> (\nw -> x :: nw :: acc)
                                        )
                                        xs_
    in
    helper [] [] prims


getLinks : List Primitive -> List PrimitiveMeta
getLinks =
    List.filterMap
        (\p ->
            case p of
                LinkPrimitive lm ->
                    Just lm

                _ ->
                    Nothing
        )
