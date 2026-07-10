var LOAD_DEMO_DATA = false;
var INSTANCE_DOMAIN = gs.getProperty('instance_name') + '.servicenowservices';
var POST_URL = 'https://' + INSTANCE_DOMAIN + '.com/api/sn_cicd/app/batch/install';
var PACKAGE_NAME = '';

var prevName, installedVersion, latestVersion;
var appList = [];

var appGR = new GlideRecord('sys_store_app');
appGR.addEncodedQuery('install_dateISNOTEMPTY^hide_on_ui=false');
appGR.orderBy('name');
appGR.orderBy('version');
appGR.query();

while (appGR.next()) {
    var curName = appGR.getValue('name');
    if (curName == prevName) { continue; }

    installedVersion = appGR.getValue('version');
    latestVersion = appGR.getValue('latest_version');

    if (latestVersion != installedVersion) {
        prevName = curName;
        appList.push({
            displayName: curName,
            id: appGR.getUniqueValue(),
            load_demo_data: LOAD_DEMO_DATA,
            type: "application",
            requested_version: latestVersion
        });
    }
}

var appPackages = { packages: appList, name: PACKAGE_NAME };
var packagesObj = JSON.stringify(appPackages);

gs.info('Packages: ' + packagesObj);
gs.info('POST resource: ' + POST_URL);
