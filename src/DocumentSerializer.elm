module DocumentSerializer exposing (..)

import Array exposing (toList)
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
        , ( "attrs", encodeDocAttributes attrs )
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
        , ( "attrs", encodeDocAttributes attrs )
        ]


encodeCellContent : CellContent -> Value
encodeCellContent cellContent =
    case cellContent of
        Image im ->
            object
                [ ( "Image", encodeImageMeta im ) ]

        Table tm ->
            object
                [ ( "Table", encodeTableMeta tm ) ]

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
                          , encodeDocAttributes attrs
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
                          , encodeDocAttributes attrs
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
                        [ ( "attrs", encodeDocAttributes attrs )
                        , ( "level", int level )
                        , ( "value", string s )
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
                          , encodeDocAttributes attrs
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
                          , encodeDocAttributes attrs
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


encodeTableMeta : TableMeta -> Value
encodeTableMeta { style, nbrRows, nbrCols, data } =
    object
        [ ( "style", string style )
        , ( "nbrRows", int nbrRows )
        , ( "nbrCols", int nbrCols )
        , ( "data"
          , List.map Array.toList data
                |> List.map (list string)
                |> list identity
          )
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

        Inline filename contents ->
            object
                [ ( "Inline"
                  , object
                        [ ( "filename", string filename )
                        , ( "contents", string contents )
                        ]
                  )
                ]


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


encodeDocAttributes : List DocAttribute -> Value
encodeDocAttributes attrs =
    List.filterMap encodeDocAttribute attrs
        |> list identity


encodeDocAttribute : DocAttribute -> Maybe Value
encodeDocAttribute docAttr =
    case docAttr of
        PaddingEach { bottom, left, right, top } ->
            Just <|
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
            Just <|
                object
                    [ ( "SpacingXY"
                      , object
                            [ ( "X", int x )
                            , ( "Y", int y )
                            ]
                      )
                    ]

        AlignRight ->
            Just <|
                string "AlignRight"

        AlignLeft ->
            Just <|
                string "AlignLeft"

        Pointer ->
            Just <|
                string "Pointer"

        BackgroundColor color ->
            Just <|
                object
                    [ ( "BackgroundColor", encodeDocColor color ) ]

        Width w ->
            Just <|
                object
                    [ ( "Width", int w ) ]

        Height h ->
            Just <|
                object
                    [ ( "Height", int h ) ]

        Border ->
            Just <|
                string "Border"

        Font s ->
            Just <|
                object
                    [ ( "Font", string s ) ]

        FontColor color ->
            Just <|
                object
                    [ ( "FontColor", encodeDocColor color ) ]

        FontSize s ->
            Just <|
                object
                    [ ( "FontSize", int s ) ]

        FontAlignLeft ->
            Just <|
                string "FontAlignLeft"

        FontAlignRight ->
            Just <|
                string "FontAlignRight"

        Center ->
            Just <|
                string "Center"

        Justify ->
            Just <|
                string "Justify"

        Bold ->
            Just <|
                string "Bold"

        Italic ->
            Just <|
                string "Italic"

        ZipperAttr _ _ ->
            Nothing
