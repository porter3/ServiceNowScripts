// Context: Flow Designed script step for building a payload to send to Jira REST API

(function execute(inputs, outputs) {

    var project = inputs.project;
    var issueType = inputs.issueType;
    var summary = inputs.summary;
    var priority = inputs.priority;
    var jiraUser = inputs.jiraUser;
    var components_string = _buildComponents(inputs.components); // Comma seperated string of IDs
    var teamID = inputs.teamID;
    var descriptionText = inputs.description;
    var affectedEndUser = inputs.affectedEndUser;
    var reportedBy = inputs.reportedBy;
    var incidentLink = _getIncidentLink(inputs.incidentSysID);
    var incidentNumber = inputs.incidentNumber;
    var teamCustomFieldID = gs.getProperty('x_vert3_jira_integ.jira.team_name.field_id')+'';
      
    var payload = {
        'fields': {
            'project': {
                'key': project
            },
            'issuetype': {
                'name': issueType
            },
            'summary': summary,
            'description': {
                'type': 'doc',
                'version': 1,
                'content': [
                  {
                    'type': 'paragraph',
                    'content': [
                      {
                        'type': 'text',
                        'text': 'Affected end user: ' + affectedEndUser,
                      },
                    ]
                  },
                  {
                    'type': 'paragraph',
                    'content': [
                      {
                        'type': 'text',
                        'text': 'Reported by: ' + reportedBy,
                      },
                    ]
                  },
                  {
                    "type": "paragraph",
                    "content": []
                  },
                  {
                    'type': 'paragraph',
                    'content': [
                      {
                        'type': 'text',
                        'text': descriptionText,
                      },
                    ],
                  },
                  {
                    "type": "paragraph",
                    "content": []
                  },
                  {
                    'type': 'paragraph',
                    'content': [
                      {
                        'type': 'text',
                        'text': incidentNumber,
                        'marks': [
                          {
                            'type': 'link',
                            'attrs': {
                              'href': incidentLink
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
            'priority': {
                'name': priority
            },
            'assignee': {
                'id': jiraUser
            },
            'reporter': {
                'id': jiraUser
            },
            'components': components_string
        }
    };
    
    payload['fields'][teamCustomFieldID] = {'id': teamID};
    outputs.payload = payload;

})(inputs, outputs);


function _getIncidentLink(incidentSysID) {
    return 'https://' + gs.getProperty('instance_name') + '.service-now.com/nav_to.do?uri=incident.do?sys_id=' + incidentSysID;
}

function _buildComponents(component_string) {

    if (component_string.length > 0) {
      var components = [];
      var component_array = component_string.split(',');

      // Create a component object for each index in the component array
      for (var i = 0; i < component_array.length; i++) {
        var component_obj = {'id': component_array[i]+ '' };
        components.push(component_obj); // Add the component obj to the array
      }
    }

    return components;
}
