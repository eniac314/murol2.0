port module PageEditor.EditorPlugins.TrixTextBlockPlugin exposing (Model, Msg, init, newsEditorView, parserOutput, subscriptions, textBlockPreview, update, view)

import Auth.AuthPlugin exposing (LogInfo)
import Browser exposing (element)
import Browser.Events exposing (onMouseDown)
import Dict exposing (..)
import Document.Document as Document exposing (..)
import Document.DocumentViews.DocumentView exposing (renderTextBlock)
import Document.DocumentViews.RenderConfig exposing (Config)
import Document.DocumentViews.StyleSheets exposing (StyleSheet, defaultStyleSheet, defaultStyleSheetCss)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Keyed as Keyed
import Element.Lazy as Lazy
import Element.Region as Region
import FileExplorer.FileExplorer as FileExplorer
import Hex exposing (fromString)
import Html as Html
import Html.Attributes as HtmlAttr
import Html.Events as HtmlEvents exposing (on)
import Html.Parser exposing (..)
import Html.Parser.Util exposing (toVirtualDom)
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.Icons as Icons exposing (..)
import Json.Decode as D
import Json.Encode as E
import PageEditor.Internals.DocumentEditorHelpers exposing (..)
import PageTreeEditor.PageTreeEditor as PageTreeEditor
import Set exposing (..)
import Time exposing (Zone)
import UUID exposing (toString)


port activateAttribute : E.Value -> Cmd msg


port deactivateAttributes : E.Value -> Cmd msg


port insertHtml : E.Value -> Cmd msg


port getSelection : () -> Cmd msg


port selection : (E.Value -> msg) -> Sub msg


port trixReady : (E.Value -> msg) -> Sub msg


parserOutput : Model msg -> { tbElems : List TextBlockElement, attrs : List DocAttribute }
parserOutput model =
    { tbElems = model.output
    , attrs = model.wholeTextBlocAttr
    }


type alias Model msg =
    { htmlContent : HtmlContent
    , selection : Maybe Selection
    , output : List TextBlockElement
    , nextUid : Int
    , wholeTextBlocAttr : List DocAttribute
    , globalAttributes : Dict String String
    , headingLevel : Maybe Int
    , openedWidget : Maybe Widget
    , externalMsg : Msg -> msg
    }


type alias HtmlContent =
    { html : String
    , text : String
    }


type alias Selection =
    { start : Int
    , end : Int
    , attrs : Dict String String
    }


type Widget
    = FontColorPicker
    | BackgroundColorPicker
    | InternalLinks
    | ImagePicker
    | DocPicker


subscriptions model =
    Sub.batch
        [ case model.openedWidget of
            Just FontColorPicker ->
                Browser.Events.onMouseDown (outsideTargetHandler "fontColorPicker" Close)

            Just BackgroundColorPicker ->
                Browser.Events.onMouseDown (outsideTargetHandler "backgroundColorPicker" Close)

            Just InternalLinks ->
                Browser.Events.onMouseDown (outsideTargetHandler "internalLinkPicker" Close)

            _ ->
                Sub.none
        , selection GotSelection
        , trixReady (always LoadContentInTrix)
        ]


type Msg
    = GetHtmlContent HtmlContent
    | GetSelection
    | GotSelection E.Value
    | LoadContentInTrix
    | OpenFontColorPicker
    | OpenBackgroundColorPicker
    | SetTextColor String
    | SetBackgroundColor String
    | SetFont String
    | SetFontSize Int
    | SetGlobalAttribute Bool ( String, String )
    | UndoStyle
    | Close
    | SaveAndQuit
    | Quit
    | NoOp


init :
    List DocAttribute
    -> Maybe (List TextBlockElement)
    -> (Msg -> msg)
    -> ( Model msg, Cmd msg )
init attrs mbInput externalMsg =
    ( { htmlContent = HtmlContent "" ""
      , selection = Nothing
      , output =
            mbInput
                |> Maybe.withDefault []
      , nextUid = 0
      , wholeTextBlocAttr = attrs
      , globalAttributes = Dict.empty
      , headingLevel = Nothing
      , openedWidget = Nothing
      , externalMsg = externalMsg
      }
    , Cmd.none
    )


update :
    { config | pageTreeEditor : PageTreeEditor.Model msg }
    -> Msg
    -> Model msg
    -> ( Model msg, Cmd msg, Maybe (EditorPluginResult ( List TextBlockElement, List DocAttribute )) )
update config msg model =
    case msg of
        GetHtmlContent content ->
            let
                output =
                    [ TrixHtml content.html ]

                --Html.Parser.run content.html
                --    |> Result.map (List.map toTextBlockElements)
                --    |> Result.withDefault []
            in
            ( { model
                | htmlContent = content
                , output = output
              }
            , getSelection ()
            , Nothing
            )

        GetSelection ->
            ( model
            , getSelection ()
            , Nothing
            )

        GotSelection value ->
            case D.decodeValue decodeSelection value of
                Ok ( sel, ids ) ->
                    ( { model
                        | selection = Just sel

                        --, attachmentsIds = ids
                      }
                    , Cmd.none
                    , Nothing
                    )

                Err _ ->
                    ( model
                    , Cmd.none
                    , Nothing
                    )

        LoadContentInTrix ->
            ( model
            , model.output
                |> List.concatMap textBlockElementToNode
                |> List.map Html.Parser.nodeToString
                |> String.join ""
                |> (\html ->
                        E.object
                            [ ( "selectionStart", E.int 0 )
                            , ( "selectionEnd", E.int 0 )
                            , ( "tagName", E.string "initial load" )
                            , ( "html", E.string html )
                            ]
                   )
                |> insertHtml
            , Nothing
            )

        OpenFontColorPicker ->
            ( { model
                | openedWidget =
                    if model.openedWidget == Just FontColorPicker then
                        Nothing

                    else
                        Just FontColorPicker
              }
            , Cmd.none
            , Nothing
            )

        OpenBackgroundColorPicker ->
            ( { model
                | openedWidget =
                    if model.openedWidget == Just BackgroundColorPicker then
                        Nothing

                    else
                        Just BackgroundColorPicker
              }
            , Cmd.none
            , Nothing
            )

        SetTextColor color ->
            case model.selection of
                Just { start, end, attrs } ->
                    let
                        data =
                            E.object
                                [ ( "selectionStart", E.int start )
                                , ( "selectionEnd", E.int end )
                                , ( "attribute", E.string "foregroundColor" )
                                , ( "value", E.string ("#" ++ (Dict.get color webColors |> Maybe.withDefault "000000")) )
                                ]
                    in
                    ( { model | openedWidget = Nothing }
                    , activateAttribute data
                    , Nothing
                    )

                _ ->
                    ( model, Cmd.none, Nothing )

        SetBackgroundColor color ->
            case model.selection of
                Just { start, end, attrs } ->
                    let
                        data =
                            E.object
                                [ ( "selectionStart", E.int start )
                                , ( "selectionEnd", E.int end )
                                , ( "attribute", E.string "backgroundColor" )
                                , ( "value", E.string ("#" ++ (Dict.get color webColors |> Maybe.withDefault "000000")) )
                                ]
                    in
                    ( { model | openedWidget = Nothing }
                    , activateAttribute data
                    , Nothing
                    )

                _ ->
                    ( model, Cmd.none, Nothing )

        SetFont font ->
            case model.selection of
                Just { start, end, attrs } ->
                    let
                        data =
                            E.object
                                [ ( "selectionStart", E.int start )
                                , ( "selectionEnd", E.int end )
                                , ( "attribute", E.string "textFont" )
                                , ( "value", E.string font )
                                ]
                    in
                    ( { model | openedWidget = Nothing }
                    , activateAttribute data
                    , Nothing
                    )

                _ ->
                    ( model, Cmd.none, Nothing )

        SetFontSize n ->
            ( model, Cmd.none, Nothing )

        SetGlobalAttribute toogle attr ->
            ( model, Cmd.none, Nothing )

        --( { model | globalAttributes = updateAttribute toogle attr model.globalAttributes }, Cmd.none )
        UndoStyle ->
            case model.selection of
                Just { start, end, attrs } ->
                    let
                        data =
                            E.object
                                [ ( "selectionStart", E.int start )
                                , ( "selectionEnd", E.int end )
                                , ( "attributes"
                                  , Dict.keys attrs
                                        |> E.list E.string
                                  )
                                ]
                    in
                    ( { model | openedWidget = Nothing }
                    , deactivateAttributes data
                    , Nothing
                    )

                _ ->
                    ( model
                    , Cmd.none
                    , Nothing
                    )

        Close ->
            ( { model
                | openedWidget = Nothing
              }
            , Cmd.none
            , Nothing
            )

        SaveAndQuit ->
            ( model
            , Cmd.none
            , Just <|
                EditorPluginData
                    ( model.output
                    , model.wholeTextBlocAttr
                    )
            )

        Quit ->
            ( model
            , Cmd.none
            , Just EditorPluginQuit
            )

        --NoOp ->
        --( model, Cmd.none, Nothing )
        _ ->
            ( model, Cmd.none, Nothing )


view :
    { a
        | fileExplorer : FileExplorer.Model msg
        , pageTreeEditor : PageTreeEditor.Model msg
        , logInfo : Auth.AuthPlugin.LogInfo
        , zone : Time.Zone
    }
    -> Config msg
    -> Model msg
    -> Element.Element msg
view config renderConfig model =
    column
        [ height fill
        , width fill
        ]
        [ embeddedStyleSheet config renderConfig model
        , column
            [ padding 15
            , spacing 15
            , scrollbarY
            , height fill
            , width fill
            ]
            [ editor model
            , textBlockPreview model renderConfig
            , row
                [ spacing 15
                , Font.size 16
                , paddingEach
                    { top = 0
                    , bottom = 15
                    , right = 0
                    , left = 0
                    }
                ]
                [ Input.button (buttonStyle True)
                    { onPress = Just (model.externalMsg Quit)
                    , label = text "Quitter"
                    }
                , Input.button (buttonStyle True)
                    { onPress = Just (model.externalMsg SaveAndQuit)
                    , label = text "Valider et Quitter"
                    }
                ]
            ]
        ]


embeddedStyleSheet config renderConfig model =
    let
        templateStylesheet =
            let
                tagStyle ( tag, styles ) =
                    styles
                        |> List.map (\( a, v ) -> a ++ ":" ++ v ++ ";")
                        |> String.join " "
                        |> (\s -> ".trix-content-editor " ++ tag ++ "{" ++ s ++ "}")
            in
            Dict.toList (defaultStyleSheetCss renderConfig)
                |> List.map tagStyle
                |> String.join " "

        styleSheet =
            Html.div
                []
                [ Html.node "style"
                    []
                    [ Html.text <|
                        templateStylesheet
                            ++ " .trix-content{"
                            ++ stringifyAttributes model.globalAttributes
                            ++ """ 
                        
                        }
                    """
                            ++ """ 

                            .trix-content p {
                                display: block;
                                margin: 0;
                                padding : 0;
                            }

                            .trix-content-editor figure{
                                
                            }
                            .trix-content-editor figure:nth-of-type(2){
                                opacity: 0.5;
                                float: left;
                                background-color: red;
                                width: auto;
                            }
                    """
                    ]
                ]
    in
    el
        []
        (html <| styleSheet)


stringifyAttributes : Dict String String -> String
stringifyAttributes attributes =
    Dict.toList attributes
        |> List.map (\( attr, value ) -> attr ++ ": " ++ value ++ ";")
        |> String.join " "


editor model =
    column
        [ spacing 10
        ]
        [ trixEditor model
        , paragraph [] [ text <| model.htmlContent.html ]
        ]


trixEditor model =
    Element.map model.externalMsg <|
        column
            [ spacing 10 ]
            [ customToolbar model
            , paragraph
                [ Font.family [ Font.typeface "Arial" ]
                , Font.size 16
                , width (px 700)
                ]
                [ html <|
                    Html.div
                        []
                        [ Html.node "trix-toolbar"
                            [ HtmlAttr.id "trix-toolbar" ]
                            []
                        , Html.node "trix-editor"
                            [ on "trix-change" (D.map GetHtmlContent decodeEditorMarkup)
                            , on "trix-selection-change" (D.map (always GetSelection) (D.succeed ()))
                            , HtmlAttr.class "trix-content"
                            , HtmlAttr.class "trix-content-editor"
                            , HtmlAttr.attribute "toolbar" "trix-toolbar"
                            ]
                            []
                        ]
                ]
            ]


customToolbar model =
    let
        selectionCollapsed =
            case model.selection of
                Nothing ->
                    Nothing

                Just { start, end } ->
                    Just (start == end)

        canUpdateGlobalAttr =
            case model.selection of
                Nothing ->
                    True

                Just { start, end } ->
                    start == end

        selectionAttrs =
            Maybe.map .attrs model.selection

        fontColor =
            Maybe.andThen (Dict.get "foregroundColor") selectionAttrs
                |> Maybe.map (String.dropLeft 1)
                |> Maybe.andThen (\hex -> Dict.get hex webColorsReversed)

        backgroundColor =
            Maybe.andThen (Dict.get "backgroundColor") selectionAttrs
                |> Maybe.map (String.dropLeft 1)
                |> Maybe.andThen (\hex -> Dict.get hex webColorsReversed)

        textFont =
            Maybe.andThen (Dict.get "textFont") selectionAttrs

        fontOptionView selectedFont f =
            Html.option
                [ HtmlAttr.value f
                , HtmlAttr.selected (selectedFont == (Just <| f))
                ]
                [ Html.text f ]

        iconSize =
            18
    in
    row
        [ spacing 10
        , width fill
        ]
        [ colorPicker
            "fontColorPicker"
            True
            (model.openedWidget == Just FontColorPicker)
            fontColor
            OpenFontColorPicker
            SetTextColor
            (el [] (html <| Icons.penTool iconSize))
        , colorPicker
            "backgroundColorPicker"
            True
            (model.openedWidget == Just BackgroundColorPicker)
            backgroundColor
            OpenBackgroundColorPicker
            SetBackgroundColor
            (el [] (html <| Icons.droplet iconSize))
        , el
            []
            (html <|
                Html.select
                    [ HtmlEvents.onInput SetFont
                    , HtmlAttr.disabled (selectionCollapsed == Just True || selectionCollapsed == Nothing)
                    ]
                    (List.map
                        (fontOptionView
                            textFont
                        )
                        (List.sort fonts)
                    )
            )

        --, linkPicker
        --    "internalLinkPicker"
        --    True
        --    --(canStyleSelection model)
        --    (model.openedWidget == Just InternalLinks)
        --    Nothing
        --    OpenInternalLinks
        --    InsertInternalLink
        --    [ "home", "contact" ]
        , row
            [ spacing 10 ]
            [ Input.button
                (buttonStyle canUpdateGlobalAttr)
                { onPress =
                    if canUpdateGlobalAttr then
                        Just (SetGlobalAttribute True ( "text-align", "left" ))

                    else
                        Nothing
                , label =
                    el [] (html <| Icons.alignLeft iconSize)
                }
            , Input.button
                (buttonStyle canUpdateGlobalAttr)
                { onPress =
                    if canUpdateGlobalAttr then
                        Just (SetGlobalAttribute True ( "text-align", "center" ))

                    else
                        Nothing
                , label =
                    el [] (html <| alignCenter iconSize)
                }
            , Input.button
                (buttonStyle canUpdateGlobalAttr)
                { onPress =
                    if canUpdateGlobalAttr then
                        Just (SetGlobalAttribute True ( "text-align", "right" ))

                    else
                        Nothing
                , label =
                    el [] (html <| Icons.alignRight iconSize)
                }
            , Input.button
                (buttonStyle canUpdateGlobalAttr)
                { onPress =
                    if canUpdateGlobalAttr then
                        Just (SetGlobalAttribute True ( "text-align", "justify" ))

                    else
                        Nothing
                , label =
                    el [] (html <| alignJustify iconSize)
                }
            ]
        , let
            canUndoStyle =
                selectionAttrs /= Just Dict.empty
          in
          Input.button
            (Element.alignRight :: buttonStyle canUndoStyle)
            { onPress =
                if canUndoStyle then
                    Just UndoStyle

                else
                    Nothing
            , label =
                text "undo style"
            }

        --config.pageList
        ]


textBlockPreview : Model msg -> Config msg -> Element.Element msg
textBlockPreview model config =
    column
        [ width (minimum 500 (maximum 700 fill))
        , height (maximum 500 fill)
        , scrollbarY
        , spacing 20
        , alignTop
        , Border.shadow
            { offset = ( 4, 4 )
            , size = 5
            , blur = 10
            , color = rgba 0 0 0 0.16
            }
        , padding 15
        , Font.family [ Font.typeface "Arial" ]
        , Font.size 16
        ]
        (renderTextBlock
            config
            { uid = -1
            , docStyleId = Nothing
            , htmlId = Nothing
            , classes = Set.empty
            }
            model.wholeTextBlocAttr
            model.output
        )


newsEditorView config model =
    Element.none


interfaceView :
    { a
        | fileExplorer : FileExplorer.Model msg
        , logInfo : Auth.AuthPlugin.LogInfo
        , pageTreeEditor : PageTreeEditor.Model msg
        , zone : Time.Zone
    }
    -> Bool
    -> Model msg
    -> Element.Element msg
interfaceView config isNewsView model =
    Element.none


decodeEditorMarkup : D.Decoder HtmlContent
decodeEditorMarkup =
    D.map2 HtmlContent
        (D.at [ "target", "value" ] D.string)
        (D.at [ "target", "textContent" ] D.string)


decodeSelection =
    let
        decodeAttrValue =
            D.oneOf
                [ D.string
                , D.int
                    |> D.map String.fromInt
                , D.bool
                    |> D.andThen
                        (\b ->
                            if b then
                                D.succeed "true"

                            else
                                D.succeed "false"
                        )
                , D.succeed "unknown"
                ]
    in
    D.map4 (\start end attrs ids -> ( Selection start end attrs, ids ))
        (D.field "start" D.int)
        (D.field "end" D.int)
        (D.field "attrs" (D.map Dict.fromList (D.keyValuePairs decodeAttrValue)))
        (D.field "attachmentsIds" (D.list D.int))



-------------------------------------------------------------------------------


extractValue : String -> List ( String, String ) -> Maybe String
extractValue attribute attrs =
    case
        List.filter (\( a, v ) -> a == attribute) attrs
            |> List.head
    of
        Just ( a, v ) ->
            Just v

        Nothing ->
            Nothing


textBlockElementToNode : TextBlockElement -> List Html.Parser.Node
textBlockElementToNode tbe =
    case tbe of
        Paragraph attrs prims ->
            [ Element "p" (List.concatMap docAttrToCss attrs) (List.map textBlockPrimToNode prims) ]

        UList attrs lis ->
            [ Element "ul"
                (List.concatMap docAttrToCss attrs)
                (List.map (\li -> Element "li" [] (List.map textBlockPrimToNode li)) lis)
            ]

        Heading attrs ( 1, s ) ->
            [ Element "h1" (List.concatMap docAttrToCss attrs) [ Html.Parser.Text s ] ]

        Heading attrs ( 2, s ) ->
            [ Element "h2" (List.concatMap docAttrToCss attrs) [ Html.Parser.Text s ] ]

        Heading attrs ( 3, s ) ->
            [ Element "h3" (List.concatMap docAttrToCss attrs) [ Html.Parser.Text s ] ]

        TBPrimitive prim ->
            [ textBlockPrimToNode prim ]

        TrixHtml html ->
            Html.Parser.run html
                |> Result.withDefault []

        _ ->
            []


textBlockPrimToNode : TextBlockPrimitive -> Html.Parser.Node
textBlockPrimToNode tbp =
    case tbp of
        Document.Text [] s ->
            Html.Parser.Text s

        Document.Text attrs s ->
            Element "span" (List.concatMap docAttrToCss attrs) [ Html.Parser.Text s ]

        Link attrs { targetBlank, url, label } ->
            Element "a"
                (List.concatMap docAttrToCss attrs
                    ++ [ ( "href", url )
                       ]
                    ++ (if targetBlank then
                            [ ( "target", "blank" ) ]

                        else
                            []
                       )
                )
                [ Html.Parser.Text label ]


cssToDocAttr : ( String, String ) -> Document.DocAttribute
cssToDocAttr attr =
    let
        parseRgb s =
            let
                extractColValue color =
                    String.toFloat color
                        |> Maybe.withDefault 0
                        |> (\f -> f / 255)
            in
            case
                String.dropLeft 4 s
                    |> String.dropRight 1
                    |> String.split ","
            of
                r :: g :: b :: [] ->
                    DocColor (extractColValue r) (extractColValue g) (extractColValue b)

                _ ->
                    DocColor 0 0 0

        parsePxLength s =
            String.dropRight 2 s
                |> String.toInt
                |> Maybe.withDefault 0
    in
    case attr of
        ( "float", "right" ) ->
            AlignRight

        ( "float", "left" ) ->
            AlignLeft

        ( "background-color", color ) ->
            BackgroundColor (parseRgb color)

        ( "width", "100%" ) ->
            WidthFill

        ( "width", n ) ->
            Width (parsePxLength n)

        ( "height", n ) ->
            Height (parsePxLength n)

        ( "font-family", font ) ->
            Font font

        ( "color", color ) ->
            FontColor (parseRgb color)

        ( "font-size", n ) ->
            FontSize (parsePxLength n)

        ( "text-align", "left" ) ->
            FontAlignLeft

        ( "text-align", "right" ) ->
            FontAlignRight

        ( "text-align", "center" ) ->
            Center

        ( "text-align", "justify" ) ->
            Justify

        ( "font-weight", "bold" ) ->
            Bold

        ( "font-weight", "italic" ) ->
            Italic

        ( attribute, value ) ->
            Other ( attribute, value )


docAttrToCss : Document.DocAttribute -> List ( String, String )
docAttrToCss attr =
    case attr of
        PaddingEach padding ->
            []

        SpacingXY x y ->
            []

        AlignRight ->
            [ ( "float", "right" ) ]

        AlignLeft ->
            [ ( "float", "left" ) ]

        Pointer ->
            []

        BackgroundColor (DocColor r g b) ->
            let
                ( r_, g_, b_ ) =
                    ( String.fromInt (round r * 255)
                    , String.fromInt (round g * 255)
                    , String.fromInt (round b * 255)
                    )
            in
            [ ( "background-color", "rgb(" ++ r_ ++ "," ++ g_ ++ "," ++ b_ ++ ")" ) ]

        WidthFill ->
            [ ( "width", "100%" ) ]

        WidthShrink ->
            []

        Width n ->
            [ ( "width", String.fromInt n ++ "px" ) ]

        Height n ->
            [ ( "height", String.fromInt n ++ "px" ) ]

        FillPortion n ->
            []

        Border ->
            [ ( "border-style", "solid" )
            , ( "border-width", "1px" )
            , ( "border-color", "rgb(127,127,127)" )
            ]

        Font font ->
            [ ( "font-family", font ) ]

        FontColor (DocColor r g b) ->
            let
                ( r_, g_, b_ ) =
                    ( String.fromInt (round r * 255)
                    , String.fromInt (round g * 255)
                    , String.fromInt (round b * 255)
                    )
            in
            [ ( "color", "rgb(" ++ r_ ++ "," ++ g_ ++ "," ++ b_ ++ ")" ) ]

        FontSize n ->
            [ ( "font-size", String.fromInt n ++ "px" ) ]

        FontAlignLeft ->
            [ ( "text-align", "left" ) ]

        FontAlignRight ->
            [ ( "text-align", "right" ) ]

        Center ->
            [ ( "text-align", "center" ) ]

        Justify ->
            [ ( "text-align", "justify" ) ]

        Bold ->
            [ ( "font-weight", "bold" ) ]

        Italic ->
            [ ( "font-style", "italic" ) ]

        Other attrs ->
            [ attrs ]

        ZipperAttr n handler ->
            []



-------------------------------------------------------------------------------
---------------------------
-- Outside click decoder --
---------------------------


outsideTargetHandler : String -> msg -> D.Decoder msg
outsideTargetHandler targetId handler =
    D.field "target" (isOutsideTarget targetId)
        |> D.andThen
            (\isOutside ->
                if isOutside then
                    D.succeed handler

                else
                    D.fail "inside target"
            )


isOutsideTarget targetId =
    D.oneOf
        [ D.field "id" D.string
            |> D.andThen
                (\id ->
                    if targetId == id then
                        -- found match by id
                        D.succeed False

                    else
                        -- try next decoder
                        D.fail "continue"
                )
        , D.lazy (\_ -> D.field "parentNode" (isOutsideTarget targetId))

        -- fallback if all previous decoders failed
        , D.succeed True
        ]



-------------------------------------------------------------------------------
---------------------------------------
-- Color functions  and color picker --
---------------------------------------


colorPicker :
    String
    -> Bool
    -> Bool
    -> Maybe String
    -> Msg
    -> (String -> Msg)
    -> Element Msg
    -> Element.Element Msg
colorPicker id isActive colorPickerOpen currentColor openMsg handler label =
    let
        currentColor_ =
            currentColor
                |> Maybe.andThen (\c -> Dict.get c webColors)
                |> Maybe.map hexToColor
                |> Maybe.withDefault (rgb 1 1 1)

        colorPanView ( colname, colhex ) =
            el
                [ width (px 14)
                , height (px 14)
                , Background.color (hexToColor colhex)
                , Border.width 1
                , Border.color (rgb 0 0 0)
                , pointer
                , mouseOver
                    [ Border.color (rgb 0.9 0.9 0.9) ]
                , Events.onClick (handler colname)
                ]
                Element.none

        colors =
            chunks 12 (Dict.toList webColors)
                |> List.map
                    (\r ->
                        row [ spacing 3 ]
                            (List.map colorPanView r)
                    )
    in
    el
        [ below <|
            el
                [ Background.color (rgb 0.95 0.95 0.95) ]
                (if colorPickerOpen then
                    column
                        [ spacing 3
                        , padding 10
                        ]
                        colors

                 else
                    Element.none
                )
        , htmlAttribute <| HtmlAttr.id id
        ]
        (Input.button
            (buttonStyle isActive)
            { onPress =
                if isActive then
                    Just openMsg

                else
                    Nothing
            , label =
                row [ spacing 10 ]
                    [ label
                    , el
                        [ width (px 14)
                        , height (px 14)
                        , Background.color currentColor_
                        , Border.width 1
                        , Border.color (rgb 0 0 0)
                        ]
                        Element.none
                    ]
            }
        )


hexToColor : String -> Color
hexToColor hexColor =
    let
        hexColor_ =
            String.toLower hexColor

        red =
            String.left 2 hexColor_
                |> Hex.fromString
                |> Result.withDefault 0
                |> toFloat

        green =
            String.dropLeft 2 hexColor_
                |> String.left 2
                |> Hex.fromString
                |> Result.withDefault 0
                |> toFloat

        blue =
            String.dropLeft 4 hexColor_
                |> String.left 2
                |> Hex.fromString
                |> Result.withDefault 0
                |> toFloat
    in
    rgb (red / 255) (green / 255) (blue / 255)


webColorsReversed =
    Dict.toList webColors
        |> List.map (\( a, b ) -> ( b, a ))
        |> Dict.fromList


webColors =
    Dict.fromList
        [ ( "maroon", "800000" )
        , ( "dark red", "8B0000" )
        , ( "brown", "A52A2A" )
        , ( "firebrick", "B22222" )
        , ( "crimson", "DC143C" )
        , ( "red", "FF0000" )
        , ( "tomato", "FF6347" )
        , ( "coral", "FF7F50" )
        , ( "indian red", "CD5C5C" )
        , ( "light coral", "F08080" )
        , ( "dark salmon", "E9967A" )
        , ( "salmon", "FA8072" )
        , ( "light salmon", "FFA07A" )
        , ( "orange red", "FF4500" )
        , ( "dark orange", "FF8C00" )
        , ( "orange", "FFA500" )
        , ( "gold", "FFD700" )
        , ( "dark golden rod", "B8860B" )
        , ( "golden rod", "DAA520" )
        , ( "pale golden rod", "EEE8AA" )
        , ( "dark khaki", "BDB76B" )
        , ( "khaki", "F0E68C" )
        , ( "olive", "808000" )
        , ( "yellow", "FFFF00" )
        , ( "yellow green", "9ACD32" )
        , ( "dark olive green", "556B2F" )
        , ( "olive drab", "6B8E23" )
        , ( "lawn green", "7CFC00" )
        , ( "chart reuse", "7FFF00" )
        , ( "green yellow", "ADFF2F" )
        , ( "dark green", "006400" )
        , ( "green", "008000" )
        , ( "forest green", "228B22" )
        , ( "lime", "00FF00" )
        , ( "lime green", "32CD32" )
        , ( "light green", "90EE90" )
        , ( "pale green", "98FB98" )
        , ( "dark sea green", "8FBC8F" )
        , ( "medium spring green", "00FA9A" )
        , ( "spring green", "0F0FF7F" )
        , ( "sea green", "2E8B57" )
        , ( "medium aqua marine", "66CDAA" )
        , ( "medium sea green", "3CB371" )
        , ( "light sea green", "20B2AA" )
        , ( "dark slate gray", "2F4F4F" )
        , ( "teal", "008080" )
        , ( "dark cyan", "008B8B" )
        , ( "aqua", "00FFFF" )
        , ( "cyan", "00FFFF" )
        , ( "light cyan", "E0FFFF" )
        , ( "dark turquoise", "00CED1" )
        , ( "turquoise", "40E0D0" )
        , ( "medium turquoise", "48D1CC" )
        , ( "pale turquoise", "AFEEEE" )
        , ( "aqua marine", "7FFFD4" )
        , ( "powder blue", "B0E0E6" )
        , ( "cadet blue", "5F9EA0" )
        , ( "steel blue", "4682B4" )
        , ( "corn flower blue", "6495ED" )
        , ( "deep sky blue", "00BFFF" )
        , ( "dodger blue", "1E90FF" )
        , ( "light blue", "ADD8E6" )
        , ( "sky blue", "87CEEB" )
        , ( "light sky blue", "87CEFA" )
        , ( "midnight blue", "191970" )
        , ( "navy", "000080" )
        , ( "dark blue", "00008B" )
        , ( "medium blue", "0000CD" )
        , ( "blue", "0000FF" )
        , ( "royal blue", "4169E1" )
        , ( "blue violet", "8A2BE2" )
        , ( "indigo", "4B0082" )
        , ( "dark slate blue", "483D8B" )
        , ( "slate blue", "6A5ACD" )
        , ( "medium slate blue", "7B68EE" )
        , ( "medium purple", "9370DB" )
        , ( "dark magenta", "8B008B" )
        , ( "dark violet", "9400D3" )
        , ( "dark orchid", "9932CC" )
        , ( "medium orchid", "BA55D3" )
        , ( "purple", "800080" )
        , ( "thistle", "D8BFD8" )
        , ( "plum", "DDA0DD" )
        , ( "violet", "EE82EE" )
        , ( "magenta / fuchsia", "FF00FF" )
        , ( "orchid", "DA70D6" )
        , ( "medium violet red", "C71585" )
        , ( "pale violet red", "DB7093" )
        , ( "deep pink", "FF1493" )
        , ( "hot pink", "FF69B4" )
        , ( "light pink", "FFB6C1" )
        , ( "pink", "FFC0CB" )
        , ( "antique white", "FAEBD7" )
        , ( "beige", "F5F5DC" )
        , ( "bisque", "FFE4C4" )
        , ( "blanched almond", "FFEBCD" )
        , ( "wheat", "F5DEB3" )
        , ( "corn silk", "FFF8DC" )
        , ( "lemon chiffon", "FFFACD" )
        , ( "light golden rod yellow", "FAFAD2" )
        , ( "light yellow", "FFFFE0" )
        , ( "saddle brown", "8B4513" )
        , ( "sienna", "A0522D" )
        , ( "chocolate", "D2691E" )
        , ( "peru", "CD853F" )
        , ( "sandy brown", "F4A460" )
        , ( "burly wood", "DEB887" )
        , ( "tan", "D2B48C" )
        , ( "rosy brown", "BC8F8F" )
        , ( "moccasin", "FFE4B5" )
        , ( "navajo white", "FFDEAD" )
        , ( "peach puff", "FFDAB9" )
        , ( "misty rose", "FFE4E1" )
        , ( "lavender blush", "FFF0F5" )
        , ( "linen", "FAF0E6" )
        , ( "old lace", "FDF5E6" )
        , ( "papaya whip", "FFEFD5" )
        , ( "sea shell", "FFF5EE" )
        , ( "mint cream", "F5FFFA" )
        , ( "slate gray", "708090" )
        , ( "light slate gray", "778899" )
        , ( "light steel blue", "B0C4DE" )
        , ( "lavender", "E6E6FA" )
        , ( "floral white", "FFFAF0" )
        , ( "alice blue", "F0F8FF" )
        , ( "ghost white", "F8F8FF" )
        , ( "honeydew", "F0FFF0" )
        , ( "ivory", "FFFFF0" )
        , ( "azure", "F0FFFF" )
        , ( "snow", "FFFAFA" )
        , ( "black", "000000" )
        , ( "dim gray / dim grey", "696969" )
        , ( "gray / grey", "808080" )
        , ( "dark gray / dark grey", "A9A9A9" )
        , ( "silver", "C0C0C0" )
        , ( "light gray / light grey", "D3D3D3" )
        , ( "gainsboro", "DCDCDC" )
        , ( "white smoke", "F5F5F5" )
        , ( "white", "FFFFFF" )
        ]



-------------------------------------------------------------------------------


fonts =
    [ "Arial"
    , "Helvetica"
    , "Times New Roman"
    , "Times"
    , "Courier New"
    , "Courier"
    , "Verdana"
    , "Georgia"
    , "Palatino"
    , "Garamond"
    , "Bookman"
    , "Comic Sans MS"
    , "Trebuchet MS"
    , "Arial Black"
    , "Impact"
    , "Libre Baskerville"
    ]


fontSizes =
    [ "6"
    , "7"
    , "8"
    , "9"
    , "10"
    , "11"
    , "12"
    , "13"
    , "14"
    , "15"
    , "16"
    , "18"
    , "20"
    , "22"
    , "24"
    , "26"
    , "28"
    , "32"
    , "36"
    , "40"
    , "44"
    , "48"
    , "54"
    , "60"
    , "66"
    , "72"
    , "80"
    , "88"
    , "96"
    ]


chunks : Int -> List a -> List (List a)
chunks n xs =
    let
        helper acc ys =
            case ys of
                [] ->
                    List.reverse acc

                _ ->
                    helper (List.take n ys :: acc) (List.drop n ys)
    in
    helper [] xs


buttonStyle isActive =
    [ Border.rounded 5
    , Font.center
    , centerY
    , padding 5
    , focused [ Border.glow (rgb 1 1 1) 0 ]
    ]
        ++ (if isActive then
                [ Background.color (rgb 0.9 0.9 0.9)
                , mouseOver [ Font.color (rgb 255 255 255) ]
                , Border.width 1
                , Border.color (rgb 0.9 0.9 0.9)
                ]

            else
                [ Background.color (rgb 0.95 0.95 0.95)
                , Font.color (rgb 0.7 0.7 0.7)
                , htmlAttribute <| HtmlAttr.style "cursor" "default"
                , Border.width 1
                , Border.color (rgb 0.95 0.95 0.95)
                ]
           )


textInputStyle =
    [ width (px 250)
    , paddingXY 5 5
    , spacing 15
    , focused [ Border.glow (rgb 1 1 1) 0 ]
    ]


noAttr =
    htmlAttribute <| HtmlAttr.class ""
