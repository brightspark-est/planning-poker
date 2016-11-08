(function (w) {

    function PokerTableSvc() {

        var _this = this;
        Observable.mixin(this);

        var _pokerTableHub = $.connection.pokerTable;

         // Start the connection
        var _hub = $.connection.hub;

        Object.defineProperties(this, {
            client: {
                get: function () {
                    return _pokerTableHub.client;
                }
            },
            server: {
                get: function () {
                    return _pokerTableHub.server;
                }
            },
            hub: {
                get: function () {
                    return _hub;
                }
            }
        });

        var _regClientCallback = function (cbName) {
            _pokerTableHub.client[cbName] = function () {
				var args = Array.prototype.slice.call(arguments);
				Array.prototype.unshift.call(args, cbName);
                _this.publish.apply(_this, args);
            };

            _this[cbName] = function (handler) {
                _this.subscribe(cbName, handler);
            };
        };

        _regClientCallback("hasMadeBet");
        _regClientCallback("playerJoined");
        _regClientCallback("playerLeft");
        _regClientCallback("turn");
    }

	w.PokerTableSvc = PokerTableSvc;

})(window);