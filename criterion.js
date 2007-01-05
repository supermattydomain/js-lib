function SearchCriterion(parent, ident, table, operations) {
  var self = this;
  this.parent = parent;
  this.ident = ident;
  this.div = null;
  this.fieldSelect = null;
  this.operationSelect = null;
  this.table = table;
  this.operations = operations;
  this.makeFieldSelect = function() {
  	return new FieldSelect('criterion', 'field' + this.ident, this.table);
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
    // printMessage('populate: table = ' + this.table.getName() + '\n');
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
    // printMessage('done populate: table = ' + this.table.getName() + '\n');
  };
  this.getDiv = function() {
    return this.div;
  };
  this.getURL = function() {
    var url = '';
    url += this.fieldSelect.getName() + '=' + this.fieldSelect.getValue();
    url += '&' + this.operationSelect.getName() + '=' + this.operationSelect.getValue();
    url += '&' + this.valueField.name + '=' + this.valueField.value;
    return url;
  }
  this.populate();
}
