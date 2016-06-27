var PlayersList = function() {
    
    Observable.call(this);
    var _this = this;
    var _players = {};

    //
    this.get = function (cid) {
        return _players[cid];
    }

    //
    this.turn = function(values) {
        for (var i in values) {
            if (values.hasOwnProperty(i)) {
                var player = _this.get(i);
                player.bet = values[i];
            }
        }
        _this.publish("turn");
    };

    //
    this.hasMadeBet = function(cid) {
        var player = _this.get(cid);
        if (player) {
            player.hasMadeBet = true;
        } 
    };

    // 
    this.add = function(cid, playerName) {
        var player = new Player(cid, playerName);
        _players[cid] = player;
        _this.publish("add", player);
    };

    //
    this.remove = function(cid) {
        var player = _players[cid];
        delete _players[cid];
        _this.publish("remove", player);
    };

    // ???
    this.clearBets = function() {
        for (var i in _players) {
            if (_players.hasOwnProperty(i)) {
                var player = _players[i];
                player.hasMadeBet = false;
                player.bet = "";
            }
        }
        _this.publish("clearBets");
    }
};


var PlayersListView = function (playersList) {
    
    var _ul = _id("players");
    var _itemsViews = {};
    
    // load template 
    var _el_itemTemplate = _(".template", _ul);
    _ul.removeChild(_el_itemTemplate);
    _el_itemTemplate.classList.remove("template");
    var itemTemplate = _el_itemTemplate.outerHTML;
    
    playersList.on("add", function (player) {

        // create player view                    
        var li = parseHtml(itemTemplate);
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
    
    playersList.on("remove", function (player) {
        if (player) {
            var view = _itemsViews[player.cid];
            _ul.removeChild(view.li);
        }
    });
    
    playersList.on("turn", function () {
        _ul.classList.add("turn");                    
    });
    
    playersList.on("clearBets", function () {
        _ul.classList.remove("turn");                    
    });
    
};