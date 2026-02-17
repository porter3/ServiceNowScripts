// ...
var cart = new sn_sc.CartJS(gs.generateGUID());
  cart.setRequestedFor(requestor);
  
  var item = {
      'sysparm_id': gs.getProperty('sc_cat_item.active_directory_group_maintenance'),
      'sysparm_quantity': '1',
      'variables': {
          'requesting_for': requestor,
          'function_type': groupAction,
          'ad_group_name': adGroupName,
  'unique_id': uniqueID,
          'manual_update_required': manualUpdateRequired
      }
  };
  
  cart.addToCart(item);
  var reqInfo = {
      'requested_for': requestor,
  };
  var orderDetails = cart.submitOrder(reqInfo);
  return orderDetails;
