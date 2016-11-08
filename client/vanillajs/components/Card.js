var Card = function (text, value) {

    Observable.mixin(this);
    Uid.call(this);

	var _backingFields = {
		text: text,
		value: value,
		selected: false
	};

	this.defineObservableProperties(_backingFields);
};