function renderTemplate(templateID, location, dataModel) {
    var templateString = $(templateID).text();
    var templateFunction = _.template(templateString);
    var renderedTemplate = templateFunction(dataModel);
    $(location).append(renderedTemplate);
}

$.ajax({
    url: "https://api.github.com/issues",
    type: 'get'})
    .done(function(data){
        _.each(data, function(datum) {
            var issuesModel = {
                title: datum.title
            };
            renderTemplate('#templates-issues-list', '.issues-list', issuesModel);
        });
    });
