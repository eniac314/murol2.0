var author$project$Murol$view = function (model) {
	return {
		body: _List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$layout,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
						mdgriffith$elm_ui$Element$Font$size(16)
					]),
				A2(
					mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
						]),
					_List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
									mdgriffith$elm_ui$Element$Font$size(45),
									mdgriffith$elm_ui$Element$Font$center
								]),
							mdgriffith$elm_ui$Element$text('Murol')),
							A2(
							mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
									mdgriffith$elm_ui$Element$Font$size(31),
									mdgriffith$elm_ui$Element$Font$center
								]),
							mdgriffith$elm_ui$Element$text('La municipalité de Murol vous souhaite la bienvenue')),
							author$project$Murol$mainView(model),
							author$project$Murol$footerView(model)
						])))
			]),
		title: 'La commune de Murol'
	};
};


var author$project$Murol$mainView = function (model) {
	var _n0 = A2(elm$core$Dict$get, model.url.path, model.pages);
	_n0$2:
	while (true) {
		if (_n0.$ === 'Just') {
			switch (_n0.a.b.$) {
				case 'Loaded':
					var _n1 = _n0.a;
					var cid = _n1.a;
					var doc = _n1.b.a;
					return A2(
						mdgriffith$elm_ui$Element$column,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$centerX,
								mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
							]),
						A2(
							author$project$Document$DocumentViews$DocumentView$renderDoc,
							model.config,
							A2(author$project$Document$DocumentViews$DocumentResponsive$responsivePreFormat, model.config, doc)));
				case 'Loading':
					var _n2 = _n0.a;
					var cid = _n2.a;
					var _n3 = _n2.b;
					return A2(
						mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[mdgriffith$elm_ui$Element$centerX]),
						mdgriffith$elm_ui$Element$text('Chargement en cours...'));
				default:
					break _n0$2;
			}
		} else {
			break _n0$2;
		}
	}
	return A2(
		mdgriffith$elm_ui$Element$el,
		_List_fromArray(
			[mdgriffith$elm_ui$Element$centerX]),
		mdgriffith$elm_ui$Element$text('Pas de contenu.'));
};