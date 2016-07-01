(function (pp) {

    var _ns_home = NS.require(pp, "views.home");

    _ns_home.index = function Index(model) {
        
        var _this = this;
        var _model = model;

        var _domContext;

        var _el_joinform;    
        var _el_name;

        /**
         * 
         */
        var _init = function () {

            _el_joinform = _("#join-form", _domContext);
            _el_name = _("#name", _el_joinform);

            _el_joinform.addEventListener("submit", function(e) {
                e.preventDefault();
                _model.join({name: _el_name.value});
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
                    <h1>Planning Poker</h1> \
                    <form id="join-form" action=""> \
                        <input type="text" id="name"/> \
                        <button type="submit">Join</button> \
                    </form>';

                _domContext = document.createElement("div");
                _domContext.className = "join";
                _domContext.innerHTML = html;

                _init();
            }

            // note - not supported by IE < 9
            return _domContext;
        }
    };

})(PlanningPoker);