/*
	Copy of the SNUtils /env command but with shorthand args for different CCSQ instances.
	Also replaces the subdomain ('service-now') with 'servicenowservices'.
*/

const environmentInput = '$0'.toLowerCase().trim();
const currentTabUrl = new URL(window.location.href);
let targetSubdomain = '';

if (environmentInput === 'prod') {
	targetSubdomain = 'cmsqualitysupport';
} else if (environmentInput === 'test') {
	targetSubdomain = 'cmsqualitysupporttest';
} else if (environmentInput === 'qat') {
	targetSubdomain = 'cmsqualitysupportqat';
} else if (environmentInput === 'dev') {
	targetSubdomain = 'cmsqualitysupportdev';
} else if (environmentInput === 'train') {
	targetSubdomain = 'cmsqualitysupporttrain';
} else if (environmentInput === 'sandbox' || environmentInput === 'sbx') {
	targetSubdomain = 'cmsqualitysupportsandbox';
} else {
	// Fallback to the raw input string if no shorthand matches
	targetSubdomain = environmentInput;
}

if (targetSubdomain) {
	currentTabUrl.hostname = targetSubdomain + '.servicenowservices.com';
	window.open(currentTabUrl.toString(), '_blank');
}
