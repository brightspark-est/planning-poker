NS("views.home", function () {

    this.table = function (model) {

        // components        
        var _playersList;
        var _hand;
        
        // componets views
        // var _playersListView;
        // var _handView;

        var _this = this;
        var _model = model;

        var _domContext;


        // /**
        //  * 
        //  */
        // var _init = function () {

        //     // load componets views
        //     // _playersListView = DI.resolve("component.playersList.view", _playersList, _domContext);
        //     // _handView = DI.resolve("component.hand.view", _hand, _domContext);

        //     // init components
        //     // _playersList.load();
        //     // _hand.load();
        // }

        this.render = function () {

            var template = '<div id="players-list-container">\
                        <component:PlayersList />\
                    </div>\
                    <div id="hand">\
                        <component:Hand />\
                    </div>';

                        

            var res = Re.render(template);

            _this.publish("rendered", res);

            return res;
        };

        // /**
        //  * 
        //  */
        // this.render = function () {
            
        //     if (!_domContext) 
        //     {
        //         _domContext = document.createElement("div");
        //         _domContext.className = "table";

        //         // note - markup can be fetched from server, inline (like current sample) or created manually (document.createElement)
        //         var template = '\
        //         <div id="players-list-container"> \
        //             <component:PlayersList /> \
        //         </div> \
        //         <div id="hand"> \
        //             <component:Hand /> \
        //         </div>';

        //         var view = Re.render(template, _domContext);

        //         _domContext.innerHTML = view.html;
        //         // todo - get rid of this
        //         view.complete();
                
        //         _playersList = view.model.playersList;
        //         _hand = view.model.hand;

        //         // _init();
        //     }

        //     return _domContext;
        // }
    };
});


// // -----------------------------------------
// // Re template -----------------------------
// // GENERATED GODE --------------------------
// // do not modify. changes will be overridden

// NS("views.home", function () {
//     this.table = (function () {
//         View.call(this);
//     }).extends(View);
// });

// NS("views.home.table").template = function () {
//     return '<div id="players-list-container">\
//     <component:PlayersList />\
// </div>\
// <div id="hand">\
//     <component:Hand />\
// </div>';
// };