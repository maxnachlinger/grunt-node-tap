'use strict';
var path = require('path');
var _ = require('lodash');
var tapConsumer = require('tap').createConsumer;
// not using grunt.spawn since I'd like to stream stdout to tap-consumer
var childProcess = require('child_process').spawn;
var utils = require('./utils.js');

function NodeTap(params, cb) {
	var async = params.grunt.util.async;
	var filePaths = _(params.filePaths).map(utils.unary(path.resolve)).valueOf();

	var emptyArray = new Array(filePaths.length).join(' ').split(' ');
	var result = {
		testsPassed: true,
		output: _.zipObject(filePaths, emptyArray), // file-path -> output-string
		results: _.zipObject(filePaths, emptyArray) // file-path -> results[]
	};

	async.forEach(filePaths, runTap, function (err) {
		cb(err, result);
	});

	function runTap(src, runCb) {
		var tc = new tapConsumer();
		tc.on('end', function () {
			if (!tc.results.ok) {
				result.testsPassed = false;
			}
			result.results[src] = tc.results.list;
		});

		var tapProcess = childProcess('tap', ['--tap', src]);
		tapProcess.on('close', function () {
			runCb();
		});

		tapProcess.stderr.setEncoding('utf8');
		tapProcess.stderr.on('data', runCb); // error, abort

		tapProcess.stdout.setEncoding('utf8');
		tapProcess.stdout.on('data', function (data) {
			result.output[src] += data;
		});
		tapProcess.stdout.pipe(tc);
	}
}

module.exports = NodeTap;
