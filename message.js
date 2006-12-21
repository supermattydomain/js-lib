function printMessage(msg) {
  var output = document.getElementById('messages');
  if (null == output) {
    output = document.createElement('div');
    output.setAttribute('id', 'messages');
    // FIXME: Doesn't work in IE 6.
    // document.documentElement is not, however, null
    document.documentElement.appendChild(output);
  }
  output.appendChild(document.createTextNode(msg));
  output.appendChild(document.createElement('br'));
}
