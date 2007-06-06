function DBKeyIter(table) {
  // printMessage('In DBKeyIter constructor');
  if (!table || !table.table) {
    fatal('DBKeyIter: Bad table ' + table);
  }
  this.base = ChildElementIter;
  this.base(table.table);
  this.DBKeyIterGetNext = this.getNext;
  this.getNext = function() {
    // printMessage('In DBKeyIter.getNext');
    for (;;) {
      var next = this.DBKeyIterGetNext();
      if (!next) {
        return next;
      }
      if (next.nodeName.toLowerCase() == 'key') {
	// printMessage('Processing node ' + next.nodeName);
        return new DBKey(this.table, next);
      }
      // printMessage('Ignoring node ' + next.nodeName);
    }
  };
  this.DBKeyIterForAll = this.forAll;
  this.forAll = function(keyCallback, args) {
    // printMessage('In DBKeyIter.forAll ' + this.iterNode);
    // printNode(this.iterNode);
    this.DBKeyIterForAll(function(myargs) {
      var node = myargs.pop();
      if (node.nodeName.toLowerCase() != 'key') {
	// printMessage('Ignoring node ' + node.nodeName);
        myargs.push(node);
	return;
      }
      // printMessage('Processing node ' + node.nodeName);
      // printNode(node);
      var key = new DBKey(table, node);
      myargs.push(key);
      keyCallback(myargs);
    }, args);
  };
}
DBKeyIter.prototype = new ChildIter;
