$.ajax({
    url: "https://api.github.com/issues",
    type: 'get'})
    .done(function(data){
        console.log(data);
    });
