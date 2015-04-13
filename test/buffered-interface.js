var assert = require('assert');

var createBufferedInterface = require('../buffered-interface');

var createFakeAPI = require('./lib/fake-api');

var concatStream = require('concat-stream-callback');


describe('BufferedInterface', function() {
	var inter;

	var api;

	it('should create a BufferedInterface', function() {
		inter = createBufferedInterface({
			getProperty: 'callback',
			setProperty: 'callback', // TODO
			getReadStream: 'readstream',
			getWriteStream: 'writestream'
		});

		api = inter.api;
	});

	it('should have getProperty method', function() {
		assert(api.getProperty);
	});

	it('should have setProperty method', function() {
		assert(api.setProperty);
	});

	it('should have getReadStream method', function() {
		assert(api.getReadStream);
	});

	it('should have getWriteStream method', function() {
		assert(api.getWriteStream);
	});

	it('should be able to call the getProperty method', function() {
		api.getProperty('test', function() {});
	});

	it('should be able to call the setProperty method', function(done) {
		api.setProperty('test', 'testval', function() {});

		setTimeout(done, 20);
	});

	it('should signal the api is ready', function(done) {
		createFakeAPI(function(err, realAPI) {
			console.log(2);

			inter.ready(realAPI);

			done();
		});
	});

	it('should be able to get a property', function(done) {
		api.getProperty('test', function(err, value) {
			assert.equal(value, 'testval');

			done();
		});
	});

	it('should be able to set a property', function(done) {
		api.setProperty('test', 'testval2', function() {
			done();
		});
	});

	it('should be able to get the new property value', function(done) {
		api.getProperty('test', function(err, value) {
			assert.equal(value, 'testval2');

			done();
		});
	});

	it('should be able to stream a value in', function(done) {
		var stream = api.getWriteStream('test');

		stream.on('finish', done);

		stream.end('anotherval');
	});

	it('should be able to stream a value out', function(done) {
		var stream = api.getReadStream('test');

		concatStream(stream, function(err, value) {
			assert.equal(value, 'anotherval');

			done();
		});
	});
});
