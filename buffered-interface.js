var CallbackBuffer = require('./methods/callback');

var ReadStreamBuffer = require('./methods/readstream');

var WriteStreamBuffer = require('./methods/writestream');


var _slice = Array.prototype.slice;


function createBufferedInterface(methods, base) {
	var self = base || {};

	var callsFlushed = false;

	var buffers = [];


	// Create the methods that need to be buffered
	Object.keys(methods).forEach(function(methodName) {
		var methodType = methods[methodName];

		var buffer;

		switch(methodType) {
		case 'callback':
			buffer = new CallbackBuffer(methodName);
			break;

		case 'readstream':
			buffer = new ReadStreamBuffer(methodName);
			break;

		case 'writestream':
			buffer = new WriteStreamBuffer(methodName);
		}

		buffers.push(buffer);

		self[methodName] = buffer.call;
	});

	// Call this when it is safe to make the calls to the parent object
	function ready(superObject) {
		if(!callsFlushed) {
			buffers.forEach(function(buffer) {
				buffer.ready(superObject);
			});

			callsFlushed = true;
		}
	};


	return {
		ready: ready,
		api: self
	};
}


module.exports = createBufferedInterface;
