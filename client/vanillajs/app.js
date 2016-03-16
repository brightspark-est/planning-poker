// objects

var Player = function(cid, name) {

    var _this = this;
    Observable.call(_this);
    
    var _cid = cid;
    var _name = {val: name};
    var _bet = { };
    var _hasMadeBet = {val: false};

    Object.defineProperty(_this, "cid", {
        get: function() { return _cid; }
    });
    
    regStdProps(_this, {
        name: _name,
        bet: _bet,
        hasMadeBet: _hasMadeBet
    })
};

var Card = function (text, value) {
    
    var _this = this;
    Observable.call(_this);
    Uid.call(_this);
    
    var _text = { val: text };
    var _value = { val: value };
    var _selected = {val: false };
    
    regStdProps(_this, {
        text: _text,
        value: _value,
        selected: _selected
    });
};

// services  / controllers or call them whaterver you like.
    
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

    //
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

var Hand = function(server) {

    var _this = this;
    Observable.call(_this);
    
    var _selectedCard;
    var _cards = {};

    this.addCard = function (card) {
        
        _cards[card.uid] = card;
        card.propertyChanged("selected", function (selected) {
            if (selected) {
                server.bet(card.value);
                if (_selectedCard) {
                    _selectedCard.selected = false;
                }
                _selectedCard = this;
            }
        });
    }

    this.reset = function() {
        server.reset();
    }
    
    this.tableHasBeenReset = function () {
        if (_selectedCard) {
            _selectedCard.selected = false;
            _selectedCard = undefined;
        }
    };
    
    this.createCards = function() {
        for (var i = 101; i <= 10000; i++) {
            var card = new Card(i, i);
            _this.addCard(card);
            _this.publish("cardCreated", card);
        }
    }
};

var HomeController = function(server) {
    
    this.join = function (model) {
        
        var res = server.join(model.name)
            .then(function () {
                console.log(this);
                console.log(arguments);
            });
        // 
        console.log(res);
    };
};

// views - handle DOM

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

var HandView = function (hand) {
    
    var _el_container = _id("hand");
    var _el_stressTest = _(".stress-test");
    
    // load template 
    var _el_itemTemplate = _(".card-template", _el_container);
    _el_container.removeChild(_el_itemTemplate);
    _el_itemTemplate.classList.remove("template");
    _el_itemTemplate.classList.remove("card-template");
    var itemTemplate = _el_itemTemplate.outerHTML;
    
    function bind (li, card) {
        (function scope(li, card) {
            li.addEventListener("click", function() {
                card.selected = !card.selected;
            });
            
            card.propertyChanged("selected", function (selected) {
                if (selected) {
                    li.classList.add("selected");
                }
                else{
                    li.classList.remove("selected");
                }
            });
            
        })(li, card);
    }
    
    hand.on("cardCreated", function (card) {
        var li = parseHtml(itemTemplate);
        li.innerHTML = card.text;
        bind(li, card);
        _el_stressTest.appendChild(li)
    });
        
    // discover existing cards from html
    var lis = __("li", _el_container);
    for (var i = 0; i < lis.length; i++) {
        var li = lis[i];
        var val = li.textContent || li.innerText;
        var card = new Card(val, val);
        hand.addCard(card);
        bind(li, card);
    }
    
    var _el_btnReset = _("#reset");
    _el_btnReset.addEventListener("click", function(e) {
        e.preventDefault();
        hand.reset();
    });
    
    var _el_btnCreateMoreCards = _id("create-cards");
    _el_btnCreateMoreCards.addEventListener("click", function (e) {
        e.preventDefault();
        hand.createCards();
    });
    
};

var IndexView = function (homeController) {
    
    var _el_joinform = _("#join-form");
    var _el_name = _("#name", _el_joinform);


    _el_joinform.addEventListener("submit", function(e) {
        e.preventDefault();
        homeController.join({name: _el_name.value});
    });    
};

// the app

var app = new (function () {
   
    var playersList;
    var hand;
    var pokerTableHub;
    
    var init = function(x) {
        
        var _cid = x.id;
        
        pokerTableHub.server.getAllPlayers()
            .done(function(players) {

                // warmed up. remove overlay

                // show all players
                for (var i in players) {
                    if (players.hasOwnProperty(i)) {
                        playersList.add(i, players[i]);
                    }
                }
            });
    };
   
   this.start = function () {

        pokerTableHub = $.connection.pokerTable;
        
        var indexView = new IndexView(new HomeController(pokerTableHub.server));
        
        playersList = new PlayersList();
        var playersListView = new PlayersListView(playersList);
        
        hand = new Hand(pokerTableHub.server);
        var handView = new HandView(hand);
        
        pokerTableHub.client.notifyNewPlayer = playersList.add;
        pokerTableHub.client.notifyPlayerLeft = playersList.remove;
        pokerTableHub.client.hasMadeBet = playersList.hasMadeBet;
        pokerTableHub.client.turn = playersList.turn;

        pokerTableHub.client.reset = function () {
            playersList.clearBets();
            hand.tableHasBeenReset();
        };
        
        // Start the connection
        $.connection.hub
            .start()
            .then(init);
    }; 
        
})();
        