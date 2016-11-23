NS("views.table", function () {

	var indexDom;

    this.index = function () {

        var markup = '\
            <div class="table">\
                <div id="players-list-container">\
                    <spx:action name="index" controller="players" />\
                </div>\
                <div id="hand">\
                    <spx:action name="index" controller="Hand" />\
                </div>\
            </div>';

		this.template = new sparkling.Template(markup);
    };
});