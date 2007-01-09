function ResultsTable() {
  this.base = SortedTable;
  this.base();
  this.table.viewObject = this;
  var self = this;
  this.createFieldDisplay = function(field) {
    // printMessage('In ResultsTable.createFieldDisplay');
    if (field.name == 'path') {
   	  // FireFox disallows Web pages or their scripts from linking to local file:/// URLs.
      // var value = removePrefix(field.value, '/music/');
      // value = 'file:///M:/' + encodeURI(value);
      // value = 'file:///M:/' + value;
      // var value = value.replace(/\//g, '\\');
      var value = field.value;
      var a = dce('a');
      a.setAttribute('href', value);
      a.appendChild(dctn(value));
      // a.onclick = function(evt) {
      //   editFile(field.value);
      //   return false;
      // };
      // printMessage(value);
      return a;
    }
    return dctn(field.value);
  };
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
    this.addRow(iter);
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
