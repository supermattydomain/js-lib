function SearchCriterion(parent, ident, table, operations) {
  var self = this;
  this.parent = parent;
  this.ident = ident;
  this.div = null;
  this.fieldSelect = null;
  this.valueField = null;
  this.operationSelect = null;
  this.table = table;
  this.operations = operations;
  this.makeFieldSelect = function() {
  	return new FieldSelect('criterion_field', 'field' + this.ident, this.table);
  };
  this.makeOperationSelect = function() {
  	return new MySelectOptionArray('criterion', 'operation' + this.ident, this.operations, this.operations);
  };
  this.makeValueField = function() {
    var valueField = dce('input');
    valueField.setAttribute('name', 'value' + this.ident);
    valueField.setAttribute('type', 'text');
    setClass(valueField, 'criterion');
    return valueField;
  };
  this.makeRemoveButton = function() {
    var removeAnchor = dce('a');
    setClass(removeAnchor, 'remove_criterion');
    removeAnchor.setAttribute('id', 'remove_criterion' + this.ident);
    removeAnchor.setAttribute('href', 'Remove criterion ' + this.ident);
    removeAnchor.onclick = function(evt) {
    	self.parent.removeCriterion(self);
    	return false;
    };
    var removeImage = dce('img');
    removeImage.setAttribute('border', 0);
    setClass(removeImage, 'criterion');
    removeImage.setAttribute('src', 'remove-criterion.png');
    removeImage.setAttribute('alt', 'Remove criterion ' + ident);
    removeAnchor.appendChild(removeImage);
    return removeAnchor;
  };
  this.populate = function() {
    // showLog('populate: table = ' + this.table.getName() + '\n');
    this.div = dce("div");
    this.div.setAttribute('class', 'criterion');
    this.div.setAttribute('id', 'criterion' + this.ident);
    this.div.viewObject = this;
    this.fieldSelect = this.makeFieldSelect();
    this.operationSelect = this.makeOperationSelect();
    this.valueField = this.makeValueField();
    this.removeButton = this.makeRemoveButton();
    this.div.appendChild(this.fieldSelect.getSelect());
    this.div.appendChild(this.operationSelect.getSelect());
    this.div.appendChild(this.valueField);
    // this.div.appendChild(this.removeButton);
    this.div.appendChild(this.removeButton);
    // showLog('done populate: table = ' + this.table.getName() + '\n');
  };
  this.getDiv = function() {
    return this.div;
  };
  this.getConstraint = function() {
  	return new Constraint(this.ident, this.fieldSelect.getValue(), this.operationSelect.getValue(), this.valueField.value);
  };
  this.takeFocus = function() {
  	if (good(this.valueField)) {
  		this.valueField.focus();
  	}
  };
  this.cleanup = function() {
	if (this.fieldSelect) {
		this.fieldSelect.cleanup();
		this.fieldSelect = null;
	}
	this.valueField = null;
	if (this.operationSelect) {
		this.operationSelect.cleanup();
		this.operationSelect = null;
	}
	this.table = null;
	this.parent = null;
	this.div = null;
  };
  this.populate();
}
