function SearchForm() {
  this.criteria = new Array();
  this.maxCriteria = 20;
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
  this.schema = null;
  this.table = null;
  this.tableName = 'vall';
  this.makeSearchURL = function() {
    var url = '';
    return url;
  };
  this.addCriterion = function() {
    if (this.criteria.length >= this.maxCriteria) {
	return;
    }
    var criterion = new SearchCriterion(this.criteria.length, this.schema, this.table, this.operations);
    this.criteria[this.criteria.length] = criterion;
    this.searchForm.appendChild(criterion.getDiv());
  };
  this.removeCriterion = function() {
    if (this.criteria.length < 1) {
	return;
    }
    var parentNode = this.criteria[this.criteria.length - 1].parentNode;
    parentNode.removeChild(this.criteria[this.criteria.length - 1]);
    // delete this.criteria[this.criteria.length - 1];
    this.criteria.length--;
  };
  this.populate = function(schema) {
    this.table = null;
    var args = new Array();
    schema.enumTables(function(myargs) {
      var table = myargs[0];
      var tableName = schema.getTableName(table);
      // printMessage('table = ' + tableName + '\n');
      if (self.tableName == tableName) {
        self.table = table;
      }
    }, args);
    if (null == self.table) {
      printMessage('Cannot find table ' + self.tableName);
    } else {
      // printMessage('searchform: found table ' + self.tableName);
      self.addCriterion();
    }
  };
  this.schema = new DBSchema();
  this.schema.fetchSchema(this.populate);
}
