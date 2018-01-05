$(document).ready(function() {
  // on form submission ...
  $('#search').on('submit', function() {

    // grab values
    question = $('input[name="question"]').val();

    /**
    var  entry = { "'": "&apos;", '"': '&quot;', '<': '&lt;', '>': '&gt;' };
    question = question.replace(/(['")-><&\\\/\.])/g, function ($0) { return entry[$0] || $0; });
    var string = '/list?question=' + question;
    //var string = '/resource';
    window.location.href = string;
    */

    $.ajax({
      type: "POST",
      url: "/",
      data : { 'question': question},
      success: function(results) {
        var  entry = { "'": "&apos;", '"': '&quot;', '<': '&lt;', '>': '&gt;' };
        question = question.replace(/(['")-><&\\\/\.])/g, function ($0) { return entry[$0] || $0; });
        var type = results['type'];
        var string = '/'+type+'?question=' + question;
        //redirect to the corresponding page
        window.location.href = string;
        //window.location.href="/resource";
      },
      error: function(error) {
        console.log(error)
      }
    });
    
    
  });
});     