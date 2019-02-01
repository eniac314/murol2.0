module Internals.Icons exposing (..)

import Html exposing (Html)
import Svg exposing (Svg, svg)
import Svg.Attributes exposing (..)


customSvgFeatherIcon : Int -> String -> List (Svg msg) -> Html msg
customSvgFeatherIcon size className =
    svg
        [ class <| "feather feather-" ++ className
        , fill "none"
        , height (String.fromInt size)
        , stroke "currentColor"
        , strokeLinecap "round"
        , strokeLinejoin "round"
        , strokeWidth "2"
        , viewBox "0 0 24 24"
        , width (String.fromInt size)
        ]


link2 : Int -> Html msg
link2 size =
    customSvgFeatherIcon size
        "link-2"
        [ Svg.path [ d "M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3" ] []
        , Svg.line [ x1 "8", y1 "12", x2 "16", y2 "12" ] []
        ]


externalLink : Int -> Html msg
externalLink size =
    customSvgFeatherIcon size
        "external-link"
        [ Svg.path [ d "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" ] []
        , Svg.polyline [ points "15 3 21 3 21 9" ] []
        , Svg.line [ x1 "10", y1 "14", x2 "21", y2 "3" ] []
        ]


list : Int -> Html msg
list size =
    customSvgFeatherIcon size
        "list"
        [ Svg.line [ x1 "8", y1 "6", x2 "21", y2 "6" ] []
        , Svg.line [ x1 "8", y1 "12", x2 "21", y2 "12" ] []
        , Svg.line [ x1 "8", y1 "18", x2 "21", y2 "18" ] []
        , Svg.line [ x1 "3", y1 "6", x2 "3", y2 "6" ] []
        , Svg.line [ x1 "3", y1 "12", x2 "3", y2 "12" ] []
        , Svg.line [ x1 "3", y1 "18", x2 "3", y2 "18" ] []
        ]


bold : Int -> Html msg
bold size =
    customSvgFeatherIcon size
        "bold"
        [ Svg.path [ d "M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" ] []
        , Svg.path [ d "M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" ] []
        ]


italic : Int -> Html msg
italic size =
    customSvgFeatherIcon size
        "italic"
        [ Svg.line [ x1 "19", y1 "4", x2 "10", y2 "4" ]
            []
        , Svg.line [ x1 "14", y1 "20", x2 "5", y2 "20" ] []
        , Svg.line [ x1 "15", y1 "4", x2 "9", y2 "20" ] []
        ]


plusSquare : Int -> Html msg
plusSquare size =
    customSvgFeatherIcon size
        "plus-square"
        [ Svg.rect [ Svg.Attributes.x "3", y "3", width "18", height "18", rx "2", ry "2" ] []
        , Svg.line [ x1 "12", y1 "8", x2 "12", y2 "16" ] []
        , Svg.line [ x1 "8", y1 "12", x2 "16", y2 "12" ] []
        ]


minusSquare : Int -> Html msg
minusSquare size =
    customSvgFeatherIcon size
        "minus-square"
        [ Svg.rect
            [ Svg.Attributes.x "3"
            , y "3"
            , width "18"
            , height "18"
            , rx "2"
            , ry "2"
            ]
            []
        , Svg.line [ x1 "8", y1 "12", x2 "16", y2 "12" ] []
        ]


xSquare : Int -> Html msg
xSquare size =
    customSvgFeatherIcon size
        "x-square"
        [ Svg.rect
            [ Svg.Attributes.x "3"
            , y "3"
            , width "18"
            , height "18"
            , rx "2"
            , ry "2"
            ]
            []
        , Svg.line [ x1 "9", y1 "9", x2 "15", y2 "15" ] []
        , Svg.line [ x1 "15", y1 "9", x2 "9", y2 "15" ] []
        ]


layout : Int -> Html msg
layout size =
    customSvgFeatherIcon size
        "layout"
        [ Svg.rect
            [ Svg.Attributes.x "3"
            , y "3"
            , width "18"
            , height "18"
            , rx "2"
            , ry "2"
            ]
            []
        , Svg.line [ x1 "3", y1 "9", x2 "21", y2 "9" ] []
        , Svg.line [ x1 "9", y1 "21", x2 "9", y2 "9" ] []
        ]


menu : Int -> Html msg
menu size =
    customSvgFeatherIcon size
        "menu"
        [ Svg.line
            [ x1 "3"
            , y1 "12"
            , x2 "21"
            , y2 "12"
            ]
            []
        , Svg.line [ x1 "3", y1 "6", x2 "21", y2 "6" ] []
        , Svg.line [ x1 "3", y1 "18", x2 "21", y2 "18" ] []
        ]


moreHorizontal : Int -> Html msg
moreHorizontal size =
    customSvgFeatherIcon size
        "more-horizontal"
        [ Svg.circle
            [ cx "12"
            , cy "12"
            , r "1"
            ]
            []
        , Svg.circle [ cx "19", cy "12", r "1" ] []
        , Svg.circle [ cx "5", cy "12", r "1" ] []
        ]


moreVertical : Int -> Html msg
moreVertical size =
    customSvgFeatherIcon size
        "more-vertical"
        [ Svg.circle
            [ cx "12"
            , cy "12"
            , r "1"
            ]
            []
        , Svg.circle [ cx "12", cy "5", r "1" ] []
        , Svg.circle [ cx "12", cy "19", r "1" ] []
        ]


save : Int -> Html msg
save size =
    customSvgFeatherIcon size
        "save"
        [ Svg.path [ d "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" ] []
        , Svg.polyline [ points "17 21 17 13 7 13 7 21" ] []
        , Svg.polyline [ points "7 3 7 8 15 8" ] []
        ]


settings : Int -> Html msg
settings size =
    customSvgFeatherIcon size
        "settings"
        [ Svg.circle
            [ cx "12"
            , cy "12"
            , r "3"
            ]
            []
        , Svg.path [ d "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" ] []
        ]


imageIcon : Int -> Html msg
imageIcon size =
    customSvgFeatherIcon size
        "image"
        [ Svg.rect
            [ Svg.Attributes.x "3"
            , y "3"
            , width "18"
            , height "18"
            , rx "2"
            , ry "2"
            ]
            []
        , Svg.circle [ cx "8.5", cy "8.5", r "1.5" ] []
        , Svg.polyline [ points "21 15 16 10 5 21" ] []
        ]


grid : Int -> Html msg
grid size =
    customSvgFeatherIcon size
        "grid"
        [ Svg.rect
            [ Svg.Attributes.x "3", y "3", width "7", height "7" ]
            []
        , Svg.rect [ Svg.Attributes.x "14", y "3", width "7", height "7" ] []
        , Svg.rect [ Svg.Attributes.x "14", y "14", width "7", height "7" ] []
        , Svg.rect [ Svg.Attributes.x "3", y "14", width "7", height "7" ] []
        ]


youtube : Int -> Html msg
youtube size =
    customSvgFeatherIcon size
        "youtube"
        [ Svg.path [ d "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" ] []
        , Svg.polygon [ points "9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" ] []
        ]


edit : Int -> Html msg
edit size =
    customSvgFeatherIcon size
        "edit"
        [ Svg.path [ d "M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" ] []
        , Svg.polygon [ points "18 2 22 6 12 16 8 16 8 12 18 2" ] []
        ]


alignCenter : Int -> Html msg
alignCenter size =
    customSvgFeatherIcon size
        "align-center"
        [ Svg.line
            [ x1 "18"
            , y1 "10"
            , x2 "6"
            , y2 "10"
            ]
            []
        , Svg.line [ x1 "21", y1 "6", x2 "3", y2 "6" ] []
        , Svg.line [ x1 "21", y1 "14", x2 "3", y2 "14" ] []
        , Svg.line [ x1 "18", y1 "18", x2 "6", y2 "18" ] []
        ]


alignJustify : Int -> Html msg
alignJustify size =
    customSvgFeatherIcon size
        "align-justify"
        [ Svg.line [ x1 "21", y1 "10", x2 "3", y2 "10" ] []
        , Svg.line [ x1 "21", y1 "6", x2 "3", y2 "6" ] []
        , Svg.line [ x1 "21", y1 "14", x2 "3", y2 "14" ] []
        , Svg.line [ x1 "21", y1 "18", x2 "3", y2 "18" ] []
        ]


alignLeft : Int -> Html msg
alignLeft size =
    customSvgFeatherIcon size
        "align-left"
        [ Svg.line [ x1 "17", y1 "10", x2 "3", y2 "10" ] []
        , Svg.line [ x1 "21", y1 "6", x2 "3", y2 "6" ] []
        , Svg.line [ x1 "21", y1 "14", x2 "3", y2 "14" ] []
        , Svg.line [ x1 "17", y1 "18", x2 "3", y2 "18" ] []
        ]


alignRight : Int -> Html msg
alignRight size =
    customSvgFeatherIcon size
        "align-right"
        [ Svg.line
            [ x1 "21"
            , y1 "10"
            , x2 "7"
            , y2 "10"
            ]
            []
        , Svg.line [ x1 "21", y1 "6", x2 "3", y2 "6" ] []
        , Svg.line [ x1 "21", y1 "14", x2 "3", y2 "14" ] []
        , Svg.line [ x1 "21", y1 "18", x2 "7", y2 "18" ] []
        ]


chevronLeft : Int -> Html msg
chevronLeft size =
    customSvgFeatherIcon
        size
        "chevron-left"
        [ Svg.polyline [ points "15 18 9 12 15 6" ] [] ]


chevronRight : Int -> Html msg
chevronRight size =
    customSvgFeatherIcon
        size
        "chevron-right"
        [ Svg.polyline [ points "9 18 15 12 9 6" ] [] ]


chevronUp : Int -> Html msg
chevronUp size =
    customSvgFeatherIcon
        size
        "chevron-up"
        [ Svg.polyline
            [ points "18 15 12 9 6 15" ]
            []
        ]


chevronDown : Int -> Html msg
chevronDown size =
    customSvgFeatherIcon size
        "chevron-down"
        [ Svg.polyline
            [ points "6 9 12 15 18 9" ]
            []
        ]


chevronsUp : Int -> Html msg
chevronsUp size =
    customSvgFeatherIcon size
        "chevrons-up"
        [ Svg.polyline [ points "17 11 12 6 7 11" ] []
        , Svg.polyline [ points "17 18 12 13 7 18" ] []
        ]


chevronsDown : Int -> Html msg
chevronsDown size =
    customSvgFeatherIcon size
        "chevrons-down"
        [ Svg.polyline [ points "7 13 12 18 17 13" ] []
        , Svg.polyline [ points "7 6 12 11 17 6" ] []
        ]


chevronsLeft : Int -> Html msg
chevronsLeft size =
    customSvgFeatherIcon size
        "chevrons-left"
        [ Svg.polyline [ points "11 17 6 12 11 7" ] [], Svg.polyline [ points "18 17 13 12 18 7" ] [] ]


chevronsRight : Int -> Html msg
chevronsRight size =
    customSvgFeatherIcon size
        "chevrons-right"
        [ Svg.polyline [ points "13 17 18 12 13 7" ] [], Svg.polyline [ points "6 17 11 12 6 7" ] [] ]


refreshCw : Int -> Html msg
refreshCw size =
    customSvgFeatherIcon size
        "refresh-cw"
        [ Svg.polyline [ points "23 4 23 10 17 10" ] []
        , Svg.polyline [ points "1 20 1 14 7 14" ] []
        , Svg.path [ d "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" ] []
        ]


checkSquare : Int -> Html msg
checkSquare size =
    customSvgFeatherIcon size
        "check-square"
        [ Svg.polyline [ points "9 11 12 14 22 4" ] []
        , Svg.path [ d "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" ] []
        ]


square : Int -> Html msg
square size =
    customSvgFeatherIcon size
        "square"
        [ Svg.rect
            [ Svg.Attributes.x "3"
            , y "3"
            , width "18"
            , height "18"
            , rx "2"
            , ry "2"
            ]
            []
        ]


type_ : Int -> Html msg
type_ size =
    customSvgFeatherIcon size
        "type"
        [ Svg.polyline [ points "4 7 4 4 20 4 20 7" ]
            []
        , Svg.line [ x1 "9", y1 "20", x2 "15", y2 "20" ] []
        , Svg.line [ x1 "12", y1 "4", x2 "12", y2 "20" ] []
        ]


tag : Int -> Html msg
tag size =
    customSvgFeatherIcon size
        "tag"
        [ Svg.path
            [ d "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" ]
            []
        , Svg.line [ x1 "7", y1 "7", x2 "7", y2 "7" ] []
        ]


rotateCcw : Int -> Html msg
rotateCcw size =
    customSvgFeatherIcon size
        "rotate-ccw"
        [ Svg.polyline [ points "1 4 1 10 7 10" ] []
        , Svg.path [ d "M3.51 15a9 9 0 1 0 2.13-9.36L1 10" ] []
        ]


rotateCw : Int -> Html msg
rotateCw size =
    customSvgFeatherIcon size
        "rotate-cw"
        [ Svg.polyline [ points "23 4 23 10 17 10" ] []
        , Svg.path [ d "M20.49 15a9 9 0 1 1-2.12-9.36L23 10" ] []
        ]


folder : Int -> Html msg
folder size =
    customSvgFeatherIcon size
        "folder"
        [ Svg.path [ d "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" ] [] ]


folderMinus : Int -> Html msg
folderMinus size =
    customSvgFeatherIcon size
        "folder-minus"
        [ Svg.path [ d "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" ] []
        , Svg.line [ x1 "9", y1 "14", x2 "15", y2 "14" ] []
        ]


folderPlus : Int -> Html msg
folderPlus size =
    customSvgFeatherIcon size
        "folder-plus"
        [ Svg.path [ d "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" ] []
        , Svg.line [ x1 "12", y1 "11", x2 "12", y2 "17" ] []
        , Svg.line [ x1 "9", y1 "14", x2 "15", y2 "14" ] []
        ]


home : Int -> Html msg
home size =
    customSvgFeatherIcon size
        "home"
        [ Svg.path [ d "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" ] []
        , Svg.polyline [ points "9 22 9 12 15 12 15 22" ] []
        ]


upload : Int -> Html msg
upload size =
    customSvgFeatherIcon size
        "upload"
        [ Svg.path
            [ d "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" ]
            []
        , Svg.polyline [ points "17 8 12 3 7 8" ] []
        , Svg.line [ x1 "12", y1 "3", x2 "12", y2 "15" ] []
        ]


download : Int -> Html msg
download size =
    customSvgFeatherIcon size
        "download"
        [ Svg.path
            [ d "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" ]
            []
        , Svg.polyline [ points "7 10 12 15 17 10" ] []
        , Svg.line [ x1 "12", y1 "15", x2 "12", y2 "3" ] []
        ]


fileText : Int -> Html msg
fileText size =
    customSvgFeatherIcon size
        "file-text"
        [ Svg.path
            [ d "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" ]
            []
        , Svg.polyline [ points "14 2 14 8 20 8" ] []
        , Svg.line [ x1 "16", y1 "13", x2 "8", y2 "13" ] []
        , Svg.line [ x1 "16", y1 "17", x2 "8", y2 "17" ] []
        , Svg.polyline [ points "10 9 9 9 8 9" ] []
        ]


scissors : Int -> Html msg
scissors size =
    customSvgFeatherIcon size
        "scissors"
        [ Svg.circle
            [ cx "6", cy "6", r "3" ]
            []
        , Svg.circle [ cx "6", cy "18", r "3" ] []
        , Svg.line [ x1 "20", y1 "4", x2 "8.12", y2 "15.88" ] []
        , Svg.line [ x1 "14.47", y1 "14.48", x2 "20", y2 "20" ] []
        , Svg.line [ x1 "8.12", y1 "8.12", x2 "12", y2 "12" ] []
        ]
