(function (w) {

    var _scope = w;
    var _nsInited = false;

    /**
     * Require object from given namespace
     */
    var require = function (ns) {

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

	w.NS = NS;

})(window);