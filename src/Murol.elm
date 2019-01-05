port module Murol exposing (..)

--import Gallery.Image as GImage

import Browser exposing (..)
import Browser.Dom as Dom
import Browser.Events exposing (onResize)
import Browser.Navigation as Nav
import Dict exposing (..)
import Document.Document as Document
import Document.DocumentViews.DocumentResponsive exposing (responsivePreFormat)
import Document.DocumentViews.DocumentView exposing (Config, customHeading, renderDoc)
import Document.DocumentViews.StyleSheets as StyleSheets exposing (..)
import Document.Json.DocumentDecoder exposing (decodeNews)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Region as Region
import Gallery.Gallery as Gallery
import Gallery.HeaderGallery as HeaderGallery
import GeneralDirectoryEditor.GeneralDirCommonTypes exposing (Fiche)
import GeneralDirectoryEditor.GeneralDirJson exposing (..)
import Html as Html
import Html.Attributes as Attr
import Html.Events as HtmlEvents
import Http exposing (..)
import Internals.CommonStyleHelpers exposing (blockLinkGrey, buttonStyle)
import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode
import PageTreeEditor.PageTreeEditor as PageTreeEditor
import Set exposing (..)
import String.Extra exposing (toSentenceCase)
import Task exposing (attempt, perform)
import Time exposing (Month(..), Posix, here, millisToPosix, now, posixToMillis, utc)
import UUID exposing (UUID, canonical)
import Url exposing (..)


port toSearchEngine : String -> Cmd msg


port searchResult : (String -> msg) -> Sub msg


type alias Model =
    { config : Config Msg
    , key : Nav.Key
    , url : Url.Url
    , pages : Pages
    , searchStr : String
    , results : Maybe SearchResult
    , searchEngineStatus : SearchEngineStatus
    , pageTree : Maybe PageTreeEditor.Page
    , debug : String
    , unfoldedTopic : Maybe String
    , initialLoadDone : Bool
    , headerGallery : HeaderGallery.Model Msg
    }


type alias ContentIdStr =
    String


type alias PathStr =
    String


type alias PageName =
    String


type alias Keyword =
    String


type alias Pages =
    Dict.Dict PathStr ( ContentIdStr, PageName, LoadingStatus )


type alias SearchResult =
    ( List Keyword, Dict ContentIdStr ( Int, Set Keyword ) )


type SearchEngineStatus
    = Standby
    | Searching
    | DisplayResult


type Msg
    = ChangeUrl Url.Url
    | ClickedLink UrlRequest
    | LoadContent ( PathStr, ContentIdStr, PageName ) (Result Http.Error Decode.Value)
    | LoadPages (Result Http.Error Decode.Value)
    | LoadFiches (Result Http.Error (List Fiche))
    | LoadNews (Result Http.Error (List Document.News))
    | SearchPromptInput String
    | Search
    | ResetSearchEngine
    | ProcessSearchResult String
    | SetTime Posix
    | SetSeason StyleSheets.Season
    | WinResize Int Int
    | ToogleFiche String
    | ToogleNews String
    | FoldTopic
    | UnfoldTopic String
    | SetZone Time.Zone
    | HGmsg HeaderGallery.Msg
    | NoOp


type LoadingStatus
    = NotLoaded
    | Loading
    | Loaded Document.Document
    | LoadingFailure


type alias Flags =
    { currentTime : Int
    , width : Int
    , height : Int
    }


main : Program Flags Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlRequest = ClickedLink
        , onUrlChange = ChangeUrl
        }


subscriptions model =
    Sub.batch
        [ onResize WinResize
        , searchResult ProcessSearchResult
        , Sub.map HGmsg (HeaderGallery.subscriptions model.headerGallery)
        ]


init : Flags -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url key =
    let
        season =
            StyleSheets.timeToSeason utc (Time.millisToPosix flags.currentTime)

        config =
            { containersBkgColors = False
            , customElems = Dict.empty
            , editMode = False
            , height = flags.height
            , width = flags.width
            , mainInterfaceHeight = 0
            , zipperHandlers = Nothing
            , season = season
            , currentTime = Time.millisToPosix flags.currentTime
            , zone = Time.utc
            , pageIndex = Dict.empty
            , fiches = Dict.empty
            , openedFiches = Set.empty
            , openFicheMsg = ToogleFiche
            , news = Dict.empty
            , openedNews = Set.empty
            , openNewsMsg = ToogleNews
            , previewMode = PreviewScreen
            , galleries = Dict.empty
            }

        url_ =
            if url.path == "/" then
                { url | path = "/accueil" }
            else
                url
    in
    ( { config = config
      , key = key
      , pageTree = Nothing
      , pages = Dict.empty
      , searchStr = ""
      , results = Nothing
      , searchEngineStatus = Standby
      , url = url_
      , debug = ""
      , unfoldedTopic = Nothing
      , initialLoadDone = False
      , headerGallery =
            HeaderGallery.init
                (List.map
                    (\n -> String.padLeft 3 '0' (String.fromInt n))
                    (List.range 1 5)
                    |> List.map
                        (\s ->
                            "/assets/images/headerGallery/"
                                ++ seasonToStr season
                                ++ "/"
                                ++ s
                                ++ "-min.jpg"
                        )
                )
                HGmsg
      }
    , Cmd.batch
        [ getPages
        , if url /= url_ then
            Nav.pushUrl key (Url.toString url_)
          else
            Cmd.none
        , Task.perform SetTime Time.now
        , Task.perform SetZone Time.here
        , Time.now
            |> Task.andThen
                (\t ->
                    Time.here
                        |> Task.andThen
                            (\h ->
                                Task.succeed (StyleSheets.timeToSeason h t)
                            )
                )
            |> Task.perform SetSeason
        ]
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ClickedLink urlRequest ->
            case urlRequest of
                Internal url ->
                    ( model
                    , Nav.pushUrl
                        model.key
                        (Url.toString url)
                    )

                External url ->
                    ( model
                    , Nav.load url
                    )

        ChangeUrl url ->
            case Dict.get url.path model.pages of
                Just ( cId, name, NotLoaded ) ->
                    ( { model
                        | pages =
                            Dict.insert
                                url.path
                                ( cId, name, Loading )
                                model.pages
                        , url = url
                      }
                    , Cmd.batch
                        [ getContent ( url.path, cId, name )
                        , Task.attempt (\_ -> NoOp)
                            (Dom.setViewportOf "mainContainer" 0 0)
                        ]
                    )

                Just _ ->
                    ( { model | url = url }
                    , Cmd.none
                    )

                Nothing ->
                    ( { model | url = url }
                    , Cmd.none
                    )

        LoadPages res ->
            case res of
                Ok jsonVal ->
                    case Decode.decodeValue decodePages jsonVal of
                        Ok ( pages, pageTree ) ->
                            let
                                pageIndex =
                                    Dict.foldr
                                        (\path ( cId, _, _ ) acc ->
                                            Dict.insert cId path acc
                                        )
                                        Dict.empty
                                        pages

                                config =
                                    model.config
                            in
                            ( { model
                                | pages = pages
                                , pageTree = Just pageTree
                                , config = { config | pageIndex = pageIndex }
                              }
                            , case Dict.get model.url.path pages of
                                Just ( cId, name, NotLoaded ) ->
                                    getContent ( model.url.path, cId, name )

                                Just _ ->
                                    Cmd.none

                                Nothing ->
                                    let
                                        url =
                                            model.url
                                    in
                                    Nav.pushUrl model.key (Url.toString { url | path = "/accueil" })
                            )

                        _ ->
                            ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        LoadContent ( path, cId, name ) res ->
            case res of
                Ok jsonVal ->
                    case Decode.decodeValue PageTreeEditor.decodeContent jsonVal of
                        Ok { contentId, docContent } ->
                            let
                                fichesIds =
                                    Document.gatherFichesIds docContent

                                fichesToDownload =
                                    List.foldr
                                        (\id acc ->
                                            if Dict.member id model.config.fiches then
                                                acc
                                            else
                                                id :: acc
                                        )
                                        []
                                        fichesIds
                            in
                            ( { model
                                | pages =
                                    Dict.insert path ( cId, name, Loaded docContent ) model.pages
                                , initialLoadDone = True
                              }
                            , if fichesToDownload /= [] then
                                getFiches fichesToDownload
                              else
                                Cmd.none
                            )

                        _ ->
                            ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        LoadFiches res ->
            case res of
                Ok fiches ->
                    let
                        config =
                            model.config

                        newFiches =
                            List.foldr
                                (\f acc ->
                                    Dict.insert (canonical f.uuid) f acc
                                )
                                config.fiches
                                fiches

                        newConfig =
                            { config | fiches = newFiches }
                    in
                    ( { model | config = newConfig }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        LoadNews res ->
            case res of
                Ok news ->
                    let
                        config =
                            model.config

                        newsDict =
                            List.foldr
                                (\n acc ->
                                    Dict.insert (canonical n.uuid) n acc
                                )
                                Dict.empty
                                news

                        newConfig =
                            { config | news = newsDict }
                    in
                    ( { model | config = newConfig }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        SearchPromptInput s ->
            ( { model
                | searchStr = s
              }
            , toSearchEngine
                (Encode.object
                    [ ( "SearchStr", Encode.string s ) ]
                    |> Encode.encode 0
                )
            )

        Search ->
            ( { model | searchEngineStatus = Searching }
            , toSearchEngine
                (Encode.string "<Cmd -> Search>"
                    |> Encode.encode 0
                )
            )

        ResetSearchEngine ->
            ( { model
                | searchEngineStatus = Standby
                , searchStr = ""
              }
            , toSearchEngine
                (Encode.string "<Cmd -> Reset>"
                    |> Encode.encode 0
                )
            )

        ProcessSearchResult s ->
            ( { model
                | searchEngineStatus = DisplayResult
                , results =
                    Decode.decodeString decodeSearchResults s
                        |> Result.toMaybe
              }
            , Cmd.none
            )

        SetTime t ->
            let
                config =
                    model.config
            in
            ( { model
                | config =
                    { config | currentTime = t }
              }
            , getNews t
            )

        SetSeason season ->
            let
                config =
                    model.config
            in
            ( { model | config = { config | season = season } }
            , Cmd.none
            )

        WinResize width height ->
            let
                cfg =
                    model.config

                newConfig =
                    { cfg | width = width, height = height }
            in
            ( { model | config = newConfig }
            , Cmd.batch
                []
            )

        ToogleFiche fId ->
            let
                config =
                    model.config

                newConfig =
                    { config
                        | openedFiches =
                            if Set.member fId config.openedFiches then
                                Set.remove fId config.openedFiches
                            else
                                Set.insert fId config.openedFiches
                    }
            in
            ( { model | config = newConfig }, Cmd.none )

        ToogleNews nId ->
            let
                config =
                    model.config

                newConfig =
                    { config
                        | openedNews =
                            if Set.member nId config.openedNews then
                                Set.remove nId config.openedNews
                            else
                                Set.insert nId config.openedNews
                    }
            in
            ( { model | config = newConfig }, Cmd.none )

        FoldTopic ->
            ( { model | unfoldedTopic = Nothing }, Cmd.none )

        UnfoldTopic s ->
            ( { model | unfoldedTopic = Just s }, Cmd.none )

        SetZone z ->
            let
                cfg =
                    model.config

                newConfig =
                    { cfg | zone = z }
            in
            ( { model | config = newConfig }, Cmd.none )

        HGmsg hgMsg ->
            ( { model
                | headerGallery =
                    HeaderGallery.update
                        { maxWidth = min 1000 model.config.width }
                        hgMsg
                        model.headerGallery
              }
            , Cmd.none
            )

        NoOp ->
            ( model, Cmd.none )


view : Model -> Browser.Document Msg
view model =
    { title = "La commune de Murol"
    , body =
        let
            maxWidth =
                StyleSheets.docMaxWidth
                    ( model.config.width
                    , model.config.height
                    )
                    False
                    model.config.previewMode

            device =
                Element.classifyDevice
                    { height = model.config.height
                    , width = model.config.width
                    }
        in
        [ Element.layout
            [ width fill
            , Font.size 16
            ]
            (el
                [ width fill
                , height (px model.config.height)
                , clip
                , Background.image (StyleSheets.backgroundImage model.config.season)
                ]
                (column
                    [ width fill
                    , scrollbarY
                    , htmlAttribute <| Attr.style "id" "mainContainer"
                    ]
                    [ pageTitleView maxWidth model
                    , subTitleView maxWidth model
                    , if model.config.width > 500 then
                        HeaderGallery.view { maxWidth = min 1000 model.config.width } model.headerGallery
                      else
                        Element.none
                    , clickablePath maxWidth model
                    , topMenuView model
                    , searchEngineView maxWidth model
                    , mainView maxWidth model
                    , footerView model
                    ]
                )
            )
        ]
    }


searchEngineView maxWidth model =
    let
        pagesIndex =
            Dict.foldr
                (\path ( cId, name, l ) acc ->
                    Dict.insert cId ( name, path ) acc
                )
                Dict.empty
                model.pages
    in
    column
        [ spacing 15
        , centerX
        , width (maximum maxWidth fill)
        , paddingEach
            { top = 15
            , left = 20
            , right = 20
            , bottom = 0
            }
        , Background.color (rgba 1 1 1 0.9)
        ]
        [ row
            [ spacing 15
            , width (maximum maxWidth fill)
            , paddingEach
                { top = 5
                , left = 0
                , right = 0
                , bottom = 0
                }
            ]
            [ Input.text
                [ paddingXY 5 5
                , spacing 15
                , focused [ Border.glow (rgb 1 1 1) 0 ]
                , if model.config.width < 500 then
                    width (px 150)
                  else
                    width (px 270)
                , onKeyEvent
                ]
                { onChange = SearchPromptInput
                , text = model.searchStr
                , placeholder =
                    Just <| Input.placeholder [] (text "mot clés")
                , label = Input.labelLeft [] Element.none
                }
            , Input.button
                (buttonStyle
                    ((model.searchStr /= "")
                        && (model.searchEngineStatus /= Searching)
                    )
                )
                { onPress = Just Search
                , label =
                    el [] (text "Rechercher")
                }
            ]
        , case model.searchEngineStatus of
            Searching ->
                el [ paddingXY 15 0 ] (text "recherche en cours...")

            DisplayResult ->
                case model.results of
                    Just ( keywords, results ) ->
                        if results == Dict.empty then
                            el
                                [ paddingXY 15 0 ]
                                (text "pas de resultats")
                        else
                            column
                                [ width fill
                                , height (maximum 200 fill)
                                , clip
                                , scrollbarY
                                , paddingXY 15 0
                                ]
                                (Dict.map (\cId v -> resView pagesIndex cId v) results
                                    |> Dict.values
                                )

                    Nothing ->
                        el
                            [ paddingXY 15 0 ]
                            (text "pas de resultats")

            _ ->
                Element.none
        ]



--type alias SearchResult =
--    ( List String, Dict String ( Int, Set String ) )


resView : Dict String ( String, String ) -> String -> ( Int, Set String ) -> Element Msg
resView pagesIndex cId ( score, keywords ) =
    case Dict.get cId pagesIndex of
        Just ( name, path ) ->
            let
                keywordView keyword =
                    el
                        [ pointer
                        , Events.onClick (SearchPromptInput keyword)
                        , Background.color (rgba255 119 136 153 0.8)
                        , Font.color (rgb 1 1 1)
                        , paddingEach
                            { top = 2
                            , bottom = 2
                            , left = 5
                            , right = 5
                            }
                        , Border.roundEach
                            { topLeft = 5
                            , topRight = 0
                            , bottomLeft = 0
                            , bottomRight = 0
                            }
                        ]
                        (text keyword)
            in
            column
                [ spacing 10
                , width fill
                , Border.widthEach
                    { top = 1
                    , bottom = 0
                    , left = 0
                    , right = 0
                    }
                , Border.color (rgb 0.8 0.8 0.8)
                , paddingXY 0 10
                ]
                [ link
                    []
                    { url = path
                    , label =
                        el [ Font.color (rgb 0 0.5 0.5) ]
                            (text name)
                    }
                , wrappedRow
                    [ spacing 10 ]
                    (List.map keywordView (Set.toList keywords))
                ]

        Nothing ->
            Element.none


clickablePath maxWidth model =
    let
        strPath path =
            String.join "/" path
                |> (\p -> "/" ++ p)

        getEveryPaths acc path =
            case path of
                [] ->
                    acc

                current :: rest ->
                    getEveryPaths (( current, List.reverse path ) :: acc) rest

        linkView ( n, p ) =
            link
                [ paddingXY 2 4
                , mouseOver
                    [ Font.color (rgba 0.3 0.4 0.6 0.5) ]
                ]
                { url = strPath p
                , label =
                    el [] (text <| toSentenceCase (Maybe.withDefault n (Url.percentDecode n)))
                }
    in
    column
        [ paddingXY 15 10
        , Background.color (rgb 0.95 0.95 0.95)
        , width (maximum maxWidth fill)
        , centerX
        ]
        [ wrappedRow
            [ width fill
            , Background.color (rgb 1 1 1)
            , padding 4
            , Border.rounded 5
            , Font.family
                [ Font.typeface "Roboto" ]
            ]
            (String.split "/" (String.dropLeft 1 model.url.path)
                |> List.reverse
                |> getEveryPaths []
                |> List.map linkView
                |> List.intersperse (el [ Font.color (rgb 0.5 0.5 0.5) ] (text "/"))
                |> (\res -> el [ Font.color (rgb 0.5 0.5 0.5) ] (text "/") :: res)
            )
        ]


pageTitleView maxWidth model =
    let
        seasonAttr =
            case model.config.season of
                Spring ->
                    [ Background.color (rgba255 76 115 56 255) ]

                Summer ->
                    [ Background.color (rgba255 19 46 117 255)
                    , Font.color (rgba255 240 248 255 1)
                    ]

                Autumn ->
                    [ Background.color (rgba255 255 211 37 255) ]

                Winter ->
                    [ Background.color (rgba255 0 0 51 255)
                    , Font.color (rgba255 240 248 255 1)
                    ]
    in
    link
        ([ Font.size 45
         , Font.center
         , width (maximum maxWidth fill)
         , centerX
         , Font.italic
         , Font.family
            [ Font.typeface "lora"
            , Font.serif
            ]
         , paddingEach
            { top = 7
            , bottom = 10
            , left = 0
            , right = 0
            }
         ]
            ++ seasonAttr
        )
        { label = text "Murol"
        , url = "/accueil"
        }


subTitleView maxWidth model =
    let
        seasonAttr =
            case model.config.season of
                Spring ->
                    [ Background.color (rgba255 41 80 0 1)
                    , Font.color (rgba255 240 248 255 255)
                    ]

                Summer ->
                    [ Background.color (rgba255 38 110 182 1)
                    , Font.color (rgba255 240 248 255 1)
                    ]

                Autumn ->
                    [ Background.color (rgba255 69 22 6 1)
                    , Font.color (rgba255 240 248 255 255)
                    ]

                Winter ->
                    [ Background.color (rgba255 240 248 255 1)
                    , Font.color (rgba255 0 0 51 255)
                    ]
    in
    el
        ([ Font.size 24
         , Font.family
            [ Font.typeface "lora"
            , Font.serif
            ]
         , Font.center
         , Font.italic
         , width (maximum maxWidth fill)
         , centerX
         , paddingEach
            { top = 3
            , left = 0
            , right = 0
            , bottom = 8
            }
         ]
            ++ seasonAttr
        )
        (paragraph
            []
            [ if Time.toMonth model.config.zone model.config.currentTime == Jan then
                text <|
                    "La municipalité de Murol vous souhaite une bonne année "
                        ++ String.fromInt (Time.toYear model.config.zone model.config.currentTime)
              else
                text "La municipalité de Murol vous souhaite la bienvenue"
            ]
        )


mainView maxWidth model =
    let
        loadingView =
            column
                [ centerX
                , width (maximum maxWidth fill)
                , Background.color (rgba 1 1 1 0.9)
                , clipX
                , padding 15
                , height (px 300)
                ]
                [ column
                    [ centerY
                    , centerX
                    , spacing 15
                    ]
                    [ el
                        [ centerX
                        , width (px 100)
                        , height (px 100)
                        , Background.image "/assets/images/loading.gif"
                        ]
                        Element.none
                    , el [ centerX ]
                        (text "Chargement en cours...")
                    ]
                ]
    in
    case Dict.get model.url.path model.pages of
        Just ( cId, name, Loaded doc ) ->
            column
                [ centerX
                , width (maximum maxWidth fill)
                , Background.color (rgba 1 1 1 0.9)
                , clipX
                ]
                (responsivePreFormat model.config doc
                    |> renderDoc model.config
                )

        Just ( cId, name, Loading ) ->
            loadingView

        _ ->
            if model.initialLoadDone then
                el
                    [ centerX
                    , width (maximum maxWidth fill)
                    , Background.color (rgba 1 1 1 0.9)
                    , padding 15
                    , height (px 300)
                    ]
                    (text "Pas de contenu.")
            else
                loadingView



-------------------------------------------------------------------------------
------------------------
-- Top menu functions --
------------------------


topMenuView model =
    case model.pageTree of
        Just (PageTreeEditor.Page _ xs_) ->
            let
                maxWidth =
                    StyleSheets.docMaxWidth
                        ( model.config.width
                        , model.config.height
                        )
                        False
                        model.config.previewMode

                strPath path =
                    List.map Url.percentEncode path
                        |> String.join "/"
                        |> (\p -> "/" ++ p)

                mainCatView (PageTreeEditor.Page pageInfo xs) =
                    column
                        [ alignTop
                        , if model.config.width >= 1000 then
                            Events.onMouseEnter (UnfoldTopic pageInfo.name)
                          else
                            noAttr
                        , if model.config.width >= 1000 then
                            Events.onMouseLeave FoldTopic
                          else
                            noAttr
                        , if model.unfoldedTopic == Just pageInfo.name then
                            below
                                (column
                                    []
                                    (List.map subCatView xs)
                                )
                          else
                            noAttr
                        ]
                        [ el
                            [ mouseOver
                                [ topMenuStyle model.config.season
                                    |> .hover
                                    |> Background.color
                                ]
                            , width fill
                            ]
                          <|
                            link
                                [ width fill
                                , padding 15
                                ]
                                { url =
                                    strPath pageInfo.path
                                , label =
                                    el
                                        [ Font.bold ]
                                        (text <| toSentenceCase pageInfo.name)
                                }
                        ]

                mobileMainCatView (PageTreeEditor.Page pageInfo xs) =
                    el
                        [ mouseOver
                            [ topMenuStyle model.config.season
                                |> .hover
                                |> Background.color
                            ]
                        , topMenuStyle model.config.season
                            |> .background
                            |> Background.color
                        , topMenuStyle model.config.season
                            |> .fontColor
                            |> Font.color
                        , width fill
                        ]
                    <|
                        link
                            [ width fill
                            , padding 15
                            ]
                            { url =
                                strPath pageInfo.path
                            , label =
                                el
                                    [ Font.bold ]
                                    (text <| toSentenceCase pageInfo.name)
                            }

                subCatView (PageTreeEditor.Page pageInfo _) =
                    el
                        [ topMenuStyle model.config.season
                            |> .subCatBackground
                            |> Background.color
                        , mouseOver
                            [ topMenuStyle model.config.season
                                |> .hover
                                |> Background.color
                            ]
                        , width fill
                        ]
                    <|
                        link
                            [ width fill
                            , padding 10
                            , topMenuStyle model.config.season
                                |> .fontColor
                                |> Font.color
                            ]
                            { url =
                                strPath pageInfo.path
                            , label =
                                el
                                    []
                                    (text <| toSentenceCase pageInfo.name)
                            }
            in
            if model.config.width <= 600 then
                column
                    [ width (maximum maxWidth fill)
                    , spacing 5
                    , paddingXY 15 0
                    , Background.color (rgba 1 1 1 0.9)
                    ]
                    (List.map mobileMainCatView xs_)
            else
                row
                    [ centerX
                    , width (maximum maxWidth fill)
                    , topMenuStyle model.config.season
                        |> .background
                        |> Background.color
                    ]
                    [ row
                        [ centerX
                        , spacing 40
                        ]
                        (List.map mainCatView xs_)
                    ]

        Nothing ->
            Element.none


type alias TopMenuStyle =
    { background : Color
    , subCatBackground : Color
    , hover : Color
    , fontColor : Color
    }


topMenuStyle : Season -> TopMenuStyle
topMenuStyle season =
    case season of
        Spring ->
            { background = rgba255 76 115 56 1
            , subCatBackground = rgba255 206 222 191 1
            , hover = rgba255 226 242 211 1
            , fontColor = rgba255 0 0 0 1
            }

        Summer ->
            { background = rgba255 186 172 145 1
            , subCatBackground = rgba255 196 182 155 1
            , hover = rgba255 206 192 165 1
            , fontColor = rgba255 0 0 0 1
            }

        Autumn ->
            { background = rgba255 255 211 37 1
            , subCatBackground = rgba255 229 189 33 1
            , hover = rgba255 255 237 167 1
            , fontColor = rgba255 0 0 0 1
            }

        Winter ->
            { background = rgba255 128 128 170 1
            , subCatBackground = rgba255 197 200 248 1
            , hover = rgba255 227 233 255 1
            , fontColor = rgba255 0 0 0 1
            }



-------------------------------------------------------------------------------
----------------------
-- Footer functions --
----------------------


footerView model =
    case model.pageTree of
        Just (PageTreeEditor.Page _ xs_) ->
            let
                strPath path =
                    List.map Url.percentEncode path
                        |> String.join "/"
                        |> (\p -> "/" ++ p)

                mainCatView (PageTreeEditor.Page pageInfo xs) =
                    column
                        [ alignTop
                        , height fill
                        , paddingXY 0 5
                        ]
                        [ link
                            [ paddingEach
                                { top = 10
                                , left = 0
                                , right = 0
                                , bottom = 10
                                }
                            , mouseOver
                                [ footerStyle model.config.season
                                    |> .hover
                                    |> Background.color
                                ]
                            , width fill
                            ]
                            { url =
                                strPath pageInfo.path
                            , label =
                                row
                                    [ spacing 6 ]
                                    [ el
                                        [ Font.size 24 ]
                                        (text "›")
                                    , el
                                        [ Font.bold
                                        , Font.underline
                                        ]
                                        (text <| toSentenceCase pageInfo.name)
                                    ]
                            }
                        , column
                            [ height fill
                            ]
                            (List.map subCatView xs)
                        ]

                subCatView (PageTreeEditor.Page pageInfo _) =
                    link
                        [ mouseOver
                            [ footerStyle model.config.season
                                |> .hover
                                |> Background.color
                            ]
                        , width fill
                        ]
                        { url =
                            strPath pageInfo.path
                        , label =
                            row
                                []
                                [ el
                                    [ Font.size 24 ]
                                    (text "›")
                                , el
                                    [ padding 6 ]
                                    (text <| toSentenceCase pageInfo.name)
                                ]
                        }

                maxWidth =
                    StyleSheets.docMaxWidth
                        ( model.config.width
                        , model.config.height
                        )
                        False
                        model.config.previewMode
            in
            column
                [ width fill ]
                [ row
                    [ footerStyle model.config.season
                        |> .frameBackground
                        |> Background.color
                    , width (maximum maxWidth fill)
                    , centerX
                    , paddingXY 15 5
                    ]
                    [ el
                        [ footerStyle model.config.season
                            |> .frameFontColor
                            |> Font.color
                        , Font.size 18
                        ]
                        (text "Raccourcis pages principales: ")
                    ]
                , wrappedRow
                    [ width (maximum maxWidth fill)
                    , centerX
                    , spaceEvenly
                    , footerStyle model.config.season
                        |> .background
                        |> Background.color
                    , paddingXY 15 0
                    ]
                    (List.map mainCatView xs_)
                , wrappedRow
                    [ footerStyle model.config.season
                        |> .frameBackground
                        |> Background.color
                    , width (maximum maxWidth fill)
                    , centerX
                    , spaceEvenly
                    , paddingXY 15 5
                    ]
                    [ link [ paddingXY 0 5 ]
                        { url = ""
                        , label =
                            el
                                [ footerStyle model.config.season
                                    |> .frameFontColor
                                    |> Font.color
                                , Font.underline
                                ]
                                (text "Plan de site")
                        }
                    , link [ paddingXY 0 5 ]
                        { url = ""
                        , label =
                            el
                                [ Font.color (rgb 1 1 1)
                                , Font.underline
                                ]
                                (text "Contacter le webmaster")
                        }
                    , link [ paddingXY 0 5 ]
                        { url = ""
                        , label =
                            el
                                [ Font.color (rgb 1 1 1)
                                , Font.underline
                                ]
                                (text "Mentions légales")
                        }
                    ]
                ]

        Nothing ->
            Element.none


footerStyle season =
    case season of
        Spring ->
            { background = rgba255 76 115 56 1
            , hover = rgba255 226 242 211 0.6
            , fontColor = rgba255 0 0 0 1
            , frameBackground = rgba255 41 80 0 1
            , frameFontColor = rgba 255 248 255 1
            }

        Summer ->
            { background = rgba255 186 172 145 1
            , hover = rgba255 226 242 211 1
            , fontColor = rgba255 0 0 0 1
            , frameBackground = rgba255 38 110 182 1
            , frameFontColor = rgba 255 248 255 1
            }

        Autumn ->
            { background = rgba255 255 211 37 1
            , hover = rgba255 255 237 167 1
            , fontColor = rgba255 0 0 0 1
            , frameBackground = rgba255 69 22 6 255
            , frameFontColor = rgba255 240 248 255 1
            }

        Winter ->
            { background = rgba255 128 128 170 1
            , hover = rgba255 227 233 255 1
            , fontColor = rgba255 0 0 0 1
            , frameBackground = rgba255 51 51 102 1
            , frameFontColor = rgba255 240 248 255 1
            }



-------------------------------------------------------------------------------


seasonSelectorView model =
    row
        [ alignTop
        , alignRight
        ]
        [ Input.button
            []
            { onPress = Just (SetSeason Spring)
            , label = text "P"
            }
        , Input.button
            []
            { onPress = Just (SetSeason Summer)
            , label = text "E"
            }
        , Input.button
            []
            { onPress = Just (SetSeason Autumn)
            , label = text "A"
            }
        , Input.button
            []
            { onPress = Just (SetSeason Winter)
            , label = text "H"
            }
        ]



-------------------------------------------------------------------------------
--------------------
-- Http functions --
--------------------


getPages : Cmd Msg
getPages =
    let
        body =
            Encode.object
                []
                |> Http.jsonBody
    in
    Http.post
        { url = "/getPageTree.php"
        , body = body
        , expect = Http.expectJson LoadPages Decode.value
        }


getContent : ( String, String, String ) -> Cmd Msg
getContent ( path, contentId, name ) =
    let
        body =
            Encode.object
                [ ( "contentId", Encode.string contentId ) ]
                |> Http.jsonBody
    in
    Http.post
        { url = "/getContent.php"
        , body = body
        , expect =
            Http.expectJson
                (LoadContent ( path, contentId, name ))
                Decode.value
        }


getFiches : List String -> Cmd Msg
getFiches fichesIds =
    let
        body =
            Encode.object
                [ ( "fichesIds", Encode.list Encode.string fichesIds )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "/getFiche.php"
        , body = body
        , expect =
            Http.expectJson
                LoadFiches
                (Decode.list decodeFiche)
        }


getNews : Posix -> Cmd Msg
getNews currentTime =
    let
        body =
            Encode.object
                [ ( "currentTime"
                  , Encode.int (posixToMillis currentTime)
                  )
                ]
                |> Http.jsonBody
    in
    Http.post
        { url = "/getNews.php"
        , body = body
        , expect =
            Http.expectJson
                LoadNews
                (Decode.list decodeNews)
        }



-------------------------------------------------------------------------------
-------------------
-- Json Decoders --
-------------------


decodePages : Decode.Decoder ( Pages, PageTreeEditor.Page )
decodePages =
    PageTreeEditor.decodePage
        |> Decode.map
            (\p ->
                ( pageToPages p
                , p
                )
            )


pageToPages : PageTreeEditor.Page -> Pages
pageToPages page =
    let
        toList (PageTreeEditor.Page pageInfo xs) =
            case pageInfo.mbContentId of
                Nothing ->
                    List.concatMap toList xs

                Just contentId ->
                    let
                        strPath path =
                            List.map Url.percentEncode path
                                |> String.join "/"
                                --String.join "/" path
                                |> (\p -> "/" ++ p)
                    in
                    ( strPath pageInfo.path, pageInfo.name, canonical contentId ) :: List.concatMap toList xs
    in
    toList page
        |> List.map (\( p, n, cId ) -> ( p, ( cId, n, NotLoaded ) ))
        |> Dict.fromList


decodeSearchResults : Decode.Decoder SearchResult
decodeSearchResults =
    let
        decodeRes =
            Decode.succeed (\s k -> ( s, Set.fromList k ))
                |> Pipeline.required "score" Decode.int
                |> Pipeline.required "keywords" (Decode.list Decode.string)
    in
    Decode.succeed (\k r -> ( k, r ))
        |> Pipeline.required "keywords" (Decode.list Decode.string)
        |> Pipeline.required "results"
            (Decode.dict decodeRes)



-------------------------------------------------------------------------------
----------
-- Misc --
----------


onKeyEvent : Attribute Msg
onKeyEvent =
    HtmlEvents.on "keyup"
        (Decode.map
            (\kc ->
                if kc == 13 then
                    Search
                else if kc == 27 then
                    ResetSearchEngine
                else
                    NoOp
            )
            HtmlEvents.keyCode
        )
        |> htmlAttribute


onEnter : Msg -> Attribute Msg
onEnter msg =
    HtmlEvents.on "keyup"
        (Decode.map
            (\kc ->
                if kc == 13 then
                    msg
                else
                    NoOp
            )
            HtmlEvents.keyCode
        )
        |> htmlAttribute


onEscape : Msg -> Attribute Msg
onEscape msg =
    HtmlEvents.on "keyup"
        (Decode.map
            (\kc ->
                if kc == 27 then
                    msg
                else
                    NoOp
            )
            HtmlEvents.keyCode
        )
        |> htmlAttribute


noAttr =
    htmlAttribute <| Attr.class ""
