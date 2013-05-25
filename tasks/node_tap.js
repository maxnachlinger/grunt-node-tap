'use strict';
var node_tap = require('../lib/node_tap.js');

var exitCodes = {
	fatal: 1,
	taskFailed: 3
};

module.exports = function (grunt) {
	var fail = grunt.fail;
	var _ = grunt.util._;

	grunt.registerMultiTask('node_tap', 'A Grunt task to run node-tap tests and read their output.', function () {
		var done = this.async();
		var filePaths = _(this.files).pluck('src').valueOf();

		node_tap({
			filePaths: filePaths,
			grunt: grunt
		}, function (err, res) {
			if (err) {
				return fail.fatal(err, exitCodes.fatal);
			}
			if (!res.testsPassed) {
				return fail.warn("Some tests failed" + res.output, exitCodes.taskFailed);
			}
			done();
		});

	});
};
