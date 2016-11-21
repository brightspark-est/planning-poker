(function (w) {

    var _scope = w;
    var _nsInited = false;

    function NS(nsString, f) {
        var ns = require(nsString);
        f.call(ns);
    }

    NS.require = require;

    /**
     * Set scope.
     * window if not defined
     */
    NS.init = function (scope) {

        if (_nsInited) {
            console.error("NS already initialized");
            return;
        }

        _scope = scope;
        _nsInited = true;
    };

	/**
	 * Get all types from given namespaces
	 */
	NS.getTypesFrom = function (namespaces) {

		var ret = {};
		for (var i = 0; i < arguments.length; i++) {
			var namespace = arguments[i];
			regNamespace(ret, namespace);
		}
		return ret;
	};

	/**
     * Require object from given namespace
     */
    function require(ns) {

        var ref = _scope;

        var segments = ns.split(".");
        for (var i = 0; i < segments.length; i++) {
            var name = segments[i];

			if (!ref.hasOwnProperty(name)) {
				ref[name] = {};
			}

            ref = ref[name];
        }

        return ref;
    };

	function regNamedObjects(target, rootPath, root) {

		for (var i in root) {

			if (!root.hasOwnProperty(i)){
				continue;
			}

			var object = root[i];
			var constructorName = object.constructor.name;
			if (constructorName === "Function") {
				constructorName = i;
			}

			if (constructorName && constructorName !== "Object") {
				target[rootPath + "." + constructorName] = object;
			}
			else {
				regNamedObjects(target, rootPath + "." + i, object);
			}
		}
	}

	function regNamespace(target, ns) {

		var scope = _scope;
		var segments = ns.split(".");
        for (var i = 0; i < segments.length; i++) {
            var name = segments[i];

			if (!scope.hasOwnProperty(name)) {
				// invalid namespace
				return {};
			}

            scope = scope[name];
        }

		regNamedObjects(target, ns, scope);
	}

	w.NS = NS;

})(window);