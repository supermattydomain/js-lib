function DBField(fieldNode) {
  this.field = fieldNode;
  this.field.modelObject = this;
  this.getName = function() {
    return this.field.getAttribute('name');
  };
  this.getComment = function() {
    return this.field.getAttribute('comment');
  };
  this.getTable = function() {
    return this.field.parentNode.modelObject;
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
    if (next.modelObject) {
      // printMessage('Returning cached field object');
      return next.modelObject;
    }
    // printMessage('Creating new field object');
    return new DBField(next);
  };
  this.parentForAll = this.forAll;
  this.forAll = function(fieldCallback, args) {
    // printMessage('In DBFieldIter.forAll ' + this.iterNode);
    // printNode(this.iterNode);
    this.parentForAll(function(myargs) {
      var node = myargs.pop();
      var field = null;
      if (node.modelObject) {
        // printMessage('Returning cached field object');
        field = node.modelObject;
      } else {
        // printMessage('Creating new field object');
	field = new DBField(node);
      }
      myargs.push(field);
      // printNode(node);
      fieldCallback(myargs);
    }, args);
  };
}
DBFieldIter.prototype = new ChildIter;

function DBTable(tableNode) {
  this.table = tableNode;
  this.table.modelObject = this;
  this.getSchema = function() {
    return this.table.parentNode.modelObject;
  };
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
    if (next.modelObject) {
      // printMessage('Returning cached table object');
      return next.modelObject;
    }
    // printMessage('Creating new table object');
    return new DBTable(next);
  };
  this.parentForAll = this.forAll;
  this.forAll = function(tableCallback, args) {
    // printMessage('In DBTableIter.forAll');
    this.parentForAll(function(myargs) {
      var node = myargs.pop();
      var table;
      if (node.modelObject) {
        // printMessage('Returning cached table object');
	table = node.modelObject;
      } else {
        // printMessage('Creating new table object');
	table = new DBTable(node);
      }
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
    self.database.modelObject = this;
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
    if (!this.database) {
      fatal('No tables');
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
