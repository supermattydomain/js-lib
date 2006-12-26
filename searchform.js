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
    'is similar to'
  );
  this.searchForm = document.getElementById('searchform');
  var self = this;
  this.schema = null;
  this.table = null;
  this.tableName = 'vall';
  this.getURL = function() {
    var url = '';
    var i;
    for (i = 0; i < this.criteria.length; i++) {
      if (url.length != 0) {
        url += '&';
      }
      url += this.criteria[i].getURL();
    }
    url = 'search.cgi?' + url + '&format=xml';
    // TODO: replace with entry field
    url += '&maxresults=200';
    return url;
  };
  this.addCriterion = function() {
    // printMessage('In addCriterion');
    if (this.criteria.length >= this.maxCriteria) {
	return;
    }
    var criterion = new SearchCriterion(this.criteria.length, this.schema, this.table, this.operations);
    this.criteria.push(criterion);
    this.searchForm.appendChild(criterion.getDiv());
    document.getElementById('fewerButton').disabled = false;
    if (this.criteria.length >= this.maxCriteria) {
	document.getElementById('moreButton').disabled = true;
    }
  };
  this.removeCriterion = function() {
    if (this.criteria.length < 1) {
	return;
    }
    var criterion = this.criteria.pop();
    this.searchForm.removeChild(criterion.getDiv());
    delete criterion;
    document.getElementById('moreButton').disabled = false;
    if (this.criteria.length < 1) {
	document.getElementById('fewerButton').disabled = true;
    }
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
      document.getElementById('moreButton').disabled = false;
      self.addCriterion();
      showStatus('Ready.');
    }
  };
  document.getElementById('moreButton').disabled = true;
  document.getElementById('fewerButton').disabled = true;
  this.schema = new DBSchema();
  this.schema.fetchSchema(this.populate);
}
