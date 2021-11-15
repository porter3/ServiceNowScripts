// 11-15-2021

if (current.state == 6 || current.state == 7) {
	var value = false;
	var max_fcr_days = parseInt(gs.getProperty('incident.resolution_duration'));

	if (current.reassignment_count == 0) {
		var opened_time = new GlideDateTime(current.opened_at.toString());
		var resolved_time = new GlideDateTime(current.resolved_at.toString());
		var elapsed_time = GlideDateTime.subtract(opened_time, resolved_time);
		// .getNumericValue() returns value in milliseconds
		var elapsed_days = elapsed_time.getNumericValue() / (60 * 60 * 24 * 1000);
		if (elapsed_days > max_fcr_days) {
			value = false;
		} else {
			value = true;
		}
	}

	// value = incident was/wasn't resolved on first call
	createMetric(value);
}

function createMetric(value) {
	var mi = new MetricInstance(definition, current);
	if (mi.metricExists())
		return;

	var gr = mi.getNewRecord();
	gr.field_value = value;
	gr.field = null;
	gr.calculation_complete = true;
	gr.insert();
}