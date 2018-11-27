module PageEditor.EditorPlugins.FichesPlugin exposing (..)

import Dict exposing (..)
import Document.Document exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Keyed as Keyed
import Element.Lazy as Lazy
import Element.Region as Region
import GeneralDirectoryEditor.GeneralDirCommonTypes exposing (Fiche, Label)
import GeneralDirectoryEditor.GeneralDirHelpers exposing (..)
import GeneralDirectoryEditor.GeneralDirectoryEditor as GeneralDirectoryEditor exposing (Model, fichesData)
import Html exposing (Html)
import Html.Attributes as Attr
import Internals.CommonStyleHelpers exposing (..)
import Internals.Icons as Icons exposing (checkSquare, square)
import PageEditor.Internals.DocumentEditorHelpers exposing (..)
import Set exposing (..)


type alias Model msg =
    { nameFilter : Maybe String
    , catFilter : Maybe String
    , activFilter : Maybe String
    , labelFilter : Maybe String
    , selectedFiche : Maybe String
    , selectedFiches : Set String
    , externalMsg : Msg -> msg
    , groupSel : Maybe GroupSelection
    }


type Msg
    = FilterByName String
    | FilterByCat String
    | FilterByActiv String
    | FilterByLabel String
    | GroupSel GroupSelection
    | ToogleFiche String
    | Quit
    | SaveAndQuit
    | NoOp


type GroupSelection
    = All
    | None


init : List String -> (Msg -> msg) -> Model msg
init selectedFiches externalMsg =
    { nameFilter = Nothing
    , catFilter = Nothing
    , activFilter = Nothing
    , labelFilter = Nothing
    , selectedFiche = Nothing
    , selectedFiches = Set.fromList selectedFiches
    , externalMsg = externalMsg
    , groupSel = Nothing
    }


type alias UpdateConfig config msg =
    { config | genDirEditor : GeneralDirectoryEditor.Model msg }


update : UpdateConfig config msg -> Msg -> Model msg -> ( Model msg, Maybe (EditorPluginResult (List String)) )
update config msg model =
    case msg of
        FilterByName nom ->
            ( { model
                | nameFilter = Just nom
                , groupSel = Nothing
              }
            , Nothing
            )

        FilterByCat cat ->
            ( { model
                | catFilter =
                    if model.catFilter == Just cat then
                        Nothing
                    else
                        Just cat
                , groupSel = Nothing
              }
            , Nothing
            )

        FilterByActiv activ ->
            ( { model
                | activFilter =
                    if model.activFilter == Just activ then
                        Nothing
                    else
                        Just activ
                , groupSel = Nothing
              }
            , Nothing
            )

        FilterByLabel label ->
            ( { model
                | labelFilter =
                    if model.labelFilter == Just label then
                        Nothing
                    else
                        Just label
                , groupSel = Nothing
              }
            , Nothing
            )

        GroupSel sel ->
            case sel of
                All ->
                    let
                        fichesToAdd =
                            filteredFiches config model
                                |> List.map Tuple.first
                                |> Set.fromList
                    in
                    ( { model
                        | selectedFiches =
                            Set.union
                                model.selectedFiches
                                fichesToAdd
                        , groupSel = Just sel
                      }
                    , Nothing
                    )

                None ->
                    ( { model
                        | selectedFiches =
                            Set.empty
                        , groupSel = Just sel
                      }
                    , Nothing
                    )

        ToogleFiche s ->
            ( { model
                | selectedFiches =
                    if Set.member s model.selectedFiches then
                        Set.remove s model.selectedFiches
                    else
                        Set.insert s model.selectedFiches
                , groupSel = Nothing
              }
            , Nothing
            )

        Quit ->
            ( model, Just EditorPluginQuit )

        SaveAndQuit ->
            if model.selectedFiches == Set.empty then
                ( model, Nothing )
            else
                ( model
                , Just
                    (EditorPluginData
                        (Set.toList model.selectedFiches)
                    )
                )

        NoOp ->
            ( model, Nothing )


type alias ViewConfig config msg =
    { config | genDirEditor : GeneralDirectoryEditor.Model msg }


view : ViewConfig config msg -> Model msg -> Element msg
view config model =
    Element.map model.externalMsg <|
        el
            [ width fill
            , height fill
            , scrollbarY
            ]
            (column
                [ spacing 15
                , padding 15
                , alignTop
                ]
                [ el
                    containerStyle
                    (nameSelector config model)
                , row
                    ([ spacing 15 ]
                        ++ containerStyle
                    )
                    [ catSelector config model
                    , activSelector config model
                    , labelSelector config model
                    ]
                , ficheSelector config model
                , row
                    [ spacing 15 ]
                    [ Input.button
                        (buttonStyle True)
                        { onPress = Just Quit
                        , label = text "Retour"
                        }
                    , Input.button
                        (buttonStyle (model.selectedFiches /= Set.empty))
                        { onPress =
                            if model.selectedFiches /= Set.empty then
                                Just SaveAndQuit
                            else
                                Nothing
                        , label = text "Valider"
                        }
                    ]
                ]
            )


nameSelector : ViewConfig config msg -> Model msg -> Element Msg
nameSelector { genDirEditor } model =
    row
        formItemStyle
        [ Input.text
            (textInputStyle
                ++ [ spacingXY 0 15
                   , width (px 400)
                   ]
            )
            { onChange =
                FilterByName
            , text =
                model.nameFilter
                    |> Maybe.withDefault ""
            , placeholder =
                Just <|
                    Input.placeholder
                        []
                        (text "Filtrer par nom entité")
            , label =
                Input.labelLeft [] Element.none
            }
        ]


catSelector : ViewConfig config msg -> Model msg -> Element Msg
catSelector { genDirEditor } model =
    let
        categories =
            computeCats (fichesData genDirEditor)
    in
    column
        ([ spacing 15
         , alignTop
         ]
            ++ formItemStyle
        )
        [ el
            [ Font.bold
            , Font.color grey1
            ]
            (text "Catégories disponibles")
        , column
            [ Border.width 2
            , Border.color grey3
            , width (px 150)
            , height (px 200)
            , scrollbars
            ]
            (Set.toList categories
                |> List.map
                    (\e ->
                        selectView
                            False
                            model.catFilter
                            (FilterByCat e)
                            e
                    )
            )
        ]


activSelector : ViewConfig config msg -> Model msg -> Element Msg
activSelector { genDirEditor } model =
    let
        activites =
            computeActivs (fichesData genDirEditor)
    in
    column
        ([ spacing 15
         , alignTop
         ]
            ++ formItemStyle
        )
        [ el
            [ Font.bold
            , Font.color grey1
            ]
            (text "Activités disponibles")
        , column
            [ Border.width 2
            , Border.color grey3
            , width (px 350)
            , height (px 200)
            , scrollbars
            ]
            (Set.toList activites
                |> List.map
                    (\e ->
                        selectView False
                            model.activFilter
                            (FilterByActiv e)
                            e
                    )
            )
        ]


labelSelector : ViewConfig config msg -> Model msg -> Element Msg
labelSelector { genDirEditor } model =
    let
        labels =
            computeLabels (fichesData genDirEditor)
    in
    column
        ([ spacing 15
         , alignTop
         ]
            ++ formItemStyle
        )
        [ el
            [ Font.bold
            , Font.color grey1
            ]
            (text "Labels disponibles")
        , column
            [ Border.width 2
            , Border.color grey3
            , width (px 150)
            , height (px 200)
            , scrollbars
            ]
            (List.map .nom labels
                |> List.map
                    (\e ->
                        selectView
                            False
                            model.labelFilter
                            (FilterByLabel e)
                            e
                    )
            )
        ]


ficheSelector : ViewConfig config msg -> Model msg -> Element Msg
ficheSelector config model =
    let
        isChecked fId =
            Set.member fId model.selectedFiches
    in
    column
        containerStyle
        [ column
            (formItemStyle
                ++ [ spacing 15, width fill ]
            )
            [ el [ Font.bold ]
                (text "Nom fiche entité")
            , column
                [ Border.width 2
                , Border.color grey3
                , width fill
                , height (px 480)
                , scrollbars
                ]
                (filteredFiches config model
                    |> List.map (\( k, v ) -> ( k, v.nomEntite ))
                    |> List.map
                        (\( k, n ) ->
                            checkView (isChecked k) k n
                        )
                )
            ]
        , row
            ([ spacing 15
             , width fill
             ]
                ++ formItemStyle
            )
            [ el
                [ Font.bold
                , Font.color grey1
                ]
                (text "Sélection groupée")
            , Input.radioRow
                [ spacing 15 ]
                { onChange = GroupSel
                , options =
                    [ Input.option All (text "Tout")
                    , Input.option None (text "Rien")
                    ]
                , selected =
                    model.groupSel
                , label = Input.labelHidden ""
                }
            ]
        ]



-------------------------------------------------------------------------------
------------------
-- Misc Helpers --
------------------


filteredFiches :
    { config | genDirEditor : GeneralDirectoryEditor.Model msg }
    -> Model msg
    -> List ( String, Fiche )
filteredFiches { genDirEditor } model =
    let
        nameFilterFun =
            case model.nameFilter of
                Just "" ->
                    always True

                Just name ->
                    \( k, f ) ->
                        String.contains
                            (String.toLower name)
                            (String.toLower f.nomEntite)

                Nothing ->
                    always True

        catFilterFun =
            case model.catFilter of
                Just cat ->
                    \( k, f ) -> List.member cat f.categories

                Nothing ->
                    always True

        activFilterFun =
            case model.activFilter of
                Just activ ->
                    \( k, f ) -> List.member activ f.natureActiv

                Nothing ->
                    always True

        labelFilterFun =
            case model.labelFilter of
                Just label ->
                    \( k, f ) ->
                        List.any (\l -> l.nom == label) f.label

                Nothing ->
                    always True
    in
    Dict.toList (fichesData genDirEditor)
        |> List.filter nameFilterFun
        |> List.filter catFilterFun
        |> List.filter activFilterFun
        |> List.filter labelFilterFun
        |> List.sortBy (\( k, f ) -> String.toLower f.nomEntite)



-------------------------------------------------------------------------------
------------------
-- View Helpers --
------------------


selectView : Bool -> Maybe String -> Msg -> String -> Element Msg
selectView isFicheData selected handler entry =
    Keyed.el
        [ width fill
        , paddingXY 5 5
        , Events.onClick handler
        , pointer
        , if Just entry == selected then
            Background.color
                grey4
          else
            noAttr
        , if isFicheData then
            Font.color teal3
          else
            Font.color grey2
        ]
        ( entry, text entry )


checkView : Bool -> String -> String -> Element Msg
checkView isChecked ficheId entry =
    Keyed.row
        [ width fill
        , paddingXY 5 5
        , pointer
        , Events.onClick (ToogleFiche ficheId)
        , mouseOver
            [ Background.color grey4 ]
        , spacing 10
        ]
        [ ( entry
          , if isChecked then
                el [ Font.color grey1 ]
                    (html <| checkSquare 18)
            else
                el [ Font.color grey1 ]
                    (html <| square 18)
          )
        , ( entry
          , el [ Font.color grey2 ]
                (text entry)
          )
        ]


containerStyle : List (Attribute msg)
containerStyle =
    [ padding 15
    , Background.color grey6
    , Border.rounded 5
    , width fill
    ]


formItemStyle : List (Attribute msg)
formItemStyle =
    [ padding 15
    , Background.color grey7
    , Border.rounded 5
    ]
