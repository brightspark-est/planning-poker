NS("views.players", function () {

	var controllers = NS.require("controllers");

	this.index = function (playersList) {

		var _view = this;
		_view.playersController = controllers.players;

		var template = '\
			Players \
			<ul id="players"> \
				<spx:each val="player" in="players">\
				<li> \
					<span class="name">{{player.name}}</span> \
					<span class="bet">{{player.bet}}</span> \
				</li> \
				</spx:each> \
			</ul>';


		var viewModel = {
			players: []
		};

		function init() {

			var elPlayersList = this.get("#players");

			_view.playersController.subscribe("add", function (player) {
				viewModel.players.push(player);
			});

			_view.playersController.subscribe("remove", function (player) {
				viewModel.players.remove(player);
			});

			_view.playersController.subscribe("turn", function () {
				elPlayersList.classList.add("turn");
			});

			_view.playersController.subscribe("clearBets", function () {
				elPlayersList.classList.remove("turn");
			});
		}

		init.each = {
			"players": function (player, dom) {
				var li = dom.querySelector("li");

				player.propertyChanged("hasMadeBet", function (val) {
					if (val) {
						li.classList.add("ready");
					}
					else {
						li.classList.remove("ready");
					}
				});
			}
		};

		this.__construct = function () {
	        _view.template = new sparkling.Template(template, viewModel, init);
		};
	};

});

