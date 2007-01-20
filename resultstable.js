function ResultsTable() {
  this.base = SortedTable;
  this.base();
  this.table.viewObject = this;
  var self = this;
  this.createCellPath = function(path) {
    // FireFox disallows Web pages or their scripts from linking to local file:/// URLs.
    // var value = removePrefix(field.value, '/music/');
    // value = 'file:///M:/' + encodeURI(value);
    // value = 'file:///M:/' + value;
    // var value = value.replace(/\//g, '\\');
    var a = dce('a');
    a.setAttribute('href', path);
    a.appendChild(dctn(path));
    // a.onclick = function(evt) {
    //   editFile(field.value);
    //   return false;
    // };
    // printMessage(value);
    return a;
  };
  this.createCellArtist = function(artistName) {
  	var a = dce('a');
  	a.setAttribute('href', "javascript:showArtist('" + artistName + "');");
  	a.appendChild(dctn(artistName));
  	a.onclick = function(evt) {
  		showArtist(artistName);
  		return true;
  	};
  	return a;
  };
  this.resultsTableCreateCellContents = this.createCellContents;
  this.createCellContents = function(name, value) {
    // printMessage('In ResultsTable.createCellContents');
    if (bad(name) || bad(value)) {
    	fatal('ResultsTable.createCellContents: bad name or value');
    }
    name = name.toLowerCase();
    var ret;
    if ('path' == name) {
    	ret = this.createCellPath(value);
    } else if ('artist' == name) {
    	ret = this.createCellArtist(value);
    } else {
	    ret = this.resultsTableCreateCellContents(name, value);
    }
    return ret;
  };
  this.addHeading = function(record) {
    if (this.headingRow) {
      return;
    }
    var iter = new AttributeNameIter(record);
    // printMessage('Before adding column heading');
    this.addColumnHeadings(iter);
    iter.cleanup();
    // printMessage('Column heading added.');
  };
  this.addRecord = function(record) {
    var iter = new AttributeIter(record);
    // printMessage('Before adding row');
    this.addRow(iter);
    iter.cleanup();
    // printMessage('Row added.');
  };
  this.loadResultSet = function(resultSet) {
    showStatus('Displaying ' + resultSet.getNumResults() + ' results...');
    var args = new Array();
    resultSet.enumResults(function(myargs) {
      // printMessage('Got result');
      var resultRecord = myargs[0];
      // printNode(resultRecord);
      self.addHeading(resultRecord);
      self.addRecord(resultRecord);
    }, args);
    showStatus(resultSet.getNumResults() + ' results displayed.');
  };
  this.resultsTableCleanup = this.cleanup;
  this.cleanup = function() {
  	this.resultsTableCleanup();
  	this.resultSet = null;
  };
}
ResultsTable.prototype = new SortedTable;
