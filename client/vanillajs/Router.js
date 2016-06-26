var Router = function (config) {

    var _routes = config.routes;

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

            // get normalized (lower case) defaults collection
            route.defaults = normalizeCollection(route.defaults);

            // get normalized (lower case) constraints collection
            route.constraints = normalizeCollection(route.constraints)  

            var routeParams = [];

            var regexPattern = route.pattern
                .toLowerCase()
                .replace(/\/(:)([^/?]*)((?:\?|))/gi, function (str, colon, paramName, optional) {

                    routeParams.push({
                        name: paramName, 
                        optional: optional === "?",
                        defaultValue: route.defaults[paramName],
                        constraints: route.constraints[paramName]
                    });

                    var returnString = "";
                    returnString += "/";
                    if (optional) {
                        returnString += "*";
                    }

                    returnString += "([^/]*)" + optional;
                    return returnString;
                })
                 
            route.parameters = routeParams;
            route.regex = new RegExp(regexPattern);
        }

    })();

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
                return {
                    name: routeName,
                    parameters: routeParameters,
                };
            }
        }

    };

    this.start = function (url) {

        if (config.virtualDirectory) {
            url = url.replace(config.virtualDirectory, "");
        }

        var res = this.matchRoute(url);
        console.log(res);

        var controllerName = res.parameters.controller + "controller";
        console.log(controllerName);
        var controller = Controller.create(controllerName);

        var actionName = res.parameters.action;
        console.log(actionName);

        var action = Controller.getAction(controller, actionName);
        console.log(action);
    };

    

    this.url = function (parameters) {

    };

    this.routeUrl = function (routeName, parameters) {

        var route = _routes[routeName];
        if (typeof route === "undefined") {
            throw "Route with name '" + routeName + "' not defined.";
        }

    };

    this.navigateTo = function (parameters) {

    };

};  