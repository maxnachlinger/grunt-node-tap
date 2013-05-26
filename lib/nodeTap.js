'use strict';
var path = require('path');
var _ = require('lodash');
var tapConsumer = require('tap').createConsumer;
// not using grunt.spawn since I'd like to stream stdout to tap-consumer
var childProcess = require('child_process').spawn;
var utils = require('./utils.js');

function NodeTap(params, cb) {
	var filePaths = _(params.filePaths).map(utils.unary(path.resolve)).valueOf();

	var result = {
		testsPassed: true,
		tapOutput: '',
		results: []
	};

	runTap(function (err) {
		cb(err, result);
	});

	function runTap(runCb) {
		var tc = new tapConsumer();
		tc.on('end', function () {
			if (!tc.results.ok) {
				result.testsPassed = false;
			}
			result.results.push(tc.results);
		});

		var args = ['--tap'].concat(filePaths);
		var tapProcess = childProcess('tap', args);

		tapProcess.on('close', utils.noArgs(runCb));

		tapProcess.stderr.setEncoding('utf8');
		tapProcess.stderr.on('data', runCb); // error, abort

		tapProcess.stdout.setEncoding('utf8');
		tapProcess.stdout.on('data', function (data) {
			result.tapOutput += data;
		});

		tapProcess.stdout.pipe(tc);
	}
}

module.exports = NodeTap;
