var record = new GlideRecord('item');
record.get();
record.set('u_specific_field', '');
record.update();