function AlbumList(artistID) {
	// showLog('In AlbumList constructor');
	this.artistID = artistID;
	this.base = TableBrowser;
	this.base('album', 'name', new Array('album.id', 'album.name', 'album.year'));
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
			ret += ' for artist ' + this.artistID;
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
	this.albumListUpdate = this.update;
	this.update = function() {
		if (!this.artistID) {
			return;
		}
		this.albumListUpdate();
	};
	this.update();
}
AlbumList.prototype = new TableBrowser;
