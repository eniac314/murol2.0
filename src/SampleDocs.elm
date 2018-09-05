module SampleDocs exposing (..)

import Array exposing (fromList)
import Document exposing (..)
import Element exposing (centerX, fill, height, layout, maximum, px, width)
import Html.Attributes as Attr
import Set exposing (..)


sampleDoc1 : Document
sampleDoc1 =
    Node
        { attrs = []
        , id = { classes = Set.fromList [], styleId = Just "root", uid = 0 }
        , nodeLabel = DocColumn
        }
        [ Leaf
            { attrs = []
            , id = { classes = Set.fromList [], styleId = Nothing, uid = 8 }
            , leafContent =
                TextBlock
                    [ TBPrimitive (Heading [] ( 1, "Découvrir Murol" ))
                    , TBPrimitive (Heading [] ( 2, "Le bourg de Murol" ))
                    ]
            }
        , Node
            { attrs = []
            , id = { classes = Set.fromList [], styleId = Nothing, uid = 6 }
            , nodeLabel = TextColumn
            }
            [ Leaf
                { attrs = [ AlignLeft ]
                , id = { classes = Set.fromList [], styleId = Nothing, uid = 14 }
                , leafContent = Image { caption = Nothing, size = { imgHeight = 300, imgWidth = 300 }, src = UrlSrc "images/2 Murol, le bourg.jpg" }
                }
            , Leaf
                { attrs = [ AlignRight ]
                , id = { classes = Set.fromList [], styleId = Nothing, uid = 13 }
                , leafContent =
                    Image
                        { caption = Nothing
                        , size = { imgHeight = 772, imgWidth = 576 }
                        , src = UrlSrc "images/illustration animations estivales.jpg"
                        }
                }
            , Leaf
                { attrs = []
                , id = { classes = Set.fromList [], styleId = Nothing, uid = 8 }
                , leafContent =
                    TextBlock
                        [ Paragraph []
                            [ Text [] "Le bourg de Murol est implanté dans un écrin de verdure à 850 mètres d'altitude, dans la vallée de la Couze Chambon, sur le versant Est du massif du Sancy."
                            ]
                        , Paragraph []
                            [ Text [] "Le bourg de Murol est implanté dans un écrin de verdure à 850 mètres d'altitude, dans la vallée de la Couze Chambon, sur le versant Est du massif du Sancy."
                            ]
                        , Paragraph []
                            [ Text [] "Enchâssé entre le volcan boisé du "
                            , Link []
                                { label = "Tartaret"
                                , targetBlank = False
                                , url = ""
                                }
                            , Text [] " le promontoire du "
                            , Link []
                                { label = "château de Murol"
                                , targetBlank = False
                                , url = ""
                                }
                            , Text [] " et le puy de Bessolles, le village vous ravira par ses sites remarquables et pittoresques."
                            ]
                        , Paragraph []
                            [ Text [] "Au pied du château, découvrez le parc arboré du Prélong où se trouvent le "
                            , Link []
                                { label = "musée des Peintres de l’Ecole de Murols"
                                , targetBlank = True
                                , url = "http://www.musee-murol.fr/fr"
                                }
                            , Text [] " et le musée archéologique."
                            ]
                        , Paragraph []
                            [ Text [] "Dans le sud du département du Puy-de-Dôme, la commune de Murol est traversée par la Couze Chambon (affluent de l'Allier) et son affluent le Fredet. Au sud-ouest, la partie orientale du lac Chambon fait partie du territoire communal. "
                            ]
                        ]
                }
            , Node
                { attrs = []
                , id = { classes = Set.fromList [ "sameHeightImgsRow" ], styleId = Nothing, uid = 8 }
                , nodeLabel = DocRow
                }
                [ Leaf
                    { attrs = []
                    , id = { classes = Set.fromList [], styleId = Nothing, uid = 13 }
                    , leafContent =
                        Image
                            { caption = Nothing
                            , size =
                                { imgHeight = 143
                                , imgWidth = 156
                                }
                            , src = UrlSrc "images/famillePlus.jpg"
                            }
                    }
                , Leaf
                    { attrs = []
                    , id =
                        { classes =
                            Set.fromList []
                        , styleId = Nothing
                        , uid = 12
                        }
                    , leafContent =
                        Image
                            { caption = Nothing
                            , size =
                                { imgHeight = 143
                                , imgWidth = 100
                                }
                            , src = UrlSrc "images/Station_Tourisme_RVB.jpg"
                            }
                    }
                , Leaf
                    { attrs = []
                    , id =
                        { classes =
                            Set.fromList []
                        , styleId = Nothing
                        , uid = 11
                        }
                    , leafContent =
                        Image
                            { caption = Nothing
                            , size =
                                { imgHeight = 143
                                , imgWidth = 356
                                }
                            , src = UrlSrc "images/Village fleuri.png"
                            }
                    }
                , Leaf
                    { attrs = []
                    , id =
                        { classes =
                            Set.fromList []
                        , styleId = Nothing
                        , uid = 10
                        }
                    , leafContent =
                        Image
                            { caption = Nothing
                            , size =
                                { imgHeight = 143
                                , imgWidth = 150
                                }
                            , src = UrlSrc "images/StationVertegf.jpg"
                            }
                    }
                , Leaf
                    { attrs = []
                    , id =
                        { classes =
                            Set.fromList [ "rowImg" ]
                        , styleId = Nothing
                        , uid = 9
                        }
                    , leafContent =
                        Image
                            { caption = Nothing
                            , size =
                                { imgHeight = 143
                                , imgWidth = 162
                                }
                            , src = UrlSrc "images/PAVILLON BLEU LOGO 2.png"
                            }
                    }
                ]
            , Node
                { attrs = []
                , id = { classes = Set.fromList [], styleId = Nothing, uid = 7 }
                , nodeLabel = DocColumn
                }
                [ Leaf
                    { attrs = []
                    , id = { classes = Set.fromList [], styleId = Nothing, uid = 8 }
                    , leafContent =
                        TextBlock
                            [ Paragraph []
                                [ Text [] "L'altitude minimale, 785 mètres, se trouve à l'est, au lieu-dit les Chazeaux, là où la Couze Chambon quitte le territoire communal et entre sur celui de Saint-Nectaire. L'altitude maximale avec 1 500 mètres est localisée au nord-ouest, sur les pentes nord du puy de la Croix-Morand, en limite de la commune de Chambon-sur-Lac. "
                                ]
                            ]
                    }
                , Leaf
                    { attrs = []
                    , id =
                        { classes = Set.fromList []
                        , styleId = Nothing
                        , uid = 10
                        }
                    , leafContent =
                        Image
                            { caption = Nothing
                            , size = { imgHeight = 250, imgWidth = 377 }
                            , src = UrlSrc "images/lac3.jpg"
                            }
                    }
                , Leaf
                    { attrs = []
                    , id = { classes = Set.fromList [], styleId = Nothing, uid = 8 }
                    , leafContent =
                        TextBlock
                            [ Paragraph []
                                [ Text [] "Établi le long de la Couze Chambon et à l'intersection des routes départementales 5 et 996, le village de Murol se situe en distances orthodromiques, sept kilomètres au nord de Besse-en-Chandesse et seize kilomètres à l'est de La Bourboule."
                                ]
                            , Paragraph []
                                [ Text [] "Le sentier de grande randonnée GR 30 traverse le territoire communal en deux tronçons, du nord-est à l'ouest puis du sud-ouest au sud, sur plus de six kilomètres. "
                                ]
                            ]
                    }
                ]
            ]
        , Node
            { attrs = []
            , id = { classes = Set.fromList [], styleId = Nothing, uid = 5 }
            , nodeLabel = DocColumn
            }
            [ Leaf
                { attrs = []
                , id = { classes = Set.fromList [], styleId = Nothing, uid = 9 }
                , leafContent =
                    Image
                        { caption = Nothing
                        , size =
                            { imgHeight = 250
                            , imgWidth = 333
                            }
                        , src = UrlSrc "images/prélong.jpg"
                        }
                }
            , Leaf
                { attrs = []
                , id = { classes = Set.fromList [], styleId = Nothing, uid = 8 }
                , leafContent =
                    Image
                        { caption = Nothing
                        , size =
                            { imgHeight = 250
                            , imgWidth = 333
                            }
                        , src = UrlSrc "images/museePeintre.jpeg"
                        }
                }
            , Leaf
                { attrs = []
                , id = { classes = Set.fromList [], styleId = Nothing, uid = 7 }
                , leafContent =
                    Image
                        { caption = Nothing
                        , size =
                            { imgHeight = 250
                            , imgWidth = 377
                            }
                        , src = UrlSrc "images/bourg2.jpg"
                        }
                }
            , Leaf
                { attrs = []
                , id = { classes = Set.fromList [], styleId = Nothing, uid = 6 }
                , leafContent =
                    Image
                        { caption = Nothing
                        , size = { imgHeight = 772, imgWidth = 576 }
                        , src = UrlSrc "images/illustration animations estivales.jpg"
                        }
                }
            ]
        , Node
            { attrs = []
            , id =
                { classes = Set.fromList [ "sameHeightImgsRow" ]
                , styleId = Nothing
                , uid = 4
                }
            , nodeLabel = DocRow
            }
            [ Leaf
                { attrs = []
                , id = { classes = Set.fromList [], styleId = Nothing, uid = 8 }
                , leafContent =
                    Image
                        { caption = Nothing
                        , size = { imgHeight = 250, imgWidth = 333 }
                        , src = UrlSrc "images/prélong.jpg"
                        }
                }
            , Leaf
                { attrs = []
                , id = { classes = Set.fromList [], styleId = Nothing, uid = 7 }
                , leafContent =
                    Image
                        { caption = Nothing
                        , size = { imgHeight = 250, imgWidth = 333 }
                        , src = UrlSrc "images/museePeintre.jpeg"
                        }
                }
            , Leaf
                { attrs = []
                , id = { classes = Set.fromList [], styleId = Nothing, uid = 6 }
                , leafContent =
                    Image
                        { caption = Nothing
                        , size = { imgHeight = 250, imgWidth = 377 }
                        , src = UrlSrc "images/bourg2.jpg"
                        }
                }
            , Leaf
                { attrs = []
                , id = { classes = Set.fromList [], styleId = Nothing, uid = 5 }
                , leafContent =
                    Image
                        { caption = Nothing
                        , size =
                            { imgHeight = 772
                            , imgWidth = 576
                            }
                        , src = UrlSrc "images/illustration animations estivales.jpg"
                        }
                }
            ]
        , Leaf
            { attrs = []
            , id = { classes = Set.fromList [], styleId = Nothing, uid = 4 }
            , leafContent =
                TextBlock
                    [ TBPrimitive <|
                        Heading [] ( 1, "Office de Tourisme communautaire du massif du Sancy" )
                    ]
            }
        , Node
            { attrs = []
            , id = { classes = Set.fromList [], styleId = Nothing, uid = 2 }
            , nodeLabel = TextColumn
            }
            [ Leaf
                { attrs = [ AlignLeft ]
                , id = { classes = Set.fromList [], styleId = Nothing, uid = 4 }
                , leafContent =
                    Image
                        { caption = Nothing
                        , size = { imgHeight = 300, imgWidth = 400 }
                        , src = UrlSrc "images/OT.jpg"
                        }
                }
            , Node
                { attrs = [ AlignRight ]
                , id = { classes = Set.fromList [], styleId = Nothing, uid = 3 }
                , nodeLabel = DocColumn
                }
                [ Leaf
                    { attrs = []
                    , id = { classes = Set.fromList [], styleId = Nothing, uid = 5 }
                    , leafContent =
                        Image
                            { caption = Nothing
                            , size = { imgHeight = 167, imgWidth = 125 }
                            , src = UrlSrc "images/sancy_hiver.jpg"
                            }
                    }
                , Leaf
                    { attrs = []
                    , id = { classes = Set.fromList [], styleId = Nothing, uid = 4 }
                    , leafContent =
                        TextBlock
                            [ TBPrimitive <|
                                Link []
                                    { label = "sancy.com"
                                    , targetBlank = True
                                    , url = ""
                                    }
                            ]
                    }
                ]
            ]
        , Node
            { attrs = []
            , id = { classes = Set.fromList [], styleId = Nothing, uid = 1 }
            , nodeLabel = TextColumn
            }
            [ Leaf
                { attrs = []
                , id = { classes = Set.fromList [], styleId = Nothing, uid = 4 }
                , leafContent =
                    TextBlock
                        [ TBPrimitive <|
                            Heading [] ( 3, "Adresse:" )
                        , Paragraph []
                            [ Text [] "Rue de jassaguet - 63790 Murol"
                            ]
                        , Paragraph []
                            [ Text [] "Tel: 04 73 88 62 62"
                            ]
                        , Paragraph []
                            [ Text [] "Fax : 04 73 88 60 23"
                            ]
                        , TBPrimitive <|
                            Heading [] ( 3, "Horaires:" )
                        ]
                }
            , Leaf
                { attrs = []
                , id = { classes = Set.fromList [], styleId = Nothing, uid = 2 }
                , leafContent =
                    Table
                        { style = "bleu-blanc"
                        , nbrRows = 3
                        , nbrCols = 5
                        , data =
                            [ Array.fromList
                                [ "Quotient familial"
                                , "de 0 à 350€"
                                , "de 351 à 500€"
                                , "de 501 à 600€"
                                , "plus de 600€"
                                ]
                            , Array.fromList
                                [ "Tarif maternelle"
                                , "2,10€"
                                , "2,10€"
                                , "2,10€"
                                , "2,10€"
                                ]
                            , Array.fromList
                                [ "Tarif élémentaire"
                                , "2,10€"
                                , "2,10€"
                                , "2,10€"
                                , "2,10€"
                                ]
                            ]
                        }
                }
            ]
        ]
        |> fixUids 0
