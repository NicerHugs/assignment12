var issuesModel;

function renderTemplate(templateID, location, dataModel) {
    var templateString = $(templateID).text();
    var templateFunction = _.template(templateString);
    var renderedTemplate = templateFunction(dataModel);
    $(location).append(renderedTemplate);
}

setInterval(callIssuesData, 100000);

function callIssuesData() {
  $.ajax({
    url: "https://api.github.com/issues",
    type: 'get'
    })
    .done(function(data){
        renderIssuesList(data);
    });
}

function renderIssuesList(data) {
    issuesModel = [];
    _.each(data, function(datum) {
        issuesModel.push({
                title: datum.title,
                description: datum.body,
                commentsURL: datum.comments_url
        });
    });
    $('.issue').remove();
    _.each(issuesModel, function(issueModel) {
        renderTemplate('#templates-issues-list', '.issues-list', issueModel);
    });
}

function buildDetailsSection(data){
    var commentsModel = _.map(data, function(datum) {
        return {
          comment: datum.body
        };
    });
    $('.comment').remove();
    _.each(commentsModel, function(commentModel) {
        renderTemplate('#templates-issue-comments', '.issue-comments', commentModel);
    });
}

var commentsIntervalID;

$(document).on('click', '.issue-link', function(e) {
    clearInterval(commentsIntervalID);
    e.preventDefault();
    $('.issue-details').empty();
    var url = $(this).attr('id');
    renderTemplate('#templates-issue-details', '.issue-details', _.findWhere(issuesModel, {commentsURL: url}));
    // var title = $('h2', this).text();
    // var description = $('p', this).text();
    $.ajax({
        url: url,
        type: 'get'
    })
    // .done(buildDetailsSection)
    .done(function(data) {
        buildDetailsSection(data);
        commentsIntervalID = setInterval(function(){
            buildDetailsSection(data);
        }, 100000);
    });
});
