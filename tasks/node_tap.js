'use strict';
var os = require('os');
var path = require('path');
var _ = require('lodash');
var utils = require('./../lib/utils.js');
var consts = require('./../lib/consts.js');
var exitCodes = consts.exitCodes();
var nodeTap = require('./../lib/nodeTap.js');
var tap = require('tap');

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

		options.tapPath = require.resolve('tap').replace(/\/tap\/lib\/.+/, '/tap/bin/tap.js');

		// for windows we want the tap executable in node_modules/.bin
		if(os.platform() === 'win32')
			options.tapPath = path.resolve(require.resolve('tap').replace(/\\tap\\.+/, '/.bin/tap.cmd'));

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
