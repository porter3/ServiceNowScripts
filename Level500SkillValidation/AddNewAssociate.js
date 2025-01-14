// Context: onBefore transform script

(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {

    var taskUtils = new AssociateTaskUtils();
	  var SYSTAX_COMPANY_CODE = 'CO_28';

    try {
        target.u_task_type = 'add';

        // Reporting Manager
        var managerName = source.u_wd_worker_manager;
        var managerSysID = _getUserSysID(managerName);
        if (managerName && !managerSysID) {
            this.unmappedManager = true;
        } else {
            this.unmappedManager = false;
        }
        target.u_reporting_manager = managerSysID;

        var changeDate = source.u_wd_change_date;
        var changeDateIsValid = taskUtils.validateChangeDate(changeDate);

        // if Processing Date exists, validate it.
        // if Processing Date does not exist, validate the change date.
        var processingDate = source.u_processing_date;
        if (processingDate) {
            var processingDateIsValid = _validateProcessingDate(processingDate, changeDate);
            if (!processingDateIsValid) {
                gs.error("'Add New Associate Transform' onBefore error: Workday change date and processing date do not match [Change Date: " + changeDate + " | Processing Date: " + processingDate + "] Skipping Import for manager " + managerName);
                ignore = true;
                return;
            }
        } else if (!changeDateIsValid) {
            gs.error("'Add New Associate Transform' onBefore error: Workday change date is not for the previous day [Change Date: " + changeDate + "] Skipping Import for manager " + managerName);
            ignore = true;
            return;
        }

        // Associate Type
        // must leave field blank if source data is invalid
        if (source.u_wd_worker_type == 'Contingent Worker') {
            target.u_associate_type = 'contingent_worker';
        } else if (source.u_wd_worker_type == 'Employee') {
            target.u_associate_type = 'employee';
        }

        // Converting From Contingent Worker
        var convertingFromCW = source.u_wd_converted_to_emp == 1 ? 'true' : 'false';
        target.u_converting_from_contingent_worker = convertingFromCW;

        // Associate Display Name
        var associateDisplayName = source.u_wd_worker;
        target.u_associate_display_name = associateDisplayName;

        // Employee ID
        var employeeID = source.u_wd_employee_id;
        target.u_employee_id = employeeID;

        // Start Date
        var startDate = _getFormattedStartDate(source.u_wd_start_date);
        target.u_start_date = startDate;

        // Company Code
        var companyCode = source.u_wd_company_id;
        target.u_company_code = companyCode;

        //Phone
        target.u_mobile_phone = source.u_mobile_phone;

        // Email Domain
        if (companyCode == SYSTAX_COMPANY_CODE) {
            target.u_email_domain = 'systax.com.br';
        } else {
            target.u_email_domain = 'vertexinc.com';
        }

        // Supplier
        var supplier = source.u_wd_cw_supplier;
        target.u_supplier = supplier;

        // Work Location
        var workLocationSysID = _getLocationSysID(source.u_wd_work_location);
        target.u_work_location = workLocationSysID;

        // Business Title
        var businessTitle = source.u_wd_business_title;
        target.u_business_title = businessTitle;

        // Cost Center
        var costCenter = source.u_wd_cost_center_id;
        target.u_cost_center = _getCostCenterSysID(costCenter);

        var associateUser;
        var existingUser = _getExistingUser(employeeID);
        if (existingUser) {
            associateUser = existingUser;
        } else {
            associateUser = _createStubbedUser(target);
        }

        var associateUserTitle = _getUserTitle(associateUser);

        var isVIP = _checkIfVip(associateUserTitle);

        // Set the VIP field directly on the user record
        if (isVIP) {
            var userGR = new GlideRecord('sys_user');
            if (userGR.get(associateUser)) {
                userGR.vip = true;
                userGR.update();
            }
        }

        target.u_associate_user = associateUser;
        target.u_associate_email = associateUser.email;

    } catch (e) {
        gs.error("'Add New Associate Transform' onBefore error: " + e);
    }
})(source, map, log, target);


// Argument format example: John Smith
function _getUserSysID(name) {
    var sysID = '';
    if (name) {
        var userGR = new GlideRecord('sys_user');
        userGR.addActiveQuery();
        userGR.addQuery('name', name.trim());
        userGR.query();
        if (userGR.next()) {
            sysID = userGR.getValue('sys_id');
        }
    }
    return sysID;
}


// Returns a date string in the format MM/dd/yyyy (argument format example: 2022-03-07-08:00)
function _getFormattedStartDate(date) {
    return new GlideDateTime(date).getDate();
}


function _getLocationSysID(location) {
    var locationSysID = '';
    var locationGR = new GlideRecord('cmn_location');
    locationGR.addQuery('name', location);
    locationGR.query();
    if (locationGR.next()) {
        locationSysID = locationGR.getValue('sys_id');
    }
    return locationSysID;
}


function _getCostCenterSysID(costCenter) {
    var ccSysID = '';
    if (costCenter) {
        var ccGR = new GlideRecord('cmn_cost_center');
        ccGR.addQuery('name', costCenter);
        ccGR.query();
        if (ccGR.next()) {
            ccSysID = ccGR.getValue('sys_id');
        }
    }
    return ccSysID;
}


function _validateProcessingDate(pDate, cDate) {
    var processingGD = new GlideDate();
    var pstrDate = pDate;
    var arr1 = pstrDate.split('-');

    var changeGD = new GlideDate();
    var strDate = cDate;
    var arr = strDate.split('-');

    var changeGDT = new GlideDateTime(arr[0] + '-' + arr[1] + '-' + arr[2] + ' 00:00:00');
    var str = changeGDT.getDate();
    changeGD.setValue(str);

    var processingGDT = new GlideDateTime(arr1[0] + '-' + arr1[1] + '-' + arr1[2] + ' 00:00:00');
    var str1 = processingGDT.getDate();
    processingGD.setValue(str1);

    /*
        compareTo() return values:
        0 = Dates are equal  (pDate EQUALS cDate)
        1 = The object's date is after the date specified in the parameter  (pDate is after cDate)
       -1 = The object's date is before the date specified in the parameter (pDate is before cDate)
    */
    return processingGD.compareTo(changeGD) == 0;
}


function _getExistingUser(employeeID) {
    var userSysID = '';
    var userGR = new GlideRecord('sys_user');
    userGR.get('employee_number', employeeID);
    if (userGR.isValidRecord()) {
        userSysID = userGR.sys_id;
    }
    return userSysID;
}


function _createStubbedUser(target) {
    try {
        var taskUtils = new AssociateTaskUtils();
        var email = taskUtils.createInferredEmail(target.u_associate_display_name.toString(), target.u_email_domain.toString());
        var nameParts = target.u_associate_display_name.split(' ');
        var userGR = new GlideRecord('sys_user');
        userGR.initialize();
        userGR.email = email;
        userGR.user_name = email;
        userGR.name = target.u_associate_display_name;
        userGR.first_name = nameParts[0];
        userGR.last_name = nameParts[1];
        userGR.title = target.u_business_title;
        userGR.manager = target.u_reporting_manager;
        userGR.location = target.u_work_location;
        userGR.cost_center = target.u_cost_center;
        userGR.employee_number = target.u_employee_id;
        var user = userGR.insert();
        return user;

    } catch (e) {
        gs.error("'Add New Associate Transform' onBefore error when creating stubbed user: " + e);
    }
}

function _getUserTitle(sys_id) {
    var title = '';
    var userGR = new GlideRecord('sys_user');
    if (userGR.get(sys_id)) {
        title = userGR.getValue('title');
    }
    return title;
}


function _checkIfVip(title) {
    var executiveWords = [
        'director',
        'vp',
        'vice',
        'president',
        'chief',
		'administrative assistant', 
		'executive assistant'
    ];
    title = title.toLowerCase();
    var i;
    for (i = 0; i < executiveWords.length; i++) {
        if (title.search(executiveWords[i]) > -1) {
            return true;
        }
    }
    // if title is a three-letter word that starts with 'C':
    var cSuiteRegex = /^[c]\w{2}$/;
    if (title.match(cSuiteRegex)) {
        return true;
    }
    return false;
}
