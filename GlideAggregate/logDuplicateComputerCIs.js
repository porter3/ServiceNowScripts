var commaSepList = '';

var ga = new GlideAggregate('cmdb_ci_computer');
ga.addAggregate('COUNT', 'serial_number');
ga.groupBy('serial_number');
ga.query();

var serialNum, count;
while (ga.next()) {
    serialNum = ga.serial_number.getDisplayValue();
    count = ga.getAggregate('COUNT', 'serial_number');
    if (count > 1) {
        commaSepList += serialNum + ',';
    }
}

gs.log(commaSepList);
