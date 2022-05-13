(function executeRule(current, previous /*null when async*/) {
	
	var workNote = current.work_notes.getJournalEntry(1);
	var regEx = new RegExp('\\n');
	var lineBreakIndex = workNote.search(regEx);
	var parsedNotes = lineBreakIndex > 0 ? workNote.substring(lineBreakIndex + 1) : workNote;
	
	var ritmGR = new GlideRecord('sc_req_item');
	ritmGR.get(current.request_item.sys_id);
	ritmGR.comments.setJournalEntry(parsedNotes);
	ritmGR.update();
	
})(current, previous);