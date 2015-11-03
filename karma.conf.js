/* jshint node:true */
module.exports = function(config) {
	'use strict';

	config.set({
		basePath: '.',
		frameworks: ['mocha'],
		singleRun: true,
		browsers: ['PhantomJS'],
		reporters: ['dots'],
		files: [
			'dist/ass-client.js',
			'node_modules/chai/chai.js',
			'node_modules/sinon-browser-only/sinon.js',
			'test/*.test.js'
		]
	});
};