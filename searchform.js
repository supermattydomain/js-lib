function SearchForm() {
  this.numCriteria = 0;
  this.maxCriteria = 20;
  this.fieldLabels = null;
  this.searchForm = document.getElementById('searchform');
  var self = this;
  this.makeFieldLabels = function() {
    if (null != this.fieldLabels) {
      return;
    }
    this.fieldLabels = new Array();
    var i;
    for (i = 0; i < fields.length; i++) {
      this.fieldLabels[i] = ucFirstAll(fields[i].replace(/\./g, ' '));
    }
  };
  this.makeOption = function(label, value) {
    var option = document.createElement("option");
    option.setAttribute("label", label);
    option.setAttribute("value", value);
    option.appendChild(document.createTextNode(label));
    return option;
  };
  this.addOption = function(select, optionName, optionValue) {
    select.appendChild(this.makeOption(optionName, optionValue));
  };
  this.makeSelectOptionIter = function(name, optionNameIter, optionValueIter) {
    var select = document.createElement("select");
    select.setAttribute("name", name);
    while (optionNameIter.hasMore() && optionValueIter.hasMore()) {
	this.addOption(select, optionNameIter.getNext(), optionValueIter.getNext());
    }
    return select;
  };
  this.makeSelectOptionArray = function(name, optionNames, optionValues) {
    var optionNameIter = new ArrayIter(optionNames);
    var optionValueIter = new ArrayIter(optionValues);
    return this.makeSelectOptionIter(name, optionNameIter, optionValueIter);
  };
  this.makeCriterion = function(num) {
    var criterionDiv = document.createElement("div");
    criterionDiv.setAttribute("id", "criterion" + num);
    // criterionDiv.style.visible = false;
    criterionDiv.appendChild(this.makeSelectOptionArray("field" + num, this.fieldLabels, fields));
    criterionDiv.appendChild(this.makeSelectOptionArray("operation" + num, operations, operations));
    var text_field = document.createElement("input");
    text_field.setAttribute("name", "value" + num);
    text_field.setAttribute("type", "text");
    criterionDiv.appendChild(text_field);
    return criterionDiv;
  };
  this.addCriterion = function() {
    if (this.numCriteria >= this.maxCriteria) {
	return;
    }
    this.makeFieldLabels();
    this.searchForm.appendChild(this.makeCriterion(this.numCriteria));
    this.numCriteria++;
  };
  this.removeCriterion = function() {
    if (this.numCriteria < 1) {
	return;
    }
    var criterionDiv = document.getElementById("criterion" + (this.numCriteria - 1));
    criterionDiv.parentNode.removeChild(criterionDiv);
    this.numCriteria--;
  };
  this.receiveFieldForm = function(args) {
    var schema = args[0];
    var field = args[1];
    var table = field.parentNode;
    printMessage('Found field ' + schema.getTableName(table) + '.' + schema.getFieldName(field) + '\n');
  };
  this.receiveTableForm = function(args) {
    var schema = args[0];
    var table = args[1];
    printMessage('Found table ' + schema.getTableName(table) + '\n');
    fieldArgs = new Array();
    fieldArgs[0] = schema;
    schema.enumFields(table, self.receiveFieldForm, fieldArgs);
  };
  this.onSchemaFetchedForm = function(schema) {
    // printMessage('Request done');
    var args = new Array();
    args[0] = schema;
    schema.enumTables(self.receiveTableForm, args);
  };
  this.populateForm = function() {
    var schema = new DBSchema();
    schema.fetchSchema(this.onSchemaFetchedForm);
  };
}
