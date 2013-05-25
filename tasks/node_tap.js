'use strict';
var tapConsumer = require('tap').createConsumer;
var childProcess = require('child_process').spawn;

module.exports = function (grunt) {
	var async = grunt.util.async;

	grunt.registerMultiTask('node_tap', 'A Grunt task to run node-tap tests and read their output.', function () {
		var done = this.async();

		async.forEach(this.files, function (filePair, fCb) {
			async.forEach(filePair.src, runTap, fCb);
		}, function (err) {
			done();
		});
	});

	function runTap(src, cb) {
		var tc = new tapConsumer();
		var results = [];
		tc.on('end', function (data, amtTests, testsPassed) {
			results.push(tc.results);
		});

		var tapProcess = childProcess('tap', ['--tap', src]);
		tapProcess.stderr.setEncoding('utf8');
		tapProcess.stdout.pipe(tc);

		tapProcess.on('close', function (code) {
			console.log(results);
			cb();
		});
	}

};
