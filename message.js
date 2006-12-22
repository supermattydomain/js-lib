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
function printNode(node) {
  var tag = '<' + node.nodeName;
  var i;
  if (null != node.attributes && undefined != node.attributes) {
    for (i = 0; i < node.attributes.length; i++) {
      var attr = node.attributes[i];
      tag = tag + ' ' + attr.name + '=' + attr.value;
    }
  }
  tag = tag + '>';
  printMessage(tag);
  if (null != node.childNodes && undefined != node.childNodes) {
    for (i = 0; i < node.childNodes.length; i++) {
      printNode(node.childNodes[i]);
    }
  }
  tag = '</' + node.nodeName + '>';
  printMessage(tag);
}
