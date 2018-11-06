module Main exposing (..)


errors =
    [ ( { adresse = "Beaune-le-Froid - 63790 MUROL"
        , categories = [ "Commerce" ]
        , description = [ "Randonnées pédestres guidées et raquettes à neige en hiver" ]
        , email = []
        , fax = Nothing
        , label = []
        , natureActiv = [ "Prestataires" ]
        , nomEntite = "Auvergne Escapade"
        , ouverture = Just TteAnnee
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Nothing }
        , refOt = Just ( 4716925, "https://www.sancy.com/commerce-service/auvergne-escapade/" )
        , responsables = []
        , site = Just "http://www.auvergne-escapade.com/"
        , telNumber = Just (TelPortable "06 86 89 34 87")
        , uuid = UUID [ 47, 126, 243, 62, 172, 21, 79, 90, 153, 201, 118, 255, 72, 82, 139, 157 ]
        , visuel = ""
        }
      , { adresse = "Beaune-le-Froid 63790 Murol"
        , categories = [ "Association", "Association" ]
        , description = [ "Accompagnateurs en montagne" ]
        , email = [ "info@auvergne-escapade.com" ]
        , fax = Nothing
        , label = []
        , natureActiv = [ "Professionnel", "Sport" ]
        , nomEntite = "Auvergne Escapade"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Nothing }
        , refOt = Nothing
        , responsables = [ { nom = "Jean Luc Ranvier", poste = "Président", tel = TelFixe "04 73 88 85 78 - 06 86 89 34 87" } ]
        , site = Just "http://www.auvergne-escapade.com"
        , telNumber = Nothing
        , uuid = UUID [ 251, 222, 180, 105, 74, 148, 73, 108, 171, 137, 136, 201, 87, 146, 64, 65 ]
        , visuel = ""
        }
      )
    , ( { adresse = "Rue du Tartaret - 63790 MUROL"
        , categories = [ "Hébergements" ]
        , description = [ "6 appartements 2 à 4 personnes", "Contact: Mme GONTELLE Fanny" ]
        , email = [ "residencedemichele@orange.fr" ]
        , fax = Nothing
        , label = []
        , natureActiv = [ "Meublés" ]
        , nomEntite = "Résidence de Michèle"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Nothing }
        , refOt = Nothing
        , responsables = []
        , site = Just "http://residencedemichele.monsite-orange.fr"
        , telNumber = Just (TelBoth ( "04 73 88 68 68", "06 22 33 41 13" ))
        , uuid = UUID [ 51, 58, 61, 113, 121, 209, 71, 248, 140, 169, 15, 204, 235, 183, 201, 64 ]
        , visuel = ""
        }
      , { adresse = "Rue du Tartaret - 63790 MUROL"
        , categories = [ "Hébergements" ]
        , description = [ "Appartement 2 à 4 personnes", "Contact: Mme GONTELLE Fanny" ]
        , email = [ "residencedemichele@orange.fr" ]
        , fax = Nothing
        , label = []
        , natureActiv = [ "Meublés" ]
        , nomEntite = "Résidence de Michèle"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Just 3 }
        , refOt = Nothing
        , responsables = []
        , site = Just "http://residencedemichele.monsite-orange.fr"
        , telNumber = Just (TelBoth ( "04 73 88 68 68", "06 22 33 41 13" ))
        , uuid = UUID [ 150, 136, 183, 73, 157, 39, 75, 152, 137, 46, 185, 196, 224, 188, 19, 16 ]
        , visuel = ""
        }
      )
    , ( { adresse = "Groire – 63790 MUROL"
        , categories = [ "Hébergements" ]
        , description = [ "Studio 2 personnes", "Contact: M. HENRY Christian" ]
        , email = [ "henrymurol@orange.fr" ]
        , fax = Nothing
        , label = []
        , natureActiv = [ "Meublés" ]
        , nomEntite = "La Christaline"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Nothing }
        , refOt = Just ( 1453, "http://www.sancy.com/hebergements/detail/1453/murol/la-christaline" )
        , responsables = []
        , site = Just "http://murolsejourplus.wifeo.com"
        , telNumber = Just (TelFixe "04 73 88 66 19/ 05 63 75 45 24/ 06 87 97 35 40")
        , uuid = UUID [ 55, 219, 12, 103, 62, 116, 72, 40, 141, 95, 244, 93, 163, 242, 154, 239 ]
        , visuel = ""
        }
      , { adresse = "Groire – 63790 MUROL"
        , categories = [ "Hébergements" ]
        , description = [ "Appartement 5 personnes", "Contact: M. HENRY Christian" ]
        , email = [ "henrymurol@orange.fr" ]
        , fax = Nothing
        , label = []
        , natureActiv = [ "Meublés" ]
        , nomEntite = "La Christaline"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Nothing }
        , refOt = Just ( 6586, "http://www.sancy.com/hebergements/detail/6586/murol/la-christaline" )
        , responsables = []
        , site = Just "http://murolsejourplus.wifeo.com"
        , telNumber = Just (TelFixe "04 73 88 66 19/ 05 63 75 45 24/ 06 87 97 35 40")
        , uuid = UUID [ 216, 247, 154, 206, 210, 19, 67, 238, 154, 139, 66, 33, 109, 91, 13, 133 ]
        , visuel = ""
        }
      )
    , ( { adresse = "Beaune-le-Froid - 63790 MUROL"
        , categories = [ "Hébergements" ]
        , description = [ "Maison mitoyenne 4 personnes", "Contact: M. ROUX André" ]
        , email = []
        , fax = Nothing
        , label = []
        , natureActiv = [ "Meublés" ]
        , nomEntite = "Villa Roux"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Just 2 }
        , refOt = Just ( 2800985, "https://www.sancy.com/meubles-gites/villa-roux-2/" )
        , responsables = []
        , site = Nothing
        , telNumber = Just (TelFixe "04 73 87 51 47")
        , uuid = UUID [ 107, 55, 62, 197, 233, 193, 64, 184, 137, 94, 169, 245, 78, 157, 181, 186 ]
        , visuel = ""
        }
      , { adresse = "Beaune-le-Froid - 63790 MUROL"
        , categories = [ "Hébergements" ]
        , description = [ "Maison mitoyenne 5 personnes", "Contact: M. ROUX André" ]
        , email = []
        , fax = Nothing
        , label = []
        , natureActiv = [ "Meublés" ]
        , nomEntite = "Villa Roux"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Just 1 }
        , refOt = Just ( 2880170, "https://www.sancy.com/meubles-gites/villa-roux-3/" )
        , responsables = []
        , site = Nothing
        , telNumber = Just (TelFixe "04 73 87 51 47")
        , uuid = UUID [ 173, 242, 186, 223, 16, 86, 71, 95, 150, 34, 60, 25, 49, 199, 36, 148 ]
        , visuel = ""
        }
      )
    , ( { adresse = "Beaune-le-Froid - 63790 MUROL"
        , categories = [ "Hébergements" ]
        , description = [ "Maison mitoyenne 6 personnes", "Contact: M. ROUX André" ]
        , email = []
        , fax = Nothing
        , label = []
        , natureActiv = [ "Meublés" ]
        , nomEntite = "Villa Roux"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Just 2 }
        , refOt = Just ( 2800984, "https://www.sancy.com/meubles-gites/villa-roux/" )
        , responsables = []
        , site = Nothing
        , telNumber = Just (TelFixe "04 73 87 51 47")
        , uuid = UUID [ 166, 145, 139, 29, 244, 203, 68, 169, 153, 136, 57, 33, 5, 70, 104, 114 ]
        , visuel = ""
        }
      , { adresse = "Beaune-le-Froid - 63790 MUROL"
        , categories = [ "Hébergements" ]
        , description = [ "Maison mitoyenne 5 personnes", "Contact: M. ROUX André" ]
        , email = []
        , fax = Nothing
        , label = []
        , natureActiv = [ "Meublés" ]
        , nomEntite = "Villa Roux"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Just 1 }
        , refOt = Just ( 2880170, "https://www.sancy.com/meubles-gites/villa-roux-3/" )
        , responsables = []
        , site = Nothing
        , telNumber = Just (TelFixe "04 73 87 51 47")
        , uuid = UUID [ 173, 242, 186, 223, 16, 86, 71, 95, 150, 34, 60, 25, 49, 199, 36, 148 ]
        , visuel = ""
        }
      )
    , ( { adresse = "Route de Groire - 63790 MUROL"
        , categories = [ "Hébergements" ]
        , description = [ "4 personnes", "Contact: M. & Mme DELPEUX Annie et François" ]
        , email = []
        , fax = Nothing
        , label = []
        , natureActiv = [ "Meublés" ]
        , nomEntite = "La Clé des champs"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Just 2 }
        , refOt = Just ( 4622644, "https://www.sancy.com/meubles-gites/la-cle-des-champs/" )
        , responsables = []
        , site = Nothing
        , telNumber = Just (TelBoth ( "04 73 88 66 29 -", "06 21 49 42 94 - 06 77 11 62 06" ))
        , uuid = UUID [ 175, 90, 143, 250, 106, 41, 69, 171, 159, 24, 144, 247, 127, 8, 223, 61 ]
        , visuel = ""
        }
      , { adresse = "Route de Groire - 63790 MUROL"
        , categories = [ "Hébergements" ]
        , description = []
        , email = []
        , fax = Nothing
        , label = []
        , natureActiv = [ "Chambre d'hotes" ]
        , nomEntite = "La Clé des champs"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Just 2 }
        , refOt = Just ( 921341, "https://www.sancy.com/chambre-hotes/la-cle-des-champs/" )
        , responsables = []
        , site = Nothing
        , telNumber = Just (TelBoth ( "04 73 88 66 29", "06 21 49 42 94" ))
        , uuid = UUID [ 208, 122, 154, 249, 246, 235, 70, 253, 132, 216, 214, 37, 238, 99, 65, 242 ]
        , visuel = ""
        }
      )
    , ( { adresse = "mairie de Murol Adresse : BP11 63790 MUROL"
        , categories = [ "Association" ]
        , description = [ "activités sportives de pleine nature grand public" ]
        , email = [ "bertrandgoimard@hotmail.com", "contact@guides-asv.com" ]
        , fax = Nothing
        , label = []
        , natureActiv = [ "Sport" ]
        , nomEntite = "Bureau Montagne Auvergne Sancy Volcans"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Nothing }
        , refOt = Nothing
        , responsables = [ { nom = "Alexandre PRUNYI", poste = "Président", tel = TelFixe "" } ]
        , site = Nothing
        , telNumber = Nothing
        , uuid = UUID [ 177, 115, 142, 49, 122, 87, 75, 158, 188, 8, 87, 191, 231, 144, 163, 79 ]
        , visuel = ""
        }
      , { adresse = "Bp 11 - 63790 MUROL"
        , categories = [ "Commerce" ]
        , description = [ "Raquettes à neige. Randonnées sur les volcans, lever de soleil, orientation, VTT, astronomie, tir à l'arc." ]
        , email = []
        , fax = Nothing
        , label = []
        , natureActiv = [ "Prestataires" ]
        , nomEntite = "Bureau Montagne Auvergne Sancy Volcans"
        , ouverture = Just TteAnnee
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Nothing }
        , refOt = Just ( 4716923, "https://www.sancy.com/commerce-service/bureau-montagne-auvergne-sancy-volcans/" )
        , responsables = []
        , site = Just "http://www.bureaumontagne.com/"
        , telNumber = Just (TelPortable "06 41 66 90 80")
        , uuid = UUID [ 248, 189, 171, 50, 28, 200, 71, 16, 140, 198, 9, 202, 210, 148, 225, 193 ]
        , visuel = ""
        }
      )
    , ( { adresse = "mairie de Murol Adresse : BP11 63790 MUROL"
        , categories = [ "Association" ]
        , description = [ "activités sportives de pleine nature grand public" ]
        , email = [ "bertrandgoimard@hotmail.com", "contact@guides-asv.com" ]
        , fax = Nothing
        , label = []
        , natureActiv = [ "Professionnel" ]
        , nomEntite = "Bureau Montagne Auvergne Sancy Volcans"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Nothing }
        , refOt = Nothing
        , responsables = [ { nom = "Alexandre PRUNYI", poste = "Président", tel = TelFixe "" } ]
        , site = Nothing
        , telNumber = Nothing
        , uuid = UUID [ 195, 252, 11, 48, 120, 63, 70, 78, 179, 27, 103, 48, 13, 173, 223, 46 ]
        , visuel = ""
        }
      , { adresse = "Bp 11 - 63790 MUROL"
        , categories = [ "Commerce" ]
        , description = [ "Raquettes à neige. Randonnées sur les volcans, lever de soleil, orientation, VTT, astronomie, tir à l'arc." ]
        , email = []
        , fax = Nothing
        , label = []
        , natureActiv = [ "Prestataires" ]
        , nomEntite = "Bureau Montagne Auvergne Sancy Volcans"
        , ouverture = Just TteAnnee
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Nothing }
        , refOt = Just ( 4716923, "https://www.sancy.com/commerce-service/bureau-montagne-auvergne-sancy-volcans/" )
        , responsables = []
        , site = Just "http://www.bureaumontagne.com/"
        , telNumber = Just (TelPortable "06 41 66 90 80")
        , uuid = UUID [ 248, 189, 171, 50, 28, 200, 71, 16, 140, 198, 9, 202, 210, 148, 225, 193 ]
        , visuel = ""
        }
      )
    ]


doublons =
    [ ( { adresse = ""
        , categories = [ "Association" ]
        , description = [ "organisation de forums associatifs" ]
        , email = [ "lecosa63@gmail.com" ]
        , fax = Nothing
        , label = []
        , natureActiv = [ "Sport" ]
        , nomEntite = "COSA63"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Nothing }
        , refOt = Nothing
        , responsables = [ { nom = "Anne-marie DOTTE", poste = "Contact", tel = TelPortable "06 81 00 20 32" }, { nom = "Elisabeth CROZET", poste = "Contact", tel = TelPortable "06 30 03 80 69" } ]
        , site = Nothing
        , telNumber = Nothing
        , uuid = UUID [ 5, 67, 145, 1, 91, 6, 66, 65, 157, 177, 70, 167, 49, 97, 172, 62 ]
        , visuel = ""
        }
      , { adresse = ""
        , categories = [ "Association" ]
        , description = [ "organisation de forums associatifs" ]
        , email = [ "lecosa63@gmail.com" ]
        , fax = Nothing
        , label = []
        , natureActiv = [ "Culture, Evénementiel, Solidarité" ]
        , nomEntite = "COSA63"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Nothing }
        , refOt = Nothing
        , responsables = [ { nom = "Anne-marie DOTTE", poste = "Contact", tel = TelPortable "06 81 00 20 32" }, { nom = "Elisabeth CROZET", poste = "Contact", tel = TelPortable "06 30 03 80 69" } ]
        , site = Nothing
        , telNumber = Nothing
        , uuid = UUID [ 56, 5, 57, 164, 156, 25, 65, 193, 147, 128, 178, 131, 188, 161, 238, 136 ]
        , visuel = ""
        }
      )
    , ( { adresse = "Mairie de Murol BP 11- 63 790 MUROL "
        , categories = [ "Association" ]
        , description = [ "éducation à l’environnement des scolaires, organisation de classes de découvertes" ]
        , email = [ "contact@element-terre.org" ]
        , fax = Nothing
        , label = []
        , natureActiv = [ "Professionnel" ]
        , nomEntite = "Elément Terre"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Nothing }
        , refOt = Nothing
        , responsables = [ { nom = "Claire FAYE", poste = "Présidente", tel = TelFixe "" } ]
        , site = Just "http://www.element-terre.org"
        , telNumber = Nothing
        , uuid = UUID [ 120, 69, 152, 201, 111, 87, 78, 213, 138, 85, 31, 250, 251, 49, 157, 198 ]
        , visuel = ""
        }
      , { adresse = "Mairie de Murol BP 11- 63 790 MUROL "
        , categories = [ "Association" ]
        , description = [ "éducation à l’environnement des scolaires, organisation de classes de découvertes" ]
        , email = [ "contact@element-terre.org" ]
        , fax = Nothing
        , label = []
        , natureActiv = [ "Culture, Evénementiel, Solidarité" ]
        , nomEntite = "Elément Terre"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Nothing }
        , refOt = Nothing
        , responsables = [ { nom = "Claire FAYE", poste = "Présidente", tel = TelFixe "" } ]
        , site = Just "http://www.element-terre.org"
        , telNumber = Nothing
        , uuid = UUID [ 204, 192, 180, 158, 192, 20, 69, 87, 190, 15, 190, 160, 102, 102, 45, 245 ]
        , visuel = ""
        }
      )
    , ( { adresse = "Beaune-le-Froid 63790 MUROL"
        , categories = [ "Association" ]
        , description = [ "activité ski de fond" ]
        , email = [ "yannick-latreille@hotmail.fr" ]
        , fax = Nothing
        , label = []
        , natureActiv = [ "Sport" ]
        , nomEntite = "Association culturelle et sportive de Beaune-le-froid"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Nothing }
        , refOt = Nothing
        , responsables = [ { nom = "Yannick LATREILLE", poste = "Président", tel = TelFixe "04 73 88 81 18" } ]
        , site = Nothing
        , telNumber = Nothing
        , uuid = UUID [ 139, 161, 132, 186, 49, 113, 78, 131, 180, 229, 90, 16, 129, 233, 38, 31 ]
        , visuel = ""
        }
      , { adresse = "Beaune-le-Froid 63790 MUROL"
        , categories = [ "Association" ]
        , description = [ "activité ski de fond" ]
        , email = [ "yannick-latreille@hotmail.fr" ]
        , fax = Nothing
        , label = []
        , natureActiv = [ "Culture, Evénementiel, Solidarité" ]
        , nomEntite = "Association culturelle et sportive de Beaune-le-froid"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Nothing }
        , refOt = Nothing
        , responsables = [ { nom = "Yannick LATREILLE", poste = "Président", tel = TelFixe "04 73 88 81 18" } ]
        , site = Nothing
        , telNumber = Nothing
        , uuid = UUID [ 248, 88, 109, 32, 235, 126, 64, 110, 151, 107, 239, 4, 115, 70, 49, 95 ]
        , visuel = ""
        }
      )
    , ( { adresse = "Beaune-le-Froid 63790 Murol"
        , categories = [ "Association" ]
        , description = [ "Accompagnateurs en montagne" ]
        , email = [ "info@auvergne-escapade.com" ]
        , fax = Nothing
        , label = []
        , natureActiv = [ "Sport" ]
        , nomEntite = "Auvergne Escapade"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Nothing }
        , refOt = Nothing
        , responsables = [ { nom = "Jean Luc Ranvier", poste = "Président", tel = TelFixe "04 73 88 85 78 - 06 86 89 34 87" } ]
        , site = Just "http://www.auvergne-escapade.com"
        , telNumber = Nothing
        , uuid = UUID [ 228, 164, 72, 188, 12, 14, 70, 247, 189, 10, 196, 144, 155, 17, 65, 178 ]
        , visuel = ""
        }
      , { adresse = "Beaune-le-Froid 63790 Murol"
        , categories = [ "Association" ]
        , description = [ "Accompagnateurs en montagne" ]
        , email = [ "info@auvergne-escapade.com" ]
        , fax = Nothing
        , label = []
        , natureActiv = [ "Professionnel" ]
        , nomEntite = "Auvergne Escapade"
        , ouverture = Nothing
        , pjaun = Nothing
        , rank = { epis = Nothing, stars = Nothing }
        , refOt = Nothing
        , responsables = [ { nom = "Jean Luc Ranvier", poste = "Président", tel = TelFixe "04 73 88 85 78 - 06 86 89 34 87" } ]
        , site = Just "http://www.auvergne-escapade.com"
        , telNumber = Nothing
        , uuid = UUID [ 251, 222, 180, 105, 74, 148, 73, 108, 171, 137, 136, 201, 87, 146, 64, 65 ]
        , visuel = ""
        }
      )
    ]
