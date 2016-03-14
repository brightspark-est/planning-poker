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
    
var navigator = new (function () {
    
    var _this = this;
    Observable.call(_this);
    
    var _pages = {};
    var _el_container;
    var _currentPage;
    
    this.init = function (containerId) {
        _el_container = _id(containerId);
    }
    
    this.loadPage = function (url) {
        
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