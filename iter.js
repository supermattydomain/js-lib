function arrayForAll(array, elementCallback, args) {
  // printMessage('arrayForAll(' + array.toString() + ', ' + args.toString() + ')');
  var i;
  for (i = 0; i < array.length; i++) {
    args.push(array[i]);
    elementCallback(args);
    args.pop();
  }
}

function ArrayIter(array) {
  this.iterArray = array;
  this.iterIndex = 0;
  this.getCount = function() {
    return this.iterArray.length;
  };
  this.hasMore = function() {
    return (this.iterIndex < this.iterArray.length);
  };
  this.getNext = function() {
    if (this.iterIndex >= this.iterArray.length) {
      return null;
    }
    return this.iterArray[this.iterIndex++];
  };
  this.forAll = function(callback, args) {
    arrayForAll(this.iterArray, callback, args);
  };
  this.getIndex = function() {
    return this.iterIndex;
  };
}

function ChildIter(node) {
  this.iterNode = node;
  this.currentChild = null;
  this.iterIndex = 0;
  this.getCount = function() {
    if (this.iterNode.hasChildNodes()) {
      return this.iterNode.childNodes.length;
    } else {
      return 0;
    }
  };
  this.hasMore = function() {
    return (this.currentChild && this.currentChild.nextSibling);
  };
  this.getNext = function() {
    var ret = this.currentChild;
    if (this.currentChild) {
      this.currentChild = this.currentChild.nextSibling;
      this.iterIndex++;
    }
    return ret;
  };
  this.forAll = function(callback, args) {
    printMessage('in ChildIter.forAll');
    arrayForAll(this.iterNode.childNodes, callback, args);
  };
  this.getIndex = function() {
    return this.iterIndex;
  };
}

function AttributeIter(node) {
  this.iterNode = node;
  this.base = ArrayIter;
  this.base(this.iterNode.attributes);
  printMessage('In AttributeIter: this.base=' + this.base);
}
AttributeIter.prototype = new ArrayIter;

function FieldNameIter(recSet, rec) {
  this.recSet = recSet;
  this.rec = rec;
  this.base = ChildIter;
  this.base(this.rec);
  printMessage('in FieldNameIter: this.base=' + this.base);
  printMessage('in FieldNameIter: this.base.forAll=' + this.base.forAll);
  this.getNext = function() {
    printMessage('in FieldNameIter.getNext');
    var next = this.base.getNext();
    if (next) {
      return this.recSet.getFieldName(next);
    }
    return next;
  };
  this.forAll = function(callback, args) {
    printMessage('in FieldNameIter.forAll: this.base.forAll=' + this.base.forAll);
    this.base.forAll(function(myargs) {
      var field = myargs.pop();
      myargs.push(this.recSet.getFieldName(field));
      callback(myargs);
    }, args);
  };
}
FieldNameIter.prototype = new ChildIter;
