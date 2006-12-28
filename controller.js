var search;
try {
  search = new SearchForm('vall');
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

function doSearch(searchURL) {
  var resultSet = new ResultSet(searchURL);
  resultSet.fetchResults(onResultSetLoaded);
}

function doTestSearch() {
  var testSearchURL = "/musicdb/search.cgi?field0=vall.artist&operation0=contains&value0=Squarepusher&format=xml";
  var resultSet = new ResultSet(testSearchURL);
  resultSet.fetchResults(results.loadResultSet);
}
