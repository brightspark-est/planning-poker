var PlayersList = function() {

    this.pokerTableSvc = DI.resolve(PokerTableSvc);
    this.app = DI.resolve(App);

    Observable.mixin(this);
    Indexed.call(this);

    var _this = this;
    var _players = {};

    _this.regIndexOptimistic(_players, "add", "remove", "cid");

    /**
     * Get player by connection id
     */
    this.get = function (cid) {
        return _players[cid];
    }

    var _addPlayer = function(cid, dto) {
        var player = new Player(cid, dto.name);
        player.hasMadeBet = dto.hasBet;
        _this.publish("add", player);
    };

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
    _this.pokerTableSvc.playerJoined(_addPlayer);

    /**
     * Remove player from list
     */
    _this.pokerTableSvc.playerLeft(function(cid) {
        var player = _players[cid];
        _this.publish("remove", player);
    });

    /**
     *
     */
    _this.pokerTableSvc.turn(function (bets) {
        for (var cid in bets) {
            _players[cid].bet = bets[cid];
        }
        _this.publish("turn");
    });

    this.load = function () {

        _this.pokerTableSvc.server.getPlayers()
            .done(function(players) {
                for (var i in players) {
                    if (players.hasOwnProperty(i)) {
                        _addPlayer(i, players[i]);
                    }
                }
            });
    }
};


var PlayersListView = function (playersList) {

    var _ul;
    var _itemsViews = {};

    this.init = function (context) {

        _ul = _("#players", context);

        // load template
        var _el_itemTemplate = _(".template", _ul);
        _ul.removeChild(_el_itemTemplate);
        _el_itemTemplate.classList.remove("template");
        var itemTemplate = _el_itemTemplate.outerHTML;

        playersList.subscribe("add", function (player) {

            // create player view
            var li = parseHtml(itemTemplate);
            if (player.hasMadeBet) {
                li.classList.add("ready");
            }

            var view = {
                li: li,
                el_playerName: _(".name", li),
                el_bet: _(".bet", li)
            };

            _itemsViews[player.cid] = view;

            // init
            view.el_playerName.innerHTML = player.name;

            // update DOM on property changed event
            player
                .propertyChanged("name", function (val) {
                    view.el_playerName.innerHTML = val;
                })
                .propertyChanged("bet", function (val) {
                    view.el_bet.innerHTML = val;
                })
                .propertyChanged("hasMadeBet", function (val) {
                    if (val) {
                        view.li.classList.add("ready");
                    }
                    else {
                        view.li.classList.remove("ready");
                    }
                });

            _ul.appendChild(li);
        });

        playersList.subscribe("remove", function (player) {
            if (player) {
                var view = _itemsViews[player.cid];
                _ul.removeChild(view.li);
            }
        });

        playersList.subscribe("turn", function () {
            _ul.classList.add("turn");
        });

        playersList.subscribe("clearBets", function () {
            _ul.classList.remove("turn");
        });
    };

    this.render = function () {

        //await( this.loadTemplate("/views/playersList.html") );

        var html = '\
            Players \
            <ul id="players"> \
                <li class="template"> \
                    <span class="name"></span> \
                    <span class="bet"></span> \
                </li> \
            </ul>';

        var r = Re.render2(html);
        return r.dom;
    };

};