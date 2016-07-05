var Re = new (function RenderEngine() {

    var _this = this;

    _this.render = function (template) {

        var o = {

        };

        return template.replace(/<component:([a-zA-Z][a-zA-Z0-9]*)(.*?)(?:\/>|$)/gi, function (s, componentName, attributes) {

            var args = s.match(/(([a-zA-Z][a-zA-Z0-9]*)=(?:'|")([a-z][a-z0-9]*)(?:'|"))/gi);

            var component = _this.componentFactory.create(componentName);
            return component.render();
        });

    };


})();