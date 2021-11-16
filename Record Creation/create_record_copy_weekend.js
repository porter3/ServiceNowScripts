// 11-16-2012

// if a record is created on the weekend, create a new one and assign it to 'assigning_to'

(function executeRule(current, previous /*null when async*/) {

	var table = 'incident';
	var assigning_to = 'fred.luddy';

	// getDayOfWeekLocalTime() starts at 1 for Monday and goes to 7 for Sunday
	var day_of_week_num = new GlideDateTime().getDayOfWeekLocalTime();
	if (day_of_week_num == 6 || day_of_week_num == 7) {
		// create new incident
		var gr = new GlideRecord(table);
		gr.initialize();
		gr.get(current.sys_id);
		gr.number = new NumberManager(table).getNextObjNumberPadded();
		gr.assignment_group = current.assignment_group;
		gr.assigned_to = assigning_to;
		gr.insert();
	}
	
})(current, previous);