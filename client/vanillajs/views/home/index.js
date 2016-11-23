NS("views.home", function () {

	var controllers = NS.require("controllers");

    this.index = function () {

        var _view = this;
		_view.homeController = controllers.home;

        var markup = '\
            <div class="join">\
                <h1>Planning Poker</h1>\
                <form id="join-form" action="">\
                    <input type="text" id="name" />\
                    <button type="submit">Join</button>\
                </form>\
            </div>';

        var viewModel = {};

        function init() {

            var _el_joinform = this.get("#join-form");
            var _el_name = this.get("#name", _el_joinform);

            this.bind("#join-form", "submit", function (e, scope) {
                e.preventDefault();
                _view.homeController.join({name: _el_name.value});
            });
        }

		this.template = new sparkling.Template(markup, viewModel, init);
    };
});