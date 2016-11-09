NS("views.table", function () {

    this.index = function () {

        var template = '\
            <div class="table">\
                <div id="players-list-container">\
                    <spx:action name="index" controller="players" />\
                </div>\
                <div id="hand">\
                    <spx:action name="index" controller="Hand" />\
                </div>\
            </div>';

        var t = new sparkling.Template(template);

        this.render = function () {
            return t.dom;
        };
    };
});