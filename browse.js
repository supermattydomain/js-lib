var songView;
try {
	songView = new SongList();
} catch (e) {
	songView = null;
}
if (!songView) {
	showLog('Failed to create song list widget');
}

var songDetails;
try {
	songDetails = new SongEditor();
} catch (e) {
	songDetails = null;
}
if (!songDetails) {
	showLog('Failed to create song details widget');
}

var albumView;
try {
	albumView = new AlbumList();
} catch (e) {
	albumView = null;
}
if (!albumView) {
	showLog('Failed to create album list widget');
}

var albumDetails;
try {
	albumDetails = new AlbumEditor();
} catch (e) {
	albumDetails = null;
}
if (!albumDetails) {
	showLog('Failed to create album details widget');
}

var artistView;
try {
	artistView = new ArtistList();
} catch (e) {
	artistView = null;
}
if (!artistView) {
	showLog('Failed to create artist list widget');
}

var artistDetails;
try {
	artistDetails = new ArtistEditor();
} catch (e) {
	artistDetails = null;
}
if (!artistDetails) {
	showLog('Failed to create artist details widget');
}

function showAlbum(albumID) {
	// showLog('In showAlbum(' + albumID + ')');
	if (albumDetails) {
		albumDetails.setAlbumID(albumID);
	}
	if (songView) {
		songView.setAlbumID(albumID);
	}
}

function showArtist(artistID) {
	// showLog('In showArtist(' + artistID + ')');
	if (artistDetails) {
		artistDetails.setArtistID(artistID);
	}
	if (albumView) {
		albumView.setArtistID(artistID);
	}
}

function cleanupBrowsePage() {
	if (artistDetails) {
		artistDetails.cleanup()
		artistDetails = null;
	}
	if (artistView) {
		artistView.cleanup()
		artistView = null;
	}
}

var artistsDiv = document.getElementById('artistsdiv');
if (artistView) {
	artistsDiv.appendChild(artistView.getDiv());
}
if (artistDetails) {
	artistsDiv.appendChild(artistDetails.getDiv());
}

var albumsDiv = document.getElementById('albumsdiv');
if (albumView) {
	albumsDiv.appendChild(albumView.getDiv());
}
if (albumDetails) {
	albumsDiv.appendChild(albumDetails.getDiv());
}

var songsDiv = document.getElementById('songsdiv');
if (songView) {
	songsDiv.appendChild(songView.getDiv());
}
if (songDetails) {
	songsDiv.appendChild(songDetails.getDiv());
}
