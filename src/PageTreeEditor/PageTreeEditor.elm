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
import List.Extra exposing (remove)
import Random
import Task exposing (..)
import Time exposing (Zone, now, posixToMillis)
import UUID exposing (UUID, canonical)


type alias Model msg =
    { pageTree : Maybe PageTree
    , contents : Contents
    , selected : Maybe Page
    , fileIoSelected : Maybe Page
    , saveAsSelected : Maybe Page
    , internalPageSelected : Maybe Page
    , pageTreeSavedStatus : Status
    , contentSavedStatus : Status
    , externalMsg : Msg -> msg
    , pageTreeLoaded : Status
    , contentsLoaded : Status
    , renamePageBuffer : String
    , newPageBuffer : String
    , seed : Maybe Random.Seed
    , lockedPages : List Page
    , lockedContents : Dict String (Maybe Content)
    , error : String
    }


loadedContent : Model msg -> Maybe Content
loadedContent model =
    Maybe.andThen getMbContentId model.fileIoSelected
        |> Maybe.andThen (\k -> Dict.get (canonical k) model.contents)


selectedPageInfo : Model msg -> Maybe PageInfo
selectedPageInfo model =
    case model.selected of
        Nothing ->
            Nothing

        Just (Page pageInfo xs) ->
            Just pageInfo


fileIoSelectedPageInfo : Model msg -> Maybe PageInfo
fileIoSelectedPageInfo model =
    case model.fileIoSelected of
        Nothing ->
            Nothing

        Just (Page pageInfo xs) ->
            Just pageInfo


internalPageSelectedPageInfo : Model msg -> Maybe PageInfo
internalPageSelectedPageInfo model =
    case model.internalPageSelected of
        Nothing ->
            Nothing

        Just (Page pageInfo xs) ->
            Just pageInfo


setInternalPageSelection : Model msg -> String -> Cmd msg
setInternalPageSelection model path =
    Task.perform SetInternalPage (succeed <| String.split "/" path)
        |> Cmd.map model.externalMsg


type Mode
    = Full
    | Save
    | SaveAs
    | Open
    | Select


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
    , fileIoSelected = Nothing
    , internalPageSelected = Nothing
    , saveAsSelected = Nothing
    , pageTreeSavedStatus = Initial
    , contentSavedStatus = Initial
    , externalMsg = externalMsg
    , pageTreeLoaded = Initial
    , contentsLoaded = Initial
    , renamePageBuffer = ""
    , newPageBuffer = ""
    , seed = Nothing
    , lockedPages = []
    , lockedContents = Dict.empty
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
    | FileIOSelectPage Page
    | SelectInternalPage Page
    | SaveAsSelectPage Page
    | SetInternalPage Path
    | RefreshContents (Result Http.Error Decode.Value)
    | RefreshPageTree (Result Http.Error PageTree)
    | PageTreeSaved (Maybe Page) Page (Result Http.Error Bool)
    | SaveContent Page
    | ContentSaved UUID (Result Http.Error Bool)
    | RenamePageInput String
    | RenamePage
    | NewPageInput String
    | NewPage
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

        FileIOSelectPage ((Page pageInfo xs) as page) ->
            ( { model
                | fileIoSelected = Just page
              }
            , Cmd.none
            )

        SelectInternalPage ((Page pageInfo xs) as page) ->
            ( { model
                | internalPageSelected = Just page
              }
            , Cmd.none
            )

        SaveAsSelectPage page ->
            ( { model
                | saveAsSelected = Just page
              }
            , Cmd.none
            )

        SetInternalPage path ->
            ( { model
                | internalPageSelected =
                    Maybe.andThen (zipTo path) model.pageTree
                        |> Maybe.map extractPage
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

        PageTreeSaved mbBackup page res ->
            case res of
                Ok True ->
                    ( { model
                        | pageTreeSavedStatus = Success
                        , lockedPages = remove page model.lockedPages
                      }
                    , Cmd.none
                    )

                _ ->
                    ( { model
                        | pageTreeSavedStatus = Failure
                        , lockedPages = remove page model.lockedPages
                        , pageTree =
                            case mbBackup of
                                Just backup ->
                                    Maybe.andThen (zipTo (getPath page)) model.pageTree
                                        |> Maybe.map (updateCurrPageTree backup)
                                        |> Maybe.map rewind

                                Nothing ->
                                    Maybe.andThen (zipTo (getPath page)) model.pageTree
                                        |> Maybe.andThen delete
                                        |> Maybe.map rewind
                      }
                    , Cmd.none
                    )

        SaveContent ((Page pageInfo xs) as page) ->
            case model.seed of
                Just seed ->
                    let
                        ( uuid, newSeed ) =
                            Random.step UUID.generator seed

                        contentId =
                            Maybe.withDefault uuid pageInfo.mbContentId

                        mbBackup =
                            Maybe.andThen (zipTo pageInfo.path) model.pageTree
                                |> Maybe.map extractPage

                        mbBackupContent =
                            Dict.get (canonical contentId) model.contents

                        newPage =
                            Page
                                { pageInfo
                                    | mbContentId = Just contentId
                                }
                                xs

                        newPageTree =
                            Maybe.andThen (zipTo pageInfo.path) model.pageTree
                                |> Maybe.map
                                    (updateCurrPageTree
                                        newPage
                                    )
                                |> Maybe.map rewind

                        newContent =
                            { contentId = contentId
                            , jsonContent = encodeDocument config.currentDocument
                            , docContent = config.currentDocument
                            }

                        newContents =
                            Dict.insert (canonical contentId) newContent model.contents
                    in
                    ( { model
                        | contentSavedStatus = Initial
                        , pageTreeSavedStatus = Initial
                        , pageTree = newPageTree
                        , contents = newContents
                        , seed = Just newSeed
                        , fileIoSelected =
                            Just <|
                                Page
                                    { pageInfo
                                        | mbContentId = Just contentId
                                    }
                                    xs
                        , lockedPages = newPage :: model.lockedPages
                        , lockedContents =
                            Dict.insert (canonical contentId)
                                mbBackupContent
                                model.lockedContents
                      }
                    , Cmd.batch
                        [ cmdIfLogged
                            config.logInfo
                            (saveContent contentId config.currentDocument)
                        , Maybe.map extractPage newPageTree
                            |> Maybe.map
                                (\pt ->
                                    cmdIfLogged
                                        config.logInfo
                                        (savePageTree
                                            mbBackup
                                            newPage
                                            pt
                                        )
                                )
                            |> Maybe.withDefault Cmd.none
                        ]
                    )

                _ ->
                    ( model, Cmd.none )

        ContentSaved uuid res ->
            case res of
                Ok True ->
                    ( { model
                        | pageTreeSavedStatus = Success
                        , lockedContents =
                            Dict.remove (canonical uuid)
                                model.lockedContents
                      }
                    , Cmd.none
                    )

                _ ->
                    ( { model
                        | pageTreeSavedStatus = Failure
                        , lockedContents =
                            Dict.remove (canonical uuid) model.lockedContents
                        , contents =
                            case Dict.get (canonical uuid) model.lockedContents of
                                Just (Just backup) ->
                                    Dict.insert (canonical uuid) backup model.contents

                                _ ->
                                    Dict.remove (canonical uuid) model.contents
                      }
                    , Cmd.none
                    )

        RenamePageInput s ->
            ( { model | renamePageBuffer = s }
            , Cmd.none
            )

        RenamePage ->
            ( model
            , Cmd.none
            )

        NewPageInput s ->
            ( { model | newPageBuffer = s }
            , Cmd.none
            )

        NewPage ->
            if model.newPageBuffer == "" then
                ( model, Cmd.none )
            else
                case ( model.saveAsSelected, model.seed ) of
                    ( Just ((Page pageInfo xs) as page), Just seed ) ->
                        let
                            newPage =
                                Page
                                    { name = model.newPageBuffer
                                    , path = pageInfo.path ++ [ model.newPageBuffer ]
                                    , mbContentId = Nothing
                                    }
                                    []

                            newPageTree =
                                Maybe.andThen (zipTo pageInfo.path) model.pageTree
                                    |> Maybe.map
                                        (updateCurrPageTree
                                            (Page
                                                pageInfo
                                                (xs ++ [ newPage ])
                                            )
                                        )
                                    |> Maybe.map rewind
                        in
                        ( { model
                            | pageTree = newPageTree
                            , newPageBuffer = ""
                            , pageTreeSavedStatus = Initial
                            , lockedPages = newPage :: model.lockedPages
                          }
                        , Maybe.map extractPage newPageTree
                            |> Maybe.map
                                (\pt ->
                                    cmdIfLogged
                                        config.logInfo
                                        (savePageTree
                                            Nothing
                                            newPage
                                            pt
                                        )
                                )
                            |> Maybe.withDefault Cmd.none
                        )

                    _ ->
                        ( model, Cmd.none )

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


savePageTree : Maybe Page -> Page -> Page -> String -> Cmd Msg
savePageTree mbPage page pageTree sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                , ( "pageTree"
                  , encodePage pageTree
                  )
                ]
                |> Http.jsonBody

        request =
            Http.post "savePageTree.php" body decodeSuccess
    in
    Http.send (PageTreeSaved mbPage page) request


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
    Http.send (ContentSaved contentId) request



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


delete : PageTree -> Maybe PageTree
delete { current, contexts } =
    case contexts of
        [] ->
            Nothing

        { parent, left, right } :: cs ->
            Just
                { current = Page parent (left ++ right)
                , contexts = cs
                }



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

                Select ->
                    selectView config model
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

        --, Input.button
        --    (buttonStyle True)
        --    { onPress =
        --        Just <| SavePageTree
        --    , label =
        --        row [ spacing 10 ]
        --            [ text "Save"
        --            ]
        --    }
        ]


saveView config model =
    column
        [ spacing 15
        , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
        , clip
        , width fill
        , height fill
        ]
        [ el
            [ Font.bold
            , Font.size 18
            ]
            (text "Enregistrer")
        , pageTreeView config model
        , Input.button
            (buttonStyle (model.fileIoSelected /= Nothing))
            { onPress =
                Maybe.map SaveContent model.fileIoSelected
            , label =
                row [ spacing 10 ]
                    [ text "Valider"
                    ]
            }
        ]


saveAsView config model =
    column
        [ spacing 15
        , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
        , clip
        , width fill
        , height fill
        ]
        [ el
            [ Font.bold
            , Font.size 18
            ]
            (text "Enregistrer sous")
        , row [ spacing 15 ]
            [ Input.text
                (textInputStyle ++ [ width (px 250), spacing 0 ])
                { onChange = NewPageInput
                , text = model.newPageBuffer
                , placeholder =
                    Nothing
                , label =
                    Input.labelLeft [] Element.none
                }
            , Input.button
                (buttonStyle True)
                { onPress =
                    Just <| NewPage
                , label =
                    row [ spacing 10 ]
                        [ text "Nouvelle page"
                        ]
                }
            ]
        , pageTreeView config model
        , Input.button
            (buttonStyle (model.saveAsSelected /= Nothing))
            { onPress =
                Maybe.map SaveContent model.saveAsSelected
            , label =
                row [ spacing 10 ]
                    [ text "Enregistrer"
                    ]
            }
        ]


openView config model =
    column
        [ spacing 15
        , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
        , clip
        , width fill
        , height fill
        ]
        [ el
            [ Font.bold
            , Font.size 18
            ]
            (text "Charger une page")
        , pageTreeView config model
        ]


selectView config model =
    column
        [ spacing 15
        , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
        , clip
        , width fill
        , height fill
        ]
        [ pageTreeView config model
        ]


type Child
    = LastChild Bool
    | NotLastChild Bool


pageTreeView : { config | mode : Mode } -> Model msg -> Element.Element Msg
pageTreeView config model =
    let
        selected =
            case config.mode of
                Full ->
                    model.selected

                Select ->
                    model.internalPageSelected

                SaveAs ->
                    model.saveAsSelected

                _ ->
                    model.fileIoSelected
    in
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
            |> Maybe.map
                (pageTreeView_ config [] selected model.contents model.lockedPages)
            |> Maybe.withDefault []
        )


pageTreeView_ :
    { config | mode : Mode }
    -> List Child
    -> Maybe Page
    -> Dict String Content
    -> List Page
    -> Page
    -> List (Element.Element Msg)
pageTreeView_ config offsets selected contents locked (Page pageInfo children) =
    let
        l =
            List.length children

        ( firsts, last ) =
            ( List.take (l - 1) children, List.drop (l - 1) children )

        attrs =
            case config.mode of
                Full ->
                    [ Events.onClick (SelectPage (Page pageInfo children))
                    , pointer
                    , mouseOver [ Font.color (rgba 0 0 1 1) ]
                    , if selected == Just (Page pageInfo children) then
                        Font.color (rgba 0 0 1 1)
                      else
                        noAttr
                    ]

                Save ->
                    [ if selected == Just (Page pageInfo children) then
                        Font.color (rgba 0 0 1 1)
                      else
                        noAttr
                    ]

                SaveAs ->
                    let
                        fontColor =
                            case pageInfo.mbContentId of
                                Nothing ->
                                    Font.color (rgba 0.8 0.8 0.8 1)

                                Just contentId ->
                                    case Dict.get (canonical contentId) contents of
                                        Just _ ->
                                            noAttr

                                        Nothing ->
                                            Font.color (rgba 1 0 0 0.7)
                    in
                    [ Events.onClick (SaveAsSelectPage (Page pageInfo children))
                    , pointer
                    , mouseOver [ Font.color (rgba 0 0 1 1) ]
                    ]
                        ++ [ if selected == Just (Page pageInfo children) then
                                Font.color (rgba 0 0 1 1)
                             else
                                fontColor
                           ]

                Open ->
                    let
                        selectable =
                            pageInfo.mbContentId
                                |> Maybe.map (\k -> Dict.get (canonical k) contents)
                                |> (\res -> res /= Nothing)

                        fontColor =
                            case pageInfo.mbContentId of
                                Nothing ->
                                    Font.color (rgba 0.8 0.8 0.8 1)

                                Just contentId ->
                                    case Dict.get (canonical contentId) contents of
                                        Just _ ->
                                            noAttr

                                        Nothing ->
                                            Font.color (rgba 1 0 0 0.7)
                    in
                    (if selectable then
                        [ Events.onClick (FileIOSelectPage (Page pageInfo children))
                        , pointer
                        , mouseOver [ Font.color (rgba 0 0 1 1) ]
                        ]
                     else
                        []
                    )
                        ++ [ if selected == Just (Page pageInfo children) then
                                Font.color (rgba 0 0 1 1)
                             else
                                fontColor
                           ]

                Select ->
                    [ Events.onClick (SelectInternalPage (Page pageInfo children))
                    , pointer
                    , mouseOver [ Font.color (rgba 0 0 1 1) ]
                    , if selected == Just (Page pageInfo children) then
                        Font.color (rgba 0 0 1 1)
                      else
                        noAttr
                    ]
    in
    [ row
        [ width fill ]
        (prefix offsets
            ++ [ el
                    (attrs
                        ++ [ if List.member (Page pageInfo children) locked then
                                Font.color (rgba 0.8 0.8 0.8 1)
                             else
                                noAttr
                           ]
                    )
                    (text <| pageInfo.name)
               ]
        )
    ]
        ++ List.concatMap
            (pageTreeView_
                config
                (NotLastChild True
                    :: offsets
                )
                selected
                contents
                locked
            )
            firsts
        ++ List.concatMap
            (pageTreeView_
                config
                (LastChild True :: offsets)
                selected
                contents
                locked
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


getMbContentId (Page { mbContentId } _) =
    mbContentId


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
