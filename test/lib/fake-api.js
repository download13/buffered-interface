var concatStream = require('concat-stream-callback');

var PassThrough = require('stream').PassThrough;


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

	api.getReadStream = function(name) {
		var stream = new PassThrough();

		setTimeout(function() {
			stream.end(props[name]);
		}, 50);

		return stream;
	};

	api.getWriteStream = function(name) {
		var stream = new PassThrough();

		concatStream(stream, function(err, value) {
			props[name] = value;
		});

		return stream;
	};

	setTimeout(function() {
		cb(null, api);
	}, 80);
}


module.exports = createFakeAPI;
