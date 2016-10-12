NS("views.home", function () {

    this.table = function (model) {

        // components        
        var _playersList;
        var _hand;
        
        // componets views
        // var _playersListView;
        // var _handView;

        var _this = this;
        var _model = model;

        var _dom;

        // /**
        //  * 
        //  */
        // var _init = function () {

        //     // load componets views
        //     // _playersListView = DI.resolve("component.playersList.view", _playersList, _domContext);
        //     // _handView = DI.resolve("component.hand.view", _hand, _domContext);

        //     // init components
        //     // _playersList.load();
        //     // _hand.load();
        // }

        /**
         * 
         */
        this.render = function () {
            
            if (!_dom) 
            {
                // note - markup can be fetched from server, inline (like current sample) or created manually (document.createElement)
                var template = '\
                <div class="table"> \
                    <div id="players-list-container"> \
                        <component:PlayersList /> \
                    </div> \
                    <div id="hand"> \
                        <component:Hand /> \
                    </div> \
                </div>';

                var r = Re.render2(template);

                _dom = r.dom;
                _playersList = r.components.playerslist;
                _hand = r.components.hand;

            }

            return _dom;
        }
    };

});