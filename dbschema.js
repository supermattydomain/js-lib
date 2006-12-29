function DBSchema() {
  this.url = 'schema.xml';;
  this.ajax = null;
  this.xmlDoc = null;
  this.database = null;
  this.tables = null;
  this.externalCallbackFn = null;
  var self = this;
  this.dataCallbackFn = function(ajax) {
    self.xmlDoc = ajax.getResponseXML();
    // printMessage("DBSchema: Document child count: " + self.xmlDoc.childNodes.length);
    // self.database = self.xmlDoc.getElementsByTagName('database');
    self.database = self.xmlDoc.firstChild;
    // self.tables = self.xmlDoc.getElementsByTagName('table');
    self.tables = self.database.childNodes;
    showStatus('Schema loaded.');
    if (!self.externalCallbackFn) {
      fatal('DBSchema: No external callback');
    }
    self.externalCallbackFn(self);
  };
  this.fetchSchema = function(externalCallback) {
    if (!externalCallback) {
      fatal('DBSchema: Bad external callback');
    }
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
    if (null == this.database) {
      return 0;
    }
    return this.database.childNodes.length;
  };
  this.getNumFields = function(table) {
    return table.childNodes.length;
  };
  this.getTableName = function(table) {
    return table.getAttribute('name');
  };
  this.getTableComment = function(table) {
    return table.getAttribute('comment');
  };
  this.getFieldName = function(field) {
    return field.getAttribute('name');
  };
  this.getFieldComment = function(field) {
    return field.getAttribute('comment');
  };
  this.isFieldNumeric = function(field) {
    var type = field.getAttribute('type');
    if (type.indexOf('text') >= 0) {
      return false;
    }
    if (type.indexOf('int') >= 0) {
      return true;
    }
    printMessage('Unsure about type of field ' + this.getFieldName(field));
    return true;
  };
  this.getTableIter = function() {
    if (null == this.database) {
      return new ArrayIter(new Array());
    }
    return new ChildIter(this.database);
  };
  this.enumTables = function(tableCallback, args) {
    if (null == this.tables) {
      return 0;
    }
    var iter = this.getTableIter();
    iter.forAll(tableCallback, args);
    return iter.getCount();
  };
  this.getFieldIter = function(table) {
    return new ChildIter(table);
  };
  this.enumFields = function(table, fieldCallback, args) {
    var iter = new ChildIter(table);
    iter.forAll(fieldCallback, args);
    return iter.getCount();
  };
}
