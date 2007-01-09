function dce(tag) {
	return document.createElement(tag);
}

function dctn(string) {
	return document.createTextNode(string);
}

function setClass(node, className) {
  node.setAttribute('class', className);
  node.className = className;
}

function printMessage(str) {
  // doesn't work in Mozilla
  // window.dump(str);
  var output = document.getElementById('messages');
  if (null == output) {
    output = dce('div');
    output.setAttribute('id', 'messages');
    // FIXME: Doesn't work in IE 6.
    // document.documentElement is not, however, null
    document.documentElement.appendChild(output);
  }
  output.appendChild(dctn(str));
  output.appendChild(dce('br'));
}

function fatal(msg) {
  printMessage(msg);
  throw msg;
}

function showStatus(str) {
  var status = document.getElementById('status');
  if (null == status) {
    status = dce('div');
    status.setAttribute('id', 'status');
    // FIXME: Doesn't work in IE 6.
    // document.documentElement is not, however, null
    document.documentElement.appendChild(status);
  }
  if (status.firstChild) {
    status.removeChild(status.firstChild);
  }
  var textNode = dctn(str);
  status.appendChild(textNode);
}

function printNode(node) {
  var tag = '<' + node.nodeName;
  var i;
  if (node.attributes) {
    for (i = 0; i < node.attributes.length; i++) {
      var attr = node.attributes[i];
      tag = tag + ' ' + attr.name + '="' + attr.value + '"';
    }
  }
  if (node.hasChildNodes() || node.nodeValue) {
    tag += '>';
    printMessage(tag);
  } else {
    tag += '/>';
    printMessage(tag);
    return;
  }
  if (node.hasChildNodes()) {
    for (i = 0; i < node.childNodes.length; i++) {
      printNode(node.childNodes[i]);
    }
  }
  if (node.nodeValue) {
    printMessage(node.nodeValue);
  }
  tag = '</' + node.nodeName + '>';
  printMessage(tag);
}

function getEventSource(e) {
  if (!e) {
    e = window.event;
  }
  if (e.srcElement) {
    return e.srcElement;
  } else if (e.target) {
    return e.target;
  }
  throw 'Cannot find event target';
}

var nodeTypeText = 3;

function findChildByType(node, type) {
  if (null == node || undefined == node) {
    return null;
  }
  if (node.nodeType == type) {
    return node;
  }
  if (!node.hasChildNodes()) {
    return null;
  }
  node = node.firstChild;
  while (node != null && node != undefined) {
    var child = findChildByType(node, type);
    if (null != child) {
      return child;
    }
    node = node.nextSibling;
  }
  return null;
}
