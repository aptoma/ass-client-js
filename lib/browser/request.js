/* globals Promise, FormData, fetch */
'use strict';

require('es6-promise').polyfill();
require('whatwg-fetch');

function request(opts) {
	var body = opts.body;

	try {
		body = JSON.stringify(body);
	} catch(e) {}

	return timeout(opts.timeout, opts.url, fetch(opts.url, {
		method: opts.method,
		headers: opts.headers,
		timeout: opts.timeout,
		body: body
	})).then(function(response) {
		return handleResponse(opts.url, response);
	});
}

request.postFile = function(url, file, headers) {
	var data = new FormData();

	data.append('file', file);

	return fetch(url, {
		method: 'POST',
		headers: headers,
		body: data
	}).then(function(response) {
		return handleResponse(url, response);
	});
};

function timeout(ms, url, promise) {
	return new Promise(function(resolve, reject) {
		if (ms) {
			setTimeout(function() {
				reject(new ConnectionError('Connect timeout occurred when requesting url: ' + url, 'timeout'));
			}, ms);
		}
		promise.then(resolve, reject);
	});
}

function handleResponse(url, response) {
	return response.text().then(function (data) {
		var validJSON = true;

		try {
			data = JSON.parse(data);
		} catch(e) {
			validJSON = false;
		}

		if (!response.ok) {
			throw new ResponseError('Request to ' + url + ' failed. code: ' + response.status, data, response);
		} else if (!validJSON) {
			throw new ResponseError('Unable to parse json from url: ' + url, data, response);
		}

		return data;
	});
}

function ResponseError(message, body, response) {
    this.message = message;
    this.name = 'ResponseError';
	this.body = body;
	this.statusCode = response.status;
}

request.ResponseError = ResponseError;

function ConnectionError(message, code) {
    this.message = message;
    this.code = code;
    this.name = 'ConnectionError';
}

request.ConnectionError = ConnectionError;

module.exports = request;