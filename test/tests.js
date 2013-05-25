"use strict";
var test = require('tap').test;
var grunt = require('grunt');

test("Handles failed node-tap tests", function (t) {
	givenFilePaths([
		'./data/mixed.js'
	], function (err, res) {
		t.notOk(err, "No error was returned");
		t.ok("A result was received");
		t.notOk(res.testsPassed, "Some tests failed.");
		t.ok(res.output, "Output was returned.");
		t.end();
	});
});

test("Handles passed node-tap tests", function (t) {
	givenFilePaths([
		'./data/passing.js'
	], function (err, res) {
		t.notOk(err, "No error was returned");
		t.ok("A result was received");
		t.ok(res.testsPassed, "All tests passed.");
		t.ok(res.output, "Output was returned.");
		t.end();
	});
});

test("Handles N node-tap test files", function (t) {
	givenFilePaths([
		'./data/mixed.js',
		'./data/passing.js'
	], function (err, res) {
		t.notOk(err, "No error was returned");
		t.ok("A result was received");
		t.notOk(res.testsPassed, "Some tests failed.");
		t.ok(res.output, "Output was returned.");
		t.end();
	});
});

function givenFilePaths(paths, cb) {
	var node_tap = require('../lib/node_tap.js');
	node_tap({
		grunt: grunt,
		filePaths: paths
	}, cb);
}
