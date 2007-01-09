function ResultsTable() {
  this.base = SortedTable;
  this.base();
  this.table.viewObject = this;
  var self = this;
  this.addHeading = function(record) {
    if (this.headingRow) {
      return;
    }
    var iter = new AttributeNameIter(record);
    // printMessage('Before adding column heading');
    this.addColumnHeadings(iter);
    iter.cleanup();
    // printMessage('Column heading added.');
  };
  this.addRecord = function(record) {
    var iter = new AttributeIter(record);
    // printMessage('Before adding row');
    self.addRow(iter);
    iter.cleanup();
    // printMessage('Row added.');
  };
  this.loadResultSet = function(resultSet) {
    showStatus('Displaying ' + resultSet.getNumResults() + ' results...');
    if (!results) {
      fatal('onResultSetLoaded: Nowhere to display results');
    }
    var args = new Array();
    resultSet.enumResults(function(myargs) {
      // printMessage('Got result');
      var resultRecord = myargs[0];
      // printNode(resultRecord);
      self.addHeading(resultRecord);
      self.addRecord(resultRecord);
    }, args);
    showStatus(resultSet.getNumResults() + ' results displayed.');
  };
  this.resultsTableCleanup = this.cleanup;
  this.cleanup = function() {
  	this.resultsTableCleanup();
  	this.ajax = null;
  	this.xmlDoc = null;
  	this.resultSet = null;
  };
}
ResultsTable.prototype = new SortedTable;
