/**
 * Trigger a download of an SVG element as a bitmap image.
 */
function downloadSVGAsPNG(sourceSVG, anchorElement) {
	var svgText, svgSize, canvas, ctx, img;
	svgSize = svg.getBoundingClientRect();
	/* Prevent blank image in Firefox */
	sourceSVG.attr({ width: svgSize.width + 'px', height: svgSize.height + 'px' });
	svgText = (new XMLSerializer()).serializeToString(sourceSVG[0]);
	canvas = $('<canvas>');
	canvas.attr({ width: svgSize.width, height: svgSize.height });
	ctx = canvas[0].getContext('2d');
	img = new Image();
	img.onload = function() {
		ctx.drawImage(img, 0, 0);
		anchorElement.attr('href', canvas[0].toDataURL("image/png"));
		anchorElement[0].click();
	};
	img.setAttribute('src', "data:image/svg+xml;base64," + btoa(svgText));
}
