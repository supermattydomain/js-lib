function ArtistList() {
	// printMessage('In ArtistList constructor');
	this.base = TableBrowser;
	this.base('artist', 'name');
	this.update();
}
ArtistList.prototype = new TableBrowser;
