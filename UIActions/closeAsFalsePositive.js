// Used to display modal on a list view with multiple records selected
// Onclick field in UI action is 'closeIncidents()'

function closeIncidents() {
    var list = GlideList2.get('sn_si_incident');
    var title = list.getTitle();
    var sirs = list.getChecked();
	var elementNumber = sirs.split(',').length + '';
    if (sirs) {
        var o = new GlideModal('sir_close_notes_prompt');
        getMessage("Close SIRs as False Positives", function(msg) {
            o.setTitle(msg);
            o.setPreference('selected_incidents', sirs);
			o.setPreference('sir_number', elementNumber);
            o.render();
        });
    }
}
