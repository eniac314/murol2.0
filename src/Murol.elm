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
import Http exposing (..)
import Internals.SearchEngine exposing (..)
import Json.Decode as Decode
import Json.Encode as Encode
import PageTreeEditor.PageTreeEditor as PageTreeEditor
import Set exposing (..)
import Task exposing (perform)
import Time exposing (here, now)
import UUID exposing (UUID, canonical)
import Url exposing (..)


port searchStr : String -> Cmd msg


port searchResult : (String -> msg) -> Sub msg


type alias Model =
    { config : Document.Config Msg
    , key : Nav.Key
    , url : Url.Url
    , pages : Pages
    , keywords : Set ( String, String )
    , searchStr : String
    , searchWords : List String
    , results : Maybe ( List String, Dict String ( Int, Set String ) )
    , pageTree : Maybe PageTreeEditor.Page
    }


type alias Pages =
    Dict.Dict String ( String, LoadingStatus )


type Msg
    = ChangeUrl Url.Url
    | ClickedLink UrlRequest
    | LoadContent ( String, String ) (Result Http.Error Decode.Value)
    | LoadKeywords (Result Http.Error (Set ( String, String )))
    | LoadPages (Result Http.Error Decode.Value)
    | SearchPromptInput String
    | Search
    | SetSeason StyleSheets.Season
    | CurrentViewport Dom.Viewport
    | WinResize Int Int
    | NoOp


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
    Sub.batch [ onResize WinResize ]


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
            , styleSheet = StyleSheets.defaultStyleSheet
            , zipperHandlers = Nothing
            , season = StyleSheets.Spring
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
      , keywords = Set.empty
      , searchStr = ""
      , searchWords = []
      , results = Nothing
      , url = url_
      }
    , Cmd.batch
        [ getPages
        , getKeywords
        , if url /= url_ then
            Nav.pushUrl key (Url.toString url_)
          else
            Cmd.none
        , Task.perform CurrentViewport Dom.getViewport
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
                Just ( cId, NotLoaded ) ->
                    ( { model
                        | pages =
                            Dict.insert
                                url.path
                                ( cId, Loading )
                                model.pages
                        , url = url
                      }
                    , getContent ( url.path, cId )
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
                            ( { model
                                | pages = pages
                                , pageTree = Just pageTree
                              }
                            , case Dict.get model.url.path pages of
                                Just ( cId, NotLoaded ) ->
                                    getContent ( model.url.path, cId )

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

        LoadContent ( path, cId ) res ->
            case res of
                Ok jsonVal ->
                    case Decode.decodeValue PageTreeEditor.decodeContent jsonVal of
                        Ok { contentId, docContent } ->
                            ( { model
                                | pages =
                                    Dict.insert path ( cId, Loaded docContent ) model.pages
                              }
                            , Cmd.none
                            )

                        _ ->
                            ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        LoadKeywords res ->
            case res of
                Ok keywords ->
                    ( { model
                        | keywords = keywords
                      }
                    , Cmd.none
                    )

                Err e ->
                    ( model
                    , Cmd.none
                    )

        SearchPromptInput s ->
            let
                lower =
                    String.toLower s

                wrds =
                    String.words lower
            in
            ( { model
                | searchStr = lower
                , searchWords = wrds
              }
            , Cmd.none
            )

        Search ->
            ( { model
                | results =
                    Just <|
                        searchM Dict.empty
                            (List.filter irrelevant
                                (.searchWords model)
                            )
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
                        | width = round vp.viewport.width + 13
                        , height = round vp.viewport.height + 13
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
        in
        [ Element.layout
            [ width fill
            , Font.size 16
            ]
            (el
                [ width (px model.config.width)
                , height (px model.config.height)
                , clip
                , Background.image (StyleSheets.backgroundImage model.config.season)
                ]
                (column
                    [ width fill
                    , scrollbarY
                    ]
                    [ pageTitleView maxWidth model
                    , subTitleView maxWidth model

                    --, topMenuView model
                    , mainView model
                    , footerView model
                    ]
                )
            )
        ]
    }


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


mainView model =
    case Dict.get model.url.path model.pages of
        Just ( cId, Loaded doc ) ->
            column
                [ centerX

                --, width fill
                , Background.color (rgba 1 1 1 0.9)
                ]
                (responsivePreFormat model.config doc
                    |> renderDoc model.config
                )

        Just ( cId, Loading ) ->
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

        request =
            Http.post "/getPageTree.php" body Decode.value
    in
    Http.send LoadPages request


getContent : ( String, String ) -> Cmd Msg
getContent ( path, contentId ) =
    let
        body =
            Encode.object
                [ ( "contentId", Encode.string contentId ) ]
                |> Http.jsonBody

        request =
            Http.post "/getContent.php" body Decode.value
    in
    Http.send (LoadContent ( path, contentId )) request


getKeywords : Cmd Msg
getKeywords =
    let
        body =
            Encode.object
                []
                |> Http.jsonBody

        request =
            Http.post "getKeywords.php" body PageTreeEditor.decodeKeywords
    in
    Http.send LoadKeywords request



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
                                |> (\p -> "/" ++ p)
                    in
                    ( strPath pageInfo.path, canonical contentId ) :: List.concatMap toList xs
    in
    toList page
        |> List.map (\( p, cId ) -> ( p, ( cId, NotLoaded ) ))
        |> Dict.fromList
