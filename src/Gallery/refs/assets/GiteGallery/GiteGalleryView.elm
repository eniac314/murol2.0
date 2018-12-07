module GiteGallery.GiteGalleryView exposing (..)

import Color
import Dict exposing (values)
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
import Json.Decode exposing (succeed)
import Material.Grid as Grid
import Set exposing (member)


view model lang =
    Element.layout stylesheet <|
        column None
            [ spacing 15 ]
            [ --paragraph None [] [text <| toString model.loaded]
              --,
              case .currentBloc model of
                Nothing ->
                    blocsView model lang

                Just bloc ->
                    blocView model bloc lang

            --, decorativeImage TestPic [class "toFadeIn"] {src = "images/pic01.jpg"}
            ]


picWithLoader :
    Model
    -> Language
    -> Picture
    -> MyStyle
    -> Bool
    -> String
    -> Element MyStyle Variation Msg
picWithLoader model lang { addr, caption } picStyle showCaption loader =
    let
        loaded =
            Set.member addr model.loaded

        showWhenLoaded =
            if loaded then
                []
            else
                [ hidden ]

        showWhenLoading =
            if loaded then
                [ hidden ]
            else
                []
    in
    column None
        [ spacing 5 ]
        [ decorativeImage LoadingGif
            (showWhenLoading ++ [ width fill, center ])
            { src = loader }
        , if showCaption then
            image picStyle
                ([ on "load" (succeed <| PicLoaded addr)
                 , width fill
                 , height fill
                 ]
                    ++ showWhenLoaded
                )
                { src = addr, caption = strM lang caption }
          else
            decorativeImage
                picStyle
                ([ on "load" (succeed <| PicLoaded addr)
                 , width fill
                 , height fill
                 ]
                    ++ showWhenLoaded
                )
                { src = addr }
        , if showCaption then
            textM lang caption
          else
            empty
        ]


sliderPic : Model -> BiStream Picture -> Language -> Element MyStyle Variation Msg
sliderPic model pictures lang =
    let
        { addr, caption } =
            current pictures

        loaded =
            Set.member addr model.loaded

        showWhenLoaded =
            if loaded then
                []
            else
                [ hidden ]

        showWhenLoading =
            if loaded then
                [ hidden ]
            else
                []

        loadingPic =
            case prev pictures of
                Nothing ->
                    decorativeImage LoadingGif
                        (showWhenLoading ++ [ width fill, center ])
                        { src = "images/sliderLoading.gif" }

                Just { addr, caption } ->
                    column None
                        []
                        [ image BlocCurrentPic
                            ([ width fill
                             , height fill
                             ]
                                ++ showWhenLoading
                            )
                            { src = addr, caption = strM lang caption }
                        ]
                        |> within
                            [ row LoadingLayer
                                ([ width fill
                                 , height fill
                                 ]
                                    ++ showWhenLoading
                                )
                                [ el SliderSpinner
                                    [ width fill, verticalCenter ]
                                    (html (Html.i [ Html.Attributes.class "fa fa-spinner fa-pulse" ] []))
                                ]
                            ]

        captionRow attr index caption =
            row None
                [ width fill ]
                [ el None
                    (attr ++ [ width fill ])
                    (textM lang caption)
                , el PicIndex
                    (attr ++ [ width fill ])
                    (text
                        ((toString (index + 1)
                            |> String.padLeft 2 '0'
                         )
                            ++ "/"
                            ++ (toString (.size pictures)
                                    |> String.padLeft 2 '0'
                               )
                        )
                    )
                ]

        loadingCaption =
            case prev pictures of
                Nothing ->
                    column None
                        []
                        [ captionRow [] (.index pictures) caption ]

                --el None [] (textM lang caption)]
                Just prevPic ->
                    column None
                        []
                        [ captionRow showWhenLoading (pictures.index - 1) prevPic.caption
                        , captionRow showWhenLoaded pictures.index caption
                        ]

        --[ el None showWhenLoading
        --    (textM lang prevPic.caption)
        --, el None showWhenLoaded
        --    (textM lang caption)
        --]
    in
    column None
        [ spacing 5 ]
        [ column None
            []
            [ loadingPic
            , image BlocCurrentPic
                ([ on "load" (succeed <| PicLoaded addr)
                 , width fill
                 , height fill

                 --, class "toFadeIn"
                 ]
                    ++ showWhenLoaded
                )
                { src = addr, caption = strM lang caption }
            ]
            |> within
                [ row PrevNext
                    [ width fill
                    , height fill
                    ]
                    [ row Prev
                        [ width (percent 50)
                        , onClick ShowPrevPic
                        , height (percent 100)
                        ]
                        [ el None
                            [ verticalCenter, paddingLeft 5 ]
                            (html (Html.i [ Html.Attributes.class "fa fa-angle-left" ] []))
                        ]
                    , row Next
                        [ width (percent 50)
                        , onClick ShowNextPic
                        , height (percent 100)
                        ]
                        [ el NextArrow
                            [ verticalCenter, width fill, paddingRight 5 ]
                            (html (Html.i [ Html.Attributes.class "fa fa-angle-right" ] []))
                        ]
                    ]
                ]
        , loadingCaption
        ]


chunkView model pictures chunks lang =
    let
        thumbView ({ addr, caption } as pic) =
            el
                (ChunkThumb
                    (if pic == current pictures then
                        Full
                     else
                        Dimmed
                    )
                )
                [ onClick (ShowPic addr)
                , spread
                ]
                (picWithLoader model
                    lang
                    { pic | addr = thumbAddr addr }
                    ChunkThumbPic
                    False
                    "images/thumbLoading.gif"
                )

        thumbAddr addr =
            let
                words =
                    String.split "/" addr

                picName =
                    Maybe.withDefault "" (List.head <| List.reverse words)

                prefix =
                    Maybe.withDefault [] (List.tail <| List.reverse words)
                        |> List.reverse
            in
            prefix
                ++ [ "thumbs", picName ]
                |> String.join "/"
    in
    row Chunks
        [ width fill
        , spacing 10
        ]
        (List.map thumbView (current chunks))


blocsView model lang =
    let
        thumbnailView { thumbnail, title, id } =
            el BlocThumbNail
                [ onClick (SetCurrentBloc id)
                , width (px 200)
                , height (px 200)
                ]
                (picWithLoader model lang thumbnail BlocThumbnailPic False "images/loading.gif")
                |> within
                    [ row None
                        [ width fill
                        , height fill
                        , center
                        , verticalCenter
                        ]
                        [ row BlocThumbTitleContainer
                            [ width (percent 90)
                            , height (percent 90)
                            , center
                            , verticalCenter
                            ]
                            [ paragraph BlocThumbTitle
                                []
                                [ textM lang title ]
                            ]
                        ]
                    ]
    in
    wrappedRow BlocsView
        [ spacing 10, center ]
        (Dict.values (.blocs model)
            |> List.map thumbnailView
        )



--blocsView2 model lang =
--    let
--        thumbnailView { thumbnail, title, id } =
--            el BlocThumbNail
--                [ onClick (SetCurrentBloc id)
--                , width (px 200)
--                , height (px 200)
--                ]
--                (picWithLoader model lang thumbnail BlocThumbnailPic False "images/loading.gif")
--                |> within
--                    [ row None
--                        [ width fill
--                        , height fill
--                        , center
--                        , verticalCenter
--                        ]
--                        [ row BlocThumbTitleContainer
--                            [ width (percent 90)
--                            , height (percent 90)
--                            , center
--                            , verticalCenter
--                            ]
--                            [ paragraph BlocThumbTitle
--                                []
--                                [ textM lang title ]
--                            ]
--                        ]
--                    ]
--    in
--    wrappedRow BlocsView
--        [ spacing 10 ]
--        (Dict.values (.blocs model)
--            |> List.map thumbnailView
--        )


nChunks n xs =
    let
        go acc1 acc2 m xs =
            case xs of
                [] ->
                    List.reverse (List.reverse acc2 :: acc1)

                x :: xs ->
                    if m == 1 then
                        go (List.reverse (x :: acc2) :: acc1)
                            []
                            n
                            xs
                    else
                        go acc1 (x :: acc2) (m - 1) xs
    in
    go [] [] n xs


blocView model { title, pictures, description, chunks } lang =
    let
        isSmall =
            model.device.phone || model.device.tablet
    in
    column BlocView
        [ padding 15 ]
        [ h3 BlocTitle
            [ padding 10 ]
            (textM lang title)
        , (if isSmall then
            wrappedRow
           else
            row
          )
            None
            [ spacing 15 ]
            [ column LeftBlocPanel
                [ width
                    (if isSmall then
                        fill
                     else
                        percent 60
                    )
                , center
                , spacing 10
                ]
                [ sliderPic model pictures lang
                , chunkView model pictures chunks lang
                ]
            , column RightBlocPanel
                [ spacing 15 ]
                [ description lang
                , button None
                    [ onClick ShowBlocList
                    , paddingTop 5
                    , paddingBottom 5
                    , width (px 150)
                    ]
                    (textM lang mGoBack)
                ]
            ]
        ]
