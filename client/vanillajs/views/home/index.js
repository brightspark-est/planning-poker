NS("views.home", function () {

    this.index = function (model) {
        
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
            var template = '<h1>Planning Poker</h1>\
                    <form id="join-form" action="">\
                        <input type="text" id="name"/>\
                        <button type="submit">Join</button>\
                    </form>';

            var res = Re.render(template);

            return res;
        };

        // /**
        //  * 
        //  */
        // this.render = function () {

        //     if (!_domContext) 
        //     {
        //         // note - markup can be fetched from server, inline (like current sample) or created manually
        //         var html = '\
        //             <h1>Planning Poker</h1> \
        //             <form id="join-form" action=""> \
        //                 <input type="text" id="name"/> \
        //                 <button type="submit">Join</button> \
        //             </form>';

        //         _domContext = document.createElement("div");
        //         _domContext.className = "join";
        //         _domContext.innerHTML = html;

        //         _init();
        //     }

        //     return _domContext;
        // }
    };
});


// // Re -----------
// // GENERATED GODE
// // do not modify. changes will be overridden
// NS("views.home.index").template = 
// '<h1>Planning Poker</h1>\
// \
// <form id="join-form" action="">\
// \
//     <input type="text" id="name"/>\
//     <button type="submit">Join</button>\
// \
// </form>';