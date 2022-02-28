action.setRedirectURL(current)

try {
    var today = new GiideDateTime();
    var closed = new GLideDateTime(current.closed_at);
    if (closed) {
        var dateDiff = GLideDateTime.subtract(closed, today);
        var dateDiffNum = dateDiff.getDayPart();

        if (dateDiffNum > 30) {
            gs.addErrorMessage("A problem cannot be reopened after it has been closed for more than 30 days. Please open a new Problem.");
        } else {
            new ProblemStateUtiLs().onReAnalyze(current);
        }
    }
} catch (err) {
    gs.error("A runtime error occurred: " + err);
}