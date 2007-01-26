function SortedTable() {
  this.base = MyTable;
  this.base();
  this.sortColumnNum = -1;
  this.sorted = false;
  this.table.viewObject = this;
  var self = this;
  this.findInsertIndex = function(iter) {
    // printMessage('SortedTable.findInsertIndex');
    if (this.sortColumnNum < 0 || bad(this.sortColumnNum)) {
      return this.table.rows.length;
    }
    var i;
    for (i = (bad(this.headingRow) ? 0 : 1); i < this.table.rows.length; i++) {
      var row = this.table.rows[i];
      assert(this.headingRow == row);
      var j;
      iter.reset();
      for (j = 0; j < row.cells.length; j++) {
        if (j != this.sortColumnNum) {
          continue;
        }
        var value = iter.getNext();
        // var sortValue = row.cells[j].firstChild.sortValue;
        var sortValue = row.cells[j].sortValue;
        if (compareValues(value, sortValue) >= 0) {
        	printMessage('findInsertIndex: ' + i);
        	return i;
        }
      }
    }
    printMessage('SortedTable.findInsertIndex: ' + i);
    return i;
  };
  this.sortedTableCreateCell = this.createCell;
  this.createCell = function(fieldName, value) {
  	var cell = this.sortedTableCreateCell(fieldName, value);
    cell.sortValue = value;
    return cell;
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
    // printMessage('SortedTable.addColumnHeadings');
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
    ret = compareValues(cell1.sortValue, cell2.sortValue);
    // printMessage('compareCells: returning ' + ret);
    return ret;
  };
  this.compareRows = function(row1, row2) {
    // printMessage('SortedTable.compareRows');
  	if (bad(this.sortColumnNum)) {
  		printMessage('SortedTable.compareRows: bad sort column');
  		return;
  	}
    if (row1.cells.length <= this.sortColumnNum) {
      fatal('compareRows: unsufficient cells in comparison row 1');
    }
    if (row2.cells.length <= this.sortColumnNum) {
      fatal('compareRows: insufficient cells in comparison row 2');
    }
    var ret = this.compareCells(row1.cells[this.sortColumnNum], row2.cells[this.sortColumnNum]);
    // printMessage('compareRows: returning ' + ret);
    return ret;
  };
  this.getSortColumnName = function() {
    if (this.sortColumnNum < 0 || bad(this.sortColumnNum)) {
      return 'None';
    }
    var cell = this.headingRow.cells[this.sortColumnNum];
    var textNode = findChildByType(cell, 3);
    return textNode.nodeValue;
  };
  this.tableToArray = function() {
  	// printMessage('In SortedTable.tableToArray');
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
	    var cell = row.cells[j];
	    if (undefined == cell.sortValue || null == cell.sortValue) {
	    	printNode(cell);
	    	fatal('No sort value');
	    }
        data[i][j] = cell.sortValue;
      }
      i++;
    }
    return data;
  };
  this.arrayToTable = function(data) {
  	// printMessage('In SortedTable.arrayToTable');
    if (data.length != this.table.rows.length - (bad(this.headingRow) ? 0 : 1)) {
      fatal('SortedTable.arrayToTable: Arrays not same size ' + data.length + '/' + this.table.rows.length);
    }
    var r;
    var i;
    for (i = r = 0; r < this.table.rows.length; r++) {
      var row = this.table.rows[r];
      if (row == this.headingRow) {
        continue;
      }
      var j;
      for (j = 0; j < data[i].length; j++) {
        var cell = row.cells[j];
        var newCell = this.createCell(this.getColumnName(j), data[i][j]);
        row.replaceChild(newCell, cell);
      }
      i++;
    }
  };
  this.compareArrays = function(arr1, arr2, sortColumnNum) {
    // printMessage('In SortedTable.compareArrays: sort column ' + sortColumnNum);
    if (bad(sortColumnNum) || sortColumnNum < 0) {
    	fatal('SortedTable.compareArrays: bad sort column');
    }
    assertGood(sortColumnNum);
    assertGood(arr1);
    assertGood(arr2);
    assertGood(arr1.length);
    assertGood(arr2.length);
    if (arr1.length != arr2.length) {
      fatal('compareArrays: Arrays different sizes');
    }
    if (sortColumnNum < 0) {
    	fatal('Bad sort column num');
    }
    if (sortColumnNum >= arr1.length) {
    	fatal('compareArrays: insufficient elements');
    }
    // printMessage('Array 1:');
    // dumpData(arr1);
    // printMessage('Array 2:');
    // dumpData(arr2);
    // printMessage(sortColumnNum);
    var val1 = arr1[sortColumnNum];
    var val2 = arr2[sortColumnNum];
    if (val1 == null || val1 == undefined || val2 == null || val2 == undefined) {
    	fatal('SortedTable.compareArrays: Bad values in comparison arrays');
    }
    var ret = compareValues(val1, val2);
    return ret;
  };
  this.dumpData = function(data) {
  	var i;
  	for (i = 0; i < data.length; i++) {
  		dumpData(data[i][this.sortColumnNum]);
  	}
  };
  this.sortTable = function() {
  	// assertGood(this.sortColumnNum);
    if (bad(this.sortColumnNum) || this.sortColumnNum < 0 || this.sorted) {
      fatal('Bad sort column');
    }
    showStatus('Sorting results by ' + this.getSortColumnName() + '...');
    var data = this.tableToArray();
    var sortColumnNum = this.sortColumnNum;
    var self = this;
    data.sort(function(arr1, arr2) {
    	return self.compareArrays(arr1, arr2, sortColumnNum);
    });
    // this.dumpData(data);
    this.arrayToTable(data);
    this.sorted = true;
    showStatus('Results sorted by ' + this.getSortColumnName() + '.');
  };
  this.setSortColumn = function(colNum) {
  	assertGood(colNum);
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
  	assertGood(columnNum);
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
