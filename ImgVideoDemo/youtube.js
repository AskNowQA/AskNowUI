// Searchbar Handler
$(function(){
    var searchField = $('#query');
    var icon = $('#search-btn');

    // Focus Event Handler
    $(searchField).on('focus', function(){
        $(this).animate({
            width:'100%'
        },400);
        $(icon).animate({
            right: '10px'
        }, 400);
    });

    // Blur Event Handler
    $(searchField).on('blur', function(){
        if(searchField.val() == ''){
            $(searchField).animate({
                width:'45%'
            },400, function(){});
            $(icon).animate({
                right:'360px'
            },400, function(){});
        }
    });

    $('#search-form').submit(function(e){
        e.preventDefault();
    });
})


function search(){
    // Clear Results
    $('#results').html('');
    $('#buttons').html('');

    // Get Form Input
    q = $('#query').val();

    // Run GET Request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search",{
            part: 'snippet, id',
            q: q,
            type:'video',
            key: 'AIzaSyDeH1b40anTA5BHsDP1Ml8jZcvblvtXTA8',
            maxResults: 5
        },


        function(data){

            // Log Data
            console.log(data);

            $.each(data.items, function(i, item){
                // Get Output
                var output = getOutput(item);

                // Display Results
                $('#results').append(output);
            });
        }
    );
}


// Build Output
function getOutput(item){
    var videoId = item.id.videoId;
    var title = item.snippet.title;
    var description = item.snippet.description;
    var thumb = item.snippet.thumbnails.high.url;
    var channelTitle = item.snippet.channelTitle;
    var videoDate = item.snippet.publishedAt;

    // Build Output String
    var output = '<li xmlns="http://www.w3.org/1999/html">' +
        //'<div class="list-left">' +
        //'<img class="fancybox fancybox.iframe" src="'+thumb+'" href="http://www.youtube.com/embed'+videoId+'">' +
        '<iframe  src="http://www.youtube.com/embed/'+videoId+'"</iframe>' +
        '</div>' +
        '<div class="list-right">' +
        '<h3><a class="fancybox fancybox.iframe" href="http://www.youtube.com/embed/'+videoId+'">'+title+'</a></h3>' +
        '<small>By <span class="cTitle">'+channelTitle+'</span> on '+videoDate+'</small>' +
        '<p>'+description+'</p>' +
        '</div>' +
        '</li>' +
        '<div class="clearfix"></div>' +
        '';

    return output;
}

