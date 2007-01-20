function TableBrowser(tableNames, fieldNames, operations, values) {
	// printMessage('In TableBrowser constructor');
	this.div = dce('div');
	setClass(this.div, 'browse_results');
	this.searchURLRoot = 'search.cgi?';
	this.tableNames = tableNames;
	this.fieldNames = fieldNames;
	this.operations = operations;
	this.values = values;
	this.constraints = new Array();
	this.searchURL = null;
	var self = this;
	this.results = new ResultsTable();
	this.getDiv = function() {
		return this.div;
	};
	this.heading = dce('p');
	setClass(this.heading, 'alpha_index');
	this.heading.appendChild(dctn(''));
	this.makeSearchURL = function() {
		var url = this.searchURLRoot + 'format=xml&';
		var i;
		for (i = 0; i < this.tableNames.length; i++) {
			url += 'field' + i + '=' + this.tableNames[i] + '.' + this.fieldNames[i];
			url += '&operation' + i + '=' + encodeURIComponent(this.operations[i]);
			url += '&value' + i + '=' + this.values[i];
		}
		return url;
	};
	this.setSearchURL = function(searchURL) {
		if (this.searchURL == searchURL) {
			return;
		}
		this.searchURL = searchURL;
		var resultSet = new ResultSet(this.searchURL);
		resultSet.fetchResults(function() {
			self.results.emptyTable();
			self.results.loadResultSet(resultSet);
		});
	};
	this.cleanup = function() {
		if (this.results) {
			this.results.cleanup();
			this.results = null;
		}
		if (this.alphaIndex) {
			this.alphaIndex.cleanup();
			this.alphaIndex = null;
		}
		if (this.heading) {
			this.heading = null;
		}
		this.div = null;
	};
	this.updateHeading = function() {
		var text = '';
		for (i = 0; i < this.tableNames.length; i++) {
			if (this.tableNames[i]) {
				text += this.tableNames[i] + 's';
			}
			if (this.fieldNames[i] && this.operations[i] && this.values[i]) {
				text += ' whose ' + this.fieldNames[i];
				text += ' ' + this.operations[i];
				text += ' ' + this.values[i];
			}
		}
		this.heading.firstChild.nodeValue = text;
	};
	this.update = function() {
		if (
			this.tableNames && this.fieldNames && this.operations && this.values
			&& this.tableNames.length && this.fieldNames.length && this.operations.length && this.values.length
		) {
			var url = this.makeSearchURL();
			printMessage('TableBrowser.update: url ' + url);
			this.setSearchURL(url);
		}
		this.updateHeading();
	};
	this.addConstraint = function(table, field, operation, value) {
		printMessage('TableBrowser.addConstraint(' + table + ', ' + field + ', ' + operation + ', ' + value + ')');
		var i = this.tables.length;
		this.tables[i] = table;
		this.fields[i] = field;
		this.operations[i] = operation;
		this.values[i] = value;
		this.update();
	};
	this.setValue = function(value) {
		this.values[0] = value;
		this.update();
	};
	this.alphaIndex = new AlphaIndex(function(letter) {
		self.setValue(letter);
	});
	this.div.appendChild(this.heading);
	this.div.appendChild(this.alphaIndex.getDiv());
	this.div.appendChild(this.results.getTable());
	this.update();
}
