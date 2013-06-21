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

function distanceGt(x1, y1, x2, y2, d) {
	var xd = Math.abs(x2 - x1), yd = Math.abs(y2 - y1);
	if (xd > d || yd > d) {
		return true;
	}
	if (xd * xd + yd * yd > d * d) {
		return true;
	}
	return false;
}

/**
 * Calculate the greatest common divisor of the given two numbers.
 * This is the largest number which exactly divides both numbers.
 * @param a The first number, an integer or rational number.
 * @param b The second number, an integer or rational number.
 * @returns The greatest common divisor of the two numbers
 */
function gcd(a, b) {
	var tmp;
	while (b) {
		tmp = b;
		b = a % b;
		a = tmp;
	}
	return a;
}

/**
 * Calculate an approximation to the greatest common divisor of the given two numbers.
 * This is the largest number which exactly or almost exactly divides both numbers.
 * @param a The first number.
 * @param b The second number.
 * @param eta A small number, defining 'almost' above.
 * @returns A number close to the greatest common divisor of the two numbers.
 */
function gcdApprox(a, b, eta) {
	var tmp;
	eta = eta || 0.0001;
	while (b > eta) {
		tmp = b;
		b = a % b;
		a = tmp;
	}
	return a;
}

/**
 * Calculate the greatest common divisor of the given two integers
 * using the 'Binary GCD' algorithm (Stein, 1967).
 * See http://en.wikipedia.org/wiki/Binary_GCD_algorithm
 * @param a The first integer.
 * @param b The second integer.
 * @returns The greatest common divisor of the two numbers
 */
function gcdInts(u, v) {
  var shift, tmp;
 
  /* GCD(0,v) == v; GCD(u,0) == u, GCD(0,0) == 0 */
  if (u === 0) return v;
  if (v === 0) return u;
 
  /* Let shift := lg K, where K is the greatest power of 2
        dividing both u and v. */
  for (shift = 0; ((u | v) & 1) === 0; ++shift) {
      u >>= 1;
      v >>= 1;
  }
 
  while ((u & 1) === 0)
      u >>= 1;
 
  /* From here on, u is always odd. */
  do {
      /* remove all factors of 2 in v -- they are not common */
      /*   note: v is not zero, so while will terminate */
      while ((v & 1) === 0)  /* Loop X */
          v >>= 1;

      /* Now u and v are both odd. Swap if necessary so u <= v,
         then set v = v - u (which is even). For bignums, the
         swapping is just pointer movement, and the subtraction
         can be done in-place. */
      if (u > v) {
          tmp = v; v = u; u = tmp;  // Swap u and v.
      }
      v = v - u;                       // Here v >= u.
  } while (v != 0);

  /* restore common factors of 2 */
  return u << shift;
}

/**
 * Calculate the least common multiple of the given two numbers.
 * @param a The first number, an integer or rational number.
 * @param b The second number, an integer or rational number.
 * @returns The least common multiple of the given two numbers.
 */
function lcm(a, b) {
	return a * b / gcd(a, b);
}

/**
 * Calculate an approximation to the least common multiple of the given two numbers.
 * @param a The first number.
 * @param b The second number.
 * @param A small number, defining the closeness of the approximation.
 * @returns A number close to the least common multiple of the given two numbers.
 */
function lcmApprox(a, b, eta) {
	return a * b / gcdApprox(a, b, eta);
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

/**
 * Round the given number to the given number of decimal places.
 * @param number The number to be rounded.
 * @param places The esired number of decimal places.
 * @returns {Number} The number rounded to the given number of decimal places.
 */
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
