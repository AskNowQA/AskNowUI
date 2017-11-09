
function search(q){
    // Clear Results
    $('#videos').html('');
    // Get Form Input
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
                $('#videos').append(output);
            });
        }
    );
}


// Build Output
function getOutput(item){
    var videoId = item.id.videoId;

    // Build Output String
    var output = '<div>' +
        '<iframe  src="http://www.youtube.com/embed/'+videoId+'"</iframe>' +
        '</div>' +
        '';
    return output;
}

