function ResultsTable() {
  this.base = SortedTable;
  this.base();
  this.table.viewObject = this;
}
ResultsTable.prototype = new SortedTable;
