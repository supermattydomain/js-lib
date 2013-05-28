function arrayEqualsDeep(arr1, arr2) {
	var i;
	if (arr1.length !== arr2.length) {
		return false; // Lengths differ
	}
	for (i = 0; i < arr1.length; i++) {
		if (typeof(arr1[i]) === "array") {
			if (typeof(arr2[i]) !== "array") {
				return false; // Nested array and non-array differ
			}
			// Recurse
			if (!arrayEqualsDeep(arr1[i], arr2[i])) {
				return false; // Nested arrays differ
			}
		} else if (arr1[i] !== arr2[i]) {
			return false; // Non-array elements differ
		}
		// Examine next pair of elements
	}
	return true; // Identical
};
