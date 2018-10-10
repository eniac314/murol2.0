module Internals.ToolHelpers exposing (..)

import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Lazy as Lazy
import Element.Region as Region


type ToolResult a
    = ToolQuit
    | ToolData a


type ToolLoadingStatus
    = ToolLoadingWaiting
    | ToolLoadingSuccess
    | ToolLoadingFailure String


toolLoadingView s model =
    row
        [ spacing 15 ]
        [ text s
        , case model.loadingStatus of
            ToolLoadingWaiting ->
                el
                    [ Font.color (rgb 1 (195 / 255) 0)
                    ]
                    (text "En cours...")

            ToolLoadingSuccess ->
                el
                    [ Font.color (rgb (60 / 255) (179 / 255) (113 / 255))
                    ]
                    (text "Terminé!")

            ToolLoadingFailure _ ->
                el
                    [ Font.color (rgb 1 0 0)
                    ]
                    (text "Echec")
        ]
