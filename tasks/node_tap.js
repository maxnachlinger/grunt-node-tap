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
		var outputCreators = {
			silent: function () {
			},
			failures: getFailuresOutput,
			stats: getStatsOutput
		};

		var self = this;
		var done = this.async();
		var lf = grunt.util.linefeed;

		var options = this.options();
		checkOptions();

		var foundFiles = gatherFiles();
		if (foundFiles.length === 0)
			return grunt.fail.fatal("None of the files passed exist.", exitCodes.fatal);

		node_tap({
			filePaths: foundFiles
		}, function (err, result) {
			if (err) {
				return grunt.fatal(err, exitCodes.fatal);
			}
			var output = outputCreators[options.outputLevel](result);
			if (!result.testsPassed) {
				return grunt.warn(output + lf);
			}

			grunt.log.writeln(output);
			done();
		});

		function checkOptions() {
			var allowedLevels = _.keys(outputCreators);

			if (!~allowedLevels.indexOf(options.outputLevel)) {
				return grunt.fail.fatal("Invalid option [" + options.outputLevel + "] passed, valid options are: [" +
					allowedLevels.join(", ") + "]", exitCodes.fatal);
			}
		}

		function gatherFiles() {
			return _(self.filesSrc)
				.map(utils.unary(grunt.file.expand))
				.flatten()
				.filter(utils.unary(grunt.file.exists))
				.valueOf();
		}

		function getStatsOutput(result) {
			var stats = { failTotal: 0, passTotal: 0, testsTotal: 0 };

			// pick the keys from stats out of the results, add the values to stats
			_(utils.arrayPick(result.results, _.keys(stats))).forEach(function (res) {
				_.forEach(res, function (resValue, resKey) {
					stats[resKey] += resValue;
				});
			});

			return "Passed: " + stats.passTotal + ", Failed: " + stats.failTotal + ", Total: " + stats.testsTotal;
		}

		function getFailuresOutput(result) {
			var str = getStatsOutput(result);
			if (result.testsPassed) {
				return str;
			}
			str += lf + lf + "Failures:" + lf + lf;

			_(result.results).reject('ok').each(function (testFileResults) {
				_(testFileResults.list).reject('ok').forEach(function (resultObj) {
					resultObj = _.omit(resultObj, 'id', 'ok');
					_(resultObj).forEach(function (resultValue, resultKey) {
						str += resultKey + ':' + util.inspect(resultValue) + lf;
					});
					str += lf;
				});
			});

			return str;
		}

	});
};
