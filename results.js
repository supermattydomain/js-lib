var addFieldToResult = function(args) {
    var resultSet = args[0];
    var tableRow = args[1];
    var field = args[2];
    // printMessage('Got field');
    var tableCell = resultsTable.makeCell(field.value);
    tableRow.appendChild(tableCell);
};

var addColumnToHeading = function(args) {
    var resultSet = args[0];
    var tableRow = args[1];
    var field = args[2];
    // printMessage('Got field');
    var headingCell = resultsTable.makeHeadingCell(field.name);
    tableRow.appendChild(headingCell);
};

var tableHeaderDone = false;

function addTableHeading(resultSet, resultsTable, resultRecord) {
    if (tableHeaderDone) {
	return;
    }
    tableHeaderDone = true;
    var headingRow = document.createElement('tr');
    headingRow.setAttribute('class', 'results');
    var fieldArgs = new Array();
    fieldArgs[0] = resultSet;
    fieldArgs[1] = headingRow;
    resultSet.enumFields(resultRecord, addColumnToHeading, fieldArgs);
    resultsTable.appendChild(headingRow);
}

function addTableRow(resultSet, resultsTable, resultRecord) {
    var tableRow = document.createElement('tr');
    tableRow.setAttribute('class', 'results');
    var fieldArgs = new Array();
    fieldArgs[0] = resultSet;
    fieldArgs[1] = tableRow;
    resultSet.enumFields(resultRecord, addFieldToResult, fieldArgs);
    resultsTable.appendChild(tableRow);
}

var onResultSetLoaded = function(resultSet) {
  showStatus('Displaying ' + resultSet.getNumResults() + ' results...');
  var resultsTable = document.getElementById('resultstable');
  var tbodies = resultsTable.getElementsByTagName('tbody');
  if (tbodies != null && tbodies != undefined && tbodies.length) {
    resultsTable = tbodies[0];
  }
  // printNode(resultsTable);
  var args = new Array();
  args[0] = resultSet;
  args[1] = resultsTable;
  resultSet.enumResults(function(myargs) {
    // printMessage('Got result');
    var resultSet = myargs[0];
    var resultsTable = myargs[1];
    var resultRecord = myargs[2];
    // printNode(resultRecord);
    addTableHeading(resultSet, resultsTable, resultRecord);
    addTableRow(resultSet, resultsTable, resultRecord);
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
