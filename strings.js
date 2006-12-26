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
  var num1 = Number(val1);
  var num2 = Number(val2);
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
  // printMessage('compareValues: ret=' + ret);
  return ret;
}
