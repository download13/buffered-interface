var _slice = Array.prototype.slice;


function CallbackBuffer(methodName) {
	this._methodName = methodName;

	this._calls = [];

	this.call = this.call.bind(this);

	this.ready = this.ready.bind(this);
}

CallbackBuffer.prototype.call = function() {
	var superObject = this._superObject;

	if(superObject) {
		superObject[this._methodName].apply(superObject, arguments);
	} else {
		this._calls.push(_slice.call(arguments));
	}
};

CallbackBuffer.prototype.ready = function(superObject) {
	var self = this;

	this._superObject = superObject;

	this._calls.forEach(function(args) {
		self.call.apply(null, args);
	});

	delete this._calls;
};


module.exports = CallbackBuffer;
