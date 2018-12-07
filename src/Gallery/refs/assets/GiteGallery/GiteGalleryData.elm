module GiteGallery.GiteGalleryData exposing (blocs)

import Color
import Dict exposing (..)
import Element exposing (..)
import Element.Attributes exposing (..)
import Element.Events exposing (..)
import Element.Input as Input
import GiteGallery.MultLangText exposing (..)
import GiteGallery.Streams exposing (..)
import GiteGallery.StyleSheet exposing (..)
import GiteGallery.Types exposing (..)
import Html exposing (div)
import Html.Attributes exposing (attribute)


defBloc : BlocContent
defBloc =
    { id = 0
    , title = mEmpty
    , thumbnail = defPic
    , pictures = biStream [] defPic
    , chunks = biStream [] []
    , description = \l -> Element.empty
    }


defPic =
    Picture "" mEmpty


bThumbPic p =
    Picture ("images/blocs/blocThumbs/" ++ p) mEmpty


bPicStream : String -> List MultLangStr -> BiStream Picture
bPicStream folder captions =
    let
        path n =
            "images/blocs/"
                ++ folder
                ++ "/"
                ++ folder
                ++ String.padLeft 2 '0' (toString n)
                ++ ".jpg"
    in
    List.foldl (\d ( n, res ) -> ( n + 1, Picture (path n) d :: res )) ( 0, [] ) captions
        |> Tuple.second
        |> List.reverse
        |> (\l -> biStream l defPic)


blocs =
    List.foldr
        (\b ( n, res ) ->
            ( n + 1, Dict.insert n { b | id = n } res )
        )
        ( 0, Dict.empty )
        [ kitchenBloc
        , room1
        , room2
        , diningRoom
        , parlor
        , bathroom
        ]
        |> Tuple.second



-------------------------------------------------------------------------------


kitchenBloc =
    { defBloc
        | title = mKitchen
        , thumbnail = bThumbPic "kitchen.jpg"
        , pictures =
            bPicStream "kitchen"
                [ mEmpty
                ]
        , description =
            \lang ->
                textM lang mEmpty
    }


room1 =
    { defBloc
        | title = mRoom1
        , thumbnail = bThumbPic "room1.jpg"
        , pictures =
            bPicStream "room1"
                (List.map (uncurry MultLangStr)
                    [ ( "a pretty room", "une jolie chambre" )
                    , ( "a very pretty room", "une très jolie chambre" )
                    , ( "a huge picture", "une grosse photo" )
                    ]
                )
        , description =
            \lang ->
                column None
                    [ spacing 30 ]
                    [ paragraph None
                        []
                        [ text """ Cum saepe multa, tum memini domi in hemicyclio
                                  sedentem, ut solebat, cum et ego essem una et pauci
                                  admodum familiares, in eum sermonem illum incidere qui
                                  tum forte multis erat in ore. Meministi enim profecto,
                                  Attice, et eo magis, quod P. Sulpicio utebare multum,
                                  cum is tribunus plebis capitali odio a Q. Pompeio,
                                  qui tum erat consul, dissideret, quocum coniunctissime
                                  et amantissime vixerat, quanta esset hominum vel
                                  admiratio vel querella.
                              """ ]
                    , paragraph None
                        []
                        [ text """ Cum saepe multa, tum memini domi in hemicyclio
                                  sedentem, ut solebat, cum et ego essem una et pauci
                                  admodum familiares, in eum sermonem illum incidere qui
                                  tum forte multis erat in ore. Meministi enim profecto,
                                  Attice, et eo magis, quod P. Sulpicio utebare multum,
                                  cum is tribunus plebis capitali odio a Q. Pompeio,
                                  qui tum erat consul, dissideret, quocum coniunctissime
                                  et amantissime vixerat, quanta esset hominum vel
                                  admiratio vel querella.
                              """ ]
                    ]
    }


room2 =
    { defBloc
        | title = mRoom2
        , thumbnail = bThumbPic "room2.jpg"
        , pictures =
            bPicStream "room2"
                [ mEmpty
                ]
        , description =
            \lang ->
                textM lang mEmpty
    }


diningRoom =
    { defBloc
        | title = mDiningRoom
        , thumbnail = bThumbPic "diningRoom.jpg"
        , pictures =
            bPicStream "diningRoom"
                [ mEmpty
                ]
        , description =
            \lang ->
                textM lang mEmpty
    }


parlor =
    { defBloc
        | title = mParlor
        , thumbnail = bThumbPic "parlor.jpg"
        , pictures =
            bPicStream "parlor"
                (List.map (uncurry MultLangStr)
                    [ ( "a pretty parlor 1", "un joli salon 1" )
                    , ( "a pretty parlor 2", "un joli salon 2 " )
                    , ( "a pretty parlor 3", "un joli salon 3" )
                    , ( "a pretty parlor 4", "un joli salon 4" )
                    , ( "a pretty parlor 5", "un joli salon 5" )
                    , ( "a pretty parlor 6", "un joli salon 6" )
                    , ( "a pretty parlor 7", "un joli salon 7" )
                    , ( "a pretty parlor 8", "un joli salon 8" )
                    ]
                )
        , description =
            \lang ->
                column None
                    [ spacing 30 ]
                    [ h3 None [] (text "Titre 1")
                    , paragraph None
                        []
                        [ text """ Cum saepe multa, tum memini domi in hemicyclio
                                  sedentem, ut solebat, cum et ego essem una et pauci
                                  admodum familiares, in eum sermonem illum incidere qui
                                  tum forte multis erat in ore. Meministi enim profecto,
                                  Attice, et eo magis, quod P. Sulpicio utebare multum,
                                  cum is tribunus plebis capitali odio a Q. Pompeio,
                                  qui tum erat consul, dissideret, quocum coniunctissime
                                  et amantissime vixerat, quanta esset hominum vel
                                  admiratio vel querella.
                              """ ]
                    , h3 None [] (text "Titre 2")
                    , paragraph None
                        []
                        [ text """ Cum saepe multa, tum memini domi in hemicyclio
                                  sedentem, ut solebat, cum et ego essem una et pauci
                                  admodum familiares, in eum sermonem illum incidere qui
                                  tum forte multis erat in ore. Meministi enim profecto,
                                  Attice, et eo magis, quod P. Sulpicio utebare multum,
                                  cum is tribunus plebis capitali odio a Q. Pompeio,
                                  qui tum erat consul, dissideret, quocum coniunctissime
                                  et amantissime vixerat, quanta esset hominum vel
                                  admiratio vel querella.
                              """ ]
                    ]
    }


bathroom =
    { defBloc
        | title = mBathroom
        , thumbnail = bThumbPic "bathroom.jpg"
        , pictures =
            bPicStream "bathroom"
                [ mEmpty
                ]
        , description =
            \lang ->
                textM lang mEmpty
    }
