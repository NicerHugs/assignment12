var issuesModel;

function renderTemplate(templateID, location, dataModel) {
    var templateString = $(templateID).text();
    var templateFunction = _.template(templateString);
    var renderedTemplate = templateFunction(dataModel);
    $(location).append(renderedTemplate);
}

callIssuesData();
setInterval(callIssuesData, 100000);

function callIssuesData() {
  $.ajax({
    url: "//api.github.com/issues",
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
var url;

$(document).on('click', '.issue-link', function(e) {
    clearInterval(commentsIntervalID);
    e.preventDefault();
    $('.issue-details').empty();
    url = $(this).attr('id');
    makeActive('.comments-form');
    $();
    renderTemplate('#templates-issue-details', '.issue-details', _.findWhere(issuesModel, {commentsURL: url}));
    $.ajax({
        url: url,
        type: 'get'
    })
    .done(function(data) {
        buildDetailsSection(data);
        commentsIntervalID = setInterval(function(){
            buildDetailsSection(data);
        }, 100000);
    });
});

function makeActive(what) {
    $(what).addClass('active');
}

$(document).on('click', '.comment-button, .close-button', function(e) {
    e.preventDefault();
    var comment = {"body": $('textarea').val()};
    $('textarea').val(" ");
    var data = JSON.stringify(comment);
    $.ajax({
        type: 'post',
        dataType: "json",
        url: url,
        data: data
    });
});

$(document).on('click', '.close-button', function(e) {
    e.preventDefault();
    var closeURL = url.slice(0, url.length - 9);
    var close = {"state": "closed"};
    var data = JSON.stringify(close);
    $.ajax({
        type: 'patch',
        dataType: "json",
        url: closeURL,
        data: data
    });
});
