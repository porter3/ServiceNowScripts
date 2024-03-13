(function runMailScript( /* GlideRecord */ current, /* TemplatePrinter */ template,
    /* Optional EmailOutbound */
    email, /* Optional GlideRecord */ email_action,
    /* Optional GlideRecord */
    event) {

	// only print mailto link if assignment group is I.T. Helpdesk
	if (current.assignment_group != gs.getProperty('helpdesk.groups.it.all')) {
		return;
	}

    var mailtoAddress = gs.getProperty('instance_name') + '@service-now.com';
	var subject = 'Re:' + current.number + ' - requesting call back';
	var watermark = email.watermark;
    var linkCSS = 'background-color: #278efc; border: 1px solid #0368d4; color: #ffffff; font-size: 16px; font-family: Helvetica, Arial, sans-serif; text-decoration: none; border-radius: 3px; display: inline-block; padding-top: 5px; padding-right: 5px; padding-bottom: 5px;';
	

	template.print('<a href="mailto:' + mailtoAddress + '?subject=' + subject + '&body=' + watermark + '" style="' + linkCSS + '">&nbsp;Request a call back</a>');

})(current, template, email, email_action, event);
