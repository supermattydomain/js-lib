function bad(thing) { return (undefined == thing) || (null == thing); }
function good(thing) { return !bad(thing); }

function dce(tag) {
	return $(document.createElement(tag));
}

function dctn(text) {
	return $(document.createTextNode(text));
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

Object.prototype.setDebug = function(debugOn) {
	this.debug = debugOn;
};

Object.prototype.debugLog = function(msg) {
	if (this.debug) {
		showLog(msg);
	}
};

function fatal(msg) {
  showLog(msg);
  alert(msg);
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
		fatal('assertion failed: ' + val);
	}
}

function assertGood(val) {
	assert(!bad(val));
}

function getLogDiv() {
	return $('logDiv');
}

function clearLog() {
	var log = getLogDiv();
	if (!log) {
		return;
	}
	while (log.firstChild) {
		log.removeChild(log.firstChild);
	}
}

function showString(msg) {
	var log = getLogDiv();
	if (log) {
		log.appendChild(document.createTextNode(msg));
		log.appendChild(document.createElement('br'));
		// $('log').appendChild(document.createTextNode(msg));
		// new Insertion.Before('log', msg.escapeHTML() + '<br>');
	} else {
		alert(msg);
	}
}

function showNode(node) {
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
    showString(tag);
  } else {
    tag += '/>';
    showString(tag);
    return;
  }
  if (node.hasChildNodes()) {
    for (i = 0; i < node.childNodes.length; i++) {
      showNode(node.childNodes[i]);
    }
  }
  if (node.nodeValue) {
    showString(node.nodeValue);
  }
  tag = '</' + node.nodeName + '>';
  showString(tag);
}

function showArray(val) {
	var i;
	showString('[');
	if (val.length) {
		showLog(val[0]);
	}
	for (i = 1; i < val.length - 1; i++) {
		showLog(', ' + val[i]);
	}
	showString(']');
}

function showObject(obj) {
   showString('{');
   for (var i in obj) {
      showString(i + ':');
      showLog(obj[i]);
   }
   showString('}');
}

function showLog(val) {
	if (null == val) {
		showString('null');
	} else if (undefined == val) {
		showString('undefined');
	} else if (typeof(val) == 'array') {
		showArray(val);
	} else if (typeof(val) == 'string') {
		showString(val);
	} else if (typeof(val) == 'number') {
		showString(val + '');
	} else if (typeof(val) == 'object') {
		// showString('got object');
		try {
			if (good(val.constructor)) {
				showString('constructor: ' + val.constructor);
			}
		} catch (baz) {
		}
		try {
			if (good(val.message)) {
				showString(val.message);
				return;
			}
		} catch (emessage) {
			showString('message exception: ' + emessage.message);
		}
		try {
			if (val instanceof Array) {
				// showString('got Array instance');
				showArray(val);
				return;
			}
		} catch (earray) {
			showString('showArray exception: ' + earray.message);
		}
		try {
			if (val instanceof String) {
				// showString('got String instance');
				showString(val.toString());
				return;
			}
		} catch (estring) {
			// showString('toString exception: ' + estring.message);
		}
		try {
			if (val instanceof XMLDocument) {
				// showString('got XMLDocument instance');
				showNode(val);
				return;
			}
		} catch (exmldocument) {
			// showString('showNode exception: ' + exmldocument.message);
		}
		try {
			if (val instanceof Document) {
				// showString('got Document instance');
				showNode(val);
				return;
			}
		} catch (edocument) {
			// showString('showNode exception: ' + edocument.message);
		}
		try {
			if (val instanceof Node) {
				// showString('got Node instance');
				showNode(val);
				return;
			}
		} catch (enode) {
			// showString('showNode exception: ' + enode.message);
		}
		try {
			// showString('using showObject');
			showObject(val);
			return;
		} catch (eshowobject) {
			// showString('showObject exception: ' + eshowobject.message);
		}
		try {
			// showString('using toString');
			showString(val.toString());
			return;
		} catch(etostring) {
			// showString('toString exception: ' + etostring.message);
		}
		try { showString(Object.toJSON(val)); return; } catch (foo) {}
		try { showString(Object.inspect(val)); return; } catch (bar) {}
		showString('Cannot display value');
	} else {
		showString("Unrecognised typeof '" + typeof(val) + "'");
		showString(val);
	}
}

function showResponse(resp) {
	try {
		// showLog('Got response');
		// showLog(resp);
		var ct = resp.getResponseHeader('Content-Type');
		showLog('Response content type: ' + ct);
		if (good(resp.responseXML)) {
			showLog('responseXML:');
			showLog(resp.responseXML);
		}
		if (good(resp.responseText)) {
			showLog('responseText:');
			showLog(resp.responseText);
		}
	} catch (ee) {
		showLog('Exception showing response: ' + e.message);
	}
}
