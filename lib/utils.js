exports.unary = unary;

function unary(fn) {
	if (fn.length == 1) return fn;
	return function (args) {
		return fn.call(this, args);
	}
}
