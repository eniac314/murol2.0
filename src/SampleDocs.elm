module SampleDocs exposing (..)

import Array exposing (fromList)
import Document exposing (..)
import DocumentEditorHelpers exposing (fixUids)
import Element exposing (centerX, fill, height, layout, maximum, px, width)
import Html.Attributes as Attr
import Set exposing (..)


sampleDoc1 : Document
sampleDoc1 =
    Container
        { attrs = []
        , id = { classes = Set.fromList [], htmlId = Just "mainContainer", docStyleId = Just "root", uid = 0 }
        , containerLabel = DocColumn
        }
        [ Cell
            { attrs = []
            , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 8 }
            , cellContent =
                TextBlock
                    [ TBPrimitive (Heading [] ( 1, "Découvrir Murol" ))
                    , TBPrimitive (Heading [] ( 2, "Le bourg de Murol" ))
                    ]
            }
        , Container
            { attrs = []
            , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 6 }
            , containerLabel = TextColumn
            }
            [ Cell
                { attrs = [ AlignLeft ]
                , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 14 }
                , cellContent = Image { caption = Nothing, size = { imgHeight = 300, imgWidth = 300 }, src = UrlSrc "images/2 Murol, le bourg.jpg" }
                }
            , Cell
                { attrs = [ AlignRight ]
                , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 13 }
                , cellContent =
                    Image
                        { caption = Nothing
                        , size = { imgHeight = 772, imgWidth = 576 }
                        , src = UrlSrc "images/illustration animations estivales.jpg"
                        }
                }
            , Cell
                { attrs = []
                , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 8 }
                , cellContent =
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
            , Container
                { attrs = []
                , id = { classes = Set.fromList [ "sameHeightImgsRow" ], htmlId = Nothing, docStyleId = Nothing, uid = 8 }
                , containerLabel = DocRow
                }
                [ Cell
                    { attrs = []
                    , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 13 }
                    , cellContent =
                        Image
                            { caption = Nothing
                            , size =
                                { imgHeight = 143
                                , imgWidth = 156
                                }
                            , src = UrlSrc "images/famillePlus.jpg"
                            }
                    }
                , Cell
                    { attrs = []
                    , id =
                        { classes =
                            Set.fromList []
                        , htmlId = Nothing
                        , docStyleId = Nothing
                        , uid = 12
                        }
                    , cellContent =
                        Image
                            { caption = Nothing
                            , size =
                                { imgHeight = 143
                                , imgWidth = 100
                                }
                            , src = UrlSrc "images/Station_Tourisme_RVB.jpg"
                            }
                    }
                , Cell
                    { attrs = []
                    , id =
                        { classes =
                            Set.fromList []
                        , htmlId = Nothing
                        , docStyleId = Nothing
                        , uid = 11
                        }
                    , cellContent =
                        Image
                            { caption = Nothing
                            , size =
                                { imgHeight = 143
                                , imgWidth = 356
                                }
                            , src = UrlSrc "images/Village fleuri.png"
                            }
                    }
                , Cell
                    { attrs = []
                    , id =
                        { classes =
                            Set.fromList []
                        , htmlId = Nothing
                        , docStyleId = Nothing
                        , uid = 10
                        }
                    , cellContent =
                        Image
                            { caption = Nothing
                            , size =
                                { imgHeight = 143
                                , imgWidth = 150
                                }
                            , src = UrlSrc "images/StationVertegf.jpg"
                            }
                    }
                , Cell
                    { attrs = []
                    , id =
                        { classes =
                            Set.fromList [ "rowImg" ]
                        , htmlId = Nothing
                        , docStyleId = Nothing
                        , uid = 9
                        }
                    , cellContent =
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
            , Container
                { attrs = []
                , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 7 }
                , containerLabel = DocColumn
                }
                [ Cell
                    { attrs = []
                    , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 8 }
                    , cellContent =
                        TextBlock
                            [ Paragraph []
                                [ Text [] "L'altitude minimale, 785 mètres, se trouve à l'est, au lieu-dit les Chazeaux, là où la Couze Chambon quitte le territoire communal et entre sur celui de Saint-Nectaire. L'altitude maximale avec 1 500 mètres est localisée au nord-ouest, sur les pentes nord du puy de la Croix-Morand, en limite de la commune de Chambon-sur-Lac. "
                                ]
                            ]
                    }
                , Cell
                    { attrs = []
                    , id =
                        { classes = Set.fromList []
                        , htmlId = Nothing
                        , docStyleId = Nothing
                        , uid = 10
                        }
                    , cellContent =
                        Image
                            { caption = Nothing
                            , size = { imgHeight = 250, imgWidth = 377 }
                            , src = UrlSrc "images/lac3.jpg"
                            }
                    }
                , Cell
                    { attrs = []
                    , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 8 }
                    , cellContent =
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
        , Container
            { attrs = []
            , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 5 }
            , containerLabel = DocColumn
            }
            [ Cell
                { attrs = []
                , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 9 }
                , cellContent =
                    Image
                        { caption = Nothing
                        , size =
                            { imgHeight = 250
                            , imgWidth = 333
                            }
                        , src = UrlSrc "images/prélong.jpg"
                        }
                }
            , Cell
                { attrs = []
                , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 8 }
                , cellContent =
                    Image
                        { caption = Nothing
                        , size =
                            { imgHeight = 250
                            , imgWidth = 333
                            }
                        , src = UrlSrc "images/museePeintre.jpeg"
                        }
                }
            , Cell
                { attrs = []
                , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 7 }
                , cellContent =
                    Image
                        { caption = Nothing
                        , size =
                            { imgHeight = 250
                            , imgWidth = 377
                            }
                        , src = UrlSrc "images/bourg2.jpg"
                        }
                }
            , Cell
                { attrs = []
                , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 6 }
                , cellContent =
                    Image
                        { caption = Nothing
                        , size = { imgHeight = 772, imgWidth = 576 }
                        , src = UrlSrc "images/illustration animations estivales.jpg"
                        }
                }
            ]
        , Container
            { attrs = []
            , id =
                { classes = Set.fromList [ "sameHeightImgsRow" ]
                , htmlId = Nothing
                , docStyleId = Nothing
                , uid = 4
                }
            , containerLabel = DocRow
            }
            [ Cell
                { attrs = []
                , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 8 }
                , cellContent =
                    Image
                        { caption = Nothing
                        , size = { imgHeight = 250, imgWidth = 333 }
                        , src = UrlSrc "images/prélong.jpg"
                        }
                }
            , Cell
                { attrs = []
                , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 7 }
                , cellContent =
                    Image
                        { caption = Nothing
                        , size = { imgHeight = 250, imgWidth = 333 }
                        , src = UrlSrc "images/museePeintre.jpeg"
                        }
                }
            , Cell
                { attrs = []
                , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 6 }
                , cellContent =
                    Image
                        { caption = Nothing
                        , size = { imgHeight = 250, imgWidth = 377 }
                        , src = UrlSrc "images/bourg2.jpg"
                        }
                }
            , Cell
                { attrs = []
                , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 5 }
                , cellContent =
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
        , Cell
            { attrs = []
            , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 4 }
            , cellContent =
                TextBlock
                    [ TBPrimitive <|
                        Heading [] ( 1, "Office de Tourisme communautaire du massif du Sancy" )
                    ]
            }
        , Container
            { attrs = []
            , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 2 }
            , containerLabel = TextColumn
            }
            [ Cell
                { attrs = [ AlignLeft ]
                , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 4 }
                , cellContent =
                    Image
                        { caption = Nothing
                        , size = { imgHeight = 300, imgWidth = 400 }
                        , src = UrlSrc "images/OT.jpg"
                        }
                }
            , Container
                { attrs = [ AlignRight ]
                , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 3 }
                , containerLabel = DocColumn
                }
                [ Cell
                    { attrs = []
                    , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 5 }
                    , cellContent =
                        Image
                            { caption = Nothing
                            , size = { imgHeight = 167, imgWidth = 125 }
                            , src = UrlSrc "images/sancy_hiver.jpg"
                            }
                    }
                , Cell
                    { attrs = []
                    , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 4 }
                    , cellContent =
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
        , Container
            { attrs = []
            , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 1 }
            , containerLabel = TextColumn
            }
            [ Cell
                { attrs = []
                , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 4 }
                , cellContent =
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
            , Cell
                { attrs = []
                , id = { classes = Set.fromList [], htmlId = Nothing, docStyleId = Nothing, uid = 2 }
                , cellContent =
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
