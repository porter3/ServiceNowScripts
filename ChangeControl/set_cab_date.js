(function executeRule(current, previous) {

    var gdt = new GlideDateTime(gs.beginningOfNextWeek());
    gdt.addDaysLocalTime(2);
    current.setValue('cab_date', gdt);
})(current, previous);