function Constraint(ident, columnName, operation, value) {
	this.ident = ident;
	this.columnName = columnName;
	this.operation = operation;
	this.value = value;
	this.getURL = function() {
		var url = '';
		url +=  'field'     + this.ident + '=' + this.columnName;
		url += '&operation' + this.ident + '=' + this.operation;
		url += '&value'     + this.ident + '=' + this.value;
		return url;
	};
}
