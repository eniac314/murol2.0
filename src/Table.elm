module Table exposing (..)

import Array exposing (..)
import Browser exposing (element)
import Dict exposing (..)
import Document exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Lazy as Lazy
import Element.Region as Region
import Html exposing (Html)
import StyleSheets exposing (..)


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
    | FocusStyleSelector
    | BlurStyleSelector
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
    , currentStyle : String
    , styleSelectorFocused : Bool
    , styleSelectorInput : String
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

        SetStyle s ->
            ( { model
                | styleSelectorInput = s
                , currentStyle =
                    case Dict.get s tableStyles of
                        Nothing ->
                            model.currentStyle

                        Just _ ->
                            s

                --, styleSelectorFocused = False
              }
            , Cmd.none
            )

        FocusStyleSelector ->
            ( { model | styleSelectorFocused = not model.styleSelectorFocused }, Cmd.none )

        BlurStyleSelector ->
            ( { model | styleSelectorFocused = False }, Cmd.none )

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
                    case Array.get i model.data of
                        Nothing ->
                            model.data

                        Just a ->
                            Array.set i
                                (Array.set j s a)
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
                        [ styleSelector model
                        , Input.button buttonStyle
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
                                (el
                                    ((Dict.get model.currentStyle tableStyles
                                        |> Maybe.map .cellStyle
                                        |> Maybe.withDefault (\_ -> [])
                                     )
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
        , padding 15
        , width fill
        ]
        [ interfaceView
        , tableView
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


styleSelector model =
    row
        []
        [ Input.text
            [ Events.onClick FocusStyleSelector

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
        (i - 1)
        (always <| Array.initialize (j - 1) (always ""))
