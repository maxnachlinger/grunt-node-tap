'use strict';
var node_tap = require('../lib/nodeTap.js');
var utils = require('../lib/utils.js');
var util = require('util');
var _ = require('lodash');

var exitCodes = {
	fatal: 1,
	taskFailed: 3
};

module.exports = function (grunt) {
	grunt.registerMultiTask('node_tap', 'A Grunt task to run node-tap tests and read their output.', function () {
		var outputWriter = {
			silent: function () {
			},
			failures: writeFailures,
			verbose: writeVerboseOutput
		};

		var self = this;
		var done = this.async();

		var options = this.options();
		checkOptions();

		var foundFiles = gatherFiles();
		if (foundFiles.length === 0)
			return grunt.fail.fatal("None of the files passed exist.", exitCodes.fatal);

		node_tap({
			filePaths: foundFiles,
			grunt: grunt
		}, function (err, result) {
			if (err) {
				return grunt.fail.fatal(err, exitCodes.fatal);
			}
			outputWriter[options.outputLevel](result);
			done();
		});

		function checkOptions() {
			var allowedLevels = _.keys(outputWriter);

			if (!~allowedLevels.indexOf(options.outputLevel)) {
				return grunt.fail.fatal("Invalid option [" + options.outputLevel + "] passed, valid options are: [" +
					allowedLevels.join(", ") + "]", exitCodes.fatal);
			}
		}

		function gatherFiles() {
			return _(self.files)
				.pluck('src')
				.map(grunt.file.expand)
				.flatten()
				.filter(utils.unary(grunt.file.exists))
				.valueOf();
		}

		var lf = grunt.util.linefeed;

		function writeVerboseOutput(result) {
			var str = lf + _.values(result.output).join(lf);

			if (result.testsPassed) {
				return grunt.log.writeln("All tests passed" + str);
			}
			return grunt.fail.warn("Some tests failed" + str, exitCodes.taskFailed);
		}

		function writeFailures(result) {
			if (result.testsPassed) {
				return;
			}

			var str = "Some tests failed: " + lf;

			_(result.results).forEach(function (value, key) {
				str += "Test Suite: " + key + lf;
				_(value).reject('ok').map().forEach(function (resultObj) {
					resultObj = _.omit(resultObj, 'id', 'ok');
					_(resultObj).forEach(function (resultValue, resultKey) {
						str += resultKey + ':' + util.inspect(resultValue) + lf;
					});
				});
			});

			return grunt.fail.warn(str, exitCodes.taskFailed);
		}

	});
};
