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
        buildIssuesList(data);
    });

function buildIssuesList(data) {
    var issuesModel = _.map(data, function(datum) {
        return {
                title: datum.title,
                description: datum.body,
                commentsURL: datum.comments_url
        };
    });
    $('.issue').remove();
    _.each(issuesModel, function(issueModel) {
        renderTemplate('#templates-issues-list', '.issues-list', issueModel);
    });
}

$(document).on('click', '.issue-link', function(e) {
    e.preventDefault();
    var url = $(this).attr('id');
    var title = $('h2', this).text();
    var description = $('p', this).text();
    $.ajax({
        url: url,
        type: 'get',
    })
    .done(function(data){
        var issueDetailsModel = {
            title: title,
            description: description
        };
        renderTemplate('#templates-issue-details', '.issue-details', issueDetailsModel);
        var commentsModel = _.map(data, function(datum) {
            return {
              comment: datum.body
            };
        });
        _.each(commentsModel, function(commentModel) {
            renderTemplate('#templates-issue-comments', '.issue-comments', commentModel);
        });
    });
});
