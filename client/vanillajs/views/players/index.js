NS("views.players", function () {

	this.index = function (playersList) {

		var template = '\
			Players \
			<ul id="players"> \
				<spx:each val="player" in="players">\
				<li> \
					<span class="name">{{player.value.name}}</span> \
					<span class="bet">{{player.value.bet}}</span> \
				</li> \
				</spx:each> \
			</ul>';


		var viewModel = {
			players: { }
		};

        var t = new sparkling.Template(template, viewModel, init);

		function init() {

			var el_ul = this.get("#players");

			playersList.subscribe("add", function (player) {

				viewModel.players[player.cid] = player;
				t.update();

				// player.propertyChanged("hasMadeBet", function (val) {
				// 	if (val) {
				// 		view.li.classList.add("ready");
				// 	}
				// 	else {
				// 		view.li.classList.remove("ready");
				// 	}
				// });

			});

			playersList.subscribe("remove", function (player) {
				if (player) {
					// delete viewModel[player.cid];
				}
			});

			playersList.subscribe("turn", function () {
				el_ul.classList.add("turn");
			});

			playersList.subscribe("clearBets", function () {
				el_ul.classList.remove("turn");
			});

		}

        this.render = function () {
            return t.dom;
        };

		// var _ul;
		// var _itemsViews = {};

		// this.init = function (context) {

		// 	_ul = _("#players", context);

		// 	// load template
		// 	var _el_itemTemplate = _(".template", _ul);
		// 	_ul.removeChild(_el_itemTemplate);
		// 	_el_itemTemplate.classList.remove("template");
		// 	var itemTemplate = _el_itemTemplate.outerHTML;

		// 	playersList.subscribe("add", function (player) {

		// 		// create player view
		// 		var li = parseHtml(itemTemplate);
		// 		if (player.hasMadeBet) {
		// 			li.classList.add("ready");
		// 		}

		// 		var view = {
		// 			li: li,
		// 			el_playerName: _(".name", li),
		// 			el_bet: _(".bet", li)
		// 		};

		// 		_itemsViews[player.cid] = view;

		// 		// init
		// 		view.el_playerName.innerHTML = player.name;

		// 		// update DOM on property changed event
		// 		player
		// 			.propertyChanged("name", function (val) {
		// 				view.el_playerName.innerHTML = val;
		// 			})
		// 			.propertyChanged("bet", function (val) {
		// 				view.el_bet.innerHTML = val;
		// 			})
		// 			.propertyChanged("hasMadeBet", function (val) {
		// 				if (val) {
		// 					view.li.classList.add("ready");
		// 				}
		// 				else {
		// 					view.li.classList.remove("ready");
		// 				}
		// 			});

		// 		_ul.appendChild(li);
		// 	});

		// 	playersList.subscribe("remove", function (player) {
		// 		if (player) {
		// 			var view = _itemsViews[player.cid];
		// 			_ul.removeChild(view.li);
		// 		}
		// 	});

		// 	playersList.subscribe("turn", function () {
		// 		_ul.classList.add("turn");
		// 	});

		// 	playersList.subscribe("clearBets", function () {
		// 		_ul.classList.remove("turn");
		// 	});
		// };

		// this.render = function () {

		// 	//await( this.loadTemplate("/views/playersList.html") );

		// 	var html = '\
		// 		Players \
		// 		<ul id="players"> \
		// 			<li class="template"> \
		// 				<span class="name"></span> \
		// 				<span class="bet"></span> \
		// 			</li> \
		// 		</ul>';

		// 	var r = Re.render2(html);
		// 	return r.dom;
		// };

	};

});

