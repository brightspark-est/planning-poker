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