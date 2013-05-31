'use strict';
var fs = require('fs');
var path = require('path');
var util = require('util');
var childProcess = require('child_process').spawn;
var _ = require('lodash');
var TapConsumer = require('tap').createConsumer;
var consts = require('./../lib/consts.js');
var utils = require('./../lib/utils.js');
var resultToString = require('./../lib/resultToString.js')();

module.exports = function (grunt) {
	consts = consts();
	var exitCodes = consts.exitCodes();

	grunt.registerMultiTask('node_tap', 'A Grunt task to run node-tap tests and read their output.', function () {
		var self = this;
		var done = this.async();
		var async = grunt.util.async;

		var options = this.options();
		grunt.verbose.writeflags(options);
		checkOptions();

		var foundFiles = [];
		setupFiles();

		var result = {
			testsPassed: true,
			failedTests: [],
			stats: {
				failTotal: 0,
				passTotal: 0,
				testsTotal: 0
			},
			tapOutput: ''
		};

		runTests(onTestsComplete);

		function onTestsComplete(err) {
			if (err)
				return grunt.fatal(err, exitCodes.fatal);

			var output;
			if (resultToString[options.outputLevel])
				output = resultToString[options.outputLevel](result);

			if (!output)
				output = result.tapOutput;

			if (options.outputTo === 'file')
				grunt.file.write(options.outputFilePath, output);
			else
				grunt.log.writeln(output);

			if (!result.testsPassed)
				return grunt.warn("Some tests failed.");

			done();
		}

		function runTests(cb) {
			async.forEach(foundFiles, function (file, eCb) {
				var tapConsumer = new TapConsumer();
				var proc = childProcess('node', [file]);

				proc.stdout.pipe(tapConsumer);
				proc.stderr.pipe(process.stderr);

				proc.on('close', eCb);

				tapConsumer.on('end', function () {
					// write stats, the keys in result.stats are also present in tc.results
					_.forEach(result.stats, function (val, key) {
						result.stats[key] += tapConsumer.results[key];
					});

					if (tapConsumer.results.ok) return;

					// write failedTests
					result.testsPassed = false;
					result.failedTests = result.failedTests.concat(
						_(tapConsumer.results.list).reject('ok').valueOf()
					);
				});

				if (options.outputLevel === 'tap-stream') {
					tapConsumer.on('data', {
						file: function (data) {
							result.tapOutput += data;
						},
						console: function (data) {
							grunt.log.writeln(util.inspect(data));
						}
					}[options.outputTo]);
				}
			}, cb);
		}

		function checkOptions() {
			var outputLevels = consts.outputLevels();
			if (!~outputLevels.indexOf(options.outputLevel)) {
				return grunt.fail.fatal(util.format("Invalid outputLevel option [%s] passed, valid outputLevel options " +
					"are: [%s]", options.outputLevel, outputLevels.join(", ")), exitCodes.fatal);
			}

			var outputDests = consts.outputDestinations();
			if (!~outputDests.indexOf(options.outputTo)) {
				return grunt.fail.fatal(util.format("Invalid outputTo option [%s] passed, valid outputTo options " +
					"are: [%s]", options.outputTo, outputDests.join(", ")), exitCodes.fatal);
			}

			if (options.outputTo === 'file' && !options.outputFilePath) {
				return grunt.fail.fatal("The outputFilePath option must be passed when outputting to a file",
					exitCodes.fatal);
			}
		}

		function setupFiles() {
			foundFiles = _(self.filesSrc)
				.map(utils.unary(grunt.file.expand))
				.flatten()
				.map(utils.unary(path.resolve))
				.filter(utils.unary(grunt.file.exists))
				.valueOf();

			grunt.verbose.writeln("Files to process:", foundFiles);

			if (foundFiles.length === 0)
				return grunt.fail.fatal("None of the files passed exist.", exitCodes.fatal);
		}

	});
};
