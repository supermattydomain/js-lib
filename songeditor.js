function SongEditor(record) {
	this.base = RecordEditor;
	this.base(record);
	this.labelName = null;
	this.songEditorCleanup = this.cleanup;
	this.cleanup = function() {
		this.songEditorCleanup();
		delete this.labelName;
	};
	this.update = function() {
		if (bad(this.record)) {
			fatal('SongEditor: No record');
		}
		var title = this.getField('title');
		if (this.labelName) {
			this.labelName.nodeValue = title;
		} else {
			this.labelName = dctn(title);
			var heading = dce('p');
			setClass(heading, 'album_name');
			heading.appendChild(this.labelName);
			this.div.appendChild(heading);
		}
	};
}
SongEditor.prototype = new RecordEditor;
