var search;
try {
  search = new SearchForm();
} catch (e) {
  search = null;
}
if (!search) {
  fatal('Failed to create search form');
}

function onMoreButton() {
  search.addCriterion();
}
search.moreButton.onclick = onMoreButton;

function onFewerButton() {
  search.removeCriterion();
}
search.fewerButton.onclick = onFewerButton;

function onSearchButton() {
  doSearch(search.getURL());
}
search.searchButton.onclick = onSearchButton;

function onTestSearchButton() {
  doTestSearch();
}
search.testSearchButton.onclick = onTestSearchButton;

function onResetButton() {
  results.emptyTable();
}
search.resetButton.onclick = onResetButton;

search.searchForm.onsubmit = function() {
  onSearchButton();
  return false;
}

document.getElementById('searchdiv').appendChild(search.getForm());

function sortResults(columnNum) {
  results.setSortColumn(columnNum);
  var colName = results.getSortColumnName();
  showStatus('Sorting results by ' + colName + '...');
  results.sortTable();
  showStatus('Results sorted by ' + colName + '.');
};

var resultsDiv = document.getElementById('resultsdiv');
var results;
try {
  results = new ResultsTable();
} catch (e) {
  results = null;
}
if (results == undefined || results == null) {
  fatal('Failed to create results table');
}
resultsDiv.appendChild(results.getTable());

function onResultSetLoaded(resultSet) {
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
      if (results == undefined || results == null || !results) {
        fatal('onResultSetLoaded: Nowhere to display results 2');
      }
      results.addColumnHeadings(iter);
      // printMessage('Column heading added.');
    }
    iter = new AttributeValueIter(resultRecord);
    // printMessage('Before adding row');
    results.addRow(iter);
    // printMessage('Row added.');
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
