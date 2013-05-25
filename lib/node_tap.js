'use strict';
var path = require('path');
var tapConsumer = require('tap').createConsumer;
// not using grunt.spawn since I'd like to stream stdout to tap-consumer
var childProcess = require('child_process').spawn;

function NodeTap(params, cb) {
	var async = params.grunt.util.async;
	var filePaths = params.filePaths;

	var result = {
		testsPassed: true,
		output: ''
	};

	async.forEach(filePaths, runTap, function (err) {
		if (err) return cb(err);
		cb(null, result);
	});

	function runTap(src, runCb) {
		src = path.resolve(src);

		var tc = new tapConsumer();
		tc.on('end', function () {
			if (!tc.results.ok) {
				result.testsPassed = false;
			}
		});

		var tapProcess = childProcess('tap', ['--tap', src]);
		tapProcess.on('close', function () {
			runCb();
		});

		tapProcess.stderr.setEncoding('utf8');
		tapProcess.stderr.on('data', runCb); // on error, abort

		// collects output for display of test failure
		tapProcess.stdout.setEncoding('utf8');
		tapProcess.stdout.on('data', function (data) {
			result.output += data;
		});
		tapProcess.stdout.pipe(tc);
	}
}

module.exports = NodeTap;
