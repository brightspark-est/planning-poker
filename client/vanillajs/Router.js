var Router = function (config) {

    var _this = this;

    var _routes = config.routes;
    var _filters = [];
    var _routesByName = {};

    var _routeData;
    var _url;

    Object.defineProperties(this, {
        "routeData": {
            get: function () {
                return _routeData;
            }
        },
        "url": {
            get: function () {
                return _url;
            }
        }
    });

    /**
     * Register handler to be used
     */
    this.use = function (handler) {
        _filters.push(handler);
        return _this;
    };

    var _errorHandler = function (next) {

        try {
            next();
        }
        catch(e) {
            console.error(e);
        }
    };
    this.use(_errorHandler);

    var _virtualDirectoryHandler = function (next) {
        if (config.virtualDirectory) {
            _url = _url.replace(config.virtualDirectory, "");
        }
        next();
    };
    this.use(_virtualDirectoryHandler);

    var _routeHandler = function (next) {
        _routeData = this.matchRoute(_url);
        next();
    };
    this.use(_routeHandler);


    // create regex patterns for route patterns
    (function () {

        var normalizeCollection = function (collection) {

            var normalizedCollection = {};
            if (collection) {
                for (var defaultParamName in collection) {
                    if (collection.hasOwnProperty(defaultParamName)) {
                        normalizedCollection[defaultParamName.toLowerCase()] = collection[defaultParamName];
                    } 
                }
            }

            return normalizedCollection;
        }

        for (var i = 0; i < _routes.length; i++) {
            var route = _routes[i];
            _routesByName[route.name] = route;

            // get normalized (lower case) defaults collection
            route.defaults = normalizeCollection(route.defaults);

            // get normalized (lower case) constraints collection
            route.constraints = normalizeCollection(route.constraints)  

            var routeParams = [];
            var routeParamsByName = {};

            var regexPattern = route.pattern
                .replace(/\/(:)([^/?]*)((?:\?|))/gi, function (str, colon, paramName, optional) {

                    var paramDefinition = {
                        name: paramName, 
                        optional: optional === "?",
                        defaultValue: route.defaults[paramName],
                        constraints: route.constraints[paramName]
                    };
                    routeParams.push(paramDefinition);
                    routeParamsByName[paramDefinition.name] = paramDefinition;

                    var returnString = "";
                    returnString += "/";
                    if (optional) {
                        returnString += "*";
                    }

                    returnString += "([^/]*)" + optional;
                    return returnString;
                })
                 
            route.parameters = routeParams;
            route.parametersByName = routeParamsByName;
            route.regex = new RegExp(regexPattern, "i");
        }

    })();

    /**
     * 
     */
    this.matchRouteByParams = function (paramValues) {

        for (var i = 0; i < _routes.length; i++) {

            var route = _routes[i];

            var isMatch = true;
            for (var pi = 0; pi < route.parameters.length; pi++) {

                var routeParameter = route.parameters[pi];

                if (!(routeParameter.name in paramValues) && !(routeParameter.name in route.defaults) && !routeParameter.optional)
                {
                    isMatch = false;
                    break;
                }

                var val = paramValues[routeParameter.name] || routeParameter.defaultValue;
                if (typeof routeParameter.constraints === "function") {

                    if (!routeParameter.constraints(val)) {
                        isMatch = false;
                        break;
                    }
                }
            }

            // check default values for parameters which can not be set.
            // for instance /foo/:bar where '/foo' is alway static
            var controllerName = (paramValues.controller || "").toLowerCase();
            var defaultControllerName = (route.defaults.controller || "").toLowerCase();
            if (!("controller" in route.parametersByName) && defaultControllerName !== controllerName) {
                isMatch = false;
            }

            var actionName = (paramValues.action || "").toLowerCase();
            var defaultActionName = (route.defaults.action || "").toLowerCase();
            if (!("action" in route.parametersByName) && defaultActionName !== actionName) {
                isMatch = false;
            }
            
            if (isMatch) {
                return route.name;
            }
        }

    };

    /**
     * 
     */
    this.matchRoute = function (url) {

        for (var i = 0; i < _routes.length; i++) {

            var route = _routes[i];
            var match = url.match(route.regex);

            if (match) {
                
                var routeParameters = {};

                var matchesAllConstraints = true;
                for (var parameterIndex = 1; parameterIndex < match.length; parameterIndex++) {
                    var parameterValue = match[parameterIndex];

                    var parameterDefinition = route.parameters[parameterIndex-1];
                    var parameterName = parameterDefinition.name;
                    if (parameterValue === undefined) {
                        parameterValue = parameterDefinition.defaultValue;
                    }

                    routeParameters[parameterName] = parameterValue;

                    if (typeof parameterDefinition.constraints === "function") {

                        if (parameterDefinition.constraints(parameterValue) === false) {
                            matchesAllConstraints = false;
                            break;
                        }
                    }
                }

                if (!matchesAllConstraints) {
                    continue;
                }

                for (var parameterName in route.defaults) {
                    if (route.defaults.hasOwnProperty(parameterName)) {
                        if (routeParameters[parameterName] === undefined) {
                            routeParameters[parameterName] = route.defaults[parameterName];
                        }
                    }
                }

                var routeName = route.name;
                
                routeParameters.controller = routeParameters.controller.toLowerCase();
                routeParameters.action = routeParameters.action.toLowerCase();

                return {
                    name: routeName,
                    parameters: routeParameters,
                };
            }
        }

    };

    /**
     * 
     */
    this.start = function (url) {

        _url = url;
        
        var next = function() {};
        for (var i = _filters.length-1; i >= 0; i--) {
            next = (function (f, next) {
                return function () {
                    f.call(_this, next, config);
                };
            })(_filters[i], next);
        }

        next();
    };
    
    /**
     * 
     */
    this.navigateToAction = function (actionName, controllerName, parameters) {
        
        var url = this.urlAction(actionName, controllerName, parameters);
        window.history.pushState({}, "", url);
        this.start(url);
    };

    /**
     * 
     */
    this.navigateToRoute = function (routeName, parameters) {
        
        var url = this.urlRoute(routeName, parameters);
        window.history.pushState({}, "", url);
        this.start(url);
    };

    /**
     * 
     */
    this.urlAction = function (actionName, controllerName, parameters) {

        if (typeof arguments[1] === "object") {
            parameters = arguments[1];
            controllerName = undefined;
        }

        if (!parameters) {
            parameters = {};
        }

        parameters.action = actionName;
        parameters.controller = controllerName;

        if (parameters.controller === undefined && _routeData) {
            parameters.controller = _routeData.controller;
        }

        var routeName = this.matchRouteByParams(parameters);
        return this.urlRoute(routeName, parameters);
    };

    /**
     * 
     */
    this.urlRoute = function (routeName, parameters) {

        var route = _routesByName[routeName];
        var url = config.virtualDirectory || "";
        url += route.pattern
            .replace(/\/(:)([^/?]*)((?:\?|))/gi, function (str, colon, paramName, optional) {
                
                var val = undefined;
                if (paramName in parameters && parameters[paramName] !== undefined) {
                    val = parameters[paramName];
                }
                else if (route.defaults && paramName in route.defaults) {
                    val = route.defaults[paramName];
                }

                if (val !== undefined) {

                    if (paramName === "action" || paramName === "controller") {
                        val = val.toLowerCase();
                    }

                    return "/" + val;
                }

                if (optional) {
                    return "";
                }
                return "/";
            })

        return url;
    }

};  

Router.actionHandler = function (next, config) {


    var prevContent = config.body.firstElementChild;
    if (prevContent) {
        prevContent.className = prevContent.className.replace("loaded", "") + " unloaded";
    }

    var controllerName = this.routeData.parameters.controller + "controller";
    var controller = Controller.create(controllerName);

    var actionName = this.routeData.parameters.action;
    var action = Controller.getAction(controller, actionName);

    var view = action.call(controller, this.routeData.requestParameters);
    var content = view.render();

    content.className += " content";

    //config.body.innerHTML = "";
    config.body.appendChild(content);

    setTimeout(function() {
        content.className += " loaded";    
    }, 0);
    

    next();
};