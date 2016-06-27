var Controller = function() {
    
    var _view_cache = {};

    this.__view = function (viewName) {


    }

    this.__partial = function (nsRef, ns, viewName) {

        var key = ns + "." + viewName;
        if (!_view_cache[key]) {
            var context = NS.require(nsRef, ns);
            _view_cache[key] = new context[viewName](this);
        }

        return _view_cache[key];
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