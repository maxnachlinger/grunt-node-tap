'use strict';
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
		tapProcess.stdout.on('data', function (data) {
			result.output += data;
		});
		tapProcess.stdout.pipe(tc);
	}
}

module.exports = function (params, cb) {
	return new NodeTap(params, cb);
};
