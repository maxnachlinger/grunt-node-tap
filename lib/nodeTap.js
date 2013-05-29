'use strict';
var path = require('path');
var util = require("util");
var EventEmitter = require("events").EventEmitter;
var _ = require('lodash');
var tapConsumer = require('tap').createConsumer;
// not using grunt.spawn since I'd like to stream stdout to tap-consumer
var childProcess = require('child_process').spawn;
var utils = require('./utils.js');

util.inherits(NodeTap, EventEmitter);

function NodeTap(params, cb) {
	cb = cb || function() {};
	var filePaths = _(params.filePaths)
		.map(utils.unary(path.resolve))
		.valueOf();

	var self = this;

	var result = {
		testsPassed: true,
		failedTests: [],
		stats: {
			failTotal: 0,
			passTotal: 0,
			testsTotal: 0
		}
	};

	runTap(function (err) {
		if(err) {
			self.emit('error', err);
			return cb(err);
		}

		self.emit('end', result);
		cb(err, result);
	});

	function runTap(runCb) {
		var tc = new tapConsumer();

		tc.on('end', function () {
			// write stats, the keys in result.stats are also present in tc.results
			_.forEach(result.stats, function(val, key) {
				result.stats[key] += tc.results[key];
			});

			if (tc.results.ok) return;

			// write failedTests
			result.testsPassed = false;
			result.failedTests = result.failedTests.concat(
				_(tc.results.list).reject('ok').valueOf()
			);
		});

		tc.on('data', self.emit.bind(self, 'data'));

		var args = ['--tap'].concat(filePaths);
		var tapProcess = childProcess('tap', args);

		tapProcess.on('close', utils.noArgs(runCb));

		tapProcess.stderr.setEncoding('utf8');
		tapProcess.stderr.on('data', runCb); // error, abort

		tapProcess.stdout.setEncoding('utf8');
		tapProcess.stdout.pipe(tc);
	}

}

module.exports = function(params, cb) {
	return new NodeTap(params, cb);
};
