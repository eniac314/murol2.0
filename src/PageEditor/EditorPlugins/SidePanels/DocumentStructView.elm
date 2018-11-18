module PageEditor.EditorPlugins.SidePanels.DocumentStructView exposing (..)

import Document.Document exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Internals.Icons exposing (..)


documentStructView config selectedContainer document =
    column
        [ spacing 15
        , scrollbars
        , width (maximum 330 fill)
        , height fill
        , alignTop
        , Font.size 14
        , Font.family
            [ Font.monospace
            ]
        , Border.solid
        , Border.widthEach
            { top = 0
            , bottom = 0
            , left = 0
            , right = 2
            }
        , Border.color (rgb 0.8 0.8 0.8)
        ]
        [ menuView config
        , mainPanel config selectedContainer document
        ]


menuView config =
    row [ spacing 15 ]
        []


mainPanel config selectedContainer document =
    column
        [ spacing 2
        , padding 15
        ]
        (docTreeView config [] ( selectedContainer, False ) document)


type Child
    = LastChild Bool
    | NotLastChild Bool


docTreeView :
    { a | containersColors : Bool, isActive : Bool, zipToUidCmd : Int -> msg }
    -> List Child
    -> ( Int, Bool )
    -> Document
    -> List (Element msg)
docTreeView config offsets ( sContainer, selection ) document =
    let
        sel =
            selection
                || (\i -> i == getUid document) sContainer

        labelFontColor =
            if sel then
                Font.color (rgba 0 0 0 1)
            else
                Font.color (rgba 0.8 0.8 0.8 1)
    in
        case document of
            Container { containerLabel, id, attrs } xs ->
                let
                    l =
                        List.length xs

                    ( firsts, last ) =
                        ( List.take (l - 1) xs, List.drop (l - 1) xs )
                in
                    [ row [ width fill ]
                        (prefix offsets
                            ++ [ el
                                    ([ if config.containersColors && sel then
                                        Font.color <| containerLabelToColor containerLabel
                                       else
                                        labelFontColor
                                     ]
                                        ++ (if config.isActive then
                                                [ Events.onClick (config.zipToUidCmd id.uid)
                                                , pointer
                                                , mouseOver [ Font.color (rgba 0 0 1 1) ]
                                                ]
                                            else
                                                []
                                           )
                                    )
                                    (text <| containerLabelToString containerLabel)
                               ]
                        )
                    ]
                        ++ List.concatMap
                            (docTreeView
                                config
                                (NotLastChild sel
                                    :: offsets
                                )
                                ( sContainer, sel )
                            )
                            firsts
                        ++ List.concatMap
                            (docTreeView
                                config
                                (LastChild sel :: offsets)
                                ( sContainer, sel )
                            )
                            last

            Cell { cellContent, id, attrs } ->
                [ row []
                    (prefix offsets
                        ++ [ el
                                ([ labelFontColor
                                 ]
                                    ++ (if config.isActive then
                                            [ Events.onClick (config.zipToUidCmd id.uid)
                                            , pointer
                                            , mouseOver [ Font.color (rgba 0 0 1 1) ]
                                            ]
                                        else
                                            []
                                       )
                                )
                                (text <| cellContentToString cellContent)
                             --(text <| String.fromInt id.uid ++ " " ++ cellContentToString cellContent)
                           ]
                    )
                ]


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


containerLabelToString cl =
    case cl of
        DocColumn ->
            "Colonne"

        DocRow ->
            "Ligne"

        TextColumn ->
            "Colonne de texte"

        ResponsiveBloc ->
            "Bloc réactif"


containerLabelToColor cl =
    case cl of
        DocColumn ->
            rgba 0 1 0 0.6

        DocRow ->
            rgba 1 0 0 0.6

        TextColumn ->
            rgba 0 0 1 0.6

        ResponsiveBloc ->
            rgba 0 0 0 1


cellContentToString lc =
    case lc of
        Image _ ->
            "Image"

        Video _ ->
            "Video"

        Table _ ->
            "Tableau"

        CustomElement s ->
            "Element spécial: " ++ s

        BlockLinks _ ->
            "Zone blocs de liens"

        Fiches _ ->
            "Fiches"

        TextBlock xs ->
            "Zone de texte"

        EmptyCell ->
            "Cellule vide"
