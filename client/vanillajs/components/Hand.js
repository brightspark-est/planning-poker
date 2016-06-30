var Hand = function() {

    var _pokerTableSvc = DI.resolve("PokerTableSvc");

    var _this = this;

    Observable.call(_this);
    Indexed.call(_this);

    var _selectedCard;
    
    var _cards = {};
    _this.regIndexOptimistic(_cards, "cardCreated", null, "uid");

    /**
     * 
     */
    this.addCard = function (card) {
        
        card.propertyChanged("selected", function (selected) {
            if (selected) {
                _pokerTableSvc.server.bet(card.value);
                if (_selectedCard) {
                    _selectedCard.selected = false;
                }
                _selectedCard = this;
            }
        });

        _this.publish("cardCreated", card);
    }

    /**
     * 
     */
    this.reset = function() {
        server.reset();
    }
    
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
    }

    /**
     * 
     */
    this.load = function () {

    }
};

var HandView = function (hand, context) {

    var _model = hand;

    var _el_hand = _("#hand", context);
    var _el_btnReset = _("#reset", context);

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
                    
    // discover existing cards from html
    var lis = __("li", _el_hand);
    for (var i = 0; i < lis.length; i++) {
        var li = lis[i];
        var val = li.textContent || li.innerText;
        var card = new Card(val, val);
        _model.addCard(card);
        bind(li, card);
    }
                
    _el_btnReset.addEventListener("click", function(e) {
        e.preventDefault();
        _model.reset();
    });

}