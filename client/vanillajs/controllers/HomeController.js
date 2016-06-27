var HomeController = function HomeController() {
    
    var _pokerTableSvc = DI.resolve("PokerTableSvc");
    var _app = DI.resolve("app");

    // var _indexView = DI.resolve("views.home.index");

    this.join = function (model) {
        
        var res = _pokerTableSvc.server.join(model.name)
            .then(function () {
                console.log(this);
                console.log(arguments);

                _app.navigateToAction("index", "table")
            });
        // 
        console.log(res);
    };

    // this.load = function () {
    //     // todo -
    // };

    // this.undload = function () {
        
    // }

    /**
     * 
     */
    this.index = function () {

        return this.__partial(PlanningPoker, "views.home", "index");
    };
};

// inherit from base controller
HomeController.prototype = new Controller(); 
HomeController.prototype.constructor = HomeController;

Controller.addToFactory(HomeController);