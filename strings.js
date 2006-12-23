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
