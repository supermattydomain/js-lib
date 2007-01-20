function AlbumList(artistID) {
	// printMessage('In AlbumList constructor');
	this.base = TableBrowser;
	var tables = new Array('album', 'album')
	var fields = new Array('artist', 'name');
	var operations = new Array('is equal to', 'begins with');
	var values = new Array(artistID, 'a');
	this.base(tables, fields, operations, values);
	this.setArtistID = function(artistID) {
		this.setValue(artistID);
	};
}
AlbumList.prototype = new TableBrowser;
