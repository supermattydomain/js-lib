function MyTable(tableName) {
	this.tableName = tableName;
  this.table = dce('table');
  this.table.viewObject = this;
  setClass(this.table, 'results');
  this.table.setAttribute('id', 'resultstable');
  this.headingRow = null;
  this.rowStylesClean = 0;
  var self = this;
  this.getTable = function() {
    return this.table;
  };
  this.getColumnName = function(i) {
  	return this.headingRow.cells[i].firstChild.nodeValue;
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
      setClass(row, 'results_' + (odd ? 'odd' : 'even'));
      odd = !odd;
    }
    this.rowStylesClean = this.table.rows.length;
  };
  this.createCellContents = function(fieldName, value) {
	return dctn(value);
  };
  this.createCell = function(fieldName, value) {
    // printMessage('MyTable.createCell');
    var tableCell = dce('td');
    setClass(tableCell, 'results');
    tableCell.appendChild(this.createCellContents(fieldName, value));
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
    if (this.table.rows.length % 2) {
      setClass(tableRow, 'results_odd');
    } else {
      setClass(tableRow, 'results_even');
    }
    iter.reset();
    iter.forAll(function(myargs) {
      // printMessage('Got field');
      var field = myargs[0];
      var tableCell = self.createCell(field.name, field.value);
      tableRow.appendChild(tableCell);
      // printMessage('Added table cell');
    }, new Array());
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
    arrayForAll(this.table.rows, function(args) {
      args[0].deleteCell(columnNum);
    });
  };
  this.emptyTable = function() {
    while (this.table.rows.length) {
      this.table.deleteRow(0);
    }
  };
  this.cleanup = function() {
	this.table = null;
	this.headingRow = null;
  };
}
