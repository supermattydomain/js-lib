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
    var headingCell = dce('th');
    setClass(headingCell, 'results');
    headingCell.appendChild(dctn(ucFirstAll(fieldName)));
    headingCell.onclick = function(evt) {
      // evt = getEventSource(evt);
      // printMessage('makeHeadingCell: heading ' + fieldNum + ' clicked');
      sortResults(fieldNum);
    };
    headingCell.onmouseover = function(evt) {
      // printMessage('hover');
      evt = getEventSource(evt);
      headingCell.oldClassName = headingCell.className;
      setClass(headingCell, headingCell.className + '_hover');
    };
    headingCell.onmouseout = function(evt) {
      // printMessage('hover');
      evt = getEventSource(evt);
      setClass(headingCell, headingCell.oldClassName);
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
  this.compareCells = function(cell1, cell2) {
    var node1 = findChildByType(cell1, nodeTypeText);
    var node2 = findChildByType(cell2, nodeTypeText);
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
  };
  this.compareRows = function(row1, row2) {
    // printMessage('compareRows:');
    if (row1.cells.length <= self.sortColumnNum) {
      fatal('compareRows: unsufficient cells in comparison row 1');
    }
    if (row2.cells.length <= self.sortColumnNum) {
      fatal('compareRows: unsufficient cells in comparison row 2');
    }
    var ret = this.compareCells(row1.cells[self.sortColumnNum], row2.cells[self.sortColumnNum]);
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
  this.SortedTableEmptyTable = this.emptyTable;
  this.emptyTable = function() {
    this.SortedTableEmptyTable();
    this.headingRow = null;
    this.sortColumnNum = -1;
    this.sorted = false;
  };
  this.SortedTableRemoveColumnIndex = this.removeColumnIndex;
  this.removeColumnIndex = function(columnNum) {
    this.SortedTableRemoveColumnIndex(columnNum);
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
  this.sortedTableCleanup = this.cleanup;
  this.cleanup = function() {
  	this.sortedTableCleanup();
  };
}
SortedTable.prototype = new MyTable;
