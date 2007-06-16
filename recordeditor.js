function RecordEditor(tableName, record) {
	this.tableName = tableName;
	this.record = record;
	this.div = dce('div');
	this.getDiv = function() {
		return this.div;
	};
	this.cleanup = function() {
		delete this.div;
		if (this.record) {
			this.record.cleanup();
			delete this.record;
		}
	};
	this.update = function() {
		// nothing to do in abstract superclass
	};
	this._setRecord = function(record) {
		if (bad(this.tableName)) {
			fatal('RecordEditor: Record but no table name');
		}
		if (this.record) {
			this.record.cleanup();
		}
		delete this.record;
		this.record = record;
		this.update();
	};
	this.setRecord = function(record) {
		// showLog('In RecordEditor.setRecord');
		if (bad(record)) {
			fatal('RecordEditor: Bad record');
		}
		if (good(this.record) && this.record.getAttribute('id') == record.getAttribute('id')) {
			return;
		}
		this._setRecord(record);
	};
	this.getField = function(fieldName) {
		if (bad(this.record)) {
			fatal('RecordEditor: No record');
		}
		if (bad(fieldName) || !record.hasAttribute(fieldName)) {
			fatal('RecordEditor: Bad or nonexistent field ' + fieldName);
		}
		return this.record.getAttribute(fieldName);
	};
	if (record) {
		this.setRecord(record);
	}
}
