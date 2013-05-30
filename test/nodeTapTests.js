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
		t.ok(res.failedTests, "Output was returned.");
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
		t.ok(res.failedTests, "Output was returned.");
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
		t.ok(res.failedTests, "Output was returned.");
		t.end();
	});
});

function givenFilePaths(paths, cb) {
	var nodeTap = require('../tasks/node_tap.js');
	grunt.files = paths;
	nodeTap(grunt, cb);
}
