function ResultsTable() {
  this.base = SortedTable;
  this.base();
  this.table.viewObject = this;
  var self = this;

this.loadResultSet = function(resultSet) {
  showStatus('Displaying ' + resultSet.getNumResults() + ' results...');
  if (!results) {
    fatal('onResultSetLoaded: Nowhere to display results');
  }
  var args = new Array();
  args[0] = false;
  resultSet.enumResults(function(myargs) {
    // printMessage('Got result');
    // doneHeading = myargs[0];
    var resultRecord = myargs[1];
    // printNode(resultRecord);
    var iter;
    if (!myargs[0]) {
      myargs[0] = true;
      iter = new AttributeNameIter(resultRecord);
      // printMessage('Before adding column heading');
      self.addColumnHeadings(iter);
      // printMessage('Column heading added.');
    }
    iter = new AttributeValueIter(resultRecord);
    // printMessage('Before adding row');
    self.addRow(iter);
    // printMessage('Row added.');
  }, args);
  showStatus(resultSet.getNumResults() + ' results displayed.');
};

}
ResultsTable.prototype = new SortedTable;
