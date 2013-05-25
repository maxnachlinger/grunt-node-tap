"use strict";
var test = require('tap').test;

test("Passing test", function (t) {
	t.ok(true);
	t.end();
});

test("Failing test", function (t) {
	t.ok(false);
	t.end();
});
