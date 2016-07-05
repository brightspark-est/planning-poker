var TableController = (function TableController() {
    
    Controller.call(this);
    // var _pokerTableSvc = DI.resolve("PokerTableSvc");
    // var _app = DI.resolve("app");

    // var _this = this;
    // Observable.call(_this);
    
    // var _selectedCard;
    // var _cards = {};

    // this.addCard = function (card) {
        
    //     _cards[card.uid] = card;
    //     card.propertyChanged("selected", function (selected) {
    //         if (selected) {
    //             _pokerTableSvc.server.bet(card.value);
    //             if (_selectedCard) {
    //                 _selectedCard.selected = false;
    //             }
    //             _selectedCard = this;
    //         }
    //     });
    // }

    // this.reset = function() {
    //     _pokerTableSvc.server.reset();
    // }
    
    // this.tableHasBeenReset = function () {
    //     if (_selectedCard) {
    //         _selectedCard.selected = false;
    //         _selectedCard = undefined;
    //     }
    // };

    /**
     * 
     */
    this.index = function () {
        return this.__partial(PlanningPoker, "views.home", "table");
    }
}).extends(Controller);