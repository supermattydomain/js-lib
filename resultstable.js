function ResultsTable() {
  this.base = SortedTable;
  this.base();
}
ResultsTable.prototype = new SortedTable;
