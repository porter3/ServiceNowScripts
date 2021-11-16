// 11-16-2012

// if an incident is created on the weekend, create an incident task and assign it to 'assigning_to'

(function executeRule(current, previous /*null when async*/) {

	var assigning_to = 'fred.luddy';

	// getDayOfWeekLocalTime() starts at 1 for Monday and goes to 7 for Sunday
	var day_of_week_num = new GlideDateTime().getDayOfWeekLocalTime();
	if (day_of_week_num == 6 || day_of_week_num == 7) {
		var gr = new GlideRecord('incident_task');
		gr.initialize();
		gr.incident = current.sys_id;
		gr.assignment_group = gs.getProperty('cdw.ag.hardware');
		gr.assigned_to = assigning_to;
		gr.insert();

		gs.addInfoMessage("Incident task " + gr.number + " created");
	}
	
})(current, previous);