function invokePromptCallBack(source) {
	var gm = GlideModal.get();
	var type = typeof (source) === 'string' ? 'cancel' : 'ok';
	var pref = (type === 'ok') ? 'onPromptComplete' : 'onPromptCancel';
	var textArea = $('asset_pending_repair_issue_text');
	if (!textArea) {
		gm.destroy();
		return false;
	}
	var f = gm.getPreference(pref);
	if (typeof (f) === 'function') {
		try {
			f.call(gm, textArea.value.trim());
		} catch (e) {}
	}
	gm.destroy();
	return false;
}
