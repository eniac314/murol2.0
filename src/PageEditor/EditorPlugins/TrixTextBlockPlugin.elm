port module PageEditor.EditorPlugins.TrixTextBlockPlugin exposing (Model, Msg, init, newsEditorView, parserOutput, subscriptions, textBlockPreview, update, view)

import Auth.AuthPlugin exposing (LogInfo)
import Browser exposing (element)
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


subscriptions model =
    Sub.batch
        [ --case model.openedWidget of
          --   Just FontColorPicker ->
          --       Browser.Events.onMouseDown (outsideTargetHandler "fontColorPicker" Close)
          --   Just BackgroundColorPicker ->
          --       Browser.Events.onMouseDown (outsideTargetHandler "backgroundColorPicker" Close)
          --   Just InternalLinks ->
          --       Browser.Events.onMouseDown (outsideTargetHandler "internalLinkPicker" Close)
          --   _ ->
          --       Sub.none
          selection GotSelection
        ]


type Msg
    = GetHtmlContent HtmlContent
    | GetSelection
    | GotSelection E.Value
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
      , output = []
      , nextUid = 0
      , wholeTextBlocAttr = attrs
      , globalAttributes = Dict.empty
      , headingLevel = Nothing
      , externalMsg = externalMsg
      }
    , Cmd.map externalMsg Cmd.none
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
        paragraph
            [ Font.family [ Font.typeface "Arial" ]
            , Font.size 16
            , width (minimum 500 (maximum 700 fill))
            ]
            [ html <|
                Html.div
                    []
                    [ Html.node "trix-toolbar" [ HtmlAttr.id "trix-toolbar" ] []
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
--renderer : Model msg -> Element msg
--renderer model =
--    let
--        content =
--            Html.Parser.run model.htmlContent.html
--                |> Result.map (List.map processLinks)
--                |> Result.map Html.Parser.Util.toVirtualDom
--                |> Result.map (Html.div [ HtmlAttr.class "trix-content" ])
--                |> Result.map (\r -> paragraph [] [ html r ])
--                |> Result.withDefault Element.none
--    in
--    el
--        [ padding 15 ]
--        content
--processLinks node =
--    let
--        processLinkAttrs processed toProcess =
--            case toProcess of
--                ( "href", url ) :: xs ->
--                    if String.startsWith "internal:" url then
--                        ( "href", String.dropLeft (String.length "internal:") url )
--                            :: (List.reverse processed ++ xs)
--                    else
--                        ( "href", url )
--                            :: ( "target", "blank" )
--                            :: (List.reverse processed ++ xs)
--                other :: xs ->
--                    processLinkAttrs (other :: processed) xs
--                [] ->
--                    processed
--    in
--    case node of
--        Element "a" attrs nodes ->
--            Element "a" (processLinkAttrs [] attrs) (List.map processLinks nodes)
--        Element tag attrs nodes ->
--            Element tag attrs (List.map processLinks nodes)
--        Html.Parser.Text value ->
--            Html.Parser.Text value
--        Comment value ->
--            Comment value
--processBold node =
--    case node of
--        Element "strong" attrs nodes ->
--toElements config level node =
--    case node of
--        Element "p" attrs nodes ->
--            paragraph
--                (List.concatMap cssToElmUiAttribute attrs)
--                (List.map (toElements config level) nodes)
--        Element "ul" attrs nodes ->
--            column
--                ([ spacing 10
--                 , paddingXY 0 10
--                 ]
--                    ++ List.concatMap cssToElmUiAttribute attrs
--                )
--                (List.map (toElements config (level + 1)) nodes)
--        Element "li" attrs nodes ->
--            let
--                bullet =
--                    if level == 0 then
--                        "•"
--                    else if level == 1 then
--                        "◦"
--                    else
--                        "▪"
--            in
--            row
--                ([ width fill
--                 , spacing 5
--                 ]
--                    ++ List.concatMap cssToElmUiAttribute attrs
--                )
--                [ el [ alignTop ] (text <| bullet)
--                , paragraph [] (List.map (toElements config level) nodes)
--                ]
--        Element "h1" attrs nodes ->
--            paragraph
--                ([ Region.heading 1 ]
--                    ++ List.concatMap cssToElmUiAttribute attrs
--                )
--                (List.map (toElements config level) nodes)
--        Element "strong" attrs nodes ->
--            paragraph
--                ([ Font.bold ]
--                    ++ List.concatMap cssToElmUiAttribute attrs
--                )
--                (List.map (toElements config level) nodes)
--        Element "em" attrs nodes ->
--            paragraph
--                ([ Font.italic ]
--                    ++ List.concatMap cssToElmUiAttribute attrs
--                )
--                (List.map (toElements config level) nodes)
--        Html.Parser.Text value ->
--            text value
--        Comment value ->
--            Element.none
--        _ ->
--            Element.none


toTextBlockElements node =
    case node of
        Element "p" attrs nodes ->
            let
                ( regular, others ) =
                    processAttrs attrs
            in
            Paragraph regular (List.map toTextBlockPrimitives nodes)

        Element "ul" attrs nodes ->
            let
                ( regular, others ) =
                    processAttrs attrs
            in
            UList regular <|
                List.foldr
                    (\n acc ->
                        case n of
                            Element "li" _ ns ->
                                acc ++ [ List.map toTextBlockPrimitives ns ]

                            _ ->
                                acc
                    )
                    []
                    nodes

        Element other attrs nodes ->
            let
                ( regular, others ) =
                    processAttrs attrs
            in
            case other of
                "h1" ->
                    Heading regular ( 1, extractText nodes )

                "h2" ->
                    Heading regular ( 2, extractText nodes )

                "h3" ->
                    Heading regular ( 3, extractText nodes )

                _ ->
                    TBPrimitive <| toTextBlockPrimitives (Element other attrs nodes)

        Html.Parser.Text value ->
            TBPrimitive <| Document.Text [] value

        Comment value ->
            TBPrimitive <| Document.Text [] ""


toTextBlockPrimitives node =
    case node of
        Element "a" attrs nodes ->
            let
                ( regular, others ) =
                    processAttrs attrs

                ( url, isBlank ) =
                    extractValue "href" others
                        |> Maybe.andThen
                            (\url_ ->
                                if String.startsWith "internal:" url_ then
                                    Just
                                        ( String.dropLeft (String.length "internal:") url_
                                        , False
                                        )

                                else
                                    Just ( url_, True )
                            )
                        |> Maybe.withDefault ( "", False )
            in
            Link
                []
                { targetBlank = isBlank
                , url = url
                , label = extractText nodes
                }

        Element "strong" attrs nodes ->
            let
                ( regular, others ) =
                    processAttrs attrs
            in
            Document.Text (Bold :: regular) (extractText nodes)

        Element "em" attrs nodes ->
            let
                ( regular, others ) =
                    processAttrs attrs
            in
            Document.Text (Italic :: regular) (extractText nodes)

        Element tag attrs nodes ->
            let
                ( regular, others ) =
                    processAttrs attrs
            in
            Document.Text regular (extractText nodes)

        Html.Parser.Text value ->
            Document.Text [] value

        Comment value ->
            Document.Text [] ""


extractText nodes =
    let
        extractor node =
            case node of
                Element tag attrs nodes_ ->
                    List.map extractor nodes_
                        |> String.join ""

                Html.Parser.Text value ->
                    value

                Comment value ->
                    ""
    in
    List.map extractor nodes
        |> String.join ""



--extractTextWithAttrs nodes
--    let
--        extractor node =
--            case node of
--                Element tag attrs nodes_ ->
--                    List.map extractor nodes_
--                        |> String.join ""
--                Html.Parser.Text value ->
--                    value
--                Comment value ->
--                    ""
--    in
--    List.map extractor nodes
--        |> String.join ""


processAttrs attrs =
    List.foldr
        (\a ( regular, others ) ->
            case cssToDocAttr a of
                Other other ->
                    ( regular, other :: others )

                reg ->
                    ( reg :: regular, others )
        )
        ( [], [] )
        attrs


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



--cssToElmUiAttribute : ( String, String ) -> List (Element.Attribute msg)
--cssToElmUiAttribute attr =
--    let
--        parseRgb s =
--            let
--                extractColValue color =
--                    String.toFloat color
--                        |> Maybe.withDefault 0
--                        |> (\f -> f / 255)
--            in
--            case
--                String.dropLeft 4 s
--                    |> String.dropRight 1
--                    |> String.split ","
--            of
--                r :: g :: b :: [] ->
--                    rgb (extractColValue r) (extractColValue g) (extractColValue b)
--                _ ->
--                    rgb 0 0 0
--        parsePxLength s =
--            String.dropRight 2 s
--                |> String.toInt
--                |> Maybe.withDefault 0
--    in
--    case attr of
--        ( "float", "right" ) ->
--            [ Element.alignRight ]
--        ( "float", "left" ) ->
--            [ Element.alignLeft ]
--        ( "background-color", color ) ->
--            [ Background.color (parseRgb color) ]
--        ( "width", "100%" ) ->
--            [ width fill ]
--        ( "width", n ) ->
--            [ width (px <| parsePxLength n) ]
--        ( "height", n ) ->
--            [ height (px <| parsePxLength n) ]
--        ( "font-family", font ) ->
--            [ Font.family
--                [ Font.typeface font ]
--            ]
--        ( "color", color ) ->
--            [ Font.color (parseRgb color) ]
--        ( "font-size", n ) ->
--            [ Font.size (parsePxLength n) ]
--        ( "text-align", "left" ) ->
--            [ Font.alignLeft ]
--        ( "text-align", "right" ) ->
--            [ Font.alignRight ]
--        ( "text-align", "center" ) ->
--            [ Font.center ]
--        ( "text-align", "justify" ) ->
--            [ Font.justify ]
--        ( "font-weight", "bold" ) ->
--            [ Font.bold ]
--        ( "font-weight", "italic" ) ->
--            [ Font.italic ]
--        _ ->
--            []


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
