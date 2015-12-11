'use strict';

var sha = require('./sha');

module.exports = {

	/**
	 * Generate a SHA256 HMAC hash from the given data
	 *
	 * @param  {String} key
	 * @param  {String} data
	 * @return {String}
	 */
	sha256: function(key, data) {
		return sha.sha256hmac(key, data);
	}
};
