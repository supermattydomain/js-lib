function SearchForm(tableName) {
  this.searchURLRoot = 'search.cgi?';
  var self = this;
  this.tableName = tableName;
  this.table = null;
  this.urlDiv = null;
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
    'begins with'
  );
  this.searchForm = dce('form');
  this.searchForm.setAttribute('id', 'searchform');
  this.searchForm.setAttribute('class', 'search');
  this.searchForm.method = 'GET';
  this.searchForm.action = 'search.cgi';
  this.urlDiv = dce('div');
  this.urlLink = dce('a');
  this.urlText = dctn('');
  this.urlLink.appendChild(this.urlText);
  this.urlDiv.appendChild(this.urlLink);
  this.getForm = function() {
    return this.searchForm;
  };
  this.getURL = function() {
    var url = '';
    var i;
    for (i = 0; i < this.criteria.length; i++) {
      if (url.length != 0) {
        url += '&';
      }
      url += this.criteria[i].getURL();
    }
    url = this.searchURLRoot + url + '&format=xml';
    // TODO: replace with entry field
    url += '&maxresults=1000';
    // printMessage('SearchForm: Generated URL ' + url);
    this.urlText.nodeValue = url;
    this.urlLink.setAttribute('href', url);
    return url;
  };
  this.addCriterion = function() {
    // printMessage('In addCriterion');
    if (this.criteria.length >= this.maxCriteria) {
	return;
    }
    var criterion = new SearchCriterion(this, this.criteria.length, this.table, this.operations);
    this.criteria.push(criterion);
    this.searchForm.appendChild(criterion.getDiv());
    if (this.criteria.length >= this.maxCriteria) {
	this.moreButton.disabled = true;
    }
  };
  this.removeCriterion = function(criterion) {
  	var i;
  	var found = null;
  	for (i = 0; i < this.criteria.length; i++) {
  		if (this.criteria[i] == criterion) {
  			found = this.criteria[i];
  			break;
  		}
  	}
  	if (!found) {
  		fatal('Trying to remove criterion that is not a child of mine');
  	}
    this.searchForm.removeChild(criterion.getDiv());
  	this.criteria[i].cleanup();
  	delete this.criteria[i];
  	this.criteria.splice(i, 1);
    this.moreButton.disabled = false;
  };
  this.removeLastCriterion = function() {
    if (this.criteria.length < 1) {
	return;
    }
    var criterion = this.criteria.pop();
    this.searchForm.removeChild(criterion.getDiv());
    criterion.cleanup();
    delete criterion;
    this.moreButton.disabled = false;
  };
  this.makeButton = function(name, label) {
    button = document.createElement('input');
    button.setAttribute('id', name + 'Button');
    button.setAttribute('type', 'button');
    button.setAttribute('name', name);
    button.setAttribute('value', label);
    return button;
  };
  this.addButtons = function() {
    this.moreButton = this.makeButton('more', 'More choices');
    this.searchButton = this.makeButton('search', 'Search');
    this.testSearchButton = this.makeButton('testSearch', 'Test');
    this.resetButton = this.makeButton('reset', 'Reset');
    this.moreButton.disabled = true;
    this.searchButton.disabled = true;
    this.testSearchButton.disabled = true;
    this.resetButton.disabled = true;
    this.searchForm.appendChild(this.moreButton);
    this.searchForm.appendChild(this.testSearchButton);
    this.searchForm.appendChild(this.resetButton);
    this.searchForm.appendChild(this.searchButton);
  }
  this.populate = function(schema) {
    // printMessage('In SearchForm.populate');
    this.table = null;
    var args = new Array();
    schema.enumTables(function(myargs) {
      var table = myargs[0];
      // printMessage('searchform: got table ' + table);
      var tableName = table.getName();
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
  this.cleanup = function() {
  	this.table = null;
  	this.searchForm = null;
  	this.urlDiv = null;
    this.urlLink = null;
    this.urlText = null;
    this.moreButton = null;
    this.fewerButton = null;
    this.searchButton = null;
    this.testSearchButton = null;
    this.resetButton = null;
    arrayForAll(this.criteria, function(args) {
    	this.removeCriterion(args[0]);
    });
  };
  this.searchForm.appendChild(this.urlDiv);
  this.addButtons();
}
