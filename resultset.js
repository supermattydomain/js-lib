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
    self.externalCallbackFn(self);
  };
  this.fetchResults = function(externalCallback) {
    this.externalCallbackFn = externalCallback;
    this.ajax = new Ajax(self.url, this.dataCallbackFn);
    if (null == this.ajax) {
      printMessage('ResultSet: Cannot create request using URL ' + this.url);
      return false;
    } else if (!this.ajax.doGet()) {
      printMessage('ResultSet: Cannot start GET request using URL ' + this.url);
      return false;
    }
    showStatus('Retrieving search results...');
    return true;
  };
  this.getNumResults = function() {
    if (null == this.resultSet) {
      return 0;
    }
    return this.resultSet.childNodes.length;
  };
  this.getResultIter = function() {
    if (null == this.resultSet) {
      throw 'No resultset loaded';
    }
    var iter = new ChildIter(this.resultSet);
    return iter;
  };
  this.enumResults = function(rowCallback, args) {
    if (null == this.resultSet) {
      return 0;
    }
    var iter = this.getResultIter();
    iter.forAll(rowCallback, args);
    return iter.getCount();
  };
  this.getFieldIter = function(resultNode) {
    var iter = new AttributeIter(resultNode);
    return iter;
  };
  this.enumFields = function(resultNode, fieldCallback, args) {
    var iter = this.getFieldIter(resultNode);
    iter.forAll(fieldCallback, args);
    return iter.getCount();
  };
}
