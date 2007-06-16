function bad(val) {
	return (null == val || undefined == val);
}

function good(val) {
	return !bad(val);
}

function dce(tag) {
	return document.createElement(tag);
}

function dctn(text) {
	return document.createTextNode(text);
}

function sa(node, attrName, attrValue) {
	node.setAttribute(attrName, attrValue);
}

function setClass(node, className) {
  sa(node, 'class', className);
  node.className = className;
}

function getDocumentStart() {
    var bodies = document.getElementsByTagName('body');
    if (bodies.length) {
    	return bodies[0];
    }
    if (document.documentElement) {
    	return document.documentElement;
    }
    return document;
}

function fatal(msg) {
  showLog(msg);
  throw msg;
}

function showStatus(str) {
  var status = document.getElementById('status');
  if (null == status) {
    status = dce('div');
    sa(status, 'id', 'status');
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

function assert(val) {
	if (!val) {
		fatal('assertion failed');
	}
}

function assertGood(val) {
	assert(!bad(val));
}
