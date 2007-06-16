function Constraint(ident, columnName, operation, value) {
	this.ident = ident;
	this.columnName = columnName;
	this.operation = operation;
	this.value = value;
	this.getURL = function() {
		var url = '';
		url +=  'field'     + encodeURIComponent(this.ident) + '=' + encodeURIComponent(this.columnName);
		url += '&operation' + encodeURIComponent(this.ident) + '=' + encodeURIComponent(this.operation);
		url += '&value'     + encodeURIComponent(this.ident) + '=' + encodeURIComponent(this.value);
		return url;
	};
}
