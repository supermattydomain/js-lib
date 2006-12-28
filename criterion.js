function SearchCriterion(num, schema, table, operations) {
  var self = this;
  this.div = null;
  this.criterionNum = num;
  this.fieldSelect = null;
  this.operationSelect = null;
  this.schema = schema;
  this.table = table;
  this.operations = operations;
  this.tableName = this.schema.getTableName(this.table);
  this.populate = function() {
    // printMessage('populate: table = ' + self.tableName + '\n');
    self.div = document.createElement("div");
    self.div.setAttribute("id", "criterion" + self.criterionNum);
    self.fieldSelect = new FieldSelect('field' + self.criterionNum, self.schema, self.table);
    self.operationSelect = new MySelectOptionArray('operation' + self.criterionNum, self.operations, self.operations);
    self.valueField = document.createElement("input");
    self.valueField.setAttribute('name', 'value' + self.criterionNum);
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
    url += this.fieldSelect.getName() + '=' + this.fieldSelect.getValue();
    url += '&' + this.operationSelect.getName() + '=' + this.operationSelect.getValue();
    url += '&' + this.valueField.name + '=' + this.valueField.value;
    return url;
  }
  this.populate();
}
