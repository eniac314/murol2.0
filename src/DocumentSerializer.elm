module DocumentSerializer exposing (..)

import Document exposing (..)
import Json.Encode exposing (..)
import Set exposing (toList)


encodeDocument : Document -> Value
encodeDocument doc =
    case doc of
        Container cv docs ->
            object
                [ ( "Container"
                  , object
                        [ ( "ContainerValue"
                          , encodeContainerValue cv
                          )
                        , ( "children", list encodeDocument docs )
                        ]
                  )
                ]

        Cell cv ->
            object
                [ ( "Cell", encodeCellValue cv ) ]


encodeContainerValue : ContainerValue -> Value
encodeContainerValue { containerLabel, id, attrs } =
    object
        [ ( "containerLabel", encodeContainerLabel containerLabel )
        , ( "id", encodeId id )
        , ( "attrs", list encodeDocAttribute attrs )
        ]


encodeContainerLabel : ContainerLabel -> Value
encodeContainerLabel cLabel =
    case cLabel of
        DocColumn ->
            string "DocColumn"

        DocRow ->
            string "DocRow"

        TextColumn ->
            string "TextColumn"

        ResponsiveBloc ->
            string "ResponsiveBloc"


encodeCellValue : CellValue -> Value
encodeCellValue { cellContent, id, attrs } =
    object
        [ ( "cellContent", encodeCellContent cellContent )
        , ( "id", encodeId id )
        , ( "attrs", list encodeDocAttribute attrs )
        ]


encodeCellContent : CellContent -> Value
encodeCellContent cellContent =
    case cellContent of
        Image im ->
            object
                [ ( "Image", encodeImageMeta im ) ]

        Table tm ->
            object []

        CustomElement s ->
            object [ ( "CustomElement", string s ) ]

        TextBlock tbElems ->
            object [ ( "TextBlock", list encodeTextBlockElement tbElems ) ]

        EmptyCell ->
            string "EmptyCell"


encodeTextBlockElement : TextBlockElement -> Value
encodeTextBlockElement tbElem =
    case tbElem of
        Paragraph attrs prims ->
            object
                [ ( "Paragraph"
                  , object
                        [ ( "attrs"
                          , list encodeDocAttribute attrs
                          )
                        , ( "prims"
                          , list encodeTextBlockPrimitive prims
                          )
                        ]
                  )
                ]

        UList attrs liList ->
            object
                [ ( "UList"
                  , object
                        [ ( "attrs"
                          , list encodeDocAttribute attrs
                          )
                        , ( "liList"
                          , List.map (list encodeTextBlockPrimitive) liList
                                |> list (\li -> object [ ( "li", li ) ])
                          )
                        ]
                  )
                ]

        Heading attrs ( level, s ) ->
            object
                [ ( "Heading"
                  , object
                        [ ( "attrs", list encodeDocAttribute attrs )
                        , ( "level", int level )
                        , ( "content", string s )
                        ]
                  )
                ]

        TBPrimitive prim ->
            object
                [ ( "TBPrimitive", encodeTextBlockPrimitive prim ) ]


encodeTextBlockPrimitive : TextBlockPrimitive -> Value
encodeTextBlockPrimitive tbPrim =
    case tbPrim of
        Text attrs s ->
            object
                [ ( "Text"
                  , object
                        [ ( "attrs"
                          , list encodeDocAttribute attrs
                          )
                        , ( "value"
                          , string s
                          )
                        ]
                  )
                ]

        Link attrs lm ->
            object
                [ ( "Link"
                  , object
                        [ ( "attrs"
                          , list encodeDocAttribute attrs
                          )
                        , ( "linkMeta"
                          , encodeLinkMeta lm
                          )
                        ]
                  )
                ]


encodeId : Id -> Value
encodeId { uid, docStyleId, htmlId, classes } =
    object
        [ ( "uid", int uid )
        , ( "docStyleId"
          , Maybe.map string docStyleId
                |> Maybe.withDefault null
          )
        , ( "htmlId"
          , Maybe.map string htmlId
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


encodeDocAttribute : DocAttribute -> Value
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

        Font s ->
            object
                [ ( "Font", string s ) ]

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

        ZipperAttr _ _ ->
            object [ ( "ZipperAttr", string "" ) ]
