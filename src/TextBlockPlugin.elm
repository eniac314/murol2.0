module TextBlockPlugin exposing (..)

import Browser exposing (element)
import Dict exposing (..)
import Document exposing (..)
import DocumentEditorHelpers exposing (..)
import DocumentView exposing (renderTextBlock)
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
import Json.Encode as Encode
import Parser exposing (..)
import StyleSheets exposing (StyleSheet, defaulStyleSheet)


select =
    Encode.object
        [ ( "start", Encode.int 20 )
        , ( "stop", Encode.int 40 )
        ]


type alias DocTextBlock =
    { rawInput : String
    , parsedInput : Result (List DeadEnd) (List Element)
    , selected : Maybe Selection
    , cursorPos : Maybe Int
    , nbrCols : Maybe Int
    , output : List TextBlockElement
    , setSelection : Bool
    , trackedData : Dict Int TrackedData
    , selectedData : Maybe TrackedData
    , nextLinkId : Int
    , config : Config Msg
    }


type Msg
    = NoOp
    | NewSelection Selection
    | ClearSelection
    | TextInput String
    | Loaded String
    | SetSelection
    | MakeInternalLink
    | MakeExternalLink


type alias Selection =
    { start : Int
    , finish : Int
    , sel : String
    }



--type Element
--    = ParagraphElement (List Primitive)
--    | UListElement (List Primitive)
--    | HeadingElement PrimitiveMeta
--    | Singleton Primitive
--type Primitive
--    = InternalLinkPrimitive PrimitiveMeta
--    | ExternalLinkPrimitive PrimitiveMeta
--    | InlineStylePrimitive PrimitiveMeta
--    | TextPrimitive String
--    | WordPrimitive String
--type TrackedDataKind
--    = InternalLink
--    | ExternalLink
--    | Heading
--    | InlineStyled
--type alias TrackedData =
--    { meta : PrimitiveMeta
--    , attrs : List DocAttribute
--    , dataKind : TrackedDataKind
--    }


type alias Config msg =
    { width : Int
    , height : Int
    , mainInterfaceHeight : Int
    , sizesDict :
        Dict Int
            { docWidth : Int
            , docHeight : Int
            }
    , customElems :
        Dict String (Element.Element msg)
    , onLoadMsg : Int -> msg
    , styleSheet : StyleSheet msg
    , zipperHandlers : Maybe (ZipperHandlers msg)
    , editMode : Bool
    , containersBkgColors : Bool
    }


toTextBlocElement : DocTextBlock -> Element -> Maybe TextBlockElement
toTextBlocElement model elem =
    case elem of
        ParagraphElement prims ->
            Just <|
                Paragraph []
                    (List.filterMap (toTextBlockPrimitive model) prims)

        UListElement prims ->
            Just <|
                UList []
                    [ List.filterMap (toTextBlockPrimitive model) prims
                    ]

        HeadingElement _ { uid, value } ->
            case
                Dict.get uid model.trackedData
                    |> Maybe.map (\td -> ( td.attrs, td.dataKind ))
            of
                Just ( attrs, Heading level ) ->
                    Just <| Document.Heading attrs ( level, value )

                _ ->
                    Nothing

        Singleton prim ->
            Maybe.map TBPrimitive (toTextBlockPrimitive model prim)


toTextBlockPrimitive : DocTextBlock -> Primitive -> Maybe TextBlockPrimitive
toTextBlockPrimitive model prim =
    case prim of
        ExternalLinkPrimitive { uid, value } ->
            case
                Dict.get uid model.trackedData
                    |> Maybe.map (\td -> ( td.attrs, td.dataKind ))
            of
                Just ( attrs, InternalLink url ) ->
                    Just <|
                        Document.Link
                            attrs
                            { targetBlank = True
                            , url = url
                            , label = value
                            }

                _ ->
                    Nothing

        InternalLinkPrimitive { uid, value } ->
            case
                Dict.get uid model.trackedData
                    |> Maybe.map (\td -> ( td.attrs, td.dataKind ))
            of
                Just ( attrs, InternalLink url ) ->
                    Just <|
                        Document.Link
                            attrs
                            { targetBlank = False
                            , url = url
                            , label = value
                            }

                _ ->
                    Nothing

        InlineStylePrimitive { uid, value } ->
            case
                Dict.get uid model.trackedData
                    |> Maybe.map (\td -> ( td.attrs, td.dataKind ))
            of
                Just ( attrs, InlineStyled ) ->
                    Just <|
                        Document.Text attrs value

                _ ->
                    Nothing

        TextPrimitive value ->
            Just <| Document.Text [] value

        _ ->
            Nothing


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
      , parsedInput = Ok []
      , selected = Nothing
      , cursorPos = Nothing
      , nbrCols = Nothing
      , output = []
      , setSelection = False
      , trackedData = Dict.empty
      , selectedData = Nothing
      , nextLinkId = 0
      , config =
            { width = 500
            , height = 800
            , styleSheet = defaulStyleSheet
            , containersBkgColors = False
            , customElems = Dict.empty
            , editMode = False
            , mainInterfaceHeight = 0
            , onLoadMsg = \_ -> NoOp
            , sizesDict = Dict.empty
            , zipperHandlers = Nothing
            }
      }
    , Cmd.none
    )


update msg model =
    case msg of
        TextInput s ->
            case run textBlock s of
                Ok res ->
                    let
                        newTrackedData =
                            getTrackedData res

                        newModel =
                            { model
                                | rawInput = s
                                , parsedInput = Ok res
                                , trackedData = newTrackedData
                                , selectedData =
                                    getSelectedTrackedData model.cursorPos newTrackedData
                            }
                    in
                    ( { newModel
                        | output =
                            List.filterMap (toTextBlocElement newModel) res
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
                , selectedData =
                    if s.start == s.finish then
                        getSelectedTrackedData (Just s.start) model.trackedData
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

        SetSelection ->
            ( { model | setSelection = True }
            , Cmd.none
            )

        MakeInternalLink ->
            case makeInternalLink model.rawInput model.selected model.nextLinkId of
                Nothing ->
                    ( model, Cmd.none )

                Just newRawInput ->
                    let
                        newParsedInput =
                            run textBlock newRawInput

                        newTrackedData =
                            Result.map getTrackedData newParsedInput
                                |> Result.withDefault model.trackedData
                    in
                    ( { model
                        | rawInput = newRawInput
                        , nextLinkId = model.nextLinkId + 1
                        , parsedInput = newParsedInput
                        , trackedData = newTrackedData
                      }
                    , Cmd.none
                    )

        MakeExternalLink ->
            case makeExternalLink model.rawInput model.selected model.nextLinkId of
                Nothing ->
                    ( model, Cmd.none )

                Just newRawInput ->
                    let
                        newParsedInput =
                            run textBlock newRawInput

                        newTrackedData =
                            Result.map getTrackedData newParsedInput
                                |> Result.withDefault model.trackedData
                    in
                    ( { model
                        | rawInput = newRawInput
                        , nextLinkId = model.nextLinkId + 1
                        , parsedInput = newParsedInput
                        , trackedData = newTrackedData
                      }
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
            , row
                [ spacing 30 ]
                [ customTextArea [ width fill ] model.cursorPos model.setSelection model.rawInput
                , textBlocPreview model
                ]
            , Element.paragraph [ width (maximum 500 fill) ]
                [ Element.text <| Debug.toString model.selectedData ]
            , Element.paragraph [ width (maximum 500 fill) ]
                [ Element.text <| Debug.toString model.trackedData ]
            , Element.paragraph [ width (maximum 500 fill) ]
                [ Element.text <| Debug.toString model.selected ]
            , Element.paragraph [ width (maximum 500 fill) ]
                [ Element.text <| Debug.toString model.cursorPos ]
            , Element.paragraph [ width (maximum 500 fill) ]
                [ Element.text <| Debug.toString model.parsedInput ]
            ]


interfaceView model =
    row [ spacing 10 ]
        [ Input.button buttonStyle
            { onPress = Just MakeInternalLink
            , label = html <| link2
            }
        , Input.button
            buttonStyle
            { onPress = Just MakeExternalLink
            , label = html <| Icons.externalLink
            }
        , Input.button buttonStyle
            { onPress = Nothing
            , label = html <| bold
            }
        , Input.button
            buttonStyle
            { onPress = Just SetSelection
            , label = html <| list
            }
        ]


textBlocPreview model =
    column
        [ width fill ]
        (renderTextBlock
            model.config
            [ SpacingXY 15 15
            , PaddingEach
                { bottom = 20
                , top = 20
                , left = 20
                , right = 20
                }
            , FontSize 16
            ]
            --[ padding 20
            --, spacing 15
            --, Font.family [ Font.typeface "Arial" ]
            --, Font.size 16
            --]
            model.output
        )


customTextArea attrs cursorPos setSelection rawInput =
    el attrs
        (html <|
            node "custom-textarea"
                ([ HtmlEvents.onInput TextInput
                 , HtmlEvents.on "Selection" decodeSelection
                 , HtmlEvents.on "Loaded" decodeLoaded
                 ]
                    ++ (if setSelection then
                            [ Attr.property "selection" select ]
                        else
                            []
                       )
                )
                [ textarea
                    [ Attr.style "font-family" "Arial"
                    , Attr.style "font-size" "16px"
                    , Attr.cols 60
                    , Attr.style "height" "500px"
                    , Attr.style "spellcheck" "false"
                    , Attr.value rawInput
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
    | HeadingElement Int PrimitiveMeta
    | Singleton Primitive


type Primitive
    = InternalLinkPrimitive PrimitiveMeta
    | ExternalLinkPrimitive PrimitiveMeta
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
                , succeed (\h -> Loop (h :: elems))
                    |= heading
                    |> backtrackable
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


internalLink : Parser Primitive
internalLink =
    succeed
        (\start uid val stop ->
            InternalLinkPrimitive
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
        |. keyword "lien-interne"
        |. spaces
        |= int
        |. spaces
        |. symbol ">"
        |= (chompUntil "<"
                |> getChompedString
           )
        |. keyword "</>"
        |= getOffset


externalLink : Parser Primitive
externalLink =
    succeed
        (\start uid val stop ->
            ExternalLinkPrimitive
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
        |. keyword "lien-externe"
        |. spaces
        |= int
        |. spaces
        |. symbol ">"
        |= (chompUntil "<"
                |> getChompedString
           )
        |. keyword "</>"
        |= getOffset


heading : Parser Element
heading =
    succeed
        (\start level uid val stop ->
            HeadingElement level
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
        |= int
        |. spaces
        |= int
        |. spaces
        |. symbol ">"
        |= (chompUntil "<"
                |> getChompedString
           )
        |. keyword "</>"
        |= getOffset
        |. oneOf
            [ end
            , spaces
            ]


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
        [ backtrackable internalLink
        , backtrackable externalLink
        , inlineStyle
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



--getLinks : List Primitive -> List PrimitiveMeta
--getLinks =
--    List.filterMap
--        (\p ->
--            case p of
--                LinkPrimitive lm ->
--                    Just lm
--                _ ->
--                    Nothing
--        )
--type alias SortedTrackedData =
--    { links : List Data
--    , headings : List Data
--    , styled : List Data
--    }


type TrackedDataKind
    = InternalLink String
    | ExternalLink String
    | Heading Int
    | InlineStyled


type alias TrackedData =
    { meta : PrimitiveMeta
    , attrs : List DocAttribute
    , dataKind : TrackedDataKind
    }


getTrackedData : List Element -> Dict Int TrackedData
getTrackedData elems =
    let
        getTrackedPrim =
            \p ->
                case p of
                    InternalLinkPrimitive pm ->
                        Just
                            { meta = pm
                            , attrs = []
                            , dataKind = InternalLink ""
                            }

                    ExternalLinkPrimitive pm ->
                        Just
                            { meta = pm
                            , attrs = []
                            , dataKind = ExternalLink ""
                            }

                    InlineStylePrimitive pm ->
                        Just
                            { meta = pm
                            , attrs = []
                            , dataKind = InlineStyled
                            }

                    _ ->
                        Nothing
    in
    List.filterMap
        (\e ->
            case e of
                HeadingElement level meta ->
                    Just
                        [ { meta = meta
                          , attrs = []
                          , dataKind = Heading level
                          }
                        ]

                ParagraphElement xs ->
                    Just <| List.filterMap getTrackedPrim xs

                UListElement xs ->
                    Just <| List.filterMap getTrackedPrim xs

                Singleton p ->
                    getTrackedPrim p
                        |> Maybe.map (\td -> [ td ])
        )
        elems
        |> List.concat
        |> List.map (\td -> ( td.meta.uid, td ))
        |> Dict.fromList


getSelectedTrackedData : Maybe Int -> Dict Int TrackedData -> Maybe TrackedData
getSelectedTrackedData mbCursorPos trackedDataDict =
    case mbCursorPos of
        Nothing ->
            Nothing

        Just cursorPos ->
            let
                isCursorInTrackedData td =
                    cursorPos
                        >= td.meta.start
                        && cursorPos
                        < td.meta.stop
            in
            Dict.toList trackedDataDict
                |> List.map Tuple.second
                |> List.filter isCursorInTrackedData
                |> List.head


makeInternalLink rawInput selection nextLinkId =
    makeTag rawInput selection nextLinkId "lien-interne"


makeExternalLink rawInput selection nextLinkId =
    makeTag rawInput selection nextLinkId "lien-externe"


makeTag rawInput selection nextUid tagname =
    case selection of
        Nothing ->
            Nothing

        Just { start, finish, sel } ->
            let
                firstHalf =
                    String.left start rawInput

                secondHalf =
                    String.dropLeft finish rawInput

                newLink =
                    " <"
                        ++ tagname
                        ++ " "
                        ++ String.fromInt nextUid
                        ++ ">"
                        ++ sel
                        ++ "</> "
            in
            Just (firstHalf ++ newLink ++ secondHalf)
