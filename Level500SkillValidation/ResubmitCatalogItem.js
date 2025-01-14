// Context: Fix script that resubmits a catalog item and maps variables to existing items

var itemsToResubmit = [
	''
];

var populatedRequestor = false;

var cart;
for (var i = 0; i < itemsToResubmit.length; i++) {
    var ritmGR = new GlideRecord('sc_req_item');
    ritmGR.get('number', itemsToResubmit[i]);

    cart = new sn_sc.CartJS(gs.generateGUID());
    if (ritmGR.u_requested_for) {
        populatedRequestor = true;
		cart.setRequestedFor(ritmGR.variables.requesting_for.toString());
    }

    cart.addToCart({
        'sysparm_id': gs.getProperty('sc_cat_item.workday.new_associate_general_tasks'),
        'sysparm_quantity': '1',
        'variables': {
			'requesting_for': ritmGR.variables.requesting_for.toString(),
			'requesting_for_cost_center': ritmGR.variables.requesting_for_cost_center.toString(),
            'associate_data': ritmGR.variables.associate_data.toString(),
            'associate_display_name': ritmGR.variables.associate_display_name.toString(),
            'employee_id': ritmGR.variables.employee_id.toString(),
            'associate_type': ritmGR.variables.associate_type.toString(),
            'business_title': ritmGR.variables.business_title.toString(),
            'converting_from_contingent_worker': ritmGR.variables.converting_from_contingent_worker.toString(),
            'manager_name': ritmGR.variables.manager_name.toString(),
            'start_date': ritmGR.variables.start_date.toString(),
            'work_location': ritmGR.variables.work_location.toString(),
            'supplier': ritmGR.variables.supplier.toString(),
            'business_area': ritmGR.variables.business_area.toString(),
            'mobile_number': ritmGR.variables.mobile_number.toString()
        }
    });

    var request = cart.submitOrder({
        'requested_for': ritmGR.getValue('u_requested_for')
    });
}
