function MyOption(name, value) {
  this.name = name;
  this.value = value;
  this.option = document.createElement('option');
  this.option.viewObject = this;
  this.option.setAttribute('label', this.name);
  this.option.setAttribute('value', this.value);
  this.option.appendChild(document.createTextNode(this.name));
  this.getOption = function() {
    return this.option;
  };
}

function MySelect(controlName) {
  this.select = document.createElement('select');
  this.select.viewObject - this;
  this.select.setAttribute('name', controlName);
  this.getSelect = function() {
    return this.select;
  };
  this.addOption = function(name, value) {
    var option = new MyOption(name, value);
    this.select.appendChild(option.getOption());
  };
  this.addOptionsIter = function(nameIter, valueIter) {
    while (nameIter.hasMore() && valueIter.hasMore()) {
	this.addOption(nameIter.getNext(), valueIter.getNext());
    }
  };
  this.addOptionsArray = function(nameArray, valueArray) {
    this.addOptionsIter(new ArrayIter(nameArray), new ArrayIter(valueArray));
  };
  this.getName = function() {
    return this.select.name;
  };
  this.getValue = function() {
    return this.select.value;
  };
}

function FieldSelect(controlName, schema, table) {
  this.schema = schema;
  this.table = table;
  this.base = MySelect;
  this.base(controlName);
  var self = this;
  this.addOptions = function(schema, table) {
    // printMessage('In FieldSelect.addOptions');
    var args = new Array();
    args[0] = schema;
    args[1] = table;
    schema.enumFields(table, function(myargs) {
      var schema = myargs[0];
      var table = myargs[1];
      var field = myargs[2];
      // printMessage('FieldSelect: found field ' + schema.getTableName(table) + '.' + schema.getFieldName(field) + '\n');
      var label = ucFirst(schema.getFieldName(field));
      var value = schema.getTableName(table) + '.' + schema.getFieldName(field);
      self.addOption(label, value);
    }, args);
  };
  this.addOptions(this.schema, this.table);
}
FieldSelect.prototype = new MySelect;
