function interpolateColour(c1, c2, amount) {
	return [
		c1[0] + amount * (c2[0] - c1[0]),
		c1[1] + amount * (c2[1] - c1[1]),
		c1[2] + amount * (c2[2] - c1[2]),
		c1[3] + amount * (c2[3] - c1[3]),
	];
}

/**
 * Downloaded 2012-01-15 from:
 * http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
 *
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the range [0, 255] and
 * returns h, s, and l in the range [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgb2hsl(r, g, b) {
	var max, min, h, s, l, d;
    r /= 255;
    g /= 255;
    b /= 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        d = max - min;
        s = (l > 0.5) ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
            	h = (g - b) / d + ((g < b) ? 6 : 0);
            	break;
            case g:
            	h = (b - r) / d + 2;
            	break;
            default:
            case b:
            	h = (r - g) / d + 4;
            	break;
        }
        h /= 6;
    }

    return [h, s, l];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the range [0, 1] and
 * returns r, g, and b in the range [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hsl2rgb(h, s, l) {
    var r, g, b, p, q;

    if (s === 0) {
    	q = l; // Silence bogus Eclipse warning.
    	p = q; // Seems like a bug in its flow control
        r = p; // analysis.
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(pp, qq, t) {
            if (t < 0) {
            	t += 1;
            }
            if (t > 1) {
            	t -= 1;
            }
            if (t < 1/6) {
            	return pp + (qq - pp) * 6 * t;
            }
            if (t < 1/2) {
            	return qq;
            }
            if (t < 2/3) {
            	return pp + (qq - pp) * (2/3 - t) * 6;
            }
            return pp;
        }

        q = (l < 0.5) ? l * (1 + s) : l + s - l * s;
        p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the range [0, 255] and
 * returns h, s, and v in the range [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
function rgb2hsv(r, g, b) {
	var h, s, v, max, min, d;
    r = r / 255;
    g = g / 255;
    b = b / 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    v = max;

    d = max - min;
    s = (max === 0) ? 0 : d / max;

    if (max === min) {
        h = 0; // achromatic
    } else {
        switch(max) {
            case r:
            	h = (g - b) / d + (g < b ? 6 : 0);
            	break;
            case g:
            	h = (b - r) / d + 2;
            	break;
            case b:
            default:
            	h = (r - g) / d + 4;
            	break;
        }
        h /= 6;
    }

    return [h, s, v];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the range [0, 1] and
 * returns r, g, and b in the range [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsv2rgb(h, s, v) {
    var r, g, b, i, f, p, q, t;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch(i % 6) {
        case 0:
        	r = v, g = t, b = p;
        	break;
        case 1:
        	r = q, g = v, b = p;
        	break;
        case 2:
        	r = p, g = v, b = t;
        	break;
        case 3:
        	r = p, g = q, b = v;
        	break;
        case 4:
        	r = t, g = p, b = v;
        	break;
        case 5:
        default:
        	r = v, g = p, b = q;
        	break;
    }

    return [r * 255, g * 255, b * 255];
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
RGBColour.prototype.toHSL = function() {
	var hsl = rgb2hsl(this.r, this.g, this.b);
	return new HSLColour(hsl[0], hsl[1], hsl[2]);
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
RGBAColour.prototype.toHSLA = function() {
	var hsl = rgb2hsl(this.r, this.g, this.b);
	return new HSLAColour(hsl[0], hsl[1], hsl[2], this.a);
};

function HSBColour(h, s, b) {
	this.h = h || 0;
	this.s = s || 0;
	this.b = b || 0;
}
var HSVColour = HSBColour;

HSBColour.prototype = new Colour();
HSBColour.prototype.toRGB = function() {
	var rgb = hsv2rgb(this.h, this.s, this.b);
	return new RGBColour(rgb[0], rgb[1], rgb[2]);
};

function HSBAColour(h, s, b, a) {
	HSBColour.call(this, h, s, b);
	this.a = a || 0;
}
var HSVAColour = HSBAColour;

HSBAColour.prototype = new HSBColour();
HSBAColour.prototype.toRGBA = function() {
	var rgb = hsv2rgb(this.h, this.s, this.b);
	return new RGBAColour(rgb[0], rgb[1], rgb[2], this.a);
};

function HSLColour(h, s, l) {
	this.h = h || 0;
	this.s = s || 0;
	this.l = l || 0;
}

function HSLAColour(h, s, l) {
	HSLColour.call(this, h, s, l);
	this.a = a || 0;
}
