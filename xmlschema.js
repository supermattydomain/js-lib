var xmlDoc = null;
var database = null;
var tables = null;
var externalCallbackFn = null;
function dataCallback(ajax) {
  xmlDoc = ajax.req.responseXML;
  // printMessage("Data callback: Document child count: " + xmlDoc.childNodes.length);
  database = xmlDoc.getElementsByTagName('database');
  tables = xmlDoc.getElementsByTagName('table');
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
  if (null == tables) {
    return 0;
  }
  return tables.length;
}
function getNumFields(table) {
  var fields = table.getElementsByTagName('field');
  return fields.length;
}
function getTableName(table) {
  return table.getAttribute('name');
}
function getFieldName(field) {
  return field.getAttribute('name');
}
function enumTables(tableCallback, args) {
  if (null == database) {
    return 0;
  }
  var iter = new ArrayIter(tables);
  iter.forAll(tableCallback, args);
  return iter.getCount();
}
function enumFields(table, fieldCallback, args) {
  var fields = table.getElementsByTagName('field');
  var iter = new ArrayIter(fields);
  iter.forAll(fieldCallback, args);
  return iter.getCount();
}
