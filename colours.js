function interpolateColour(c1, c2, amount) {
	return [
		c1[0] + amount * (c2[0] - c1[0]),
		c1[1] + amount * (c2[1] - c1[1]),
		c1[2] + amount * (c2[2] - c1[2]),
		c1[3] + amount * (c2[3] - c1[3]),
	];
}

/**
 * Convert RGB colour to HSV.
 * Based on code found at: http://www.javascripter.net/faq/rgb2hsv.htm
 * @param r Red value, [0..255]
 * @param g Green value, [0..255]
 * @param b Blue value, [0..255]
 * @returns {Array} [ Hue [0..360], Saturation [0..1], Value [0..1] ]
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
 * @returns {Array} [ Red [0..255], Green [0..255], Blue [0..255] ]
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

function Colour() {
}

function RGBColour(r, g, b) {
	this.r = r || 0;
	this.g = g || 0;
	this.b = b || 0;
}

RGBColour.prototype = new Colour();
RGBColour.prototype.toHSB = RGBColour.prototype.toHSV = function() {
	var hsv = rgb2hsv(this.r, this.g, this.b);
	return new HSBColour(hsv[0], hsv[1], hsv[2]);
};

function RGBAColour(r, g, b, a) {
	RGBColour.call(this, r, g, b);
	this.a = a || 0;
}

RGBAColour.prototype = new RGBColour();
RGBAColour.prototype.toHSBA = RGBAColour.prototype.toHSVA = function() {
	var hsv = rgb2hsv(this.r, this.g, this.b);
	return new HSBAColour(hsv[0], hsv[1], hsv[2], this.a);
};

function HSBColour(h, s, b) {
	this.h = h || 0;
	this.s = s || 0;
	this.b = b || 0;
}

HSBColour.prototype = new Colour();
HSBColour.prototype.toRGB = function() {
	var rgb = hsv2rgb(this.h, this.s, this.b);
	return new RGBColour(rgb[0], rgb[1], rgb[2]);
};

function HSBAColour(h, s, b, a) {
	HSBColour.call(this, h, s, b);
	this.a = a || 0;
}

HSBAColour.prototype = new HSBColour();
HSBAColour.prototype.toRGBA = function() {
	var rgb = hsv2rgb(this.h, this.s, this.b);
	return new RGBAColour(rgb[0], rgb[1], rgb[2], this.a);
};

var HSVColour = HSBColour;
var HSVAColour = HSBAColour;
