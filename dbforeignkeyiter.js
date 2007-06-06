function DBForeignKeyIter(table) {
  // printMessage('In DBForeignKeyIter constructor');
  if (!table || !table.table) {
    fatal('DBForeignKeyIter: Bad table ' + table);
  }
  this.base = ChildElementIter;
  this.base(table.table);
  this.DBForeignKeyIterGetNext = this.getNext;
  this.getNext = function() {
    // printMessage('In DBForeignKeyIter.getNext');
    for (;;) {
      var next = this.DBForeignKeyIterGetNext();
      if (!next) {
        return next;
      }
      if (next.nodeName.toLowerCase() == 'foreign_key') {
	// printMessage('Processing node ' + next.nodeName);
        return new DBForeignKey(this.table, next);
      }
      // printMessage('Ignoring node ' + next.nodeName);
    }
  };
  this.DBForeignKeyIterForAll = this.forAll;
  this.forAll = function(foreignKeyCallback, args) {
    // printMessage('In DBForeignKeyIter.forAll ' + this.iterNode);
    // printNode(this.iterNode);
    this.DBForeignKeyIterForAll(function(myargs) {
      var node = myargs.pop();
      if (node.nodeName.toLowerCase() != 'foreign_key') {
	// printMessage('Ignoring node ' + node.nodeName);
        myargs.push(node);
	return;
      }
      // printMessage('Processing node ' + node.nodeName);
      // printNode(node);
      var key = new DBForeignKey(table, node);
      myargs.push(key);
      foreignKeyCallback(myargs);
    }, args);
  };
}
DBForeignKeyIter.prototype = new ChildIter;
