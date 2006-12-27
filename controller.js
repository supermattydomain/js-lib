var search = new SearchForm();
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
  resultsTable.emptyTable();
}
search.resetButton.onclick = onResetButton;

search.searchForm.onsubmit = function() {
  onSearchButton();
  return false;
}

document.getElementById('searchdiv').appendChild(search.getForm());

var resultsDiv = document.getElementById('resultsdiv');
var resultsTable = new SortedTable();
resultsDiv.appendChild(resultsTable.getTable());
