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
  }
  this.hasMore = function() {
    return (this.iterIndex < this.iterArray.length);
  }
  this.getNext = function() {
    if (this.iterIndex >= this.iterArray.lenth) {
      return null;
    }
    return this.iterArray[this.iterIndex++];
  }
  this.forAll = function(callback, args) {
    arrayForAll(this.iterArray, callback, args);
  }
}
