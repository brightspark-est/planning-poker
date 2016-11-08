var HomeController = (function HomeController() {

    Controller.call(this);

    this.pokerTableSvc = PokerTableSvc;
    this.app = App;

    var _this = this;

    this.join = function (model) {

        _this.pokerTableSvc.server.join(model.name)
            .then(function () {
                _this.app.joined = true;
                _this.app.navigateToAction("index", "table")
            });
    };

    /**
     * Render join form
     */
    this.index = function index() {
        // note that function has also name
        return this.__partial("/views/home/index");
    };

    // ALT2
    // this.index = function () {
    //     return this.__partial("index");
    // };

}).extends(Controller);