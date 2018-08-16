module StyleSheets exposing (..)

import Dict exposing (..)
import Document exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Region as Region
import Html.Attributes as Attr


defaulStyleSheet =
    { paragraphStyle =
        [ width fill
        ]
    , columnStyle =
        [ spacing 15
        , centerX
        , Background.color (rgba 0 1 0 0.3)
        ]
    , rowStyle =
        [ --spacing 15
          --spaceEvenly
          width fill
        , Background.color (rgba 1 0 0 0.3)
        ]
    , textColumnStyle =
        [ spacing 15
        , width fill
        , Background.color (rgba 0 0 1 0.3)
        ]
    , respBlocStyle =
        []
    , imageStyle =
        []
    , textStyle = []
    , linkStyle =
        [ Font.color (rgb 0 0.5 0.5) ]
    , headingStyles =
        Dict.fromList
            [ ( 1
              , [ Background.color (rgb 0.4 0.6 0.55)
                , Font.size 24
                , Font.center
                , Font.color (rgb 0.94 0.97 1)
                , Font.bold
                , paddingXY 0 5
                , width fill
                ]
              )
            , ( 2
              , [ Background.color (rgb 0.4 0.6 0.55)
                , Font.size 18
                , Font.center
                , Font.color (rgb 0.94 0.97 1)
                , Font.bold
                , paddingXY 0 2
                , width fill
                ]
              )
            , ( 3
              , [ Font.size 16
                , Font.color (rgb 0 0.5 0)
                , Font.bold
                ]
              )
            ]
    , customStyles =
        { idNbrs =
            Dict.fromList
                [ ( "root"
                  , [ padding 20
                    , spacing 15
                    , Font.family [ Font.typeface "Arial" ]
                    , Font.size 16
                    ]
                  )
                ]
        , classes =
            Dict.fromList
                [ ( "colImg"
                  , [ -- htmlAttribute
                      --    (Attr.style "width" "100%")
                      --, htmlAttribute
                      --    (Attr.style "height" "auto")
                      centerX

                    --, width (maximum size.imgWidth fill)
                    ]
                  )
                , ( "rowImg"
                  , []
                  )
                , ( "hovered"
                  , [ --alpha 0.5
                      htmlAttribute (Attr.style "transition" "0.5s")
                    , pointer
                    ]
                  )
                , ( "selected"
                  , []
                  )
                , ( "sameHeightImgsRow"
                  , [ spaceEvenly
                    , clip
                    ]
                  )
                ]
        }
    }
