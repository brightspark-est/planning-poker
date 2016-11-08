var HandController = (function HandController() {

    Controller.call(this);
    var _this = this;

    this.pokerTableSvc = PokerTableSvc;

    Observable.mixin(_this);
    Indexed.call(_this);

    var _selectedCard;

    var _cards = {};
    _this.regIndexOptimistic(_cards, "cardCreated", null, "uid");

    var CARD_NUMBERS = ["0", "1/2", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?", "∞"];
    
    Object.defineProperty(_this, "cards", {
        get: function () {
            return Object.values(_cards);
        }
    });

    /**
     *
     */
    this.addCard = function (card) {

        card.propertyChanged("selected", function (selected) {
            if (selected) {
                _this.pokerTableSvc.server.bet(card.value);
                if (_selectedCard) {
                    _selectedCard.selected = false;
                }
                _selectedCard = this;
            }
        });

        _this.publish("cardCreated", card);
    };

    /**
     *
     */
    this.reset = function() {
        _this.pokerTableSvc.server.reset();
    };

    /**
     *
     */
    this.tableHasBeenReset = function () {
        if (_selectedCard) {
            _selectedCard.selected = false;
            _selectedCard = undefined;
        }
    };

    /**
     *
     */
    this.createCards = function() {
        for (var i = 101; i <= 10000; i++) {
            var card = new Card(i, i);
            _this.addCard(card);
        }
    };

    /**
     *
     */
    this.load = function () {

    };

    this.index = function () {
        return this.__partial("/views/hand/index");
    };

    for (var i = 0; i < CARD_NUMBERS.length; i++){
        var card = new Card(CARD_NUMBERS[i], CARD_NUMBERS[i]);
        _this.addCard(card);
    }

}).extends(Controller);