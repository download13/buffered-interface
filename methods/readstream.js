var _slice = Array.prototype.slice;


function ReadStreamBuffer(methodName) {
	this._methodName = methodName;

	this._calls = [];

	this.call = this.call.bind(this);

	this.ready = this.ready.bind(this);
}

ReadStreamBuffer.prototype.call = function() {
	var superObject = this._superObject;

	if(superObject) {
		return superObject[this._methodName].apply(superObject, arguments);
	} else {
		var stream = new PassThrough();

		this._calls.push({
			args: _slice.call(arguments),
			stream: stream
		});

		return stream;
	}
};

ReadStreamBuffer.prototype.ready = function(superObject) {
	var self = this;

	this._superObject = superObject;

	this._calls.forEach(function(callData) {
		self.call.apply(null, callData.args).pipe(callData.stream);
	});

	delete this._calls;
};


module.exports = ReadStreamBuffer;
