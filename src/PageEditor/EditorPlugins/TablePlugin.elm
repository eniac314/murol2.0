module PageEditor.EditorPlugins.TablePlugin exposing (..)

import Array exposing (..)
import Browser exposing (..)
import Dict exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Keyed as Keyed
import Element.Lazy as Lazy
import Element.Region as Region
import Html exposing (Html)
import Html.Attributes as HtmlAttr
import Internals.CommonStyleHelpers exposing (..)
import PageEditor.DocumentViews.StyleSheets exposing (..)
import PageEditor.Internals.Document exposing (..)
import PageEditor.Internals.DocumentEditorHelpers exposing (..)


maxRows =
    100


maxCols =
    30


type DisplayMode
    = DisplayOnly
    | Edit


type alias Data =
    Array (Array String)


type Msg
    = SetNbrRows String
    | SetNbrCols String
    | SetStyle String
    | StyleSelectorClick
    | StyleSelectorClickOff
    | InitializeTable
    | DataInput ( Int, Int ) String
    | CellFocused (Maybe ( Int, Int ))
    | RemoveSelectedRow
    | RemoveSelectedCol
    | AddNew Direction
    | SwapDisplayMode
    | SaveAndQuit
    | Quit


type Direction
    = Up
    | Down
    | Left
    | Right



--main : Program () Model msg Msg
--main =
--    Browser.sandbox
--        { init = init Nothing
--        , update =
--            \model msg ->
--                update model msg
--                    |> Tuple.first
--        , view = view
--        }


type alias Model msg =
    { mode : DisplayMode
    , data : Data
    , nbrColsInput : String
    , nbrRowsInput : String
    , nbrRows : Int
    , nbrCols : Int
    , setupDone : Bool
    , error : String
    , currentStyle : String
    , styleSelectorFocused : Bool
    , styleSelectorInput : String
    , currentFocusedCell : Maybe ( Int, Int )
    , externalMsg : Msg -> msg
    }


emptyDocTable externalMsg =
    { mode = Edit
    , data = Array.empty
    , nbrRows = 0
    , nbrCols = 0
    , nbrRowsInput = ""
    , nbrColsInput = ""
    , error = ""
    , setupDone = False
    , currentStyle = "bleu-blanc"
    , styleSelectorInput = ""
    , styleSelectorFocused = False
    , currentFocusedCell = Nothing
    , externalMsg = externalMsg
    }


init mbTableMeta externalMsg =
    case mbTableMeta of
        Nothing ->
            --First time initialisation
            emptyDocTable externalMsg

        Just { style, nbrRows, nbrCols, data } ->
            if data == [] then
                --New Table cell
                emptyDocTable externalMsg
            else
                -- Existing Table cell
                { mode = Edit
                , data = Array.fromList data
                , nbrRows = nbrRows
                , nbrCols = nbrCols
                , nbrRowsInput = ""
                , nbrColsInput = ""
                , error = ""
                , setupDone = True
                , currentStyle = style
                , styleSelectorInput = ""
                , styleSelectorFocused = False
                , currentFocusedCell = Nothing
                , externalMsg = externalMsg
                }


update : Msg -> Model msg -> ( Model msg, Maybe (EditorPluginResult TableMeta) )
update msg model =
    case msg of
        SetNbrRows s ->
            ( { model
                | nbrRowsInput = s
              }
            , Nothing
            )

        SetNbrCols s ->
            ( { model
                | nbrColsInput = s
              }
            , Nothing
            )

        SetStyle s ->
            ( { model
                | styleSelectorInput = s
                , currentStyle =
                    case Dict.get s tableStyles of
                        Nothing ->
                            model.currentStyle

                        Just _ ->
                            s
              }
            , Nothing
            )

        StyleSelectorClick ->
            ( { model
                | styleSelectorFocused = not model.styleSelectorFocused
                , currentFocusedCell = Nothing
              }
            , Nothing
            )

        StyleSelectorClickOff ->
            ( { model
                | styleSelectorFocused = False
              }
            , Nothing
            )

        InitializeTable ->
            let
                nbrRows =
                    String.toInt model.nbrRowsInput
                        |> Maybe.withDefault 0
                        |> (\n ->
                                if n <= maxRows then
                                    n
                                else
                                    model.nbrRows
                           )

                nbrCols =
                    String.toInt model.nbrColsInput
                        |> Maybe.withDefault 0
                        |> (\n ->
                                if n <= maxCols then
                                    n
                                else
                                    model.nbrCols
                           )

                data =
                    makeDataGrid nbrRows nbrCols
            in
            ( { model
                | nbrColsInput = ""
                , nbrRowsInput = ""
                , nbrCols = nbrCols
                , nbrRows = nbrRows
                , data = data
                , setupDone = True
              }
            , Nothing
            )

        DataInput ( i, j ) s ->
            ( { model
                | data =
                    case Array.get i model.data of
                        Nothing ->
                            model.data

                        Just a ->
                            Array.set i
                                (Array.set j s a)
                                model.data
              }
            , Nothing
            )

        CellFocused mbFocus ->
            ( { model | currentFocusedCell = mbFocus }
            , Nothing
            )

        RemoveSelectedRow ->
            case model.currentFocusedCell of
                Nothing ->
                    ( model, Nothing )

                Just ( ri, ci ) ->
                    let
                        newData =
                            Array.toIndexedList model.data
                                |> List.filter (\( i, _ ) -> i /= ri)
                                |> List.map Tuple.second
                                |> Array.fromList
                    in
                    ( { model
                        | data = newData
                        , nbrRows = model.nbrRows + 1
                        , currentFocusedCell = Nothing
                      }
                    , Nothing
                    )

        RemoveSelectedCol ->
            case model.currentFocusedCell of
                Nothing ->
                    ( model, Nothing )

                Just ( ri, ci ) ->
                    let
                        newData =
                            model.data
                                |> Array.map
                                    (\row ->
                                        Array.toIndexedList row
                                            |> List.filter (\( j, _ ) -> j /= ci)
                                            |> List.map Tuple.second
                                            |> Array.fromList
                                    )
                    in
                    ( { model
                        | data = newData
                        , nbrCols = model.nbrCols - 1
                        , currentFocusedCell = Nothing
                      }
                    , Nothing
                    )

        AddNew direction ->
            case ( direction, model.currentFocusedCell ) of
                ( Up, Nothing ) ->
                    let
                        newRow =
                            Array.fromList
                                [ Array.initialize model.nbrCols (always "") ]
                    in
                    ( { model
                        | data = Array.append newRow model.data
                        , nbrRows = model.nbrRows + 1
                      }
                    , Nothing
                    )

                ( Down, Nothing ) ->
                    let
                        newRow =
                            Array.initialize model.nbrCols (always "")
                    in
                    ( { model
                        | data = Array.push newRow model.data
                        , nbrRows = model.nbrRows + 1
                      }
                    , Nothing
                    )

                ( Left, Nothing ) ->
                    let
                        newData =
                            model.data
                                |> Array.map
                                    (\row -> Array.append (Array.fromList [ "" ]) row)
                    in
                    ( { model
                        | data = newData
                        , nbrCols = model.nbrCols + 1
                      }
                    , Nothing
                    )

                ( Right, Nothing ) ->
                    let
                        newData =
                            model.data
                                |> Array.map
                                    (\row -> Array.push "" row)
                    in
                    ( { model
                        | data = newData
                        , nbrCols = model.nbrCols + 1
                      }
                    , Nothing
                    )

                ( Up, Just ( i, j ) ) ->
                    let
                        newRow =
                            Array.fromList
                                [ Array.initialize model.nbrCols (always "") ]

                        topHalf =
                            Array.slice 0 i model.data

                        bottomHalf =
                            Array.slice i model.nbrRows model.data

                        newData =
                            Array.append newRow bottomHalf
                                |> Array.append topHalf
                    in
                    ( { model
                        | data = newData
                        , currentFocusedCell = Nothing
                        , nbrRows = model.nbrRows + 1
                      }
                    , Nothing
                    )

                ( Down, Just ( i, j ) ) ->
                    let
                        newRow =
                            Array.fromList
                                [ Array.initialize model.nbrCols (always "") ]

                        topHalf =
                            Array.slice 0 (i + 1) model.data

                        bottomHalf =
                            Array.slice (i + 1) model.nbrRows model.data

                        newData =
                            Array.append newRow bottomHalf
                                |> Array.append topHalf
                    in
                    ( { model
                        | data = newData
                        , currentFocusedCell = Nothing
                        , nbrRows = model.nbrRows + 1
                      }
                    , Nothing
                    )

                ( Left, Just ( i, j ) ) ->
                    let
                        addNewCell row =
                            let
                                leftHalf =
                                    Array.slice 0 j row

                                rightHalf =
                                    Array.slice j model.nbrCols row
                            in
                            Array.append (Array.push "" leftHalf) rightHalf

                        newData =
                            Array.map addNewCell model.data
                    in
                    ( { model
                        | data = newData
                        , currentFocusedCell = Nothing
                        , nbrCols = model.nbrCols + 1
                      }
                    , Nothing
                    )

                ( Right, Just ( i, j ) ) ->
                    let
                        addNewCell row =
                            let
                                leftHalf =
                                    Array.slice 0 (j + 1) row

                                rightHalf =
                                    Array.slice (j + 1) model.nbrCols row
                            in
                            Array.append (Array.push "" leftHalf) rightHalf

                        newData =
                            Array.map addNewCell model.data
                    in
                    ( { model
                        | data = newData
                        , currentFocusedCell = Nothing
                        , nbrCols = model.nbrCols + 1
                      }
                    , Nothing
                    )

        SwapDisplayMode ->
            ( { model
                | mode =
                    if
                        model.mode
                            == DisplayOnly
                    then
                        Edit
                    else
                        DisplayOnly
                , currentFocusedCell = Nothing
              }
            , Nothing
            )

        SaveAndQuit ->
            ( model
            , Just <| EditorPluginData (toTableMeta model)
            )

        Quit ->
            ( model
            , Just EditorPluginQuit
            )


view : Model msg -> Element msg
view model =
    Element.map model.externalMsg <|
        column
            ([ Font.size 16
             , width fill
             , height fill
             , scrollbarY
             , alignTop
             , padding 15
             , spacing 15
             ]
                ++ (if model.styleSelectorFocused then
                        [ Events.onClick StyleSelectorClickOff ]
                    else
                        []
                   )
             --++ (if model.currentFocusedCell /= Nothing then
             --        [ Events.onClick CellFocusOff ]
             --    else
             --        []
             --   )
            )
            [ text "Insérer / Modifier un tableau: "
            , case model.mode of
                DisplayOnly ->
                    displayOnlyView model

                Edit ->
                    editView model
            ]


displayOnlyView : Model msg -> Element Msg
displayOnlyView model =
    let
        interfaceView =
            column []
                [ row
                    [ spacing 15 ]
                    [ Input.button (buttonStyle True)
                        { onPress = Just SwapDisplayMode
                        , label = text "Modifier"
                        }
                    ]
                ]

        dataForTable =
            model.data
                |> Array.toList

        columns =
            List.map
                (\ci ->
                    { header = Element.none
                    , width = fill
                    , view =
                        \ri row ->
                            el
                                (Dict.get model.currentStyle tableStyles
                                    |> Maybe.map .containerStyle
                                    |> Maybe.withDefault []
                                    |> (\s -> height fill :: s)
                                )
                                (el
                                    ((Dict.get model.currentStyle tableStyles
                                        |> Maybe.map .cellStyle
                                        |> Maybe.withDefault (\_ -> [])
                                     )
                                        ri
                                        ++ [ paddingXY 15 5
                                           , height (minimum 30 fill)
                                           ]
                                    )
                                    (text
                                        (Array.get ci row
                                            |> Maybe.withDefault ""
                                        )
                                    )
                                )
                    }
                )
                (List.range
                    0
                    (model.nbrCols - 1)
                )

        tableView =
            if model.setupDone then
                indexedTable
                    (Dict.get model.currentStyle tableStyles
                        |> Maybe.map .tableStyle
                        |> Maybe.withDefault []
                    )
                    { data = dataForTable
                    , columns = columns
                    }
            else
                Element.none
    in
    column
        [ spacing 15
        , width fill
        ]
        [ interfaceView
        , tableView
        ]


editView : Model msg -> Element Msg
editView model =
    let
        canRemove =
            focusIsValid model.currentFocusedCell model.data

        interfaceView =
            if model.setupDone then
                column [ spacing 15 ]
                    [ row
                        [ spacing 15 ]
                        [ Input.button (buttonStyle True)
                            { onPress =
                                Just SwapDisplayMode
                            , label = text "Aperçu"
                            }
                        , styleSelector model
                        , Input.button (buttonStyle canRemove)
                            { onPress =
                                if canRemove then
                                    Just RemoveSelectedRow
                                else
                                    Nothing
                            , label = text "Supprimer ligne"
                            }
                        , Input.button (buttonStyle canRemove)
                            { onPress =
                                if canRemove then
                                    Just RemoveSelectedCol
                                else
                                    Nothing
                            , label = text "Supprimer colonne"
                            }
                        ]
                    , row
                        [ spacing 15 ]
                        [ Input.button (buttonStyle True)
                            { onPress =
                                Just (AddNew Up)
                            , label = text "Insérer au dessus"
                            }
                        , Input.button (buttonStyle True)
                            { onPress =
                                Just (AddNew Down)
                            , label = text "Insérer en dessous"
                            }
                        , Input.button (buttonStyle True)
                            { onPress =
                                Just (AddNew Left)
                            , label = text "Insérer à gauche"
                            }
                        , Input.button (buttonStyle True)
                            { onPress =
                                Just (AddNew Right)
                            , label = text "Insérer à droite"
                            }
                        ]
                    ]
            else
                column
                    []
                    [ row
                        [ spacing 15
                        ]
                        [ Input.text textInputStyle
                            { onChange =
                                SetNbrCols
                            , text = model.nbrColsInput
                            , placeholder = Nothing
                            , label =
                                Input.labelLeft [ centerY ] (el [] (text "Nbr colonnes"))
                            }
                        , Input.text textInputStyle
                            { onChange =
                                SetNbrRows
                            , text = model.nbrRowsInput
                            , placeholder = Nothing
                            , label =
                                Input.labelLeft [ centerY ] (el [] (text "Nbr lignes"))
                            }
                        , Input.button (buttonStyle True)
                            { onPress = Just InitializeTable
                            , label = text "Créer table"
                            }
                        ]
                    , el [] (text model.error)
                    ]

        dataForTable =
            model.data
                |> Array.toList

        columns =
            List.map
                (\ci ->
                    { header = Element.none
                    , width = fill
                    , view =
                        --Lazy.lazy2 <|
                        \ri row ->
                            el
                                (Dict.get model.currentStyle tableStyles
                                    |> Maybe.map .containerStyle
                                    |> Maybe.withDefault []
                                )
                                (Keyed.el
                                    ((Dict.get model.currentStyle tableStyles
                                        |> Maybe.map .cellStyle
                                        |> Maybe.withDefault (\_ -> [])
                                     )
                                        ri
                                        ++ (case model.currentFocusedCell of
                                                Nothing ->
                                                    []

                                                Just ( i, j ) ->
                                                    if i == ri && j == ci then
                                                        [ Background.color (rgba 0 0 1 0.2) ]
                                                    else
                                                        []
                                           )
                                    )
                                    ( String.fromInt (ri * 100 + ci)
                                    , Input.multiline
                                        [ Border.width 0
                                        , centerY
                                        , Background.color (rgba 1 1 1 0)
                                        , Events.onClick (CellFocused <| Just ( ri, ci ))
                                        , focused [ Border.glow (rgb 1 1 1) 0 ]

                                        --, Events.onLoseFocus (CellFocused Nothing)
                                        ]
                                        { onChange =
                                            DataInput ( ri, ci )
                                        , text =
                                            Array.get ci row
                                                |> Maybe.withDefault ""
                                        , placeholder = Nothing
                                        , label =
                                            Input.labelAbove [] Element.none
                                        , spellcheck = False
                                        }
                                    )
                                )
                    }
                )
                (List.range
                    0
                    (model.nbrCols - 1)
                )

        tableView =
            if model.setupDone then
                indexedTable
                    (Dict.get model.currentStyle tableStyles
                        |> Maybe.map .tableStyle
                        |> Maybe.withDefault []
                    )
                    { data = dataForTable
                    , columns = columns
                    }
            else
                Element.none
    in
    column
        [ spacing 15
        , width fill
        ]
        [ interfaceView
        , tableView
        , if model.setupDone then
            row
                [ spacing 15
                , paddingEach
                    { top = 0
                    , bottom = 15
                    , right = 0
                    , left = 0
                    }
                ]
                [ Input.button (buttonStyle True)
                    { onPress = Just Quit
                    , label = text "Quitter"
                    }
                , Input.button (buttonStyle True)
                    { onPress = Just SaveAndQuit
                    , label = text "Valider et Quitter"
                    }
                ]
          else
            Element.none

        --, paragraph [] [ text <| Debug.toString model.data ]
        --, paragraph [] [ text <| Debug.toString (test model.currentFocusedCell model.data) ]
        ]


textInputStyle =
    [ width (px 50)
    , paddingXY 5 5
    , spacing 15
    ]


focusIsValid : Maybe ( Int, Int ) -> Data -> Bool
focusIsValid mbFocus data =
    Maybe.andThen
        (\( i, j ) ->
            Array.get i data
                |> Maybe.map (\row -> Array.get j row)
        )
        mbFocus
        |> Maybe.map (\_ -> True)
        |> Maybe.withDefault False


styleSelector model =
    row
        []
        [ Input.text
            [ Events.onClick StyleSelectorClick

            --, Events.onLoseFocus BlurStyleSelector
            , width (px 150)
            , below <|
                if model.styleSelectorFocused then
                    column []
                        (List.map
                            (\s ->
                                el
                                    [ Events.onClick (SetStyle s)
                                    , pointer
                                    , mouseOver
                                        [ Font.color (rgb 1 1 1)
                                        , Background.color (rgb 0.7 0.7 0.7)
                                        ]
                                    , Background.color (rgb 1 1 1)
                                    , width (px 150)
                                    , paddingXY 15 5
                                    ]
                                    (text s)
                            )
                            (Dict.keys tableStyles)
                        )
                else
                    Element.none
            , spacing 15
            , paddingXY 15 5
            , focused [ Border.glow (rgb 1 1 1) 0 ]
            ]
            { onChange =
                SetStyle
            , text = model.styleSelectorInput
            , placeholder = Just (Input.placeholder [] (el [] (text model.currentStyle)))
            , label =
                Input.labelLeft [ centerY ] (el [] (text "Style"))
            }
        ]


makeDataGrid : Int -> Int -> Data
makeDataGrid i j =
    Array.initialize
        i
        (always <| Array.initialize j (always ""))


toTableMeta : Model msg -> TableMeta
toTableMeta docTable =
    { style = docTable.currentStyle
    , nbrRows = docTable.nbrRows
    , nbrCols = docTable.nbrCols
    , data = Array.toList docTable.data
    }
