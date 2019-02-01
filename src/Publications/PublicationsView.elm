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


murolInfosView : Config a -> Element msg
murolInfosView config =
    let
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

        yearView year murInfs =
            column
                [ width fill
                , spacing 10
                ]
                [ el
                    [ Font.size 16
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
                    (List.reverse murInfs
                        |> List.map murolInfoView
                    )
                ]
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
                |> Dict.foldl (\k v acc -> yearView k v :: acc) []
                |> column
                    [ spacing 40
                    , width fill
                    ]

        Nothing ->
            Element.none
