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
    column
        [ spacing 15
        , Border.solid
        , Border.color (rgb255 127 127 127)
          --, Border.width 2
        , width (px 440)
        ]
        [ visualPreview f
        , row
            [ spacing 15 ]
            [ el [ Font.bold ]
                (text "Catégories:")
            , wrappedRow
                [ spacing 15 ]
                (List.map text f.categories)
            ]
        , row
            [ spacing 15 ]
            [ el [ Font.bold ]
                (text "Nature activité:")
            , wrappedRow
                [ spacing 15 ]
                (List.map text f.natureActiv)
            ]
        , Maybe.map
            (\( n, s ) ->
                row [ spacing 15 ]
                    [ el
                        [ Font.bold ]
                        (text "Reférence Office de Tourisme:")
                    , newTabLink []
                        { url = s, label = el [] (text <| String.fromInt n) }
                    ]
            )
            f.refOt
            |> Maybe.withDefault Element.none
        , if not (List.isEmpty f.label) then
            row
                [ spacing 15 ]
                [ el [ Font.bold ]
                    (text "Labels:")
                , paragraph
                    []
                    (List.map (\l -> text l.nom) f.label)
                ]
          else
            Element.none
        , Maybe.map
            (\n ->
                row
                    [ spacing 15 ]
                    [ el
                        [ Font.bold ]
                        (text "Etoiles:")
                    , el [] (text <| String.fromInt n)
                    ]
            )
            f.rank.stars
            |> Maybe.withDefault Element.none
        , Maybe.map
            (\n ->
                row
                    [ spacing 15 ]
                    [ el
                        [ Font.bold ]
                        (text "Epis:")
                    , el [] (text <| String.fromInt n)
                    ]
            )
            f.rank.epis
            |> Maybe.withDefault Element.none
        , if not (List.isEmpty f.responsables) then
            row
                [ spacing 15 ]
                ([ el [ Font.bold ] (text "Responsables:")
                 ]
                    ++ List.map respPreview f.responsables
                )
          else
            Element.none
        , row
            [ spacing 15 ]
            [ el [ Font.bold ]
                (text "Adresse:")
            , el [] (text f.adresse)
            ]
        , Maybe.map
            telPreview
            f.telNumber
            |> Maybe.withDefault Element.none
        , Maybe.map
            (\fax ->
                row
                    [ spacing 15 ]
                    [ el [ Font.bold ]
                        (text "Fax:")
                    , el [] (text fax)
                    ]
            )
            f.fax
            |> Maybe.withDefault Element.none
        , if not (List.isEmpty f.email) then
            row
                [ spacing 15 ]
                [ el [ Font.bold ]
                    (text "Email(s):")
                , column
                    []
                    (List.map text f.email)
                ]
          else
            Element.none
        , Maybe.map
            (\( label, url ) ->
                row
                    [ spacing 15 ]
                    [ el [ Font.bold ]
                        (text "Site web:")
                    , newTabLink []
                        { url = url
                        , label = el [] (text label)
                        }
                    ]
            )
            f.site
            |> Maybe.withDefault Element.none
        , Maybe.map
            (\pj ->
                row
                    [ spacing 15 ]
                    [ el [ Font.bold ]
                        (text "Lien pages jaunes:")
                    , el [] (text pj)
                    ]
            )
            f.pjaun
            |> Maybe.withDefault Element.none
        , if not (List.isEmpty f.description) then
            column
                [ spacing 15 ]
                ([ el [ Font.bold ]
                    (text "Description:")
                 ]
                    ++ List.map (\d -> paragraph [] [ text d ]) f.description
                )
          else
            Element.none
        , case f.ouverture of
            Nothing ->
                row [ spacing 15 ]
                    [ el [ Font.bold ] (text "Ouvert:")
                    , el [] (text "toute l'année")
                    ]

            Just TteAnnee ->
                row [ spacing 15 ]
                    [ el [ Font.bold ] (text "Ouvert:")
                    , el [] (text "toute l'année")
                    ]

            Just Saisonniere ->
                row [ spacing 15 ]
                    [ el [ Font.bold ] (text "Ouvert:")
                    , el [] (text "en saison")
                    ]
          --, text <| canonical f.uuid
        ]


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
        [ spacing 15 ]
        (case tel of
            TelFixe s ->
                [ row
                    [ spacing 15 ]
                    [ el
                        [ Font.bold ]
                        (text "Tel. fixe:")
                    , el [] (text s)
                    ]
                ]

            TelPortable s ->
                [ row
                    [ spacing 15 ]
                    [ el
                        [ Font.bold ]
                        (text "Tel. portable:")
                    , el [] (text s)
                    ]
                ]

            TelBoth ( s1, s2 ) ->
                [ row
                    [ spacing 15 ]
                    [ el
                        [ Font.bold ]
                        (text "Tel. fixe:")
                    , el [] (text s1)
                    ]
                , row
                    [ spacing 15 ]
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
        [ spacing 15
        , width (px 440)
        ]
        [ visualPreview fiche
        , if isOpen then
            column
                wrapperStyle
                [ activView fiche
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



--refView {refOt, label} =
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
