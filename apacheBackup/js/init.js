var author$project$Murol$init = F3(
	function (flags, url, key) {
		var config = {
			containersBkgColors: false,
			customElems: elm$core$Dict$empty,
			editMode: false,
			height: 1080,
			mainInterfaceHeight: 0,
			onLoadMsg: function (_n0) {
				return author$project$Murol$NoOp;
			},
			sizesDict: elm$core$Dict$empty,
			styleSheet: author$project$Document$DocumentViews$StyleSheets$defaulStyleSheet,
			width: 1920,
			zipperHandlers: elm$core$Maybe$Nothing
		};
		return _Utils_Tuple2(
			{
				config: config,
				key: key,
				pageTree: elm$core$Maybe$Nothing,
				pages: elm$core$Dict$empty,
				url: (url.path === '/') ? _Utils_update(
					url,
					{path: '/accueil'}) : url
			},
			elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						author$project$Murol$getPages,
						(url.path === '/') ? A2(
						elm$browser$Browser$Navigation$pushUrl,
						key,
						elm$url$Url$toString(
							_Utils_update(
								url,
								{path: '/accueil'}))) : elm$core$Platform$Cmd$none
					])));
	});