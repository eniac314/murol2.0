module Publications.PublicationsView exposing (..)

import Dict exposing (..)
import Document.Document exposing (BulletinMeta, DelibMeta, ImageSrc(..), MurolInfoMeta, Publications, dummyPic)
import Document.DocumentViews.StyleSheets exposing (PreviewMode, docMaxWidth)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Keyed as Keyed
import Element.Lazy as Lazy
import Element.Region as Region
import Internals.CommonHelpers exposing (chunks, dateToFrench, dateToStr)
import Internals.CommonStyleHelpers exposing (..)
import Time exposing (Zone)


type alias Config a =
    { a
        | width : Int
        , height : Int
        , editMode : Bool
        , previewMode : PreviewMode
        , publications : Maybe Publications
        , zone : Time.Zone
    }


maxWidth config =
    min config.width
        (docMaxWidth ( config.width, config.height ) config.editMode config.previewMode)
        - 40


murolInfosView : Config a -> Element msg
murolInfosView config =
    let
        murolInfoView { issue, date, topics } =
            column
                [ spacing 10
                , width fill
                ]
                ([ row
                    [ width fill
                    , spacing 15
                    ]
                    [ row []
                        [ el
                            [ Font.bold
                            ]
                            (text "Numéro: ")
                        , el
                            []
                            (text <| String.fromInt issue)
                        ]
                    , el
                        [ alignRight ]
                        (text <| String.dropLeft 3 (dateToStr config.zone date))
                    , newTabLink
                        [ alignRight
                        , Background.color teal4
                        , mouseOver
                            [ Font.color <| rgb 1 1 1 ]
                        , pointer
                        , Border.rounded 5
                        , paddingXY 7 5
                        ]
                        { url =
                            "/baseDocumentaire/publications/murolInfos/"
                                ++ (String.fromInt issue
                                        |> String.padLeft 3 '0'
                                        |> (\s -> s ++ ".pdf")
                                   )
                        , label = text "Télécharger"
                        }
                    ]
                 ]
                    ++ List.indexedMap topicView topics
                )
    in
    case config.publications of
        Just { murolInfos } ->
            Dict.values murolInfos
                |> List.foldr
                    (\k acc ->
                        Dict.update
                            (Time.toYear config.zone k.date)
                            (\mbVal ->
                                case mbVal of
                                    Nothing ->
                                        Just [ k ]

                                    Just xs ->
                                        Just <| k :: xs
                            )
                            acc
                    )
                    Dict.empty
                |> Dict.map (\k v -> List.sortBy .issue v)
                |> Dict.foldl
                    (\k v acc ->
                        yearView k v murolInfoView :: acc
                    )
                    []
                |> column
                    [ spacing 40
                    , width fill
                    ]

        Nothing ->
            Element.none


delibsView : Config a -> Element msg
delibsView config =
    let
        delibView { date, topics } =
            column
                [ spacing 10
                , width fill
                ]
                ([ row
                    [ width fill
                    , spacing 15
                    ]
                    [ el
                        []
                        (text <| String.dropLeft 3 (dateToStr config.zone date))
                    , newTabLink
                        [ alignRight
                        , Background.color teal4
                        , mouseOver
                            [ Font.color <| rgb 1 1 1 ]
                        , pointer
                        , Border.rounded 5
                        , paddingXY 7 5
                        ]
                        { url =
                            "/baseDocumentaire/publications/delibs/"
                                ++ (dateToStr config.zone date
                                        |> String.replace "/" "-"
                                        |> (\s -> s ++ ".pdf")
                                   )
                        , label = text "Télécharger"
                        }
                    ]
                 ]
                    ++ List.indexedMap topicView topics
                )
    in
    case config.publications of
        Just { delibs } ->
            Dict.values delibs
                |> List.foldr
                    (\k acc ->
                        Dict.update
                            (Time.toYear config.zone k.date)
                            (\mbVal ->
                                case mbVal of
                                    Nothing ->
                                        Just [ k ]

                                    Just xs ->
                                        Just <| k :: xs
                            )
                            acc
                    )
                    Dict.empty
                --|> Dict.map (\k v -> List.sortBy .date v)
                |> Dict.foldl
                    (\k v acc ->
                        yearView k v delibView :: acc
                    )
                    []
                |> column
                    [ spacing 40
                    , width fill
                    ]

        Nothing ->
            Element.none


bulletinsView : Config a -> Element msg
bulletinsView config =
    let
        bulletinView { issue, date, cover, index } =
            column
                [ spacing 10
                , width fill
                ]
                [ row
                    [ width fill
                    , spacing 15
                    ]
                    [ row []
                        [ el
                            [ Font.bold
                            ]
                            (text "Numéro: ")
                        , el
                            []
                            (text <| String.fromInt issue)
                        ]
                    , el
                        [ alignRight ]
                        (text <| dateToStr config.zone date)
                    , download
                        [ alignRight
                        , Background.color teal4
                        , mouseOver
                            [ Font.color <| rgb 1 1 1 ]
                        , pointer
                        , Border.rounded 5
                        , paddingXY 7 5
                        ]
                        { url =
                            "/baseDocumentaire/publications/bulletins/"
                                ++ (String.fromInt issue
                                        |> String.padLeft 3 '0'
                                        |> (\s -> s ++ ".pdf")
                                   )
                        , label = text "Télécharger"
                        }
                    ]
                , (if maxWidth config < 800 then
                    column
                        [ centerX ]
                   else
                    row
                        [ width fill
                        , Background.color grey6
                        ]
                  )
                    [ image
                        [ width (maximum 595 fill)
                        , alignTop
                        ]
                        { src = cover
                        , description = ""
                        }
                    , column
                        [ alignTop
                        , width fill
                        , height (maximum 842 fill)
                        , scrollbarY
                        ]
                        ([ el
                            [ Font.bold
                            , width fill
                            , paddingXY 10 5
                            , Background.color grey5
                            ]
                            (text "Dans ce numéro: ")
                         ]
                            ++ List.indexedMap (indexView issue) index
                        )
                    ]
                ]
    in
    case config.publications of
        Just { bulletins } ->
            Dict.values bulletins
                |> List.foldr
                    (\k acc ->
                        Dict.update
                            (Time.toYear config.zone k.date)
                            (\mbVal ->
                                case mbVal of
                                    Nothing ->
                                        Just [ k ]

                                    Just xs ->
                                        Just <| k :: xs
                            )
                            acc
                    )
                    Dict.empty
                --|> Dict.map (\k v -> List.sortBy .date v)
                |> Dict.foldl
                    (\k v acc ->
                        yearView k v bulletinView :: acc
                    )
                    []
                |> column
                    [ spacing 40
                    , width fill
                    ]

        Nothing ->
            Element.none



-------------------------------------------------------------------------------
-------------
-- Helpers --
-------------


topicView : Int -> String -> Element msg
topicView n s =
    paragraph
        [ if modBy 2 n == 0 then
            Background.color grey6
          else
            Background.color (rgb255 221 221 221)
        , width fill
        , paddingXY 10 5
        , Font.size 16
        , Font.color grey1
        ]
        [ text s ]


indexView : Int -> Int -> ( String, Int ) -> Element msg
indexView issue n ( topic, page ) =
    paragraph
        [ if modBy 2 n == 0 then
            Background.color grey7
          else
            Background.color (rgb255 221 221 221)
        , width fill
        , paddingXY 10 5
        , Font.size 16
        , Font.color grey1
        ]
        [ newTabLink
            [ mouseOver
                [ if modBy 2 n == 0 then
                    Font.color grey5
                  else
                    Font.color (rgb 1 1 1)
                ]
            , pointer
            , width fill
            ]
            { url =
                "/baseDocumentaire/publications/bulletins/"
                    ++ (String.fromInt issue
                            |> String.padLeft 3 '0'
                            |> (\s ->
                                    s
                                        ++ ".pdf#page="
                                        ++ String.fromInt page
                               )
                       )
            , label =
                row [ spacing 10 ]
                    [ text "●"
                    , paragraph [] [ text topic ]
                    ]
            }
        ]


yearView : Int -> List pub -> (pub -> Element msg) -> Element msg
yearView year xs f =
    column
        [ width fill
        , spacing 10
        ]
        [ el
            [ Font.size 20
            , Font.color (rgb 0 0.5 0)
            , Font.bold
            , width fill
            , paddingEach
                { bottom = 5
                , left = 0
                , right = 0
                , top = 0
                }
            , Border.widthEach
                { bottom = 1
                , left = 0
                , right = 0
                , top = 0
                }
            , Border.color grey4
            ]
            (text <| String.fromInt year)
        , column
            [ spacing 15
            , width fill
            ]
            (List.reverse xs
                |> List.map f
            )
        ]
