function ucFirst(str) {
  if (0 == str.length) {
    return str;
  }
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function ucFirstAll(str) {
  var words = str.split(' ');
  var ret;
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
	if ('string' != typeof(val1) || 'string' != typeof(val2)) {
		fatal('compareStrings: not strings');
	}
	// printMessage('In compareValues: ' + val1 + ' ' + val2);
	var num1 = parseInt(val1);
	var num2 = parseInt(val2);
	if (isNaN(num1) || isNaN(num2)) {
		val1 = val1.toLowerCase();
		val2 = val2.toLowerCase();
	} else {
		val1 = num1;
		val2 = num2;
	}
	// printMessage('compareValues: ' + val1 + ' ' + val2);
	var ret;
	if (val1 < val2) {
		ret = -1;
	} else if (val1 > val2) {
		ret = 1;
	} else {
		ret = 0;
	}
	// printMessage('compareValues(' + val1 + ', ' + val2 + ') => ' + ret);
	return ret;
}

function compareValues(val1, val2) {
	if (bad(val1) || bad(val2)) {
		fatal('compareValues: bad values');
	}
	if (typeof(val1) == 'object') {
		val1 = val1.toString();
	}
	if (typeof(val2) == 'object') {
		val2 = val2.toString();
	}
	return compareStrings(val1, val2);
}

function removePrefix(val, prefix) {
	if (val.indexOf(prefix) != 0) {
		fatal('Prefix ' + prefix + ' not a prefix of value ' + val);
		return val;
	}
	return val.substr(prefix.length);
}

function changePrefix(val, from, to) {
  return to + removePrefix(val, from);
}
