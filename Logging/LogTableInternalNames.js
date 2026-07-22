// Logs internal names of tables

var TABLE_LABELS = [

];

var output = '';

var tableGR = new GlideRecord('sys_db_object');

tableGR.addQuery('label', 'IN', tableLabels.join(','));
tableGR.orderBy('label');
tableGR.query();

while (tableGR.next()) {
    output += tableGR.getValue('name') + '\n';
}

gs.info('Table names:\n' + output);
