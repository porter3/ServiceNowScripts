// Context: Script include used in AddNewAssociate.js

var AssociateTaskUtils = Class.create();
AssociateTaskUtils.prototype = {
    initialize: function() {
		this.WORKDAY_DATE_FORMAT = 'yyyy-MM-dd-HH:mm';
	},
	
	validateProcessingDate: function(processingDate, changeDate) {
		var processingGDT = new GlideDateTime();
		var changeGDT = new GlideDateTime();
		processingGDT.setDisplayValue(processingDate, this.WORKDAY_DATE_FORMAT);
		changeGDT.setDisplayValue(changeDate, this.WORKDAY_DATE_FORMAT);
		
		var processingGD = processingGDT.getLocalDate();
		var changeGD = changeGDT.getLocalDate();
		
		// dateDiff will be zero if dates are the same
        var dateDiff = GlideDate.subtract(processingGD, changeGD).getDayPart();
		
		if (dateDiff == 0) {
			return true;
		}
		return false;
	},

    validateChangeDate: function(changeDate) {
        var todayGDT = new GlideDateTime();
        var changeGDT = new GlideDateTime();
        changeGDT.setDisplayValue(changeDate, this.WORKDAY_DATE_FORMAT);

        var todayGD = todayGDT.getLocalDate();
        var changeGD = changeGDT.getLocalDate();

        // dateDiff will be negative if the end date is before the start date. A zero means dates are the same.
        var dateDiff = GlideDate.subtract(todayGD, changeGD).getDayPart();

        // -1 implies changeDate is yesterday
        if (dateDiff == -1) {
            return true;
        }
        return false;
    },

    getUserSysID: function(name) {
        var sysID = '';
        var userGR = new GlideRecord('sys_user');
        userGR.addQuery('name', name.trim());
        userGR.query();
        if (userGR.next()) {
            sysID = userGR.getValue('sys_id');
        }
        return sysID;
    },

    createInferredEmail: function(associateName, associateEmailDomain) {
        var name = associateName.toLowerCase();
        var emailPrefix = name.replace(' ', '.');
        var inferredEmail = emailPrefix + '@' + associateEmailDomain;

        var isValidEmail = this._isValidEmail(inferredEmail);
        while (!isValidEmail) {
            inferredEmail = this._getIncrementedEmail(inferredEmail);
            isValidEmail = this._isValidEmail(inferredEmail);
        }
        return inferredEmail;
    },


    // Used in: createInferredEmail()
    _isValidEmail: function(email) {
        var userGR = new GlideRecord('sys_user');
        userGR.addQuery('user_name', email).addOrCondition('email', email);
        userGR.query();
        if (userGR.hasNext()) {
            return false;
        }
        return true;
    },


    // Used in: createInferredEmail()
    _getIncrementedEmail: function(email) {
        var emailNum;
        var emailParts = email.split('@');
        var prefix = emailParts[0];
        var domain = emailParts[1];
        var number = prefix.match(/\d+/);

        /*
        	If number doesn't exist, find the position at which to add a '1' and do so.
        	Otherwise, convert the existing number to a number type and increment prior to adding.
        */
        if (number == null) {
            emailNum = 1;
        } else {
            var currentNum = parseInt(number);
            emailNum = ++currentNum;

            // remove existing number(s) from prefix
            prefix = prefix.replace(/\d/g, '');
        }
        return prefix + emailNum + '@' + domain;
    },

    type: 'AssociateTaskUtils'
};
