function DBSchema(url) {
  this.url = url;
  this.ajax = null;
  this.database = null;
  this.externalCallbackFn = null;
  var self = this;
  this.dataCallbackFn = function(ajax) {
    var xmlDoc = ajax.responseXML;
    // showLog("DBSchema: Document child count: " + xmlDoc.childNodes.length);
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
    showStatus('Loading schema...');
    this.ajax = new Ajax.Request(this.url,
    {
		method: 'get',
		onSuccess: this.dataCallbackFn,
		onFailure: function() { showLog('schema fetch failed'); }
    });
    return true;
  };
  this.getNumTables = function() {
    if (bad(this.database)) {
      fatal('No database');
    }
    return this.database.childNodes.length;
  };
  this.getTableIter = function() {
    if (bad(this.database)) {
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
