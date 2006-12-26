function findChildByType(node, type) {
  if (null == node || undefined == node) {
    return null;
  }
  if (node.nodeType == type) {
    return node;
  }
  if (!node.hasChildNodes()) {
    return null;
  }
  node = node.firstChild;
  while (node != null && node != undefined) {
    var child = findChildByType(node, type);
    if (null != child) {
      return child;
    }
    node = node.nextSibling;
  }
  return null;
}

function compareValues(val1, val2) {
  var num1 = Number(val1);
  var num2 = Number(val2);
  if (isNaN(num1) || isNaN(num2)) {
    val1 = val1.toLowerCase();
    val2 = val2.toLowerCase();
  } else {
    val1 = num1;
    val2 = num2;
  }
  // printMessage('compareValues: ' + val1 + ' ' + val2);
  var ret;
  if (val1 < val2) {
    ret = -1;
  } else if (val1 > val2) {
    ret = 1;
  } else {
    ret = 0;
  }
  // printMessage('compareValues: ret=' + ret);
  return ret;
}

function compareCells(cell1, cell2) {
  var node1 = findChildByType(cell1, 3);
  var node2 = findChildByType(cell2, 3);
  if (null == node1 || undefined == node1) {
    printMessage('compareCells: no child text to compare');
    printNode(cell1);
    if (null == node2 || undefined == node2) {
      ret = 0;
    } else {
      ret = -1;
    }
  } else if (null == node2 || undefined == node2) {
    printMessage('compareCells: no child text to compare');
    printNode(cell2);
    ret = 1;
  } else {
    ret = compareValues(node1.nodeValue, node2.nodeValue);
  }
  // printMessage('compareCells: returning ' + ret);
  return ret;
}

function sortResults(columnNum) {
  showStatus('Sorting results...');
  resultsTable.setSortColumn(columnNum);
  resultsTable.sortTable();
  showStatus('Results sorted.');
};

function addResultColumns(resultSet, resultRecord) {
  // var iter = resultSet.getFieldIter(resultRecord);
  // var iter = new ArrayIter(resultRecord.attributes);
  var iter = new AttributeIter(resultRecord);
  // var iter = new FieldNameIter(resultSet, resultRecord);
  var args = new Array();
  iter.forAll(function(myargs) {
    // var fieldName = myargs[0];
    var field = myargs[0];
    // var fieldName = resultSet.getFieldName(field);
    // printMessage('Got field');
    resultsTable.addColumnHeading(field.name);
  }, args);
}

var tableHeaderDone = false;

function addTableHeading(resultSet, resultRecord) {
    if (tableHeaderDone) {
	return;
    }
    tableHeaderDone = true;
    addResultColumns(resultSet, resultRecord);
}

function addTableRow(resultSet, resultRecord) {
    var tableRow = document.createElement('tr');
    tableRow.setAttribute('class', 'results');
    var fieldArgs = new Array();
    fieldArgs[0] = resultSet;
    fieldArgs[1] = tableRow;
    var iter = resultSet.getFieldIter(resultRecord);
    iter.forAll(function(args) {
      var resultSet = args[0];
      var tableRow = args[1];
      var field = args[2];
      // printMessage('Got field');
      var tableCell = resultsTable.makeCell(field.value);
      tableRow.appendChild(tableCell);
    }, fieldArgs);
    resultsTable.insertRowSorted(tableRow);
}
