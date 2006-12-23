function SearchForm() {
  this.numCriteria = 0;
  this.maxCriteria = 20;
  this.fieldLabels = null;
  this.searchForm = document.getElementById('searchform');
  var self = this;
  this.schema = new DBSchema();
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
  this.addOption = function(select, label, value) {
    select.appendChild(this.makeOption(label, value));
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
  this.makeFieldSelectOneTable = function(controlName, table) {
    var select = document.createElement('select');
    select.setAttribute("name", controlName);
    var args = new Array();
    this.schema.enumFields(table, function(myargs) {
      var field = myargs[0];
      // printMessage('Found field ' + self.schema.getTableName(table) + '.' + self.schema.getFieldName(field) + '\n');
      var label = ucFirst(self.schema.getTableName(table)) + ' ' + ucFirst(self.schema.getFieldName(field));
      var value = self.schema.getTableName(table) + '.' + self.schema.getFieldName(field);
      self.addOption(select, label, value);
    }, args);
    return select;
  };
  this.populate = function(schema) {
    var tableNum = 0;
    var args = new Array();
    self.schema.enumTables(function(myargs) {
      var table = myargs[0];
      // printMessage('tables[' + tableNum + '] = ' + schema.getTableName(table) + '\n');
      var select = self.makeFieldSelectOneTable('field' + self.numCriteria, table);
      self.searchForm.appendChild(select);
      tableNum++;
    }, args);
  };
  this.schema.fetchSchema(this.populate);
}
