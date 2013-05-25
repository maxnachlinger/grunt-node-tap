'use strict';
var tapConsumer = require('tap').createConsumer;
// not using grunt.spawn since I'd like to stream stdout to tap-consumer
var childProcess = require('child_process').spawn;

var exitCodes = {
	fatal: 1,
	taskFailed: 3
};

module.exports = function (grunt) {
	var async = grunt.util.async;
	var fail = grunt.fail;

	grunt.registerMultiTask('node_tap', 'A Grunt task to run node-tap tests and read their output.', function () {
		var done = this.async(); // called to signal that this task is complete
		var testsPassed = true;
		var output = '';

		async.forEach(this.files, function (filePair, fCb) {
			async.forEach(filePair.src, runTap, fCb);
		}, function (err) {
			if (err)
				return fail.fatal(err, exitCodes.fatal);
			if (!testsPassed)
				return fail.warn("Some tests failed" + output, exitCodes.taskFailed);

			done();
		});

		function runTap(src, cb) {
			var tc = new tapConsumer();
			tc.on('end', function () {
				if (!tc.results.ok)
					testsPassed = false;
			});

			var tapProcess = childProcess('tap', ['--tap', src]);
			tapProcess.on('close', function () {
				cb();
			});

			tapProcess.stderr.setEncoding('utf8');
			tapProcess.stderr.on('data', cb); // on error, abort

			tapProcess.stdout.on('data', function (data) {
				output += data;
			});
			tapProcess.stdout.pipe(tc);
		}

	});
};
