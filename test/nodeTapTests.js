"use strict";
var util = require('util');
var path = require('path');
var test = require('tap').test;
var nodeTap = require('../lib/nodeTap.js');
var consts = require('../lib/consts.js');
var exitCodes = consts.exitCodes();
var tapPath = require.resolve('tap').replace(/\/tap\/lib\/.+/, '/tap/bin/tap.js');

test("Handles a file with test that throws an error", function (t) {
	nodeTap({
		outputType: 'stats',
		outputTo: 'console',
		tapPath: tapPath,
		files: [path.resolve(__dirname + '/data/throwsError.js')]
	}, function(err, res) {
		t.notOk(err, "No error was returned");
		t.ok(res, "A result was received: " + util.inspect(res));
		t.equal(res.exitCode, exitCodes.testsFailed, "The result indicated that a test failed");
		t.end();
	});
});

test("Handles a file with failing node-tap tests", function (t) {
	nodeTap({
		outputType: 'stats',
		outputTo: 'console',
		tapPath: tapPath,
		files: [path.resolve(__dirname + '/data/mixed.js')]
	}, function(err, res) {
		t.notOk(err, "No error was returned");
		t.ok(res, "A result was received: " + util.inspect(res));
		t.equal(res.exitCode, exitCodes.testsFailed, "The result indicated that a test failed");
		t.end();
	});
});

test("Handles a file with passing node-tap tests", function (t) {
	nodeTap({
		outputType: 'stats',
		outputTo: 'console',
		tapPath: tapPath,
		files: [path.resolve(__dirname + '/data/passing.js')]
	}, function(err, res) {
		t.notOk(err, "No error was returned");
		t.ok(res, "A result was received: " + util.inspect(res));
		t.equal(res.exitCode, exitCodes.testsPassed, "The result indicated that all tests passed");
		t.end();
	});
});

test("Handles N node-tap test files", function (t) {
	nodeTap({
		outputType: 'stats',
		outputTo: 'console',
		tapPath: tapPath,
		files: [
			path.resolve(__dirname + '/data/mixed.js'),
			path.resolve(__dirname + '/data/passing.js')
		]
	}, function(err, res) {
		t.notOk(err, "No error was returned");
		t.ok(res, "A result was received: " + util.inspect(res));
		t.equal(res.exitCode, exitCodes.testsFailed, "The result indicated that a test failed");
		t.end();
	});
});
