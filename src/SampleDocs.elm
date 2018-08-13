module SampleDocs exposing (..)

import Document exposing (..)
import Element exposing (centerX, fill, height, layout, maximum, px, width)
import Html.Attributes as Attr
import Set exposing (..)


type DocumentOld msg
    = ParagraphNode Id (List (DocAttribute msg)) (List (DocumentOld msg))
    | ColumnNode Id (List (DocAttribute msg)) (List (DocumentOld msg))
    | RowNode Id (List (DocAttribute msg)) (List (DocumentOld msg))
    | TextColumnNode Id (List (DocAttribute msg)) (List (DocumentOld msg))
    | RespBloc Id (List (DocAttribute msg)) (List (DocumentOld msg))
    | ImageNode Id (List (DocAttribute msg)) ImageMeta
    | LinkNode Id (List (DocAttribute msg)) LinkMeta
    | TextNode Id (List (DocAttribute msg)) String
    | HeadingNode Id (List (DocAttribute msg)) ( Int, String )


docToDocZip : DocumentOld msg -> Document msg
docToDocZip document =
    case document of
        ParagraphNode id attrs children ->
            Node
                { nodeLabel = Paragraph
                , id = id
                , attrs = attrs
                }
                (List.map docToDocZip children)

        ColumnNode id attrs children ->
            Node
                { nodeLabel = Column
                , id = id
                , attrs = attrs
                }
                (List.map docToDocZip children)

        RowNode id attrs children ->
            Node
                { nodeLabel = Row
                , id = id
                , attrs = attrs
                }
                (List.map docToDocZip children)

        TextColumnNode id attrs children ->
            Node
                { nodeLabel = TextColumn
                , id = id
                , attrs = attrs
                }
                (List.map docToDocZip children)

        RespBloc id attrs children ->
            Node
                { nodeLabel = ResponsiveBloc
                , id = id
                , attrs = attrs
                }
                (List.map docToDocZip children)

        ImageNode id attrs meta ->
            Leaf
                { leafContent = Image meta
                , id = id
                , attrs = attrs
                }

        LinkNode id attrs meta ->
            Leaf
                { leafContent = Link meta
                , id = id
                , attrs = attrs
                }

        TextNode id attrs meta ->
            Leaf
                { leafContent = Text meta
                , id = id
                , attrs = attrs
                }

        HeadingNode id attrs meta ->
            Leaf
                { leafContent = Heading meta
                , id = id
                , attrs = attrs
                }


sampleDoc1 : Document msg
sampleDoc1 =
    ColumnNode { uid = 120, styleId = Just "root", classes = Set.empty }
        []
        [ HeadingNode { uid = 1, styleId = Nothing, classes = Set.empty }
            []
            ( 1, "Découvrir Murol" )
        , HeadingNode { uid = 2, styleId = Nothing, classes = Set.empty }
            []
            ( 2, "Le bourg de Murol" )
        , TextColumnNode { uid = 3, styleId = Nothing, classes = Set.empty }
            []
            [ ImageNode { uid = 4, styleId = Nothing, classes = Set.empty }
                [ AlignLeft ]
                { src = UrlSrc "/images/2 Murol, le bourg.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 300
                    , imgHeight = 300
                    }
                }
            , ImageNode { uid = 21, styleId = Nothing, classes = Set.empty }
                [ AlignRight ]
                { src = UrlSrc "/images/illustration animations estivales.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 576
                    , imgHeight = 772
                    }
                }
            , ParagraphNode { uid = 6, styleId = Nothing, classes = Set.empty }
                []
                [ TextNode { uid = 22, styleId = Nothing, classes = Set.empty }
                    []
                    "Le bourg de Murol est implanté dans un écrin de verdure à 850 mètres d'altitude, dans la vallée de la Couze Chambon, sur le versant Est du massif du Sancy."
                ]
            , ParagraphNode { uid = 7, styleId = Nothing, classes = Set.empty }
                []
                [ TextNode { uid = 8, styleId = Nothing, classes = Set.empty }
                    []
                    "Enchâssé entre le volcan boisé du "
                , LinkNode { uid = 9, styleId = Nothing, classes = Set.empty }
                    []
                    { targetBlank = False
                    , url = ""
                    , label = "Tartaret"
                    }
                , TextNode { uid = 10, styleId = Nothing, classes = Set.empty }
                    []
                    " le promontoire du "
                , LinkNode { uid = 11, styleId = Nothing, classes = Set.empty }
                    []
                    { targetBlank = False
                    , url = ""
                    , label = "château de Murol"
                    }
                , TextNode { uid = 12, styleId = Nothing, classes = Set.empty }
                    []
                    " et le puy de Bessolles, le village vous ravira par ses sites remarquables et pittoresques."
                ]
            , ParagraphNode { uid = 13, styleId = Nothing, classes = Set.empty }
                []
                [ TextNode { uid = 14, styleId = Nothing, classes = Set.empty }
                    []
                    "Au pied du château, découvrez le parc arboré du Prélong où se trouvent le "
                , LinkNode { uid = 15, styleId = Nothing, classes = Set.empty }
                    []
                    { targetBlank = True
                    , url = "http://www.musee-murol.fr/fr"
                    , label = "musée des Peintres de l’Ecole de Murols"
                    }
                , TextNode { uid = 16, styleId = Nothing, classes = Set.empty }
                    []
                    " et le musée archéologique."
                ]
            , ParagraphNode { uid = 36, styleId = Nothing, classes = Set.empty }
                []
                [ TextNode { uid = 37, styleId = Nothing, classes = Set.empty }
                    []
                    "Dans le sud du département du Puy-de-Dôme, la commune de Murol est traversée par la Couze Chambon (affluent de l'Allier) et son affluent le Fredet. Au sud-ouest, la partie orientale du lac Chambon fait partie du territoire communal. "
                ]

            --, RowNode { uid = 0, styleId = Nothing, classes = Set.empty }
            --    [ StyleElementAttr <| height (px 100) ]
            --    [ ImageNode { uid = 21, styleId = Nothing, classes = Set.fromList [] }
            --        []
            --        { src = UrlSrc "/images/famillePlus.jpg"
            --        , caption = Nothing
            --        , size =
            --            { imgWidth = 156
            --            , imgHeight = 143
            --            }
            --        }
            --    , ImageNode { uid = 21, styleId = Nothing, classes = Set.fromList [] }
            --        []
            --        { src = UrlSrc "/images/Station_Tourisme_RVB.jpg"
            --        , caption = Nothing
            --        , size =
            --            { imgWidth = 100
            --            , imgHeight = 143
            --            }
            --        }
            --    , ImageNode { uid = 21, styleId = Nothing, classes = Set.fromList [] }
            --        []
            --        { src = UrlSrc "/images/Village fleuri.png"
            --        , caption = Nothing
            --        , size =
            --            { imgWidth = 356
            --            , imgHeight = 143
            --            }
            --        }
            --    , ImageNode { uid = 21, styleId = Nothing, classes = Set.fromList [] }
            --        []
            --        { src = UrlSrc "/images/StationVertegf.jpg"
            --        , caption = Nothing
            --        , size =
            --            { imgWidth = 150
            --            , imgHeight = 143
            --            }
            --        }
            --    , ImageNode { uid = 21, styleId = Nothing, classes = Set.fromList [ "rowImg" ] }
            --        []
            --        { src = UrlSrc "/images/PAVILLON BLEU LOGO 2.png"
            --        , caption = Nothing
            --        , size =
            --            { imgWidth = 162
            --            , imgHeight = 143
            --            }
            --        }
            --    ]
            , ColumnNode { uid = 36, styleId = Nothing, classes = Set.empty }
                []
                [ ParagraphNode { uid = 39, styleId = Nothing, classes = Set.empty }
                    []
                    [ TextNode { uid = 40, styleId = Nothing, classes = Set.empty }
                        []
                        "L'altitude minimale, 785 mètres, se trouve à l'est, au lieu-dit les Chazeaux, là où la Couze Chambon quitte le territoire communal et entre sur celui de Saint-Nectaire. L'altitude maximale avec 1 500 mètres est localisée au nord-ouest, sur les pentes nord du puy de la Croix-Morand, en limite de la commune de Chambon-sur-Lac. "
                    ]
                , ImageNode { uid = 21, styleId = Nothing, classes = Set.empty }
                    []
                    { src = UrlSrc "/images/lac3.jpg"
                    , caption = Nothing
                    , size =
                        { imgWidth = 377
                        , imgHeight = 250
                        }
                    }
                , ParagraphNode { uid = 39, styleId = Nothing, classes = Set.empty }
                    []
                    [ TextNode { uid = 40, styleId = Nothing, classes = Set.empty }
                        []
                        "Établi le long de la Couze Chambon et à l'intersection des routes départementales 5 et 996, le village de Murol se situe en distances orthodromiques, sept kilomètres au nord de Besse-en-Chandesse et seize kilomètres à l'est de La Bourboule."
                    ]
                , ParagraphNode { uid = 39, styleId = Nothing, classes = Set.empty }
                    []
                    [ TextNode { uid = 40, styleId = Nothing, classes = Set.empty }
                        []
                        "Le sentier de grande randonnée GR 30 traverse le territoire communal en deux tronçons, du nord-est à l'ouest puis du sud-ouest au sud, sur plus de six kilomètres. "
                    ]
                ]
            ]
        , ColumnNode { uid = 17, styleId = Nothing, classes = Set.empty }
            []
            [ ImageNode { uid = 18, styleId = Nothing, classes = Set.empty }
                []
                { src = UrlSrc "/images/prélong.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 333
                    , imgHeight = 250
                    }
                }
            , ImageNode { uid = 19, styleId = Nothing, classes = Set.empty }
                []
                { src = UrlSrc "/images/museePeintre.jpeg"
                , caption = Nothing
                , size =
                    { imgWidth = 333
                    , imgHeight = 250
                    }
                }
            , ImageNode { uid = 20, styleId = Nothing, classes = Set.empty }
                []
                { src = UrlSrc "/images/bourg2.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 377
                    , imgHeight = 250
                    }
                }
            , ImageNode { uid = 21, styleId = Nothing, classes = Set.empty }
                []
                { src = UrlSrc "/images/illustration animations estivales.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 576
                    , imgHeight = 772
                    }
                }
            ]
        , RowNode { uid = -1, styleId = Nothing, classes = Set.fromList [ "sameHeightImgsRow" ] }
            []
            [ ImageNode { uid = 18, styleId = Nothing, classes = Set.empty }
                []
                { src = UrlSrc "/images/prélong.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 333
                    , imgHeight = 250
                    }
                }
            , ImageNode { uid = 19, styleId = Nothing, classes = Set.empty }
                []
                { src = UrlSrc "/images/museePeintre.jpeg"
                , caption = Nothing
                , size =
                    { imgWidth = 333
                    , imgHeight = 250
                    }
                }
            , ImageNode { uid = 20, styleId = Nothing, classes = Set.empty }
                []
                { src = UrlSrc "/images/bourg2.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 377
                    , imgHeight = 250
                    }
                }
            , ImageNode { uid = 21, styleId = Nothing, classes = Set.empty }
                []
                { src = UrlSrc "/images/illustration animations estivales.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 576
                    , imgHeight = 772
                    }
                }
            ]
        , HeadingNode { uid = 23, styleId = Nothing, classes = Set.empty }
            []
            ( 1, "Office de Tourisme communautaire du massif du Sancy" )
        , TextColumnNode { uid = 24, styleId = Nothing, classes = Set.empty }
            []
            [ ImageNode { uid = 25, styleId = Nothing, classes = Set.empty }
                [ AlignLeft ]
                { src = UrlSrc "/images/OT.jpg"
                , caption = Nothing
                , size =
                    { imgWidth = 400
                    , imgHeight = 300
                    }
                }
            , ColumnNode { uid = 27, styleId = Nothing, classes = Set.empty }
                [ AlignRight ]
                [ ImageNode { uid = 26, styleId = Nothing, classes = Set.empty }
                    []
                    { src = UrlSrc "/images/sancy_hiver.jpg"
                    , caption = Nothing
                    , size =
                        { imgWidth = 125
                        , imgHeight = 167
                        }
                    }
                , LinkNode { uid = 28, styleId = Nothing, classes = Set.empty }
                    []
                    { targetBlank = True
                    , url = ""
                    , label = "sancy.com"
                    }
                ]
            ]
        , TextColumnNode { uid = 29, styleId = Nothing, classes = Set.empty }
            []
            [ HeadingNode { uid = 31, styleId = Nothing, classes = Set.empty }
                []
                ( 3, "Adresse:" )
            , ParagraphNode { uid = 32, styleId = Nothing, classes = Set.empty }
                []
                [ TextNode { uid = 33, styleId = Nothing, classes = Set.empty }
                    []
                    "Rue de jassaguet - 63790 Murol"
                ]
            , ParagraphNode { uid = 32, styleId = Nothing, classes = Set.empty }
                []
                [ TextNode { uid = 34, styleId = Nothing, classes = Set.empty }
                    []
                    "Tel: 04 73 88 62 62"
                ]
            , ParagraphNode { uid = 32, styleId = Nothing, classes = Set.empty }
                []
                [ TextNode { uid = 35, styleId = Nothing, classes = Set.empty }
                    []
                    "Fax : 04 73 88 60 23"
                ]
            , HeadingNode { uid = 30, styleId = Nothing, classes = Set.empty }
                []
                ( 3, "Horaires:" )
            ]
        ]
        |> docToDocZip
        |> fixUids 0
