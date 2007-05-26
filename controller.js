var schema;

try {
  schema = new DBSchema('../schema/schema.xml');
} catch (e) {
  schema = null;
}
if (bad(schema)) {
  fatal('Failed to create schema');
}

var search;
try {
  search = new SearchForm('vall');
} catch (e) {
  search = null;
}
if (bad(search)) {
  fatal('Failed to create search form');
}

var results;
try {
  results = new ResultsTable();
} catch (e) {
  results = null;
}
if (bad(results)) {
  fatal('Failed to create results table');
}

function showArtist(artistName) {
	printMessage('In showArtist(' + artistName + ')');
}

function doSearch(query) {
	var ex = null;
	try {
		results.setWaiting(true);
		var searchURL = query.getURL();
		var resultSet = new ResultSet(searchURL);
		resultSet.fetchResults(results.loadResultSet);
	} catch (e) {
		printMessage('Exception occurred while performing search');
		ex = e;
	}
	if (good(ex)) {
		throw(ex);
	}
}

function doTestSearch() {
	var ex = null;
	try {
		results.setWaiting(true);
		var testSearchURL = "../search/search.cgi?field0=vall.artist&operation0=contains&value0=Squarepusher&format=xml";
		var resultSet = new ResultSet(testSearchURL);
		resultSet.fetchResults(results.loadResultSet);
	} catch (e) {
		printMessage('Exception occurred while performing search');
		ex = e;
	}
	if (good(ex)) {
		throw(ex);
	}
}

function onMoreButton() {
  search.addCriterion();
}
search.moreButton.onclick = onMoreButton;

function onSearchButton() {
  // printMessage('onSearchButton');
  doSearch(search.getQuery());
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

function sortResults(columnNum) {
  results.setSortColumn(columnNum);
  results.sortTable();
}

function editFile(fileName) {
  printMessage('Edit file ' + fileName);
}

function onSchemaFetched(schema) {
  search.populate(schema);
}

function cleanupSearchPage() {
	if (search) {
		search.cleanup();
		search = null;
	}
	if (schema) {
		schema.cleanup();
		schema = null;
	}
}

schema.fetchSchema(onSchemaFetched);
var searchDiv = document.getElementById('searchdiv');
searchDiv.appendChild(search.getForm());
var resultsDiv = document.getElementById('resultsdiv');
resultsDiv.appendChild(results.getTable());
search.takeFocus();
