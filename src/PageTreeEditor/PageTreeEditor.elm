module PageTreeEditor.PageTreeEditor exposing (..)

import Auth.AuthPlugin exposing (LogInfo(..), cmdIfLogged)
import Dict exposing (..)
import Document.Document exposing (..)
import Document.Json.DocumentDecoder exposing (..)
import Document.Json.DocumentSerializer exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Html.Attributes as HtmlAttr
import Http exposing (..)
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.ToolHelpers exposing (..)
import Json.Decode as Decode
import Json.Decode.Extra
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode
import Random
import Task exposing (..)
import Time exposing (Zone, now, posixToMillis)
import UUID exposing (UUID, canonical)


type alias Model msg =
    { pageTree : Maybe PageTree
    , contents : Contents
    , selected : Maybe Page
    , loadedContent : Maybe Content
    , pageTreeSavedStatus : Status
    , contentSavedStatus : Status
    , externalMsg : Msg -> msg
    , pageTreeLoaded : Status
    , contentsLoaded : Status
    , seed : Maybe Random.Seed
    , error : String
    }


loadedContent : Model msg -> Maybe Content
loadedContent model =
    model.loadedContent


type Mode
    = Full
    | Save
    | SaveAs
    | Open


type alias Contents =
    Dict String Content


type alias Content =
    { contentId : UUID
    , jsonContent : Decode.Value
    , docContent : Document
    }


init : (Msg -> msg) -> Model msg
init externalMsg =
    { pageTree = Nothing
    , contents = Dict.empty
    , selected = Nothing
    , loadedContent = Nothing
    , pageTreeSavedStatus = Initial
    , contentSavedStatus = Initial
    , externalMsg = externalMsg
    , pageTreeLoaded = Initial
    , contentsLoaded = Initial
    , seed = Nothing
    , error = ""
    }


load : Model msg -> LogInfo -> Cmd msg
load model logInfo =
    case logInfo of
        LoggedIn { sessionId } ->
            Cmd.map model.externalMsg <|
                Cmd.batch
                    [ getPageTree
                    , getContents sessionId
                    , Task.perform SetInitialSeed Time.now
                    ]

        LoggedOut ->
            Cmd.none


loadingStatus model =
    case ( model.pageTreeLoaded, model.contentsLoaded ) of
        ( Success, Success ) ->
            ToolLoadingSuccess

        ( Failure, _ ) ->
            ToolLoadingFailure "Erreur chargement arborescence"

        ( _, Failure ) ->
            ToolLoadingFailure "Erreur chargement pages"

        _ ->
            ToolLoadingWaiting


loadingView model =
    toolLoadingView "Chargement de la stucture du site: "
        { loadingStatus = loadingStatus model }


type Msg
    = SelectPage Page
    | RefreshContents (Result Http.Error Decode.Value)
    | RefreshPageTree (Result Http.Error PageTree)
    | SavePageTree
    | PageTreeSaved (Result Http.Error Bool)
    | SaveContent
    | ContentSaved (Result Http.Error Bool)
    | SetInitialSeed Time.Posix
    | NoOp


update :
    { a
        | logInfo : LogInfo
        , currentDocument : Document
    }
    -> Msg
    -> Model msg
    -> ( Model msg, Cmd msg )
update config msg model =
    let
        ( newModel, cmds ) =
            internalUpdate config msg model
    in
    ( newModel, Cmd.map model.externalMsg cmds )


internalUpdate :
    { a
        | logInfo : LogInfo
        , currentDocument : Document
    }
    -> Msg
    -> Model msg
    -> ( Model msg, Cmd Msg )
internalUpdate config msg model =
    case msg of
        SelectPage ((Page pageInfo xs) as page) ->
            ( { model
                | selected = Just page
              }
            , Cmd.none
            )

        RefreshContents res ->
            case res of
                Ok jsonVal ->
                    case Decode.decodeValue decodeContents jsonVal of
                        Ok contents ->
                            ( { model
                                | contents = contents
                                , contentsLoaded = Success
                              }
                            , Cmd.none
                            )

                        Err e ->
                            ( { model
                                | contentsLoaded = Failure

                                --, error = Debug.toString e
                              }
                            , Cmd.none
                            )

                Err _ ->
                    ( { model | contentsLoaded = Failure }
                    , Cmd.none
                    )

        RefreshPageTree res ->
            case res of
                Ok pageTree ->
                    ( { model
                        | pageTree = Just pageTree
                        , pageTreeLoaded = Success
                      }
                    , Cmd.none
                    )

                Err _ ->
                    ( { model | pageTreeLoaded = Failure }
                    , Cmd.none
                    )

        SavePageTree ->
            ( { model | pageTreeSavedStatus = Initial }
            , Cmd.batch
                [ Maybe.map extractPage model.pageTree
                    |> Maybe.map
                        (\pt ->
                            cmdIfLogged
                                config.logInfo
                                (savePageTree
                                    pt
                                )
                        )
                    |> Maybe.withDefault Cmd.none
                ]
            )

        PageTreeSaved res ->
            case res of
                Ok True ->
                    ( { model | pageTreeSavedStatus = Success }
                    , Cmd.none
                    )

                _ ->
                    ( { model | pageTreeSavedStatus = Failure }
                    , Cmd.none
                    )

        SaveContent ->
            case ( model.selected, model.seed ) of
                ( Just ((Page pageInfo xs) as page), Just seed ) ->
                    let
                        ( uuid, newSeed ) =
                            Random.step UUID.generator seed

                        contentId =
                            Maybe.withDefault uuid pageInfo.mbContentId

                        newPageTree =
                            Maybe.andThen (zipTo pageInfo.path) model.pageTree
                                |> Maybe.map
                                    (updateCurrPageTree
                                        (Page
                                            { pageInfo
                                                | mbContentId = Just contentId
                                            }
                                            xs
                                        )
                                    )
                                |> Maybe.map rewind
                    in
                    ( { model
                        | contentSavedStatus = Initial
                        , pageTreeSavedStatus = Initial
                        , pageTree = newPageTree
                        , seed = Just newSeed
                        , selected =
                            Just <|
                                Page
                                    { pageInfo
                                        | mbContentId = Just contentId
                                    }
                                    xs
                      }
                    , Cmd.batch
                        [ cmdIfLogged
                            config.logInfo
                            (saveContent contentId config.currentDocument)
                        , Maybe.map extractPage model.pageTree
                            |> Maybe.map
                                (\pt ->
                                    cmdIfLogged
                                        config.logInfo
                                        (savePageTree
                                            pt
                                        )
                                )
                            |> Maybe.withDefault Cmd.none
                        ]
                    )

                _ ->
                    ( model, Cmd.none )

        ContentSaved res ->
            case res of
                Ok True ->
                    ( { model | pageTreeSavedStatus = Success }
                    , Cmd.none
                    )

                _ ->
                    ( { model | pageTreeSavedStatus = Failure }
                    , Cmd.none
                    )

        SetInitialSeed t ->
            ( { model
                | seed =
                    posixToMillis t
                        |> Random.initialSeed
                        |> Just
              }
            , Cmd.none
            )

        NoOp ->
            ( model, Cmd.none )



-------------------------------------------------------------------------------
--------------------
-- Http functions --
--------------------


getPageTree : Cmd Msg
getPageTree =
    let
        body =
            Encode.object
                []
                |> Http.jsonBody

        request =
            Http.post "getPageTree.php" body decodePageTree
    in
    Http.send RefreshPageTree request


getContents : String -> Cmd Msg
getContents sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                ]
                |> Http.jsonBody

        request =
            Http.post "getContents.php" body Decode.value
    in
    Http.send RefreshContents request


savePageTree : Page -> String -> Cmd Msg
savePageTree page sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                , ( "pageTree"
                  , encodePage page
                  )
                ]
                |> Http.jsonBody

        request =
            Http.post "savePageTree.php" body decodeSuccess
    in
    Http.send PageTreeSaved request


saveContent : UUID -> Document -> String -> Cmd Msg
saveContent contentId doc sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                , ( "contentId"
                  , Encode.string (canonical contentId)
                  )
                , ( "content"
                  , encodeDocument doc
                  )
                ]
                |> Http.jsonBody

        request =
            Http.post "saveContent.php" body decodeSuccess
    in
    Http.send ContentSaved request



-------------------------------------------------------------------------------
--------------------
-- Json functions --
--------------------
-- Decoders:


decodeContents : Decode.Decoder Contents
decodeContents =
    Decode.list decodeContent
        |> Decode.map (List.map (\c -> ( canonical c.contentId, c )))
        |> Decode.map Dict.fromList


decodeContent : Decode.Decoder Content
decodeContent =
    Decode.succeed Content
        |> Pipeline.required "contentId" decodeUUID
        |> Pipeline.required "jsonContent" Decode.value
        |> Pipeline.required "jsonContent" decodeDocument


decodePageTree : Decode.Decoder PageTree
decodePageTree =
    decodePage
        |> Decode.map
            initPageTree


decodePage : Decode.Decoder Page
decodePage =
    Decode.succeed Page
        |> Pipeline.requiredAt
            [ "Page", "pageInfo" ]
            decodePageInfo
        |> Pipeline.requiredAt
            [ "Page", "children" ]
            (Decode.list
                (Decode.lazy (\_ -> decodePage))
            )


decodePageInfo : Decode.Decoder PageInfo
decodePageInfo =
    Decode.succeed PageInfo
        |> Pipeline.required "name" Decode.string
        |> Pipeline.required "path"
            (Decode.string
                |> Decode.map (String.split "/")
            )
        |> Pipeline.required "mbContentId"
            (Decode.nullable decodeUUID)


decodeUUID : Decode.Decoder UUID
decodeUUID =
    Decode.string
        |> Decode.andThen
            (Json.Decode.Extra.fromResult << UUID.fromString)


decodeSuccess : Decode.Decoder Bool
decodeSuccess =
    Decode.at [ "message" ] (Decode.succeed True)



-- Encoders:


encodePage : Page -> Encode.Value
encodePage (Page pageInfo children) =
    Encode.object
        [ ( "Page"
          , Encode.object
                [ ( "pageInfo", encodePageInfo pageInfo )
                , ( "children", Encode.list encodePage children )
                ]
          )
        ]


encodePageInfo : PageInfo -> Encode.Value
encodePageInfo { name, path, mbContentId } =
    Encode.object
        [ ( "name", Encode.string name )
        , ( "path"
          , String.join "/" path
                |> Encode.string
          )
        , ( "mbContentId"
          , Maybe.map canonical mbContentId
                |> Maybe.map Encode.string
                |> Maybe.withDefault Encode.null
          )
        ]



-------------------------------------------------------------------------------
-------------------------
-- Page tree functions --
-------------------------


type Page
    = Page PageInfo (List Page)


type alias PageInfo =
    { name : String
    , path : Path
    , mbContentId : Maybe UUID
    }


type alias Path =
    List String


type alias PageTree =
    { current : Page
    , contexts : List Context
    }


type alias Context =
    { parent : PageInfo
    , left : List Page
    , right : List Page
    }


initPageTree : Page -> PageTree
initPageTree page =
    { current = page
    , contexts = []
    }


extractPage : PageTree -> Page
extractPage { current, contexts } =
    current


updateCurrPageTree : Page -> PageTree -> PageTree
updateCurrPageTree new pageTree =
    { pageTree | current = new }


rewind : PageTree -> PageTree
rewind pageTree =
    case zipUp pageTree of
        Nothing ->
            pageTree

        Just pageTree_ ->
            rewind pageTree_


zipUp : PageTree -> Maybe PageTree
zipUp pageTree =
    case pageTree.contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            Just
                { pageTree
                    | current =
                        Page parent
                            (left ++ [ pageTree.current ] ++ right)
                    , contexts = cs
                }


zipDown : (Page -> Bool) -> PageTree -> Maybe PageTree
zipDown pred pageTree =
    case pageTree.current of
        Page _ [] ->
            Nothing

        Page pageInfo xs ->
            let
                ( l, r ) =
                    break pred xs
            in
            case r of
                [] ->
                    Nothing

                p :: ps ->
                    Just
                        { pageTree
                            | current = p
                            , contexts =
                                { parent = pageInfo
                                , left = l
                                , right = ps
                                }
                                    :: pageTree.contexts
                        }


zipTo : Path -> PageTree -> Maybe PageTree
zipTo path pageTree =
    let
        helper remainingPath pageTree_ =
            case remainingPath of
                [] ->
                    Nothing

                curr :: [] ->
                    if getName (extractPage pageTree_) /= curr then
                        Nothing
                    else
                        Just pageTree_

                curr :: next :: rest ->
                    if getName (extractPage pageTree_) /= curr then
                        Nothing
                    else
                        zipDown (\page -> getName page == next) pageTree_
                            |> Maybe.andThen (helper (next :: rest))
    in
    helper path pageTree


fixPaths : Page -> Page
fixPaths homePage =
    let
        helper currPath (Page pageInfo ps) =
            Page { pageInfo | path = currPath ++ [ pageInfo.name ] }
                (List.map (helper (currPath ++ [ pageInfo.name ])) ps)
    in
    helper [] homePage



-------------------------------------------------------------------------------


insert : Page -> Maybe Page -> Maybe Page
insert p mbPage_ =
    let
        homePage =
            Page
                { name = "accueil"
                , path = [ "accueil" ]
                , mbContentId = Nothing
                }
                []

        helper path mbPage =
            case mbPage of
                Nothing ->
                    case path of
                        [] ->
                            helper
                                path
                                (Just <| homePage)

                        home :: _ ->
                            if home /= getName homePage then
                                Nothing
                            else
                                helper
                                    path
                                    (Just <| homePage)

                Just (Page pageInfo children) ->
                    case path of
                        [] ->
                            Just <| Page pageInfo children

                        curr :: [] ->
                            if curr /= pageInfo.name then
                                Nothing
                            else if List.any (\c -> getName c == getName p) children then
                                Just <| Page pageInfo children
                            else
                                Just <| Page pageInfo (p :: children)

                        curr :: next :: rest ->
                            if curr /= pageInfo.name then
                                Nothing
                            else
                                let
                                    ( l, r ) =
                                        break (\p_ -> getName p_ == next) children
                                in
                                case r of
                                    [] ->
                                        let
                                            newPage =
                                                Page
                                                    { name = next
                                                    , path =
                                                        pageInfo.path
                                                            ++ [ next ]
                                                    , mbContentId = Nothing
                                                    }
                                                    []
                                        in
                                        helper (next :: rest) (Just newPage)
                                            |> Maybe.andThen
                                                (\nsbt -> Just <| Page pageInfo (nsbt :: children))

                                    next_ :: rest_ ->
                                        helper (next :: rest) (Just next_)
                                            |> Maybe.andThen
                                                (\nsbt -> Just <| Page pageInfo (l ++ nsbt :: rest_))
    in
    List.reverse (getPath p)
        |> List.tail
        |> Maybe.map List.reverse
        |> Maybe.andThen (\path -> helper path mbPage_)



-------------------------------------------------------------------------------
--------------------
-- View functions --
--------------------


view :
    { maxHeight : Int
    , zone : Time.Zone
    , logInfo : LogInfo
    , mode : Mode
    }
    -> Model msg
    -> Element msg
view config model =
    Element.map model.externalMsg <|
        column
            [ spacing 15
            , Font.size 16
            , alignTop
            , padding 15
            , width fill
            , height (maximum config.maxHeight fill)
            ]
            [ case config.mode of
                Full ->
                    fullView config model

                Save ->
                    saveView config model

                SaveAs ->
                    saveAsView config model

                Open ->
                    openView config model
            ]


fullView config model =
    column
        [ spacing 15
        , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
        , clip
        , width fill
        , height fill
        ]
        [ pageTreeView config model
        , Input.button
            (buttonStyle True)
            { onPress =
                Just <| SavePageTree
            , label =
                row [ spacing 10 ]
                    [ text "Save"
                    ]
            }
        ]


saveView config model =
    column
        [ spacing 15
        , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
        , clip
        , width fill
        , height fill
        ]
        [ pageTreeView config model
        , Input.button
            (buttonStyle True)
            { onPress =
                Just <| SaveContent
            , label =
                row [ spacing 10 ]
                    [ text "Save content"
                    ]
            }
        ]


saveAsView config model =
    Element.none


openView config model =
    Element.none


type Child
    = LastChild Bool
    | NotLastChild Bool


pageTreeView config model =
    column
        [ spacing 2
        , width fill
        , Font.size 14
        , Font.family
            [ Font.monospace ]
        , scrollbars
        , height fill
        ]
        (model.pageTree
            |> Maybe.map rewind
            |> Maybe.map extractPage
            |> Maybe.map (pageTreeView_ [] ())
            |> Maybe.withDefault []
        )


pageTreeView_ offsets selected (Page pageInfo children) =
    let
        l =
            List.length children

        ( firsts, last ) =
            ( List.take (l - 1) children, List.drop (l - 1) children )
    in
    [ row
        [ width fill ]
        (prefix offsets
            ++ [ el
                    [ Events.onClick (SelectPage (Page pageInfo children)) ]
                    (text <| pageInfo.name)
               ]
        )
    ]
        ++ List.concatMap
            (pageTreeView_
                (NotLastChild True
                    :: offsets
                )
                selected
            )
            firsts
        ++ List.concatMap
            (pageTreeView_
                (LastChild True :: offsets)
                selected
            )
            last


prefix : List Child -> List (Element msg)
prefix offsets =
    let
        attrs sel =
            [ if sel then
                Font.color (rgba 0 0 1 1)
              else
                Font.color (rgba 0.8 0.8 0.8 1)
            ]

        helper acc indexes =
            case indexes of
                [] ->
                    [ row [] acc ]

                (LastChild sel) :: [] ->
                    acc
                        ++ [ el
                                (attrs sel)
                                (text <| String.repeat 3 " " ++ "└─ ")
                           ]

                (NotLastChild sel) :: [] ->
                    acc
                        ++ [ el
                                (attrs sel)
                                (text <| String.repeat 3 " " ++ "├─ ")
                           ]

                (LastChild sel) :: xs ->
                    helper
                        (acc
                            ++ [ row
                                    (attrs sel)
                                    [ text <| String.repeat 3 " " ++ " " ]
                               ]
                        )
                        xs

                (NotLastChild sel) :: xs ->
                    helper
                        (acc
                            ++ [ el
                                    (attrs sel)
                                    (text <| String.repeat 3 " " ++ "│")
                               ]
                        )
                        xs
    in
    helper [] (List.reverse offsets)



-------------------------------------------------------------------------------


getName (Page { name } _) =
    name


getPath (Page { path } _) =
    path


break : (a -> Bool) -> List a -> ( List a, List a )
break p xs =
    let
        helper ys left =
            case ys of
                [] ->
                    ( left, [] )

                y :: ys_ ->
                    if p y then
                        ( List.reverse left, y :: ys_ )
                    else
                        helper ys_ (y :: left)
    in
    helper xs []



-------------------------------------------------------------------------------
