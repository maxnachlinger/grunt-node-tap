"use strict";
var test = require('tap').test;

test("A test test", function (t) {
	var input = [0, 1, 2];
	var expected = [0, 1, 2];
	;
	t.deepEqual(input, expected)
	t.end();
});
