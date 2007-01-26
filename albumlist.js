function AlbumList(artistID) {
	// printMessage('In AlbumList constructor');
	this.artistID = artistID;
	this.base = TableBrowser;
	this.base('album', 'name');
	this.setArtistID = function(artistID) {
		if (bad(artistID)) {
			fatal('AlbumList: Bad artist ID');
		}
		this.artistID = artistID;
		this.update();
	};
	this.albumListDescribeQuery = this.describeQuery;
	this.describeQuery = function() {
		var ret = this.albumListDescribeQuery();
		if (this.artistID) {
			ret += ' for selected artist';
		}
		return ret;
	};
	this.albumListGetConstraints = this.getConstraints;
	this.getConstraints = function() {
		var ret = this.albumListGetConstraints();
		if (this.artistID) {
			ret.push(new Constraint(1, 'album.artist', 'is equal to', this.artistID));
		}
		return ret;
	};
	this.update();
}
AlbumList.prototype = new TableBrowser;
