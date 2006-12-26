function SortedTable() {
  this.columnNum = 0;
  this.sortColumnNum = -1;
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
    if (this.sortColumnNum == colNum) {
      return;
    }
    this.sortColumnNum = colNum;
    this.sortTable();
  };

  this.makeCell = function(value) {
    var tableCell = document.createElement('td');
    if (this.dataRows.length % 2) {
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
    this.dataRows.push(tableRow);
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

  this.addColumnHeadings = function(iter) {
    if (this.headingRow) {
      return;
    }
    this.headingRow = document.createElement('tr');
    this.headingRow.setAttribute('class', 'results');
    if (this.table.firstChild) {
      this.table.insertChild(this.headingRow, this.table.firstChild);
    } else {
      this.table.appendChild(this.headingRow);
    }
    var args = new Array();
    iter.forAll(function(myargs) {
      var fieldName = myargs[0];
      var headingCell = self.makeHeadingCell(fieldName);
      self.headingRow.appendChild(headingCell);
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

/*

this.findInsertIndex = function(row) {
  var i;
  for (i = 0; i < this.dataRows.length; i++) {
    var node = this.dataRows[i];
    if (1 != node.nodeType) {
      continue;
    } else if ('tr' != node.nodeName.toLowerCase()) {
      printMessage('findInsertIndex: Ignoring node ' + node.nodeName);
      continue;
    }	
    if (this.compareRows(row, node) >= 0) {
      break;
    }
  }
  // printMessage('findInsertIndex: ' + i);
  return i;
};

this.insertBefore = function(index, row) {
  var nextNode = null;
  if (index < this.dataRows.length) {
    this.table.insertBefore(row, this.table.childNodes[index]);
  } else {
    this.table.appendChild(row);
  }
};

this.findIndex = function(row) {
  var index;
  for (index = 0; index < this.dataRows.length; pos++) {
    var node = this.dataRows[index];
    if (1 != node.nodeType) {
      continue;
    } else if ('tr' != node.getNodeName()) {
      continue;
    }	
    if (row == node) {
      return index;
    }
  }
  throw 'Existing row not found';
  return null;
};

this.removeIndex = function(index) {
  var row = this.dataRows[index];
  if (1 != row.nodeType || 'tr' != row.nodeName.toLowerCase()) {
    throw 'Trying to remove something other than a row';
  }
  this.table.removeChild(row);
};

this.removeRow = function(row) {
  if (row.parentNode != this.table) {
    // throw 'Trying to remove non-child';
    return;
  }
  var index = this.findIndex(row);
  this.removeIndex(index);
};

this.insertRowSorted = function(row) {
  this.removeRow(row);
  var index;
  index = this.findInsertIndex(index);
  this.insertBefore(index, row);
};

*/

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
  for (i = 0; i < this.dataRows.length; i++) {
    this.table.removeChild(this.dataRows[i]);
  }
  this.table.removeChild(this.headingRow);
  this.dataRows.sort(this.compareRows);
  // printMessage('sortTable: should be empty:');
  // printNode(document.getElementById('resultstable'));
  this.table.appendChild(this.headingRow);
  for (i = 0; i < this.dataRows.length; i++) {
    var oddEven = (i % 2) ? 'results_odd' : 'results_even';
    var cells = this.dataRows[i].getElementsByTagName('td');
    var j;
    for (j = 0; j < cells.length; j++) {
      cells[j].setAttribute('class', oddEven);
    }
    this.table.appendChild(this.dataRows[i]);
  }
  // printNode(document.getElementById('resultstable'));
};

}
