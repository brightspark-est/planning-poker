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


var Uid = function () {
    Object.defineProperty(this, "uid", {
        value: Uid.next++,
        writable: false
    });
};
Uid.next = 1;

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