var author$project$Murol$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'ClickedLink':
				var urlRequest = msg.a;
				if (urlRequest.$ === 'Internal') {
					var url = urlRequest.a;
					return _Utils_Tuple2(
						model,
						A2(
							elm$browser$Browser$Navigation$pushUrl,
							model.key,
							A2(
								elm$core$Debug$log,
								'',
								elm$url$Url$toString(url))));
				} else {
					var url = urlRequest.a;
					return _Utils_Tuple2(
						model,
						elm$browser$Browser$Navigation$load(url));
				}
			case 'ChangeUrl':
				var url = msg.a;
				var _n2 = A2(elm$core$Dict$get, url.path, model.pages);
				if (_n2.$ === 'Just') {
					if (_n2.a.b.$ === 'NotLoaded') {
						var _n3 = _n2.a;
						var cId = _n3.a;
						var _n4 = _n3.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									pages: A3(
										elm$core$Dict$insert,
										url.path,
										_Utils_Tuple2(cId, author$project$Murol$Loading),
										model.pages),
									url: url
								}),
							author$project$Murol$getContent(
								_Utils_Tuple2(url.path, cId)));
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{url: url}),
							elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(
						model,
						A2(
							elm$browser$Browser$Navigation$pushUrl,
							model.key,
							elm$url$Url$toString(
								_Utils_update(
									url,
									{path: '/accueil'}))));
				}
			case 'LoadPages':
				var res = msg.a;
				if (res.$ === 'Ok') {
					var value = res.a;
					var _n6 = A2(elm$json$Json$Decode$decodeValue, author$project$Murol$decodePages, value);
					if (_n6.$ === 'Ok') {
						var _n7 = _n6.a;
						var pages = _n7.a;
						var pageTree = _n7.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									pageTree: elm$core$Maybe$Just(pageTree),
									pages: pages
								}),
							function () {
								var _n8 = A2(elm$core$Dict$get, model.url.path, pages);
								if (_n8.$ === 'Just') {
									if (_n8.a.b.$ === 'NotLoaded') {
										var _n9 = _n8.a;
										var cId = _n9.a;
										var _n10 = _n9.b;
										return author$project$Murol$getContent(
											_Utils_Tuple2(model.url.path, cId));
									} else {
										return elm$core$Platform$Cmd$none;
									}
								} else {
									var url = model.url;
									return A2(
										elm$browser$Browser$Navigation$pushUrl,
										model.key,
										elm$url$Url$toString(
											_Utils_update(
												url,
												{path: '/accueil'})));
								}
							}());
					} else {
						return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				}
			case 'LoadContent':
				var _n11 = msg.a;
				var path = _n11.a;
				var cId = _n11.b;
				var res = msg.b;
				if (res.$ === 'Ok') {
					var jsonVal = res.a;
					var _n13 = A2(elm$json$Json$Decode$decodeValue, author$project$PageTreeEditor$PageTreeEditor$decodeContent, jsonVal);
					if (_n13.$ === 'Ok') {
						var contentId = _n13.a.contentId;
						var docContent = _n13.a.docContent;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									pages: A3(
										elm$core$Dict$insert,
										path,
										_Utils_Tuple2(
											cId,
											author$project$Murol$Loaded(docContent)),
										model.pages)
								}),
							elm$core$Platform$Cmd$none);
					} else {
						var e = _n13.a;
						return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				}
			default:
				return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
		}
	});