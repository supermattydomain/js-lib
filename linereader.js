/**
 * Utilities for reading text a line at a time.
 */

function LineReader(data) {
	this.data = data;
	this.off = 0;
}

$.extend(LineReader.prototype, {
	isAtEOF: function() {
		return this.off > this.data.length;
	},
	hasMoreLines: function() {
		return !this.isAtEOF();
	},
	getNextLine: function() {
		var line, i, len;
		if (this.isAtEOF()) {
			return null;
		}
		i = this.data.indexOf("\n", this.off);
		if (i < 0) {
			// Last line
			len = this.data.length - this.off;
			i = this.data.length;
		} else {
			// Non-last line terminated by EOL sequence
			len = i - this.off;
			if (this.data.charAt(this.off + len - 1) === "\r") {
				len--; // Strip optional CR preceding LF
			}
		}
		line = this.data.substr(this.off, len);
		this.off = i + 1; // Now at start of next line or beyond EOF
		return line;
	}
});
