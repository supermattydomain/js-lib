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

function MySelectOptionIter(controlName, optionNameIter, optionValueIter) {
  this.base = MySelect;
  this.base(controlName);
  this.select.viewObject = this;
  this.addOptionsIter(optionNameIter, optionValueIter);
}
MySelectOptionIter.prototype = new MySelect;

function MySelectOptionArray(controlName, optionNames, optionValues) {
  this.base = MySelect;
  this.base(controlName);
  this.select.viewObject = this;
  this.addOptionsArray(optionNames, optionValues);
}
MySelectOptionArray.prototype = new MySelect;

function FieldSelect(controlName, table) {
  this.table = table;
  this.base = MySelect;
  this.base(controlName);
  this.select.viewObject = this;
  var self = this;
  this.addOptions = function() {
    // printMessage('In FieldSelect.addOptions table=' + this.table.getName());
    var args = new Array();
    this.table.enumFields(function(myargs) {
      var field = myargs[0];
      // printMessage('FieldSelect: found field ' + self.table.getName() + '.' + field.getName() + '\n');
      var label = ucFirst(field.getName());
      var value = self.table.getName() + '.' + field.getName();
      self.addOption(label, value);
    }, args);
  };
  this.addOptions();
}
FieldSelect.prototype = new MySelect;
