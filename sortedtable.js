function SortedTable() {
  this.sortColumnNum = -1;
  this.table = document.createElement('table');
  this.table.setAttribute('class', 'results');
  this.table.setAttribute('id', 'resultstable');
  this.headingRow = null;
  this.dataRows = new Array();
  var self = this;
  // printNode(this.table);
  this.getTable = function() {
    return this.table;
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
    if ('' == value) {
      tableCell.innerHTML = '&nbsp;';
    } else {
      tableCell.appendChild(document.createTextNode(value));
    }
    return tableCell;
  };

  this.makeRow = function(iter) {
    // printMessage('makeRow');
    var tableRow = this.table.insertRow(this.table.rows.length);
    tableRow.setAttribute('class', 'results');
    var args = new Array();
    args[0] = tableRow;
    iter.forAll(function(myargs) {
      // printMessage('Got field');
      var tableRow = myargs[0];
      var value = myargs[1];
      var tableCell = self.makeCell(value);
      tableRow.appendChild(tableCell);
    }, args);
    return tableRow;
  };

  this.addRow = function(iter) {
    // printMessage('addRow');
    var tableRow = this.makeRow(iter);
    this.dataRows.push(tableRow);
  };

  this.makeHeadingCell = function(fieldNum, fieldName) {
    // printMessage('columnNum ' + fieldNum);
    var headingCell = document.createElement('th');
    headingCell.setAttribute('class', 'results');
    headingCell.appendChild(document.createTextNode(ucFirstAll(fieldName)));
    headingCell.onclick = function(evt) {
      evt = getEventSource(evt);
      // printMessage('makeHeadingCell: heading ' + fieldNum + ' clicked');
      sortResults(fieldNum);
    }
    return headingCell;
  };

  this.addColumnHeadings = function(iter) {
    if (this.headingRow) {
      return;
    }
    this.headingRow = this.table.insertRow(0);
    this.headingRow.setAttribute('class', 'results');
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
  this.table.removeRow(index);
};

this.insertRowSorted = function(iter) {
  var index;
  index = this.findInsertIndex(index);
  var row = this.makeRow(iter);
  this.insertBefore(index, row);
};

this.tableToArray = function() {
  var rows = this.table.getElementsByTagName('tr');
  var data = new Array();
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
      data[i] = new Array();
      var tds = rows[r].getElementsByTagName('td');
      if (tds && tds.length) {
        var t;
        for (t = 0; t < tds.length; t++) {
	  var textNode = findChildByType(tds[t], 3);
          data[i][t] = textNode.nodeValue;
        }
        i++;
      } else {
        printMessage('sortTable: unexpected row:');
	printNode(rows[r]);
	throw 'Unexpected table row';
      }
    }
  }
  return data;
};

this.getSortColumnName = function() {
  if (this.sortColumnNum < 0) {
    return 'None';
  }
  var cells = this.headingRow.getElementsByTagName('th');
  var cell = cells[this.sortColumnNum];
  var textNode = findChildByType(cell, 3);
  return textNode.nodeValue;
};

this.arrayToTable = function(data) {
  if (data.length != this.dataRows.length) {
    fatal('Arrays not same size');
  }
  var i;
  for (i = 0; i < data.length; i++) {
    var arr = data[i];
    var tds = this.dataRows[i].getElementsByTagName('td');
    var j;
    for (j = 0; j < arr.length; j++) {
      var cell = tds[j];
      var textNode = findChildByType(cell, 3);
      textNode.nodeValue = arr[j];
    }
  }
};

this.compareArrays = function(arr1, arr2) {
  // printMessage('compareArrays:');
  if (arr1.length != arr2.length) {
    printMessage('Arrays different sizes');
    throw 'Arrays different sizes';
  }
  var val1 = arr1[self.sortColumnNum];
  var val2 = arr2[self.sortColumnNum];
  return compareValues(val1, val2);
};

  this.sortTable = function() {
    if (this.sortColumnNum < 0) {
      return;
    }
    var data = this.tableToArray();
    data.sort(this.compareArrays);
    this.arrayToTable(data);
  };

  this.emptyTable = function() {
    var i;
    for (i = 0; i < this.dataRows.length; i++) {
      delete this.dataRows[i];
      this.dataRows[i] = null;
    }
    this.dataRows = new Array();
    while (this.table.rows.length > 1) {
      if (this.headingRow == this.table.rows[0]) {
	this.table.deleteRow(1);
      } else {
	this.table.deleteRow(0);
      }
    }
    if (this.table.rows.length && this.headingRow != this.table.rows[0]) {
      this.table.deleteRow(0);
    }
  };

  this.updateRowStyles = function() {
    var even = true;
    var i;
    for (i = 0; i < this.table.rows.length; i++) {
      var row = this.table.rows[i];
      if (this.headingRow == row) {
	continue;
      }
      var oddeven = (even) ? 'even' : 'odd';
      var tds = row.getAttributesByTagName('td');
      var j;
      for (j = 0; j < tds.length; j++) {
	tds[j].setAttribute('class', 'results_' + oddeven);
      }
      even = !even;
    }
  };

}
