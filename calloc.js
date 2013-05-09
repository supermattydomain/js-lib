function calloc(len, type) {
	var i, ret = [];
	for (i = 0; i < len; i++) {
		ret[i] = new type();
	}
	return ret;
}

function calloc_var(len) {
	var i, ret = [];
	for (i = 0; i < len; i++) {
		ret[i] = 0;
	}
	return ret;
}
