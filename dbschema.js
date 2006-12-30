function DBField(table, fieldNode) {
  this.table = table;
  this.field = fieldNode;
  this.getName = function() {
    return this.field.getAttribute('name');
  };
  this.getComment = function() {
    return this.field.getAttribute('comment');
  };
  this.getTable = function() {
    return this.table;
  };
  this.getType = function() {
    return this.field.getAttribute('type');
  };
  this.isNumeric = function() {
    var type = this.getType();
    if (type.indexOf('text') >= 0) {
      return false;
    }
    if (type.indexOf('int') >= 0) {
      return true;
    }
    printMessage('Unsure about type of field ' + this.getName());
    return true;
  };
}

function DBFieldIter(table) {
  this.table = table;
  // printMessage('In DBFieldIter constructor');
  if (!table || !table.table) {
    fatal('Bad table ' + table);
  }
  this.base = ChildIter;
  this.base(this.table.table);
  this.parentGetNext = this.getNext;
  this.getNext = function() {
    // printMessage('In DBFieldIter.getNext');
    var next = this.parentGetNext();
    if (!next) {
      return next;
    }
    return new DBField(this.table, next);
  };
  this.parentForAll = this.forAll;
  this.forAll = function(fieldCallback, args) {
    // printMessage('In DBFieldIter.forAll ' + this.iterNode);
    // printNode(this.iterNode);
    this.parentForAll(function(myargs) {
      var node = myargs.pop();
      // printNode(node);
      var field = new DBField(table, node);
      myargs.push(field);
      fieldCallback(myargs);
    }, args);
  };
}
DBFieldIter.prototype = new ChildIter;

function DBTable(tableNode) {
  this.table = tableNode;
  this.getName = function() {
    return this.table.getAttribute('name');
  };
  this.getComment = function() {
    return this.table.getAttribute('comment');
  };
  this.getNumFields = function() {
    return this.table.childNodes.length;
  };
  this.getFieldIter = function() {
    return new DBFieldIter(this);
  };
  this.enumFields = function(fieldCallback, args) {
    var iter = this.getFieldIter();
    iter.forAll(fieldCallback, args);
    return iter.getCount();
  };
}

function DBTableIter(schema) {
  this.base = ChildIter;
  this.base(schema.database);
  this.parentGetNext = this.getNext;
  this.getNext = function() {
    // printMessage('In DBTableIter.getNext');
    var next = this.parentGetNext();
    if (!next) {
      return next;
    }
    return new DBTable(next);
  };
  this.parentForAll = this.forAll;
  this.forAll = function(tableCallback, args) {
    // printMessage('In DBTableIter.forAll');
    this.parentForAll(function(myargs) {
      var node = myargs.pop();
      var table = new DBTable(node);
      myargs.push(table);
      // printNode(node);
      tableCallback(myargs);
    }, args);
  };
}
DBTableIter.prototype = new ChildIter;

function DBSchema(url) {
  this.url = url;
  this.ajax = null;
  this.database = null;
  this.externalCallbackFn = null;
  var self = this;
  this.dataCallbackFn = function(ajax) {
    var xmlDoc = ajax.getResponseXML();
    // printMessage("DBSchema: Document child count: " + xmlDoc.childNodes.length);
    // self.database = xmlDoc.getElementsByTagName('database');
    self.database = xmlDoc.firstChild;
    if (self.database.nextSibling) {
      self.database = self.database.nextSibling;
    }
    if (null == self.database || undefined == self.database) {
      fatal('No database');
    }
    // printNode(self.database);
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
    if (!this.database) {
      fatal('No database');
    }
    return this.database.childNodes.length;
  };
  this.getTableIter = function() {
    if (null == this.database) {
      fatal('No database');
    }
    return new DBTableIter(this);
  };
  this.enumTables = function(tableCallback, args) {
    var iter = this.getTableIter();
    iter.forAll(tableCallback, args);
    return iter.getCount();
  };
}
