var schema;

try {
  schema = new DBSchema('schema.xml');
} catch (e) {
  schema = null;
}
if (!schema) {
  fatal('Failed to create schema');
}

var search;
try {
  search = new SearchForm('vall');
} catch (e) {
  search = null;
}
if (!search) {
  fatal('Failed to create search form');
}

var results;
try {
  results = new ResultsTable();
} catch (e) {
  results = null;
}
if (results == undefined || results == null) {
  fatal('Failed to create results table');
}

function doSearch(searchURL) {
  var resultSet = new ResultSet(searchURL);
  resultSet.fetchResults(results.loadResultSet);
}

function doTestSearch() {
  var testSearchURL = "/musicdb/search.cgi?field0=vall.artist&operation0=contains&value0=Squarepusher&format=xml";
  var resultSet = new ResultSet(testSearchURL);
  resultSet.fetchResults(results.loadResultSet);
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
  // printMessage('onSearchButton');
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

var resultsDiv = document.getElementById('resultsdiv');
resultsDiv.appendChild(results.getTable());

function sortResults(columnNum) {
  results.setSortColumn(columnNum);
  results.sortTable();
};

schema.fetchSchema(search.populate);
