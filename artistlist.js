function ArtistList() {
	// printMessage('In ArtistList constructor');
	this.base = TableBrowser;
	this.base(new Array('artist'), new Array('name'), new Array('begins with'), new Array('a'));
	this.setFirstChar = function(firstChar) {
		this.setValue(firstChar);
	};
}
ArtistList.prototype = new TableBrowser;
