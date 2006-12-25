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

function SortedTable() {
  this.sortColumnNum = 0;
  this.firstUnsorted = 0;
  this.realTable = document.createElement('table');
  this.realTable.setAttribute('class', 'results');
  this.realTable.setAttribute('id', 'resultstable');
  var tableBodies = this.realTable.getElementsByTagName('tbody');
  var self = this;
  if (0 == tableBodies.length) {
    // printNode(realTable);
    this.table = this.realTable;
  } else {
    this.table = tableBodies[0];
  }
  this.getTable = function() {
    return this.realTable;
  };
  this.setSortColumn = function(colNum) {
    self.sortColumnNum = colNum;
  };
this.compareRows = function(row1, row2) {
  // printMessage('compareRows:');
  // printMessage('node1:');
  // printNode(row1);
  // printMessage('node2:');
  // printNode(row2);
  var cells1 = row1.getElementsByTagName('td');
  var cells2 = row2.getElementsByTagName('td');
  if (null == cells1 || undefined == cells1 || cells1.length <= self.sortColumnNum) {
    throw 'compareRows: no td cells in comparison row 1';
  }
  if (null == cells2 || undefined == cells2 || cells2.length <= self.sortColumnNum) {
    throw 'compareRows: no td cells in comparison row 2';
  }
  var ret = compareCells(cells1[self.sortColumnNum], cells2[self.sortColumnNum]);
  // printMessage('compareRows: returning ' + ret);
  return ret;
};

this.findInsertPos = function(row) {
  var pos;
  var lim;
  if (this.firstUnsorted < this.table.childNodes.length) {
    lim = this.firstUnsorted;
  } else {
    lim = this.table.childNodes.length;
  }
  for (pos = 0; pos < lim; pos++) {
    var node = this.table.childNodes[pos];
    if (1 != node.nodeType) {
      continue;
    } else if ('tr' != node.nodeName.toLowerCase()) {
      // printMessage('findInsertPos: Ignoring node ' + node.nodeName);
      continue;
    }	
    if (this.compareRows(row, node) >= 0) {
      break;
    }
  }
  // printMessage('findInsertPos: ' + pos);
  return pos;
};

this.insertBefore = function(pos, row) {
  var nextNode = null;
  if (pos > this.firstUnsorted) {
    throw 'Inserting after first unsorted row';
  }
  if (pos < this.table.childNodes.length) {
    this.table.insertBefore(row, this.table.childNodes[pos]);
  } else {
    this.table.appendChild(row);
  }
  if (pos <= firstUnsorted) {
    this.firstUnsorted++;
    this.advanceUnsortedPos(table);
  }
};

this.findPos = function(row) {
  var pos;
  for (pos = 0; pos < this.table.childNodes.length; pos++) {
    var node = this.table.childNodes[pos];
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
};

this.removePos = function(pos) {
  var row = this.table.childNodes[pos];
  if (1 != row.nodeType || 'tr' != row.nodeName.toLowerCase()) {
    throw 'Trying to remove something other than a row';
  }
  this.table.removeChild(row);
  if (pos < this.firstUnsorted) {
    this.firstUnsorted--;
    this.advanceUnsortedPos();
  }
};

this.removeRow = function(row) {
  if (row.parentNode != this.table) {
    return;
  }
  var pos = this.findPos(row);
  this.removePos(pos);
};

this.insertRowSorted = function(row) {
  this.removeRow(row);
  var pos;
  pos = this.findInsertPos(row);
  this.insertBefore(pos, row);
};

this.advanceUnsortedPos = function() {
  while (this.firstUnsorted < this.table.childNodes.length) {
    var row = this.table.childNodes[this.firstUnsorted];
    if (1 == row.nodeType && 'tr' == row.nodeName.toLowerCase()) {
      return;
    }
    // printMessage('advanceUnsortedPos: Ignoring non-row node');
    this.firstUnsorted++;
  }
};

this.insertionSortTable = function() {
  this.firstUnsorted = 0;
  this.advanceUnsortedPos();
  // printNode(table);
  while (this.firstUnsorted < this.table.childNodes.length) {
    // printMessage('sortTable: ' + this.firstUnsorted + '/' + this.table.childNodes.length);
    var row = this.table.childNodes[this.firstUnsorted];
    // printNode(row);
    this.removePos(this.firstUnsorted);
    this.advanceUnsortedPos();
    this.insertRowSorted(row);
  }
};

this.sortTable = function() {
  var rows = this.table.getElementsByTagName('tr');
  var dataRows = new Array();
  var r;
  var i;
  var headingRow = null;
  for (i = r = 0; r < rows.length; r++) {
    var ths = rows[r].getElementsByTagName('th');
    if (ths && ths.length) {
      headingRow = rows[r];
    } else {
      var tds = rows[r].getElementsByTagName('td');
      if (tds && tds.length) {
	dataRows[i++] = rows[r];
      } else {
        printMessage('sortTable: unexpected row:');
	printNode(rows[r]);
	throw 'Unexpected table row';
      }
    }
  }
  dataRows.sort(this.compareRows);
  for (i = 0; i < dataRows.length; i++) {
    this.table.removeChild(dataRows[i]);
  }
  this.table.removeChild(headingRow);
  // printMessage('sortTable: should be empty:');
  // printNode(document.getElementById('resultstable'));
  this.table.appendChild(headingRow);
  for (i = 0; i < dataRows.length; i++) {
    var oddeven = (i % 2) ? 'odd' : 'even';
    dataRows[i].setAttribute('class', 'results_' + oddeven);
    this.table.appendChild(dataRows[i]);
  }
};

}

function sortResults(columnNum) {
  showStatus('Sorting results...');
  resultsTable.setSortColumn(columnNum);
  resultsTable.sortTable();
  showStatus('Results sorted.');
};
