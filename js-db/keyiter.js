function DBKeyIter(table) {
  // showLog('In DBKeyIter constructor');
  if (!table || !table.table) {
    fatal('DBKeyIter: Bad table ' + table);
  }
  this.base = ChildElementIter;
  this.base(table.table);
  this.DBKeyIterGetNext = this.getNext;
  this.getNext = function() {
    // showLog('In DBKeyIter.getNext');
    for (;;) {
      var next = this.DBKeyIterGetNext();
      if (!next) {
        return next;
      }
      if (next.nodeName.toLowerCase() == 'key') {
	// showLog('Processing node ' + next.nodeName);
        return new DBKey(this.table, next);
      }
      // showLog('Ignoring node ' + next.nodeName);
    }
  };
  this.DBKeyIterForAll = this.forAll;
  this.forAll = function(keyCallback, args) {
    // showLog('In DBKeyIter.forAll ' + this.iterNode);
    // printNode(this.iterNode);
    this.DBKeyIterForAll(function(myargs) {
      var node = myargs.pop();
      if (node.nodeName.toLowerCase() != 'key') {
	// showLog('Ignoring node ' + node.nodeName);
        myargs.push(node);
	return;
      }
      // showLog('Processing node ' + node.nodeName);
      // printNode(node);
      var key = new DBKey(table, node);
      myargs.push(key);
      keyCallback(myargs);
    }, args);
  };
}
DBKeyIter.prototype = new ChildIter;
