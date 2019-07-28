module Document.DocumentViews.DocumentResponsive exposing (flipTable, renderSameHeightImgRow, responsivePreFormat)

import Array exposing (..)
import Dict exposing (..)
import Document.Document exposing (..)
import Document.DocumentViews.RenderConfig exposing (Config)
import Document.DocumentViews.StyleSheets exposing (..)
import Element
    exposing
        ( Attribute
        , DeviceClass(..)
        , Element
        , alignLeft
        , alignRight
        , centerX
        , classifyDevice
        , column
        , el
        , fill
        , height
        , html
        , htmlAttribute
        , image
        , indexedTable
        , link
        , maximum
        , minimum
        , newTabLink
        , none
        , paddingEach
        , paddingXY
        , paragraph
        , pointer
        , px
        , rgb
        , row
        , spacingXY
        , text
        , textColumn
        , width
        )
import Set exposing (..)


responsivePreFormat : Config msg -> Document -> Document
responsivePreFormat config document =
    let
        device =
            getDevice config

        --classifyDevice config
    in
    case document of
        Container ({ containerLabel, id, attrs } as nv) children ->
            case containerLabel of
                DocColumn ->
                    let
                        addColImgClass doc =
                            case doc of
                                (Cell lv) as l ->
                                    case lv.cellContent of
                                        Image meta ->
                                            let
                                                lId =
                                                    lv.id
                                            in
                                            Cell
                                                { cellContent = lv.cellContent
                                                , id = { lId | classes = Set.insert "colImg" lId.classes }
                                                , attrs = lv.attrs
                                                }

                                        _ ->
                                            l

                                doc_ ->
                                    doc_

                        children_ =
                            List.map addColImgClass children
                    in
                    Container nv (List.map (responsivePreFormat config) children_)

                DocRow ->
                    if device.class == Phone || device.class == Tablet then
                        responsivePreFormat config <| Container { nv | containerLabel = DocColumn } children

                    else if containsOnly isImage document then
                        renderSameHeightImgRow config.width document

                    else
                        Container nv (List.map (responsivePreFormat config) children)

                --Container nv (List.map (responsivePreFormat config) children)
                TextColumn ->
                    if device.class == Phone || device.class == Tablet then
                        responsivePreFormat config <| Container { nv | containerLabel = DocColumn } children

                    else
                        Container nv (List.map (responsivePreFormat config) children)

                ResponsiveBloc ->
                    Container nv (List.map (responsivePreFormat config) children)

        (Cell { cellContent, id, attrs }) as l ->
            case cellContent of
                Image meta ->
                    l

                Video meta ->
                    l

                BlockLinks meta ->
                    l

                Fiches f ->
                    l

                NewsBlock ->
                    l

                TextBlock xs ->
                    l

                Table meta ->
                    if
                        (device.class == Phone || device.class == Tablet)
                            && meta.nbrCols
                            > meta.nbrRows
                    then
                        Cell
                            { cellContent =
                                Table (flipTable meta)
                            , id = id
                            , attrs = attrs
                            }

                    else
                        l

                CustomElement s ->
                    l

                EmptyCell ->
                    l

                _ ->
                    l


flipTable : TableMeta -> TableMeta
flipTable { style, nbrRows, nbrCols, data } =
    let
        uncons xs =
            case xs of
                x :: xs_ ->
                    Just ( x, xs_ )

                _ ->
                    Nothing

        inverse acc xs =
            case xs of
                [] ->
                    List.reverse acc

                xs_ ->
                    let
                        ( heads, tails ) =
                            List.filterMap uncons xs_
                                |> List.foldr
                                    (\( h, t ) ( hs, ts ) ->
                                        ( h :: hs, t :: ts )
                                    )
                                    ( [], [] )

                        tails_ =
                            if List.member [] tails then
                                []

                            else
                                tails
                    in
                    inverse (heads :: acc) tails_

        newData =
            List.map Array.toList data
                |> inverse []
                |> List.map Array.fromList
    in
    { style = style
    , nbrRows = nbrCols
    , nbrCols = nbrRows
    , data = newData
    }


renderSameHeightImgRow : Int -> Document -> Document
renderSameHeightImgRow containerWidth document =
    case document of
        Cell _ ->
            document

        Container id_ children ->
            let
                images =
                    List.foldr
                        (\doc acc ->
                            case doc of
                                Container _ _ ->
                                    acc

                                Cell lv ->
                                    case lv.cellContent of
                                        Image ({ src, caption, size } as meta) ->
                                            { meta = meta
                                            , id = lv.id
                                            , attrs = lv.attrs
                                            , newWidth = 0
                                            , newHeight = 0
                                            }
                                                :: acc

                                        _ ->
                                            acc
                        )
                        []
                        children

                imgSizes imgs =
                    List.map (\i -> i.meta.size) imgs

                minHeight imgs =
                    imgSizes imgs
                        |> List.map .imgHeight
                        |> List.sort
                        |> List.head
                        |> Maybe.withDefault 0

                imgsScaledToMinHeight =
                    let
                        mh =
                            minHeight images

                        scale { meta, attrs, id } =
                            { meta = meta
                            , id = id
                            , attrs = attrs
                            , newHeight = toFloat mh + 5
                            , newWidth =
                                toFloat mh
                                    * toFloat meta.size.imgWidth
                                    / toFloat meta.size.imgHeight
                            }
                    in
                    List.map scale images

                totalImgWidth =
                    List.foldr (\i n -> i.newWidth + n) 0 imgsScaledToMinHeight
            in
            Container { id_ | attrs = id_.attrs ++ [ SpacingXY 7 0 ] } <|
                List.map
                    (\im ->
                        Cell
                            { cellContent = Image im.meta
                            , id = im.id
                            , attrs =
                                [ --Height (floor im.newHeight)
                                  FillPortion (floor <| 10000 * im.newWidth / totalImgWidth)
                                ]
                                    ++ im.attrs
                            }
                    )
                    imgsScaledToMinHeight
