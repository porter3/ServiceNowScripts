/*
If something were to break with a fulfillment flow in several different requests, you can resubmit them all via this fix script by first specifying a query in the SC_REQUEST_QUERY variable.
*/

var SC_REQUEST_QUERY = "";

var request = new GlideRecord('sc_request');
request.addEncodedQuery(SC_REQUEST_QUERY);
request.query();

var originalRitm, cartID, cart, originalVars, newVars, varName, varValue, newItem;
while (request.next()) {
    cartID = gs.generateGUID();
    cart = new sn_sc.CartJS(cartID);

    // iterate through all of the REQ's RITMs
    originalRitm = new GlideRecord('sc_req_item');
    originalRitm.addQuery('request', request.getValue('sys_id'));
    originalRitm.query();

    while (originalRitm.next()) {
        newVars = {};

        originalVars = new GlideRecord('sc_item_option_mtom');
        originalVars.addQuery('request_item', originalRitm.getValue('sys_id'));
        originalVars.query();

		// get variable names/values from original RITM
        while (originalVars.next()) {
            varName = originalVars.sc_item_option.item_option_new.name.toString();
            varValue = originalVars.sc_item_option.value.toString();
            newVars[varName] = varValue;
        }

        newItem = {
            'sysparm_id': originalRitm.getValue('cat_item'),
            'sysparm_quantity': '1',
            'variables': newVars
        };

        cart.addToCart(newItem);
    }

    var reqDetails = cart.submitOrder({
        'requested_for': originalRitm.getValue('requested_for')
    });

	_setOpenedByOnRequestAndRitms(request, reqDetails.request_id);
}


function _setOpenedByOnRequestAndRitms(oldRequest, newRequestSysID) {
	var openedBy = oldRequest.getValue('opened_by');

	var newRequest = new GlideRecord('sc_request');
	newRequest.get(newRequestSysID);
	newRequest.opened_by = openedBy;
	newRequest.update();

	var ritms = new GlideRecord('sc_req_item');
	ritms.addQuery('request', newRequestSysID);
	ritms.setValue('opened_by', openedBy);
	ritms.updateMultiple();
}
