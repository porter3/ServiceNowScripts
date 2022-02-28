// A MRVS is just a JSON key/value pair
var rbParse = JSON.parse(current.variables.reservation_block_limit_5);
// My MRVS is called “reservation_block_limit_5”
// It has 4 variables: Start Date, End Date, Start Time, End Time



for (var i = 0; i < rbParse.length; i++) { // Loop thru each Date entry and append to the Description field
createString1(rbParse[i]);
}



var avParse = JSON.parse(current.variables.authorized_visitors_limit_20);
// My MRVS is called “authorized_visitors_limit_20”
// It has 3 variables: Visitor Company, First Name, Last Name



for (var j = 0; j < avParse.length; j++) { // Loop thru each Visitor entry and append to the Description field
createString2(avParse[j]);
}



function createString1(rbParse) {
var desc1 = 'Start date: ' + rbParse.start_date;
var desc2 = ' ' + 'End date: ' + rbParse.end_date;
var desc3 = ' ' + 'Start time: ' + rbParse.start_time;
var desc4 = ' ' + 'End time: ' + rbParse.end_time + '\n';

current.description += desc1 + desc2 + desc3 + desc4;
}



function createString2(avParse) {
var desc = avParse.first_name + ' ' + avParse.last_name + ' (' + avParse.visitor_company + ')' + '\n';
current.description += desc;
}