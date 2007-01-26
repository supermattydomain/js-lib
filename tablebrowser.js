function TableBrowser(tableName, fieldName) {
	// printMessage('In TableBrowser constructor');
	this.tableName = tableName;
	this.fieldName = fieldName;
	this.firstLetter = 'a';
	this.div = dce('div');
	setClass(this.div, 'browse_results');
	this.searchURLRoot = 'search.cgi?';
	this.searchURL = null;
	var self = this;
	this.results = new ResultsTable();
	this.getDiv = function() {
		return this.div;
	};
	this.heading = dce('p');
	setClass(this.heading, 'alpha_index');
	this.heading.appendChild(dctn(''));
	this.cleanup = function() {
		if (this.results) {
			this.results.cleanup();
			delete this.results;
		}
		if (this.alphaIndex) {
			this.alphaIndex.cleanup();
			delete this.alphaIndex;
		}
		if (this.heading) {
			delete this.heading;
		}
		delete this.div;
		this.div = null;
	};
	this.describeQuery = function() {
		var text = '';
		if (this.tableName) {
			text += this.tableName + 's';
		}
		if (this.tableName && this.fieldName && this.firstLetter) {
			text += ' whose ' + this.fieldName;
			text += ' begins with ' + this.firstLetter;
		}
		return text;
	};
	this.getConstraints = function() {
		if (this.tableName && this.fieldName && this.firstLetter) {
			var beginsWith = new Constraint(0, this.tableName + '.' + this.fieldName, 'begins with', this.firstLetter);
			return new Array(beginsWith);
		}
		return new Array();
	};
	this.getQuery = function() {
		return new DBQuery(this.getConstraints());
	};
	this.update = function() {
		var query = this.getQuery();
		var url = query.getURL();
		printMessage('TableBrowser.update: url ' + url);
		var resultSet;
		try {
			resultSet = new ResultSet(url);
		} catch (e) {
		}
		if (bad(resultSet)) {
			printMessage('TableBrowser: cannot create result set');
			return;
		}
		resultSet.fetchResults(function() {
			self.results.emptyTable();
			self.results.loadResultSet(resultSet);
		});
		this.heading.firstChild.nodeValue = this.describeQuery();
		// printMessage('End of TableBrowser.update');
	};
	this.setFirstLetter = function(firstLetter) {
		if (bad(firstLetter)) {
			faal('TableBrowser.setBeginsWith: bad first letter');
		}
		this.firstLetter = firstLetter;
		this.update();
	};
	this.alphaIndex = new AlphaIndex(function(letter) {
		self.setFirstLetter(letter);
	});
	this.div.appendChild(this.heading);
	this.div.appendChild(this.alphaIndex.getDiv());
	this.div.appendChild(this.results.getTable());
	// printMessage('End of TableBrowser constructor');
}
