function ResultSet(url) {
  this.url = url;
  this.ajax = null;
  this.xmlDoc = null;
  this.resultSet = null;
  this.externalCallbackFn = null;
  var self = this;
  this.dataCallbackFn = function(ajax) {
    self.xmlDoc = ajax.getResponseXML();
    // printMessage('ResultSet: Document child count: ' + self.xmlDoc.childNodes.length);
    var resultSets = self.xmlDoc.getElementsByTagName('resultset');
    self.resultSet = resultSets[0];
    // printNode(self.resultSet);
    showStatus('Finished retrieving search results.');
    if (!self.externalCallbackFn) {
      fatal('ResultSet: No loaded callback');
    }
    self.externalCallbackFn(self);
  };
  this.fetchResults = function(externalCallback) {
    if (bad(externalCallback)) {
      fatal('Bad loaded callback');
    }
    this.externalCallbackFn = externalCallback;
    this.ajax = new Ajax(self.url, this.dataCallbackFn);
    if (bad(this.ajax)) {
      fatal('ResultSet: Cannot create request using URL ' + this.url);
    } else if (!this.ajax.doGet()) {
      fatal('ResultSet: Cannot start GET request using URL ' + this.url);
    }
    showStatus('Retrieving search results...');
    return true;
  };
  this.getNumResults = function() {
    if (bad(this.resultSet)) {
      return 0;
    }
    // FIXME: incorrectly counts text nodes as a result of non-ignored ignorabke whitespace
    return this.resultSet.childNodes.length;
  };
  this.getResultIter = function() {
    if (bad(this.resultSet)) {
      fatal('No resultset loaded');
    }
    var iter = new ChildElementIter(this.resultSet);
    return iter;
  };
  this.enumResults = function(rowCallback, args) {
    if (bad(this.resultSet)) {
      return 0;
    }
    var iter = this.getResultIter();
    iter.forAll(rowCallback, args);
    var count = iter.getCount();
    iter.cleanup();
    return count;
  };
  this.cleanup = function() {
  	this.ajax = null;
  	this.xmlDoc = null;
  	this.resultSet = null;
  };
}
