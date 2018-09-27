module DummyFileSys exposing (..)

import Dict exposing (..)
import Json.Decode exposing (..)
import Regex exposing (..)


dummyImageList =
    --Dict.fromList
    [ ( "2 Murol, le bourg.jpg", ( 300, 300 ) )
    , ( "automne_bg2.jpg", ( 1920, 1080 ) )
    , ( "automne_bg.jpg", ( 1920, 1080 ) )
    , ( "banner_automne_1149.jpg", ( 1149, 200 ) )
    , ( "banner_automne_1567.jpg", ( 1567, 350 ) )
    , ( "bannerbgf.jpg", ( 1000, 410 ) )
    , ( "bannerbg.jpg", ( 1000, 400 ) )
    , ( "banner.jpg", ( 1000, 400 ) )
    , ( "bannerS.jpg", ( 1000, 410 ) )
    , ( "banner_winter_1149.jpg", ( 1149, 200 ) )
    , ( "banner_winter_1567.jpg", ( 1567, 200 ) )
    , ( "banner_winter2_1149.jpg", ( 1149, 200 ) )
    , ( "banner_winter2_1567.jpg", ( 1567, 200 ) )
    , ( "bgblue.jpg", ( 500, 300 ) )
    , ( "bourg2.jpg", ( 377, 250 ) )
    , ( "bourgHiver.jpg", ( 333, 250 ) )
    , ( "bourg.jpg", ( 333, 250 ) )
    , ( "calendVac.jpg", ( 370, 505 ) )
    , ( "carteZones.jpg", ( 370, 506 ) )
    , ( "Cézallier-Neige-2.jpg", ( 600, 400 ) )
    , ( "chassagne1.jpg", ( 292, 219 ) )
    , ( "chassagne2.jpg", ( 331, 219 ) )
    , ( "chassagne3.jpg", ( 332, 219 ) )
    , ( "chassagne.jpg", ( 400, 246 ) )
    , ( "chateau1.jpg", ( 375, 500 ) )
    , ( "Cloth.jpg", ( 300, 300 ) )
    , ( "drinks.jpg", ( 999, 711 ) )
    , ( "famillePlus.jpg", ( 156, 143 ) )
    , ( "four à pain Beaune.jpg", ( 538, 406 ) )
    , ( "groire1.jpg", ( 300, 225 ) )
    , ( "groire2.jpg", ( 300, 225 ) )
    , ( "groire3.jpg", ( 300, 225 ) )
    , ( "hori2.jpg", ( 300, 240 ) )
    , ( "horizon3.jpg", ( 315, 240 ) )
    , ( "illustration animations estivales.jpg", ( 576, 772 ) )
    , ( "lac1.jpg", ( 333, 250 ) )
    , ( "lac2.jpg", ( 333, 250 ) )
    , ( "lac3.jpg", ( 377, 250 ) )
    , ( "lake.jpg", ( 1840, 537 ) )
    , ( "landscape1920.jpg", ( 1920, 530 ) )
    , ( "Logo_LABEL_FamillePlus_RVB.jpg", ( 200, 183 ) )
    , ( "Mairie.jpg", ( 450, 600 ) )
    , ( "maisonSante.jpg", ( 500, 258 ) )
    , ( "mapBig.jpg", ( 1600, 770 ) )
    , ( "mapSmall.jpg", ( 400, 193 ) )
    , ( "murol vue générale.jpg", ( 640, 459 ) )
    , ( "musée archéologique.jpg", ( 333, 250 ) )
    , ( "OT.jpg", ( 400, 300 ) )
    , ( "panoTartaret.jpg", ( 376, 250 ) )
    , ( "parcoursSportBig.jpg", ( 1187, 869 ) )
    , ( "parcoursSportSmall.jpg", ( 341, 250 ) )
    , ( "picLac01.jpg", ( 345, 210 ) )
    , ( "picLac02.jpg", ( 434, 210 ) )
    , ( "picLac03.jpg", ( 307, 210 ) )
    , ( "prélong.jpg", ( 333, 250 ) )
    , ( "programme2016.jpg", ( 800, 566 ) )
    , ( "rajat.jpg", ( 300, 240 ) )
    , ( "restaurants.jpg", ( 350, 242 ) )
    , ( "routes.jpg", ( 140, 175 ) )
    , ( "sancy_hiver.jpg", ( 125, 167 ) )
    , ( "seismes.jpg", ( 767, 1107 ) )
    , ( "springbanner1149.jpg", ( 1149, 200 ) )
    , ( "springbanner1567.jpg", ( 1567, 200 ) )
    , ( "springbg2017.jpg", ( 3215, 888 ) )
    , ( "Station_Tourisme_RVB.jpg", ( 100, 143 ) )
    , ( "StationVertegf.jpg", ( 150, 143 ) )
    , ( "tartaretBois.jpg", ( 166, 250 ) )
    , ( "trail.jpg", ( 568, 413 ) )
    , ( "Village fleuri.jpg", ( 356, 143 ) )
    , ( "visiteVirt.jpg", ( 200, 160 ) )
    , ( "voie1.jpg", ( 500, 375 ) )
    , ( "voie2.jpg", ( 501, 375 ) )
    , ( "winter_bg.jpg", ( 1920, 523 ) )
    , ( "wtreesbg.jpg", ( 1000, 500 ) )
    , ( "automne_iconbg02.gif", ( 169, 115 ) )
    , ( "automne_iconbg.gif", ( 169, 115 ) )
    , ( "FamillePlus2.gif", ( 100, 92 ) )
    , ( "Mairiebg.gif", ( 483, 600 ) )
    , ( "menubg.gif", ( 50, 50 ) )
    , ( "seismes.gif", ( 790, 1144 ) )
    , ( "winter_iconbgB.gif", ( 169, 115 ) )
    , ( "winter_iconbgS.gif", ( 169, 115 ) )
    , ( "bannerbgf.png", ( 1000, 500 ) )
    , ( "bgLeaf2.png", ( 1400, 500 ) )
    , ( "bgLeafOLD.png", ( 1233, 410 ) )
    , ( "bgLeaf.png", ( 1233, 410 ) )
    , ( "bgLeafwithflowers.png", ( 1400, 500 ) )
    , ( "dicrim.png", ( 200, 127 ) )
    , ( "famillesPlus.png", ( 200, 200 ) )
    , ( "fleurie.png", ( 1058, 793 ) )
    , ( "icon2017blur.png", ( 100, 100 ) )
    , ( "icon2017leaf.png", ( 100, 100 ) )
    , ( "icon2017L.png", ( 100, 100 ) )
    , ( "icon2017.png", ( 100, 100 ) )
    , ( "jachère fleurie.png", ( 962, 721 ) )
    , ( "lake.png", ( 1840, 537 ) )
    , ( "landscapebottomO.png", ( 500, 630 ) )
    , ( "landscapebottom.png", ( 500, 630 ) )
    , ( "logo-chateau-de-murol-800.png", ( 167, 96 ) )
    , ( "logosmurol.png", ( 496, 136 ) )
    , ( "lonelyplanet.png", ( 171, 95 ) )
    , ( "PAVILLON BLEU LOGO 2.png", ( 162, 143 ) )
    , ( "peintres.png", ( 167, 96 ) )
    , ( "Recycling.png", ( 30, 29 ) )
    , ( "snowflake1.png", ( 100, 100 ) )
    , ( "summertopbannerwater.png", ( 1400, 500 ) )
    , ( "Village fleuri.png", ( 356, 143 ) )
    ]



--dummyImageList =
--    [ "Logo_LABEL_FamillePlus_RVB.jpg"
--    , "voie1.jpg"
--    , "Recycling.png"
--    , "cover.,cf"
--    , "bourg.jpg"
--    , "test/Logo_LABEL_FamillePlus_RVB.jpg"
--    , "lake.png"
--    , "famillesPlus.png"
--    , "horizon3.jpg"
--    , "routes.jpg"
--    , "bannerbg.jpg"
--    , "visiteVirt.jpg"
--    , "chassagne.jpg"
--    , "springbanner1567.jpg"
--    , "100_6427.JPG"
--    , "dArrow.jpeg"
--    , "illustration animations estivales.jpg"
--    , "icon2017leaf.png"
--    , "murol vue générale.jpg"
--    , "bgblue.jpg"
--    , "artistes/image14.jpg"
--    , "artistes/FresqueA-2012.jpg"
--    , "artistes/image10.jpg"
--    , "artistes/Claire-Gouttebel.jpg"
--    , "artistes/lavedrine1.jpg"
--    , "artistes/image9.jpg"
--    , "artistes/image11.jpg"
--    , "artistes/image13.jpg"
--    , "artistes/Entete-Marie.jpg"
--    , "artistes/image8.jpg"
--    , "artistes/image15.jpg"
--    , "artistes/image9.jpeg"
--    , "artistes/image3.jpg"
--    , "artistes/image12.jpg"
--    , "artistes/image7.jpg"
--    , "calendVac.jpg"
--    , "Village fleuri.png"
--    , "lake.jpg"
--    , "menubg.gif"
--    , "chassagne1.jpg"
--    , "lac2.jpg"
--    , "OT.jpg"
--    , "prélong.jpg"
--    , "mapBig.jpg"
--    , "double-arrow-pointing-left-direction_318-50564.png.jpeg"
--    , "banner_automne_1567.jpg"
--    , "lac1.jpg"
--    , "winter_iconbgB.gif"
--    , "chassagne3.jpg"
--    , "icon2017blur.png"
--    , "summertopbannerwater.png"
--    , "picLac02.jpg"
--    , "rajat.jpg"
--    , "banner_winter2_1567.jpg"
--    , "four à pain Beaune.jpg"
--    , "elus/DOTTE.jpg"
--    , "elus/GOUTTEBEL.jpg"
--    , "elus/DEBOUT.jpg"
--    , "elus/CATTARELLI.jpg"
--    , "elus/PEROL.jpg"
--    , "elus/ROUX.jpg"
--    , "elus/LANARO.jpg"
--    , "elus/GILLARD.jpg"
--    , "elus/COMPAGNON.jpg"
--    , "elus/DUMONTEL.jpg"
--    , "elus/LAIR.jpg"
--    , "elus/AUBERTY.jpg"
--    , "elus/BOUCHE.jpg"
--    , "elus/MAURY.jpg"
--    , "2 Murol, le bourg.jpg"
--    , "jachère.JPG"
--    , "bannerS.jpg"
--    , "FamillePlus2.gif"
--    , "bulletin/cover.gif"
--    , "bulletin/cover4.png"
--    , "bulletin/cover2.png"
--    , "bulletin/cover6.jpg"
--    , "bulletin/cover3.png"
--    , "bulletin/cover8.jpg"
--    , "bulletin/cover5.png"
--    , "bulletin/BULLETIN 7 définitif-page-001.jpg"
--    , "bulletin/cover1.png"
--    , "bulletin/cover7.jpg"
--    , "bulletin/cover0.png"
--    , "tiles/sortir/chateau.jpg"
--    , "tiles/sortir/salle cinema.jpg"
--    , "tiles/sortir/sortir environs.jpg"
--    , "tiles/sortir/musee.jpg"
--    , "tiles/transports/les dessertes.jpg"
--    , "tiles/transports/déneigement.jpg"
--    , "tiles/transports/navette.jpg"
--    , "tiles/transports/logo-covoiturage.jpg"
--    , "tiles/elections/01.jpg"
--    , "tiles/elections/02.jpg"
--    , "tiles/elections/03.jpg"
--    , "tiles/seniors/SIVOM.jpg"
--    , "tiles/seniors/autres.jpg"
--    , "tiles/seniors/info.jpg"
--    , "tiles/decouvrirMurol/murolTile.jpg"
--    , "tiles/decouvrirMurol/beauneTile.jpg"
--    , "tiles/decouvrirMurol/cheminTile.jpg"
--    , "tiles/decouvrirMurol/rajatTile.jpg"
--    , "tiles/decouvrirMurol/groireTile.jpg"
--    , "tiles/decouvrirMurol/tartaretTile.jpg"
--    , "tiles/decouvrirMurol/lacChambonTile.jpg"
--    , "tiles/decouvrirMurol/chassagneTile.jpg"
--    , "tiles/decouvrirMurol/chautignatTile.jpg"
--    , "tiles/decouvrirMurol/chateauTile.jpg"
--    , "tiles/hebergements/meuble.jpg"
--    , "tiles/hebergements/test.,cf"
--    , "tiles/hebergements/placeholder.jpg"
--    , "tiles/hebergements/famillePlus.jpg"
--    , "tiles/hebergements/villageVac.jpg"
--    , "tiles/hebergements/chambresHotes.jpg"
--    , "tiles/hebergements/hotels.jpg"
--    , "tiles/hebergements/campings.jpg"
--    , "tiles/photothèque/diaporama2016.jpg"
--    , "tiles/photothèque/journeeMurolais.jpg"
--    , "tiles/photothèque/diaporama2015.jpg"
--    , "tiles/photothèque/patrimoine.jpg"
--    , "tiles/photothèque/revolution.jpg"
--    , "tiles/photothèque/diaporama2017.jpg"
--    , "tiles/photothèque/printempsEte.jpg"
--    , "tiles/photothèque/annee2018.jpg"
--    , "tiles/photothèque/medievales.jpg"
--    , "tiles/photothèque/automneHiver.jpg"
--    , "tiles/photothèque/annee2017.jpg"
--    , "tiles/photothèque/festival.jpg"
--    , "tiles/photothèque/festivalArt.jpg"
--    , "tiles/photothèque/annee2016.jpg"
--    , "tiles/misc/ASSOC CULTURE.jpg"
--    , "tiles/misc/ASSOC PRO.jpg"
--    , "tiles/misc/ASSOC SPORT.jpg"
--    , "tiles/misc/salle des fêtes Murol.jpg"
--    , "tiles/misc/salle de Beaune.jpg"
--    , "tiles/animation/medievales.jpg"
--    , "tiles/animation/festivalArt.jpg"
--    , "tiles/animation/orig/medievales.jpg"
--    , "tiles/animation/orig/festivalArt.jpg"
--    , "tiles/animation/orig/feu d'artifice.jpg"
--    , "tiles/animation/orig/horizon.jpg"
--    , "tiles/animation/orig/animation estivale.jpg"
--    , "tiles/animation/orig/e,poMusée.jpg"
--    , "tiles/animation/feu d'artifice.jpg"
--    , "tiles/animation/horizon.jpg"
--    , "tiles/animation/animation estivale.jpg"
--    , "tiles/animation/done/medievales.jpg"
--    , "tiles/animation/done/festivalArt.jpg"
--    , "tiles/animation/done/feu d'artifice.jpg"
--    , "tiles/animation/done/horizon.jpg"
--    , "tiles/animation/done/animation estivale.jpg"
--    , "tiles/animation/done/e,poMusée.jpg"
--    , "tiles/animation/e,poMusée.jpg"
--    , "tiles/periscolaire/actiJeunesse.jpg"
--    , "tiles/periscolaire/garderie.jpg"
--    , "tiles/periscolaire/centre de loisirs.jpg"
--    , "tiles/periscolaire/restaurant scolaire.jpg"
--    , "tiles/periscolaire/TAP.jpg"
--    , "tiles/periscolaire/navette.jpg"
--    , "tiles/restaurants/restaurants.jpg"
--    , "tiles/restaurants/drinks.jpg"
--    , "tiles/environnement/risques.jpg"
--    , "tiles/environnement/eau.jpg"
--    , "tiles/environnement/dechets.jpg"
--    , "tiles/environnement/orig/risques.jpg"
--    , "tiles/environnement/orig/eau.jpg"
--    , "tiles/environnement/orig/dechets.jpg"
--    , "tiles/environnement/orig/devDurable.jpg"
--    , "tiles/environnement/orig/millieu,Sensibles.jpg"
--    , "tiles/environnement/orig/espacesVerts.jpg"
--    , "tiles/environnement/devDurable.jpg"
--    , "tiles/environnement/millieu,Sensibles.jpg"
--    , "tiles/environnement/done/risques.jpg"
--    , "tiles/environnement/done/eau.jpg"
--    , "tiles/environnement/done/dechets.jpg"
--    , "tiles/environnement/done/devDurable.jpg"
--    , "tiles/environnement/done/millieu,Sensibles.jpg"
--    , "tiles/environnement/done/espacesVerts.jpg"
--    , "tiles/environnement/espacesVerts.jpg"
--    , "voie2.jpg"
--    , "winter_iconbgS.gif"
--    , "trail.jpg"
--    , "logo-chateau-de-murol-800.png"
--    , "peintres.png"
--    , "chateau1.jpg"
--    , "musée archéologique.jpg"
--    , "carteZones.jpg"
--    , "bannerbgf.jpg"
--    , "picLac03.jpg"
--    , "winter_bg.jpg"
--    , "banner.jpg"
--    , "bourgHiver.jpg"
--    , "Station_Tourisme_RVB.jpg"
--    , "lonelyplanet.png"
--    , "picLac01.jpg"
--    , "springbg2017.jpg"
--    , "icon2017L.png"
--    , "groire3.jpg"
--    , "StationVertegf.jpg"
--    , "famillePlus.jpg"
--    , "fleurie.png"
--    , "tmp/bgblue.jpg"
--    , "tmp/fleurie.png"
--    , "tmp/landscapebottomO.png"
--    , "tmp/landscape1920.jpg"
--    , "tmp/landscapebottom.png"
--    , "mapSmall.jpg"
--    , "automne_iconbg.gif"
--    , "Village fleuri.jpg"
--    , "Mairie.jpg"
--    , "news/lonely.png"
--    , "news/PAVILLON BLEU LOGO 2.png"
--    , "maisonSante.jpg"
--    , "bgLeaf.png"
--    , "banner_automne_1149.jpg"
--    , "springbanner1149.jpg"
--    , "museePeintre.jpeg"
--    , "landscapebottomO.png"
--    , "IMGP6178.JPG"
--    , "banner_winter2_1149.jpg"
--    , "bannerbgf.png"
--    , "restaurants.jpg"
--    , "parcoursSportSmall.jpg"
--    , "Cloth.jpg"
--    , "drinks.jpg"
--    , "seismes.jpg"
--    , "uArrow.jpeg"
--    , "Mairiebg.gif"
--    , "lac3.jpg"
--    , "snowflake1.png"
--    , "banner_winter_1567.jpg"
--    , "programme2016.jpg"
--    , "seismes.gif"
--    , "PAVILLON BLEU LOGO 2.png"
--    , "memoImageMagick"
--    , "sancy_hiver.jpg"
--    , "landscape1920.jpg"
--    , "icon2017.png"
--    , "repl-temp-000.elm"
--    , "logosmurol.png"
--    , "bgLeafwithflowers.png"
--    , "panoTartaret.jpg"
--    , "groire1.jpg"
--    , "bgLeafOLD.png"
--    , "landscapebottom.png"
--    , "Cézallier-Neige-2.jpg"
--    , "automne_bg.jpg"
--    , "automne_bg2.jpg"
--    , "parcoursSportBig.jpg"
--    , "bourg2.jpg"
--    , "banner_winter_1149.jpg"
--    , "automne_iconbg02.gif"
--    , "chassagne2.jpg"
--    , "dicrim.png"
--    , "groire2.jpg"
--    , "tartaretBois.jpg"
--    , "hori2.jpg"
--    , "jachère fleurie.png"
--    , "bgLeaf2.png"
--    , "wtreesbg.jpg"
--    ]
