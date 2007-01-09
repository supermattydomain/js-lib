function DBTable(tableNode) {
  this.table = tableNode;
  var options = this.table.getElementsByTagName('options');
  if (!options || !options.length) {
    printNode(this.table);
    fatal('No table options');
  }
  this.options = options[0];
  this.fields = this.table.getElementsByTagName('field');
  if (!this.fields || !this.fields.length) {
	printNode(this.table);
    fatal('No table fields');
  }
  this.getName = function() {
    return this.table.getAttribute('name');
  };
  this.getComment = function() {
    var comment = this.options.getAttribute('Comment');
    var i = comment.indexOf(';');
    if (i >= 0) {
      return comment.substr(0, i);
    }
    return comment;
  };
  this.getNumFields = function() {
    return this.fields.length;
  };
  this.getFieldIter = function() {
    return new DBFieldIter(this);
  };
  this.enumFields = function(fieldCallback, args) {
    var iter = this.getFieldIter();
    iter.forAll(fieldCallback, args);
    var i = iter.getCount();
    iter.cleanup();
    return i;
  };
  this.getKeyIter = function() {
    return new DBKeyIter(this);
  };
  this.enumKeys = function(keyCallback, args) {
    var iter = this.getKeyIter();
    iter.forAll(keyCallback, args);
    var i = iter.getCount();
    iter.cleanup();
    return i;
  };
  this.getForeignKeyIter = function() {
    return new DBForeignKeyIter(this);
  };
  this.enumForeignKeys = function(foreignKeyCallback, args) {
    var iter = this.getForeignKeyIter();
    iter.forAll(foreignKeyCallback, args);
    var i = iter.getCount();
    iter.cleanup();
    return i;
  };
  this.cleanup = function() {
  	this.table = null;
  	this.options = null;
  	this.fields = null;
  };
}
