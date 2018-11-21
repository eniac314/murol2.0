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
import String.Extra exposing (toSentenceCase)
import UUID exposing (canonical)


fichePreview : (String -> msg) -> Time.Posix -> Fiche -> Element msg
fichePreview handler currentTime f =
    ficheView handler currentTime 440 True f



-------------------------------------------------------------------------------


ficheView : (String -> msg) -> Posix -> Float -> Bool -> Fiche -> Element msg
ficheView handler currentTime maxWidth isOpen fiche =
    column
        [ width (px (round maxWidth))
        , clip
        ]
        [ visualPreview handler maxWidth fiche
        , if isOpen then
            column
                (wrapperStyle
                    ++ [ spacing 10 ]
                )
                [ activView fiche
                , refView maxWidth fiche
                , contactView fiche
                , descriptionView fiche
                , linkedDocsView currentTime fiche
                ]
          else
            Element.none
        ]


visualPreview handler maxWidth { uuid, nomEntite, visuel } =
    let
        w =
            round maxWidth

        h =
            (round (maxWidth / 1.333333333))
    in
        el
            [ width (px w)
            , height (px h)
            , Background.color (blockLinkGrey)
            , mouseOver
                [ Background.color (blockLinkGreyAlpha 0.5) ]
            , Events.onClick (handler (canonical uuid))
            , pointer
            ]
            (el
                [ width (px (w - 12))
                , height (px (h - 12))
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


refView maxWidth { refOt, label, rank } =
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
                [ if totalImgWidth < maxWidth then
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


contactView : Fiche -> Element msg
contactView { adresse, telNumber, email, site, responsables } =
    column
        (subBlockStyle ++ [ spacing 10 ])
        [ paragraph
            [ spacing 5 ]
            [ el [ Font.bold ] (text "Adresse: ")
            , el [] (text adresse)
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
                paragraph
                    []
                    [ el [ Font.bold ] (text "Emails: ")
                    , el [] (text <| String.join ", " emails)
                    ]
        , Maybe.map
            (\( siteName, siteUrl ) ->
                paragraph
                    []
                    [ el
                        [ Font.bold ]
                        (text "Site: ")
                    , newTabLink [ Font.color teal4 ]
                        { url = siteUrl
                        , label = text siteName
                        }
                    ]
            )
            site
            |> Maybe.withDefault Element.none
        , responsablesView responsables
        ]


responsablesView responsables =
    let
        respView { nom, poste, tel } =
            column
                [ spacing 7
                , padding 5
                , Background.color grey6
                ]
                [ paragraph
                    []
                    [ el [] (text poste)
                    , text ", "
                    , el [] (text nom)
                    ]
                , telPreview tel
                ]
    in
        case responsables of
            [] ->
                Element.none

            resp :: [] ->
                column
                    [ spacing 10 ]
                    [ el
                        [ Font.bold ]
                        (text "Responsable:")
                    , respView resp
                    ]

            resps ->
                column
                    [ spacing 10 ]
                    ([ el
                        [ Font.bold ]
                        (text "Responsables:")
                     ]
                        ++ (List.map respView resps)
                    )


descriptionView { description, ouverture } =
    let
        ( displayOuv, ouvertureView ) =
            case ouverture of
                Just Saisonniere ->
                    ( True, el [ Font.bold ] (text "Ouverture saisonniere") )

                _ ->
                    ( False, Element.none )
    in
        case description of
            [] ->
                if displayOuv then
                    column
                        subBlockStyle
                        [ ouvertureView ]
                else
                    Element.none

            descr ->
                let
                    descrView d =
                        paragraph
                            [ Font.italic ]
                            [ text (toSentenceCase d) ]
                in
                    column
                        (subBlockStyle
                            ++ [ width fill
                               , spacing 10
                               ]
                        )
                        ((List.map descrView descr)
                            ++ [ ouvertureView ]
                        )


linkedDocsView currentTime { linkedDocs } =
    case linkedDocs of
        [] ->
            Element.none

        ldocs ->
            let
                ldView { url, label, descr, expiryDate } =
                    let
                        resView =
                            column
                                [ spacing 7
                                , Border.widthEach
                                    { top = 0
                                    , left = 0
                                    , bottom = 1
                                    , right = 0
                                    }
                                , Border.color grey6
                                , width fill
                                , paddingXY 0 5
                                ]
                                [ newTabLink
                                    [ Font.color teal4 ]
                                    { url = url
                                    , label =
                                        row [ spacing 5 ]
                                            [ el
                                                [ width (px 16)
                                                , height (px 16)
                                                , Background.uncropped "/assets/images/pdf.svg"
                                                ]
                                                (Element.none)
                                            , text label
                                            ]
                                    }
                                , Maybe.map
                                    (\d ->
                                        paragraph
                                            [ Font.size 14 ]
                                            [ text d ]
                                    )
                                    descr
                                    |> Maybe.withDefault Element.none
                                ]
                    in
                        case expiryDate of
                            Nothing ->
                                resView

                            Just ed ->
                                if (posixToMillis ed < posixToMillis currentTime) then
                                    Element.none
                                else
                                    resView
            in
                column
                    (subBlockStyle
                        ++ [ spacing 10 ]
                    )
                    ([ row
                        [ Font.bold ]
                        [ el []
                            (text <| "EN SAVOIR PLUS")
                          --, el
                          --    [ centerY
                          --    ]
                          --    (text "+")
                        ]
                     ]
                        ++ List.map ldView ldocs
                    )



-------------------------------------------------------------------------------


telPreview tel =
    column
        [ spacing 10 ]
        (case tel of
            TelFixe s ->
                [ paragraph
                    []
                    [ el
                        [ Font.bold ]
                        (text "Tel. fixe: ")
                    , el [] (text s)
                    ]
                ]

            TelPortable s ->
                [ paragraph
                    []
                    [ el
                        [ Font.bold ]
                        (text "Tel. portable: ")
                    , el [] (text s)
                    ]
                ]

            TelBoth ( s1, s2 ) ->
                [ paragraph
                    []
                    [ el
                        [ Font.bold ]
                        (text "Tel. fixe: ")
                    , el [] (text s1)
                    ]
                , paragraph
                    []
                    [ el
                        [ Font.bold ]
                        (text "Tel. portable: ")
                    , el [] (text s2)
                    ]
                ]
        )


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
