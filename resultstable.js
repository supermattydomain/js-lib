function ResultsTable() {
  this.base = SortedTable;
  this.base();
  this.table.viewObject = this;
  var self = this;
  this.setWaiting = function(waiting) {
  	document.body.style.cursor = (waiting ? 'wait' : 'default');
  };
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
    // showLog(value);
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
  this.createCellAlbum = function(albumName) {
  	var a = dce('a');
  	a.setAttribute('href', "javascript:showAlbum('" + albumName + "');");
  	a.appendChild(dctn(albumName));
  	a.onclick = function(evt) {
  		showAlbum(albumName);
  		return true;
  	};
  	return a;
  };
  this.resultsTableCreateCellContents = this.createCellContents;
  this.createCellContents = function(fieldName, value) {
    // showLog('In ResultsTable.createCellContents');
    if (bad(fieldName) || bad(value)) {
    	fatal('ResultsTable.createCellContents: bad name or value');
    }
    fieldName = fieldName.toLowerCase();
    var ret;
    if ('path' == fieldName || 'song.path' == fieldName) {
    	ret = this.createCellPath(value);
    } else if ('artist' == fieldName || 'artist.name' == fieldName) {
    	ret = this.createCellArtist(value);
    } else if ('album.name' == fieldName) {
    	ret = this.createCellAlbum(value);
    } else {
	    ret = this.resultsTableCreateCellContents(fieldName, value);
    }
    return ret;
  };
  this.addHeading = function(record) {
    if (this.headingRow) {
      return;
    }
    var iter = new AttributeNameIter(record);
    // showLog('Before adding column heading');
    this.addColumnHeadings(iter);
    iter.cleanup();
    // showLog('Column heading added.');
  };
  this.addRecord = function(record) {
    var iter = new AttributeIter(record);
    // showLog('Before adding row');
    this.addRow(iter);
    iter.cleanup();
    // showLog('Row added.');
  };
  this.loadResultSet = function(resultSet) {
    showStatus('Displaying ' + resultSet.getNumResults() + ' results...');
	var ex;
	try {
	    var args = new Array();
    	resultSet.enumResults(function(myargs) {
	    	// showLog('Got result');
		    var resultRecord = myargs[0];
		    // printNode(resultRecord);
		    self.addHeading(resultRecord);
		    self.addRecord(resultRecord);
	    }, args);
	    showStatus(resultSet.getNumResults() + ' results displayed.');
    } catch (e) {
    	showLog('Exception occurred while receiving result set');
    	ex = e;
    }
    self.setWaiting(false);
    if (ex) {
    	throw(ex);
    }
  };
  this.resultsTableCleanup = this.cleanup;
  this.cleanup = function() {
  	this.resultsTableCleanup();
  	this.resultSet = null;
  };
}
ResultsTable.prototype = new SortedTable;
