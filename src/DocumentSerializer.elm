module DocumentSerializer exposing (..)

import Document exposing (..)
import Json.Encode exposing (..)
import Set exposing (toList)


--encodeDocument : Document msg -> Value
--encodeDocument doc =
--    Debug.todo ""


encodeLeafContent : LeafContent -> Value
encodeLeafContent lv =
    case lv of
        Image im ->
            object
                [ ( "Image", encodeImageMeta im ) ]

        Link lm ->
            object
                [ ( "Link", encodeLinkMeta lm ) ]

        Text s ->
            object
                [ ( "Text", string s ) ]

        Heading ( level, s ) ->
            object
                [ ( "Heading"
                  , object
                        [ ( "level", int level )
                        , ( "content", string s )
                        ]
                  )
                ]

        Table tm ->
            Debug.todo ""


encodeId : Id -> Value
encodeId { uid, styleId, classes } =
    object
        [ ( "uid", int uid )
        , ( "styleId"
          , Maybe.map string styleId
                |> Maybe.withDefault null
          )
        , ( "classes"
          , set string classes
          )
        ]


encodeLinkMeta : LinkMeta -> Value
encodeLinkMeta { targetBlank, url, label } =
    object
        [ ( "targetBlank", bool targetBlank )
        , ( "url", string url )
        , ( "label", string label )
        ]


encodeImageMeta : ImageMeta -> Value
encodeImageMeta { src, caption, size } =
    object
        [ ( "src", encodeImgSource src )
        , ( "caption"
          , Maybe.map string caption
                |> Maybe.withDefault null
          )
        , ( "size", encodeImageSize size )
        ]


encodeImageSize : ImgSize -> Value
encodeImageSize { imgWidth, imgHeight } =
    object
        [ ( "imgWidth", int imgWidth )
        , ( "imgHeight", int imgHeight )
        ]


encodeImgSource : ImageSrc -> Value
encodeImgSource imgSrc =
    case imgSrc of
        UrlSrc s ->
            object
                [ ( "UrlSrc", string s ) ]

        Inline s ->
            object
                [ ( "Inline", string s ) ]


encodeDocColor : DocColor -> Value
encodeDocColor (DocColor r g b) =
    object
        [ ( "DocColor"
          , object
                [ ( "red", float r )
                , ( "green", float g )
                , ( "blue", float b )
                ]
          )
        ]


encodeDocAttribute : DocAttribute msg -> Value
encodeDocAttribute docAttr =
    case docAttr of
        PaddingEach { bottom, left, right, top } ->
            object
                [ ( "PaddingEach"
                  , object
                        [ ( "bottom", int bottom )
                        , ( "left", int left )
                        , ( "right", int right )
                        , ( "top", int top )
                        ]
                  )
                ]

        SpacingXY x y ->
            object
                [ ( "SpacingXY"
                  , object
                        [ ( "X", int x )
                        , ( "Y", int y )
                        ]
                  )
                ]

        AlignRight ->
            string "AlignRight"

        AlignLeft ->
            string "AlignLeft"

        Pointer ->
            string "Pointer"

        BackgroundColor color ->
            object
                [ ( "BackgroundColor", encodeDocColor color ) ]

        Width w ->
            object
                [ ( "Width", int w ) ]

        Height h ->
            object
                [ ( "Height", int h ) ]

        Border ->
            string "Border"

        FontColor color ->
            object
                [ ( "FontColor", encodeDocColor color ) ]

        FontSize s ->
            object
                [ ( "FontSize", int s ) ]

        FontAlignLeft ->
            string "FontAlignLeft"

        FontAlignRight ->
            string "FontAlignRight"

        Center ->
            string "Center"

        Justify ->
            string "Justify"

        Bold ->
            string "Bold"

        Italic ->
            string "Italic"

        StyleElementAttr seAttr ->
            object [ ( "StyleElementAttr", string "todo" ) ]
