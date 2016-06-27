var Player = function(cid, name) {

    var _this = this;
    Observable.call(_this);
    
    var _cid = cid;
    var _name = {val: name};
    var _bet = { };
    var _hasMadeBet = {val: false};

    Object.defineProperty(_this, "cid", {
        get: function() { return _cid; }
    });
    
    regStdProps(_this, {
        name: _name,
        bet: _bet,
        hasMadeBet: _hasMadeBet
    })
};