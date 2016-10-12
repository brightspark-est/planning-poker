NS("views.home", function () {

    this.index = function (model) {
        
        var _this = this;
        var _model = model;

        var _el_joinform;    
        var _el_name;

        /**
         * 
         */
        var _init = function (domContext) {

            _el_joinform = _("#join-form", domContext);
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

            // note - markup can be fetched from server, inline (like current sample) or created manually
            var html = '\
                <div class="join"> \
                    <h1>Planning Poker</h1> \
                    <form id="join-form" action=""> \
                        <input type="text" id="name"/> \
                        <button type="submit">Join</button> \
                    </form> \
                </div>';
            
            var r = Re.render2(html);
            _init(r.domContext);
            
            return r.dom;
        }
    };
});