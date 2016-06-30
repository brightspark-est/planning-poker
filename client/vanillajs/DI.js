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

            _registry[key] = {
                name: key,
                type: type,
                resolve: resolve
            }
        };

        this.resolve = function (serviceName) {
            var svcDefinition = _registry[serviceName];

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

 

var NS = new (function NS() {

    this.require = function (ref, ns) {

        ref = ref || {};

        if (ns) {
            var segments = ns.split(" ");
            for (var i = 0; i < segments.length; i++) {
                var name = segments[i];
                if (!(name in ref)) {
                    ref[name] = {};
                }
                ref = ref[name];
            }
        }

        return ref;
    }
});