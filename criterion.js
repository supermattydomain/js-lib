function makeOption(label, value) {
  var option = document.createElement("option");
  option.setAttribute("label", label);
  option.setAttribute("value", value);
  option.appendChild(document.createTextNode(label));
  return option;
};

function SearchCriterion(num, fieldLabels, fields, operations) {
  this.init = function() {
    this.div = document.createElement("div");
    this.div.setAttribute("id", "criterion" + num);
    // this.div.style.visible = false;
    this.div.appendChild(this.makeSelectOptionArray("field" + num, fieldLabels, fields));
    this.div.appendChild(this.makeSelectOptionArray("operation" + num, operations, operations));
    var text_field = document.createElement("input");
    text_field.setAttribute("name", "value" + num);
    text_field.setAttribute("type", "text");
    this.div.appendChild(text_field);
  }
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
  this.getDiv = function() {
    return this.div;
  };
  this.init();
}
