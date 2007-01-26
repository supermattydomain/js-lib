function SongList(albumID) {
	// printMessage('In SongList constructor');
	this.albumID = albumID;
	this.base = TableBrowser;
	this.base('song', 'name');
	this.setAlbumId = function(albumID) {
		if (bad(albumID)) {
			fatal('SongList: Bad album ID');
		}
		this.albumID = albumID;
		this.update();
	};
	this.songListDescribeQuery = this.describeQuery;
	this.describeQuery = function() {
		var ret = this.songListDescribeQuery();
		if (this.albumID) {
			ret += ' for album ' + this.albumID;
		}
		return ret;
	};
	this.songListGetConstraints = this.getConstraints;
	this.getConstraints = function() {
		var ret = this.songListGetConstraints();
		if (this.albumID) {
			ret.push(new Constraint(1, 'song.album', 'is equal to', albumID));
		}
		return ret;
	};
	this.update();
}
SongList.prototype = new TableBrowser;
