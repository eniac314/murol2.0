module DocumentStructView exposing (..)

import Document exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events exposing (..)
import Element.Font as Font
import Element.Input as Input
import Icons exposing (..)


documentStructView config selectedNode document =
    column
        [ spacing 15
        , scrollbars
        , width (maximum 330 fill)
        , height fill
        , alignTop

        --, Background.color (rgba 0 0 0.7 0.3)
        , Font.size 14
        , Font.family
            [ Font.monospace
            ]
        ]
        [ menuView config
        , mainPanel config selectedNode document
        ]


menuView config =
    row [ spacing 15 ]
        []


mainPanel config selectedNode document =
    column
        [ spacing 2
        , padding 15
        ]
        (docTreeView config [] ( selectedNode, False ) document)


type Child
    = LastChild
    | NotLastChild


docTreeView config offsets ( sNode, selection ) document =
    case document of
        Node { nodeLabel, id, attrs } xs ->
            let
                l =
                    List.length xs

                ( firsts, last ) =
                    ( List.take (l - 1) xs, List.drop (l - 1) xs )

                sel =
                    selection
                        || (Maybe.map (\i -> i == id.uid) sNode
                                |> Maybe.withDefault False
                           )
            in
            [ row [ width fill ]
                [ el
                    [ if sel then
                        Font.color (rgba 0 0 1 1)
                      else
                        Font.color (rgba 0.8 0.8 0.8 1)
                    ]
                    (text <| prefix offsets)
                , el [] (text <| nodeLabelToString nodeLabel ++ " " ++ String.fromInt id.uid)
                ]
            ]
                ++ List.concatMap
                    (docTreeView
                        config
                        (NotLastChild
                            :: offsets
                        )
                        ( sNode, sel )
                    )
                    firsts
                ++ List.concatMap
                    (docTreeView
                        config
                        (LastChild :: offsets)
                        ( sNode, sel )
                    )
                    last

        Leaf { leafContent, id, attrs } ->
            let
                sel =
                    selection
                        || (Maybe.map (\i -> i == id.uid) sNode
                                |> Maybe.withDefault False
                           )
            in
            [ row []
                [ el
                    [ if sel then
                        Font.color (rgba 0 0 1 1)
                      else
                        Font.color (rgba 0.8 0.8 0.8 1)
                    ]
                    (text <| prefix offsets)
                , el [] (text <| leafContentToString leafContent ++ " " ++ String.fromInt id.uid)
                ]
            ]


prefix offsets =
    let
        helper acc indexes =
            case indexes of
                [] ->
                    acc

                LastChild :: [] ->
                    acc ++ (String.repeat 3 " " ++ "└─ ")

                NotLastChild :: [] ->
                    acc ++ (String.repeat 3 " " ++ "├─ ")

                LastChild :: xs ->
                    helper (acc ++ String.repeat 3 " " ++ " ") xs

                NotLastChild :: xs ->
                    helper (acc ++ String.repeat 3 " " ++ "│") xs
    in
    helper "" (List.reverse offsets)


nodeLabelToString nl =
    case nl of
        DocColumn ->
            "Colonne"

        DocRow ->
            "Ligne"

        TextColumn ->
            "Colonne de texte"

        ResponsiveBloc ->
            "Bloc réactif"


leafContentToString lc =
    case lc of
        Image _ ->
            "Image"

        Table _ ->
            "Tableau"

        CustomElement s ->
            "Element spécial: " ++ s

        TextBlock xs ->
            "Zone de texte"
