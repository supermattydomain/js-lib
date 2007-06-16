function DBForeignKey(table, foreignKeyNode) {
  this.base = DBKey;
  this.base(table, foreignKeyNode);
  this.getReferencedTable = function() {
  	return this.key.getAttribute('Referenced_table_name');
  };
  this.getReferencedColumn = function() {
  	return this.key.getAttribute('Referenced_column_name');
  };
}
DBForeignKey.prototype = new DBKey;
