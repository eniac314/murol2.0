module NewsEditor.NewsEditor exposing (..)

import Document.Document exposing (..)
import Document.Json.DocumentSerializer exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events exposing (..)
import Element.Font as Font
import Element.Input as Input
import Element.Lazy exposing (lazy)
import Html exposing (map)
import Html.Attributes as HtmlAttr
import PageEditor.EditorPlugins.TextBlockPlugin as TextBlockPlugin


type alias Model =
    { textBlockPlugin : TextBlockPlugin.Model Msg }


type Msg
    = TextBlockPluginMsg TextBlockPlugin.Msg
    | NoOp
