var sortColumnNum = 0;
var firstUnsorted = 0;

function compareRows(row1, row2) {
  // printMessage('compareRows:');
  // printMessage('node1:');
  // printNode(row1);
  // printMessage('node2:');
  // printNode(row2);
  var cells1 = row1.getElementsByTagName('td');
  var cells2 = row2.getElementsByTagName('td');
  if (null == cells1 || undefined == cells1 || 0 == cells1.length) {
    ret = -1; // header row is always less
  } else if (null == cells2 || undefined == cells2 || 0 == cells2.length) {
    ret = -1; // header row is always less
  } else {
    var node1 = cells1[sortColumnNum].firstChild.firstChild;
    var node2 = cells2[sortColumnNum].firstChild.firstChild;
    if (null == node1 || undefined == node1 || null == node2 || undefined == node2) {
      return 0;
    }
    // printMessage('compareRows:');
    // printNode(node1);
    // printNode(node2);
    var text1 = node1.nodeValue.toLowerCase();
    var text2 = node2.nodeValue.toLowerCase();
    var val1 = Number(text1);
    var val2 = Number(text2);
    if (isNaN(val1) || isNaN(val2)) {
      val1 = text1;
      val2 = text2;
    }
    // printMessage('compareRows: ' + val1 + ' ' + val2);
    var ret;
    if (val1 < val2) {
      ret = -1;
    } else if (val1 > val2) {
      ret = 1;
    } else {
      ret = 0;
    }
  }
  // printMessage('compareRows: ret=' + ret);
  return ret;
}

function findInsertPos(table, row) {
  var pos;
  var lim;
  if (firstUnsorted < table.childNodes.length) {
    lim = firstUnsorted;
  } else {
    lim = table.childNodes.length;
  }
  for (pos = 0; pos < lim; pos++) {
    var node = table.childNodes[pos];
    if (1 != node.nodeType) {
      continue;
    } else if ('tr' != node.nodeName.toLowerCase()) {
      // printMessage('findInsertPos: Ignoring node ' + node.nodeName);
      continue;
    }	
    if (compareRows(row, node) >= 0) {
      break;
    }
  }
  // printMessage('findInsertPos: ' + pos);
  return pos;
}

function insertBefore(table, pos, row) {
  var nextNode = null;
  if (pos > firstUnsorted) {
    printMessage('Inserting after first unsorted row');
  }
  if (pos < table.childNodes.length) {
    table.insertBefore(row, table.childNodes[pos]);
  } else {
    table.appendChild(row);
  }
  if (pos <= firstUnsorted) {
    firstUnsorted++;
    advanceUnsortedPos(table);
  }
}

function findPos(table, row) {
  var pos;
  for (pos = 0; pos < table.childNodes.length; pos++) {
    var node = table.childNodes[pos];
    if (1 != node.nodeType) {
      continue;
    } else if ('tr' != node.getNodeName()) {
      continue;
    }	
    if (row == node) {
      return pos;
    }
  }
  printMessage('Existing row not found');
  return null;
}

function removePos(table, pos) {
  var row = table.childNodes[pos];
  if (1 != row.nodeType || 'tr' != row.nodeName.toLowerCase()) {
    printMessage('Trying to remove something other than a row');
  }
  table.removeChild(row);
  if (pos < firstUnsorted) {
    firstUnsorted--;
    advanceUnsortedPos(table);
  }
}

function removeRow(table, row) {
  if (row.parentNode != table) {
    return;
  }
  var pos = findPos(table, row);
  removePos(table, pos);
}

function insertRowSorted(table, row) {
  removeRow(table, row);
  var pos;
  pos = findInsertPos(table, row);
  insertBefore(table, pos, row);
}

function advanceUnsortedPos(table) {
  while (firstUnsorted < table.childNodes.length) {
    var row = table.childNodes[firstUnsorted];
    if (1 == row.nodeType && 'tr' == row.nodeName.toLowerCase()) {
      return;
    }
    // printMessage('advanceUnsortedPos: Ignoring non-row node');
    firstUnsorted++;
  }
}

function sortTable(table, columnNum) {
  sortColumnNum = columnNum;
  firstUnsorted = 0;
  advanceUnsortedPos(table);
  // printNode(table);
  while (firstUnsorted < table.childNodes.length) {
    // printMessage('sortTable: ' + firstUnsorted + '/' + table.childNodes.length);
    var row = table.childNodes[firstUnsorted];
    // printNode(row);
    removePos(table, firstUnsorted);
    advanceUnsortedPos(table);
    insertRowSorted(table, row);
  }
}

function sortResults(columnNum) {
  var resultsTable = document.getElementById('results');
  if (null == resultsTable) {
    printMessage('No results table to sort');
    return;
  }
  var tbody = resultsTable.getElementsByTagName('tbody')[0];
  sortTable(tbody, columnNum);
}
