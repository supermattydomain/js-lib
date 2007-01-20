function AlphaIndex(callback) {
	this.callback = callback;
	this.div = dce('div');
	var self = this;
	this.getDiv = function() {
		return this.div;
	};
	this.cleanup = function() {
		this.div = null;
	};
	this.makeLink = function(letter) {
		var a = dce('a');
		a.setAttribute('href', 'javascript:');
		a.onclick = function(evt) {
			try {
				self.callback(letter);
			} catch (e) {
			}
			return true;
		};
		a.appendChild(dctn(letter));
		return a;
	};
	this.addLinks = function() {
		var i;
		for (i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
			var c = String.fromCharCode(i);
			var link = this.makeLink(c);
			this.div.appendChild(link);
		}
	};
	this.addLinks();
}
