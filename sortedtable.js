function SortedTable() {
  this.sortColumnNum = -1;
  this.table = document.createElement('table');
  this.table.setAttribute('class', 'results');
  this.table.setAttribute('id', 'resultstable');
  this.headingRow = null;
  var self = this;

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
    // printMessage('makeCell');
    var tableCell = document.createElement('td');
    if (this.table.rows.length % 2) {
      tableCell.setAttribute('class', 'results_odd');
    } else {
      tableCell.setAttribute('class', 'results_even');
    }
    if ('' == value) {
      // FIXME: don't know how to do this using a textNode
      tableCell.innerHTML = '&nbsp;';
    } else {
      tableCell.appendChild(document.createTextNode(value));
    }
    return tableCell;
  };

  this.addRow = function(iter) {
    // printMessage('addRow');
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
      // printMessage('Added table cell');
    }, args);
    // printNode(tableRow);
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
  for (i = 0; i < this.table.rows.length; i++) {
    var node = this.table.rows[i];
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
  for (index = 0; index < this.table.rows.length; pos++) {
    var node = this.table.rows[index];
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

this.tableToArray = function() {
  var data = new Array();
  var r;
  var i;
  this.headingRow = null;
  for (i = r = 0; r < this.table.rows.length; r++) {
    var ths = this.table.rows[r].getElementsByTagName('th');
    if (ths && ths.length) {
      if (this.headingRow != null) {
	throw 'Duplicate heading rows';
      }
      this.headingRow = this.table.rows[r];
    } else {
      data[i] = new Array();
      var tds = this.table.rows[r].getElementsByTagName('td');
      if (tds && tds.length) {
        var t;
        for (t = 0; t < tds.length; t++) {
	  var textNode = findChildByType(tds[t], 3);
          data[i][t] = textNode.nodeValue;
        }
        i++;
      } else {
        printMessage('sortTable: unexpected row:');
	printNode(this.table.rows[r]);
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
    var tds = row.getElementsByTagName('td');
    var j;
    for (j = 0; j < arr.length; j++) {
      var cell = tds[j];
      var textNode = findChildByType(cell, 3);
      textNode.nodeValue = arr[j];
    }
    i++;
  }
};

this.compareArrays = function(arr1, arr2) {
  // printMessage('compareArrays:');
  if (arr1.length != arr2.length) {
    fatal('Arrays different sizes');
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
