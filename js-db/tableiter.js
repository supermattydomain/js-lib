function DBTableIter(schema) {
  this.base = ChildElementIter;
  this.base(schema.database);
  this.DBTableIterGetNext = this.getNext;
  this.getNext = function() {
    // showLog('In DBTableIter.getNext');
    for (;;) {
      var next = this.DBTableIterGetNext();
      if (!next) {
        return next;
      }
      if (next.nodeName.toLowerCase() == 'table_structure') {
	    // showLog('Processing node ' + next.nodeName);
        return new DBTable(next);
      }
      // showLog('Ignoring node ' + next.nodeName);
    }
  };
  this.DBTableIterForAll = this.forAll;
  this.forAll = function(tableCallback, args) {
    // showLog('In DBTableIter.forAll');
    this.DBTableIterForAll(function(myargs) {
      var node = myargs.pop();
      if (node.nodeName.toLowerCase() != 'table_structure') {
	// showLog('Ignoring node ' + node.nodeName);
        myargs.push(node);
	return;
      }
      // showLog('Processing node ' + node.nodeName);
      // printNode(node);
      var table = new DBTable(node);
      myargs.push(table);
      tableCallback(myargs);
    }, args);
  };
}
DBTableIter.prototype = new ChildIter;
