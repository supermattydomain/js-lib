function printMessage(str) {
  // doesn't work in Mozilla
  // window.dump(str);
  var output = document.getElementById('messages');
  if (null == output) {
    output = document.createElement('div');
    output.setAttribute('id', 'messages');
    // FIXME: Doesn't work in IE 6.
    // document.documentElement is not, however, null
    document.documentElement.appendChild(output);
  }
  output.appendChild(document.createTextNode(str));
  output.appendChild(document.createElement('br'));
}

function showStatus(str) {
  var status = document.getElementById('status');
  if (null == status) {
    status = document.createElement('div');
    status.setAttribute('id', 'status');
    // FIXME: Doesn't work in IE 6.
    // document.documentElement is not, however, null
    document.documentElement.appendChild(status);
  }
  if (status.firstChild) {
    status.removeChild(status.firstChild);
  }
  var textNode = document.createTextNode(str);
  status.appendChild(textNode);
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
  if (null != node.nodeValue && undefined != node.nodeValue) {
    printMessage(node.nodeValue);
  }
  tag = '</' + node.nodeName + '>';
  printMessage(tag);
}
