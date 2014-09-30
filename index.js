'use strict';
var request = require('request-prom'),
	qs = require('qs'),
	crypto = require('crypto'),
	printf = require('util').format,
	join = require('path').join;

/**
 * Create ASS API instance
 * @param {Object} opts
 * @param {String} opts.httpUrl
 * @param {String} opts.httpsUrl
 * @param {String} opts.accessToken
 * @param {String} opts.username
 */
function ASS(opts) {
	this.httpBaseUrl = opts.httpUrl;
	this.httpsBaseUrl = opts.httpsUrl;
	this.accessToken = opts.accessToken;
	this.username = opts.username;
}

/**
 * Get default headers
 * @param {Object} add headers
 * @return {Object}
 */
ASS.prototype.getDefaultHeaders = function (headers) {
	var h = { Authorization: 'bearer ' + this.accessToken };

	if (!headers) {
		return h;
	}

	Object.keys(headers).forEach(function (key) {
		h[key] = headers[key];
	});

	return h;
};

/**
 * Upload file to endpoint
 * @param  {String} endpoint
 * @param  {String|stream.Readable} file     full path to the file or stream.Readable
 * @return {Promise}	Resolves with response object
 */
ASS.prototype.upload = function (endpoint, file) {
	return request.postFile(this.getUrl(endpoint), file, {
		headers: this.getDefaultHeaders(),
		json: true
	});
};

/**
 * Upload a file to /files endpoint
 * @param  {String|stream.Readable} file     full path to the file or stream.Readable
 * @return {Promise}	Resolves with response object
 */
ASS.prototype.uploadFile = function (file) {
	return this.upload('/files', file);
};

/**
 * Upload a
 * @param  {String|stream.Readable} file     full path to the file or stream.Readable
 * @return {Promise}	Resolves with response object
 */
ASS.prototype.uploadImage = function (file) {
	return this.upload('/images', file);
};

/**
 * Make a post request to an endpoint
 * @param  {String} endpoint
 * @return {Promise}	Resolves with response object
 */
ASS.prototype.post = function (endpoint) {
	return request.post(this.getUrl(endpoint), {
		headers: this.getDefaultHeaders({'Content-Type': 'application/json'}),
		json: true
	});
};

/**
 * Make a get request to an endpoint
 * @param  {String} endpoint
 * @return {Promise}	Resolves with response object
 */
ASS.prototype.get = function (endpoint) {
	return request.get(this.getUrl(endpoint), {
		headers: this.getDefaultHeaders({'Content-Type': 'application/json'}),
		json: true
	});
};

/**
 * Get full url to ASS endpoint, defaults to https url
 * @param  {String} endpoint
 * @param  {Boolean} [http] if we should return http url
 * @return {String}
 */
ASS.prototype.getUrl = function (endpoint, http) {
	return (http ? this.httpBaseUrl : this.httpsBaseUrl) + join('/', endpoint);
};

/**
 * Create a signed url from image id and actions
 * @param  {Integer} id - image id
 * @param  {Object} [actions]
 * @return {String}
 */
ASS.prototype.createImageUrl = function (id, actions) {
	var url = this.getUrl(printf('/users/%s/images/%s.jpg', this.username, id), true);
	if (actions) {
		url += '?' + qs.stringify({ t: actions });
	}
	return url + (actions ? '&' : '?') + 'accessToken=' + this.createSignature(url);
};

/**
 * Create signature for a image or file url
 * @param  {String} url
 * @return {String}
 */
ASS.prototype.createSignature = function (url) {
	return crypto.createHmac('sha256', this.accessToken).update(url).digest('hex');
};

/**
 * Create ASS instance
 * @param {Object} opts
 * @param {String} opts.httpUrl
 * @param {String} opts.httpsUrl
 * @param {String} opts.accessToken
 * @param {String} opts.username
 * @return {ASS}
 */
module.exports = function (opts) {
	return new ASS(opts);
};