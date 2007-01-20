function AlbumEditor(albumID) {
	this.div = dce('div');
	this.labelName = null;
	this.getDiv = function() {
		return this.div;
	};
	this.cleanup = function() {
		this.div = null;
		this.labelName = null;
	};
	this.getArtist = function() {
		return this.artistName;
	};
	this.setAlbumID = function(albumID) {
		// printMessage('In AlbumEditor.setAlbumID');
		if (this.albumID == albumID) {
			return;
		}
		this.albumID = albumID;
		if (this.labelName) {
			this.labelName.nodeValue = this.albumID;
		} else {
			this.labelName = dctn(this.albumID);
			var heading = dce('p');
			setClass(heading, 'album_name');
			heading.appendChild(this.labelName);
			this.div.appendChild(heading);
		}
	};
	if (albumID) {
		this.setAlbumID(albumID);
	}
}
