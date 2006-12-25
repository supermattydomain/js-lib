function makeOption(label, value) {
  var option = document.createElement("option");
  option.setAttribute("label", label);
  option.setAttribute("value", value);
  option.appendChild(document.createTextNode(label));
  return option;
};

function SearchCriterion(num, fields, operations) {
  var self = this;
  this.criterionNum = num;
  this.init = function() {
    this.div = document.createElement("div");
    this.div.setAttribute("id", "criterion" + num);
    // this.div.style.visible = false;
    this.div.appendChild(this.makeSelectOptionArray("field" + num, fields, fields));
    this.div.appendChild(this.makeSelectOptionArray("operation" + num, operations, operations));
    var text_field = document.createElement("input");
    text_field.setAttribute("name", "value" + num);
    text_field.setAttribute("type", "text");
    this.div.appendChild(text_field);
  }
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
  this.populate = function(schema, args) {
    var tableNum = 0;
    var args = new Array();
    schema.enumTables(function(myargs) {
      var table = myargs[0];
      if ('vall' != table) {
	return;
      }
      // printMessage('tables[' + tableNum + '] = ' + schema.getTableName(table) + '\n');
      var fieldSelect = self.makeFieldSelectOneTable('field' + self.criterionNum, schema, table);
      var operationSelect = self.makeSelectOptionArray('operation' + self.criterionNum, self.operations, operations);
      self.div.appendChild(fieldSelect);
      tableNum++;
    }, args);
  };
  this.getDiv = function() {
    return this.div;
  };
  this.init();
}
