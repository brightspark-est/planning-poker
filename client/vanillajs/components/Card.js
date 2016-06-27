var Card = function (text, value) {
    
    var _this = this;
    Observable.call(_this);
    Uid.call(_this);
    
    var _text = { val: text };
    var _value = { val: value };
    var _selected = {val: false };
    
    regStdProps(_this, {
        text: _text,
        value: _value,
        selected: _selected
    });
};