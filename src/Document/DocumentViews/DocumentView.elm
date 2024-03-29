module Document.DocumentViews.DocumentView exposing (customHeading, idStyle, renderAttrs, renderBlockLinks, renderBlocksLinksMeta, renderBulletin, renderCalendar, renderCalendarSalleBeaune, renderCalendarSalleMurol, renderCalendarWidget, renderColumn, renderCustomElement, renderDelib, renderDoc, renderDronePanorama, renderEmptyCell, renderFiches, renderGallery, renderImage, renderLi, renderMurolInfo, renderNews, renderPictureLinks, renderResponsiveBloc, renderRow, renderTable, renderTextBlock, renderTextBlockElement, renderTextBlockPrimitive, renderTextColumn, renderVideo, renderWeatherWidget)

import Array exposing (..)
import Dict exposing (..)
import Document.Document as Document exposing (..)
import Document.DocumentViews.RenderConfig exposing (Config)
import Document.DocumentViews.StyleSheets exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Keyed as Keyed
import Element.Region as Region
import Gallery.Gallery as Gallery
import GeneralDirectoryEditor.FichePreview exposing (ficheView)
import GeneralDirectoryEditor.GeneralDirCommonTypes exposing (Fiche)
import Html as Html
import Html.Attributes as Attr
import Html.Events exposing (on, onMouseOut, onMouseOver)
import Html.Parser exposing (..)
import Html.Parser.Util exposing (toVirtualDom)
import Internals.CommonHelpers exposing (chunks, dateToFrench, dateToStr)
import Internals.CommonStyleHelpers exposing (..)
import Internals.Icons exposing (chevronsDown, chevronsUp, externalLink)
import Json.Decode as Decode
import List.Extra exposing (splitAt)
import Meteo.Meteo as Meteo
import Murmur3 exposing (hashString)
import PageEditor.Internals.DocumentEditorHelpers exposing (buildYoutubeUrl)
import Publications.PublicationsView as PublicationsView
import Set exposing (..)
import String.Extra exposing (toSentenceCase)
import Time exposing (Posix, Zone, millisToPosix)
import UUID exposing (toString)
import Url exposing (percentDecode)


renderDoc : Config msg -> Document.Document -> List (Element msg)
renderDoc config document =
    case document of
        Container { containerLabel, id, attrs } children ->
            case containerLabel of
                DocColumn ->
                    renderColumn config id attrs children

                DocRow ->
                    renderRow config id attrs children

                TextColumn ->
                    renderTextColumn config id attrs children

                ResponsiveBloc ->
                    renderResponsiveBloc config id attrs children

        Cell { cellContent, id, attrs } ->
            case cellContent of
                Image meta ->
                    renderImage config id attrs meta

                Video meta ->
                    renderVideo config id attrs meta

                BlockLinks meta ->
                    renderBlockLinks config id attrs meta

                Fiches fichesId ->
                    renderFiches config id attrs fichesId

                NewsBlock ->
                    renderNews config id attrs

                TextBlock xs ->
                    renderTextBlock config id attrs xs

                Table meta ->
                    renderTable config id attrs meta

                CustomElement s ->
                    renderCustomElement config id attrs s

                PictureLinks picLinks ->
                    renderPictureLinks config id attrs picLinks

                Gallery galleryMeta ->
                    renderGallery config id attrs galleryMeta

                CalendarWidget ->
                    renderCalendarWidget config id attrs

                Calendar ->
                    renderCalendar config id attrs

                CalendarSalleMurol ->
                    renderCalendarBoth config id attrs

                --renderCalendarSalleMurol config id attrs
                CalendarSalleBeaune ->
                    renderCalendarSalleBeaune config id attrs

                WeatherWidget ->
                    renderWeatherWidget config id attrs

                DronePanorama ->
                    renderDronePanorama config id attrs

                MurolInfo ->
                    renderMurolInfo config id attrs

                Delib ->
                    renderDelib config id attrs

                Bulletin ->
                    renderBulletin config id attrs

                EmptyCell ->
                    renderEmptyCell config id attrs


renderBlockLinks : Config msg -> Id -> List DocAttribute -> List BlockLinkMeta -> List (Element msg)
renderBlockLinks config id attrs meta =
    let
        maxWidth =
            docMaxWidth
                ( config.width, config.height )
                config.editMode
                config.previewMode

        styleSheet =
            defaultStyleSheet config

        nbrChunks =
            chunkBy config 1 2 3 3

        rows =
            chunks nbrChunks
                (List.map (renderBlocksLinksMeta nbrChunks config id attrs) meta)
                |> List.map
                    (row
                        [ centerX, spacing 10 ]
                    )
    in
    [ column
        ([ width fill
         , spacing 10
         ]
            ++ idStyle styleSheet id
            ++ renderAttrs config attrs
        )
        rows
    ]


renderBlocksLinksMeta : Int -> Config msg -> Id -> List DocAttribute -> BlockLinkMeta -> Element msg
renderBlocksLinksMeta nbrChunks config id attrs { image, label, targetBlank, url } =
    let
        styleSheet =
            defaultStyleSheet config

        linkFun =
            if targetBlank then
                newTabLink

            else
                link

        url_ =
            if targetBlank then
                url

            else
                Dict.get url config.pageIndex
                    |> Maybe.withDefault ""

        containerWidth =
            getContainerWidth config

        maxWidth =
            let
                padding =
                    40

                spacing =
                    10
            in
            min
                ((toFloat containerWidth
                    - padding
                    - ((toFloat nbrChunks - 1) * padding)
                 )
                    / toFloat nbrChunks
                )
                300

        bw =
            round maxWidth

        bh =
            round <| maxWidth / (300 / 225)

        block =
            el
                (styleSheet.blocLinkStyle
                    ++ renderAttrs config attrs
                    ++ [ width (px bw)
                       , height (px bh)
                       , Background.color blockLinkGrey
                       , if not config.editMode then
                            mouseOver
                                [ Background.color (blockLinkGreyAlpha 0.5) ]

                         else
                            noAttr
                       ]
                )
                (el
                    [ width (px <| bw - 12)
                    , height (px <| bh - 12)
                    , centerX
                    , centerY
                    , Background.image image
                    , inFront
                        (el
                            [ alignBottom
                            , width fill
                            , padding 10
                            , Background.color (blockLinkGreyAlpha 0.8)
                            , Font.color aliceBlue
                            ]
                            (row
                                [ width fill ]
                                [ el
                                    ([ Font.center
                                     , width fill
                                     ]
                                        ++ unselectable
                                    )
                                    (text <| toSentenceCase label)
                                , if targetBlank then
                                    el
                                        [ alignRight
                                        , Font.color (rgb 1 1 1)
                                        ]
                                        (html <| externalLink 16)

                                  else
                                    Element.none
                                ]
                            )
                        )
                    ]
                    Element.none
                )
    in
    if config.editMode then
        Keyed.el
            []
            ( hashString
                0
                (image ++ url ++ label)
                |> String.fromInt
            , block
            )

    else
        linkFun
            []
            { url = url_
            , label = block
            }


renderFiches config id attrs fichesId =
    let
        styleSheet =
            defaultStyleSheet config

        containerWidth =
            getContainerWidth config

        nbrCols =
            chunkBy config 1 2 2 2

        mw =
            case nbrCols of
                3 ->
                    300

                2 ->
                    440

                _ ->
                    440

        maxWidth =
            let
                padding =
                    40

                spacing =
                    10
            in
            min
                ((toFloat containerWidth
                    - padding
                    - ((nbrCols - 1) * padding)
                 )
                    / toFloat nbrCols
                )
                (toFloat mw)

        fiches =
            List.filterMap
                (\fId -> Dict.get fId config.fiches)
                fichesId

        ficheView_ f =
            ficheView
                config.openFicheMsg
                config.currentTime
                maxWidth
                (config.editMode || Set.member (UUID.toString f.uuid) config.openedFiches)
                f

        cols =
            chunks (ceiling <| (toFloat <| List.length fiches) / nbrCols) (List.map ficheView_ (List.sortBy .nomEntite fiches))
                |> List.map
                    (column
                        [ alignTop
                        , spacing 10
                        ]
                    )
    in
    [ row
        ([ centerX
         , spacing 10
         ]
            ++ idStyle styleSheet id
            ++ renderAttrs config attrs
        )
        cols
    ]


renderNews config id attrs =
    let
        styleSheet =
            defaultStyleSheet config

        device =
            getDevice config

        renderNewsHeader uuid title date =
            let
                headerAttr =
                    [ spacing 15
                    , width fill
                    , Events.onClick (config.openNewsMsg (UUID.toString uuid))
                    , pointer
                    , paddingEach
                        { bottom = 5
                        , top = 5
                        , left = 5
                        , right = 0
                        }
                    , Border.roundEach
                        { topLeft = 2
                        , topRight = 2
                        , bottomLeft = 0
                        , bottomRight = 0
                        }
                    , Border.widthEach
                        { bottom = 1
                        , top = 0
                        , left = 0
                        , right = 0
                        }
                    , Border.color grey6
                    , Background.color grey5
                    , mouseOver
                        [ Background.color grey6 ]
                    ]

                titleView =
                    paragraph
                        [ width fill
                        , Font.color grey1
                        , paddingEach
                            { top = 0
                            , right = 0
                            , bottom = 0
                            , left = 0
                            }
                        ]
                        [ text (toSentenceCase title) ]

                chevronsView =
                    el
                        [ alignRight
                        , Font.color grey3
                        ]
                        (html <|
                            if Set.member (UUID.toString uuid) config.openedNews then
                                chevronsUp 18

                            else
                                chevronsDown 18
                        )

                dateAttr =
                    [ Border.color grey6
                    , Border.widthEach
                        { bottom = 0
                        , top = 0
                        , left = 1
                        , right = 0
                        }
                    , paddingEach
                        { top = 5
                        , right = 5
                        , bottom = 5
                        , left = 9
                        }
                    ]
            in
            case device.class of
                Phone ->
                    column
                        headerAttr
                        [ titleView
                        , row
                            [ width fill ]
                            [ el
                                dateAttr
                                (text <| dateToStr config.zone date)
                            , chevronsView
                            ]
                        ]

                _ ->
                    row
                        headerAttr
                        [ titleView
                        , row
                            [ spacing 7 ]
                            [ chevronsView
                            , el
                                (dateAttr ++ [ alignRight ])
                                (text <| dateToStr config.zone date)
                            ]
                        ]

        renderNewsBody uuid pic content =
            let
                picView url =
                    el
                        [ width (px 266)
                        , height (px 200)
                        , Background.uncropped url
                        ]
                        Element.none

                bodyAttr =
                    [ width fill
                    , Background.color (rgb255 255 255 255)
                    , spacing 15
                    , padding 10
                    , Border.roundEach
                        { topLeft = 0
                        , topRight = 0
                        , bottomLeft = 5
                        , bottomRight = 5
                        }
                    , Border.color grey4
                    , Border.widthEach
                        { bottom = 1
                        , left = 1
                        , right = 1
                        , top = 0
                        }
                    ]
            in
            if Set.member (UUID.toString uuid) config.openedNews then
                case ( pic, device.class ) of
                    ( Just { url }, Phone ) ->
                        [ column
                            bodyAttr
                            ([ el [ centerX ]
                                (picView url)
                             ]
                                ++ renderTextBlock config
                                    id
                                    content.attrs
                                    content.tbElems
                            )
                        ]

                    ( Just { url }, _ ) ->
                        [ textColumn
                            bodyAttr
                            ([ el
                                [ paddingEach
                                    { bottom = 0
                                    , top = 0
                                    , left = 0
                                    , right = 10
                                    }
                                , alignLeft
                                ]
                                (picView url)
                             ]
                                ++ renderTextBlock config
                                    id
                                    content.attrs
                                    content.tbElems
                            )
                        ]

                    ( Nothing, _ ) ->
                        [ column
                            bodyAttr
                            (renderTextBlock config
                                id
                                content.attrs
                                content.tbElems
                            )
                        ]

            else
                []

        renderNewsItem { uuid, title, content, date, pic } =
            column
                [ width fill ]
                ([ renderNewsHeader uuid title date ]
                    ++ (case content of
                            Just c ->
                                renderNewsBody uuid pic c

                            _ ->
                                []
                       )
                )

        lastUpdate =
            Dict.values config.news
                |> List.map (Time.posixToMillis << .date)
                |> List.sort
                |> List.reverse
                |> List.head
                |> Maybe.map Time.millisToPosix

        sortedNews =
            Dict.values config.news
                |> List.sortBy (Time.posixToMillis << .date)
                |> List.reverse
    in
    [ column
        ([ centerX
         , spacing 15
         , width fill
         , alignTop
         ]
            ++ idStyle styleSheet id
            ++ renderAttrs config attrs
        )
        ([ customHeading config 1 [] "ACTUALITES DE LA COMMUNE"
         , Maybe.map
            (\lastUp ->
                paragraph []
                    [ text <|
                        "Dernière mise à jour le "
                            ++ dateToFrench config.zone lastUp
                    ]
            )
            lastUpdate
            |> Maybe.withDefault Element.none
         ]
            ++ List.map renderNewsItem sortedNews
        )
    ]


renderTextBlock config id attrs xs =
    List.map (renderTextBlockElement config id attrs) xs


renderTextBlockElement config id tbAttrs tbe =
    let
        styleSheet =
            defaultStyleSheet config
    in
    case tbe of
        Paragraph attrs xs ->
            paragraph
                (styleSheet.paragraphStyle
                    ++ idStyle styleSheet id
                    ++ renderAttrs config tbAttrs
                    ++ renderAttrs config attrs
                )
                (List.map (renderTextBlockPrimitive config tbAttrs) xs)

        UList attrs xs ->
            paragraph
                (renderAttrs config tbAttrs
                    ++ idStyle styleSheet id
                    ++ renderAttrs config attrs
                    ++ [ spacing 10 ]
                )
                (List.map (renderLi config tbAttrs) xs)

        Heading attrs ( level, s ) ->
            let
                headingStyle =
                    Dict.get level styleSheet.headingStyle
                        |> Maybe.withDefault []
            in
            paragraph
                ([ Region.heading level ]
                    ++ headingStyle
                    ++ idStyle styleSheet id
                    ++ renderAttrs config tbAttrs
                    ++ renderAttrs config attrs
                )
                [ text s ]

        TBPrimitive p ->
            el
                (idStyle styleSheet id)
                (renderTextBlockPrimitive config tbAttrs p)

        TrixHtml html ->
            Html.Parser.run html
                |> Result.withDefault []
                |> List.map (processLinks config)
                |> List.map (toHtml config 0)
                |> Html.div
                    [ Attr.class "trix-content"

                    --, Attr.style "width" "100%"
                    , Attr.attribute "style"
                        ("width: 100%;"
                            ++ stringifyAttributes (List.concatMap docAttrToCss tbAttrs)
                        )
                    ]
                |> (\r ->
                        paragraph
                            ([ width fill
                             ]
                                ++ idStyle styleSheet id
                                ++ renderAttrs config tbAttrs
                            )
                            [ embeddedStyleSheet config tbAttrs
                            , Element.html <| r
                            ]
                   )


processLinks config node =
    let
        processLinkAttrs processed toProcess =
            case toProcess of
                ( "href", url ) :: xs ->
                    if config.editMode then
                        List.reverse processed ++ xs

                    else if String.startsWith "lien-interne:" url then
                        ( "href"
                        , String.dropLeft (String.length "lien-interne:") url
                            |> (\cId -> Dict.get cId config.pageIndex)
                            |> Maybe.withDefault url
                        )
                            :: (List.reverse processed ++ xs)

                    else if String.startsWith "doc:" url then
                        ( "href"
                        , String.dropLeft (String.length "doc:") url
                            |> percentDecode
                            |> Maybe.withDefault ""
                        )
                            :: ( "target", "_blank" )
                            :: (List.reverse processed ++ xs)

                    else if Dict.member url config.pageIndex then
                        ( "href", Dict.get url config.pageIndex |> Maybe.withDefault "" )
                            :: (List.reverse processed ++ xs)

                    else
                        ( "href", url )
                            :: ( "target", "_blank" )
                            :: (List.reverse processed ++ xs)

                other :: xs ->
                    processLinkAttrs (other :: processed) xs

                [] ->
                    processed
    in
    case node of
        Element "a" attrs nodes ->
            Element "a" (processLinkAttrs [] attrs) (List.map (processLinks config) nodes)

        Element tag attrs nodes ->
            Element tag attrs (List.map (processLinks config) nodes)

        Html.Parser.Text value ->
            Html.Parser.Text value

        Comment value ->
            Comment value


toHtml config level node =
    case node of
        Element tag attrs nodes ->
            let
                templateTagAttr =
                    Dict.get tag (defaultStyleSheetCss config)
                        |> Maybe.withDefault []
                        |> List.map (\( a, v ) -> a ++ ":" ++ v ++ ";")
                        |> String.join " "
                        |> (\s -> Attr.attribute "style" s)

                attrs_ =
                    templateTagAttr
                        :: List.map (\( a, v ) -> Attr.attribute a v)
                            attrs
            in
            Html.node tag attrs_ (List.map (toHtml config level) nodes)

        Html.Parser.Text value ->
            Html.text value

        Comment value ->
            Html.span [] []


customHeading config level attrs title =
    renderTextBlockElement
        config
        { uid = 0
        , docStyleId = Nothing
        , classes = Set.empty
        , htmlId =
            Just ("defaultHtmlId" ++ String.fromInt 0)
        }
        []
        (Heading attrs ( level, title ))


renderTextBlockPrimitive config tbAttrs p =
    let
        styleSheet =
            defaultStyleSheet config
    in
    case p of
        Document.Text attrs s ->
            el
                (styleSheet.textStyle
                    ++ renderAttrs config tbAttrs
                    ++ renderAttrs config attrs
                )
                (text s)

        Link attrs { targetBlank, url, label } ->
            let
                linkFun =
                    if targetBlank then
                        newTabLink

                    else
                        link

                url_ =
                    if targetBlank then
                        url

                    else
                        Dict.get url config.pageIndex
                            |> Maybe.withDefault ""
            in
            if config.editMode then
                el
                    (styleSheet.linkStyle
                        ++ renderAttrs config tbAttrs
                        ++ renderAttrs config attrs
                    )
                    (text label)

            else
                linkFun
                    (styleSheet.linkStyle
                        ++ renderAttrs config tbAttrs
                        ++ renderAttrs config attrs
                    )
                    { url = url_
                    , label = text label
                    }


renderLi config tbAttrs li =
    paragraph
        ([ paddingEach
            { top = 0
            , left = 20
            , right = 0
            , bottom = 0
            }
         ]
            ++ renderAttrs config tbAttrs
        )
        ([ el [] (text "•  ") ] ++ List.map (renderTextBlockPrimitive config tbAttrs) li)


renderColumn config id attrs children =
    let
        styleSheet =
            defaultStyleSheet config
    in
    [ column
        (styleSheet.columnStyle
            ++ (if config.containersBkgColors then
                    [ Background.color (rgba 0 1 0 0.3) ]

                else
                    []
               )
            ++ idStyle styleSheet id
            ++ [ width (maximum config.width fill)
               , alignTop
               ]
            ++ renderAttrs config attrs
        )
        (List.concatMap (renderDoc config) children)
    ]


renderRow config id attrs children =
    let
        styleSheet =
            defaultStyleSheet config
    in
    [ row
        (styleSheet.rowStyle
            ++ (if config.containersBkgColors then
                    [ Background.color (rgba 1 0 0 0.3) ]

                else
                    []
               )
            ++ idStyle styleSheet id
            ++ renderAttrs config attrs
        )
        (List.concatMap (renderDoc config) children)
    ]


renderTextColumn config id attrs children =
    let
        styleSheet =
            defaultStyleSheet config
    in
    [ textColumn
        (styleSheet.textColumnStyle
            ++ (if config.containersBkgColors then
                    [ Background.color (rgba 0 0 1 0.3) ]

                else
                    []
               )
            ++ idStyle styleSheet id
            ++ renderAttrs config attrs
        )
        (List.concatMap (renderDoc config) children)
    ]


renderResponsiveBloc config id attrs children =
    let
        styleSheet =
            defaultStyleSheet config
    in
    [ row
        (styleSheet.respBlocStyle
            ++ idStyle styleSheet id
            ++ renderAttrs config attrs
        )
        (List.concatMap (renderDoc config) children)
    ]


renderImage config ({ uid, docStyleId, classes } as id) attrs { src, caption, size } =
    let
        styleSheet =
            defaultStyleSheet config

        attrs_ =
            [ width (maximum size.imgWidth fill)
            ]
                ++ styleSheet.imageStyle
                ++ idStyle styleSheet id
                ++ renderAttrs config attrs

        src_ =
            case src of
                Inline f s ->
                    s

                UrlSrc s ->
                    s
    in
    [ case caption of
        Just c ->
            column
                attrs_
                [ image []
                    { src = src_
                    , description = ""
                    }
                , paragraph
                    [ Font.italic
                    , Font.size 14
                    , width fill
                    , Font.center
                    , paddingXY 0 5
                    ]
                    [ text c ]
                ]

        Nothing ->
            image attrs_
                { src = src_
                , description = ""
                }
    ]


renderVideo config ({ uid, docStyleId, classes } as id) attrs vidMeta =
    let
        attrs_ =
            idStyle styleSheet id
                ++ renderAttrs config attrs

        styleSheet =
            defaultStyleSheet config
    in
    [ el ([ centerX ] ++ attrs_)
        (html <|
            Html.iframe
                [ Attr.src <|
                    buildYoutubeUrl vidMeta.src vidMeta
                , Attr.width vidMeta.size.videoWidth
                , Attr.height vidMeta.size.videoHeight
                , if vidMeta.frameBorder then
                    noHtmlAttr

                  else
                    Attr.attribute "frameborder" "0"
                , Attr.attribute "allowfullscreen" "true"
                , Attr.attribute "allow" "autoplay; encrypted-media"
                ]
                []
        )
    ]


renderTable config id attrs { style, nbrRows, nbrCols, data } =
    let
        containerWidth =
            getContainerWidth config

        maxWidth =
            containerWidth - 40

        styleSheet =
            defaultStyleSheet config

        columns =
            List.map
                (\ci ->
                    { header = Element.none
                    , width = fill
                    , view =
                        \ri row ->
                            el
                                (Dict.get style tableStyles
                                    |> Maybe.map .containerStyle
                                    |> Maybe.withDefault []
                                    |> (\s -> height fill :: s)
                                )
                                (el
                                    ((Dict.get style tableStyles
                                        |> Maybe.map .cellStyle
                                        |> Maybe.withDefault (\_ -> [])
                                     )
                                        ri
                                        ++ [ paddingXY 15 5
                                           , height (minimum 30 fill)
                                           ]
                                    )
                                    (paragraph
                                        []
                                        [ text
                                            (Array.get ci row
                                                |> Maybe.withDefault ""
                                            )
                                        ]
                                    )
                                )
                    }
                )
                (List.range
                    0
                    (nbrCols - 1)
                )
    in
    [ el
        [ width (maximum maxWidth fill)

        --, height fill
        --, clipX
        --, scrollbarX
        ]
        (indexedTable
            ((Dict.get style tableStyles
                |> Maybe.map .tableStyle
                |> Maybe.withDefault []
             )
                ++ [ clipX
                   , scrollbarX
                   ]
                ++ idStyle styleSheet id
                ++ renderAttrs config attrs
            )
            { data = data
            , columns = columns
            }
        )
    ]


renderCalendarWidget config id attrs =
    let
        containerWidth =
            getContainerWidth config

        maxWidth =
            containerWidth - 40

        device =
            getDevice config

        widgetWidth =
            case device.class of
                Phone ->
                    width fill

                Tablet ->
                    width fill

                _ ->
                    width (px 300)
    in
    [ column
        ([ widgetWidth
         , alignTop
         , centerX
         , spacing 10
         ]
            ++ idStyle (defaultStyleSheet config) id
            ++ renderAttrs config attrs
        )
        [ customHeading config 1 [] "AGENDA"
        , el
            [ centerX ]
            (html <|
                Html.iframe
                    [ Attr.src "https://calendar.google.com/calendar/embed?showTitle=0&showTabs=0&showNav=0&showPrint=0&showCalendars=0&showTz=0&mode=AGENDA&height=150&wkst=2&hl=fr&bgcolor=%23FFFFFF&src=1claq68scg7llpg29j2fasprtk%40group.calendar.google.com&;color=%23fe3b00&;src=n1jce3hgvarkt6n3o69c6nl66g%40group.calendar.google.com&;color=%23007451&;src=r46rbonnui234n2b2glau5btoo%40group.calendar.google.com&;color=%2305f2ff&ctz=Europe%2FParis"
                    , Attr.style "border-width" "0"
                    ]
                    []
            )
        ]
    ]


renderCalendar config id attrs =
    let
        maxWidth =
            min
                (docMaxWidth
                    ( config.width, config.height )
                    config.editMode
                    config.previewMode
                )
                config.width
                - 40
    in
    [ column
        [ width (px maxWidth)
        , centerX
        , spacing 15
        ]
        [ customHeading config 1 [] "Calendrier"
        , el
            [ centerX
            , width fill
            , height (px << round <| toFloat maxWidth / 1.333333)
            ]
            (if maxWidth <= 500 then
                html <|
                    Html.iframe
                        [ Attr.src "https://calendar.google.com/calendar/embed?showTitle=0&showTabs=0&showNav=0&showPrint=0&showCalendars=0&showTz=0&mode=AGENDA&height=150&wkst=2&hl=fr&bgcolor=%23FFFFFF&src=1claq68scg7llpg29j2fasprtk%40group.calendar.google.com&;color=%23fe3b00&;src=n1jce3hgvarkt6n3o69c6nl66g%40group.calendar.google.com&;color=%23007451&;src=r46rbonnui234n2b2glau5btoo%40group.calendar.google.com&;color=%2305f2ff&ctz=Europe%2FParis"
                        , Attr.style "border-width" "0"
                        ]
                        []

             else
                html <|
                    Html.iframe
                        [ Attr.src <| "https://calendar.google.com/calendar/embed?showTitle=0&height=" ++ (String.fromInt << round <| toFloat maxWidth / 1.333333) ++ "&wkst=1&;bgcolor=%23FFFFFF&src=1claq68scg7llpg29j2fasprtk%40group.calendar.google.com&;color=%23fe3b00&;src=n1jce3hgvarkt6n3o69c6nl66g%40group.calendar.google.com&;color=%23007451&;src=r46rbonnui234n2b2glau5btoo%40group.calendar.google.com&;color=%2305f2ff&ctz=Europe%2FParis"
                        , Attr.height (round <| toFloat maxWidth / 1.333333)
                        , Attr.style "border-width" "0"
                        ]
                        []
            )
        ]
    ]


renderCalendarBoth config id attrs =
    let
        maxWidth =
            min
                (docMaxWidth
                    ( config.width, config.height )
                    config.editMode
                    config.previewMode
                )
                config.width
                - 40
    in
    [ column
        [ width (px maxWidth)
        , centerX
        , spacing 15
        ]
        [ customHeading config 1 [] "Calendrier"
        , el
            [ centerX
            , width fill
            , height (px << round <| toFloat maxWidth / 1.333333)
            ]
            (if maxWidth <= 500 then
                html <|
                    Html.iframe
                        [ Attr.src "https://calendar.google.com/calendar/embed?showTitle=0&showTabs=0&showNav=0&showPrint=0&showCalendars=0&showTz=0&mode=AGENDA&height=150&wkst=2&hl=fr&bgcolor=%23FFFFFF&src=cjQ2cmJvbm51aTIzNG4yYjJnbGF1NWJ0b29AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=bjFqY2UzaGd2YXJrdDZuM282OWM2bmw2NmdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&ctz=Europe%2FParis&color=%2300c1cc&color=%23007451"
                        , Attr.style "border-width" "0"
                        ]
                        []

             else
                html <|
                    Html.iframe
                        [ Attr.src <| "https://calendar.google.com/calendar/embed?showTitle=0&height=" ++ (String.fromInt << round <| toFloat maxWidth / 1.333333) ++ "&wkst=2&;bgcolor=%23FFFFFF&src=cjQ2cmJvbm51aTIzNG4yYjJnbGF1NWJ0b29AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=bjFqY2UzaGd2YXJrdDZuM282OWM2bmw2NmdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&ctz=Europe%2FParis&color=%2300c1cc&color=%23007451"
                        , Attr.height (round <| toFloat maxWidth / 1.333333)
                        , Attr.style "border-width" "0"
                        ]
                        []
            )
        ]
    ]



--<iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=Europe%2FParis&title=Calendrier%20salle%20des%20f%C3%AAtes&src=cjQ2cmJvbm51aTIzNG4yYjJnbGF1NWJ0b29AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=bjFqY2UzaGd2YXJrdDZuM282OWM2bmw2NmdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%2300c1cc&color=%23007451" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>


renderCalendarSalleMurol config id attrs =
    let
        maxWidth =
            min
                (docMaxWidth
                    ( config.width, config.height )
                    config.editMode
                    config.previewMode
                )
                config.width
                - 40
    in
    [ column
        [ width (px maxWidth)
        , centerX
        , spacing 15
        ]
        [ customHeading config 1 [] "Calendrier"
        , el
            [ centerX
            , width fill
            , height (px << round <| toFloat maxWidth / 1.333333)
            ]
            (if maxWidth <= 500 then
                html <|
                    Html.iframe
                        [ Attr.src "https://calendar.google.com/calendar/embed?showTitle=0&showTabs=0&showNav=0&showPrint=0&showCalendars=0&showTz=0&mode=AGENDA&height=150&wkst=2&hl=fr&bgcolor=%23FFFFFF&src=r46rbonnui234n2b2glau5btoo%40group.calendar.google.com&ctz=Europe%2FParis"
                        , Attr.style "border-width" "0"
                        ]
                        []

             else
                html <|
                    Html.iframe
                        [ Attr.src <| "https://calendar.google.com/calendar/embed?showTitle=0&height=" ++ (String.fromInt << round <| toFloat maxWidth / 1.333333) ++ "&wkst=1&;bgcolor=%23FFFFFF&src=r46rbonnui234n2b2glau5btoo%40group.calendar.google.com&ctz=Europe%2FParis"
                        , Attr.height (round <| toFloat maxWidth / 1.333333)
                        , Attr.style "border-width" "0"
                        ]
                        []
            )
        ]
    ]


renderCalendarSalleBeaune config id attrs =
    let
        maxWidth =
            min
                (docMaxWidth
                    ( config.width, config.height )
                    config.editMode
                    config.previewMode
                )
                config.width
                - 40
    in
    [ column
        [ width (px maxWidth)
        , centerX
        , spacing 15
        ]
        [ customHeading config 1 [] "Calendrier"
        , el
            [ centerX
            , width fill
            , height (px << round <| toFloat maxWidth / 1.333333)
            ]
            (if maxWidth <= 500 then
                html <|
                    Html.iframe
                        [ Attr.src "https://calendar.google.com/calendar/embed?showTitle=0&showTabs=0&showNav=0&showPrint=0&showCalendars=0&showTz=0&mode=AGENDA&height=150&wkst=2&hl=fr&bgcolor=%23FFFFFF&src=n1jce3hgvarkt6n3o69c6nl66g%40group.calendar.google.com&ctz=Europe%2FParis"
                        , Attr.style "border-width" "0"
                        ]
                        []

             else
                html <|
                    Html.iframe
                        [ Attr.src <| "https://calendar.google.com/calendar/embed?showTitle=0&height=" ++ (String.fromInt << round <| toFloat maxWidth / 1.333333) ++ "&wkst=1&;bgcolor=%23FFFFFF&src=n1jce3hgvarkt6n3o69c6nl66g%40group.calendar.google.com&ctz=Europe%2FParis"
                        , Attr.height (round <| toFloat maxWidth / 1.333333)
                        , Attr.style "border-width" "0"
                        ]
                        []
            )
        ]
    ]


renderWeatherWidget config id attrs =
    let
        containerWidth =
            getContainerWidth config

        maxWidth =
            min
                (docMaxWidth
                    ( config.width, config.height )
                    config.editMode
                    config.previewMode
                )
                config.width
                - 40

        device =
            getDevice config

        widgetWidth =
            case device.class of
                Phone ->
                    maxWidth

                Tablet ->
                    maxWidth

                _ ->
                    300
    in
    [ column
        ([ width (px widgetWidth)
         , alignTop
         , centerX
         , spacing 10
         ]
            ++ idStyle (defaultStyleSheet config) id
            ++ renderAttrs config attrs
        )
        [ customHeading config 1 [] "METEO"
        , case config.weatherWidget of
            Just meteo ->
                Meteo.view widgetWidth meteo

            Nothing ->
                Element.none
        ]
    ]



--<iframe id="widget_autocomplete_preview"  width="150" height="300" frameborder="0" src="https://meteofrance.com/widget/prevision/632470"> </iframe>


renderDronePanorama config id attrs =
    let
        containerWidth =
            getContainerWidth config

        maxWidth =
            containerWidth - 40

        device =
            getDevice config

        widgetWidth =
            case device.class of
                Phone ->
                    width fill

                Tablet ->
                    width fill

                _ ->
                    width (px 300)
    in
    [ column
        ([ widgetWidth
         , alignTop
         , centerX
         , spacing 10
         ]
            ++ idStyle (defaultStyleSheet config) id
            ++ renderAttrs config attrs
        )
        [ customHeading config 1 [] "VISITE VIRTUELLE AERIENNE"
        , column
            [ Background.color (rgb255 169 169 169)
            , width fill
            , padding 15
            , spacing 15
            ]
            [ newTabLink
                [ width fill
                , centerX
                ]
                { url = "visite/visite-virtuelle-aerienne-murol.html"
                , label =
                    el
                        [ width (px 200)
                        , height (px 160)
                        , Background.image "assets/images/misc/visiteVirt.jpg"
                        , Border.width 5
                        , Border.color (rgb 1 1 1)
                        ]
                        Element.none
                }
            , row
                [ centerX
                ]
                [ el
                    []
                    (text "Réalisée par la société ")
                , newTabLink [ Font.color teal3 ]
                    { url = "https://www.w3ds.fr/"
                    , label = text "W3D's"
                    }
                ]
            ]
        ]
    ]


renderCustomElement config id attrs s =
    [ Dict.get s config.customElems
        |> Maybe.withDefault Element.none
    ]


renderPictureLinks config id attrs picLinks =
    let
        styleSheet =
            defaultStyleSheet config

        minHeight =
            picLinks
                |> List.map (.imgHeight << .size << .img)
                |> List.sort
                |> List.head
                |> Maybe.map (min 50)
                |> Maybe.withDefault 0

        imgsScaledToMinHeight =
            let
                scale ({ img } as picLink) =
                    { picLink
                        | img =
                            { img
                                | size =
                                    { imgHeight = minHeight + 5
                                    , imgWidth =
                                        round <|
                                            toFloat minHeight
                                                * toFloat img.size.imgWidth
                                                / toFloat img.size.imgHeight
                                    }
                            }
                    }
            in
            List.map scale picLinks

        totalImgWidth =
            List.foldr (\pl n -> pl.img.size.imgWidth + n) 0 imgsScaledToMinHeight
                |> toFloat

        logoView { url, img } =
            if config.editMode then
                el
                    [ Element.width <|
                        fillPortion
                            (floor <| 10000 * toFloat img.size.imgWidth / totalImgWidth)
                    ]
                    (image
                        [ width fill
                        , height fill
                        ]
                        { src =
                            case img.src of
                                UrlSrc urlSrc ->
                                    urlSrc

                                _ ->
                                    ""
                        , description = ""
                        }
                    )
                --(html <|
                --    Html.img
                --        [ Attr.style "width" "100%"
                --        , Attr.style "height" "auto"
                --        , case img.src of
                --            UrlSrc urlSrc ->
                --                Attr.src urlSrc
                --            _ ->
                --                Attr.style "" ""
                --        ]
                --        []
                --)

            else
                el
                    [ Element.width <|
                        fillPortion
                            (floor <| 10000 * toFloat img.size.imgWidth / totalImgWidth)
                    ]
                    (newTabLink
                        [ pointer
                        , Border.width 2
                        , Border.color (rgba255 255 255 255 0)
                        , Border.rounded 2
                        , mouseOver
                            [ Border.color (rgb255 255 255 255)
                            ]
                        ]
                        { url = url
                        , label =
                            image [ width fill ]
                                { src =
                                    case img.src of
                                        UrlSrc urlSrc ->
                                            urlSrc

                                        _ ->
                                            ""
                                , description = ""
                                }

                        --html <|
                        --    Html.img
                        --        [ Attr.style "width" "100%"
                        --        , Attr.style "height" "auto"
                        --        , case img.src of
                        --            UrlSrc urlSrc ->
                        --                Attr.src urlSrc
                        --            _ ->
                        --                Attr.style "" ""
                        --        ]
                        --        []
                        }
                    )
    in
    case picLinks of
        [] ->
            []

        _ ->
            [ row
                ([ spacing 10
                 , padding 10

                 --, clip
                 ]
                    ++ styleSheet.pictureLinksStyle
                    ++ idStyle styleSheet id
                    ++ renderAttrs config attrs
                )
                (List.map logoView imgsScaledToMinHeight)
            ]


renderGallery config id attrs galleryMeta =
    case Dict.get (UUID.toString galleryMeta.uuid) config.galleries of
        Just gallery ->
            [ Gallery.view config gallery ]

        Nothing ->
            if config.editMode then
                [ column
                    ([ width (px 400)
                     , Background.color grey6
                     , Border.rounded 5
                     , centerX
                     ]
                        ++ renderAttrs config attrs
                    )
                    [ row
                        [ width fill
                        , paddingXY 15 5
                        ]
                        [ el
                            [ Font.size 16
                            , Font.color (rgb 0 0.5 0)
                            , Font.bold
                            ]
                            (text <| String.Extra.toSentenceCase galleryMeta.title)
                        , el
                            [ alignRight ]
                            (text <|
                                (String.fromInt <|
                                    List.length galleryMeta.images
                                )
                                    ++ " images"
                            )
                        ]
                    , el
                        [ Background.color grey7 ]
                        (el
                            [ width (px 400)
                            , height (px <| round (400 / 1.333333))
                            , Background.uncropped <|
                                case
                                    List.head galleryMeta.images
                                        |> Maybe.map .src
                                of
                                    Just (UrlSrc src) ->
                                        src

                                    _ ->
                                        ""
                            ]
                            Element.none
                        )
                    ]
                ]

            else
                []


renderMurolInfo config id attrs =
    case config.publications of
        Nothing ->
            [ el
                [ width fill
                , Background.color grey6
                , paddingXY 0 7
                , Font.center
                ]
                (text "Murol infos")
            ]

        Just { murolInfos } ->
            [ PublicationsView.murolInfosView config ]


renderDelib config id attrs =
    case config.publications of
        Nothing ->
            [ el
                [ width fill
                , Background.color grey6
                , paddingXY 0 7
                , Font.center
                ]
                (text "Délibérations")
            ]

        Just { delibs } ->
            [ PublicationsView.delibsView config ]


renderBulletin config id attrs =
    case config.publications of
        Nothing ->
            [ el
                [ width fill
                , Background.color grey6
                , paddingXY 0 7
                , Font.center
                ]
                (text "Bulletins municipaux")
            ]

        Just { delibs } ->
            [ PublicationsView.bulletinsView config ]


renderEmptyCell config id attrs =
    let
        styleSheet =
            defaultStyleSheet config
    in
    [ row
        ([ width fill
         , height (px 100)
         , Background.color (rgba 0 0 1 0.2)
         ]
            ++ idStyle styleSheet id
            ++ renderAttrs config attrs
        )
        [ el
            [ centerX
            , centerY
            ]
            (text "Cellule vide")
        ]
    ]


idStyle { customStyles } { uid, docStyleId, htmlId, classes } =
    (docStyleId
        |> Maybe.andThen
            (\id ->
                Dict.get
                    id
                    customStyles.idNbrs
            )
        |> Maybe.withDefault []
    )
        ++ (htmlId
                |> Maybe.map
                    (\hid ->
                        [ htmlAttribute <| Attr.id hid ]
                    )
                |> Maybe.withDefault []
           )
        ++ (List.filterMap
                (\c ->
                    Dict.get
                        c
                        customStyles.classes
                )
                (Set.toList classes)
                |> List.concat
           )



-------------------------------------------------------------------------------


renderAttrs : Config msg -> List DocAttribute -> List (Element.Attribute msg)
renderAttrs config attrs =
    let
        device =
            getDevice config

        renderAttr attr =
            case attr of
                PaddingEach pad ->
                    [ paddingEach pad ]

                SpacingXY spcX spcY ->
                    [ spacingXY spcX spcY ]

                AlignRight ->
                    if
                        device.class == Phone || device.class == Tablet
                        --&& device.orientation
                        --== Portrait
                    then
                        [ centerX ]

                    else
                        [ alignRight
                        , paddingEach
                            { top = 0
                            , right = 0
                            , bottom = 0
                            , left = 15
                            }
                        ]
                            ++ (if config.editMode then
                                    [ htmlAttribute <| Attr.style "z-index" "1" ]

                                else
                                    []
                               )

                AlignLeft ->
                    if
                        device.class == Phone || device.class == Tablet
                        --&& device.orientation
                        --== Portrait
                    then
                        [ centerX ]

                    else
                        [ alignLeft
                        , paddingEach
                            { top = 0
                            , right = 15
                            , bottom = 0
                            , left = 0
                            }
                        ]
                            ++ (if config.editMode then
                                    [ htmlAttribute <| Attr.style "z-index" "1" ]

                                else
                                    []
                               )

                Pointer ->
                    [ pointer ]

                BackgroundColor color ->
                    [ Background.color (toSeColor color) ]

                Width n ->
                    [ width (px n) ]

                Height n ->
                    [ height (px n) ]

                WidthShrink ->
                    case device.class of
                        Phone ->
                            []

                        Tablet ->
                            []

                        _ ->
                            [ width shrink ]

                WidthFill ->
                    [ width fill ]

                FillPortion n ->
                    [ width (fillPortion n) ]

                Border ->
                    [ Border.color (rgb 127 127 127)
                    , Border.width 1
                    , Border.solid
                    ]

                FontColor color ->
                    [ Font.color (toSeColor color) ]

                Font s ->
                    [ Font.family [ Font.typeface s ] ]

                FontAlignRight ->
                    [ Font.alignRight ]

                FontAlignLeft ->
                    [ Font.alignLeft
                    ]

                FontSize n ->
                    [ Font.size n ]

                Center ->
                    [ Font.center ]

                Justify ->
                    [ Font.justify ]

                Bold ->
                    [ Font.bold ]

                Italic ->
                    [ Font.italic ]

                Other _ ->
                    []

                ZipperAttr uid zipperEventHandler ->
                    case config.zipperHandlers of
                        Nothing ->
                            []

                        Just handlers ->
                            case zipperEventHandler of
                                OnContainerClick ->
                                    [ Events.onClick (handlers.containerClickHandler uid)

                                    --, Background.color (rgba 0 1 0 0.2)
                                    ]

                                OnContainerDblClick ->
                                    [ Events.onDoubleClick (handlers.containerDblClickHandler uid) ]

                                OnContainerMouseOver ->
                                    [ mouseOver
                                        [ Background.color <| rgba 0.8 0.8 0.8 0.5 ]
                                    , pointer
                                    , htmlAttribute <| Attr.style "transition" "0.3s"
                                    ]

                                OnCellClick ->
                                    [ pointer
                                    , mouseOver
                                        [ Background.color <| rgba 0.8 0.8 0.8 0.5 ]
                                    , htmlAttribute <| Attr.style "transition" "0.3s"
                                    , Events.onDoubleClick handlers.cellClick

                                    --, Background.color (rgba 0 0 1 0.2)
                                    ]

                                OnNeighbourClick ->
                                    [ Events.onClick (handlers.neighbourClickHandler uid)
                                    , pointer

                                    --, Border.width 1
                                    --, Border.color (rgb 1 0 0)
                                    ]
    in
    List.concatMap renderAttr attrs
