'use strict';
var node_tap = require('../lib/nodeTap.js');
var path = require('path');
var utils = require('../lib/utils.js');
var util = require('util');
var _ = require('lodash');
var outputCreator = require('../lib/outputCreator.js');

module.exports = function (grunt) {
	var exitCodes = {
		fatal: 1,
		taskFailed: 3
	};

	grunt.registerMultiTask('node_tap', 'A Grunt task to run node-tap tests and read their output.', function () {
		var self = this;
		var done = this.async();
		var lf = grunt.util.linefeed;
		var output = '';

		var options = this.options();
		grunt.verbose.writeflags(options);
		checkOptions();

		var foundFiles = gatherFiles();
		grunt.verbose.writeln("Files to process:", foundFiles);

		if (foundFiles.length === 0)
			return grunt.fail.fatal("None of the files passed exist.", exitCodes.fatal);

		var nodeTap = node_tap({
			filePaths: foundFiles
		}, function (err, result) {
			if (err)
				return grunt.fatal(err, exitCodes.fatal);

			if(outputCreator[options.outputLevel])
				output = outputCreator[options.outputLevel](result);

			if(options.outputTo === 'file') {
				grunt.file.write(options.outputTo, output);
			} else {
				if (!result.testsPassed)
					return grunt.warn(output + lf);

				grunt.log.writeln(output);
			}
			done();
		});

		if(options.outputLevel === 'tap-stream') {
			nodeTap.on('data', function(data) {
				if(options.outputTo === 'console')
					return grunt.log.writeln(util.inspect(data));

				output += data + lf;
			});
		}

		function checkOptions() {
			var levels = outputCreator.outputLevels;
			if (!~levels.indexOf(options.outputLevel)) {
				return grunt.fail.fatal(util.format("Invalid outputLevel option [%s] passed, valid outputLevel options " +
					"are: [%s]", options.outputLevel, levels.join(", ")), exitCodes.fatal);
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
