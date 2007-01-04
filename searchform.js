function SearchForm(tableName) {
  this.searchURLRoot = 'search.cgi?';
  var self = this;
  this.tableName = tableName;
  this.table = null;
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
  this.urlDiv = document.createElement('div');
  this.urlLink = document.createElement('a');
  this.urlText = document.createTextNode('');
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
    this.fewerButton.disabled = false;
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
  	delete this.criteria[i];
  	this.criteria.splice(i, 1);
    this.searchForm.removeChild(criterion.getDiv());
    this.moreButton.disabled = false;
    if (this.criteria.length < 1) {
	this.fewerButton.disabled = true;
    }
  };
  this.removeLastCriterion = function() {
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
  this.searchForm.appendChild(this.urlDiv);
  this.addButtons();
}
