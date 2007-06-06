function DBFieldIter(table) {
  // printMessage('In DBFieldIter constructor');
  if (!table || !table.table) {
    fatal('DBFieldIter: Bad table ' + table);
  }
  this.base = ChildElementIter;
  this.base(table.table);
  this.DBFieldIterGetNext = this.getNext;
  this.getNext = function() {
    // printMessage('In DBFieldIter.getNext');
    for (;;) {
      var next = this.DBFieldIterGetNext();
      if (!next) {
        return next;
      }
      if (next.nodeName.toLowerCase() == 'field') {
	// printMessage('Processing node ' + next.nodeName);
        return new DBField(this.table, next);
      }
      // printMessage('Ignoring node ' + next.nodeName);
    }
  };
  this.DBFieldIterForAll = this.forAll;
  this.forAll = function(fieldCallback, args) {
    // printMessage('In DBFieldIter.forAll ' + this.iterNode);
    // printNode(this.iterNode);
    this.DBFieldIterForAll(function(myargs) {
      var node = myargs.pop();
      if (node.nodeName.toLowerCase() != 'field') {
	// printMessage('Ignoring node ' + node.nodeName);
        myargs.push(node);
	return;
      }
      // printMessage('Processing node ' + node.nodeName);
      // printNode(node);
      var field = new DBField(table, node);
      myargs.push(field);
      fieldCallback(myargs);
    }, args);
  };
}
DBFieldIter.prototype = new ChildIter;
