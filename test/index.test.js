'use strict';
var ass = require('..');

require('should');

describe('ASS Client', function () {
	var client = ass({
		httpUrl: 'http://ass.com',
		httpsUrl: 'https://ass.com',
		accessToken: 'secret',
		username: 'foobar'
	});

	describe('createImageUrl()', function () {
		it('should create a signed transform url', function () {
			var url = client.createImageUrl(1, { resize: { width: 10, height: 10 } });
			url.should.equal('http://ass.com/users/foobar/images/1.jpg?t%5Bresize%5D%5Bwidth%5D=10&t%5Bresize%5D%5Bheight%5D=10&accessToken=d7d57e31ef0acf95f8bd83e9a3b98295286f27af9d578d309d638eb91e1de4fe');

			url = client.createImageUrl(1);
			url.should.equal('http://ass.com/users/foobar/images/1.jpg?accessToken=85890f047b3945a1f33f4eba4593fd9efa359774e68bc9d62b71c86974bb9463');
		});
	});

	describe('createSignture()', function () {
		it('should generate signature', function () {
			var url = client.createSignature(client.getUrl('/foo'));
			url.should.equal('a5be86e92ea8709e945e24a95a141fc475b0cf6bbd0c4c578fa5a5e1f1d98db2');
		});
	});

	describe('getDefaultHeaders()', function () {
		it('should return default headers with authorization', function () {
			var headers = client.getDefaultHeaders();
			headers.should.eql({
				Authorization: 'bearer secret',
			});
		});

		it('should add headers', function () {
			var headers = client.getDefaultHeaders({
				'Content-Type': 'text/html',
				foo: 'bar'
			});

			headers.should.eql({
				Authorization: 'bearer secret',
				'Content-Type': 'text/html',
				foo: 'bar'
			});
		});
	});
});