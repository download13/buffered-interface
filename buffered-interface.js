var _slice = Array.prototype.slice;


function createBufferedInterface(methodNames, base) {
	var self = base || {};

	var callsFlushed = false;

	var calls = {};


	// Create the methods that need to be buffered
	methodNames.forEach(function(methodName) {
		var methodCalls = calls[methodName] = [];

		self[methodName] = function() {
			var args = _slice.call(arguments);

			if(callsFlushed) {
				self._call(methodName, args);
			} else {
				methodCalls.push(args);
			}
		};
	});

	// Call this when it is safe to make the calls to the parent object
	function ready(superObject) {
		self._call = function(methodName, args) {
			superObject[methodName].apply(superObject, args);
		};

		if(!callsFlushed) {
			Object.keys(calls).forEach(function(methodName) {
				calls[methodName].forEach(function(args) {
					self._call(methodName, args);
				});
			});

			callsFlushed = true;

			calls = null;
		}
	};


	return {
		ready: ready,
		api: self
	};
}


module.exports = createBufferedInterface;
