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
    var select = document.createElement("select");
    select.setAttribute("name", name);
    while (optionNameIter.hasMore() && optionValueIter.hasMore()) {
	select.appendChild(makeOption(optionNameIter.getNext(), optionValueIter.getNext()));
    }
    return select;
  };
  this.makeSelectOptionArray = function(name, optionNames, optionValues) {
    var optionNameIter = new ArrayIter(optionNames);
    var optionValueIter = new ArrayIter(optionValues);
    return this.makeSelectOptionIter(name, optionNameIter, optionValueIter);
  };
  this.makeFieldSelectOneTable = function(controlName, schema, table) {
    var select = document.createElement('select');
    select.setAttribute("name", controlName);
    var args = new Array();
    schema.enumFields(table, function(myargs) {
      var field = myargs[0];
      // printMessage('Found field ' + schema.getTableName(table) + '.' + schema.getFieldName(field) + '\n');
      var label = ucFirst(schema.getTableName(table)) + ' ' + ucFirst(schema.getFieldName(field));
      var value = schema.getTableName(table) + '.' + schema.getFieldName(field);
      select.appendChild(makeOption(label, value));
    }, args);
    return select;
  };
  this.populate = function() {
    // printMessage('populate: table = ' + self.tableName + '\n');
    self.div = document.createElement("div");
    self.div.setAttribute("id", "criterion" + self.criterionNum);
    self.fieldSelect = self.makeFieldSelectOneTable('field' + self.criterionNum, self.schema, self.table);
    self.operationSelect = self.makeSelectOptionArray('operation' + self.criterionNum, self.operations, self.operations);
    self.valueField = document.createElement("input");
    self.valueField.setAttribute('name', 'value' + self.criterionNum);
    self.valueField.setAttribute('type', 'text');
    self.div.appendChild(self.fieldSelect);
    self.div.appendChild(self.operationSelect);
    self.div.appendChild(self.valueField);
    // printMessage('done populate: table = ' + self.tableName + '\n');
  };
  this.getDiv = function() {
    return this.div;
  };
  this.getURL = function() {
    var url = '';
    url += this.fieldSelect.name + '=' + this.fieldSelect.value;
    url += '&' + this.operationSelect.name + '=' + this.operationSelect.value;
    url += '&' + this.valueField.name + '=' + this.valueField.value;
    return url;
  }
  this.populate();
}
