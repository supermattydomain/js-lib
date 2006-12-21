function printMessage(msg) {
  var output = document.getElementById('messages');
  if (null == output) {
    output = document.createElement('div');
    output.setAttribute('id', 'messages');
    document.documentElement.appendChild(output);
  }
  output.appendChild(document.createTextNode(msg));
  output.appendChild(document.createElement('br'));
}
