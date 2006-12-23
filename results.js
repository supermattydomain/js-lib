var searchURL = "/musicdb/search.cgi?field0=vall.artist&operation0=contains&value0=Squarepusher&format=xml";

var addFieldToResult = function(args) {
    var resultSet = args[0];
    var tableRow = args[1];
    var field = args[2];
    // printMessage('Got field');
    var tableCell = document.createElement('td');
    tableCell.appendChild(document.createTextNode(field.value));
    tableRow.appendChild(tableCell);
};

var addColumnToHeading = function(args) {
    var resultSet = args[0];
    var tableRow = args[1];
    var field = args[2];
    // printMessage('Got field');
    var headingCell = document.createElement('th');
    headingCell.appendChild(document.createTextNode(field.name));
    tableRow.appendChild(headingCell);
};

var tableHeaderDone = false;

function addTableHeading(resultSet, resultsTable, resultRecord) {
    if (tableHeaderDone) {
	return;
    }
    tableHeaderDone = true;
    var tableRow = document.createElement('tr');
    var fieldArgs = new Array();
    fieldArgs[0] = resultSet;
    fieldArgs[1] = tableRow;
    resultSet.enumFields(resultRecord, addColumnToHeading, fieldArgs);
    resultsTable.appendChild(tableRow);
}

function addTableRow(resultSet, resultsTable, resultRecord) {
    var tableRow = document.createElement('tr');
    var fieldArgs = new Array();
    fieldArgs[0] = resultSet;
    fieldArgs[1] = tableRow;
    resultSet.enumFields(resultRecord, addFieldToResult, fieldArgs);
    resultsTable.appendChild(tableRow);
}

var receiveResult = function(args) {
    // printMessage('Got result');
    var resultSet = args[0];
    var resultRecord = args[1];
    // printNode(resultRecord);
    var resultsTable = document.getElementById('resultstable');
    addTableHeading(resultSet, resultsTable, resultRecord);
    addTableRow(resultSet, resultsTable, resultRecord);
};

var onResultSetLoaded = function(resultSet) {
  printMessage('Displaying ' + resultSet.getNumResults() + ' results...');
  var args = new Array();
  args[0] = resultSet;
  resultSet.enumResults(receiveResult, args);
};

function doSearch() {
  var resultSet = new XMLResults(searchURL);
  resultSet.fetchResults(onResultSetLoaded);
}
