

 $(function() {
        $.ajax({
            type:'POST',
            url: '/_autocomplete',
            }).done(function (data){
                $('#question').autocomplete({
                    source: data,
                    minLength: 1, 

                });
            });
        });



$(document).ready(function() {
  // on form submission ...
  $('#search').on('submit', function() {

    // grab values
    question = $('input[name="question"]').val();
    
    $.ajax({
      type: "POST",
      //url: "/",
      url: '/_getJSON',
      data : { 'question': question},
      success: function(results) {
        var  entry = { "'": "&apos;", '"': '&quot;', '<': '&lt;', '>': '&gt;' };
        question = question.replace(/(['")-><&\\\/\.])/g, function ($0) { return entry[$0] || $0; });
        
        var type = results.question_type;
        
        var string = '/'+type+'?question=' + question;
        //redirect to the corresponding page
        window.location.href = string;
     
      },
      error: function(error) {
        console.log(error)
      }
    });
    
    
  });
});     