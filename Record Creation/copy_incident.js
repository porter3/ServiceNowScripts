/*
  Originally used in a UI action - copies all info from an existing incident to a new one (other than the elements specified)
*/

var disallowedCopyElements = [
    'sys_id',
    'number',
	'assignment_group',
	'assigned_to',
	'description'
];

var fields = current.getFields();
var incGR = new GlideRecord('incident');
incGR.initialize();

for (var i = 0; i < fields.size(); i++) {
    var element = fields.get(i).getName();
    if (disallowedCopyElements.indexOf(element) == -1) {
        incGR[element] = current.getValue(element);
    }
}
incGR.assignment_group = 'some group';
incGR.parent_incident = current.sys_id;
incGR.description = 'Created from ' + current.number + '\n\n' + current.description;

incGR.insert();

gs.addInfoMessage("Incident " + incGR.number + " created");
action.setRedirectURL(incGR);
action.setReturnURL(current);
