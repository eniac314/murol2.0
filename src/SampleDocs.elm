module SampleDocs exposing (..)

import Document exposing (..)
import Element exposing (centerX, layout)
import Html.Attributes as Attr


sampleDoc1 : Document
sampleDoc1 =
    ColumnNode { uid = 120, styleId = Just "root", classes = [] }
        []
        [ HeadingNode { uid = 1, styleId = Nothing, classes = [] }
            []
            ( 1, "Découvrir Murol" )
        , HeadingNode { uid = 2, styleId = Nothing, classes = [] }
            []
            ( 2, "Le bourg de Murol" )
        , TextColumnNode { uid = 3, styleId = Nothing, classes = [] }
            []
            [ ImageNode { uid = 4, styleId = Nothing, classes = [] }
                [ AlignLeft ]
                { src = UrlSrc "/images/2 Murol, le bourg.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 300
                    , imgHeight = 300
                    }
                }
            , ImageNode { uid = 21, styleId = Nothing, classes = [] }
                [ AlignRight ]
                { src = UrlSrc "/images/illustration animations estivales.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 576
                    , imgHeight = 772
                    }
                }
            , ParagraphNode { uid = 6, styleId = Nothing, classes = [] }
                []
                [ TextNode { uid = 22, styleId = Nothing, classes = [] }
                    []
                    "Le bourg de Murol est implanté dans un écrin de verdure à 850 mètres d'altitude, dans la vallée de la Couze Chambon, sur le versant Est du massif du Sancy."
                ]
            , ParagraphNode { uid = 7, styleId = Nothing, classes = [] }
                []
                [ TextNode { uid = 8, styleId = Nothing, classes = [] }
                    []
                    "Enchâssé entre le volcan boisé du "
                , LinkNode { uid = 9, styleId = Nothing, classes = [] }
                    []
                    { targetBlank = False
                    , url = ""
                    , label = "Tartaret"
                    }
                , TextNode { uid = 10, styleId = Nothing, classes = [] }
                    []
                    " le promontoire du "
                , LinkNode { uid = 11, styleId = Nothing, classes = [] }
                    []
                    { targetBlank = False
                    , url = ""
                    , label = "château de Murol"
                    }
                , TextNode { uid = 12, styleId = Nothing, classes = [] }
                    []
                    " et le puy de Bessolles, le village vous ravira par ses sites remarquables et pittoresques."
                ]
            , ParagraphNode { uid = 13, styleId = Nothing, classes = [] }
                []
                [ TextNode { uid = 14, styleId = Nothing, classes = [] }
                    []
                    "Au pied du château, découvrez le parc arboré du Prélong où se trouvent le "
                , LinkNode { uid = 15, styleId = Nothing, classes = [] }
                    []
                    { targetBlank = True
                    , url = "http://www.musee-murol.fr/fr"
                    , label = "musée des Peintres de l’Ecole de Murols"
                    }
                , TextNode { uid = 16, styleId = Nothing, classes = [] }
                    []
                    " et le musée archéologique."
                ]
            , ParagraphNode { uid = 36, styleId = Nothing, classes = [] }
                []
                [ TextNode { uid = 37, styleId = Nothing, classes = [] }
                    []
                    "Dans le sud du département du Puy-de-Dôme, la commune de Murol est traversée par la Couze Chambon (affluent de l'Allier) et son affluent le Fredet. Au sud-ouest, la partie orientale du lac Chambon fait partie du territoire communal. "
                ]
            , ParagraphNode { uid = 39, styleId = Nothing, classes = [] }
                []
                [ TextNode { uid = 40, styleId = Nothing, classes = [] }
                    []
                    "L'altitude minimale, 785 mètres, se trouve à l'est, au lieu-dit les Chazeaux, là où la Couze Chambon quitte le territoire communal et entre sur celui de Saint-Nectaire. L'altitude maximale avec 1 500 mètres est localisée au nord-ouest, sur les pentes nord du puy de la Croix-Morand, en limite de la commune de Chambon-sur-Lac. "
                ]
            , ParagraphNode { uid = 39, styleId = Nothing, classes = [] }
                []
                [ TextNode { uid = 40, styleId = Nothing, classes = [] }
                    []
                    "Établi le long de la Couze Chambon et à l'intersection des routes départementales 5 et 996, le village de Murol se situe en distances orthodromiques, sept kilomètres au nord de Besse-en-Chandesse et seize kilomètres à l'est de La Bourboule."
                ]
            , ParagraphNode { uid = 39, styleId = Nothing, classes = [] }
                []
                [ TextNode { uid = 40, styleId = Nothing, classes = [] }
                    []
                    "Le sentier de grande randonnée GR 30 traverse le territoire communal en deux tronçons, du nord-est à l'ouest puis du sud-ouest au sud, sur plus de six kilomètres. "
                ]
            ]
        , ColumnNode { uid = 17, styleId = Nothing, classes = [] }
            []
            [ ImageNode { uid = 18, styleId = Nothing, classes = [] }
                []
                { src = UrlSrc "/images/prélong.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 333
                    , imgHeight = 250
                    }
                }
            , ImageNode { uid = 19, styleId = Nothing, classes = [] }
                []
                { src = UrlSrc "/images/museePeintre.jpeg"
                , caption = Nothing
                , size =
                    { imgWidth = 333
                    , imgHeight = 250
                    }
                }
            , ImageNode { uid = 20, styleId = Nothing, classes = [] }
                []
                { src = UrlSrc "/images/bourg2.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 377
                    , imgHeight = 250
                    }
                }
            , ImageNode { uid = 21, styleId = Nothing, classes = [] }
                []
                { src = UrlSrc "/images/illustration animations estivales.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 576
                    , imgHeight = 772
                    }
                }
            ]
        , RowNode { uid = 17, styleId = Nothing, classes = [] }
            []
            [ ImageNode { uid = 18, styleId = Nothing, classes = [] }
                []
                { src = UrlSrc "/images/prélong.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 333
                    , imgHeight = 250
                    }
                }
            , ImageNode { uid = 19, styleId = Nothing, classes = [] }
                []
                { src = UrlSrc "/images/museePeintre.jpeg"
                , caption = Nothing
                , size =
                    { imgWidth = 333
                    , imgHeight = 250
                    }
                }
            , ImageNode { uid = 20, styleId = Nothing, classes = [] }
                []
                { src = UrlSrc "/images/bourg2.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 377
                    , imgHeight = 250
                    }
                }
            , ImageNode { uid = 21, styleId = Nothing, classes = [] }
                []
                { src = UrlSrc "/images/illustration animations estivales.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 576
                    , imgHeight = 772
                    }
                }
            ]
        , HeadingNode { uid = 23, styleId = Nothing, classes = [] }
            []
            ( 1, "Office de Tourisme communautaire du massif du Sancy" )
        , TextColumnNode { uid = 24, styleId = Nothing, classes = [] }
            []
            [ ImageNode { uid = 25, styleId = Nothing, classes = [] }
                [ AlignLeft ]
                { src = UrlSrc "/images/OT.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 400
                    , imgHeight = 300
                    }
                }
            , ColumnNode { uid = 27, styleId = Nothing, classes = [] }
                [ AlignRight ]
                [ ImageNode { uid = 26, styleId = Nothing, classes = [] }
                    []
                    { src = UrlSrc "/images/sancy_hiver.jpg"
                    , caption = Nothing
                    , size =
                        { imgWidth = 125
                        , imgHeight = 167
                        }
                    }
                , LinkNode { uid = 28, styleId = Nothing, classes = [] }
                    []
                    { targetBlank = True
                    , url = ""
                    , label = "sancy.com"
                    }
                ]
            ]
        , TextColumnNode { uid = 29, styleId = Nothing, classes = [] }
            []
            [ HeadingNode { uid = 31, styleId = Nothing, classes = [] }
                []
                ( 3, "Adresse:" )
            , ParagraphNode { uid = 32, styleId = Nothing, classes = [] }
                []
                [ TextNode { uid = 33, styleId = Nothing, classes = [] }
                    []
                    "Rue de jassaguet - 63790 Murol"
                ]
            , ParagraphNode { uid = 32, styleId = Nothing, classes = [] }
                []
                [ TextNode { uid = 34, styleId = Nothing, classes = [] }
                    []
                    "Tel: 04 73 88 62 62"
                ]
            , ParagraphNode { uid = 32, styleId = Nothing, classes = [] }
                []
                [ TextNode { uid = 35, styleId = Nothing, classes = [] }
                    []
                    "Fax : 04 73 88 60 23"
                ]
            , HeadingNode { uid = 30, styleId = Nothing, classes = [] }
                []
                ( 3, "Horaires:" )
            ]
        ]
