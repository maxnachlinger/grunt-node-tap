var _ = require('lodash');

function unary(fn) {
	if (fn.length == 1) return fn;
	return function (args) {
		return fn.call(this, args);
	}
}

function arrayPick(arr, props) {
	var props = _.rest(arguments, 1); // ignore arr

	return _.map(arr, function (i) {
		return _.pick.apply(null, [i].concat(props));
	});
}

function noArgs(fn) {
	return function () {
		return fn.call(this);
	}
}

function getProperty(property) {
	return function (obj) {
		return obj[property];
	}
}

module.exports = {
	unary: unary,
	arrayPick: arrayPick,
	noArgs: noArgs,
	getProperty: getProperty
};
