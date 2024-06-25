// for syncing a date-time field with a date field

(function executeRule(current, previous /*null when async*/) {

	// if Deployment Date changes, sync Installed
	if (previous.u_deployment_date != current.u_deployment_date) {
		current.install_date = _getInstalledDateTime(current.getValue('u_deployment_date'));
	}
	
	// if Installed changes, sync Deployment Date
	if (previous.install_date != current.install_date) {
		current.u_deployment_date = _getDeploymentDate(current.getValue('install_date'));
	}
	
	current.setWorkflow(false);

})(current, previous);


function _getDeploymentDate(installedDateTime) {
    var gdt = new GlideDateTime(installedDateTime);
	gdt.setTimeZone(gs.getProperty('glide.sys.default.tz'));
    return gdt.getLocalDate();
}


function _getInstalledDateTime(deploymentDate) {
	var gdt = new GlideDateTime();
	gdt.setTimeZone(gs.getProperty('glide.sys.default.tz'));
	gdt.setDisplayValue(deploymentDate, 'yyyy-MM-dd');
    return gdt.getDisplayValue();
}
