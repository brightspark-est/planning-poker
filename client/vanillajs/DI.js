var DI;
(function (w) {

    function DI() {

        var _registry = {};

        var _instances = {};

        this.register = function (type, resolve) {

            var key;
            if (typeof type === "string") {

                key = arguments[0];
                type = arguments[1];
                resolve = arguments[2];
            }
            else {
                key = type.name;
            }

            key = key.toLowerCase();
            _registry[key] = {
                name: key,
                type: type,
                resolve: resolve
            }
        };

        this.resolve = function (serviceName) {
            var key = serviceName.toLowerCase();
            var svcDefinition = _registry[key];

            var args = [].slice.call(arguments, 1);
            return svcDefinition.resolve.apply(svcDefinition, args);
        };

        this.singleton = function () {

            var key = this.name;
            if (!(key in _instances)) {
                _instances[key] = new this.type();
            }

            return _instances[key];
        };

        this.transient = function () {

            var args = [].slice.call(arguments, 0);
            args.unshift(null);
            return new (Function.prototype.bind.apply(this.type, args));
        }
    }

    w.DI = new DI();
})(window);

 
(function (w) {

    var _scope = w;

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
    w.NS.init = function (scope) {

        if (nsInited) {
            console.error("NS already initialized");
            return;
        }

        _scope = scope;
        nsInited = true;
    }

})(window);