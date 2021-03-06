function ucFirst(str) {
	if (0 == str.length) {
		return str;
	}
	return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function ucFirstAll(str) {
	var words = str.split(' ');
	var ret = '';
	var i;
	if (words.length) {
		ret = ucFirst(words[0]);
	}
	for (i = 1; i < words.length; i++) {
		ret = ret + ' ' + ucFirst(words[i]);
	}
	return ret;
}

function compareStrings(val1, val2) {
	var ret, num1, num2;
	if ('string' != typeof (val1)) {
		val1 = '' + val1;
	}
	if ('string' != typeof (val2)) {
		val2 = '' + val2;
	}
	num1 = parseInt(val1);
	num2 = parseInt(val2);
	if (isNaN(num1) || isNaN(num2)) {
		val1 = val1.toLowerCase();
		val2 = val2.toLowerCase();
	} else {
		val1 = num1;
		val2 = num2;
	}
	if (val1 < val2) {
		ret = -1;
	} else if (val1 > val2) {
		ret = 1;
	} else {
		ret = 0;
	}
	return ret;
}

function compareValues(val1, val2) {
	if (typeof (val1) == 'object') {
		val1 = val1.toString();
	}
	if (typeof (val2) == 'object') {
		val2 = val2.toString();
	}
	return compareStrings(val1, val2);
}

function removePrefix(val, prefix) {
	if (val.indexOf(prefix) != 0) {
		return val;
	}
	return val.substr(prefix.length);
}

function changePrefix(val, from, to) {
	return to + removePrefix(val, from);
}

/**
 * Return true if the given value is an upper case character.
 */
function isUpperCase(c) {
	return c.charAt(0).toUpperCase() === c;
}

/**
 * Return true if the given value is a lower case character.
 */
function isLowerCase(c) {
	return c.charAt(0).toLowerCase() === c;
}

function isDigit(str) {
	return (1 === str.length) && str.charCodeAt(0) >= '0'.charCodeAt(0) && str.charCodeAt(0) <= '9'.charCodeAt(0);
}

/**
 * Return a copy of the given string with initial capitalisation.
 * @param str The original string, in any case
 * @returns A string whose initial character (only) is capitalised.
 */
function initialCaps(str) {
	return str.charAt(0).toUpperCase() + str.substr(1, str.length - 1).toLowerCase();
}

/**
 * Pad a value with zeroes on the left until it is at least as wide as the given width.
 * The returned value is never shorter than the given field width.
 */
function zeroPad(val, width) {
	val = '' + val;
	while (val.length < width) {
		val = '0' + val;
	}
	return val;
}

/**
 * Convert a camelCaseStringLikeThis into a hyphenated-version-like-this.
 * @param camelCase The camelCase string
 * @returns The hyphenated version
 */
function camelCaseToHyphenated(str) {
	return str.replace(/([A-Z])/g, function(s, m) {
		return '-' + m.toLowerCase();
	});
}

/**
 * Convert a hyphenated-string-like-this into a camelCaseVersionLikeThis.
 * @param str The hyphenated string
 * @returns The camelCase version
 */
function hyphenatedToCamelCase(str) {
	return str.replace(/-([a-zA-Z])/g, function(s, m) {
		return m.toUpperCase();
	});
}

// Workaround for lack of negative start offset support in String.substr in IE
// Fixed version of code at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr
/**
 *  Get the substring of a string
 *  @param  {integer}  start   where to start the substring
 *  @param  {integer}  length  how many characters to return
 *  @return {string}
 */
if ('ab'.substr(-1) != 'b') {
	var original = String.prototype.substr, replacement = function(start, length) {
		// did we get a negative start, calculate how much it is from the beginning of the string
		if (start < 0) {
			start = this.length + start;
		}
		// call the original function
		return original.call(this, start, length);
	};
	replacement.isPolyfill = true;
	if (Object.defineProperty) {
        Object.defineProperty(String.prototype, 'substr', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: replacement
        });
	} else {
		String.prototype.substr = replacement;
	}
}

// Polyfill for String.prototype.endsWith, introduced in Javascript 1.8.5
if (!String.prototype.endsWith) {
	var replacement = function (searchString, position) {
        position = position || this.length;
        position = position - searchString.length;
        return this.lastIndexOf(searchString) === position;
    };
    replacement.isPolyfill = true;
    if (Object.defineProperty) {
        Object.defineProperty(String.prototype, 'endsWith', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: replacement
        });
    } else {
    	String.prototype.endsWith = replacement;
    }
}
