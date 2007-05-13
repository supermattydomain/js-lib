function bad(thing) { return (undefined == thing) || (null == thing); }
function good(thing) { return !bad(thing); }

function showString(msg) {
	// $('log').appendChild(document.createTextNode(msg));
	new Insertion.Before('log', msg.escapeHTML() + '<br>');
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
	for (i = 0; i < val.length; i++) {
		showLog(val[i]);
	}
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
		if (val instanceof Array) {
			showArray(val);
		} else if (val instanceof String) {
			showString(val);
		} else if (val instanceof Node) {
			showNode(val);
		} else {
			showObject(val);
		}
	} else {
		showString(val);
	}
}
