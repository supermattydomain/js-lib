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
  this.searchForm = document.createElement('form');
  this.searchForm.setAttribute('id', 'searchform');
  this.searchForm.method = 'GET';
  this.searchForm.action = 'search.cgi';
  this.getForm = function() {
    return this.searchForm;
  };
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
    url += '&maxresults=1000';
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
    this.fewerButton.disabled = false;
    if (this.criteria.length >= this.maxCriteria) {
	this.moreButton.disabled = true;
    }
  };
  this.removeCriterion = function() {
    if (this.criteria.length < 1) {
	return;
    }
    var criterion = this.criteria.pop();
    this.searchForm.removeChild(criterion.getDiv());
    delete criterion;
    this.moreButton.disabled = false;
    if (this.criteria.length < 1) {
	this.fewerButton.disabled = true;
    }
  };
  self.makeButton = function(name, label) {
    button = document.createElement('input');
    button.setAttribute('id', name + 'Button');
    button.setAttribute('type', 'button');
    button.setAttribute('name', name);
    button.setAttribute('value', label);
    return button;
  };
  this.addButtons = function() {
    this.moreButton = this.makeButton('more', 'More choices');
    this.fewerButton = this.makeButton('fewer', 'Fewer choices');
    this.searchButton = this.makeButton('search', 'Search');
    this.testSearchButton = this.makeButton('testSearch', 'Example search');
    this.resetButton = this.makeButton('reset', 'Reset');
    this.moreButton.disabled = true;
    this.fewerButton.disabled = true;
    this.searchButton.disabled = true;
    this.testSearchButton.disabled = true;
    this.resetButton.disabled = true;
    this.searchForm.appendChild(this.moreButton);
    this.searchForm.appendChild(this.fewerButton);
    this.searchForm.appendChild(this.resetButton);
    this.searchForm.appendChild(this.testSearchButton);
    this.searchForm.appendChild(this.searchButton);
  }
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
      self.moreButton.disabled = false;
      self.addCriterion();
      self.resetButton.disabled = false;
      self.testSearchButton.disabled = false;
      self.searchButton.disabled = false;
      showStatus('Ready.');
    }
  };
  this.schema = new DBSchema();
  self.addButtons();
  this.schema.fetchSchema(this.populate);
}
