var Re = new (function RenderEngine() {
    var _this = this;

    var renderedHtml = function (html) {
        this.html = html;
    };

    renderedHtml.prototype.toString = function () {
        return this.html;
    };
    
    var insertAfter = function (newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    
    var removeElement = function (el) {
        el.parentElement.removeChild(el);
    }

    _this.render2 = function (template) {
        
        var div = document.createElement("div");
        div.innerHTML = template;
        
        var all = div.querySelectorAll("*");
        
        var components = {};
        
        // keep track of not named components count
        var counts = {};
        
        for (var i = 0; i < all.length; i++) {
            
            var el = all[i];
            var elTagName = el.tagName;
            
            var m = elTagName.match(/^component:([a-zA-Z][a-zA-Z0-9]*)/i);
            if (m) {
                var componentName = m[1];
                var component = _this.componentFactory.create(componentName);
                
                var name = el.getAttribute("name");
                if (!name) {
                    // convention for not named components
                    name = componentName.toLowerCase()
                    if (!counts[name]) {
                        counts[name] = 1;
                    }
                    else {
                        name += counts[name];
                    }
                    counts[name] +=1;
                }
                else {
                    name = name.toLowerCase();
                }
                components[name] = component;
                                
                var view = _this.componentFactory.createView(componentName, component, el);
                var componentViewDom = view.render();
                
                while (componentViewDom.length) {
                    el.parentNode.insertBefore(componentViewDom[0], el);
                }
                
                removeElement(el);
                
                view.init(div);
                component.load();
            }
        }
        
        return {
            components: components,
            domContext: div,
            dom: div.childNodes
        };
    }

    /**
     * Render string template
     */
    _this.render = function (template, domContext) {

        // 
        var model = {};

        // keep track of not named components count
        var counts = {};

        var components = [];
        
        var html = template.replace(/<component:([a-zA-Z][a-zA-Z0-9]*)(.*?)(?:\/>|$)/gi, function (s, componentName, attributesString) {

            var component = _this.componentFactory.create(componentName);
            components.push(component);

            component.view = _this.componentFactory.createView(componentName, component, domContext);

            var name;

            var attributes = {};
            attributesString = attributesString.trim();

            if (attributesString) {
                // parse attributes string

                var currentAttributeName = "";
                var currentAttributeValue = "";
                var currentParenthesis = "";

                var readAttributeName = true;
                for (var i = 0; i < attributesString.length; i++) {
                    var c = attributesString.charAt(i);

                    if (readAttributeName) {

                        if (c === "=") {
                            // end of attribute name
                            readAttributeName = false;
                            continue;
                        }

                        if (c === " ") {
                            // end of attribute name
                            if (currentAttributeName) {
                                attributes[currentAttributeName] = null;
                            }
                            currentAttributeName = "";
                            continue;
                        }

                        currentAttributeName += c;
                    }
                    else {
                        // read value
                        if (!currentParenthesis) {
                            if (c !== '"' && c !== "'") {
                                i--;
                                readAttributeName = true;
                            }
                            else {
                                currentParenthesis = c;
                            }
                            continue;
                        }

                        if (c === currentParenthesis) {

                            var wasEscaped = attributesString.charAt(i-1) === "\\" && attributesString.charAt(i-2) !== "\\";
                            if (!wasEscaped) {
                                attributes[currentAttributeName] = currentAttributeValue;
                                currentAttributeName = "";
                                currentAttributeValue = "";
                                currentParenthesis = "";
                                readAttributeName = true;
                                continue;
                            }
                        }

                        currentAttributeValue += c;
                    }
                }
            }
            name = attributes["name"];

            if (!name) {
                // convention for not named components
                name = componentName.charAt(0).toLowerCase() + componentName.slice(1);
                if (!counts[name]) {
                    counts[name] = 1;
                }
                else {
                    name += counts[name];
                }
                counts[name] +=1;
            }

            model[name] = component;

            return component.view.render();
        });

        var res = new renderedHtml(html);
        res.model = model;

        res.complete = function () {
            for (var i = 0; i < components.length; i++) {
                components[i].view.init();
                components[i].load();
            }
        };

        return res;
    };

})();