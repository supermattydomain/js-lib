function bad(val) {
	return (null == val || undefined == val);
}

function assert(val) {
	if (bad(val)) {
		fatal('Undefined or null value');
	}
}

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

function compareValues(val1, val2) {
	if ('string' != typeof(val1) || 'string' != typeof(val2)) {
		fatal('Cannot compare non-strings');
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

function dumpArray(val) {
	var i;
	for (i = 0; i < val.length; i++) {
		dumpData(val[i]);
	}
}

function dumpData(val) {
	if (typeof(val) == 'array') {
		dumpArray(val);
	} else if (typeof(val) == 'string') {
		printMessage(val);
	} else if (typeof(val) == 'number') {
		printMessage(val);
	} else if (typeof(val) == 'object') {
		if (val instanceof Array) {
			dumpArray(val);
		} else if (val instanceof String) {
			printMessage(val);
		} else {
			printMessage(val.toString());
		}
	} else {
		printMessage(val);
	}
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
