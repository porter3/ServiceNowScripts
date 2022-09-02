var variables = [
	{
		question: 'Data Dog',
		name: 'data_dog',
		order: 3500
	},
];

var varGR = new GlideRecord('item_option_new');
varGR.setWorkflow(false);
for (var i = 0; i < variables.length; i++) {
	varGR = new GlideRecord('item_option_new');
	varGR.initialize();
	varGR.cat_item = '7903e5341b2d11104eb4fc468d4bcbe8';
	varGR.type = 7;
	varGR.question_text = variables[i].question;
	varGR.name = variables[i].name;
	varGR.order = variables[i].order;
	varGR.insert();
}
