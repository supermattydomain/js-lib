function SongList(albumID) {
	// printMessage('In SongList constructor');
	this.base = TableBrowser;
	this.base(new Array('song'), new Array('album'), new Array('is equal to'), new Array(albumID));
	this.setAlbumId = function(albumID) {
		this.setValue(albumID);
	};
}
SongList.prototype = new TableBrowser;
