function DBTableIter(schema) {
  this.base = ChildElementIter;
  this.base(schema.database);
  this.DBTableIterGetNext = this.getNext;
  this.getNext = function() {
    // printMessage('In DBTableIter.getNext');
    for (;;) {
      var next = this.DBTableIterGetNext();
      if (!next) {
        return next;
      }
      if (next.nodeName.toLowerCase() == 'table_structure') {
	    // printMessage('Processing node ' + next.nodeName);
        return new DBTable(next);
      }
      // printMessage('Ignoring node ' + next.nodeName);
    }
  };
  this.DBTableIterForAll = this.forAll;
  this.forAll = function(tableCallback, args) {
    // printMessage('In DBTableIter.forAll');
    this.DBTableIterForAll(function(myargs) {
      var node = myargs.pop();
      if (node.nodeName.toLowerCase() != 'table_structure') {
	// printMessage('Ignoring node ' + node.nodeName);
        myargs.push(node);
	return;
      }
      // printMessage('Processing node ' + node.nodeName);
      // printNode(node);
      var table = new DBTable(node);
      myargs.push(table);
      tableCallback(myargs);
    }, args);
  };
}
DBTableIter.prototype = new ChildIter;
