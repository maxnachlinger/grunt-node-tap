'use strict';
var fs = require('fs');
var util = require('util');
var spawn = require('win-spawn');
var grunt = require('grunt');
var _ = require('lodash');
var tap = require('tap');
var TapConsumer = tap.createConsumer;
var consts = require('./consts.js');

module.exports = function (options, mainCb) {
	var files = options.files;
	var outputType = options.outputType;
	var outputTo = options.outputTo;
	var outputFilePath = options.outputFilePath;
	var tapPath = options.tapPath;

	var exitCodes = consts.exitCodes();

	var optionsErrors = checkOptions();
	if (optionsErrors)
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
			var proc = spawn(tapPath, ['--tap', file]);

			if (outputType === 'tap')
				proc.stdout.on('data', sendOutput);

			proc.stdout.pipe(tapConsumer);

			proc.on('close', closeProc(proc, eCb));

			tapConsumer.on('end', function () {
				closeProc(tapConsumer)();

				var shortFile = file.replace(process.cwd(), '.');
				var stats = statsToString(shortFile, tapConsumer.results);

				if (~['stats', 'failures'].indexOf(outputType))
					sendOutput(stats);

				if (tapConsumer.results.ok) return;
				result.testsPassed = false;

				if (outputType === 'failures') {
					var failedTests = _.reject(tapConsumer.results.list, 'ok');
					sendOutput(failuresToString(shortFile, failedTests));
				}
			});
		}, cb);
	}

	function closeProc(proc, cb) {
		return function() {
			_.forEach(['close', 'data', 'end', 'error'], proc.removeAllListeners);
			if(cb) cb();
		};
	}

	function sendOutput(output) {
		return {
			console: grunt.log.write,
			file: storeOutputForFile
		}[outputTo](output);
	}

	function storeOutputForFile(data) {
		result.fileOutput += data;
	}

	function statsToString(file, tapResult) {
		return util.format("Stats: %s: %d/%d\n", file, tapResult.passTotal, tapResult.testsTotal);
	}

	function failuresToString(file, failures) {
		var lf = grunt.util.linefeed;
		var str = util.format("%sFile:%s%sFailures:%s", lf, file, lf, lf);

		_(failures).forEach(function (resultObj) {
			resultObj = _.omit(resultObj, 'id', 'ok');
			_(resultObj).forEach(function (resultValue, resultKey) {
				if(!resultValue) return;
				if(_.isArray(resultObj[resultKey]))
					resultValue = util.inspect(resultValue);
				str += resultKey + ':' + resultValue + lf;
			});
		});

		return str;
	}

};
