var assert = require('assert');

var createBufferedInterface = require('../buffered-interface');

var createFakeAPI = require('./lib/fake-api');


describe('createBufferedInterface', function() {
	var inter;

	var api;

	it('should create a BufferedInterface', function() {
		inter = createBufferedInterface(['getProperty', 'setProperty']);

		api = inter.api;
	});

	describe('BufferedInterface', function() {
		it('should have getProperty method', function() {
			assert(api.getProperty);
		});

		it('should have setProperty method', function() {
			assert(api.setProperty);
		});

		it('should be able to call the getProperty method', function() {
			api.getProperty('test', function() {});
		});

		it('should be able to call the setProperty method', function() {
			api.setProperty('test', 'testval', function() {});
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
	});
});
