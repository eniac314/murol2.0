module GeneralDirectoryEditor.FichePreview exposing (..)

import Dict exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events exposing (..)
import Element.Font as Font
import Element.Input as Input
import Element.Keyed as Keyed
import Element.Lazy exposing (lazy)
import FileExplorer.FileExplorer as FileExplorer
import GeneralDirectoryEditor.GeneralDirCommonTypes as Types exposing (..)
import GeneralDirectoryEditor.GeneralDirHelpers exposing (..)
import Html as Html
import Html.Attributes as HtmlAttr
import Internals.CommonHelpers exposing (..)
import Internals.CommonStyleHelpers exposing (..)
import Internals.Icons exposing (chevronsDown, chevronsUp)
import Murmur3 exposing (hashString)
import Set exposing (..)
import Time exposing (..)


fichePreview : Fiche -> Element msg
fichePreview f =
    ficheView True f



--column
--    [ spacing 15
--    , Border.solid
--    , Border.color (rgb255 127 127 127)
--      --, Border.width 2
--    , width (px 440)
--    ]
--    [ visualPreview f
--    , row
--        [ spacing 15 ]
--        [ el [ Font.bold ]
--            (text "Catégories:")
--        , wrappedRow
--            [ spacing 15 ]
--            (List.map text f.categories)
--        ]
--    , row
--        [ spacing 15 ]
--        [ el [ Font.bold ]
--            (text "Nature activité:")
--        , wrappedRow
--            [ spacing 15 ]
--            (List.map text f.natureActiv)
--        ]
--    , Maybe.map
--        (\( n, s ) ->
--            row [ spacing 15 ]
--                [ el
--                    [ Font.bold ]
--                    (text "Reférence Office de Tourisme:")
--                , newTabLink []
--                    { url = s, label = el [] (text <| String.fromInt n) }
--                ]
--        )
--        f.refOt
--        |> Maybe.withDefault Element.none
--    , if not (List.isEmpty f.label) then
--        row
--            [ spacing 15 ]
--            [ el [ Font.bold ]
--                (text "Labels:")
--            , paragraph
--                []
--                (List.map (\l -> text l.nom) f.label)
--            ]
--      else
--        Element.none
--    , Maybe.map
--        (\n ->
--            row
--                [ spacing 15 ]
--                [ el
--                    [ Font.bold ]
--                    (text "Etoiles:")
--                , el [] (text <| String.fromInt n)
--                ]
--        )
--        f.rank.stars
--        |> Maybe.withDefault Element.none
--    , Maybe.map
--        (\n ->
--            row
--                [ spacing 15 ]
--                [ el
--                    [ Font.bold ]
--                    (text "Epis:")
--                , el [] (text <| String.fromInt n)
--                ]
--        )
--        f.rank.epis
--        |> Maybe.withDefault Element.none
--    , if not (List.isEmpty f.responsables) then
--        row
--            [ spacing 15 ]
--            ([ el [ Font.bold ] (text "Responsables:")
--             ]
--                ++ List.map respPreview f.responsables
--            )
--      else
--        Element.none
--    , row
--        [ spacing 15 ]
--        [ el [ Font.bold ]
--            (text "Adresse:")
--        , el [] (text f.adresse)
--        ]
--    , Maybe.map
--        telPreview
--        f.telNumber
--        |> Maybe.withDefault Element.none
--    , Maybe.map
--        (\fax ->
--            row
--                [ spacing 15 ]
--                [ el [ Font.bold ]
--                    (text "Fax:")
--                , el [] (text fax)
--                ]
--        )
--        f.fax
--        |> Maybe.withDefault Element.none
--    , if not (List.isEmpty f.email) then
--        row
--            [ spacing 15 ]
--            [ el [ Font.bold ]
--                (text "Email(s):")
--            , column
--                []
--                (List.map text f.email)
--            ]
--      else
--        Element.none
--    , Maybe.map
--        (\( label, url ) ->
--            row
--                [ spacing 15 ]
--                [ el [ Font.bold ]
--                    (text "Site web:")
--                , newTabLink []
--                    { url = url
--                    , label = el [] (text label)
--                    }
--                ]
--        )
--        f.site
--        |> Maybe.withDefault Element.none
--    , Maybe.map
--        (\pj ->
--            row
--                [ spacing 15 ]
--                [ el [ Font.bold ]
--                    (text "Lien pages jaunes:")
--                , el [] (text pj)
--                ]
--        )
--        f.pjaun
--        |> Maybe.withDefault Element.none
--    , if not (List.isEmpty f.description) then
--        column
--            [ spacing 15 ]
--            ([ el [ Font.bold ]
--                (text "Description:")
--             ]
--                ++ List.map (\d -> paragraph [] [ text d ]) f.description
--            )
--      else
--        Element.none
--    , case f.ouverture of
--        Nothing ->
--            row [ spacing 15 ]
--                [ el [ Font.bold ] (text "Ouvert:")
--                , el [] (text "toute l'année")
--                ]
--        Just TteAnnee ->
--            row [ spacing 15 ]
--                [ el [ Font.bold ] (text "Ouvert:")
--                , el [] (text "toute l'année")
--                ]
--        Just Saisonniere ->
--            row [ spacing 15 ]
--                [ el [ Font.bold ] (text "Ouvert:")
--                , el [] (text "en saison")
--                ]
--      --, text <| canonical f.uuid
--    ]


respPreview { poste, nom, tel } =
    column
        []
        [ el
            [ Font.bold ]
            (text nom)
        , row
            [ spacing 15 ]
            [ el [ Font.bold ] (text "Poste:")
            , el [] (text poste)
            ]
        , telPreview tel
        ]


telPreview tel =
    column
        [ spacing 10 ]
        (case tel of
            TelFixe s ->
                [ row
                    [ spacing 5 ]
                    [ el
                        [ Font.bold ]
                        (text "Tel. fixe:")
                    , el [] (text s)
                    ]
                ]

            TelPortable s ->
                [ row
                    [ spacing 5 ]
                    [ el
                        [ Font.bold ]
                        (text "Tel. portable:")
                    , el [] (text s)
                    ]
                ]

            TelBoth ( s1, s2 ) ->
                [ row
                    [ spacing 5 ]
                    [ el
                        [ Font.bold ]
                        (text "Tel. fixe:")
                    , el [] (text s1)
                    ]
                , row
                    [ spacing 5 ]
                    [ el
                        [ Font.bold ]
                        (text "Tel. portable:")
                    , el [] (text s2)
                    ]
                ]
        )



-------------------------------------------------------------------------------


ficheView : Bool -> Fiche -> Element msg
ficheView isOpen fiche =
    column
        [ width (px 440)
        ]
        [ visualPreview fiche
        , if isOpen then
            column
                (wrapperStyle
                    ++ [ spacing 10 ]
                )
                [ activView fiche
                , refView fiche
                , contactView fiche
                ]
          else
            Element.none
        ]


visualPreview { nomEntite, visuel } =
    el
        [ width (px 440)
        , height (px 330)
        , Background.color (blockLinkGrey)
        , mouseOver
            [ Background.color (blockLinkGreyAlpha 0.5) ]
        ]
        (el
            [ width (px 428)
            , height (px 318)
            , centerX
            , centerY
            , Background.image visuel
            , inFront
                (el
                    [ alignBottom
                    , width fill
                    , padding 10
                    , Background.color (blockLinkGreyAlpha 0.8)
                    , Font.color aliceBlue
                    ]
                    (el
                        ([ Font.center
                         , width fill
                         ]
                            ++ unselectable
                        )
                        (paragraph [] [ text nomEntite ])
                    )
                )
            ]
            Element.none
        )


activView { natureActiv } =
    paragraph
        (subBlockStyle
            ++ [ Font.bold
               , Font.center
               ]
        )
        [ text <| String.join ", " natureActiv ]


starsView n =
    column
        [ width (px 80)
        , height (px 50)
        , Background.gradient
            { angle = 0
            , steps =
                [ (rgb255 85 112 83)
                , (rgb255 143 188 139)
                , (rgb255 85 112 83)
                ]
            }
        ]
        [ el
            [ alignTop
            , paddingEach
                { top = 5
                , bottom = 0
                , left = 0
                , right = 0
                }
            , width fill
            , Font.center
            , Font.size 12
            , Font.color (rgb255 255 255 255)
            ]
            (text "Classement")
        , column
            [ height fill
            , width fill
            ]
            [ el
                [ width fill
                , centerY
                , Font.center
                , Font.size 18
                , Font.color (rgb255 255 215 0)
                , Font.shadow
                    { offset = ( 1, 0 )
                    , blur = 1
                    , color = (rgb255 25 21 0)
                    }
                ]
                (text <| String.repeat n "🟊")
            ]
        ]


refView { refOt, label, rank } =
    let
        images =
            stars
                ++ (List.map toImage label)

        ( stars, nbrStars ) =
            case rank.stars of
                Just n ->
                    ( [ { url = "stars"
                        , width = 80
                        , height = 50
                        , link = "https://etoiles-de-france.fr/"
                        }
                      ]
                    , n
                    )

                Nothing ->
                    ( [], 0 )

        toImage { lien, logo } =
            { url = logo.url
            , width = logo.width
            , height = logo.height
            , link = lien
            }

        minHeight =
            images
                |> List.map .height
                |> List.sort
                |> List.head
                |> Maybe.map (min 50)
                |> Maybe.withDefault 0

        imgsScaledToMinHeight =
            let
                scale { url, width, height, link } =
                    { url = url
                    , height = toFloat minHeight + 5
                    , width =
                        toFloat minHeight
                            * toFloat width
                            / toFloat height
                    , link = link
                    }
            in
                List.map scale images

        totalImgWidth =
            List.foldr (\i n -> i.width + n) 0 imgsScaledToMinHeight

        logoView { url, width, height, link } =
            newTabLink
                [ if totalImgWidth < 440 then
                    Element.width (px (round width))
                  else
                    Element.width <| fillPortion (floor <| 10000 * width / totalImgWidth)
                ]
                { url = link
                , label =
                    (if url == "stars" then
                        starsView nbrStars
                     else
                        (html <|
                            Html.img
                                [ HtmlAttr.style "width" "100%"
                                , HtmlAttr.style "height" "auto"
                                , HtmlAttr.src url
                                ]
                                []
                        )
                    )
                }

        logosView =
            case images of
                [] ->
                    Element.none

                _ ->
                    row
                        [ spacing 10
                        , clip
                        ]
                        (List.map logoView imgsScaledToMinHeight)

        refOtView =
            case refOt of
                Just ( ref, link ) ->
                    wrappedRow
                        [ width fill
                        , spacing 5
                        ]
                        [ el [ Font.bold ] (text "Référence office de tourisme:  ")
                        , newTabLink
                            [ Font.color teal4 ]
                            { url = link
                            , label = text <| String.fromInt ref
                            }
                        ]

                Nothing ->
                    Element.none
    in
        if
            (refOt == Nothing)
                && (images == [])
        then
            Element.none
        else
            column
                (subBlockStyle
                    ++ [ width fill
                       , spacing 10
                       ]
                )
                [ refOtView
                , logosView
                ]


contactView { adresse, telNumber, email, site, responsables } =
    column
        (subBlockStyle ++ [ spacing 10 ])
        [ row
            [ spacing 5 ]
            [ el [ Font.bold ] (text "Adresse:")
            , paragraph [] [ text adresse ]
            ]
        , Maybe.map
            telPreview
            telNumber
            |> Maybe.withDefault Element.none
        , case email of
            [] ->
                Element.none

            mail :: [] ->
                row
                    [ spacing 5 ]
                    [ el [ Font.bold ] (text "Email:")
                    , (text mail)
                    ]

            emails ->
                row
                    [ spacing 5 ]
                    [ el [ Font.bold ] (text "Emails:")
                    , paragraph [] [ text <| String.join ", " emails ]
                    ]
        , Maybe.map
            (\( siteName, siteUrl ) ->
                row
                    [ spacing 5 ]
                    [ el
                        [ Font.bold ]
                        (text "Site:")
                    , newTabLink [ Font.color teal4 ]
                        { url = siteUrl
                        , label = text siteName
                        }
                    ]
            )
            site
            |> Maybe.withDefault Element.none
        ]



-------------------------------------------------------------------------------


wrapperStyle : List (Attribute msg)
wrapperStyle =
    [ padding 10
    , Background.color grey6
    , Border.rounded 5
    , width fill
    ]


subBlockStyle : List (Attribute msg)
subBlockStyle =
    [ padding 10
    , Background.color grey7
    , Border.rounded 5
    , width fill
    ]
