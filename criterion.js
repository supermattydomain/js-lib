function SearchCriterion(parent, ident, table, operations) {
  var self = this;
  this.parent = parent;
  this.ident = ident;
  this.div = null;
  this.fieldSelect = null;
  this.operationSelect = null;
  this.table = table;
  this.operations = operations;
  this.populate = function() {
    // printMessage('populate: table = ' + self.table.getName() + '\n');
    self.div = document.createElement("div");
    self.div.setAttribute('class', 'criterion');
    self.div.setAttribute('id', 'criterion' + ident);
    self.div.viewObject = self;
    self.fieldSelect = new FieldSelect('field', self.table);
    self.operationSelect = new MySelectOptionArray('operation', self.operations, self.operations);
    self.valueField = document.createElement('input');
    self.valueField.setAttribute('name', 'value');
    self.valueField.setAttribute('type', 'text');
    // self.removeButton = document.createElement('input');
    self.removeButton = document.createElement('div');
    // self.removeButton.setAttribute('type', 'button');
    self.removeButton.setAttribute('id', 'button_remove_criterion' + ident);
    self.removeButton.setAttribute('class', 'remove_criterion');
    // self.removeButton.setAttribute('alt', 'Remove criterion ' + ident);
    var removeAnchor = document.createElement('a');
    removeAnchor.onclick = function(evt) {
    	self.parent.removeCriterion(self);
    	return true;
    };
    var removeImage = document.createElement('img');
    removeImage.setAttribute('border', 0);
    removeImage.setAttribute('src', 'remove-criterion.png');
    removeAnchor.appendChild(removeImage);
    self.removeButton.appendChild(removeAnchor);
    self.div.appendChild(self.fieldSelect.getSelect());
    self.div.appendChild(self.operationSelect.getSelect());
    self.div.appendChild(self.valueField);
    self.div.appendChild(self.removeButton);
    // printMessage('done populate: table = ' + self.table.getName() + '\n');
  };
  this.getDiv = function() {
    return this.div;
  };
  this.getURL = function() {
    var url = '';
    url += this.fieldSelect.getName() + this.ident + '=' + this.fieldSelect.getValue();
    url += '&' + this.operationSelect.getName() + this.ident + '=' + this.operationSelect.getValue();
    url += '&' + this.valueField.name + this.ident + '=' + this.valueField.value;
    return url;
  }
  this.populate();
}
