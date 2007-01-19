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

function appendMessage(node, str) {
  node.appendChild(dctn(str));
  node.appendChild(dce('br'));
}

function printMessage(str) {
  // doesn't work in Mozilla
  // window.dump(str);
  var output = document.getElementById('messages');
  if (bad(output)) {
    output = dce('div');
    sa(output, 'id', 'messages');
	var docStart = getDocumentStart();
	docStart.insertBefore(output, docStart.firstChild);
  }
  appendMessage(output, str);
}

function fatal(msg) {
  printMessage(msg);
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

function assert(val) {
	if (!val) {
		fatal('assertion failed');
	}
}

function assertGood(val) {
	assert(!bad(val));
}

function dumpArray(val) {
	var i;
	for (i = 0; i < val.length; i++) {
		dumpData(val[i]);
	}
}

function dumpObject(obj) {
   printMessage('{');
   for (var i in obj) {
      result += obj_name + "." + i + " = " + obj[i] + "<BR>"
      printMessage(i + ':');
      dumpData(obj[i]);
   }
   printMessage('}');
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
			dumpObject(val);
		}
	} else {
		printMessage(val);
	}
}
