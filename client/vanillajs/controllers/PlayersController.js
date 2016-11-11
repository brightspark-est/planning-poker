var PlayersController = (function PlayersController() {

    Controller.call(this);

    Observable.mixin(this);
    Indexed.call(this);

    this.pokerTableSvc = PokerTableSvc;
    this.app = App;

    var _this = this;
    var _players = {};

    _this.regIndexOptimistic(_players, "add", "remove", "cid");

	this.PlayersController = function () {

		/**
		 * Subscribe to hasMadeBet event to update players status
		 */
		_this.pokerTableSvc.hasMadeBet(function(cid) {
			var player = _this.get(cid);
			if (player) {
				player.hasMadeBet = true;
			}
		});

		/**
		 * Server notifies if some other player has joined the table
		 */
		_this.pokerTableSvc.playerJoined(addPlayer);

		/**
		 * Remove player from list
		 */
		_this.pokerTableSvc.playerLeft(function(cid) {
			var player = _players[cid];
			_this.publish("remove", player);
		});

		/**
		 * Players have to show their bets
		 */
		_this.pokerTableSvc.turn(function (bets) {
			for (var cid in bets) {
				_players[cid].bet = bets[cid];
			}
			_this.publish("turn");
		});

        _this.pokerTableSvc.server.getPlayers()
            .done(function(players) {
                for (var i in players) {
                    if (players.hasOwnProperty(i)) {
                        addPlayer(i, players[i]);
                    }
                }
            });
	};

    /**
     * Get player by connection id
     */
    this.get = function (cid) {
        return _players[cid];
    };

    /**
     * Render join form
     */
    this.index = function index() {
        // note that function has also name
        return this.__partial("/views/players/index");
    };

    function addPlayer(cid, dto) {
        var player = new Player(cid, dto.name);
        player.hasMadeBet = dto.hasBet;
        _this.publish("add", player);
    }

}).extends(sparkling.ControllerBase);
