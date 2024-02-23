// Logs duplicate Computer CI serial numebrs in a comma-separated string that can then be used in a 'Serial number is one of ___' query.

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
