var onResultSetLoaded = function(resultSet) {
  showStatus('Displaying ' + resultSet.getNumResults() + ' results...');
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
      resultsTable.addColumnHeadings(iter);
    }
    iter = new AttributeValueIter(resultRecord);
    resultsTable.addRow(iter);
  }, args);
  showStatus(resultSet.getNumResults() + ' results displayed.');
};

function doSearch(searchURL) {
  var resultSet = new ResultSet(searchURL);
  resultSet.fetchResults(onResultSetLoaded);
}

function doTestSearch() {
  var testSearchURL = "/musicdb/search.cgi?field0=vall.artist&operation0=contains&value0=Squarepusher&format=xml";
  var resultSet = new ResultSet(testSearchURL);
  resultSet.fetchResults(onResultSetLoaded);
}
