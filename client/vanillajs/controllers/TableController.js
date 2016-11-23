NS("controllers", function () {

    this.table = function TableController() {

        ControllerBase.call(this);

        /**
         * Render poker table
         */
        this.index = function () {
            return this.__view("/views/table/index");
        };

    };

    this.table.extends(ControllerBase);

});