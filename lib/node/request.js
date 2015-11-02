'use strict';

var requestProm = require('request-prom');

function request(opts) {
	return requestProm({
		url: opts.url,
		headers: opts.headers,
		method: opts.method,
		timeout: opts.timeout,
		body: opts.body,
		json: true
	}).then(function(res) {
		return res.body;
	});
}

request.postFile = function(url, file, headers) {
	return requestProm.postFile(url, file, {
		headers: headers,
		json: true
	}).then(function(res) {
		return res.body;
	});
};

module.exports = request;