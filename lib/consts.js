"use strict";

module.exports = (function () {
	return {
		outputTypes: function () {
			return ['stats', 'failures', 'tap'];
		},
		outputDestinations: function () {
			return ['console', 'file'];
		},
		exitCodes: function () {
			return {
				fatal: 'fatal',
				badInput: 'bad-input',
				testsFailed: 'tests-failed',
				testsPassed: 'tests-passed'
			};
		}
	};
})();
