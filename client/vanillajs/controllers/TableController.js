var TableController = (function TableController() {

    Controller.call(this);

    /**
     * Render poker table
     */
    this.index = function () {
        return this.__partial("/views/table/index");
    };

}).extends(sparkling.ControllerBase);