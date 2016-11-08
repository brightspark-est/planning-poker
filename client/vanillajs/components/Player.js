var Player = function(cid, name) {

    Observable.mixin(this);

	var _backingFields = {
		cid: cid,
		name: name,
		hasMadeBet: false,
		bet: { }
	};

	this.defineObservableProperties(_backingFields, {
		cid: { set: false }
	});
};