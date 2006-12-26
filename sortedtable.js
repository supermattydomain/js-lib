function SortedTable() {
  this.columnNum = 0;
  this.sortColumnNum = 0;
  this.firstUnsorted = 0;
  this.oddRow = false;
  this.realTable = document.createElement('table');
  this.realTable.setAttribute('class', 'results');
  this.realTable.setAttribute('id', 'resultstable');
  this.headingRow = null;
  this.dataRows = new Array();
  var self = this;
  var tableBodies = this.realTable.getElementsByTagName('tbody');
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

  this.makeCell = function(value) {
    var tableCell = document.createElement('td');
    if (this.oddRow) {
      tableCell.setAttribute('class', 'results_odd');
    } else {
      tableCell.setAttribute('class', 'results_even');
    }
    tableCell.appendChild(document.createTextNode(value));
    return tableCell;
  };

  this.makeRow = function(iter) {
    var tableRow = document.createElement('tr');
    tableRow.setAttribute('class', 'results');
    var fieldArgs = new Array();
    fieldArgs[0] = tableRow;
    iter.forAll(function(args) {
      // printMessage('Got field');
      var tableRow = args[0];
      var value = args[1];
      var tableCell = self.makeCell(value);
      tableRow.appendChild(tableCell);
    }, fieldArgs);
    return tableRow;
  };

  this.addRow = function(iter) {
    var tableRow = this.makeRow(iter);
    // this.insertRowSorted(tableRow);
    this.table.appendChild(tableRow);
  };

  this.makeHeadingCell = function(fieldName) {
    var headingCell = document.createElement('th');
    headingCell.setAttribute('class', 'results');
    headingCell.appendChild(document.createTextNode(ucFirstAll(fieldName)));
    headingCell.columnNum = this.columnNum;
    headingCell.onclick = function(evt) {
      // printMessage('heading ' + headingCell.columnNum + ' clicked');
        sortResults(headingCell.columnNum);
    }
    this.columnNum++;
    return headingCell;
  };

  this.addColumnHeading = function(fieldName) {
    if (!this.headingRow) {
      this.headingRow = document.createElement('tr');
      this.headingRow.setAttribute('class', 'results');
      if (this.table.firstChild) {
        this.table.insertChild(this.headingRow, this.table.firstChild);
      } else {
	this.table.appendChild(this.headingRow);
      }
    }
    var headingCell = this.makeHeadingCell(fieldName);
    this.headingRow.appendChild(headingCell);
  };

  this.addColumnHeadings = function(iter) {
    if (this.headingRow) {
      return;
    }
    var args = new Array();
    iter.forAll(function(myargs) {
      var text = myargs[0];
      resultsTable.addColumnHeading(text);
    }, args);
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
  if (pos <= this.firstUnsorted) {
    this.firstUnsorted++;
    this.advanceUnsortedPos(this.table);
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
    printMessage('advanceUnsortedPos: Ignoring non-row node');
    this.firstUnsorted++;
  }
};

this.sortTable = function() {
  var rows = this.table.getElementsByTagName('tr');
  this.dataRows = new Array();
  var r;
  var i;
  this.headingRow = null;
  for (i = r = 0; r < rows.length; r++) {
    var ths = rows[r].getElementsByTagName('th');
    if (ths && ths.length) {
      if (this.headingRow != null) {
	throw 'Duplicate heading rows';
      }
      this.headingRow = rows[r];
    } else {
      var tds = rows[r].getElementsByTagName('td');
      if (tds && tds.length) {
	this.dataRows[i++] = rows[r];
      } else {
        printMessage('sortTable: unexpected row:');
	printNode(rows[r]);
	throw 'Unexpected table row';
      }
    }
  }
  this.dataRows.sort(this.compareRows);
  for (i = 0; i < this.dataRows.length; i++) {
    this.table.removeChild(this.dataRows[i]);
  }
  this.table.removeChild(this.headingRow);
  // printMessage('sortTable: should be empty:');
  // printNode(document.getElementById('resultstable'));
  this.table.appendChild(this.headingRow);
  for (i = 0; i < this.dataRows.length; i++) {
    var oddeven = (i % 2) ? 'odd' : 'even';
    this.dataRows[i].setAttribute('class', 'results_' + oddeven);
    this.table.appendChild(this.dataRows[i]);
  }
};

}
