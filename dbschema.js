function DBSchema(url) {
  this.url = url;
  this.ajax = null;
  this.xmlDoc = null;
  this.database = null;
  this.tables = null;
  this.externalCallbackFn = null;
  var self = this;
  this.dataCallbackFn = function(ajax) {
    self.xmlDoc = ajax.getResponseXML();
    // printMessage("Schema loaded callback: Document child count: " + self.xmlDoc.childNodes.length);
    self.database = self.xmlDoc.getElementsByTagName('database');
    self.tables = self.xmlDoc.getElementsByTagName('table');
    self.externalCallbackFn(self);
  };
  this.fetchSchema = function(externalCallback) {
    this.externalCallbackFn = externalCallback;
    this.ajax = new Ajax(this.url, this.dataCallbackFn);
    if (null == this.ajax) {
      printMessage('XMLSchema: Cannot create request');
      return false;
    } else if (!this.ajax.doGet()) {
      printMessage('XMLSchema: Cannot start GET request');
      return false;
    }
    // printMessage('XMLSchema: Request started');
    return true;
  };
  this.getNumTables = function() {
    if (null == this.tables) {
      return 0;
    }
    return this.tables.length;
  };
  this.getNumFields = function(table) {
    var fields = table.getElementsByTagName('field');
    return fields.length;
  };
  this.getTableName = function(table) {
    return table.getAttribute('name');
  };
  this.getFieldName = function(field) {
    return field.getAttribute('name');
  };
  this.enumTables = function(tableCallback, args) {
    if (null == this.tables) {
      return 0;
    }
    var iter = new ArrayIter(this.tables);
    iter.forAll(tableCallback, args);
    return iter.getCount();
  };
  this.enumFields = function(table, fieldCallback, args) {
    var fields = table.getElementsByTagName('field');
    var iter = new ArrayIter(fields);
    iter.forAll(fieldCallback, args);
    return iter.getCount();
  };
}
