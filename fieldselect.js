function MyOption(className, controlName, value) {
  this.option = dce('option');
  this.option.viewObject = this;
  this.option.setAttribute('label', controlName);
  this.option.setAttribute('value', value);
  setClass(this.option, className);
  this.option.appendChild(dctn(controlName));
  this.getOption = function() {
    return this.option;
  };
}

function MySelect(className, controlName) {
  this.className = className;
  this.select = dce('select');
  this.select.viewObject - this;
  this.select.setAttribute('name', controlName);
  setClass(this.select, this.className);
  this.getSelect = function() {
    return this.select;
  };
  this.addOption = function(controlName, controlValue) {
    var option = new MyOption(this.className, controlName, controlValue);
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

function MySelectOptionIter(className, controlName, optionNameIter, optionValueIter) {
  this.base = MySelect;
  this.base(className, controlName);
  this.select.viewObject = this;
  this.addOptionsIter(optionNameIter, optionValueIter);
}
MySelectOptionIter.prototype = new MySelect;

function MySelectOptionArray(className, controlName, optionNames, optionValues) {
  this.base = MySelect;
  this.base(className, controlName);
  this.select.viewObject = this;
  this.addOptionsArray(optionNames, optionValues);
}
MySelectOptionArray.prototype = new MySelect;

function FieldSelect(className, controlName, table) {
  this.table = table;
  this.base = MySelect;
  this.base(className, controlName);
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
