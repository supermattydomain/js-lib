Array.prototype.equalsDeep = function(arr) {
	var i;
	if (this.length !== arr.length) {
		return false; // Lengths differ
	}
	for (i = 0; i < this.length; i++) {
		if (typeof(this[i]) === "array") {
			if (!this[i].equalsDeep(arr[i])) {
				return false; // Nested arrays differ
			}
		} else if (this[i] !== arr[i]) {
			return false; // Non-array elements differ
		}
		// Examine next pair of elements
	}
	return true; // Identical
};
