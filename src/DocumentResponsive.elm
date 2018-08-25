module DocumentResponsive exposing (..)

import Array exposing (..)
import Dict exposing (..)
import Document exposing (..)
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


responsivePreFormat : Config msg -> Document msg -> Document msg
responsivePreFormat config document =
    let
        device =
            classifyDevice config
    in
    case document of
        Node ({ nodeLabel, id, attrs } as nv) children ->
            case nodeLabel of
                Paragraph ->
                    Node nv (List.map (responsivePreFormat config) children)

                Column ->
                    let
                        addColImgClass doc =
                            case doc of
                                (Leaf lv) as l ->
                                    case lv.leafContent of
                                        Image meta ->
                                            let
                                                lId =
                                                    lv.id
                                            in
                                            Leaf
                                                { leafContent = lv.leafContent
                                                , id = { lId | classes = Set.insert "colImg" id.classes }
                                                , attrs = lv.attrs
                                                }

                                        _ ->
                                            l

                                doc_ ->
                                    doc_

                        children_ =
                            List.map addColImgClass children
                    in
                    Node nv (List.map (responsivePreFormat config) children_)

                Row ->
                    if
                        hasClass "sameHeightImgsRow" document
                            && containsOnly isImage document
                    then
                        case Dict.get id.uid config.sizesDict of
                            Just { docWidth, docHeight } ->
                                renderSameHeightImgRow docWidth document

                            Nothing ->
                                renderSameHeightImgRow config.width document
                        --Node nv (List.map (responsivePreFormat config) children)
                    else
                        Node nv (List.map (responsivePreFormat config) children)

                TextColumn ->
                    if device.class == Phone || device.class == Tablet then
                        responsivePreFormat config <| Node { nv | nodeLabel = Column } children
                    else
                        Node nv (List.map (responsivePreFormat config) children)

                ResponsiveBloc ->
                    Node nv (List.map (responsivePreFormat config) children)

        (Leaf { leafContent, id, attrs }) as l ->
            case leafContent of
                Image meta ->
                    l

                Link meta ->
                    l

                Text s ->
                    l

                Heading ( level, s ) ->
                    l

                Table meta ->
                    if
                        (device.class == Phone || device.class == Tablet)
                            && meta.nbrCols
                            > meta.nbrRows
                    then
                        Leaf
                            { leafContent =
                                Table (flipTable meta)
                            , id = id
                            , attrs = attrs
                            }
                    else
                        l

                CustomElement s ->
                    l


renderSameHeightImgRow : Int -> Document msg -> Document msg
renderSameHeightImgRow containerWidth document =
    case document of
        Leaf _ ->
            document

        Node id_ children ->
            let
                images =
                    List.foldr
                        (\doc acc ->
                            case doc of
                                Node _ _ ->
                                    acc

                                Leaf lv ->
                                    case lv.leafContent of
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

                spacingOffset =
                    if containerWidth > 500 then
                        20
                    else
                        15

                scalingFactor =
                    if
                        toFloat containerWidth
                            < totalImgWidth
                            + toFloat (List.length images)
                            * spacingOffset
                    then
                        toFloat
                            (containerWidth
                                - List.length images
                                * spacingOffset
                            )
                            / totalImgWidth
                    else
                        1

                imgsScaledToFitContainer =
                    List.map
                        (\im ->
                            { im
                                | newWidth =
                                    im.newWidth * scalingFactor
                                , newHeight =
                                    im.newHeight * scalingFactor
                            }
                        )
                        imgsScaledToMinHeight
            in
            Node id_ <|
                List.map
                    (\im ->
                        Leaf
                            { leafContent = Image im.meta
                            , id = im.id
                            , attrs =
                                [ StyleElementAttr <| height (px (floor im.newHeight))
                                , StyleElementAttr <| width (px (floor im.newWidth))
                                ]
                                    ++ im.attrs
                            }
                    )
                    imgsScaledToFitContainer


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
