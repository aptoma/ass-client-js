'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var through = require('through');
var Server = require('karma').Server;

// Replace node-specific components with browser-specific ones
function browserSpecific() {
	var data = '';
	return through(
		function(buf) {
			data += buf;
		},
		function() {
			this.queue(data.replace(/\.\/lib\/node\//g, './lib/browser/'));
			this.queue(null);
		}
	);
}

gulp.task('browserify', function() {
	var b = browserify({
		standalone: 'AssClient',
		entries: './index.js',
		transform: [browserSpecific]
	});

	return b.bundle()
		.pipe(source('ass-client.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('./dist/'));
});

gulp.task('test', ['browserify'], function (done) {
	new Server({
		configFile: __dirname + '/karma.conf.js',
	}, function (exitStatus) {
		done(exitStatus ? 'Failing unit tests' : undefined);
	}).start();
});

gulp.task('default', ['test']);