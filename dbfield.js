function DBField(table, fieldNode) {
  // showLog('In DBField constructor');
  this.table = table;
  this.field = fieldNode;
  if (!this.table || !this.field) {
    fatal('DBField: Bad table and/or field');
  }
  this.getName = function() {
    return this.field.getAttribute('Field');
  };
  this.getComment = function() {
    return this.field.getAttribute('Comment');
  };
  this.getTable = function() {
    return this.table;
  };
  this.getType = function() {
    return this.field.getAttribute('Type');
  };
  this.isNumeric = function() {
    var type = this.getType();
    if (type.indexOf('text') >= 0) {
      return false;
    }
    if (type.indexOf('int') >= 0) {
      return true;
    }
    if (type.indexOf('timestamp') >= 0) {
      return true;
    }
    showLog('Unrecognised type "' + type + '" of field ' + this.getName());
    return true;
  };
  this.cleanup = function() {
	this.table = null;
  	this.field = null;
  };
}
