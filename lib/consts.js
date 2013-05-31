"use strict";

module.exports = function () {
	return {
		outputLevels: function () {
			return ['stats', 'failures', 'tap-stream'];
		},
		outputDestinations: function () {
			return ['console', 'file'];
		},
		exitCodes: function () {
			return {
				fatal: 1,
				taskFailed: 3
			};
		}
	};
};
