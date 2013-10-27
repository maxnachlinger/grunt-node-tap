"use strict";
var test = require('tap').test;

test("This test throw an error", function (t) {
	setTimeout(function() {
		throw new Error('test error');
	}, 100);
});
