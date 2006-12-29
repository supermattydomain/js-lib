function SearchCriterion(ident, table, operations) {
  var self = this;
  this.ident = ident;
  this.div = null;
  this.fieldSelect = null;
  this.operationSelect = null;
  this.table = table;
  this.operations = operations;
  this.tableName = this.table.getName();
  this.populate = function() {
    // printMessage('populate: table = ' + self.tableName + '\n');
    self.div = document.createElement("div");
    self.div.viewObject = self;
    self.fieldSelect = new FieldSelect('field', self.table);
    self.operationSelect = new MySelectOptionArray('operation', self.operations, self.operations);
    self.valueField = document.createElement("input");
    self.valueField.setAttribute('name', 'value');
    self.valueField.setAttribute('type', 'text');
    self.div.appendChild(self.fieldSelect.getSelect());
    self.div.appendChild(self.operationSelect.getSelect());
    self.div.appendChild(self.valueField);
    // printMessage('done populate: table = ' + self.tableName + '\n');
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
