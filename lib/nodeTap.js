'use strict';
var fs = require('fs');
var path = require('path');
var util = require('util');
var childProcess = require('child_process').spawn;
var grunt = require('grunt');
var _ = require('lodash');
var TapConsumer = require('tap').createConsumer;
var consts = require('./consts.js');
var utils = require('./utils.js');

module.exports = function(options, mainCb) {
	var files = options.files;
	var outputType = options.outputType;
	var outputTo = options.outputTo;
	var outputFilePath = options.outputFilePath;

	var exitCodes = consts.exitCodes();

	var optionsErrors = checkOptions();
	if(optionsErrors)
		return mainCb(optionsErrors);

	var result = {
		testsPassed: true,
		fileOutput: ''
	};

	runTests(function (err) {
		if (err)
			return mainCb(err);

		if (outputTo === 'file')
			fs.writeFileSync(outputFilePath, result.fileOutput);

		var ret = {exitCode: exitCodes.testsFailed};
		if (result.testsPassed)
			ret = {exitCode: exitCodes.testsPassed};

		mainCb(null, ret);
	});

	function checkOptions() {
		if (!files || _.isEmpty(files)) {
			return {
				message: 'No files passed to test',
				exitCode: exitCodes.badInput
			};
		}

		var outputTypes = consts.outputTypes();
		if (!~outputTypes.indexOf(outputType)) {
			return {
				message: util.format('Invalid outputType option [%s] passed, valid outputType options are: [%s]', outputType, outputTypes.join(', ')),
				exitCode: exitCodes.badInput
			};
		}

		var outputDests = consts.outputDestinations();
		if (!~outputDests.indexOf(outputTo)) {
			return {
				message: util.format('Invalid outputTo option [%s] passed, valid outputTo options are: [%s]', outputTo, outputDests.join(', ')),
				exitCode: exitCodes.badInput
			};
		}

		if (outputTo === 'file' && !outputFilePath) {
			return {
				message: 'The outputFilePath option must be passed when outputting to a file',
				exitCode: exitCodes.badInput
			};
		}
	}

	function runTests(cb) {
		grunt.util.async.forEachSeries(files, function (file, eCb) {
			var tapConsumer = new TapConsumer();

			var proc = childProcess('node', [file]);
			proc.stdout.pipe(tapConsumer);
			proc.stderr.pipe(process.stderr);

			if (outputType === 'tap')
				proc.stdout.on('data', sendOutput);

			proc.on('close', function () {
				_.forEach(['close', 'data', 'end', 'error'], proc.removeAllListeners);
				eCb();
			});

			tapConsumer.on('end', function () {
				var shortFile = file.replace(process.cwd(), '.');
				_.forEach(['close', 'data', 'end', 'error'], tapConsumer.removeAllListeners);

				var stats = statsToString(shortFile, tapConsumer.results);

				if (~['stats', 'failures'].indexOf(outputType))
					sendOutput(stats);

				if (tapConsumer.results.ok) return;
				result.testsPassed = false;

				if (outputType === 'failures') {
					var failedTests = _(tapConsumer.results.list).reject('ok').valueOf();
					sendOutput(failuresToString(shortFile, failedTests));
				}
			});
		}, cb);
	}

	function sendOutput(output) {
		return {
			console: grunt.log.writeln,
			file: storeOutputForFile
		}[outputTo](output);
	}

	function storeOutputForFile(data) {
		result.fileOutput += data;
	}

	function statsToString(file, result) {
		return util.format("Stats: %s: %d/%d", file, result.passTotal, result.testsTotal);
	}

	function failuresToString(file, failures) {
		var lf = grunt.util.linefeed;
		var str = util.format("%sFile:%s%sFailures:%s", lf, file, lf, lf);

		_(failures).forEach(function (resultObj) {
			resultObj = _.omit(resultObj, 'id', 'ok');
			_(resultObj).forEach(function (resultValue, resultKey) {
				str += resultKey + ':' + util.inspect(resultValue) + lf;
			});
			str += lf;
		});

		return str;
	}

};
