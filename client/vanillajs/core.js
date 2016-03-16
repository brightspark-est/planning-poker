var __ = function(selector, el) {
    return (el || document).querySelectorAll(selector);
};

var _ = function(selector, el) {
    return (el || document).querySelector(selector);
};

var _id = function (id) {
    return document.getElementById(id);
}

var parseHtmlHelper = document.createElement("div");
var parseHtml = function(html) {
    parseHtmlHelper.innerHTML = html;
    return parseHtmlHelper.firstElementChild;
}

/**
 * Create property definition
 * @param {object} _this - Reference to this object 
 * @param {string} name - Property name
 * @param {object} ref - Value reference. { val : ... }
 */
var stdProp = function (_this, name, ref) {
    
    return {
            get: function() {
                return ref.val;
            },
            set: function (val) {
                if (val === ref.val) {
                    return;
                }

                var prevVal = ref.val;
                ref.val = val;
                _this.propertyChanged(name, ref.val, prevVal);
            }
        }
};

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
     * @param {string} eventName
     * @param {function} handler
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
     * Unsubscribe handler from event.
     * If handler is not set, all handlers will be unsubscribed from given event.
     * @param {string} eventName 
     * @param {function} handler 
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

        var args = [].slice.call(arguments, 1);
        for (var i = 0; i < _handlers[eventName].length; i++) {
            var handlerResult = _handlers[eventName][i].apply(_this, args);
            if (handlerResult === false) {
                return false;
            }
        }
    };
    
    /**
     * Helper function to create publish-subscribe function
     * @param {string} eventName
     */
    this.createPubSub = function (eventName) {
        return function () {
            
            var args = [].slice(arguments, 0);
            var handler = args[0];

            if (typeof handler === "function") {
                _this.on(eventName, handler);
                return;
            }

            [].unshift.call(args, eventName);
            _this.publish.apply(_this, args);
            
            return _this;
        };
    };
    
    /**
     * Publish or subscribe 'propertyChanged' event
     * publish always like this: 
     * propertyChanged("propName", val, prevVal)
     *
     * subscribe has two alternatives
     * ALT1: subscribe to all propertyChanged events
     *       propertyChanged(function (propName, val, prevVal) { ... })
     * ALT2: subscribe to certain propertyChanged event
     *       propertyChanged("propName", function (val, prevVal) { ... })
     */
    this.propertyChanged = function () {
        
        var args = arguments;
        var a0 = args[0];

        // ALT1
        if (typeof a0 === "function") {
            _this.on("propertyChanged", a0);
            return;
        }
        
        var a1 = args[1];
        
        // ALT2
        if (args.length == 2 && typeof a0 === "string" && typeof a1 === "function") {
            _this.on("propertyChanged-" + a0, a1);
            return;
        }
        
        var namedPropertyChangedArgs = [].slice.call(args, 0);
        
        // publish for ALT1
        var propChanged = [].unshift.call(args, "propertyChanged");
        _this.publish.apply(_this, args);
        
        // publish for ALT2
        var propName = [].shift.call(namedPropertyChangedArgs);
        var namedPropertyChangedEventName = "propertyChanged-" + propName;
        [].unshift.call(namedPropertyChangedArgs, namedPropertyChangedEventName);
        _this.publish.apply(_this, namedPropertyChangedArgs);
        
        return _this;
    };
};


// A-> $http function is implemented in order to follow the standard Adapter pattern
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
function http(url) {
 
  // A small example of object
  var core = {

    // Method that performs the ajax request
    ajax : function (method, url, args) {

      // Creating a promise
      var promise = new Promise( function (resolve, reject) {

        // Instantiates the XMLHttpRequest
        var client = new XMLHttpRequest();
        var uri = url;

        if (args && (method === 'POST' || method === 'PUT')) {
          uri += '?';
          var argcount = 0;
          for (var key in args) {
            if (args.hasOwnProperty(key)) {
              if (argcount++) {
                uri += '&';
              }
              uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
            }
          }
        }

        client.open(method, uri);
        client.send();

        client.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            // Performs the function "resolve" when this.status is equal to 2xx
            resolve(this.response);
          } else {
            // Performs the function "reject" when this.status is different than 2xx
            reject(this.statusText);
          }
        };
        client.onerror = function () {
          reject(this.statusText);
        };
      });

      // Return the promise
      return promise;
    }
  };

  // Adapter pattern
  return {
    'get' : function(args) {
      return core.ajax('GET', url, args);
    },
    'post' : function(args) {
      return core.ajax('POST', url, args);
    },
    'put' : function(args) {
      return core.ajax('PUT', url, args);
    },
    'delete' : function(args) {
      return core.ajax('DELETE', url, args);
    }
  };
};
    
var router = new (function () {
    
    var _this = this;
    Observable.call(_this);
    
    var _pages = {};
    var _el_container;
    var _currentPage;
    
    this.init = function (containerId) {
        _el_container = _id(containerId);
        return _this;
    }
    
    this.load = function (url) {
        
        if (_pages[url]) {
            return new Promise(function (resolve, reject) {
                _currentPage = _pages[url];
                _el_container.appendChild(_currentPage);
                resolve();
            });
        }
        else {
            
            // todo - start loading
            
            return http(url)
                .get()
                .then(function (res) {
                    
                    if (_currentPage) {
                        _el_container.removeChild(_currentPage);
                    }
                    
                    _currentPage = document.createElement("div");
                    _currentPage.innerHTML = res;
                    pages[url] = _currentPage;
                    
                    _el_container.appendChild(_currentPage);
                    
                });
        }
    };
})();