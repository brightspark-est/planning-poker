var HomeController = (function HomeController() {
    
    Controller.call(this);

    var _pokerTableSvc = DI.resolve("PokerTableSvc");
    var _app = DI.resolve("app");

    // var _indexView = DI.resolve("views.home.index");

    this.join = function (model) {
        
        _pokerTableSvc.server.join(model.name)
            .then(function () {
                _app.joined = true;
                _app.navigateToAction("index", "table")
            });
    };

    /**
     * Render join form
     */
    this.index = function index() {
        // note that function has also name
        return this.__partial();
    };

    // ALT2 
    // this.index = function () {
    //     return this.__partial("index");
    // };
    
}).extends(Controller);