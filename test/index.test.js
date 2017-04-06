/* jshint mocha: true */
/* globals sinon */

'use strict';

// Check if we're running in Node.JS or the Browser
var isBrowser = typeof(window) === 'object';

if (!isBrowser) {
	var AssClient = require('..');
	var chai = require('chai');
	var nock = require('nock');
}

var assert = chai.assert;


describe('ASS Client', function () {
	beforeEach(function() {
		if (isBrowser) {
			this.server = sinon.fakeServer.create();
		}

		this.mockRequest = function(method, url, path, statusCode, body, fn) {
			if (isBrowser) {
				this.server.respondWith(method, url + path, [statusCode, {}, body]);
			} else {
				nock(url)[method](path).reply(statusCode, body);
			}

			if (fn) {
				fn.call(this);

				if (isBrowser) {
					this.server.respond();
				}
			}
		};

		this.client = AssClient({
			httpUrl: 'http://ass.com',
			httpsUrl: 'https://ass.com',
			accessToken: 'secret',
			username: 'foobar'
		});
	});

	afterEach(function () {
		if (isBrowser) {
			this.server.restore();
		} else {
			nock.cleanAll();
		}
	});

	describe('request()', function () {
		it('should return a promise', function () {
			var promise = this.client.request('http://ass.com');
			assert.isFunction(promise.then);
		});

		it('should resolve with response', function (done) {
			this.mockRequest('get', 'https://ass.com', '/foo', 200, '{"id": 1}', function () {
				this.client.request('foo').then(function (res) {
					assert.deepEqual(res, {id: 1});
				}).then(done, done);
			});
		});

		it('should not use HTTPS url if passing http parameter', function (done) {
			this.mockRequest('get', 'http://ass.com', '/foo-http', 200, '{"id": 1}', function () {
				this.client.request('foo-http', {http: true}).then(function (res) {
					assert.deepEqual(res, {id: 1});
				}).then(done, done);
			});
		});

		it('should reject with ResponseError on none 2xx status code', function (done) {
			this.mockRequest('get', 'https://ass.com', '/500-fail-string', 500, 'FAIL', function () {
				this.client.request('500-fail-string').catch(function (ex) {
					assert.equal(ex.message, 'Request to https://ass.com/500-fail-string failed. code: 500');
					assert.equal(ex.name, 'ResponseError');
					assert.equal(ex.statusCode, 500);
					assert.deepEqual(ex.response.body, 'FAIL');
					done();
				});
			});
		});

		it('should reject with ResponseError with parsed JSON in body', function (done) {
			this.mockRequest('get', 'https://ass.com', '/500-fail-json', 500, '{"error": true}', function () {
				this.client.request('500-fail-json').catch(function (ex) {
					assert.equal(ex.name, 'ResponseError');
					assert.equal(ex.statusCode, 500);
					assert.deepEqual(ex.response.body, {error: true});
					done();
				});
			});
		});

		it('should reject with ResponseError on invalid JSON in 2xx response', function (done) {
			this.mockRequest('get', 'https://ass.com', '/200-not-valid-json', 200, 'NotValid', function () {
				this.client.request('200-not-valid-json').catch(function (ex) {
					assert.equal(ex.name, 'ResponseError');
					assert.equal(ex.statusCode, 200);
					assert.equal(ex.message, 'Unable to parse json from url: https://ass.com/200-not-valid-json');
					done();
				});
			});
		});

		it('should reject with ConnectionError when request timed out', function (done) {
			var clock;

			if (isBrowser) {
				clock = sinon.useFakeTimers();
				this.server.respondWith('GET', 'https://ass.com/timeout', [200, {}, '']);
			} else {
				nock('https://ass.com').get('/timeout').socketDelay(2000).reply(200);
			}

			this.client.request('timeout', {timeout: 1000}).catch(function (ex) {
				assert.equal(ex.name, 'ConnectionError');
				assert.equal(ex.message, 'Connect timeout occurred when requesting url: https://ass.com/timeout');
				assert.ok(ex.code === 'ETIMEDOUT' || ex.code === 'ESOCKETTIMEDOUT' || ex.code === 'timeout');
				done();
			});

			if (isBrowser) {
				clock.tick(2000);
				clock.restore();
			}
		});
	});

	describe('get()', function () {
		it('should return a promise', function () {
			var promise = this.client.get('test');
			assert.isFunction(promise.then);
		});

		it('should make a GET request', function (done) {
			this.mockRequest('get', 'https://ass.com', '/200-get', 200, '{"id": 1}', function () {
				this.client.get('200-get').then(function (res) {
					assert.deepEqual(res, {id: 1});
				}).then(done, done);
			});
		});
	});

	describe('post()', function () {
		it('should return a promise', function () {
			var promise = this.client.post('test');
			assert.isFunction(promise.then);
		});

		it('should make a POST request', function (done) {
			this.mockRequest('post', 'https://ass.com', '/200-post', 200, '{"id": 1}', function () {
				this.client.post('200-post', {foo: 'bar'}).then(function (res) {
					assert.deepEqual(res, {id: 1});
				}).then(done, done);
			});
		});
	});

	describe('put()', function () {
		it('should return a promise', function () {
			var promise = this.client.put('test');
			assert.isFunction(promise.then);
		});

		it('should make a PUT request', function (done) {
			this.mockRequest('put', 'https://ass.com', '/200-put', 200, '{"id": 1}', function () {
				this.client.put('200-put', {foo: 'bar'}).then(function (res) {
					assert.deepEqual(res, {id: 1});
				}).then(done, done);
			});
		});
	});

	describe('head()', function () {
		it('should return a promise', function () {
			var promise = this.client.head('test');
			assert.isFunction(promise.then);
		});

		it('should make a HEAD request', function (done) {
			this.mockRequest('head', 'https://ass.com', '/200-head', 200, '{"id": 1}', function() {
				this.client.head('200-head').then(function (res) {
					assert.deepEqual(res, {id: 1});
				}).then(done, done);
			});
		});
	});

	describe('delete()', function () {
		it('should return a promise', function () {
			var promise = this.client.delete('test');
			assert.isFunction(promise.then);
		});

		it('should make a DELETE request', function (done) {
			this.mockRequest('delete', 'https://ass.com', '/200-delete', 200, '{"id": 1}', function () {
				this.client.delete('200-delete').then(function (res) {
					assert.deepEqual(res, {id: 1});
				}).then(done, done);
			});
		});
	});

	describe('patch()', function () {
		it('should return a promise', function () {
			var promise = this.client.patch('test');
			assert.isFunction(promise.then);
		});

		it('should make a PATCH request', function (done) {
			this.mockRequest('patch', 'https://ass.com', '/200-patch', 200, '{"id": 1}', function () {
				this.client.patch('200-patch').then(function (res) {
					assert.deepEqual(res, {id: 1});
				}).then(done, done);
			});
		});
	});

	describe('uploadFile()', function () {
		it('should resolve promise with response', function (done) {
			var file;

			if (isBrowser) {
				file = {name: 'file.pdf'};
			} else {
				file = __dirname + '/index.test.js';
			}

			this.mockRequest('post', 'https://ass.com', '/files', 200, '{"id": 1}', function () {
				this.client.uploadFile(file).then(function (res) {
					assert.deepEqual(res, {id: 1});
				}).then(done, done);
			});
		});

		it('should append extra path', function (done) {
			var file;

			if (isBrowser) {
				file = {name: 'file.pdf'};
			} else {
				file = __dirname + '/index.test.js';
			}

			this.mockRequest('post', 'https://ass.com', '/files/assets', 200, '{"id": 1}', function () {
				this.client.uploadFile(file, 'assets').then(function (res) {
					assert.deepEqual(res, {id: 1});
				}).then(done, done);
			});
		});
	});

	describe('uploadImage()', function () {
		it('should resolve promise with response', function (done) {
			var file;

			if (isBrowser) {
				file = {name: 'file.jpg'};
			} else {
				file = __dirname + '/index.test.js';
			}

			this.mockRequest('post', 'https://ass.com', '/images', 200, '{"id": 1}', function () {
				this.client.uploadImage(file).then(function (res) {
					assert.deepEqual(res, {id: 1});
				}).then(done, done);
			});
		});
	});

	describe('getUrl()', function () {
		it('should return full HTTPS URL by default', function () {
			var url = this.client.getUrl('test');
			assert.equal(url, 'https://ass.com/test');
		});

		it('should not return HTTPS URL when setting "http" parameter', function () {
			var url = this.client.getUrl('test', true);
			assert.equal(url, 'http://ass.com/test');
		});
	});

	describe('createImageUrl()', function () {
		it('should create a signed transform url', function () {
			var url = this.client.createImageUrl(1, { resize: { width: 10, height: 10 } });
			assert.equal(url, 'http://ass.com/users/foobar/images/1.jpg?t[resize][width]=10&t[resize][height]=10&accessToken=89085a51aa4864e89cec7ec9cbd20f895c2cad51ebb07a0f4a96a60277157662');

			url = this.client.createImageUrl(1);
			assert.equal(url, 'http://ass.com/users/foobar/images/1.jpg?accessToken=85890f047b3945a1f33f4eba4593fd9efa359774e68bc9d62b71c86974bb9463');
		});

		it('should create a https url', function () {
			var url = this.client.createImageUrl(1, { resize: { width: 10, height: 10 } }, {https: true});
			assert.equal(url, 'https://ass.com/users/foobar/images/1.jpg?t[resize][width]=10&t[resize][height]=10&accessToken=f74655384e286c28f40b8998f5c75121c67bf13f4ce0330f31104ae74f0a84c1');

		});

		it('should encode the url', function () {
			var url = this.client.createImageUrl(1, { resize: { width: 10, height: 10 } }, {encode: true});
			assert.equal(url, 'http://ass.com/users/foobar/images/1.jpg?t%5Bresize%5D%5Bwidth%5D=10&t%5Bresize%5D%5Bheight%5D=10&accessToken=89085a51aa4864e89cec7ec9cbd20f895c2cad51ebb07a0f4a96a60277157662');
		});
	});

	describe('createSignature()', function () {
		it('should generate signature', function () {
			var url = this.client.createSignature(this.client.getUrl('/foo'));
			assert.equal(url, 'a5be86e92ea8709e945e24a95a141fc475b0cf6bbd0c4c578fa5a5e1f1d98db2');
		});
	});

	describe('getDefaultHeaders()', function () {
		it('should return default headers with authorization', function () {
			var headers = this.client.getDefaultHeaders();
			assert.deepEqual(headers, {
				Authorization: 'bearer secret',
			});
		});

		it('should add headers', function () {
			var headers = this.client.getDefaultHeaders({
				'Content-Type': 'text/html',
				foo: 'bar'
			});

			assert.deepEqual(headers, {
				Authorization: 'bearer secret',
				'Content-Type': 'text/html',
				foo: 'bar'
			});
		});
	});

	describe('getRequestHeaders()', function () {
		it('should set default headers', function () {
			var headers = this.client.getRequestHeaders();

			assert.deepEqual(headers, {
				'Authorization': 'bearer secret',
				'Content-Type': 'application/json'
			});
		});

		it('should be able to override default headers', function () {
			var headers = this.client.getRequestHeaders({
				'Authorization': 'foo',
				'Content-Type': 'text/plain'
			});

			assert.deepEqual(headers, {
				'Authorization': 'foo',
				'Content-Type': 'text/plain'
			});
		});
	});
});
