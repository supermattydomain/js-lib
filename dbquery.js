function DBQuery(constraints) {
	this.searchURLRoot = '/musicdb/search/search.cgi?';
	if (constraints && constraints.length) {
		this.constraints = constraints;
	} else {
		this.constraints = new Array();
	}
	this.columns = new Array();
	this.addConstraint = function(constraint) {
		this.constraints[this.constraints.length] = constraint;
	};
	this.addColumn = function(columnName) {
		this.columns.push(columnName);
	};
	this.setColumnNames = function(columnNames) {
		this.columns = columnNames;
	};
	this.getURL = function() {
		var url = this.searchURLRoot;
		url += 'format=xml';
		var i;
		if (!this.columns.length) {
			this.columns.push('*');
		}
		for (i = 0; i < this.columns.length; i++) {
			url += '&column=' + encodeURIComponent(this.columns[i]);
		}
		for (i = 0; i < this.constraints.length; i++) {
			url += '&' + this.constraints[i].getURL();
		}
		// TODO: replace with entry field
		url += '&maxresults=1000';
		// printMessage('DBQuery: Generated URL ' + url);
		return url;
	};
}
