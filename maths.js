/**
 * Generate a random integer between (and including) the two given numbers.
 * @param min The smallest value that should ever be returned. Must be >=0.
 * @param max The largest value that should ever be returned. Must be >min.
 * @returns A pseudo-random positive integer in the range [min..max]
 */
function randomFloatBetween(min, max) {
	return Math.random() * (max - min) + min;
}

function randomIntBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isEven(num) {
	return (0 === (num % 2));
}

function isOdd(num) {
	return (0 !== (num % 2));
}

// Round a number to an integer, towards zero
function trunc(x) {
	return (x < 0) ? Math.ceil(x) : Math.floor(x);
}

function sign(num) {
	return (num < 0) ? -1 : ((num > 0) ? 1 : 0);
}

function distance(x1, y1, x2, y2) {
	var xd = x2 - x1, yd = y2 - y1;
	return Math.sqrt(xd * xd + yd * yd);
}

function distanceSq(x1, y1, x2, y2) {
	var xd = x2 - x1, yd = y2 - y1;
	return xd * xd + yd * yd;
}

/**
 * Transform the given point by the given affine transformation matrix
 * (expressed as an HTML5 Canvas-style array of six reals),
 * and return the transformed point.
 * @param x The x co-ordinate of the point
 * @param y The y co-ordinate of the point
 * @param m The six-member affine transformation array
 * @returns {Array} [x, y] The transformed point
 */
function transformPoint(x, y, m) {
	return [
		m[0] * x + m[2] * y + m[4],
		m[1] * x + m[3] * y + m[5]
	];
}

/**
 * Calculate the logarithm to the given base of a given number.
 * @param base The logarithm base to be used
 * @param number The value whose logarithm to calculate
 * @returns {Number} The logarithm to the base base of number.
 */
function logBase(base, number) {
    return Math.log(number) / Math.log(base);
}

function roundPlaces(number, places) {
	var factor = Math.pow(10, places);
	return Math.round(number * factor) / factor;
}

/**
 * Return true if the two given values are each defined
 * and they are strictly equal.
 * @param val1 The first value to compare
 * @param val2 The second value to compare
 * @returns {Boolean} true if val1 and val2 are defined and equal
 */
function definedAndEqual(val1, val2) {
	return typeof(val1) !== 'undefined'
		&& typeof(val2) !== 'undefined'
		&& val1 === val2;
}

/**
 * Return true if the two given values are each defined
 * and they strictly differ from each other.
 * @param val1 The first value to compare
 * @param val2 The second value to compare
 * @returns {Boolean} true if val1 and val2 are defined and inequal
 */
function definedAndInequal(val1, val2) {
	return typeof(val1) !== 'undefined'
		&& typeof(val2) !== 'undefined'
		&& val1 !== val2;
}
