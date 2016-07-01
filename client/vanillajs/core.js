var __ = function(selector, el) {
    return (el || document).querySelectorAll(selector);
};

var _ = function(selector, el) {
    return (el || document).querySelector(selector);
};

var _id = function (id) {
    return document.getElementById(id);
};

var parseHtmlHelper = document.createElement("div");
var parseHtml = function(html) {
    parseHtmlHelper.innerHTML = html;
    return parseHtmlHelper.firstElementChild;
};

var serializeForm = function (form) {
    var data = {};
                                
    var inputs = __("input, textarea", form);
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        data[input.name] = input.value;
    }
    
    var selects = __("select", form);
    for (var i = 0; i < selects.length; i++) {
        var select = selects[i];
        var selectedOption = select.options[select.selectedIndex];
        data[select.name] = selectedOption.value;
    }
};

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

var regStdProp = function (_this, name, ref) {
    
    var prop = stdProp(_this, name, ref);
    Object.defineProperty(_this, name, prop);
}

var regStdProps = function (_this, props) {
    
    for (var propName in props) {
        if (props.hasOwnProperty(propName))
        {
            regStdProp(_this, propName, props[propName])
        }
    }
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

/**
 * Clone object
 */
var clone = function (obj) {
    var target = {};
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            target[i] = obj[i];
        }
    }
    return target;
};

var Observable = function () {

    if (typeof this.on === "function"){
        // already observable
        return;
    }

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

    var _publish = function (eventName, args) {
        
        if (!_handlers[eventName]) {
            return;
        } 
        
        for (var i = 0; i < _handlers[eventName].length; i++) {
            var handlerResult = _handlers[eventName][i].apply(_this, args);
            if (handlerResult === false) {
                return false;
            }
        }
    }

    this.applyPublish = function (eventName, args) {
        _publish(eventName, args);
    }

    /**
     * Trigger event
     * @param {} eventName 
     * @returns {} 
     */
    this.publish = function (eventName) {
        if (!_handlers[eventName]) {
            return;
        }

        // same as: var args = [].slice.call(arguments, 1);
        // but with a bit better performance
        var l = arguments.length
        var args = new Array(l-1);
        for (var i = 1; i < l; i++) {
            args[i-1] = arguments[i];
        }
  
        return _publish(eventName, args);
    };
    
    /**
     * Helper function to create publish-subscribe function
     * @param {string} eventName
     */
    this.createPubSub = function (eventName) {
        return function () {
            
            var handler = arguments[0];
            if (typeof handler === "function") {
                _this.on(eventName, handler);
                return _this;
            }
            
            _publish(eventName, arguments);
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
            return _this;
        }
        
        var a1 = args[1];
        
        // ALT2
        if (args.length == 2 && typeof a0 === "string" && typeof a1 === "function") {
            _this.on("propertyChanged-" + a0, a1);
            return _this;
        }
        
        var l = args.length
        var namedPropertyChangedArgs = new Array(l);
        for (var i = 0; i < l; i++) {
            namedPropertyChangedArgs[i] = args[i];
        }
        
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


var Indexed = function () {
    
    var _this = this;
    Observable.call(_this);

    /*
	* Check if is empty object
	* @param {object} obj
	*/
	function isEmpty(obj) {

		// null and undefined are "empty"
        // or it is an empty array
		if (obj == null || obj.length === 0) return true;
	
		// non-empty array
		if (obj.length > 0) return false;
		
		// Otherwise, does it have any properties of its own?
		// Note that this doesn't handle
		// toString and valueOf enumeration bugs in IE < 9
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) return false;
		}
	
		return true;
	}

    /**
     * 
     */
    function addObjectToIndex(temp, xval, o) {
        if (!temp[xval]) {
            temp[xval] = [];
        }
        temp[xval].push(o);
    }

    /**
     * 
     */
    function removeObjectFromIndex(ix, propValue, o) {
        ix[propValue] = grep(ix[propValue], function (i) { return i !== o });
        if (ix[propValue].length === 0) {
            delete ix[propValue];    
        }
    }
    
    /**
     * 
     */
    function addObjectToIndexOptimistic(temp, xval, o) {
        temp[xval] = o;
    }
    
    /**
     * 
     */
    function removeObjectFromIndexOptimistic(ix, propValue) {
        delete ix[propValue];
    }

    /**
     * 
     */
    function regIndex(ref, addEventName, removeEventName, indexCols, addFunc, removeFunc) {

        if (addEventName) {
            _this.on(addEventName, function(o) {

                var temp = ref;
                for (var i = 0; i < indexCols.length - 1; i++) {

                    var propName = indexCols[i];
                    var propValue = o[propName];
                    if (!temp[propValue]) {
                        temp[propValue] = {};
                    }
                    temp = temp[propValue];
                }

                var x = indexCols[indexCols.length - 1];
                var xval = o[x];
                
                addFunc(temp, xval, o);
            });
        }

        if (removeEventName) {
            function remove(ix, object, cols) {

                var propName = cols[0];
                var propValue = object[propName];

                if (cols.length === 1) {
                    removeFunc(ix, propValue, object);
                    return;
                }

                remove(ix[propValue], object, cols.splice(1));

                if (isEmpty(ix[propValue])) {
                    delete ix[propValue];
                }
            }

            _this.on(removeEventName, function (o) {
                var cols = indexCols.slice(0);
                remove(ref, o, cols);
            });
        }
    }

    /**
     * 
     */
    this.regIndexOptimistic = function(ref, addEventName, removeEventName) {
        var indexCols = [].splice.call(arguments, 3);
        regIndex(ref, addEventName, removeEventName, indexCols, addObjectToIndexOptimistic, removeObjectFromIndexOptimistic);
    };

    /*
    * Register new index.
    * Subscribes to events which will add or remove item from index
    * @param {object} ref -
    * @param {string} addEventName -
    * @param {string} removeEventName -    
    * @param {...string} cols - Index columns.
    */
    this.regIndex = function(ref, addEventName, removeEventName) {
        var indexCols = [].splice.call(arguments, 3);
        regIndex(ref, addEventName, removeEventName, indexCols, addObjectToIndex, removeObjectFromIndex);
    }
};


var Uid = function () {
    Object.defineProperty(this, "uid", {
        value: Uid.next++,
        writable: false
    });
};
Uid.next = 1;


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
    
var Router = function (rootUrl) {
    
    var _this = this;
    Observable.call(_this);
    Indexed.call(_this);
    
    var _rootUrl = rootUrl;
    
    //var _pages = {};
    //var _el_container;
    //var _currentPage;

    this.load = _this.createPubSub("load");
    
    var _routes = [];
    
    var _routesByPattern = {};
    _this.regIndexOptimistic(_routesByPattern, "map", "unmap", "pattern");
    
    var _routesByName = {};
    _this.regIndexOptimistic(_routesByName, "map", "unmap", "name");
    
    this.map = function (name, pattern, defaults) {
        
        var routeSegments = pattern.split("/");
        var route = {
            name: name,
            pattern: pattern,
            defaults: defaults,
            segments: routeSegments
        };
        
        _routes.push(route);
        
        _this.publish("map", route);
        return _this;
    };
    
    this.getRouteInfo = function (url) {
        
        // make url relative
        if (url.indexOf(_rootUrl) === 0) {
            url = url.substring(_rootUrl.length);
        }
        
        var hash = "";
        var queryString = "";
        
        var i = url.indexOf("#");
        if (i === 0) {
            url = "";
            hash = url;
        }
        else if (i > 0) {
            var hash = url.substring(i);
            var url = url.substring(0, i-1);
        }
        
        var i = url.indexOf("?");
        if (i === 0) {
            url = "";
            queryString = url;
        }
        else if (i > 0) {
            queryString = url.substring(i);
            url = url.substring(0, i-1);
        }
        
        var segments = url.split("/");
        
        var match;
        var routeParams = {};
        
        for (var i = 0; i < _routes.length; i++) {
            var route = _routes[i];
            
            var routeSegments = route.segments;
            var currentRouteParams = clone(route.defaults);
            
            var found = true;            
            for (var j = 0; j < routeSegments.length; j++) { 
                var routeSegment = routeSegments[j];
                
                if (!routeSegment.startsWith(":")) {
                    
                    if (segments[j] != routeSegment)
                    {
                        found = false;
                        break;
                    }
                }
                else {
                    if (j < segments.length) {
                        currentRouteParams[routeSegment.substring(1)] = segments[j]
                    }
                }
            }
            
            if (found) {
                match = route;
                routeParams = currentRouteParams;
                break;
            }
        }
        
        return {
            url: url,
            hash: hash,
            queryString: queryString,
            //queryStringData: queryStringData,
            route: match,
            routeParams: routeParams
        };
    };
    
    this.url = function (name, params) {
        
    };
    
    this.goto = function (url, data, title) {
        
        history.pushState(data, title, url);
        
        _this.load(url);
    };
    
    var action = function () {
        
        var attributes = [];
        var f;
        for (var i = 0; i < arguments.length; i++) {
            
            var arg = arguments[i]; 
            if (Array.isArray[arg]) {
                attributes.concat(arg)
            }
            else if (typeof arg === "function") {
                f = arg;
                
                
                return f;
            }
        }
    };
    
    action.nameattr = function (name) {
        return new ActionNameAttribute(name);
    };
    
    this.action = action;
    
    
    /*
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
                    _pages[url] = _currentPage;
                    
                    _el_container.appendChild(_currentPage);
                    
                });
        }
    };*/
};


Function.prototype.extends = function (baseType) {
    var inheritedType = this;
    inheritedType.prototype = Object.create(baseType.prototype);
    inheritedType.prototype.constructor = inheritedType;

    // inheritedType.prototype.constructor = function () {

    //     baseType.call(this);
    //     inheritedType.apply(this, arguments);

    // };
    return inheritedType;
}