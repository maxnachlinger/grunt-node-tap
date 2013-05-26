var _ = require('lodash');

exports.unary = function (fn) {
	if (fn.length == 1) return fn;
	return function (args) {
		return fn.call(this, args);
	}
};

exports.arrayPick = function (arr, props) {
	var props = _.rest(arguments, 1); // ignore arr

	return _.map(arr, function (i) {
		return _.pick.apply(null, [i].concat(props));
	});
};

exports.noArgs = function (fn) {
	return function () {
		return fn.call(this);
	}
};
