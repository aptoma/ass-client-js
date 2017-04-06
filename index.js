'use strict';

var request = require('./lib/node/request'),
	qs = require('qs'),
	crypto = require('./lib/node/crypto'),
	printf = require('util').format,
	join = require('path').join;

/**
 * Extend `target` with properties from `source`.
 * @param  {Object} target
 * @param  {Object} source
 * @return {Object}
 */
function extend(target, source) {
    for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
            target[prop] = source[prop];
        }
    }

    return target;
}

/**
 * Create ASS API instance.
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
 * Get default headers.
 * @param {Object} headers Add headers
 * @return {Object}
 */
ASS.prototype.getDefaultHeaders = function (headers) {
	var h = {
		'Authorization': 'bearer ' + this.accessToken
	};

	if (headers) {
		Object.keys(headers).forEach(function (key) {
			h[key] = headers[key];
		});
	}

	return h;
};

/**
 * Upload file to endpoint.
 * @param  {String} endpoint
 * @param  {File|String|stream.Readable} file File object, full path to the file or stream.Readable
 * @param  {Object} headers Add additional headers
 * @return {Promise} Resolves with response object
 */
ASS.prototype.upload = function (endpoint, file, headers) {
	return request.postFile(this.getUrl(endpoint), file, this.getDefaultHeaders(headers));
};

/**
 * Upload a file to /files endpoint.
 * @param  {File|String|stream.Readable} file File object, full path to the file or stream.Readable
 * @param  {String} path Additional path to append to /files
 * @param  {Object} headers Add additional headers
 * @return {Promise} Resolves with response object
 */
ASS.prototype.uploadFile = function (file, path, headers) {
	var endpoint = '/files';

	if (path) {
		endpoint += path.charAt(0) === '/' ? path : '/' + path;
	}

	return this.upload(endpoint, file, headers);
};

/**
 * Upload an image.
 * @param  {File|String|stream.Readable} file File object, full path to the file or stream.Readable
 * @param  {Object} headers Add additional headers
 * @return {Promise} Resolves with response object
 */
ASS.prototype.uploadImage = function (file, headers) {
	return this.upload('/images', file, headers);
};

/**
 * Make a request.
 * @param  {String}  endpoint
 * @param  {Object}  [opts] Options to request
 * @param  {Boolean} opts.http Set to true if request should use HTTP instead of HTTPS URL
 * @param  {String}  opts.method Request method (GET/HEAD/POST/PUT/PATCH/DELETE)
 * @param  {Object}  opts.headers Additional headers to add
 * @param  {Number}  opts.timeout Number of ms to wait before timing out
 * @param  {String|Object} opts.body Data to send
 * @return {Promise} Resolves with response object
 */
ASS.prototype.request = function (endpoint, opts) {
	opts = extend({}, opts);
	opts.url = this.getUrl(endpoint, opts.http);
	opts.headers = this.getRequestHeaders(opts.headers);
	delete opts.http;

	return request(opts);
};

/**
 * Get headers for convenient request methods.
 * @param  {Object} headers Add additional headers
 * @return {Object}
 */
ASS.prototype.getRequestHeaders = function (headers) {
	return this.getDefaultHeaders(extend({'Content-Type': 'application/json'}, headers));
};

/**
 * Make a GET request to an endpoint.
 * @param  {String} endpoint
 * @param  {Object} [opts] Options to request
 * @return {Promise} Resolves with response object
 */
ASS.prototype.get = function (endpoint, opts) {
	return this.request(endpoint, extend({method: 'GET'}, opts));
};

/**
 * Make a DELETE request to an endpoint.
 * @param  {String} endpoint
 * @param  {Object} [opts] Options to request
 * @return {Promise} Resolves with response object
 */
ASS.prototype.delete = function (endpoint, opts) {
	return this.request(endpoint, extend({method: 'DELETE'}, opts));
};

/**
 * Make a HEAD request to an endpoint.
 * @param  {String} endpoint
 * @param  {Object} [opts] Options to request
 * @return {Promise} Resolves with response object
 */
ASS.prototype.head = function (endpoint, opts) {
	return this.request(endpoint, extend({method: 'HEAD'}, opts));
};

/**
 * Make a POST request to an endpoint.
 * @param  {String} endpoint
 * @param  {String|Object} data Data to send as body
 * @param  {Object} [opts] Options to request
 * @return {Promise} Resolves with response object
 */
ASS.prototype.post = function (endpoint, data, opts) {
	return this.request(endpoint, extend({method: 'POST', body: data}, opts));
};

/**
 * Make a PUT request to an endpoint.
 * @param  {String} endpoint
 * @param  {String|Object} data Data to send as body
 * @param  {Object} [opts] Options to request
 * @return {Promise} Resolves with response object
 */
ASS.prototype.put = function (endpoint, data, opts) {
	return this.request(endpoint, extend({method: 'PUT', body: data}, opts));
};

/**
 * Make a PATCH request to an endpoint.
 * @param  {String} endpoint
 * @param  {String|Object} data Data to send as body
 * @param  {Object} [opts] Options to request
 * @return {Promise} Resolves with response object
 */
ASS.prototype.patch = function (endpoint, data, opts) {
	return this.request(endpoint, extend({method: 'PATCH', body: data}, opts));
};

/**
 * Get full URL to ASS endpoint, defaults to https URL.
 * @param  {String} endpoint
 * @param  {Boolean} [http] If we should return http URL
 * @return {String}
 */
ASS.prototype.getUrl = function (endpoint, http) {
	return (http ? this.httpBaseUrl : this.httpsBaseUrl) + join('/', endpoint);
};

/**
 * Create a signed URL from image id and actions.
 * @param  {Integer} id - image id
 * @param  {Object} [actions]
 * @param  {Object} [options]
 * @param  {Boolean} [options.https] if we should return https
 * @param  {Boolean} [options.encode] if we should url encode the actions
 * @return {String}
 */
ASS.prototype.createImageUrl = function (id, actions, options) {
	options = options ? options : {};
	options.https = typeof options.https === 'boolean' ? options.https : false;
	options.encode = typeof options.encode === 'boolean' ? options.encode : false;

	var url = this.getUrl(printf('/users/%s/images/%s.jpg', this.username, id), !options.https);
	if (actions) {
		url += '?' + qs.stringify({ t: actions }, { encode: false });
	}

	return (options.encode ? encodeURI(url) : url) + (actions ? '&' : '?') + 'accessToken=' + this.createSignature(url);
};

/**
 * Create signature for an image or file URL.
 * @param  {String} URL
 * @return {String}
 */
ASS.prototype.createSignature = function (url) {
	return crypto.sha256(this.accessToken, url);
};

/**
 * Create ASS instance.
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
