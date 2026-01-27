/*
Make all Service Catalog variables on a form read-only.
*/

function onLoad() {
    $(variable_map).select("item").each(function(elmt) {
        try {
            g_form.setDisabled('variables.' + elmt.getAttribute('qname'), true);
        } catch (err) {}
    });
}
