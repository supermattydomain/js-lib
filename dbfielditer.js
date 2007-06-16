function DBFieldIter(table) {
  // showLog('In DBFieldIter constructor');
  if (!table || !table.table) {
    fatal('DBFieldIter: Bad table ' + table);
  }
  this.base = ChildElementIter;
  this.base(table.table);
  this.DBFieldIterGetNext = this.getNext;
  this.getNext = function() {
    // showLog('In DBFieldIter.getNext');
    for (;;) {
      var next = this.DBFieldIterGetNext();
      if (!next) {
        return next;
      }
      if (next.nodeName.toLowerCase() == 'field') {
	// showLog('Processing node ' + next.nodeName);
        return new DBField(this.table, next);
      }
      // showLog('Ignoring node ' + next.nodeName);
    }
  };
  this.DBFieldIterForAll = this.forAll;
  this.forAll = function(fieldCallback, args) {
    // showLog('In DBFieldIter.forAll ' + this.iterNode);
    // printNode(this.iterNode);
    this.DBFieldIterForAll(function(myargs) {
      var node = myargs.pop();
      if (node.nodeName.toLowerCase() != 'field') {
	// showLog('Ignoring node ' + node.nodeName);
        myargs.push(node);
	return;
      }
      // showLog('Processing node ' + node.nodeName);
      // printNode(node);
      var field = new DBField(table, node);
      myargs.push(field);
      fieldCallback(myargs);
    }, args);
  };
}
DBFieldIter.prototype = new ChildIter;
