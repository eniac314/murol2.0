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
    = LastChild Bool
    | NotLastChild Bool


docTreeView config offsets ( sNode, selection ) document =
    let
        sel =
            selection
                || (Maybe.map (\i -> i == getUid document) sNode
                        |> Maybe.withDefault False
                   )

        labelFontColor =
            if sel then
                Font.color (rgba 0 0 0 1)
            else
                Font.color (rgba 0.8 0.8 0.8 1)
    in
    case document of
        Node { nodeLabel, id, attrs } xs ->
            let
                l =
                    List.length xs

                ( firsts, last ) =
                    ( List.take (l - 1) xs, List.drop (l - 1) xs )
            in
            [ row [ width fill ]
                (prefix offsets
                    ++ [ el
                            [ labelFontColor ]
                            (text <| nodeLabelToString nodeLabel)
                       ]
                )
            ]
                ++ List.concatMap
                    (docTreeView
                        config
                        (NotLastChild sel
                            :: offsets
                        )
                        ( sNode, sel )
                    )
                    firsts
                ++ List.concatMap
                    (docTreeView
                        config
                        (LastChild sel :: offsets)
                        ( sNode, sel )
                    )
                    last

        Leaf { leafContent, id, attrs } ->
            [ row []
                (prefix offsets
                    ++ [ el
                            [ labelFontColor ]
                            (text <| leafContentToString leafContent)
                       ]
                )
            ]


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
