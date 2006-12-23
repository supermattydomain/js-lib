var columnNum = 0;

var addFieldToResult = function(args) {
    var resultSet = args[0];
    var tableRow = args[1];
    var field = args[2];
    // printMessage('Got field');
    var tableCell = document.createElement('td');
    if (oddRow) {
      tableCell.setAttribute('class', 'results_odd');
    } else {
      tableCell.setAttribute('class', 'results_even');
    }
    tableCell.appendChild(document.createTextNode(field.value));
    tableRow.appendChild(tableCell);
};

var addColumnToHeading = function(args) {
    var resultSet = args[0];
    var tableRow = args[1];
    var field = args[2];
    // printMessage('Got field');
    var headingCell = document.createElement('th');
    headingCell.setAttribute('class', 'results');
    headingCell.appendChild(document.createTextNode(field.name));
    headingCell.columnNum = columnNum;
    headingCell.onclick = function(evt) {
      // printMessage('heading ' + headingCell.columnNum + ' clicked');
	sortResults(headingCell.columnNum);
    }
    tableRow.appendChild(headingCell);
    columnNum++;
};

var tableHeaderDone = false;
var oddRow = false;

function addTableHeading(resultSet, resultsTable, resultRecord) {
    if (tableHeaderDone) {
	return;
    }
    columnNum = 0;
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
    oddRow = !oddRow;
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

function doSearch(searchURL) {
  var resultSet = new ResultSet(searchURL);
  resultSet.fetchResults(onResultSetLoaded);
}

function doTestSearch() {
  var testSearchURL = "/musicdb/search.cgi?field0=vall.artist&operation0=contains&value0=Squarepusher&format=xml";
  var resultSet = new ResultSet(testSearchURL);
  resultSet.fetchResults(onResultSetLoaded);
}
