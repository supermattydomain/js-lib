function XMLResults(url) {
  this.url = url;
  this.ajax = null;
  this.xmlDoc = null;
  this.resultSet = null;
  this.externalCallbackFn = null;
  var self = this;
  this.dataCallbackFn = function(ajax) {
    self.xmlDoc = self.ajax.getResponseXML();
    // printMessage("Data callback: Document child count: " + self.xmlDoc.childNodes.length);
    self.resultSet = self.xmlDoc.getElementsByTagName('resultset');
    self.externalCallbackFn(self);
  };
  this.fetchResults = function(externalCallback) {
    this.externalCallbackFn = externalCallback;
    this.ajax = new Ajax(self.url, this.dataCallbackFn);
    if (null == this.ajax) {
      printMessage('XMLResults: Cannot create request');
      return false;
    } else if (!this.ajax.doGet()) {
      printMessage('XMLResults: Cannot start GET request');
      return false;
    }
    printMessage('Retrieving search results...');
    return true;
  };
  this.getNumResults = function() {
    if (null == this.resultset) {
      return 0;
    }
    return this.resultSet.childNodes.length;
  };
  this.enumResults = function(rowCallback, args) {
    if (null == this.resultset) {
      return 0;
    }
    var iter = new ArrayIter(this.resultset.childNodes);
    iter.forAll(rowCallback, args);
    return iter.getCount();
  };
}
