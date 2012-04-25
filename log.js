function bad(thing) {
	return (typeof(thing) === 'undefined') || (null === thing);
}
function good(thing) {
	return !bad(thing);
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
  debug(msg);
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
  if (bad(e) && good(eval('window.event'))) {
    e = eval('window.event');
  }
  if (good(eval('e.srcElement'))) {
    return eval('e.srcElement');
  } else if (good(eval('e.target'))) {
    return eval('e.target');
  }
  throw 'Cannot find event target';
}

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

var nodeTypeText = 3;

function findTextChild(node) {
	return findChildByType(node, nodeTypeText);
}

function assert(val) {
	if (!val) {
		fatal('assertion failed: ' + val);
	}
}

function assertGood(val) {
	assert(!bad(val));
}

var logDivID = 'logDiv';

function getLogDiv() {
	var ret = document.getElementById(logDivID);
	if (!ret) {
		var msg = "No div with id '" + logDivID + "'";
		alert(msg);
		throw msg;
	}
	return ret;
}

function clearLog() {
	var log = getLogDiv();
	while (log.firstChild) {
		log.removeChild(log.firstChild);
	}
}

function showString(msg) {
	var log = getLogDiv();
	log.appendChild(document.createTextNode(msg));
	log.appendChild(document.createElement('br'));
	// $('log').appendChild(document.createTextNode(msg));
	// new Insertion.Before('log', msg.escapeHTML() + '<br>');
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

function literal(val) {
	if (typeof(val) == 'string') {
		return "'" + val + "'";
	} else {
		return val;
	}
}

function showArray(val) {
	var i;
	showString('[');
	if (val.length) {
		showLog(literal(val[0]) + ((val.length > 1) ? ',' : ''));
	}
	for (i = 1; i < val.length - 1; i++) {
		showLog(literal(val[i]) + ',');
	}
	for (; i < val.length; i++) {
		showLog(literal(val[i]));
	}
	showString(']');
}

function showObject(obj, recursive) {
   showString('{');
   for (var i in obj) {
      if ('object' == typeof(obj[i])) {
    	  if (recursive) {
    		  showString(i + ':');
    		  showLog(obj[i]);
    	  } else {
    		  showString(i + ": <object>");
    	  }
      } else {
    	  showString(i + ': ' + obj[i]);
      }
   }
   showString('}');
}

function showConstructor(obj) {
	if (good(obj.constructor)) {
		showString('constructor: ' + obj.constructor);
	}
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
	} else if (typeof(val) == 'function') {
		showString(val + '');
	} else if (typeof(val) == 'object') {
		// showString('got object');
		// try { showConstructor(val); } catch (ignored) {};
		/*
		try {
			if (good(val.message)) {
				showString(val.message);
				return;
			}
		} catch (emessage) {
			showString('message exception: ' + emessage.message);
		}
		*/
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
				showObject(val, false);
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
		try { eval('showString(Object.toJSON(val))'); return; } catch (foo) {}
		try { eval('showString(Object.inspect(val))'); return; } catch (bar) {}
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
