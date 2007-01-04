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
  this.reset = function() {
    this.iterIndex = 0;
  };
}

function ChildIter(node) {
  this.iterNode = node;
  if (this.iterNode) {
    this.currentChild = node.firstChild;
  } else {
    this.currentChild = null;
  }
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
    arrayForAll(this.iterNode.childNodes, callback, args);
  };
  this.getIndex = function() {
    return this.iterIndex;
  };
  this.reset = function() {
    this.currentChild = this.iterNode.firstChild;
    this.iterIndex = 0;
  };
}

function AttributeIter(node) {
  this.iterNode = node;
  this.base = ArrayIter;
  if (node) {
    this.base(this.iterNode.attributes);
  }
}
AttributeIter.prototype = new ArrayIter;

function AttributeNameIter(rec) {
  this.rec = rec;
  this.base = AttributeIter;
  this.base(this.rec);
  this.AttributeNameIterGetNext = this.getNext;
  this.getNext = function() {
    var next = this.AttributeNameIterGetNext();
    if (next) {
      return next.name;
    }
    return next;
  };
  this.AttributeNameIterForAll = this.forAll;
  this.forAll = function(callback, args) {
    this.AttributeNameIterForAll(function(myargs) {
      var attr = myargs.pop();
      var name = attr.name;
      myargs.push(name);
      callback(myargs);
    }, args);
  };
}
AttributeNameIter.prototype = new AttributeIter;

function AttributeValueIter(rec) {
  this.rec = rec;
  this.base = AttributeIter;
  this.base(this.rec);
  this.AttributeValueIterGetNext = this.getNext;
  this.getNext = function() {
    var next = this.AttributeValueIterGetNext();
    if (next) {
      return next.value;
    }
    return next;
  };
  this.AttributeValueIterForAll = this.forAll;
  this.forAll = function(callback, args) {
    this.AttributeValueIterForAll(function(myargs) {
      var attr = myargs.pop();
      var value = attr.value;
      myargs.push(value);
      callback(myargs);
    }, args);
  };
}
AttributeValueIter.prototype = new AttributeIter;
