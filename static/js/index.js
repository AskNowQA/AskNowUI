
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

          //$("#loader").hide();

  // on form submission ...
  $('#search').on('submit', function() {

    // grab values
    question = $('input[name="question"]').val();
    $("#loader").addClass('loader');
    
    $.ajax({
      type: "POST",
      url: AppConfig.questionAnsSrv.api,
      data : JSON.stringify({ 'nlquery': question}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(results) {
    	document.getElementById("results").textContent = JSON.stringify(results);
      },
      error: function(error) {
        console.log(error)
      }
    });
  });  
});     

