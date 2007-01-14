function DBQuery(constraints) {
	this.searchURLRoot = 'search.cgi?';
	if (constraints && constraints.length) {
		this.constraints = constraints;
	} else {
		this.constraints = new Array();
	}
	this.addConstraint = function(constraint) {
		this.constraints[this.constraints.length] = constraint;
	};
	this.getURL = function() {
		var url = this.searchURLRoot;
		url += 'format=xml';
		var i;
		for (i = 0; i < this.constraints.length; i++) {
			url += '&' + this.constraints[i].getURL();
		}
		// TODO: replace with entry field
		url += '&maxresults=1000';
		// printMessage('DBQuery: Generated URL ' + url);
		return url;
	};
}
