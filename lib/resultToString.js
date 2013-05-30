"use strict";
var _ = require('lodash');
var util = require('util');
var utils = require('./utils.js');
var grunt = require('grunt');

function ResultToString() {
	var lf = grunt.util.linefeed;

	function stats(result) {
		return util.format("Passed: %d, Failed: %d, Total: %d%s",
			result.stats.passTotal, result.stats.failTotal, result.stats.testsTotal, lf);
	}

	function failures(result) {
		var str = stats(result);
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
		stats: stats,
		failures: failures
	};
}

module.exports = function () {
	return new ResultToString();
};
