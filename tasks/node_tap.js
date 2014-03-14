'use strict';
var path = require('path');
var _ = require('lodash');
var utils = require('./../lib/utils.js');
var consts = require('./../lib/consts.js');
var exitCodes = consts.exitCodes();
var nodeTap = require('./../lib/nodeTap.js');

module.exports = function (grunt) {
	grunt.registerMultiTask('node_tap', 'A Grunt task to run node-tap tests and read their output.', function () {
		var done = this.async();
		var options = this.options();

		options.files = _(this.filesSrc)
			.map(utils.unary(grunt.file.expand))
			.flatten()
			.map(utils.unary(path.resolve))
			.filter(utils.unary(grunt.file.exists))
			.valueOf();

		options.tapPath = _.filter([
			process.cwd() + "/node_modules/tap/bin/tap.js",
			path.resolve(__dirname, '../node_modules/tap/bin/tap.js')
		], utils.unary(grunt.file.exists)).shift() || 'tap'; // assume global tap

		grunt.verbose.writeflags(options);

		nodeTap(_.omit(options, 'filesSrc'), function(err, res) {
			if(err) {
				grunt.fatal(err);
				return done();
			}
			if(res.exitCode === exitCodes.testsFailed)
				grunt.warn("Some tests failed.");

			done();
		});
	});
};
