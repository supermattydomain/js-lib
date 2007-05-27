function bad(thing) { return (undefined == thing) || (null == thing); }
function good(thing) { return !bad(thing); }

function showString(msg) {
	var log = document.getElementById('log');
	if (bad(log)) {
		alert('No log div');
	}
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
