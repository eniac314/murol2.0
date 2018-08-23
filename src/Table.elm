module Table exposing (..)

--import Document exposing (..)

import Browser exposing (element)
import Dict exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Region as Region
import Html exposing (Html)


maxRows =
    100


maxCols =
    30


type DisplayMode
    = DisplayOnly
    | Edit


type alias Data =
    Dict Int (Dict Int String)


type Msg
    = SetNbrRows String
    | SetNbrCols String
    | InitializeTable
    | DataInput ( Int, Int ) String
    | SwapDisplayMode


type alias DocTable =
    { mode : DisplayMode
    , data : Data
    , nbrColsInput : String
    , nbrRowsInput : String
    , nbrRows : Int
    , nbrCols : Int
    , setupDone : Bool
    , error : String
    }


main : Program () DocTable Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


subscriptions model =
    Sub.none


init flags =
    ( { mode = Edit
      , data = Dict.empty
      , nbrRows = 0
      , nbrCols = 0
      , nbrRowsInput = ""
      , nbrColsInput = ""
      , error = ""
      , setupDone = False
      }
    , Cmd.none
    )


update msg model =
    case msg of
        SetNbrRows s ->
            ( { model
                | nbrRowsInput = s
              }
            , Cmd.none
            )

        SetNbrCols s ->
            ( { model
                | nbrColsInput = s
              }
            , Cmd.none
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
            , Cmd.none
            )

        DataInput ( i, j ) s ->
            ( { model
                | data =
                    Dict.update i
                        (\mr ->
                            case mr of
                                Nothing ->
                                    Nothing

                                Just r ->
                                    Just <| Dict.insert j s r
                        )
                        model.data
              }
            , Cmd.none
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
              }
            , Cmd.none
            )


view : DocTable -> Html.Html Msg
view model =
    layout
        [ Font.size 14
        ]
        (case model.mode of
            DisplayOnly ->
                displayOnlyView model

            Edit ->
                editView model
        )


displayOnlyView : DocTable -> Element Msg
displayOnlyView model =
    let
        interfaceView =
            column []
                [ row
                    [ spacing 15 ]
                    [ Input.button buttonStyle
                        { onPress = Just SwapDisplayMode
                        , label = text "Editer"
                        }
                    ]
                ]

        dataForTable =
            model.data
                |> Dict.values

        columns =
            List.map
                (\ci ->
                    { header = Element.none
                    , width = fill
                    , view =
                        \ri row ->
                            el
                                (cellStyle ri)
                                (text
                                    (Dict.get ci row
                                        |> Maybe.withDefault ""
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
                    [ Border.widthEach
                        { bottom = 0
                        , left = 1
                        , right = 0
                        , top = 1
                        }
                    ]
                    { data = dataForTable
                    , columns = columns
                    }
            else
                Element.none
    in
    column
        [ spacing 15
        , padding 15
        , width fill
        ]
        [ interfaceView
        , tableView
        ]


editView : DocTable -> Element Msg
editView model =
    let
        interfaceView =
            if model.setupDone then
                column []
                    [ row
                        [ spacing 15 ]
                        [ Input.button buttonStyle
                            { onPress = Just SwapDisplayMode
                            , label = text "Aperçu"
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
                        , Input.button buttonStyle
                            { onPress = Just InitializeTable
                            , label = text "Créer table"
                            }
                        ]
                    , el [] (text model.error)
                    ]

        dataForTable =
            model.data
                |> Dict.values

        columns =
            List.map
                (\ci ->
                    { header = Element.none
                    , width = fill
                    , view =
                        \ri row ->
                            el
                                (editableCellStyle
                                    ri
                                )
                                (Input.multiline
                                    [ Border.width 0
                                    , centerY
                                    , Background.color (rgba 1 1 1 0)
                                    , focused [ Border.glow (rgb 1 1 1) 0 ]
                                    ]
                                    { onChange =
                                        DataInput ( ri, ci )
                                    , text =
                                        Dict.get ci row
                                            |> Maybe.withDefault ""
                                    , placeholder = Nothing
                                    , label =
                                        Input.labelAbove [] Element.none
                                    , spellcheck = False
                                    }
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
                    [ Border.widthEach
                        { bottom = 0
                        , left = 1
                        , right = 0
                        , top = 1
                        }
                    , width fill
                    ]
                    { data = dataForTable
                    , columns = columns
                    }
            else
                Element.none
    in
    column
        [ spacing 15
        , padding 15
        , width fill
        ]
        [ interfaceView
        , tableView
        ]


editableCellStyle ri =
    [ Border.widthEach
        { bottom = 1
        , left = 0
        , right = 1
        , top = 0
        }

    --, padding 7
    , Background.color
        (if modBy 2 ri == 0 then
            rgb 0.8 0.8 0.8
         else
            rgb 1 1 1
        )
    ]


cellStyle ri =
    [ Border.widthEach
        { bottom = 1
        , left = 0
        , right = 1
        , top = 0
        }
    , paddingXY 15 5
    , Background.color
        (if modBy 2 ri == 0 then
            rgb 0.8 0.8 0.8
         else
            rgb 1 1 1
        )
    , width fill --(minimum 100 fill)

    --, height fill
    , height (minimum 30 fill)
    ]


textInputStyle =
    [ width (px 50)
    , paddingXY 5 5
    , spacing 15
    ]


buttonStyle =
    [ Background.color (rgb 0.7 0.7 0.7)
    , Border.rounded 5
    , Font.center
    , centerY
    , padding 5
    , mouseOver [ Font.color (rgb 255 255 255) ]
    ]


makeDataGrid : Int -> Int -> Data
makeDataGrid i j =
    let
        rowIndexes =
            List.range 0 (i - 1)

        cells =
            List.range 0 (j - 1)
                |> List.map (\j_ -> ( j_, "" ))
                |> Dict.fromList
    in
    List.map (\i_ -> ( i_, cells )) rowIndexes
        |> Dict.fromList
