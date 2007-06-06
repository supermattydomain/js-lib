function ArtistEditor(artistID) {
	this.artistID = artistID;
	this.div = dce('div');
	this.labelName = null;
	this.getDiv = function() {
		return this.div;
	};
	this.cleanup = function() {
		this.div = null;
		this.labelName = null;
	};
	this.getArtistID = function() {
		return this.artistID;
	};
	this.setArtistID = function(artistID) {
		// printMessage('In ArtistEditor.setArtistID');
		if (this.artistID == artistID) {
			return;
		}
		this.artistID = artistID;
		if (this.labelName) {
			this.labelName.nodeValue = this.artistID;
		} else {
			this.labelName = dctn(this.artistID);
			var heading = dce('p');
			setClass(heading, 'artist_name');
			heading.appendChild(this.labelName);
			this.div.appendChild(heading);
		}
	};
	if (artistID) {
		this.setArtist(artistID);
	}
}
