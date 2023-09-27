// Used to display modal from form
function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading) {
        return;
    }
	
	g_form.hideFieldMsg('stockroom');

    if (newValue == 'pending_repair' && oldValue != 'pending_repair') {
		// if stockroom isn't populated, cancel rest of script and return to oldValue
		if (!g_form.getValue('stockroom')) {
			g_form.setValue('substatus', oldValue);
			g_form.showFieldMsg('stockroom', "Stockroom must be selected in order to select a Substate of 'Pending repair'", 'error');
			return false;
		}
		
		// create modal for repair reason prompt
        var gm = new GlideModal('asset_pending_repair_issue', false, '40em');
        gm.setTitle('Please explain what requires repair');
        gm.setPreference('focusTrap', true);
        gm.setPreference('onPromptComplete', onPromptComplete);
        gm.setPreference('onPromptCancel', onPromptCancel);
        gm.on('closeconfirm', onPromptCancel);
        gm.setPreference('buttonLabelComplete', new GwtMessage().getMessage('OK'));
        gm.setPreference('buttonLabelCancel', new GwtMessage().getMessage('Cancel'));
        gm.render();
    }


    function onPromptComplete(notes) {
        gsftSubmit(null, g_form.getFormElement(), 'sysverb_update_and_stay');
		var ga = new GlideAjax('AssetRepairIncidentCreator');
		ga.addParam('sysparm_name', 'createRepairIncident');
		ga.addParam('sysparm_description', notes);
		ga.addParam('sysparm_asset', g_form.getUniqueValue());
		ga.getXMLAnswer(_handleResponse);
    }
	

    function onPromptCancel() {
        if (oldValue != 'pending_repair') {
            g_form.setValue('substatus', oldValue);
        } else {
			g_form.setValue('substatus', '');
		}
    }
	
	
	function _handleResponse(answer) {
	}

}
