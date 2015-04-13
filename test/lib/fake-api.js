function createFakeAPI(cb) {
	var api = {};

	var props = {};

	api.getProperty = function(name, cb) {
		process.nextTick(function() {
			cb(null, props[name]);
		});
	};

	api.setProperty = function(name, value, cb) {
		process.nextTick(function() {
			props[name] = value;

			cb(null, true);
		});
	};

	setTimeout(function() {
		console.log('d');
		cb(null, api);
	}, 200);
}


module.exports = createFakeAPI;
