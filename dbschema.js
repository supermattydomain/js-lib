function DBSchema() {
  this.url = 'xmlschema.cgi';;
  this.ajax = null;
  this.xmlDoc = null;
  this.database = null;
  this.tables = null;
  this.externalCallbackFn = null;
  var self = this;
  this.dataCallbackFn = function(ajax) {
    self.xmlDoc = ajax.getResponseXML();
    // printMessage("DBSchema: Document child count: " + self.xmlDoc.childNodes.length);
    self.database = self.xmlDoc.getElementsByTagName('database');
    self.tables = self.xmlDoc.getElementsByTagName('table');
    showStatus('Schema loaded.');
    self.externalCallbackFn(self);
  };
  this.fetchSchema = function(externalCallback) {
    this.externalCallbackFn = externalCallback;
    this.ajax = new Ajax(this.url, this.dataCallbackFn);
    if (null == this.ajax) {
      printMessage('DBSchema: Cannot create request using URL ' + this.url);
      return false;
    } else if (!this.ajax.doGet()) {
      printMessage('DBSchema: Cannot start GET request using URL ' + this.url);
      return false;
    }
    showStatus('Loading schema...');
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
