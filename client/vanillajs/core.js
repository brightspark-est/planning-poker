var __ = function(selector, el) {
    return (el || document).querySelectorAll(selector);
};

var _ = function(selector, el) {
    return (el || document).querySelector(selector);
};

var parseHtmlHelper = document.createElement("div");
var parseHtml = function(html) {
    parseHtmlHelper.innerHTML = html;
    return parseHtmlHelper.firstElementChild;
}

/**
 * Faster alternative for filter
 * @param items
 * @param filter - the filter 
 */
var grep = function(items, filter) {
    var filtered = [];
    var len = items.length;
    for (var i = 0; i < len; i++) {
        var item = items[i];
        if (filter(item)) {
            filtered.push(item);
        }
    }

    return filtered;
};

var Observable = function () {

    var _this = this;
    var _handlers = {};

    /**
     * Subscribe to an event
     */
    this.on = function (eventName, handler) {
        if (typeof handler !== "function") {
            return;
        }

        if (!_handlers[eventName]) {
            _handlers[eventName] = [];
        }
        _handlers[eventName].push(handler);
    };

    /**
     * 
     * @param {} eventName 
     * @param {} handler 
     * @returns {} 
     */
    this.unsubscribe = function (eventName, handler) {
        if (_handlers[eventName]) {
            if (handler) {
                _handlers[eventName] = grep(_handlers[eventName], function (item) {
                    return item !== handler;
                });
            } else {
                _handlers[eventName] = [];
            }
        }
    };

    /**
     * Trigger event
     * @param {} eventName 
     * @returns {} 
     */
    this.publish = function (eventName) {
        if (!_handlers[eventName]) {
            return;
        }

        for (var i = 0; i < _handlers[eventName].length; i++) {
            var args = [].slice.call(arguments, 1);
            var handlerResult = _handlers[eventName][i].apply(_this, args);
            if (handlerResult === false) {
                return false;
            }
        }
    };
    
    /**
     * 
     */
    var publishSubscribe = function (eventName, args) {

        args = args || [];
        var handler = args[0];

        if (typeof handler === "function") {
            _this.subscribe(eventName, handler);
            return;
        }

        Array.prototype.unshift.call(args, eventName);
        _this.publish.apply(_this, args);
    }
    
    /**
     * 
     */
    this.createPubSub = function (eventName) {
        return function () {
            publishSubscribe(eventName, arguments);
            return _this;
        };
    }
    
    /**
     * 
     */
    this.propertyChanged = this.createPubSub("propertyChanged");
    
    /**
     * 
     */
    this.namedPropertyChanged = function (propertyName, handler) {
        var args = arguments.slice[1];
        var eventName = "propertyChanged-" + propertyName;
        publishSubscribe(eventName, args)
    }
}