(function (pp) {

    var _ns_home = NS.require(pp, "views.home");

    _ns_home.table = function Table(model) {

        // components        
        var _playersList = new PlayersList();
        var _hand = new Hand();
        
        // componets views
        var _playersListView;
        var _handView;

        var _this = this;
        var _model = model;

        var _domContext;

        /**
         * 
         */
        var _init = function () {

            // load componets views
            _playersListView = DI.resolve("component.playersList.view", _playersList, _domContext);
            _handView = DI.resolve("component.hand.view", _hand, _domContext);

            // init components
            _playersList.load();
            _hand.load();
        }

        /**
         * 
         */
        this.render = function () {
            
            if (!_domContext) 
            {
                // note - markup can be fetched from server, inline (like current sample) or created manually (document.createElement)
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

            return _domContext;
        }
    };

})(PlanningPoker);