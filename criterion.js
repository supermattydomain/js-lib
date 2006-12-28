function makeOption(label, value) {
  var option = document.createElement("option");
  option.setAttribute("label", label);
  option.setAttribute("value", value);
  option.appendChild(document.createTextNode(label));
  return option;
};

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
  this.makeSelectOptionIter = function(name, optionNameIter, optionValueIter) {
    var select = new MySelect(name);
    select.addOptionsIter(optionNameIter, optionValueIter);
    return select.getSelect();
  };
  this.makeSelectOptionArray = function(name, optionNames, optionValues) {
    var select = new MySelect(name);
    select.addOptionsArray(optionNames, optionValues);
    return select.getSelect();
  };
  this.makeFieldSelectOneTable = function(controlName, schema, table) {
    var select = new FieldSelect(controlName, schema, table);
    return select.getSelect();
  };
  this.populate = function() {
    // printMessage('populate: table = ' + self.tableName + '\n');
    self.div = document.createElement("div");
    self.div.setAttribute("id", "criterion" + self.criterionNum);
    self.fieldSelect = new FieldSelect('field' + self.criterionNum, self.schema, self.table);
    self.operationSelect = self.makeSelectOptionArray('operation' + self.criterionNum, self.operations, self.operations);
    self.valueField = document.createElement("input");
    self.valueField.setAttribute('name', 'value' + self.criterionNum);
    self.valueField.setAttribute('type', 'text');
    self.div.appendChild(self.fieldSelect.getSelect());
    self.div.appendChild(self.operationSelect);
    self.div.appendChild(self.valueField);
    // printMessage('done populate: table = ' + self.tableName + '\n');
  };
  this.getDiv = function() {
    return this.div;
  };
  this.getURL = function() {
    var url = '';
    url += this.fieldSelect.getName() + '=' + this.fieldSelect.getValue();
    url += '&' + this.operationSelect.name + '=' + this.operationSelect.value;
    url += '&' + this.valueField.name + '=' + this.valueField.value;
    return url;
  }
  this.populate();
}
