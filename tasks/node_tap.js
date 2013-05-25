'use strict';
var spawn = require('child_process').spawn;

module.exports = function (grunt) {
	var async = grunt.util.async;

	grunt.registerMultiTask('node_tap', 'A Grunt task to run node-tap tests and read their output.', function () {
		var done = this.async();

		async.forEach(this.files, function (filePair, fCb) {
			async.forEach(filePair.src, runTests, fCb);
		}, function (err) {
			done();
		});
	});

	var tapOutput;

	function runTests(src, cb) {
		async.series([
			wrapWithCb(runTap, src),
			wrapWithCb(parseTapOutput),
		], cb);
	}

	function runTap(src, cb) {
		tapOutput = '';
		var errors = '';

		var tapProcess = spawn('tap', ['--tap', src]);
		tapProcess.stdout.setEncoding('utf8');
		tapProcess.stderr.setEncoding('utf8');

		tapProcess.stdout.on('data', function (d) {
			tapOutput += d;
		});
		tapProcess.stderr.on('data', function (d) {
			errors += d;
		});
		tapProcess.on('close', function (code) {
			cb(errors);
		});
	}

	function parseTapOutput(cb) {
		console.log('parseTapOutput', tapOutput);
		cb();
	}

	function wrapWithCb(fn) {
		var args = Array.prototype.slice.call(arguments);
		var fn = args.shift();

		return function (cb) {
			fn.apply(null, args.concat(cb));
		};
	}

};
