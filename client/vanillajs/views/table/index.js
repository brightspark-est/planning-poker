NS("views.table", function () {

	var indexDom;

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

        return indexDom || (indexDom = new sparkling.View(template));
    };
});