module PageTreeEditor.PageTreeEditor exposing (..)

import Auth.AuthPlugin exposing (LogInfo(..))
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
import Time exposing (Zone)
import UUID exposing (UUID, canonical)


type alias Model msg =
    { pageTree : Maybe PageTree
    , contents : Contents
    , selected : Maybe Page
    , loadedContent : Maybe Content
    , externalMsg : Msg -> msg
    , loadingStatus : ToolLoadingStatus
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
    , jsonContent : String
    , docContent : Document
    }


init : (Msg -> msg) -> Model msg
init externalMsg =
    { pageTree =
        List.map
            (\( n, p ) ->
                Page { name = n, path = p, mbContentId = Nothing } []
            )
            plan
            |> List.foldr (\p acc -> insert p acc) Nothing
            |> Maybe.map initPageTree
    , contents = Dict.empty
    , selected = Nothing
    , loadedContent = Nothing
    , externalMsg = externalMsg
    , loadingStatus = ToolLoadingWaiting
    }


load : Model msg -> LogInfo -> Cmd msg
load model loadInfo =
    Cmd.none


loadingStatus model =
    model.loadingStatus


loadingView model =
    toolLoadingView "Chargement de la stucture du site: " model


type Msg
    = RefreshContents (Result Http.Error Decode.Value)
    | RefreshPageTree (Result Http.Error (Maybe PageTree))
    | SaveDocument
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
        RefreshContents res ->
            case res of
                Ok jsonVal ->
                    case Decode.decodeValue decodeContents jsonVal of
                        Ok contents ->
                            ( { model
                                | contents = contents
                              }
                            , Cmd.none
                            )

                        _ ->
                            ( model, Cmd.none )

                Err _ ->
                    ( model, Cmd.none )

        RefreshPageTree res ->
            case res of
                Ok mbPageTree ->
                    ( { model | pageTree = mbPageTree }
                    , Cmd.none
                    )

                Err _ ->
                    ( model, Cmd.none )

        SaveDocument ->
            let
                jsonDoc =
                    encodeDocument config.currentDocument
            in
            ( model, Cmd.none )

        NoOp ->
            ( model, Cmd.none )



-------------------------------------------------------------------------------
--------------------
-- Http functions --
--------------------


getPageTree : String -> Cmd Msg
getPageTree sessionId =
    let
        body =
            Encode.object
                [ ( "sessionId"
                  , Encode.string sessionId
                  )
                ]
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



-------------------------------------------------------------------------------
--------------------
-- Json functions --
--------------------


decodeContents : Decode.Decoder Contents
decodeContents =
    Decode.list decodeContent
        |> Decode.map (List.map (\c -> ( canonical c.contentId, c )))
        |> Decode.map Dict.fromList


decodeContent : Decode.Decoder Content
decodeContent =
    Decode.succeed Content
        |> Pipeline.required "contentId" decodeUUID
        |> Pipeline.required "jsonContent" Decode.string
        |> Pipeline.required "docContent" decodeDocument


decodePageTree : Decode.Decoder (Maybe PageTree)
decodePageTree =
    Decode.list decodePageInfo
        |> Decode.map (List.map (\pi -> Page pi []))
        |> Decode.map
            (List.foldr
                (\p acc -> insert p acc)
                Nothing
            )
        |> Decode.map
            (Maybe.map initPageTree)


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


decodeUUID =
    Decode.string
        |> Decode.andThen
            (Json.Decode.Extra.fromResult << UUID.fromString)



-------------------------------------------------------------------------------


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
            pageTree_


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
        ]


saveView config model =
    Element.none


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
                    []
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


plan =
    [ ( "accueil", [ "accueil" ] )
    , ( "decouvrir", [ "accueil", "decouvrir" ] )
    , ( "office de tourisme", [ "accueil", "decouvrir", "office de tourisme" ] )
    , ( "office de tourisme de murol", [ "accueil", "decouvrir", "office de tourisme", "office de tourisme de murol" ] )
    , ( "sancy.com", [ "accueil", "decouvrir", "office de tourisme", "sancy.com" ] )
    , ( "voir", [ "accueil", "decouvrir", "voir" ] )
    , ( "bourg de murol", [ "accueil", "decouvrir", "voir", "bourg de murol" ] )
    , ( "château", [ "accueil", "decouvrir", "voir", "château" ] )
    , ( "beaune le froid", [ "accueil", "decouvrir", "voir", "beaune le froid" ] )
    , ( "volcan du tartaret", [ "accueil", "decouvrir", "voir", "volcan du tartaret" ] )
    , ( "lac chambon", [ "accueil", "decouvrir", "voir", "lac chambon" ] )
    , ( "voie verte", [ "accueil", "decouvrir", "voir", "voie verte" ] )
    , ( "chautignat", [ "accueil", "decouvrir", "voir", "chautignat" ] )
    , ( "groire", [ "accueil", "decouvrir", "voir", "groire" ] )
    , ( "la chassagne et les ballats", [ "accueil", "decouvrir", "voir", "la chassagne et les ballats" ] )
    , ( "se loger", [ "accueil", "decouvrir", "se loger" ] )
    , ( "hotels et residences hotelieres", [ "accueil", "decouvrir", "se loger", "hotels et residences hotelieres" ] )
    , ( "campings et aires de camping cars", [ "accueil", "decouvrir", "se loger", "campings et aires de camping cars" ] )
    , ( "chambres d hotes", [ "accueil", "decouvrir", "se loger", "chambres d hotes" ] )
    , ( "meubles et gites", [ "accueil", "decouvrir", "se loger", "meubles et gites" ] )
    , ( "villages vacances", [ "accueil", "decouvrir", "se loger", "villages vacances" ] )
    , ( "labellises famille plus", [ "accueil", "decouvrir", "se loger", "labellises famille plus" ] )
    , ( "se restaurer", [ "accueil", "decouvrir", "se restaurer" ] )
    , ( "bars brasseries et restaurants", [ "accueil", "decouvrir", "se restaurer", "bars brasseries et restaurants" ] )
    , ( "labellises famille plus", [ "accueil", "decouvrir", "se restaurer", "labellises famille plus" ] )
    , ( "bouger", [ "accueil", "decouvrir", "bouger" ] )
    , ( "se reperer", [ "accueil", "decouvrir", "se reperer" ] )
    , ( "sortir", [ "accueil", "sortir" ] )
    , ( "animations manifestations", [ "accueil", "sortir", "animations manifestations" ] )
    , ( "medievales de murol", [ "accueil", "sortir", "animations manifestations", "medievales de murol" ] )
    , ( "expo temporaire du musee des peintres", [ "accueil", "sortir", "animations manifestations", "expo temporaire du musee des peintres" ] )
    , ( "horizons arts nature en sancy", [ "accueil", "sortir", "animations manifestations", "horizons arts nature en sancy" ] )
    , ( "fete de la revolution", [ "accueil", "sortir", "animations manifestations", "fete de la revolution" ] )
    , ( "festival d art", [ "accueil", "sortir", "animations manifestations", "festival d art" ] )
    , ( "animation estivale pour tous", [ "accueil", "sortir", "animations manifestations", "animation estivale pour tous" ] )
    , ( "château", [ "accueil", "sortir", "château" ] )
    , ( "musees de murol", [ "accueil", "sortir", "musees de murol" ] )
    , ( "musee des peintres de l'ecole de murols", [ "accueil", "sortir", "musees de murol", "musee des peintres de l'ecole de murols" ] )
    , ( "musee archeologique", [ "accueil", "sortir", "musees de murol", "musee archeologique" ] )
    , ( "artistes murolais", [ "accueil", "sortir", "artistes murolais" ] )
    , ( "visite de fermes", [ "accueil", "sortir", "visite de fermes" ] )
    , ( "dans les environs", [ "accueil", "sortir", "dans les environs" ] )
    , ( "vivre a murol", [ "accueil", "vivre a murol" ] )
    , ( "enfants", [ "accueil", "enfants", "enfants" ] )
    , ( "vie scolaire", [ "accueil", "vivre a murol", "enfants", "vie scolaire" ] )
    , ( "ecole maternelle du sivom de la vallee verte", [ "accueil", "vivre a murol", "enfants", "vie scolaire", "ecole maternelle du sivom de la vallee verte" ] )
    , ( "ecole elementaire du rpi", [ "accueil", "vivre a murol", "enfants", "vie scolaire", "ecole elementaire du rpi" ] )
    , ( "secondaire", [ "accueil", "vivre a murol", "enfants", "vie scolaire", "secondaire" ] )
    , ( "vacances", [ "accueil", "vivre a murol", "enfants", "vie scolaire", "vacances" ] )
    , ( "peri et extra scolaire", [ "accueil", "vivre a murol", "enfants", "peri et extra scolaire" ] )
    , ( "restaurant scolaire", [ "accueil", "vivre a murol", "enfants", "peri et extra scolaire", "restaurant scolaire" ] )
    , ( "garderie periscolaire", [ "accueil", "vivre a murol", "enfants", "peri et extra scolaire", "garderie periscolaire" ] )
    , ( "centre de loisirs", [ "accueil", "vivre a murol", "enfants", "peri et extra scolaire", "centre de loisirs" ] )
    , ( "transports scolaires", [ "accueil", "vivre a murol", "enfants", "peri et extra scolaire", "transports scolaires" ] )
    , ( "activites jeunesse", [ "accueil", "vivre a murol", "enfants", "peri et extra scolaire", "activites jeunesse" ] )
    , ( "seniors", [ "accueil", "vivre a murol", "seniors" ] )
    , ( "activites et animations", [ "accueil", "vivre a murol", "seniors", "activites et animations" ] )
    , ( "services du sivom de besse", [ "accueil", "vivre a murol", "seniors", "services du sivom de besse" ] )
    , ( "autres services", [ "accueil", "vivre a murol", "seniors", "autres services" ] )
    , ( "associations et activites", [ "accueil", "vivre a murol", "associations et activites" ] )
    , ( "culture evenementiel solidarite", [ "accueil", "vivre a murol", "associations et activites", "culture evenementiel solidarite" ] )
    , ( "sport", [ "accueil", "vivre a murol", "associations et activites", "sport" ] )
    , ( "syndicats et groupements (anciens profes)", [ "accueil", "vivre a murol", "associations et activites", "syndicats et groupements (anciens profes)" ] )
    , ( "sante", [ "accueil", "vivre a murol", "sante" ] )
    , ( "transports", [ "accueil", "vivre a murol", "transports" ] )
    , ( "dessertes de la commune", [ "accueil", "vivre a murol", "transports", "dessertes de la commune" ] )
    , ( "covoiturage", [ "accueil", "vivre a murol", "transports", "covoiturage" ] )
    , ( "deneigement", [ "accueil", "vivre a murol", "transports", "deneigement" ] )
    , ( "environnement", [ "accueil", "vivre a murol", "environnement" ] )
    , ( "gestion des dechets", [ "accueil", "vivre a murol", "environnement", " gestion des dechets" ] )
    , ( "gestion de l'eau", [ "accueil", "vivre a murol", "environnement", "gestion de l'eau" ] )
    , ( "gestion des espaces verts", [ "accueil", "vivre a murol", "environnement", "gestion des espaces verts" ] )
    , ( "gestion des risques", [ "accueil", "vivre a murol", "environnement", "gestion des risques" ] )
    , ( "charte de developpement durable", [ "accueil", "vivre a murol", "environnement", "charte de developpement durable" ] )
    , ( "milieux sensibles", [ "accueil", "vivre a murol", "environnement", "milieux sensibles" ] )
    , ( "animaux", [ "accueil", "vivre a murol", "animaux" ] )
    , ( "vie economique", [ "accueil", "vivre a murol", "vie economique" ] )
    , ( "agriculture", [ "accueil", "vivre a murol", "vie economique", "agriculture" ] )
    , ( "commerces et services", [ "accueil", "vivre a murol", "vie economique", "commerces et services" ] )
    , ( "toute l'annee", [ "accueil", "vivre a murol", "vie economique", "commerces et services", "toute l'annee" ] )
    , ( "en saison", [ "accueil", "vivre a murol", "vie economique", "commerces et services", "en saison" ] )
    , ( "entreprises et artisans", [ "accueil", "toute l'annee", "entreprises et artisans" ] )
    , ( "offres d'emploi", [ "accueil", "vivre a murol", "offres d'emploi" ] )
    , ( "de la mairie et du sivom", [ "accueil", "vivre a murol", "offres d'emploi", "de la mairie et du sivom" ] )
    , ( "des professionnels", [ "accueil", "vivre a murol", "offres d'emploi", "des professionnels" ] )
    , ( "liens utiles", [ "accueil", "vivre a murol", "offres d'emploi", "liens utiles" ] )
    , ( "mairie ", [ "accueil", "mairie " ] )
    , ( "murol en chiffres ", [ "accueil", "mairie ", "murol en chiffres " ] )
    , ( "vie municipale", [ "accueil", "mairie ", "vie municipale" ] )
    , ( "le conseil municipal", [ "accueil", "mairie ", "vie municipale", "le conseil municipal" ] )
    , ( "deliberations conseil municipal", [ "accueil", "mairie ", "vie municipale", "deliberations conseil municipal" ] )
    , ( "budget", [ "accueil", "mairie ", "vie municipale", "budget" ] )
    , ( "les commissions", [ "accueil", "mairie ", "vie municipale", "les commissions" ] )
    , ( "centre communal d'action sociale", [ "accueil", "mairie ", "vie municipale", "centre communal d'action sociale" ] )
    , ( "les membres du ccas", [ "accueil", "mairie ", "vie municipale", "centre communal d'action sociale", "les membres du ccas" ] )
    , ( "actions collectives", [ "accueil", "mairie ", "vie municipale", "centre communal d'action sociale", "actions collectives" ] )
    , ( "actions individuelles", [ "accueil", "mairie ", "vie municipale", "centre communal d'action sociale", "actions individuelles" ] )
    , ( "argent de poche", [ "accueil", "mairie ", "vie municipale", "centre communal d'action sociale", "argent de poche" ] )
    , ( "elections", [ "accueil", "mairie ", "vie municipale", "elections" ] )
    , ( "les elections municipales", [ "accueil", "mairie ", "vie municipale", "elections", "les elections municipales" ] )
    , ( "resultats des elections", [ "accueil", "mairie ", "vie municipale", "elections", "resultats des elections" ] )
    , ( "autres elections", [ "accueil", "mairie ", "vie municipale", "elections", "autres elections" ] )
    , ( "demarches ", [ "accueil", "mairie ", "demarches " ] )
    , ( "a la mairie de murol", [ "accueil", "mairie ", "demarches ", "a la mairie de murol" ] )
    , ( "service public .fr", [ "accueil", "mairie ", "demarches ", "service public .fr" ] )
    , ( "relai sancy", [ "accueil", "mairie ", "demarches ", "relai sancy" ] )
    , ( "location des salles municipales", [ "accueil", "mairie ", "location des salles municipales" ] )
    , ( "salle des fetes de murol", [ "accueil", "mairie ", "location des salles municipales", "salle des fetes de murol" ] )
    , ( "salle des fetes de beaune", [ "accueil", "mairie ", "location des salles municipales", "salle des fetes de beaune" ] )
    , ( "publications", [ "accueil", "mairie ", "publications" ] )
    , ( " bulletins municipaux", [ "accueil", "mairie ", "publications", " bulletins municipaux" ] )
    , ( "murol infos", [ "accueil", "mairie ", "publications", "murol infos" ] )
    , ( "autres publications", [ "accueil", "mairie ", "publications", "autres publications" ] )
    , ( "labels", [ "accueil", "mairie ", "labels" ] )
    , ( "station de tourisme", [ "accueil", "mairie ", "labels", "station de tourisme" ] )
    , ( "concours des villes et villages fleuris", [ "accueil", "mairie ", "labels", "concours des villes et villages fleuris" ] )
    , ( "pavillon bleu", [ "accueil", "mairie ", "labels", "pavillon bleu" ] )
    , ( "station verte", [ "accueil", "mairie ", "labels", "station verte" ] )
    , ( "famille plus", [ "accueil", "mairie ", "labels", "famille plus" ] )
    ]
