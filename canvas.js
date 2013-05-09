/**
 * Set a pixel's rgba values in a canvas ImageData object.
 */
function setPixel(imageData, x, y, r, g, b, a) {
	var i = 4 * (y * imageData.width + x);
	imageData.data[i + 0] = r;
	imageData.data[i + 1] = g;
	imageData.data[i + 2] = b;
	imageData.data[i + 3] = a;
}

function getPixel(imageData, x, y) {
	var i = 4 * (y * imageData.width + x);
	return [
		imageData.data[i + 0], imageData.data[i + 1],
		imageData.data[i + 2], imageData.data[i + 3]
	];
}
