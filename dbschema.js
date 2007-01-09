function DBField(table, fieldNode) {
  // printMessage('In DBField constructor');
  this.table = table;
  this.field = fieldNode;
  if (!this.table || !this.field) {
    fatal('DBField: Bad table and/or field');
  }
  this.getName = function() {
    return this.field.getAttribute('Field');
  };
  this.getComment = function() {
    return this.field.getAttribute('Comment');
  };
  this.getTable = function() {
    return this.table;
  };
  this.getType = function() {
    return this.field.getAttribute('Type');
  };
  this.isNumeric = function() {
    var type = this.getType();
    if (type.indexOf('text') >= 0) {
      return false;
    }
    if (type.indexOf('int') >= 0) {
      return true;
    }
    printMessage('Unrecognised type "' + type + '" of field ' + this.getName());
    return true;
  };
  this.cleanup = function() {
	this.table = null;
  	this.field = null;
  };
}

function DBFieldIter(table) {
  // printMessage('In DBFieldIter constructor');
  if (!table || !table.table) {
    fatal('DBFieldIter: Bad table ' + table);
  }
  this.base = ChildIter;
  this.base(table.table);
  this.DBFieldIterGetNext = this.getNext;
  this.getNext = function() {
    // printMessage('In DBFieldIter.getNext');
    for (;;) {
      var next = this.DBFieldIterGetNext();
      if (!next) {
        return next;
      }
      if (next.nodeName.toLowerCase() == 'field') {
	// printMessage('Processing node ' + next.nodeName);
        return new DBField(this.table, next);
      }
      // printMessage('Ignoring node ' + next.nodeName);
    }
  };
  this.DBFieldIterForAll = this.forAll;
  this.forAll = function(fieldCallback, args) {
    // printMessage('In DBFieldIter.forAll ' + this.iterNode);
    // printNode(this.iterNode);
    this.DBFieldIterForAll(function(myargs) {
      var node = myargs.pop();
      if (node.nodeName.toLowerCase() != 'field') {
	// printMessage('Ignoring node ' + node.nodeName);
        myargs.push(node);
	return;
      }
      // printMessage('Processing node ' + node.nodeName);
      // printNode(node);
      var field = new DBField(table, node);
      myargs.push(field);
      fieldCallback(myargs);
    }, args);
  };
}
DBFieldIter.prototype = new ChildIter;

function DBKey(table, keyNode) {
  this.table = table;
  this.key = keyNode;
  this.getTable = function() {
  	return this.table;
  }
  this.getName = function() {
  	return this.key.getAttribute('Key_name');
  };
  this.getColumns = function() {
  	var columnStr = this.key.getAttribute('Column_name');
  	return columnStr.split(',');
  };
  this.cleanup = function() {
  	this.table = null;
  	this.key = null;
  };
}

function DBKeyIter(table) {
  // printMessage('In DBKeyIter constructor');
  if (!table || !table.table) {
    fatal('DBKeyIter: Bad table ' + table);
  }
  this.base = ChildIter;
  this.base(table.table);
  this.DBKeyIterGetNext = this.getNext;
  this.getNext = function() {
    // printMessage('In DBKeyIter.getNext');
    for (;;) {
      var next = this.DBKeyIterGetNext();
      if (!next) {
        return next;
      }
      if (next.nodeName.toLowerCase() == 'key') {
	// printMessage('Processing node ' + next.nodeName);
        return new DBKey(this.table, next);
      }
      // printMessage('Ignoring node ' + next.nodeName);
    }
  };
  this.DBKeyIterForAll = this.forAll;
  this.forAll = function(keyCallback, args) {
    // printMessage('In DBKeyIter.forAll ' + this.iterNode);
    // printNode(this.iterNode);
    this.DBKeyIterForAll(function(myargs) {
      var node = myargs.pop();
      if (node.nodeName.toLowerCase() != 'key') {
	// printMessage('Ignoring node ' + node.nodeName);
        myargs.push(node);
	return;
      }
      // printMessage('Processing node ' + node.nodeName);
      // printNode(node);
      var key = new DBKey(table, node);
      myargs.push(key);
      keyCallback(myargs);
    }, args);
  };
}
DBKeyIter.prototype = new ChildIter;

function DBForeignKey(table, foreignKeyNode) {
  this.base = DBKey;
  this.base(table, foreignKeyNode);
  this.getReferencedTable = function() {
  	return this.key.getAttribute('Referenced_table_name');
  };
  this.getReferencedColumn = function() {
  	return this.key.getAttribute('Referenced_column_name');
  };
}
DBForeignKey.prototype = new DBKey;

function DBForeignKeyIter(table) {
  // printMessage('In DBForeignKeyIter constructor');
  if (!table || !table.table) {
    fatal('DBForeignKeyIter: Bad table ' + table);
  }
  this.base = ChildIter;
  this.base(table.table);
  this.DBForeignKeyIterGetNext = this.getNext;
  this.getNext = function() {
    // printMessage('In DBForeignKeyIter.getNext');
    for (;;) {
      var next = this.DBForeignKeyIterGetNext();
      if (!next) {
        return next;
      }
      if (next.nodeName.toLowerCase() == 'foreign_key') {
	// printMessage('Processing node ' + next.nodeName);
        return new DBForeignKey(this.table, next);
      }
      // printMessage('Ignoring node ' + next.nodeName);
    }
  };
  this.DBForeignKeyIterForAll = this.forAll;
  this.forAll = function(foreignKeyCallback, args) {
    // printMessage('In DBForeignKeyIter.forAll ' + this.iterNode);
    // printNode(this.iterNode);
    this.DBForeignKeyIterForAll(function(myargs) {
      var node = myargs.pop();
      if (node.nodeName.toLowerCase() != 'foreign_key') {
	// printMessage('Ignoring node ' + node.nodeName);
        myargs.push(node);
	return;
      }
      // printMessage('Processing node ' + node.nodeName);
      // printNode(node);
      var key = new DBForeignKey(table, node);
      myargs.push(key);
      foreignKeyCallback(myargs);
    }, args);
  };
}
DBForeignKeyIter.prototype = new ChildIter;

function DBTable(tableNode) {
  this.table = tableNode;
  var options = this.table.getElementsByTagName('options');
  if (!options || !options.length) {
    printNode(this.table);
    fatal('No table options');
  }
  this.options = options[0];
  this.fields = this.table.getElementsByTagName('field');
  if (!this.fields || !this.fields.length) {
	printNode(this.table);
    fatal('No table fields');
  }
  this.getName = function() {
    return this.table.getAttribute('name');
  };
  this.getComment = function() {
    var comment = this.options.getAttribute('Comment');
    var i = comment.indexOf(';');
    if (i >= 0) {
      return comment.substr(0, i);
    }
    return comment;
  };
  this.getNumFields = function() {
    return this.fields.length;
  };
  this.getFieldIter = function() {
    return new DBFieldIter(this);
  };
  this.enumFields = function(fieldCallback, args) {
    var iter = this.getFieldIter();
    iter.forAll(fieldCallback, args);
    var i = iter.getCount();
    iter.cleanup();
    return i;
  };
  this.getKeyIter = function() {
    return new DBKeyIter(this);
  };
  this.enumKeys = function(keyCallback, args) {
    var iter = this.getKeyIter();
    iter.forAll(keyCallback, args);
    var i = iter.getCount();
    iter.cleanup();
    return i;
  };
  this.getForeignKeyIter = function() {
    return new DBForeignKeyIter(this);
  };
  this.enumForeignKeys = function(foreignKeyCallback, args) {
    var iter = this.getForeignKeyIter();
    iter.forAll(foreignKeyCallback, args);
    var i = iter.getCount();
    iter.cleanup();
    return i;
  };
  this.cleanup = function() {
  	this.table = null;
  	this.options = null;
  	this.fields = null;
  };
}

function DBTableIter(schema) {
  this.base = ChildIter;
  this.base(schema.database);
  this.DBTableIterGetNext = this.getNext;
  this.getNext = function() {
    // printMessage('In DBTableIter.getNext');
    for (;;) {
      var next = this.DBTableIterGetNext();
      if (!next) {
        return next;
      }
      if (next.nodeName.toLowerCase() == 'table_structure') {
	    // printMessage('Processing node ' + next.nodeName);
        return new DBTable(next);
      }
      // printMessage('Ignoring node ' + next.nodeName);
    }
  };
  this.DBTableIterForAll = this.forAll;
  this.forAll = function(tableCallback, args) {
    // printMessage('In DBTableIter.forAll');
    this.DBTableIterForAll(function(myargs) {
      var node = myargs.pop();
      if (node.nodeName.toLowerCase() != 'table_structure') {
	// printMessage('Ignoring node ' + node.nodeName);
        myargs.push(node);
	return;
      }
      // printMessage('Processing node ' + node.nodeName);
      // printNode(node);
      var table = new DBTable(node);
      myargs.push(table);
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
    var databases = xmlDoc.getElementsByTagName('database');
    self.database = databases[0];
    /*
    self.database = xmlDoc.firstChild;
    if (self.database.nextSibling) {
      self.database = self.database.nextSibling;
    }
    */
    if (null == self.database || undefined == self.database) {
      fatal('No database');
    }
    if (!self.externalCallbackFn) {
      fatal('DBSchema: No external callback');
    }
    // printNode(self.database);
    showStatus('Schema loaded.');
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
    var i = iter.getCount();
    iter.cleanup();
    return i;
  };
  this.cleanup = function() {
    this.ajax = null;
    this.database = null;
  };
}
