"use strict";
var grunt = require('grunt');
var _ = require('lodash');
var util = require('util');
var utils = require('./utils.js');

function OutputCreator() {
	var lf = grunt.util.linefeed;

	function getStatsOutput(result) {
		var stats = result.stats;
		return util.format("Passed: %d, Failed: %d, Total: %d", stats.passTotal, stats.failTotal, stats.testsTotal);
	}

	function getFailuresOutput(result) {
		var str = getStatsOutput(result);
		if (result.testsPassed) return str;

		str += util.format("%s%sFailures:%s%s", lf, lf, lf, lf);

		_(result.failedTests).forEach(function (resultObj) {
			resultObj = _.omit(resultObj, 'id', 'ok');
			_(resultObj).forEach(function (resultValue, resultKey) {
				str += resultKey + ':' + util.inspect(resultValue) + lf;
			});
			str += lf;
		});

		return str;
	}

	return {
		stats: getStatsOutput,
		failures: getFailuresOutput,
		outputLevels: ['failures', 'stats', 'tap-stream']
	};
}

module.exports = new OutputCreator();
