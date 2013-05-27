"use strict";
var grunt = require('grunt');
var _ = require('lodash');
var util = require('util');
var utils = require('./utils.js');

function OutputCreator() {
	var lf = grunt.util.linefeed;

	function getStatsOutput(result) {
		var stats = { failTotal: 0, passTotal: 0, testsTotal: 0 };

		// pick the keys from stats out of the results, add the values to stats
		_(utils.arrayPick(result.results, _.keys(stats))).forEach(function (res) {
			_.forEach(res, function (resValue, resKey) {
				stats[resKey] += resValue;
			});
		});

		return util.format("Passed: %d, Failed: %d, Total: %d", stats.passTotal, stats.failTotal, stats.testsTotal);
	}

	function getFailuresOutput(result) {
		var str = getStatsOutput(result);
		if (result.testsPassed) return str;

		str += util.format("%s%sFailures:%s%s", lf, lf, lf, lf);

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

	return {
		stats: getStatsOutput,
		failures: getFailuresOutput,
		tap: utils.get('tapOutput'),
		outputLevels: ['failures', 'stats', 'tap']
	};
}

module.exports = new OutputCreator();
