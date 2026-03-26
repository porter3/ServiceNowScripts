/*
Identifies and logs the names of active notifications that have not been triggered in the last 12 months.
*/

// get IDs of notifications that were triggered in the last 12 months
var triggeredNotifications = [];
var ga = new GlideAggregate('sys_email_log');
ga.addQuery('sys_created_on', '>=', gs.monthsAgo(12));
ga.addNotNullQuery('notification');
ga.groupBy('notification');
ga.query();

while (ga.next()) {
    triggeredNotifications.push(ga.notification.toString());
}

// query active notifications that are not in the list of triggered notifications
var notificationGR = new GlideRecord('sysevent_email_action');
notificationGR.addActiveQuery(); // Filters for active = true

// Only add the NOT IN filter if we actually found triggered notifications
if (triggeredNotifications.length > 0) {
    notificationGR.addQuery('sys_id', 'NOT IN', triggeredNotifications.join(','));
}

notificationGR.orderBy('name');
notificationGR.query();

gs.info("Active notifications NOT triggered in the last 12 months:");

var count = 0;
while (notificationGR.next()) {
    gs.info(notificationGR.getValue('name'));
    count++;
}

gs.info("Total count of inactive notifications: " + count);
