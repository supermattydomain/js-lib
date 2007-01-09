function DBKey(table, keyNode) {
  this.table = table;
  this.key = keyNode;
  this.getTable = function() {
  	return this.table;
  }
  this.getName = function() {
  	return this.key.getAttribute('Key_name');
  };
  this.getColumns = function() {
  	var columnStr = this.key.getAttribute('Column_name');
  	return columnStr.split(',');
  };
  this.cleanup = function() {
  	this.table = null;
  	this.key = null;
  };
}
