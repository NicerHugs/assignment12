function renderTemplate(templateID, location, dataModel) {
    var templateString = $(templateID).text();
    var templateFunction = _.template(templateString);
    var renderedTemplate = templateFunction(dataModel);
    $(location).append(renderedTemplate);
}

$.ajax({
    url: "https://api.github.com/issues",
    type: 'get',
    // data: {state: 'all'}
    })
    .done(function(data){
        var issuesModel = _.map(data, function(datum) {
            return {
                    title: datum.title,
                    details: datum.body,
                    commentsURL: datum.comments_url
            };
        });
        _.each(issuesModel, function(issueModel) {
            renderTemplate('#templates-issues-list', '.issues-list', issueModel);
            commentsGetRequest(issueModel.commentsURL);
        });
    });


function commentsGetRequest(url) {

$.ajax({
    url: url,
    type: 'get',
    // data: {state: 'all'}
    })
    .done(function(data){
        console.log(data);
    });
}
