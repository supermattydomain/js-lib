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
    // printMessage('Column heading added.');
  };

  this.addRecord = function(record) {
    var iter = new AttributeIter(record);
    // printMessage('Before adding row');
    self.addRow(iter);
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

}
ResultsTable.prototype = new SortedTable;
