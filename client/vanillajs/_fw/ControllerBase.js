var Controller = function() {

    var _view_cache = {};

    this.__view = function (viewName) {


    }

    this.__partial = function (viewName) {

        if (!viewName) {
            viewName = arguments.callee.caller.name;
        }

        if (viewName.charAt("0") !== "/") {
            var controllerName = this.constructor.name.toLowerCase().replace("controller", "");
            viewName = "/views/" + controllerName + "/" + viewName;
        }

        var key = viewName.slice(1).replace(/\//g, ".");
        if (!_view_cache[key]) {
            var view = NS.require(key);
            _view_cache[key] = new view(this);
        }

        return _view_cache[key];
    };

    this.unknownAction = function (actionName) {
        // default unknown action handler
    };

	this.__setup = function () {

		var constructor = this[this.constructor.name];
		if (typeof constructor  === "function") {
			constructor();
		}
	};

};

(function factory() {

    // var registry = {};

    var actionsRegistry = {};

    // Controller.addToFactory = function (controller) {
    //     registry[controller.name.toLowerCase()] = controller;
    // };

    // Controller.exists = function (controllerName) {
    //     return registry[controllerName.toLowerCase()] !== undefined;
    // }

    // Controller.create = function (controllerName) {
    //     var controller = registry[controllerName.toLowerCase()];
    //     return new controller();
    // };

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