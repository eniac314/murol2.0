module Internals.CommonStyleHelpers exposing
    ( aliceBlue
    , blockLinkGrey
    , blockLinkGreyAlpha
    , blue1
    , blue2
    , blue3
    , blue4
    , blue5
    , blue6
    , blue7
    , buttonStyle
    , deleteButtonStyle
    , green1
    , green2
    , green3
    , green4
    , green5
    , green6
    , green7
    , grey1
    , grey2
    , grey3
    , grey4
    , grey5
    , grey6
    , grey7
    , noAttr
    , noHtmlAttr
    , okMark
    , progressBar
    , property
    , red1
    , red2
    , red3
    , red4
    , red5
    , red6
    , red7
    , redStar
    , saveButtonStyle
    , sides
    , strCons
    , teal1
    , teal2
    , teal3
    , teal4
    , teal5
    , teal6
    , teal7
    , textInputStyle
    , toogleButtonStyle
    , unselectable
    , yellow1
    , yellow2
    , yellow3
    , yellow4
    , yellow5
    , yellow6
    , yellow7
    )

import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Lazy as Lazy
import Element.Region as Region
import Html exposing (Html)
import Html.Attributes as HtmlAttr


progressBar : Int -> Element msg
progressBar n =
    row
        [ width (px 200)
        , height (px 25)
        , Border.innerShadow
            { offset = ( 0, 1 )
            , size = 1
            , blur = 1
            , color = rgb255 127 127 127
            }
        , Background.color (rgb255 245 245 245)
        , Border.rounded 5
        , clip
        , inFront <|
            el
                [ width (px 200)
                , height (px 25)
                , Font.center
                ]
                (el
                    [ centerX
                    , centerY
                    ]
                    (String.fromInt n
                        |> String.padLeft 2 '0'
                        |> strCons "%"
                        |> text
                    )
                )
        ]
        [ el
            [ width (fillPortion n)
            , height fill
            , Background.color
                (if n < 25 then
                    rgb255 217 83 79

                 else if n < 50 then
                    rgb255 240 173 78

                 else if n < 75 then
                    rgb255 91 192 222

                 else
                    rgb255 92 184 92
                )
            , Font.center
            ]
            Element.none
        , el
            [ width (fillPortion (100 - n))
            , height fill
            ]
            Element.none
        ]


okMark =
    el
        [ Font.bold
        , Font.color (rgb255 92 184 92)
        ]
        (text "✓")


redStar =
    el
        [ Font.color red4
        , Font.size 18
        ]
        (text "*")


buttonStyle isActive =
    [ Border.rounded 5
    , Font.center
    , centerY
    , padding 5
    , focused [ Border.glow (rgb 1 1 1) 0 ]
    ]
        ++ (if isActive then
                [ Background.color (rgb 0.9 0.9 0.9)
                , mouseOver [ Background.color (rgb 0.85 0.85 0.85) ]
                , Border.width 1
                , Border.color (rgb 0.9 0.9 0.9)
                ]

            else
                [ Background.color (rgb 0.95 0.95 0.95)
                , Font.color (rgb 0.7 0.7 0.7)
                , htmlAttribute <| HtmlAttr.style "cursor" "default"
                , Border.width 1
                , Border.color (rgb 0.95 0.95 0.95)
                ]
           )


saveButtonStyle isActive =
    [ Border.rounded 5
    , Font.center
    , Font.color (rgb 1 1 1)
    , centerY
    , padding 5
    , focused [ Border.glow (rgb 1 1 1) 0 ]
    ]
        ++ (if isActive then
                [ Background.color green4
                , mouseOver [ Background.color green3 ]
                , Border.width 1
                , Border.color (rgb 0.9 0.9 0.9)
                ]

            else
                [ Background.color (rgb 0.95 0.95 0.95)
                , Font.color (rgb 0.7 0.7 0.7)
                , htmlAttribute <| HtmlAttr.style "cursor" "default"
                , Border.width 1
                , Border.color (rgb 0.95 0.95 0.95)
                ]
           )


deleteButtonStyle isActive =
    [ Border.rounded 5
    , Font.center
    , Font.color (rgb 1 1 1)
    , centerY
    , padding 5
    , focused [ Border.glow (rgb 1 1 1) 0 ]
    ]
        ++ (if isActive then
                [ Background.color red5
                , mouseOver [ Background.color red4 ]
                , Border.width 1
                , Border.color (rgb 0.9 0.9 0.9)
                ]

            else
                [ Background.color (rgb 0.95 0.95 0.95)
                , Font.color (rgb 0.7 0.7 0.7)
                , htmlAttribute <| HtmlAttr.style "cursor" "default"
                , Border.width 1
                , Border.color (rgb 0.95 0.95 0.95)
                ]
           )


toogleButtonStyle isPressed isActive =
    [ Border.rounded 5
    , Font.center
    , centerY
    , padding 5
    , focused [ Border.glow (rgb 1 1 1) 0 ]
    ]
        ++ (if isActive then
                [ mouseOver
                    [ Font.color (rgb 0.3 0.3 0.3)
                    ]
                ]
                    ++ (if isPressed then
                            [ Background.color (rgb 0.9 0.9 0.9)
                            , Border.width 1
                            , Border.color (rgb 0.9 0.9 0.9)
                            , Border.shadow
                                { offset = ( 1, 1 )
                                , size = 1
                                , blur = 0.5
                                , color = rgb 0.5 0.5 0.5
                                }
                            , focused
                                [ Border.shadow
                                    { offset = ( 1, 1 )
                                    , size = 1
                                    , blur = 0.5
                                    , color = rgb 0.5 0.5 0.5
                                    }
                                ]
                            ]

                        else
                            [ Background.color (rgb 0.9 0.9 0.9)
                            , Border.width 1
                            , Border.color (rgb 0.9 0.9 0.9)
                            ]
                       )

            else
                [ Background.color (rgb 0.95 0.95 0.95)
                , Font.color (rgb 0.7 0.7 0.7)
                , htmlAttribute <| HtmlAttr.style "cursor" "default"
                , Border.width 1
                , Border.color (rgb 0.95 0.95 0.95)
                ]
           )


textInputStyle =
    [ width (px 250)
    , paddingXY 5 5
    , spacing 15
    , focused [ Border.glow (rgb 1 1 1) 0 ]
    ]


property name value =
    htmlAttribute <| HtmlAttr.property name value


noAttr =
    htmlAttribute <| HtmlAttr.class ""


noHtmlAttr =
    HtmlAttr.class ""


unselectable =
    List.map htmlAttribute
        [ HtmlAttr.style "-webkit-touch-callout" "none"
        , HtmlAttr.style "-webkit-user-select" "none"
        , HtmlAttr.style "-khtml-user-select" "none"
        , HtmlAttr.style "-moz-user-select" "none"
        , HtmlAttr.style "-ms-user-select" "none"
        , HtmlAttr.style "user-select" "none"
        ]


sides =
    { top = 0
    , bottom = 0
    , left = 0
    , right = 0
    }



-------------------------------------------------------------------------------
-------------------
-- Color palette --
-------------------
--Primary


blue1 =
    rgb255 32 61 84


blue2 =
    rgb255 26 73 113


blue3 =
    rgb255 35 104 162


blue4 =
    rgb255 49 131 200


blue5 =
    rgb255 99 162 216


blue6 =
    rgb255 170 212 245


blue7 =
    rgb255 239 248 255



-- Neutral


grey1 =
    rgb255 33 41 52


grey2 =
    rgb255 95 107 122


grey3 =
    rgb255 136 149 167


grey4 =
    rgb255 184 196 206


grey5 =
    rgb255 207 214 222


grey6 =
    rgb255 225 231 236


grey7 =
    rgb255 248 249 250



-- Accents


teal1 =
    rgb255 18 69 68


teal2 =
    rgb255 27 101 94


teal3 =
    rgb255 42 145 135


teal4 =
    rgb255 60 174 163


teal5 =
    rgb255 110 215 211


teal6 =
    rgb255 168 238 193


teal7 =
    rgb255 231 255 254



---


green1 =
    rgb255 20 82 57


green2 =
    rgb255 25 119 65


green3 =
    rgb255 37 157 88


green4 =
    rgb255 56 193 114


green5 =
    rgb255 116 217 159


green6 =
    rgb255 168 238 193


green7 =
    rgb255 227 252 236



---


yellow1 =
    rgb255 92 72 19


yellow2 =
    rgb255 140 109 31


yellow3 =
    rgb255 202 165 61


yellow4 =
    rgb255 244 202 100


yellow5 =
    rgb255 250 226 159


yellow6 =
    rgb255 253 243 215


yellow7 =
    rgb255 255 252 244



---


red1 =
    rgb255 97 24 24


red2 =
    rgb255 137 27 27


red3 =
    rgb255 184 32 32


red4 =
    rgb255 220 48 48


red5 =
    rgb255 228 100 100


red6 =
    rgb255 245 170 170


red7 =
    rgb255 252 232 232



-------------------------------------------------------------------------------


aliceBlue =
    rgba255 240 248 255 1


blockLinkGrey =
    rgb255 119 136 153


blockLinkGreyAlpha a =
    rgba255 119 136 153 a


strCons : String -> String -> String
strCons tail head =
    head ++ tail
