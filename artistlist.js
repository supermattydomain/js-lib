function ArtistList() {
	// showLog('In ArtistList constructor');
	this.base = TableBrowser;
	this.base('artist', 'name', new Array('artist.id', 'artist.name'));
	this.update();
}
ArtistList.prototype = new TableBrowser;
