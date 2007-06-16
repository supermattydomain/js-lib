function MyOption(className, controlName, value) {
  this.option = dce('option');
  this.prototype = this.option;
  sa(this.option, 'label', controlName);
  sa(this.option, 'value', value);
  setClass(this.option, className);
  this.option.appendChild(dctn(controlName));
  this.getOption = function() {
    return this.prototype;
  };
  this.cleanup = function() {
	this.option = null;
  };
}

function MySelect(className, controlName) {
  this.className = className;
  this.select = dce('select');
  this.prototype = this.select;
  sa(this.select, 'name', controlName);
  setClass(this.select, this.className);
  this.getSelect = function() {
    return this.select;
  };
  this.addOption = function(controlName, controlValue) {
    var newOption = new MyOption(this.className, controlName, controlValue);
    var i;
    for (i = 0; i < this.select.childNodes.length; i++) {
    	var option = this.select.childNodes[i];
    	if (option.value > newOption.getOption().value) {
	    	this.select.insertBefore(newOption.getOption(), option);
    		return;
    	}
    }
    this.select.appendChild(newOption.getOption());
  };
  this.addOptionsIter = function(nameIter, valueIter) {
    while (nameIter.hasMore() && valueIter.hasMore()) {
	this.addOption(nameIter.getNext(), valueIter.getNext());
    }
    this.select.selectedIndex = 0;
    this.select.options[0].selected = true;
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
  this.cleanup = function() {
  	if (!this.select) {
  		return;
  	}
    var i;
    for (i = 0; i < this.select.options.length; i++) {
	if (this.select.options[i].viewObject) {
	    	this.select.options[i].viewObject.cleanup();
	}
    	this.select.options[i] = null;
    }
  	this.select = null;
  };
}
MySelect.prototype = dce('p');

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
    // showLog('In FieldSelect.addOptions table=' + this.table.getName());
    var args = new Array();
    this.table.enumFields(function(myargs) {
      var field = myargs[0];
      // showLog('FieldSelect: found field ' + self.table.getName() + '.' + field.getName() + '\n');
      var label = ucFirst(field.getName());
      var value = self.table.getName() + '.' + field.getName();
      self.addOption(label, value);
    }, args);
  };
  this.fieldSelectCleanup = this.cleanup;
  this.cleanup = function() {
  	this.fieldSelectCleanup();
  	this.table = null;
  };
  this.addOptions();
}
FieldSelect.prototype = new MySelect;

function TableFieldSelect(className, controlName, schema) {
  this.schema = schema;
  this.base = MySelect;
  this.base(className, controlName);
  this.select.viewObject = this;
  var self = this;
  this.addOptions = function() {
    // showLog('In TableFieldSelect.addOptions');
    var tableArgs = new Array();
    this.schema.enumTables(
      function(tableArgs) {
    	var table = tableArgs[0];
        var fieldArgs = new Array();
        table.enumFields(
          function(fieldArgs) {
            var field = fieldArgs[0];
            // showLog('FieldSelect: found field ' + self.table.getName() + '.' + field.getName() + '\n');
            var label = ucFirst(table.getName()) + ' ' + ucFirst(field.getName());
            var value = table.getName() + '.' + field.getName();
            self.addOption(label, value);
          },
          fieldArgs
        );
      },
      tableArgs
    );
  };
  this.tableFieldSelectCleanup = this.cleanup;
  this.cleanup = function() {
    this.tableFieldSelectCleanup();
    this.schema = null;
  };
  this.addOptions();
}
TableFieldSelect.prototype = new MySelect;
