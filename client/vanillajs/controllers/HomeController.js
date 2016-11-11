NS("controllers", function () {

	this.home = function HomeController() {

		ControllerBase.call(this);

		this.pokerTableSvc = PokerTableSvc;
		this.app = App;

		var _this = this;

		this.join = function (model) {

			_this.pokerTableSvc.server.join(model.name)
				.then(function () {
					_this.app.joined = true;
					_this.app.navigateToAction("index", "table");
				});
		};

		/**
		 * Render join form
		 */
		this.index = function index() {
			// note that function has also name
			return this.__view("/views/home/index");
		};
	};

	this.home.extends(ControllerBase);
});