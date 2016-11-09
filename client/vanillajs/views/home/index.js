NS("views.home", function () {

    this.index = function (model) {

        var _model = model;
        var template = '\
            <div class="join">\
                <h1>Planning Poker</h1>\
                <form id="join-form" action="">\
                    <input type="text" id="name" />\
                    <button type="submit">Join</button>\
                </form>\
            </div>';

        var viewModel = {};
        var t = new sparkling.Template(template, viewModel, init);

        function init() {

            var _el_joinform = this.get("#join-form");
            var _el_name = this.get("#name", _el_joinform);

            this.bind("#join-form", "submit", function (e, scope) {
                e.preventDefault();
                _model.join({name: _el_name.value});
            });
        }

        /**
         *
         */
        this.render = function () {
            return t.dom;
        };

    };
});