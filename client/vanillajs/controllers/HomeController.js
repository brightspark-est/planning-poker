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
     * 
     */
    this.index = function () {

        return this.__partial(PlanningPoker, "views.home", "index");
    };
}).extends(Controller);

Controller.addToFactory(HomeController);