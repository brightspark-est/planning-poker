var HomeController = function HomeController() {
    
    var _server = DI.resolve("pokerTableHub.server");

    this.join = function (model) {
        
        var res = _server.join(model.name)
            .then(function () {
                console.log(this);
                console.log(arguments);
            });
        // 
        console.log(res);
    };

    this.load = function () {
        // todo -
    };

    this.undload = function () {
        
    }

    this.index = function () {

        return this.view("index");
    };
};

// inherit from base controller
HomeController.prototype = new Controller(); 
HomeController.prototype.constructor = HomeController;

Controller.addToFactory(HomeController);