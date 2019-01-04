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


-------------------------------------------------------------------------------
-----------------------
-- Window size infos --
-----------------------


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
        1000


getContainerWidth config =
    if config.editMode then
        case config.previewMode of
            PreviewScreen ->
                980

            PreviewTablet ->
                800

            PreviewPhone ->
                350

            _ ->
                config.width
    else
        config.width


chunkBy config n1 n2 n3 n4 =
    let
        device =
            getDevice config
    in
    case device.class of
        Phone ->
            n1

        Tablet ->
            n2

        Desktop ->
            n3

        BigDesktop ->
            n4


getDevice config =
    if config.editMode then
        case config.previewMode of
            PreviewBigScreen ->
                { class = BigDesktop
                , orientation = Landscape
                }

            PreviewScreen ->
                { class = Desktop
                , orientation = Landscape
                }

            PreviewTablet ->
                { class = Tablet
                , orientation = Portrait
                }

            PreviewPhone ->
                { class = Phone
                , orientation = Portrait
                }
    else
        Element.classifyDevice
            { height = config.height
            , width = config.width
            }



-------------------------------------------------------------------------------
---------------------
-- Main stylesheet --
---------------------


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
    , headingStyle =
        headingStyles
            config.season
            ( config.width, config.height )
            config.editMode
    , pictureLinksStyle =
        case config.season of
            Spring ->
                [ Background.color (rgb255 41 80 0) ]

            Summer ->
                [ Background.color (rgba255 255 193 58 1) ]

            Autumn ->
                [ Background.color (rgb255 255 211 37) ]

            Winter ->
                [ Background.color (rgb255 0 128 128) ]
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
                ]
        }
    }


headingStyles season ( winWidth, winHeight ) editMode =
    let
        commonAttr =
            Dict.fromList
                [ ( 1
                  , [ Font.size 18
                    , Font.center
                    , Font.bold
                    , paddingXY 0 10
                    , width fill
                    ]
                  )
                , ( 2
                  , [ Font.size 16
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
                        [ ( 1
                          , [ Background.color (rgba255 186 172 145 1) --(rgba255 255 193 58 1)
                            , Font.color (rgba255 0 0 0 1)
                            ]
                          )
                        , ( 2
                          , [ Background.color (rgba255 255 193 58 1)
                            , Font.color (rgba255 0 0 0 1)
                            ]
                          )
                        , ( 3
                          , []
                          )
                        ]

                Autumn ->
                    Dict.fromList
                        [ ( 1
                          , [ Background.color (rgba255 205 133 63 1)
                            , Font.color (rgba255 67 46 42 1)
                            ]
                          )
                        , ( 2
                          , [ Background.color (rgba255 205 133 63 1)
                            , Font.color (rgba255 67 46 42 1)
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


seasonToStr season =
    case season of
        Spring ->
            "spring"

        Summer ->
            "summer"

        Autumn ->
            "autumn"

        Winter ->
            "winter"


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
            "/assets/images/backgrounds/summer.jpg"

        Winter ->
            "/assets/images/backgrounds/winter_bg.jpg"

        Autumn ->
            "/assets/images/backgrounds/automne_bg2.jpg"
