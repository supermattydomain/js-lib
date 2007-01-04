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
    self.div.viewObject = self;
    self.fieldSelect = new FieldSelect('field', self.table);
    self.operationSelect = new MySelectOptionArray('operation', self.operations, self.operations);
    self.valueField = document.createElement('input');
    self.valueField.setAttribute('name', 'value');
    self.valueField.setAttribute('type', 'text');
    self.removeButton = document.createElement('input');
    self.removeButton.setAttribute('id', 'buttonRemoveCriterion' + ident);
    self.removeButton.setAttribute('type', 'button');
    self.removeButton.setAttribute('name', 'buttonRemoveCriterion' + ident);
    self.removeButton.setAttribute('value', 'Remove');
    self.removeButton.onclick = function(evt) {
    	self.parent.removeCriterion(self);
    };
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
