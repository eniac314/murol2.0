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
    , output : List TextBlockElement
    , setSelection : Bool
    , trackedData : Dict Int TrackedData
    , currentTrackedData : Maybe TrackedData
    , nextUid : Int
    , config : Config Msg
    }


type Msg
    = TextInput String
    | InsertTrackingTag TrackedDataKind
    | NewSelection Selection
    | SetSelection
    | NoOp


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
      , parsedInput = Ok []
      , selected = Nothing
      , cursorPos = Nothing
      , output = []
      , setSelection = False
      , trackedData = Dict.empty
      , currentTrackedData = Nothing
      , nextUid = 0
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
                                , currentTrackedData =
                                    getSelectedTrackedData model.cursorPos newTrackedData
                                , nextUid = findNextAvailableUid newTrackedData
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

        InsertTrackingTag tdKind ->
            case insertTrackingTag model.rawInput model.selected model.nextUid tdKind of
                Nothing ->
                    ( model, Cmd.none )

                Just newRawInput ->
                    let
                        newParsedInput =
                            run textBlock newRawInput

                        newTrackedData =
                            Result.map getTrackedData newParsedInput
                                |> Result.withDefault model.trackedData

                        newModel =
                            { model
                                | rawInput = newRawInput
                                , parsedInput = newParsedInput
                                , trackedData = newTrackedData
                                , nextUid = findNextAvailableUid newTrackedData
                            }
                    in
                    ( { newModel
                        | output =
                            Result.map
                                (List.filterMap
                                    (toTextBlocElement newModel)
                                )
                                newParsedInput
                                |> Result.withDefault model.output
                      }
                    , Cmd.none
                    )

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
                , currentTrackedData =
                    if s.start == s.finish then
                        getSelectedTrackedData (Just s.start) model.trackedData
                    else
                        Nothing
              }
            , Cmd.none
            )

        SetSelection ->
            ( { model | setSelection = True }
            , Cmd.none
            )

        NoOp ->
            ( model, Cmd.none )



-------------------------------------------------------------------------------
-------------------
-- View funcions --
-------------------


iconSize =
    18


view model =
    Element.layout [] <|
        column
            [ padding 15
            , spacing 15
            ]
            [ interfaceView model
            , row
                [ spacing 30 ]
                [ column
                    [ alignTop
                    , spacing 20
                    ]
                    [ customTextArea
                        [ width fill
                        ]
                        model.cursorPos
                        model.setSelection
                        model.rawInput
                    , Element.paragraph [ width (maximum 500 fill) ]
                        [ Element.text <| Debug.toString model.currentTrackedData ]
                    , Element.paragraph [ width (maximum 500 fill) ]
                        [ Element.text <| Debug.toString model.trackedData ]
                    , Element.paragraph [ width (maximum 500 fill) ]
                        [ Element.text <| Debug.toString model.selected ]
                    , Element.paragraph [ width (maximum 500 fill) ]
                        [ Element.text <| Debug.toString model.cursorPos ]
                    , Element.paragraph [ width (maximum 500 fill) ]
                        [ Element.text <| Debug.toString model.parsedInput ]
                    ]
                , textBlocPreview model
                ]
            ]


interfaceView model =
    row [ spacing 10 ]
        [ Input.button buttonStyle
            { onPress = Just (InsertTrackingTag <| InternalLink "")
            , label = html <| link2 iconSize
            }
        , Input.button
            buttonStyle
            { onPress = Just (InsertTrackingTag <| ExternalLink "")
            , label = html <| Icons.externalLink iconSize
            }
        , Input.button buttonStyle
            { onPress = Nothing
            , label = html <| bold iconSize
            }
        , Input.button
            buttonStyle
            { onPress = Just SetSelection
            , label = html <| list iconSize
            }
        ]


customTextArea attrs cursorPos setSelection rawInput =
    el attrs
        (html <|
            node "custom-textarea"
                ([ HtmlEvents.onInput TextInput
                 , HtmlEvents.on "Selection" decodeSelection
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


textBlocPreview model =
    column
        [ width fill
        , spacing 20
        , alignTop
        ]
        (renderTextBlock
            model.config
            [ FontSize 16 ]
            model.output
            ++ [ Element.paragraph [ width (maximum 500 fill) ]
                    [ Element.text <| Debug.toString model.output ]
               ]
        )



-------------------------------------------------------------------------------
----------------------
-- TextBlock Parser --
----------------------


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



-- NOTE: There is no text Parser, WordPrimitive are transformed into
-- TextPrimitive by the groupWordsIntoText function.


word : Parser Primitive
word =
    succeed identity
        |. spaces
        |= (chompWhile (\c -> not <| c == ' ' || c == '\t' || c == '\n')
                |> getChompedString
           )
        |> Parser.map WordPrimitive


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



-- misc


break : Parser ()
break =
    succeed ()
        |. reallyspaces
        |. keyword "\n"
        |. spaces
        |> backtrackable


reallyspaces : Parser ()
reallyspaces =
    chompWhile (\c -> c == ' ')



-------------------------------------------------------------------------------
---------------------------
-- Tracked Data functions--
---------------------------
-- NOTE: This exists in order to allow DocAttributes to be affected to some
-- primitives. This wat these DocAttributes are stored in the model and not
-- in the input string in order to reduce visual clutter.


type alias TrackedData =
    { meta : PrimitiveMeta
    , attrs : List DocAttribute
    , dataKind : TrackedDataKind
    }


type TrackedDataKind
    = InternalLink String
    | ExternalLink String
    | Heading Int
    | InlineStyled


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


findNextAvailableUid : Dict Int TrackedData -> Int
findNextAvailableUid trackedData =
    Dict.keys trackedData
        |> List.foldr max 0
        |> (\n -> n + 1)



-------------------------------------------------------------------------------
-----------------------
-- makeTag functions --
-----------------------
--NOTE: These function insert tracked tag into the input string


insertTrackingTag : String -> Maybe Selection -> Int -> TrackedDataKind -> Maybe String
insertTrackingTag rawInput selection nextUid tdKind =
    case tdKind of
        InternalLink _ ->
            insertTagHelper rawInput selection nextUid "lien-interne"

        ExternalLink _ ->
            insertTagHelper rawInput selection nextUid "lien-externe"

        Heading level ->
            insertTagHelper
                rawInput
                selection
                nextUid
                ("titre-" ++ String.fromInt level)

        InlineStyled ->
            insertTagHelper rawInput selection nextUid "style"


insertTagHelper : String -> Maybe Selection -> Int -> String -> Maybe String
insertTagHelper rawInput selection nextUid tagname =
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
                        ++ "> "
                        ++ sel
                        ++ " </> "
            in
            Just (firstHalf ++ newLink ++ secondHalf)



-------------------------------------------------------------------------------
---------------------------------
-- toTextBlocElement functions --
---------------------------------


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
                Just ( attrs, ExternalLink url ) ->
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



-------------------------------------------------------------------------------
----------
-- Misc --
----------


groupWordsIntoText : List Primitive -> List Primitive
groupWordsIntoText prims =
    -- NOTE: this functions concatenate all adjacent WordPrimitive primitives into
    -- TextPrimitive.
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


decodeSelection : Decode.Decoder Msg
decodeSelection =
    Decode.at [ "target", "selection" ]
        (Decode.map3 Selection
            (Decode.field "start" Decode.int)
            (Decode.field "finish" Decode.int)
            (Decode.field "sel" Decode.string)
            |> Decode.map NewSelection
        )


buttonStyle =
    [ Border.rounded 5
    , Font.center
    , centerY
    , paddingXY 5 3
    , mouseOver
        [ Background.color (rgb 0.9 0.9 0.9) ]
    ]



--<titre-2 9> un joli titre </>
--<titre-2 0> un joli titre </><titre-2 0> un joli titre </><titre-2 0> un joli titre </><titre-2 0> un joli titre </>
--Le bourg de Murol est implanté dans un écrin de verdure à 850 mètres d'altitude, dans la vallée de la Couze Chambon, sur le versant Est du massif du Sancy.
--Le bourg de Murol est implanté dans un écrin de verdure à 850 mètres d'altitude, dans la vallée de la Couze Chambon, sur le versant Est du massif du Sancy.
--Enchâssé entre le volcan boisé du
--Tartaret le promontoire du
--château de Murol et le puy de  <lien-externe 0> Bessolles</> , le village vous ravira par ses sites remarquables et pittoresques.
--Au pied du  <lien-interne 0> château</>,  découvrez le parc arboré du Prélong où se trouvent le
--musée des Peintres de l’Ecole de Murols et le musée archéologique.
