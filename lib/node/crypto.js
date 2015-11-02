'use strict';

var crypto = require('crypto');

module.exports = {

	/**
	 * Generate a SHA256 HMAC hash from the given data
	 *
	 * @param  {String} key
	 * @param  {String} data
	 * @return {String}
	 */
	sha256: function(key, data) {
		return crypto.createHmac('sha256', key).update(data, 'utf8').digest('hex');
	}
};