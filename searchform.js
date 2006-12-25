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
  this.schema = new DBSchema();
  this.makeSearchURL = function() {
    var url = '';
    return url;
  };
  this.addCriterion = function() {
    if (this.criteria.length >= this.maxCriteria) {
	return;
    }
    var criterion = new SearchCriterion(this.criteria.length, fields, this.operations);
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
  this.populate = function(schema) {
    var args = new Array();
    arrayForAll(self.criteria, function(myargs) {
      myargs[0].populate(schema);
    }, args);
  };
  this.schema.fetchSchema(this.populate);
}
