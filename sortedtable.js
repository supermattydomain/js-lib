function MyTable() {

  this.table = document.createElement('table');
  this.table.viewObject = this;
  setClass(this.table, 'results');
  this.table.setAttribute('id', 'resultstable');
  this.headingRow = null;
  this.rowStylesClean = 0;

  var self = this;

  this.getTable = function() {
    return this.table;
  };

  this.updateRowStyles = function() {
    if (this.rowStylesClean == this.table.rows.length) {
      return;
    }
    var odd = (this.rowStylesClean % 2);
    if (this.headingRow) {
      odd = !odd;
    }
    var i;
    for (i = this.rowStylesClean; i < this.table.rows.length; i++) {
      var row = this.table.rows[i];
      if (this.headingRow == row) {
	continue;
      }
      var j;
      for (j = 0; j < row.cells.length; j++) {
        setClass(row.cells[j], 'results_' + (odd ? 'odd' : 'even'));
      }
      odd = !odd;
    }
    this.rowStylesClean = this.table.rows.length;
  };

  this.makeCell = function(contents) {
    // printMessage('makeCell');
    var tableCell = document.createElement('td');
    if (this.table.rows.length % 2) {
      setClass(tableCell, 'results_odd');
    } else {
      setClass(tableCell, 'results_even');
    }
    tableCell.appendChild(contents);
    tableCell.onmouseover = function(evt) {
      tableCell.oldClassName = tableCell.className;
      setClass(tableCell, tableCell.className + '_hover');
    };
    tableCell.onmouseout = function(evt) {
      setClass(tableCell, tableCell.oldClassName);
    };
    return tableCell;
  };

  this.addRowIndex = function(iter, index) {
    // printMessage('addRow');
    var tableRow = this.table.insertRow(index);
    setClass(tableRow, 'results');
    var args = new Array();
    args[0] = tableRow;
    iter.reset();
    iter.forAll(function(myargs) {
      // printMessage('Got field');
      var tableRow = myargs[0];
      var value = myargs[1];
      var contents;
      contents = document.createTextNode(value);
      var tableCell = self.makeCell(contents);
      tableRow.appendChild(tableCell);
      // printMessage('Added table cell');
    }, args);
    // printNode(tableRow);
    this.rowStylesClean = index;
    this.updateRowStyles();
  };

  this.addRow = function(iter) {
    this.addRowIndex(iter, this.table.rows.length);
  };

  this.removeRowIndex = function(index) {
    this.table.deleteRow(index);
  };

  this.removeColumnIndex = function(columnNum) {
    var i;
    for (i = 0; i < this.table.rows.lenght; i++) {
      this.table.rows[i].deleteCell(columnNum);
    }
  };

  this.emptyTable = function() {
    while (this.table.rows.length) {
      this.table.deleteRow(0);
    }
  };

}

function SortedTable() {

  this.base = MyTable;
  this.base();

  this.sortColumnNum = -1;
  this.sorted = false;
  this.table.viewObject = this;
  var self = this;

this.findInsertIndex = function(iter) {
  // printMessage('findInsertIndex');
  if (this.sortColumnNum < 0) {
    return this.table.rows.length;
  }
  var r;
  var i;
  for (r = 0; r < this.table.rows.length; r++) {
    var row = this.table.rows[r];
    if (this.headingRow == row) {
      continue;
    }
    var j;
    iter.reset();
    for (j = 0; j < row.cells.length; j++) {
      if (j != this.sortColumnNum) {
        continue;
      }
      var value = iter.getNext();
      var textNode = findChildByType(row.cells[j], 3);
      if (compareValues(value, textNode.nodeValue) >= 0) {
        return i;
      }
    }
    i++;
  }
  // printMessage('findInsertIndex: ' + i);
  return i;
};

  this.makeHeadingCell = function(fieldNum, fieldName) {
    // printMessage('columnNum ' + fieldNum);
    var headingCell = document.createElement('th');
    setClass(headingCell, 'results');
    headingCell.appendChild(document.createTextNode(ucFirstAll(fieldName)));
    headingCell.onclick = function(evt) {
      // evt = getEventSource(evt);
      // printMessage('makeHeadingCell: heading ' + fieldNum + ' clicked');
      sortResults(fieldNum);
    };
    headingCell.onmouseover = function(evt) {
      // printMessage('hover');
      evt = getEventSource(evt);
      setClass(headingCell, 'results_hover');
    };
    headingCell.onmouseout = function(evt) {
      // printMessage('hover');
      evt = getEventSource(evt);
      setClass(headingCell, 'results');
    };
    return headingCell;
  };

  this.addColumnHeadings = function(iter) {
    // printMessage('addColumnHeadings');
    if (this.headingRow) {
      return;
    }
    this.headingRow = this.table.insertRow(0);
    setClass(this.headingRow, 'results');
    var args = new Array();
    args[0] = 0;
    iter.forAll(function(myargs) {
      var fieldName = myargs[1];
      var headingCell = self.makeHeadingCell(myargs[0], fieldName);
      self.headingRow.appendChild(headingCell);
      myargs[0]++;
    }, args);
  };

this.compareRows = function(row1, row2) {
  // printMessage('compareRows:');
  if (row1.cells.length <= self.sortColumnNum) {
    fatal('compareRows: unsufficient td cells in comparison row 1');
  }
  if (row2.cells.length <= self.sortColumnNum) {
    fatal('compareRows: unsufficient td cells in comparison row 2');
  }
  var ret = compareCells(row1.cells[self.sortColumnNum], row2.cells[self.sortColumnNum]);
  // printMessage('compareRows: returning ' + ret);
  return ret;
};

this.getSortColumnName = function() {
  if (this.sortColumnNum < 0) {
    return 'None';
  }
  var cell = this.headingRow.cells[this.sortColumnNum];
  var textNode = findChildByType(cell, 3);
  return textNode.nodeValue;
};

this.tableToArray = function() {
  var data = new Array();
  var r;
  var i;
  for (i = r = 0; r < this.table.rows.length; r++) {
    var row = this.table.rows[r];
    if (this.headingRow == row) {
      continue;
    } else if (!row.cells.length) {
      printNode(row);
      fatal('SortedTable.tableToArray: Unexpected table row');
    }
    data[i] = new Array();
    var j;
    for (j = 0; j < row.cells.length; j++) {
      var textNode = findChildByType(row.cells[j], 3);
      data[i][j] = textNode.nodeValue;
    }
    i++;
  }
  return data;
};

this.arrayToTable = function(data) {
  if (data.length != this.table.rows.length - 1) {
    fatal('Arrays not same size ' + data.length + '/' + this.table.rows.length);
  }
  var r;
  var i;
  for (i = r = 0; r < this.table.rows.length; r++) {
    var row = this.table.rows[r];
    if (row == this.headingRow) {
      continue;
    }
    var arr = data[i];
    var j;
    for (j = 0; j < arr.length; j++) {
      var cell = row.cells[j];
      var textNode = findChildByType(cell, 3);
      textNode.nodeValue = arr[j];
    }
    i++;
  }
};

this.compareArrays = function(arr1, arr2) {
  // printMessage('compareArrays:');
  if (arr1.length != arr2.length) {
    fatal('compareArrays: Arrays different sizes');
  }
  var val1 = arr1[self.sortColumnNum];
  var val2 = arr2[self.sortColumnNum];
  return compareValues(val1, val2);
};

  this.sortTable = function() {
    if (this.sortColumnNum < 0 || this.sorted) {
      return;
    }
    showStatus('Sorting results by ' + this.getSortColumnName() + '...');
    var data = this.tableToArray();
    data.sort(this.compareArrays);
    this.arrayToTable(data);
    this.sorted = true;
    showStatus('Results sorted by ' + this.getSortColumnName() + '.');
  };

  this.setSortColumn = function(colNum) {
    if (this.sortColumnNum == colNum) {
      return;
    }
    this.sortColumnNum = colNum;
    this.sorted = false;
    // this.sortTable();
  };

  this.parentEmptyTable = this.emptyTable;
  this.emptyTable = function() {
    this.parentEmptyTable();
    this.headingRow = null;
    this.sortColumnNum = -1;
    this.sorted = false;
  };

  this.parentRemoveColumnIndex = this.removeColumnIndex;
  this.removeColumnIndex = function(columnNum) {
    this.parentRemoveColumnIndex(columnNum);
    if (this.sortColumnNum == columnNum) {
      this.sortColumnNum = -1;
      this.sorted = false;
    } else if (this.sorted && this.sortColumnNum >= 0 && columnNum < this.sortColumnNum) {
      this.sortColumnNum--;
    }
  };

  this.addRow = function(iter) {
    var index;
    if (this.sortColumnNum >= 0 && this.sorted) {
      index = this.findInsertIndex(iter);
    } else {
      index = this.table.rows.length;
    }
    this.addRowIndex(iter, index);
  };

}
SortedTable.prototype = new MyTable;
