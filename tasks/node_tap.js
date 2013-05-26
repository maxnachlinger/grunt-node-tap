'use strict';
var node_tap = require('../lib/nodeTap.js');
var utils = require('../lib/utils.js');
var util = require('util');
var _ = require('lodash');
var outputCreator = require('../lib/outputCreator.js')();

module.exports = function (grunt) {
	var exitCodes = {
		fatal: 1,
		taskFailed: 3
	};

	grunt.registerMultiTask('node_tap', 'A Grunt task to run node-tap tests and read their output.', function () {
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

			var output = outputCreator[options.outputLevel](result);

			if (!result.testsPassed) {
				return grunt.warn(output + lf);
			}

			grunt.log.writeln(output);
			done();
		});

		function checkOptions() {
			var levels = outputCreator.outputLevels;
			if (!~levels.indexOf(options.outputLevel)) {
				return grunt.fail.fatal("Invalid option [" + options.outputLevel + "] passed, valid options are: [" +
					levels.join(", ") + "]", exitCodes.fatal);
			}
		}

		function gatherFiles() {
			return _(self.filesSrc)
				.map(utils.unary(grunt.file.expand))
				.flatten()
				.filter(utils.unary(grunt.file.exists))
				.valueOf();
		}

	});
};
