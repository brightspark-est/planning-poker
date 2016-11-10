NS("views.hand", function () {

    this.index = function (hand) {

        var template = '\
        	<ul class="low">\
        		<spx:each val="card" in="cardsLow"> \
        			<li>{{card.text}}</li> \
        		</spx:each> \
        	</ul> \
        	<ul class="high"> \
        		<spx:each val="card" in="cardsHigh"> \
        			<li>{{card.text}}</li> \
        		</spx:each> \
        	</ul> \
        	<button id="reset">Reset</button>';

        var cards = hand.cards;
        var viewModel = {
            cardsLow: cards.filter(function (x, i) { return i <= 6 }),
            cardsHigh: cards.filter(function (x, i) { return i > 6 })
        };

        function init() {

            this.bind("li", "click", function (e, scope) {
                var card = scope.model;
                card.selected = !card.selected;
            });

            this.bind("#reset", "click", function () {
                hand.reset();
            });
        }

		function eachCard(card, dom) {
			var li = dom.querySelector("li");
			card.propertyChanged("selected", function (selected) {
				if (card.selected) {
					li.classList.add("selected");
				}
				else{
					li.classList.remove("selected");
				}
			});
		}

		init.each = {
			"cardsLow": eachCard,
			"cardsHigh": eachCard
		};

        var t = new sparkling.Template(template, viewModel, init);

        this.render = function () {
            return t.dom;
        };
    };
});