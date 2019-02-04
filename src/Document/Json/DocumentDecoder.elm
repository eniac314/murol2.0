module Document.Json.DocumentDecoder exposing (..)

import Array exposing (fromList)
import Document.Document exposing (..)
import Json.Decode exposing (..)
import Json.Decode.Extra exposing (fromResult)
import Json.Decode.Pipeline exposing (..)
import Set exposing (fromList)
import Time exposing (millisToPosix)
import UUID exposing (UUID, fromString)


decodeDocument : Decoder Document
decodeDocument =
    oneOf
        [ succeed Container
            |> requiredAt
                [ "Container", "ContainerValue" ]
                decodeContainerValue
            |> requiredAt
                [ "Container", "children" ]
                (list
                    (lazy (\_ -> decodeDocument))
                )
        , succeed Cell
            |> required "Cell" decodeCellValue
        ]


decodeContainerValue : Decoder ContainerValue
decodeContainerValue =
    succeed ContainerValue
        |> required "containerLabel" decodeContainerLabel
        |> required "id" decodeId
        |> required "attrs" decodeDocAttributes


decodeContainerLabel : Decoder ContainerLabel
decodeContainerLabel =
    string
        |> andThen
            (\str ->
                case str of
                    "DocColumn" ->
                        succeed DocColumn

                    "DocRow" ->
                        succeed DocRow

                    "TextColumn" ->
                        succeed TextColumn

                    "ResponsiveBloc" ->
                        succeed ResponsiveBloc

                    somethingElse ->
                        fail <|
                            "Unknown ContainerLabel: "
                                ++ somethingElse
            )


decodeCellValue : Decoder CellValue
decodeCellValue =
    succeed CellValue
        |> required "cellContent" decodeCellContent
        |> required "id" decodeId
        |> required "attrs" decodeDocAttributes


decodeCellContent : Decoder CellContent
decodeCellContent =
    oneOf
        [ succeed Image
            |> required "Image" decodeImageMeta
        , succeed Video
            |> required "Video" decodeVideoMeta
        , succeed Table
            |> required "Table" decodeTableMeta
        , succeed CustomElement
            |> required "CustomElement" string
        , succeed BlockLinks
            |> required "BlockLinks" (list decodeBlockLink)
        , succeed Fiches
            |> required "Fiches" (list string)
        , succeed TextBlock
            |> required "TextBlock" (list decodeTextBlockElement)
        , succeed PictureLinks
            |> required "PictureLinks"
                (list
                    (succeed PictureLink
                        |> required "url" string
                        |> required "img" decodeImageMeta
                    )
                )
        , succeed Gallery
            |> required "Gallery" decodeGalleryMeta
        , string
            |> andThen
                (\str ->
                    case str of
                        "EmptyCell" ->
                            succeed EmptyCell

                        "NewsBlock" ->
                            succeed NewsBlock

                        "Calendar" ->
                            succeed Calendar

                        "CalendarSalleMurol" ->
                            succeed CalendarSalleMurol

                        "CalendarSalleBeaune" ->
                            succeed CalendarSalleBeaune

                        "CalendarWidget" ->
                            succeed CalendarWidget

                        "DronePanorama" ->
                            succeed DronePanorama

                        "WeatherWidget" ->
                            succeed WeatherWidget

                        "MurolInfo" ->
                            succeed MurolInfo

                        "Delib" ->
                            succeed Delib

                        "Bulletin" ->
                            succeed Bulletin

                        somethingElse ->
                            fail <|
                                "Unknown CellContent: "
                                    ++ somethingElse
                )
        ]


decodeGalleryMeta : Decoder GalleryMeta
decodeGalleryMeta =
    succeed GalleryMeta
        |> required
            "uuid"
            decodeUUID
        |> required
            "title"
            string
        |> required
            "images"
            (list decodeImageMeta)
        |> required
            "hq"
            bool


decodeBlockLink : Decoder BlockLinkMeta
decodeBlockLink =
    succeed BlockLinkMeta
        |> required "image" string
        |> required "label" string
        |> required "targetBlank" bool
        |> required "url" string


decodeNews : Decoder News
decodeNews =
    succeed News
        |> required "title" string
        |> required "date"
            (Json.Decode.map millisToPosix int)
        |> required "content" (nullable decodeNewsContent)
        |> required "pic"
            (nullable
                (succeed Pic
                    |> required "url" string
                    |> required "width" int
                    |> required "height" int
                )
            )
        |> required "uuid" decodeUUID
        |> required "expiry"
            (Json.Decode.map millisToPosix int)


decodeNewsContent : Decoder NewsContent
decodeNewsContent =
    succeed NewsContent
        |> required "tbElems" (list decodeTextBlockElement)
        |> required "attrs" decodeDocAttributes


decodeUUID : Decoder UUID
decodeUUID =
    string
        |> andThen
            (Json.Decode.Extra.fromResult << UUID.fromString)


decodeTextBlockElement : Decoder TextBlockElement
decodeTextBlockElement =
    oneOf
        [ succeed Paragraph
            |> requiredAt [ "Paragraph", "attrs" ] decodeDocAttributes
            |> requiredAt [ "Paragraph", "prims" ] (list decodeTextBlockPrimitive)
        , succeed UList
            |> requiredAt [ "UList", "attrs" ] decodeDocAttributes
            |> requiredAt [ "UList", "liList" ]
                (list (field "li" (list decodeTextBlockPrimitive)))
        , succeed
            (\res ->
                Heading res.attrs ( res.level, res.value )
            )
            |> required "Heading"
                (succeed
                    (\a l v ->
                        { attrs = a, level = l, value = v }
                    )
                    |> required "attrs" decodeDocAttributes
                    |> required "level" int
                    |> required "value" string
                )
        , succeed TBPrimitive
            |> required "TBPrimitive" decodeTextBlockPrimitive
        ]


decodeTextBlockPrimitive : Decoder TextBlockPrimitive
decodeTextBlockPrimitive =
    oneOf
        [ succeed Text
            |> requiredAt [ "Text", "attrs" ] decodeDocAttributes
            |> requiredAt [ "Text", "value" ] string
        , succeed Link
            |> requiredAt [ "Link", "attrs" ] decodeDocAttributes
            |> requiredAt [ "Link", "linkMeta" ] decodeLinkMeta
        ]


decodeId : Decoder Id
decodeId =
    succeed Id
        |> required "uid" int
        |> required "docStyleId" (nullable string)
        |> required "htmlId" (nullable string)
        |> required "classes"
            (list string
                |> map Set.fromList
            )


decodeTableMeta : Decoder TableMeta
decodeTableMeta =
    succeed TableMeta
        |> required "style" string
        |> required "nbrRows" int
        |> required "nbrCols" int
        |> required "data"
            (list
                (Json.Decode.map
                    Array.fromList
                 <|
                    list string
                )
            )


decodeLinkMeta : Decoder LinkMeta
decodeLinkMeta =
    succeed LinkMeta
        |> required "targetBlank" bool
        |> required "url" string
        |> required "label" string


decodeImageMeta : Decoder ImageMeta
decodeImageMeta =
    succeed ImageMeta
        |> required "src" decodeImgSource
        |> required "caption" (nullable string)
        |> required "size" decodeImageSize


decodeImageSize : Decoder ImgSize
decodeImageSize =
    succeed ImgSize
        |> required "imgWidth" int
        |> required "imgHeight" int


decodeImgSource : Decoder ImageSrc
decodeImgSource =
    oneOf
        [ succeed UrlSrc
            |> required "UrlSrc" string
        , succeed Inline
            |> requiredAt [ "Inline", "filename" ] string
            |> requiredAt [ "Inline", "contents" ] string
        ]


decodeVideoMeta : Decoder VideoMeta
decodeVideoMeta =
    succeed VideoMeta
        |> required "src" string
        |> required "size" decodeVideoSize
        |> required "frameBorder" bool
        |> required "suggestions" bool
        |> required "controls" bool
        |> required "privacy" bool
        |> required "title" bool
        |> required "startAt" (nullable int)
        |> required "hosting" decodeVideoHost


decodeVideoHost : Decoder VideoHost
decodeVideoHost =
    string
        |> andThen
            (\str ->
                case str of
                    "Youtube" ->
                        succeed Youtube

                    somethingElse ->
                        fail <|
                            "Unknown VideoHost: "
                                ++ somethingElse
            )


decodeVideoSize : Decoder VideoSize
decodeVideoSize =
    succeed VideoSize
        |> required "videoWidth" int
        |> required "videoHeight" int


decodeDocColor : Decoder DocColor
decodeDocColor =
    succeed DocColor
        |> requiredAt [ "DocColor", "red" ] float
        |> requiredAt [ "DocColor", "green" ] float
        |> requiredAt [ "DocColor", "blue" ] float


decodeDocAttributes : Decoder (List DocAttribute)
decodeDocAttributes =
    list decodeDocAttribute


decodeDocAttribute : Decoder DocAttribute
decodeDocAttribute =
    oneOf
        [ succeed
            (\b l r t ->
                PaddingEach
                    { bottom = b
                    , left = l
                    , right = r
                    , top = t
                    }
            )
            |> requiredAt [ "PaddingEach", "bottom" ] int
            |> requiredAt [ "PaddingEach", "left" ] int
            |> requiredAt [ "PaddingEach", "right" ] int
            |> requiredAt [ "PaddingEach", "top" ] int
        , succeed SpacingXY
            |> requiredAt [ "SpacingXY", "X" ] int
            |> requiredAt [ "SpacingXY", "Y" ] int
        , succeed BackgroundColor
            |> required "BackgroundColor" decodeDocColor
        , succeed Width
            |> required "Width" int
        , succeed Height
            |> required "Height" int
        , succeed FillPortion
            |> required "FillPortion" int
        , succeed Font
            |> required "Font" string
        , succeed FontColor
            |> required "FontColor" decodeDocColor
        , succeed FontSize
            |> required "FontSize" int
        , string
            |> andThen
                (\str ->
                    case str of
                        "WidthShrink" ->
                            succeed WidthShrink

                        "WidthFill" ->
                            succeed WidthFill

                        "AlignRight" ->
                            succeed AlignRight

                        "AlignLeft" ->
                            succeed AlignLeft

                        "Pointer" ->
                            succeed Pointer

                        "Border" ->
                            succeed Border

                        "FontAlignLeft" ->
                            succeed FontAlignLeft

                        "FontAlignRight" ->
                            succeed FontAlignRight

                        "Center" ->
                            succeed Center

                        "Justify" ->
                            succeed Justify

                        "Bold" ->
                            succeed Bold

                        "Italic" ->
                            succeed Italic

                        somethingElse ->
                            fail <|
                                "Unknown DocAttribute: "
                                    ++ somethingElse
                )
        ]
