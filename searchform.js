var num_criteria = 0;
var max_criteria = 20;

var fieldLabels = null;

function makeFieldLabels() {
  if (null != fieldLabels) {
    return;
  }
  fieldLabels = new Array();
  var i;
  for (i = 0; i < fields.length; i++) {
    fieldLabels[i] = ucFirstAll(fields[i].replace(/\./g, ' '));
  }
}

function makeOption(label, value) {
    var option = document.createElement("option");
    option.setAttribute("label", label);
    option.setAttribute("value", value);
    option.appendChild(document.createTextNode(label));
    return option;
}

function addOption(select, optionName, optionValue) {
    select.appendChild(makeOption(optionName, optionValue));
}

function makeSelectOptionIter(name, optionNameIter, optionValueIter) {
    var select = document.createElement("select");
    select.setAttribute("name", name);
    while (optionNameIter.hasMore() && optionValueIter.hasMore()) {
	addOption(select, optionNameIter.getNext(), optionValueIter.getNext());
    }
    return select;
}

function makeSelectOptionArray(name, optionNames, optionValues) {
    var optionNameIter = new ArrayIter(optionNames);
    var optionValueIter = new ArrayIter(optionValues);
    return makeSelectOptionIter(name, optionNameIter, optionValueIter);
}

function makeCriterion(num) {
    var criterion_div = document.createElement("div");
    criterion_div.setAttribute("id", "criterion" + num);
    // criterion_div.style.visible = false;
    criterion_div.appendChild(makeSelectOptionArray("field" + num, fieldLabels, fields));
    criterion_div.appendChild(makeSelectOptionArray("operation" + num, operations, operations));
    var text_field = document.createElement("input");
    text_field.setAttribute("name", "value" + num);
    text_field.setAttribute("type", "text");
    criterion_div.appendChild(text_field);
    return criterion_div;
}

function addCriterion() {
    if (num_criteria >= max_criteria) {
	return;
    }
    makeFieldLabels();
    var search_form = document.getElementById("searchform");
    search_form.appendChild(makeCriterion(num_criteria));
    num_criteria++;
}

function removeCriterion() {
    if (num_criteria < 1) {
	return;
    }
    var criterion_div = document.getElementById("criterion" + (num_criteria - 1));
    criterion_div.parentNode.removeChild(criterion_div);
    num_criteria--;
}

function receiveFieldForm(args) {
  var field = args[0];
  var table = field.parentNode;
  printMessage('Found field ' + schema.getTableName(table) + '.' + schema.getFieldName(field) + '\n');
}

function receiveTableForm(args) {
  var schema = args[0];
  var table = args[1];
  printMessage('Found table ' + schema.getTableName(table) + '\n');
  fieldArgs = new Array();
  schema.enumFields(table, receiveFieldForm, fieldArgs);
}

var onSchemaFetchedForm = function() {
  // printMessage('Request done');
  var args = new Array();
  args[0] = schema;
  schema.enumTables(receiveTableForm, args);
};

function populateForm() {
  var schema = new DBSchema();
  schema.fetchSchema(onSchemaFetchedForm);
}
