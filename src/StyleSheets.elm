module StyleSheets exposing (..)

import Dict exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Region as Region
import Html.Attributes as Attr


type alias StyleSheet msg =
    { paragraphStyle : List (Attribute msg)
    , columnStyle : List (Attribute msg)
    , rowStyle : List (Attribute msg)
    , textColumnStyle : List (Attribute msg)
    , respBlocStyle : List (Attribute msg)
    , imageStyle : List (Attribute msg)
    , textStyle : List (Attribute msg)
    , linkStyle : List (Attribute msg)
    , headingStyles : Dict Int (List (Attribute msg))
    , customStyles :
        { idNbrs : Dict String (List (Attribute msg))
        , classes : Dict String (List (Attribute msg))
        }
    }


defaulStyleSheet : StyleSheet msg
defaulStyleSheet =
    { paragraphStyle =
        [ width fill
        ]
    , columnStyle =
        [ spacing 15
        , centerX
        ]
    , rowStyle =
        [ width fill
        ]
    , textColumnStyle =
        [ spacing 15
        , width fill
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
                , paddingXY 0 10
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
                    , width (maximum 900 fill)
                    , height fill
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
                , ( "selected"
                  , [ --Border.width 4
                      --  , Border.color (rgb 0 0 0)
                      Border.shadow
                        { offset = ( 4, 4 )
                        , size = 5
                        , blur = 10
                        , color = rgba 0 0 0 0.16
                        }

                    --, Background.color
                    --    (rgba 0 1 0 0.5)
                    ]
                  )
                , ( "sameHeightImgsRow"
                  , [ spaceEvenly
                    , clip
                    ]
                  )
                ]
        }
    }


type alias TableStyle msg =
    { tableStyle : List (Attribute msg)
    , cellStyle : Int -> List (Attribute msg)
    , containerStyle : List (Attribute msg)
    }


tableStyles : Dict String (TableStyle msg)
tableStyles =
    Dict.fromList
        [ ( "default"
          , { tableStyle =
                [ Border.widthEach
                    { bottom = 0
                    , left = 1
                    , right = 0
                    , top = 1
                    }
                ]
            , cellStyle =
                \ri ->
                    [ Border.widthEach
                        { bottom = 1
                        , left = 0
                        , right = 1
                        , top = 0
                        }
                    , Background.color
                        (if modBy 2 ri == 0 then
                            rgb 0.8 0.8 0.8
                         else
                            rgb 1 1 1
                        )
                    , width fill
                    ]
            , containerStyle = []
            }
          )
        , ( "souligné"
          , { tableStyle =
                []
            , cellStyle =
                \ri ->
                    [ Border.widthEach
                        { bottom = 1
                        , left = 0
                        , right = 0
                        , top = 0
                        }
                    , width fill
                    ]
            , containerStyle =
                [ paddingXY 1 0
                ]
            }
          )
        , ( "gris-vert"
          , { tableStyle =
                []
            , cellStyle =
                \ri ->
                    [ Border.widthEach
                        { bottom = 1
                        , left = 0
                        , right = 0
                        , top = 0
                        }
                    , Border.color (rgba 0.5 0.5 0.5 1)
                    , Background.color
                        (if modBy 2 ri == 0 then
                            rgb 0.83 0.83 0.83
                         else
                            rgb 0.58 0.93 0.58
                        )
                    , width fill
                    ]
            , containerStyle =
                [ paddingXY 1 1 ]
            }
          )
        , ( "bleu-blanc"
          , { tableStyle =
                [ Border.width 1

                --, width shrink
                ]
            , cellStyle =
                \ri ->
                    [ Border.widthEach
                        { bottom = 1
                        , left = 0
                        , right = 0
                        , top = 0
                        }
                    , Border.color (rgb 0.5 0.5 0.5)
                    , Background.color
                        (if modBy 2 ri == 0 then
                            rgb 0.53 0.81 0.92
                         else
                            rgb 0.92 0.92 0.84
                        )
                    , width fill
                    ]
            , containerStyle =
                [ paddingXY 1 1
                ]
            }
          )

        --, ( ""
        --  , { tableStyle =
        --        []
        --    , cellStyle =
        --        (\ri ->
        --            [])
        --    , containerStyle =
        --       []
        --    }
        --  )
        --
        ]
