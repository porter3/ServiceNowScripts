// Context: Fix script used to copy audit history from duplicated CIs to authoritative ones and delete duplicates

try {

	var duplicates = [];

    // iterate through iPads on Hardware table, see if a duplicate on Tablet table exists (determine by serial number)
    var compAsset = new GlideRecord('alm_hardware');
    compAsset.addEncodedQuery('display_nameLIKEipad^ci.sys_class_name!=u_cmdb_ci_tablet');
    compAsset.query();

    var tabletAsset, duplicate;
    while (compAsset.next()) {
        // look up duplicate iPad by serial number
        tabletAsset = new GlideRecord('alm_hardware');
        tabletAsset.addQuery('serial_number', compAsset.getValue('serial_number'));
        tabletAsset.addQuery('sys_id', '!=', compAsset.getValue('sys_id'));
        tabletAsset.query();

        if (tabletAsset.next()) {

			duplicate = {
				sysID: tabletAsset.getValue('sys_id'),
				serialNumber: tabletAsset.getValue('serial_number')
			};
			duplicates.push(duplicate);

            // carry over data from Tablet to non-Tablet asset
            _populateAssignedTo(tabletAsset, compAsset);

            var workNotes = _getJournalFields(tabletAsset, compAsset);
            var fieldHistory = _getFieldHistory(tabletAsset, compAsset);

            compAsset.work_notes = workNotes + '---\n\n' + fieldHistory;

			compAsset.autoSysFields(false);
            compAsset.update();
        }
    }

	/*
		Theoretically deletion should be possible in the above loop, but behavior was very inconsistent during testing. Deleting all assets after updates have finished solves that problem.
	*/
	_deleteDuplicates(duplicates);

} catch (ex) {
    gs.error('De-duplicate iPads - Something went wrong: ' + ex.getMessage());
}

function _populateAssignedTo(source, target) {

    // if source's Assigned to is populated and target's is not, assign the source value to target
    if (!source.assigned_to.nil() && target.assigned_to.nil()) {
        target.setValue('assigned_to', source.getValue('assigned_to'));
    }
}


function _getJournalFields(source, target) {
    var journalEntries = '';
    var field = 'work_notes';

    // Retrieve all journal entries as single string separated by \n\n
    journalEntries = 'Work note history from duplicated record:\n' + source.getElement(field).getJournalEntry(-1);
    return journalEntries;
}


function _getFieldHistory(sourceRecord, targetRecord) {
    // Initialize HistoryWalker for source record
    var historyWalker = new sn_hw.HistoryWalker('alm_hardware', sourceRecord.getValue('sys_id'), 'CHECKPOINT');

    // Collect all audit history details
    var auditHistory = [];

    // iterate over updates of a single record
    var prevAssignedTo, prevState, prevSubstate;
    while (historyWalker.walkForward()) {
        var walkedRecord = historyWalker.getWalkedRecord();
        var updateNumber = historyWalker.getUpdateNumber();

        // if at least one of the previous values is different than one of the current ones, add a new entry
        if (walkedRecord.getValue('assigned_to') !== prevAssignedTo || walkedRecord.getValue('install_status') !== prevState || walkedRecord.getValue('substatus') !== prevSubstate) {

            var assignedToDisplay = walkedRecord.assigned_to ? walkedRecord.getDisplayValue('assigned_to') : '';
            var stateDisplay = walkedRecord.install_status ? walkedRecord.getDisplayValue('install_status') : '';
            var substateDisplay = walkedRecord.substatus ? walkedRecord.getDisplayValue('substatus') : '';

            var entry = 'Update ' + updateNumber + ': ' + walkedRecord.getValue('sys_updated_on') + '\n';
            entry += 'Assigned to: ' + assignedToDisplay + '\n';
            entry += 'State: ' + stateDisplay + '\n';
            entry += 'Substate: ' + substateDisplay;

            auditHistory.push(entry);
        }

        prevAssignedTo = walkedRecord.getValue('assigned_to');
        prevState = walkedRecord.getValue('install_status');
        prevSubstate = walkedRecord.getValue('substatus');
    }

    // Combine all entries into a single work note
    var workNote = 'Audit history from duplicated record (only showing updates where these field values changed):\n' + auditHistory.join('\n\n');

    return workNote;
}


function _deleteDuplicates(duplicates) {
	var duplicateGR;
	for (var i = 0; i < duplicates.length; i++) {
		duplicateGR = new GlideRecord('alm_hardware');
		duplicateGR.get(duplicates[i].sysID);
		var wasDeleted = duplicateGR.deleteRecord();
		gs.info('Asset deleted [' + duplicates[i].serialNumber + ', ' + duplicates[i].sysID  + ']: ' + wasDeleted);
	}
}
