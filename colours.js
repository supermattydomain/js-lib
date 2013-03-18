/**
 * Convert RGB colour to HSV.
 * Based on code found at: http://www.javascripter.net/faq/rgb2hsv.htm
 * @param r Red value, [0..255]
 * @param g Green value, [0..255]
 * @param b Blue value, [0..255]
 * @returns {Array} [ Hue, Saturation, Value ]
 */
function rgb2hsv(r, g, b) {
	var minRGB, maxRGB, d, h, diff;
	r /= 255;
	g /= 255;
	b /= 255;
	minRGB = Math.min(r, Math.min(g, b));
	maxRGB = Math.max(r, Math.max(g, b));
	if (minRGB === maxRGB) {
		return [ 0, 0, minRGB ]; // Achromatic
	}
	// Chromatic
	d = (r === minRGB) ? g - b : ((b === minRGB) ? r - g : b - r);
	h = (r === minRGB) ? 3 : ((b === minRGB) ? 1 : 5);
	diff = maxRGB - minRGB;
	return [ 60 * (h - d / diff), diff / maxRGB, maxRGB ];
}

/**
 * Convert HSV colour to RGB.
 * Based on code found at: http://snipplr.com/view.php?codeview&id=14590
 * Ported from the excellent Java algorithm by Eugene Vishnevsky at:
 * http://www.cs.rit.edu/~ncs/color/t_convert.html
 * @param h Hue, [0..360]
 * @param s Saturation, [0..1]
 * @param v Value, [0..1]
 * @returns {Array} [ Red, Green, Blue ] each in range [0..255]
 */
function hsv2rgb(h, s, v) {
	var r, g, b, i, f, p, q, t;
	// Normalise hue to [0..360]
	h %= 360;
	if (h < 0) {
		h += 360;
	}
	if (s === 0) {
		// Achromatic (grey)
		r = g = b = v;
		return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ];
	}
	h /= 60; // sector 0 to 5
	i = Math.floor(h);
	f = h - i; // Fractional part of h
	p = v * (1 - s);
	q = v * (1 - s * f);
	t = v * (1 - s * (1 - f));
	switch (i) {
	case 0:
		r = v;
		g = t;
		b = p;
		break;
	case 1:
		r = q;
		g = v;
		b = p;
		break;
	case 2:
		r = p;
		g = v;
		b = t;
		break;
	case 3:
		r = p;
		g = q;
		b = v;
		break;
	case 4:
		r = t;
		g = p;
		b = v;
		break;
	case 5:
	default:
		r = v;
		g = p;
		b = q;
		break;
	}
	return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ];
}
