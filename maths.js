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

function sgn(num) {
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
