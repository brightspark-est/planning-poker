var Controller = function() {
    
    this.__view = function (viewName) {


    }
        
};

(function factory() {

    var registry = {};

    var actionsRegistry = {};

    Controller.addToFactory = function (controller) {
        registry[controller.name.toLowerCase()] = controller;
    };

    Controller.exists = function (controllerName) {
        return registry[controllerName.toLowerCase()] !== undefined;
    }

    Controller.create = function (controllerName) {
        var controller = registry[controllerName.toLowerCase()];
        return new controller();
    };

    Controller.getAction = function (controller, actionName) {
        var controllerName = controller.constructor.name;
        if (!actionsRegistry[controllerName]) {

            actionsRegistry[controllerName] = {};

            for (var memberName in controller) {

                if (!controller.hasOwnProperty(memberName) || typeof controller[memberName] !== "function") {
                    continue;
                }

                actionsRegistry[controllerName][memberName.toLowerCase()] = controller[memberName];
            }
        }

        return actionsRegistry[controllerName][actionName];
    }
})();