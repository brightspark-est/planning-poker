NS("views.players", function () {

	this.index = function (playersList) {

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

			playersList.subscribe("add", function (player) {
				viewModel.players.push(player);
			});

			playersList.subscribe("remove", function (player) {
				viewModel.players.remove(player);
			});

			playersList.subscribe("turn", function () {
				elPlayersList.classList.add("turn");
			});

			playersList.subscribe("clearBets", function () {
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

        var t = new sparkling.Template(template, viewModel, init);

        this.render = function () {
            return t.dom;
        };

	};

});

