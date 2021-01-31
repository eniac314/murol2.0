module Help.Help exposing (Model, Msg, externalUpdate, init, subscriptions, update, view)

import Browser.Dom as Dom
import Browser.Events exposing (onAnimationFrame)
import Dict exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Html
import Html.Attributes as HtmlAttr
import Html.Events as HtmlEvents exposing (on)
import Http exposing (Error)
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (noAttr)
import Json.Decode as Decode exposing (succeed)
import Lazy.Tree as Tree exposing (Tree(..))
import Lazy.Tree.Zipper as Zipper exposing (Zipper)
import Set
import Task


type alias Model msg =
    { index : Maybe (Zipper ( Bool, IndexEntry ))
    , pages : Dict String HelpPage
    , currentPage : Id
    , scrollOnNextFrame : Bool
    , loaded : Set.Set String
    , externalMsg : Msg -> msg
    }


type Msg
    = Toogle (Zipper ( Bool, IndexEntry ))
    | SetCurrentPage Bool Id
    | Scroll
    | GotPages (Result Http.Error ( List HelpPage, List IndexEntry ))
    | ImgLoaded String
    | NoOp


type alias IndexEntry =
    { id : Id
    , title : String
    , parent : Maybe Id
    }


type alias HelpPage =
    { id : String
    , title : String
    , content : Content
    }


type alias Id =
    ( Int, String )


type alias Content =
    List ( Int, String )


init externalMsg =
    { index = Nothing
    , pages = Dict.empty
    , currentPage = ( 0, "root" )
    , externalMsg = externalMsg
    , loaded = Set.empty
    , scrollOnNextFrame = False
    }
        |> update () (GotPages (Ok ( helpPagesData, indexEntriesData )))


subscriptions model =
    [ if model.scrollOnNextFrame && model.loaded == Set.empty then
        onAnimationFrame (\_ -> Scroll)

      else
        Sub.none
    ]
        |> Sub.batch
        |> Sub.map model.externalMsg



-------------------------------------------------------------------------------
------------
-- Update --
------------


update : config -> Msg -> Model msg -> ( Model msg, Cmd msg )
update config msg model =
    case msg of
        Toogle zipper ->
            ( { model
                | index =
                    Just <|
                        Zipper.updateItem
                            (\( s, i ) -> ( not s, i ))
                            zipper
              }
            , Cmd.none
            )

        SetCurrentPage external id ->
            let
                content =
                    Dict.get (Tuple.second id) model.pages
                        |> Maybe.map .content
                        |> Maybe.withDefault []
            in
            ( { model
                | currentPage = id
                , scrollOnNextFrame = True
                , loaded =
                    if (Tuple.second id == Tuple.second model.currentPage) && not external then
                        Set.empty

                    else
                        List.map Tuple.second content
                            |> Set.fromList
              }
            , Cmd.none
            )

        Scroll ->
            let
                ( anchor, id ) =
                    model.currentPage
            in
            ( { model | scrollOnNextFrame = False }
            , Cmd.map model.externalMsg <| scrollTo (id ++ " " ++ String.fromInt anchor)
            )

        GotPages res ->
            case res of
                Ok ( pagesList, indexEntries ) ->
                    let
                        pages =
                            List.map (\p -> ( p.id, p )) pagesList
                                |> Dict.fromList

                        root =
                            List.filter (\e -> e.id == ( 0, "root" )) indexEntries
                                |> List.head

                        index =
                            List.map (\p -> ( True, p )) (List.filter (\e -> e.id /= ( 0, "root" )) indexEntries)
                                |> Tree.fromList
                                    (\mbParent ( _, page ) ->
                                        Maybe.map (.id << Tuple.second) mbParent == page.parent
                                    )
                                |> (\forest -> Maybe.map (\r -> Tree ( True, r ) forest) root)
                                |> Maybe.map Zipper.fromTree
                    in
                    ( { model
                        | pages = pages
                        , index = index
                      }
                    , Cmd.none
                    )

                Err e ->
                    ( model, Cmd.none )

        ImgLoaded src ->
            ( { model | loaded = Set.remove src model.loaded }, Cmd.none )

        NoOp ->
            ( model, Cmd.none )


externalUpdate id model =
    update () (SetCurrentPage True id) model



--goToHelp : msg -> String -> Cmd msg
--goToHelp handler id =
-------------------------------------------------------------------------------
----------
-- View --
----------


type alias ViewConfig a =
    { a
        | maxWidth : Int
        , maxHeight : Int
    }


view : ViewConfig a -> Model msg -> Element msg
view config model =
    Element.map model.externalMsg <|
        row
            [ height fill
            , width fill
            , clip
            , htmlAttribute (HtmlAttr.style "flex-shrink" "1")
            , height fill
            ]
            [ leftPanelView config model
            , mainView config model
            ]


leftPanelView config model =
    column
        [ spacing 15
        , Font.size 16
        , Font.family
            []
        , alignTop
        , padding 15
        , height (maximum config.maxHeight fill)
        ]
        [ el
            [ spacing 15
            , scrollbars
            , width (minimum 400 (maximum 500 fill))
            , height fill
            , alignTop
            , Border.solid
            , Border.widthEach
                { top = 0
                , bottom = 0
                , left = 0
                , right = 2
                }
            , Border.color (rgb 0.8 0.8 0.8)
            ]
            (case model.index of
                Just zipper ->
                    column [] [ indexView model 0 (Zipper.root zipper) ]

                Nothing ->
                    Element.none
            )
        ]


indexView : Model msg -> Int -> Zipper ( Bool, IndexEntry ) -> Element Msg
indexView model offset zipper =
    let
        ( isOpen, entry ) =
            Zipper.current zipper
    in
    Element.column
        []
        [ row
            [ spacing 7
            , Font.size 15
            , paddingXY 0 6
            ]
            [ if not (Zipper.isEmpty zipper) then
                el
                    [ Events.onClick <|
                        Toogle zipper
                    , pointer
                    ]
                    (text <|
                        if isOpen then
                            "-"

                        else
                            "+"
                    )

              else
                text " "
            , paragraph
                [ pointer
                , Events.onClick <| SetCurrentPage False entry.id
                , if entry.id == model.currentPage then
                    Font.color (rgb 0 0 1)

                  else
                    noAttr
                ]
                [ text <| entry.title ]
            ]
        , column
            [ paddingXY 10 0 ]
            (if isOpen then
                Zipper.openAll zipper
                    |> List.map (indexView model (offset + 1))

             else
                []
            )
        ]


mainView config model =
    let
        contentView ( anchor, url ) =
            column
                ([ centerX ]
                    ++ (if Set.member url model.loaded then
                            [ height (px 600)
                            , width (px 800)
                            ]

                        else
                            []
                       )
                )
                [ image
                    ([ htmlAttribute <| HtmlAttr.id (currentId ++ " " ++ String.fromInt anchor)
                     , centerX
                     ]
                        ++ (if Set.member url model.loaded then
                                [ centerX
                                , centerY
                                , clip
                                ]

                            else
                                [ width (maximum 800 fill) ]
                           )
                    )
                    { src =
                        if Set.member url model.loaded then
                            "/assets/images/loading.gif"

                        else
                            url
                    , description = ""
                    }
                , html <|
                    Html.img
                        [ HtmlAttr.hidden True
                        , HtmlEvents.on "load" (Decode.succeed (ImgLoaded url))
                        , HtmlAttr.src url
                        ]
                        []
                ]

        ( currentAnchor, currentId ) =
            model.currentPage
    in
    column
        [ width fill
        , height fill
        , scrollbarY
        , htmlAttribute <| HtmlAttr.id "MainPanel"
        , if not <| Set.isEmpty model.loaded then
            alpha 0.7

          else
            noAttr
        ]
        [ el
            [ centerX
            , padding 15
            , htmlAttribute <| HtmlAttr.id (currentId ++ " 0")
            , Font.size 22
            , Font.bold
            ]
            (Dict.get currentId model.pages
                |> Maybe.map .title
                |> Maybe.withDefault ""
                |> text
            )
        , column
            [ spacing 15
            , width fill
            , htmlAttribute <| HtmlAttr.id "MainContent"
            ]
            (Dict.get currentId model.pages
                |> Maybe.map .content
                |> Maybe.withDefault []
                |> List.map contentView
            )
        ]



---------------------
-- Helper functions--
---------------------


scrollTo : String -> Cmd Msg
scrollTo destId =
    Dom.getElement "MainContent"
        |> Task.andThen
            (\mainContInfo ->
                Dom.getElement
                    destId
                    |> Task.andThen
                        (\el ->
                            Dom.setViewportOf "MainPanel"
                                0
                                (el.element.y
                                    - mainContInfo.element.y
                                    - 50
                                )
                        )
            )
        |> Task.attempt (\_ -> NoOp)



-------------------------------------------------------------------------------


helpPagesData =
    [ { id = "root"
      , title = "Notice éditeur murol.fr"
      , content =
            [ ( 1, "images/notice/Diapositive1.jpg" )
            ]
      }
    , { id = "ae7aa3c8-b706-4cb7-948b-7038313b2f0c"
      , title = "Introduction"
      , content =
            [ ( 1, "images/notice/Diapositive2.jpg" )
            , ( 2, "images/notice/Diapositive3.jpg" )
            , ( 3, "images/notice/Diapositive4.jpg" )
            , ( 4, "images/notice/Diapositive5.jpg" )
            , ( 5, "images/notice/Diapositive6.jpg" )
            ]
      }
    , { id = "7f766d94-79ec-4856-8e2e-19216dbe0c91"
      , title = "Actualités"
      , content =
            [ ( 1, "images/notice/Diapositive7.jpg" )
            , ( 2, "images/notice/Diapositive8.jpg" )
            ]
      }
    , { id = "51edfc29-3bfa-4205-ae65-f1ac667fedc8"
      , title = "Blocs de texte"
      , content =
            [ ( 1, "images/notice/Diapositive9.jpg" )
            ]
      }
    , { id = "a4393746-a12b-467c-b6a5-2e66a6bfdbf7"
      , title = "Liens"
      , content =
            [ ( 1, "images/notice/Diapositive10.jpg" )
            , ( 2, "images/notice/Diapositive11.jpg" )
            , ( 3, "images/notice/Diapositive12.jpg" )
            ]
      }
    , { id = "c75dccc8-43bc-44df-afd7-13fd68f23e23"
      , title = "Explorateur de fichiers"
      , content =
            [ ( 1, "images/notice/Diapositive13.jpg" )
            , ( 2, "images/notice/Diapositive14.jpg" )
            ]
      }
    , { id = "e8b32207-6cc8-4ec4-860c-adf9a078eb9c"
      , title = "Editeur de page"
      , content =
            [ ( 1, "images/notice/Diapositive15.jpg" )
            , ( 2, "images/notice/Diapositive16.jpg" )
            , ( 3, "images/notice/Diapositive17.jpg" )
            , ( 4, "images/notice/Diapositive18.jpg" )
            , ( 5, "images/notice/Diapositive19.jpg" )
            , ( 6, "images/notice/Diapositive20.jpg" )
            , ( 7, "images/notice/Diapositive21.jpg" )
            ]
      }
    , { id = "1a1737c1-0f5b-4b5c-9e7a-cba30cfcb2d9"
      , title = "Nouvelle cellule"
      , content =
            [ ( 1, "images/notice/Diapositive22.jpg" )
            , ( 2, "images/notice/Diapositive23.jpg" )
            , ( 3, "images/notice/Diapositive24.jpg" )
            , ( 4, "images/notice/Diapositive25.jpg" )
            , ( 5, "images/notice/Diapositive26.jpg" )
            , ( 6, "images/notice/Diapositive27.jpg" )
            , ( 7, "images/notice/Diapositive28.jpg" )
            , ( 8, "images/notice/Diapositive29.jpg" )
            ]
      }
    , { id = "b75e18b9-b962-4c18-91c3-c5134aae0bbd"
      , title = "Repertoire géneral"
      , content =
            [ ( 1, "images/notice/Diapositive30.jpg" )
            , ( 2, "images/notice/Diapositive31.jpg" )
            , ( 3, "images/notice/Diapositive32.jpg" )
            , ( 4, "images/notice/Diapositive33.jpg" )
            ]
      }
    , { id = "2cb30c5f-8e39-4268-9e7c-62dc71ee31e8"
      , title = "Structure du site"
      , content =
            [ ( 1, "images/notice/Diapositive34.jpg" )
            , ( 2, "images/notice/Diapositive35.jpg" )
            , ( 3, "images/notice/Diapositive36.jpg" )
            ]
      }
    , { id = "075813db-4278-4f4a-b19e-a4231123b42c"
      , title = "Publications"
      , content =
            [ ( 1, "images/notice/Diapositive37.jpg" )
            , ( 2, "images/notice/Diapositive38.jpg" )
            , ( 3, "images/notice/Diapositive39.jpg" )
            ]
      }
    , { id = "e2a9ed8a-ee41-430c-abc3-62cd08a55e84"
      , title = "Authentification"
      , content =
            [ ( 1, "images/notice/Diapositive40.jpg" )
            ]
      }
    , { id = "ebe3a696-5f34-428e-b88c-eef1fc99034f"
      , title = "Aide"
      , content =
            [ ( 1, "images/notice/Diapositive41.jpg" )
            ]
      }
    ]


indexEntriesData =
    [ { id = ( 0, "root" )
      , title = "Notice éditeur murol.fr"
      , parent = Nothing
      }

    -------------
    , { id = ( 0, "ae7aa3c8-b706-4cb7-948b-7038313b2f0c" )
      , title = "Introduction"
      , parent = Nothing
      }
    , { id = ( 1, "ae7aa3c8-b706-4cb7-948b-7038313b2f0c" )
      , title = "Adresse d'accès à l'éditeur"
      , parent = Just ( 0, "ae7aa3c8-b706-4cb7-948b-7038313b2f0c" )
      }
    , { id = ( 2, "ae7aa3c8-b706-4cb7-948b-7038313b2f0c" )
      , title = "Identification"
      , parent = Just ( 0, "ae7aa3c8-b706-4cb7-948b-7038313b2f0c" )
      }
    , { id = ( 3, "ae7aa3c8-b706-4cb7-948b-7038313b2f0c" )
      , title = "Chargement"
      , parent = Just ( 0, "ae7aa3c8-b706-4cb7-948b-7038313b2f0c" )
      }
    , { id = ( 4, "ae7aa3c8-b706-4cb7-948b-7038313b2f0c" )
      , title = "Les differents onglets"
      , parent = Just ( 0, "ae7aa3c8-b706-4cb7-948b-7038313b2f0c" )
      }
    , { id = ( 5, "ae7aa3c8-b706-4cb7-948b-7038313b2f0c" )
      , title = "Erreurs ou difficultés"
      , parent = Just ( 0, "ae7aa3c8-b706-4cb7-948b-7038313b2f0c" )
      }

    ------------
    , { id = ( 0, "7f766d94-79ec-4856-8e2e-19216dbe0c91" )
      , title = "Actualités"
      , parent = Nothing
      }
    , { id = ( 1, "7f766d94-79ec-4856-8e2e-19216dbe0c91" )
      , title = "Editeur d’actualités - écran d’accueil"
      , parent = Just ( 0, "7f766d94-79ec-4856-8e2e-19216dbe0c91" )
      }
    , { id = ( 2, "7f766d94-79ec-4856-8e2e-19216dbe0c91" )
      , title = "Créer une actualité"
      , parent = Just ( 0, "7f766d94-79ec-4856-8e2e-19216dbe0c91" )
      }

    ------------
    , { id = ( 0, "51edfc29-3bfa-4205-ae65-f1ac667fedc8" )
      , title = "Blocs de texte"
      , parent = Nothing
      }
    , { id = ( 1, "51edfc29-3bfa-4205-ae65-f1ac667fedc8" )
      , title = "Ecrire un texte pour une actualité ou une page"
      , parent = Just ( 0, "51edfc29-3bfa-4205-ae65-f1ac667fedc8" )
      }

    --, { id = ( 2, "51edfc29-3bfa-4205-ae65-f1ac667fedc8" )
    --  , title = "Changer le style du texte couleur du texte, du fond…"
    --  , parent = Just ( 0, "51edfc29-3bfa-4205-ae65-f1ac667fedc8" )
    --  }
    --, { id = ( 3, "51edfc29-3bfa-4205-ae65-f1ac667fedc8" )
    --  , title = "Créer ou modifier un titre"
    --  , parent = Just ( 0, "51edfc29-3bfa-4205-ae65-f1ac667fedc8" )
    --  }
    ------------
    , { id = ( 0, "a4393746-a12b-467c-b6a5-2e66a6bfdbf7" )
      , title = "Liens"
      , parent = Nothing
      }
    , { id = ( 1, "a4393746-a12b-467c-b6a5-2e66a6bfdbf7" )
      , title = "Inserer un lien vers une page du site"
      , parent = Just ( 0, "a4393746-a12b-467c-b6a5-2e66a6bfdbf7" )
      }
    , { id = ( 2, "a4393746-a12b-467c-b6a5-2e66a6bfdbf7" )
      , title = "Inserer un lien vers une page externe"
      , parent = Just ( 0, "a4393746-a12b-467c-b6a5-2e66a6bfdbf7" )
      }
    , { id = ( 3, "a4393746-a12b-467c-b6a5-2e66a6bfdbf7" )
      , title = "Inserer un lien vers un document"
      , parent = Just ( 0, "a4393746-a12b-467c-b6a5-2e66a6bfdbf7" )
      }

    ------------
    , { id = ( 0, "c75dccc8-43bc-44df-afd7-13fd68f23e23" )
      , title = "Explorateur de fichiers"
      , parent = Nothing
      }
    , { id = ( 1, "c75dccc8-43bc-44df-afd7-13fd68f23e23" )
      , title = "Mettre en ligne une image dans l’explorateur de fichiers"
      , parent = Just ( 0, "c75dccc8-43bc-44df-afd7-13fd68f23e23" )
      }
    , { id = ( 2, "c75dccc8-43bc-44df-afd7-13fd68f23e23" )
      , title = "mettre en ligne un document dans l’explorateur de fichiers"
      , parent = Just ( 0, "c75dccc8-43bc-44df-afd7-13fd68f23e23" )
      }

    ------------
    , { id = ( 0, "e8b32207-6cc8-4ec4-860c-adf9a078eb9c" )
      , title = "Editeur de page"
      , parent = Nothing
      }
    , { id = ( 1, "e8b32207-6cc8-4ec4-860c-adf9a078eb9c" )
      , title = "Créer ou modifier une page"
      , parent = Just ( 0, "e8b32207-6cc8-4ec4-860c-adf9a078eb9c" )
      }
    , { id = ( 2, "e8b32207-6cc8-4ec4-860c-adf9a078eb9c" )
      , title = "Menu déroulant de l’onglet fichier"
      , parent = Just ( 0, "e8b32207-6cc8-4ec4-860c-adf9a078eb9c" )
      }
    , { id = ( 3, "e8b32207-6cc8-4ec4-860c-adf9a078eb9c" )
      , title = "Menu déroulant de l’onglet mise en page"
      , parent = Just ( 0, "e8b32207-6cc8-4ec4-860c-adf9a078eb9c" )
      }
    , { id = ( 4, "e8b32207-6cc8-4ec4-860c-adf9a078eb9c" )
      , title = "Menu déroulant de l’onglet affichage"
      , parent = Just ( 0, "e8b32207-6cc8-4ec4-860c-adf9a078eb9c" )
      }
    , { id = ( 5, "e8b32207-6cc8-4ec4-860c-adf9a078eb9c" )
      , title = "Gestion des cellules"
      , parent = Just ( 0, "e8b32207-6cc8-4ec4-860c-adf9a078eb9c" )
      }
    , { id = ( 6, "e8b32207-6cc8-4ec4-860c-adf9a078eb9c" )
      , title = "Gestion des conteneurs"
      , parent = Just ( 0, "e8b32207-6cc8-4ec4-860c-adf9a078eb9c" )
      }
    , { id = ( 7, "e8b32207-6cc8-4ec4-860c-adf9a078eb9c" )
      , title = "Enregistrer une nouvelle page"
      , parent = Just ( 0, "e8b32207-6cc8-4ec4-860c-adf9a078eb9c" )
      }

    ------------
    , { id = ( 0, "1a1737c1-0f5b-4b5c-9e7a-cba30cfcb2d9" )
      , title = "Nouvelle cellule"
      , parent = Nothing
      }
    , { id = ( 1, "1a1737c1-0f5b-4b5c-9e7a-cba30cfcb2d9" )
      , title = "Bloc de texte"
      , parent = Just ( 0, "1a1737c1-0f5b-4b5c-9e7a-cba30cfcb2d9" )
      }
    , { id = ( 2, "1a1737c1-0f5b-4b5c-9e7a-cba30cfcb2d9" )
      , title = "Zone de blocs de lien"
      , parent = Just ( 0, "1a1737c1-0f5b-4b5c-9e7a-cba30cfcb2d9" )
      }
    , { id = ( 3, "1a1737c1-0f5b-4b5c-9e7a-cba30cfcb2d9" )
      , title = "Zone de fiches"
      , parent = Just ( 0, "1a1737c1-0f5b-4b5c-9e7a-cba30cfcb2d9" )
      }
    , { id = ( 4, "1a1737c1-0f5b-4b5c-9e7a-cba30cfcb2d9" )
      , title = "Image"
      , parent = Just ( 0, "1a1737c1-0f5b-4b5c-9e7a-cba30cfcb2d9" )
      }
    , { id = ( 5, "1a1737c1-0f5b-4b5c-9e7a-cba30cfcb2d9" )
      , title = "Vidéo"
      , parent = Just ( 0, "1a1737c1-0f5b-4b5c-9e7a-cba30cfcb2d9" )
      }
    , { id = ( 6, "1a1737c1-0f5b-4b5c-9e7a-cba30cfcb2d9" )
      , title = "Tableau"
      , parent = Just ( 0, "1a1737c1-0f5b-4b5c-9e7a-cba30cfcb2d9" )
      }
    , { id = ( 7, "1a1737c1-0f5b-4b5c-9e7a-cba30cfcb2d9" )
      , title = "Album phototheque existant"
      , parent = Just ( 0, "1a1737c1-0f5b-4b5c-9e7a-cba30cfcb2d9" )
      }
    , { id = ( 8, "1a1737c1-0f5b-4b5c-9e7a-cba30cfcb2d9" )
      , title = "Album phototheque création"
      , parent = Just ( 0, "1a1737c1-0f5b-4b5c-9e7a-cba30cfcb2d9" )
      }

    ------------
    , { id = ( 0, "b75e18b9-b962-4c18-91c3-c5134aae0bbd" )
      , title = "Repertoire géneral"
      , parent = Nothing
      }
    , { id = ( 1, "b75e18b9-b962-4c18-91c3-c5134aae0bbd" )
      , title = "Retrouver une fiche"
      , parent = Just ( 0, "b75e18b9-b962-4c18-91c3-c5134aae0bbd" )
      }
    , { id = ( 2, "b75e18b9-b962-4c18-91c3-c5134aae0bbd" )
      , title = "Modifier une fiche"
      , parent = Just ( 0, "b75e18b9-b962-4c18-91c3-c5134aae0bbd" )
      }
    , { id = ( 3, "b75e18b9-b962-4c18-91c3-c5134aae0bbd" )
      , title = "Créer une fiche - renseignements obligatoires"
      , parent = Just ( 0, "b75e18b9-b962-4c18-91c3-c5134aae0bbd" )
      }
    , { id = ( 4, "b75e18b9-b962-4c18-91c3-c5134aae0bbd" )
      , title = "Créer une fiche - renseignements facultatifs"
      , parent = Just ( 0, "b75e18b9-b962-4c18-91c3-c5134aae0bbd" )
      }

    ------------
    , { id = ( 0, "2cb30c5f-8e39-4268-9e7c-62dc71ee31e8" )
      , title = "Structure du site"
      , parent = Nothing
      }
    , { id = ( 1, "2cb30c5f-8e39-4268-9e7c-62dc71ee31e8" )
      , title = "Plan du site"
      , parent = Just ( 0, "2cb30c5f-8e39-4268-9e7c-62dc71ee31e8" )
      }
    , { id = ( 2, "2cb30c5f-8e39-4268-9e7c-62dc71ee31e8" )
      , title = "Modifier l'arborescence du site"
      , parent = Just ( 0, "2cb30c5f-8e39-4268-9e7c-62dc71ee31e8" )
      }
    , { id = ( 3, "2cb30c5f-8e39-4268-9e7c-62dc71ee31e8" )
      , title = "Gestion des mots clés"
      , parent = Just ( 0, "2cb30c5f-8e39-4268-9e7c-62dc71ee31e8" )
      }

    ------------
    , { id = ( 0, "075813db-4278-4f4a-b19e-a4231123b42c" )
      , title = "Publications"
      , parent = Nothing
      }
    , { id = ( 1, "075813db-4278-4f4a-b19e-a4231123b42c" )
      , title = "Murol infos"
      , parent = Just ( 0, "075813db-4278-4f4a-b19e-a4231123b42c" )
      }
    , { id = ( 2, "075813db-4278-4f4a-b19e-a4231123b42c" )
      , title = "Délibérations"
      , parent = Just ( 0, "075813db-4278-4f4a-b19e-a4231123b42c" )
      }
    , { id = ( 3, "075813db-4278-4f4a-b19e-a4231123b42c" )
      , title = "Bulletins municipaux"
      , parent = Just ( 0, "075813db-4278-4f4a-b19e-a4231123b42c" )
      }

    ------------
    , { id = ( 0, "e2a9ed8a-ee41-430c-abc3-62cd08a55e84" )
      , title = "Authentification"
      , parent = Nothing
      }

    ------------
    , { id = ( 0, "ebe3a696-5f34-428e-b88c-eef1fc99034f" )
      , title = "Aide"
      , parent = Nothing
      }
    ]
