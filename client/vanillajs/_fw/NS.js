
(function (w) {

    var _scope = w;

    /**
     * Require object from given namespace
     */
    var require = function (ns) {

        var ref = _scope;

        var segments = ns.split(".");
        for (var i = 0; i < segments.length; i++) {
            var name = segments[i];
            if (!(name in ref)) {
                ref[name] = {};
            }
            ref = ref[name];
        }

        return ref;
    };

    w.NS = function NS(nsString, f) {
        var ns = require(nsString);
        f.call(ns);
    };

    w.NS.require = require;

    var nsInited = false;
    /**
     * Set scope.
     * window if not defined
     */
    w.NS.init = function (scope) {

        if (nsInited) {
            console.error("NS already initialized");
            return;
        }

        _scope = scope;
        nsInited = true;
    }

})(window);