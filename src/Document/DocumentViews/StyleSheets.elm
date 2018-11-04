module Document.DocumentViews.StyleSheets exposing (..)

import Dict exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Region as Region
import Html.Attributes as Attr
import Time exposing (Month(..), Posix, Zone, toDay, toMonth)


docMaxWidth : ( Int, Int ) -> Bool -> PreviewMode -> Int
docMaxWidth ( winWidth, winHeight ) editMode previewMode =
    let
        device =
            Element.classifyDevice
                { height = winHeight
                , width = winWidth
                }
    in
    if editMode then
        case previewMode of
            PreviewBigScreen ->
                1000

            PreviewTablet ->
                768

            PreviewPhone ->
                320

            _ ->
                950
    else if device.class == BigDesktop then
        1000
    else
        950


type alias StyleSheet msg =
    { paragraphStyle : List (Attribute msg)
    , columnStyle : List (Attribute msg)
    , rowStyle : List (Attribute msg)
    , textColumnStyle : List (Attribute msg)
    , respBlocStyle : List (Attribute msg)
    , imageStyle : List (Attribute msg)
    , textStyle : List (Attribute msg)
    , blocLinkStyle : List (Attribute msg)
    , linkStyle : List (Attribute msg)
    , headingStyles : Dict Int (List (Attribute msg))
    , customStyles :
        { idNbrs : Dict String (List (Attribute msg))
        , classes : Dict String (List (Attribute msg))
        }
    }


type PreviewMode
    = PreviewBigScreen
    | PreviewScreen
    | PreviewTablet
    | PreviewPhone



--defaultStyleSheet : Season -> ( Int, Int ) -> Bool -> StyleSheet msg
--defaultStyleSheet :
--    { config
--        | season : Season
--        , winWidth : Int
--        , winHeight : Int
--        , editMode : Bool
--        , previewMode : PreviewMode
--    }
--    -> StyleSheet msg


defaultStyleSheet config =
    { paragraphStyle =
        [ width fill
        ]
    , columnStyle =
        [ spacing 15
        , width fill
        ]
    , rowStyle =
        [ width fill
        , spacing 15
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
    , blocLinkStyle = []
    , linkStyle =
        [ Font.color (rgb 0 0.5 0.5) ]
    , headingStyles =
        headingStyles
            config.season
            ( config.width, config.height )
            config.editMode
    , customStyles =
        { idNbrs =
            Dict.fromList
                [ ( "root"
                  , [ padding 20
                    , spacing 15
                    , Font.family [ Font.typeface "Arial" ]
                    , Font.size 16
                    , width
                        (maximum
                            (docMaxWidth
                                ( config.width, config.height )
                                config.editMode
                                config.previewMode
                            )
                            fill
                        )
                    , height fill
                    , centerX
                    ]
                  )
                ]
        , classes =
            Dict.fromList
                [ ( "colImg"
                  , [ centerX
                    ]
                  )
                , ( "rowImg"
                  , []
                  )
                , ( "selected"
                  , [ Border.shadow
                        { offset = ( 4, 4 )
                        , size = 5
                        , blur = 10
                        , color = rgba 0 0 0 0.45
                        }
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


headingStyles season ( winWidth, winHeight ) editMode =
    let
        commonAttr =
            Dict.fromList
                [ ( 1
                  , [ Font.size 24
                    , Font.center
                    , Font.bold
                    , paddingXY 0 10
                    , width fill
                    ]
                  )
                , ( 2
                  , [ Font.size 18
                    , Font.center
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

        seasonAttr =
            case season of
                Spring ->
                    Dict.fromList
                        [ ( 1
                          , [ Background.color (rgba255 102 153 140 1)
                            , Font.color (rgba255 240 248 255 1)
                            ]
                          )
                        , ( 2
                          , [ Background.color (rgba255 102 153 140 1)
                            , Font.color (rgba255 240 248 255 1)
                            ]
                          )
                        , ( 3
                          , []
                          )
                        ]

                Summer ->
                    Dict.fromList
                        []

                Autumn ->
                    Dict.fromList
                        [ ( 1
                          , [ Background.color (rgba255 160 82 45 1)
                            , Font.color (rgba255 240 248 255 1)
                            ]
                          )
                        , ( 2
                          , [ Background.color (rgba255 160 82 45 1)
                            , Font.color (rgba255 240 248 255 1)
                            ]
                          )
                        , ( 3
                          , []
                          )
                        ]

                Winter ->
                    Dict.fromList
                        [ ( 1
                          , [ Background.color (rgba255 51 51 102 1)
                            , Font.color (rgba255 240 248 255 1)
                            ]
                          )
                        , ( 2
                          , [ Background.color (rgba255 51 51 102 1)
                            , Font.color (rgba255 240 248 255 1)
                            ]
                          )
                        , ( 3
                          , []
                          )
                        ]
    in
    Dict.foldr
        (\k v acc ->
            Dict.update
                k
                (\mbSeasonAttr ->
                    case mbSeasonAttr of
                        Just attrs ->
                            Just (v ++ attrs)

                        _ ->
                            Just v
                )
                acc
        )
        commonAttr
        seasonAttr



-------------------------------------------------------------------------------
-----------------
-- Table styles -
-----------------


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
        ]



-------------------------------------------------------------------------------
---------------------------
-- Misc helper functions --
---------------------------


type Season
    = Spring
    | Summer
    | Autumn
    | Winter


timeToSeason : Zone -> Posix -> Season
timeToSeason zone time =
    let
        month =
            toMonth zone time

        day =
            toDay zone time
    in
    case month of
        Jan ->
            Winter

        Feb ->
            Winter

        Mar ->
            if day < 21 then
                Winter
            else
                Spring

        Apr ->
            Spring

        May ->
            Spring

        Jun ->
            if day < 21 then
                Spring
            else
                Summer

        Jul ->
            Summer

        Aug ->
            Summer

        Sep ->
            if day < 21 then
                Summer
            else
                Autumn

        Oct ->
            Autumn

        Nov ->
            Autumn

        Dec ->
            if day < 21 then
                Autumn
            else
                Winter


backgroundImage : Season -> String
backgroundImage season =
    case season of
        Spring ->
            "/assets/images/backgrounds/springbg2017.jpg"

        Summer ->
            "/assets/images/backgrounds/"

        Winter ->
            "/assets/images/backgrounds/winter_bg.jpg"

        Autumn ->
            "/assets/images/backgrounds/automne_bg2.jpg"
