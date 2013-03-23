/**
 * Set a pixel's rgba values in a canvas ImageData object.
 */
function setPixel(imageData, x, y, r, g, b, a) {
	var i = (y * imageData.width * 4) + (x * 4);
	imageData.data[i + 0] = r;
	imageData.data[i + 1] = g;
	imageData.data[i + 2] = b;
	imageData.data[i + 3] = a;
}
