"use strict";
var test = require('tap').test;

test("Passing test", function (t) {
	t.ok(true, "true should be ok");
	t.end();
});

test("Failing test", function (t) {
	t.ok(false, "false should be ok");
	t.end();
});
