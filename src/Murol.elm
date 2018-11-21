port module Murol exposing (..)

import Browser exposing (..)
import Browser.Dom as Dom
import Browser.Events exposing (onResize)
import Browser.Navigation as Nav
import Dict exposing (..)
import Document.Document as Document
import Document.DocumentViews.DocumentResponsive exposing (responsivePreFormat)
import Document.DocumentViews.DocumentView exposing (renderDoc)
import Document.DocumentViews.StyleSheets as StyleSheets exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Region as Region
import Html as Html
import Html.Attributes as Attr
import Html.Events as HtmlEvents
import Http exposing (..)
import Internals.CommonStyleHelpers exposing (buttonStyle)
import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode
import PageTreeEditor.PageTreeEditor as PageTreeEditor
import Set exposing (..)
import Task exposing (perform, attempt)
import Time exposing (here, now, millisToPosix, Posix)
import UUID exposing (UUID, canonical)
import Url exposing (..)
import GeneralDirectoryEditor.GeneralDirJson exposing (..)
import GeneralDirectoryEditor.GeneralDirCommonTypes exposing (Fiche)


port toSearchEngine : String -> Cmd msg


port searchResult : (String -> msg) -> Sub msg


type alias Model =
    { config : Document.Config Msg
    , key : Nav.Key
    , url : Url.Url
    , pages : Pages
    , searchStr : String
    , results : Maybe SearchResult
    , searchEngineStatus : SearchEngineStatus
    , pageTree : Maybe PageTreeEditor.Page
    , debug : String
    , counter : Int
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
    | SearchPromptInput String
    | Search
    | ResetSearchEngine
    | ProcessSearchResult String
    | SetTime Posix
    | SetSeason StyleSheets.Season
    | CurrentViewport Dom.Viewport
    | WinResize Int Int
    | ToogleFiche String
    | NoOp
    | Increment Time.Posix


type LoadingStatus
    = NotLoaded
    | Loading
    | Loaded Document.Document
    | LoadingFailure


main : Program () Model Msg
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
        ]


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url key =
    let
        config =
            { containersBkgColors = False
            , customElems = Dict.empty
            , editMode = False
            , height = 1080
            , width = 1920
            , mainInterfaceHeight = 0
            , zipperHandlers = Nothing
            , season = StyleSheets.Spring
            , currentTime = Time.millisToPosix 0
            , pageIndex = Dict.empty
            , fiches = Dict.empty
            , openedFiches = Set.empty
            , openFicheMsg = ToogleFiche
            , previewMode = PreviewScreen
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
          , counter = 0
          }
        , Cmd.batch
            [ getPages
            , if url /= url_ then
                Nav.pushUrl key (Url.toString url_)
              else
                Cmd.none
            , Task.perform CurrentViewport Dom.getViewport
            , Task.perform SetTime Time.now
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
                , Cmd.none
                )

        SetSeason season ->
            let
                config =
                    model.config
            in
                ( { model | config = { config | season = season } }
                , Cmd.none
                )

        CurrentViewport vp ->
            let
                ws =
                    model.config
            in
                ( { model
                    | config =
                        { ws
                            | width =
                                round vp.viewport.width
                                --+ 13
                            , height =
                                round vp.viewport.height
                                --+ 13
                        }
                  }
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

        NoOp ->
            ( model, Cmd.none )

        Increment _ ->
            ( { model | counter = 1 + model.counter }, Cmd.none )


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
        in
            [ Element.layout
                [ width fill
                , Font.size 16
                ]
                (el
                    [ width fill
                      --(px model.config.width)
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
                        , searchEngineView maxWidth model
                          --, topMenuView model
                        , clickablePath maxWidth model
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
            , paddingXY 0 15
            , Background.color (rgba 1 1 1 0.9)
            ]
            [ row
                [ spacing 15
                , width (maximum maxWidth fill)
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
                    el [] (text (Maybe.withDefault n (Url.percentDecode n)))
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
                    [ Font.monospace ]
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
                    []

                Autumn ->
                    [ Background.color (rgba255 255 211 37 255) ]

                Winter ->
                    [ Background.color (rgba255 0 0 51 255) ]
    in
        el
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
            (text "Murol")


subTitleView maxWidth model =
    let
        seasonAttr =
            case model.config.season of
                Spring ->
                    [ Background.color (rgba255 41 80 0 255)
                    , Font.color (rgba255 240 248 255 255)
                    ]

                Summer ->
                    []

                Autumn ->
                    [ Background.color (rgba255 69 22 6 255)
                    , Font.color (rgba255 240 248 255 255)
                    ]

                Winter ->
                    [ Background.color (rgba255 240 248 255 255)
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
             , width (maximum maxWidth fill)
             , centerX
             , paddingXY 0 3
             ]
                ++ seasonAttr
            )
            (paragraph
                []
                [ text "La municipalité de Murol vous souhaite la bienvenue" ]
            )


mainView maxWidth model =
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
            el [ centerX ]
                (text "Chargement en cours...")

        _ ->
            el [ centerX ]
                (text "Pas de contenu.")


topMenuView model =
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
                        , padding 15
                        , below
                            (column
                                []
                                (List.map subCatView xs)
                            )
                        ]
                        [ link []
                            { url =
                                strPath pageInfo.path
                            , label =
                                el
                                    [ Font.bold ]
                                    (text pageInfo.name)
                            }
                        ]

                subCatView (PageTreeEditor.Page pageInfo _) =
                    link []
                        { url =
                            strPath pageInfo.path
                        , label =
                            el
                                []
                                (text pageInfo.name)
                        }
            in
                wrappedRow
                    [ width fill
                    , centerX
                    , spaceEvenly
                      --, padding 15
                    ]
                    (List.map mainCatView xs_)

        Nothing ->
            Element.none


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
                        , padding 15
                        ]
                        ([ link []
                            { url =
                                strPath pageInfo.path
                            , label =
                                el
                                    [ Font.bold ]
                                    (text pageInfo.name)
                            }
                         ]
                            ++ List.map subCatView xs
                        )

                subCatView (PageTreeEditor.Page pageInfo _) =
                    link []
                        { url =
                            strPath pageInfo.path
                        , label =
                            el
                                []
                                (text pageInfo.name)
                        }

                maxWidth =
                    StyleSheets.docMaxWidth
                        ( model.config.width
                        , model.config.height
                        )
                        False
                        model.config.previewMode
            in
                wrappedRow
                    [ width (maximum maxWidth fill)
                    , centerX
                    , spaceEvenly
                    , Background.color (rgba 1 1 1 0.9)
                    ]
                    (List.map mainCatView xs_)

        Nothing ->
            Element.none



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
                                |>
                                    (\p -> "/" ++ p)
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
