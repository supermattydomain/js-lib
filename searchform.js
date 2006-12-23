function SearchForm() {
  this.criteria = new Array();
  this.maxCriteria = 20;
  this.fieldLabels = null;
  this.operations = new Array(
    'contains',
    'is equal to',
    'is not equal to',
    'is less than',
    'is less than or equal to',
    'is greater than',
    'is greater than or equal to',
    'is similar to',
    'is in range'
  );
  this.searchForm = document.getElementById('searchform');
  var self = this;
  this.schema = new DBSchema();
  this.makeFieldLabels = function() {
    if (null != this.fieldLabels) {
      return;
    }
    this.fieldLabels = new Array();
    var i;
    for (i = 0; i < fields.length; i++) {
      this.fieldLabels[i] = ucFirstAll(fields[i].replace(/\./g, ' '));
    }
  };
  this.makeSearchURL = function() {
    var url = '';
    return url;
  };
  this.addCriterion = function() {
    if (this.criteria.length >= this.maxCriteria) {
	return;
    }
    this.makeFieldLabels();
    var criterion = new SearchCriterion(this.criteria.length, this.fieldLabels, fields, this.operations);
    this.criteria[this.criteria.length] = criterion;
    this.searchForm.appendChild(criterion.getDiv());
  };
  this.removeCriterion = function() {
    if (this.criteria.length < 1) {
	return;
    }
    var criterion = this.criteria[this.criteria.length - 1];
    criterion.parentNode.removeChild(criterion);
    this.criteria[this.criteria.length - 1] = null;
    this.criteria.length--;
  };
  this.makeFieldSelectOneTable = function(controlName, table) {
    var select = document.createElement('select');
    select.setAttribute("name", controlName);
    var args = new Array();
    this.schema.enumFields(table, function(myargs) {
      var field = myargs[0];
      // printMessage('Found field ' + self.schema.getTableName(table) + '.' + self.schema.getFieldName(field) + '\n');
      var label = ucFirst(self.schema.getTableName(table)) + ' ' + ucFirst(self.schema.getFieldName(field));
      var value = self.schema.getTableName(table) + '.' + self.schema.getFieldName(field);
      select.appendChild(makeOption(label, value));
    }, args);
    return select;
  };
  this.populate = function(schema) {
    var tableNum = 0;
    var args = new Array();
    self.schema.enumTables(function(myargs) {
      var table = myargs[0];
      // printMessage('tables[' + tableNum + '] = ' + schema.getTableName(table) + '\n');
      var select = self.makeFieldSelectOneTable('field' + self.criteria.length, table);
      self.searchForm.appendChild(select);
      tableNum++;
    }, args);
  };
  this.schema.fetchSchema(this.populate);
}
