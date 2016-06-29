(function (pp) {

    var _ns_home = NS.require(pp, "views.home");

    _ns_home.table = function Table(model) {

        // components        
        var _playersList = new PlayersList();
        // var _hand = new Hand();
        
        // componets views
        var _playersListView;
        var _handView;

        var _this = this;
        var _model = model;

        var _domContext;

        var _el_hand;
        var _el_btnReset;

        

        /**
         * 
         */
        var _init = function () {

            // load componets views
            _playersListView = DI.resolve("component.playersList.view", _playersList, _domContext);
            _handView = DI.resolve("component.hand.view", _hand, _domContext);

            // init components
            _playersList.load();
            // _hand.load();

            _el_hand = _("#hand", _domContext);
            _el_btnReset = _("#reset", _domContext);

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

        /**
         * 
         */
        this.render = function () {

            if (!_domContext) 
            {
                // note - markup can be fetched from server, inline (like current sample) or created manually
                var html = '\
                    Players \
            <ul id="players"> \
                <li class="template"> \
                    <span class="name"></span> \
                    <span class="bet"></span> \
                </li> \
            </ul> \
            <div id="hand"> \
                <li class="template card-template"></li> \
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
            </div> \
            <button id="reset">Reset</button>';

                _domContext = document.createElement("div");
                _domContext.innerHTML = html;

                _init();
            }

            // note - not supported by IE < 9
            return _domContext;
        }
    };

})(PlanningPoker);