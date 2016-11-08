var Hand = function() {

    var _this = this;

    this.pokerTableSvc = PokerTableSvc;

    Observable.mixin(_this);
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
};

var HandView = function (hand) {

	// var template = '\
	// 	<ul class="low">
	//		<spx:each val="card" in="cardsLow"> \
	// 			<li class="{{card.selected ? "selected" : ""}}">{{card.text}}</li> \
	//		</spx:each> \
	// 	</ul> \
	// 	<ul class="high"> \
	// 		<li>13</li> \
	// 		<li>20</li> \
	// 		<li>40</li> \
	// 		<li>100</li> \
	// 		<li>?</li> \
	// 		<li>&#x221e;</li> \
	// 	</ul> \
	// 	<button id="reset">Reset</button>';


	// var model = {
	// 	cardsLow: [],
	// 	cardsHigh: []
	// };

	// var t = new sparkling.Template(template, model, init);

	// function init() {

	// 	this.bind("li", "click", function (e, scope) {
	// 		var card = scope.model;
	// 		card.selected = !card.selected;
	// 	});

	// 	// this.bind("cardsLow.card", "render", function (li, card) {

	// 	// 	card.propertyChanged("selected", function (selected) {
    //     //         if (selected) {
    //     //             li.classList.add("selected");
    //     //         }
    //     //         else{
    //     //             li.classList.remove("selected");
    //     //         }
    //     //     });

	// 	// });
	// }

    var _model = hand;

    var _el_hand;
    var _el_btnReset;

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

    this.init = function (context) {

        _el_hand = _("#hand", context);
        _el_btnReset = _("#reset", context);

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
    };

    /**
     *
     */
    this.render = function () {

        var html = '<li class="template card-template"></li> \
                    <ul class="low"> \
                        <li>0</li> \
                        <li>1/2</li> \
                        <li>1</li> \
                        <li>2</li> \
                        <li>3</li> \
                        <li>5</li> \
                        <li>8</li> \
                    </ul> \
                    <ul class="high"> \
                        <li>13</li> \
                        <li>20</li> \
                        <li>40</li> \
                        <li>100</li> \
                        <li>?</li> \
                        <li>&#x221e;</li> \
                    </ul> \
                    <button id="reset">Reset</button>';


        var r = Re.render2(html);
        return r.dom;
    };

}