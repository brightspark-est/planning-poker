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

var HandView = function (hand, context) {
    
}