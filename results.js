var onResultSetLoaded = function(resultSet) {
  showStatus('Displaying ' + resultSet.getNumResults() + ' results...');
  var args = new Array();
  args[0] = resultSet;
  args[1] = false;
  resultSet.enumResults(function(myargs) {
    // printMessage('Got result');
    var resultSet = myargs[0];
    // doneHeading = myargs[1];
    var resultRecord = myargs[2];
    // printNode(resultRecord);
    var iter;
    if (!myargs[1]) {
      myargs[1] = true;
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
