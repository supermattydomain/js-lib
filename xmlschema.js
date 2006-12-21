var xml = null;
var externalCallbackFn = null;
function dataCallback(ajax) {
  xml = ajax.req.responseXML;
  externalCallbackFn();
}
function fetchSchema(url, externalCallback) {
  externalCallbackFn = externalCallback;
  var req = new Ajax(requestURL, dataCallback);
  if (null == req) {
    printMessage('Cannot create request');
    return false;
  } else if (!req.doGet()) {
    printMessage('Cannot start GET request');
    return false;
  }
  // printMessage('Request started');
  return true;
}
function getNumTables() {
  if (null == xml) {
    return 0;
  }
  var database = xml.firstChild;
  var tables = database.childNodes;
  return tables.length;
}
function getTableName(table) {
  return table.getAttribute('name');
}
function getNumFields(table) {
  var fields = table.childNodes;
  return fields.length;
}
function getFieldName(field) {
  return field.getAttribute('name');
}
function enumTables(callback) {
  if (null == xml) {
    return 0;
  }
  var database = xml.firstChild;
  var tables = database.childNodes;
  var i;
  for (i = 0; i < tables.length; i++) {
    var table = tables[i];
    if (1 != table.nodeType) {
      printMessage('Ignoring node of type ' + table.nodeType);
    }
    callback(table);
  }
  return i;
}
function enumFields(table, callback) {
  var fields = table.childNodes;
  var i;
  for (i = 0; i < fields.length; i++) {
    var field = fields[i];
    if (1 != field.nodeType) {
      printMessage('Ignoring node of type ' + field.nodeType);
    }
    callback(table, field);
  }
}
