(function () {


    function PokerTableSvc() {

        var _pokerTableHub = $.connection.pokerTable;

         // Start the connection
        $.connection.hub
            .start();

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
            }
        })

    };

    DI.register(PokerTableSvc, DI.singleton);
    DI.resolve("PokerTableSvc");

})();