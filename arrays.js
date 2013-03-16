Array.prototype.equalsDeep = function(arr) {
	var i;
	if (this.length !== arr.length) {
		return false;
	}
	for (i = 0; i < this.length; i++) {
		if (typeof(this[i]) !== typeof(arr[i])) {
			return false;
		} else if (typeof(this[i]) === "array") {
			if (!this[i].equalsDeep(arr[i])) {
				return false;
			}
		} else if (this[i] !== arr[i]) {
			return false;
		}
	}
	return true;
};
