(function () {


    function PokerTableSvc() {

        var _this = this;
        Observable.call(this);

        var _pokerTableHub = $.connection.pokerTable;

         // Start the connection
        var hub = $.connection.hub;

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
                    return hub;
                }
            }
        });

        var _regClientCallback = function  (cbName) {
            _pokerTableHub.client[cbName] = function () {
                _this.applyPublish(cbName, arguments);
            };

            _this[cbName] = function (handler) {
                _this.on(cbName, handler);
            }
        }

        _regClientCallback("hasMadeBet");
        _regClientCallback("playerJoined");
        _regClientCallback("playerLeft");
        _regClientCallback("turn");
    };

    DI.register(PokerTableSvc, DI.singleton);
    
})();