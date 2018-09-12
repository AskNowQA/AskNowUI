
// $(function() {
//        $.ajax({
//            }).done(function (data){
//                $('#question').autocomplete({
//                    source: '/_autocomplete',
//                    minLength: 3 
//                });
//            });
//        });




          //$("#loader").hide();

  // on form submission ...
  function commence_search() {

    // grab values
    question = $('input[name="question"]').val();
    $("#loader").addClass('loader');
    
    $.ajax({
      type: "POST",
      //url: "/",
      url: '/_getJSON',
      data : { 'question': question},
      success: function(results) {
        $("#loader").removeClass('loader');
        

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

    return false;
  }     
 
