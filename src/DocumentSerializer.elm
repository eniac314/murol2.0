module DocumentSerializer exposing (..)

import Document exposing (..)
import Json.Encode exposing (..)
import Set exposing (toList)


--encodeDocument : Document msg -> Value
--encodeDocument doc =
--    Debug.todo ""


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


encodeImageSize : ImgSize -> Value
encodeImageSize { imgWidth, imgHeight } =
    object
        [ ( "imgWidth", int imgWidth )
        , ( "imgHeight", int imgHeight )
        ]


encodeLinkMeta : LinkMeta -> Value
encodeLinkMeta { targetBlank, url, label } =
    object
        [ ( "targetBlank", bool targetBlank )
        , ( "url", string url )
        , ( "label", string label )
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
