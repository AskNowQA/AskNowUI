
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
    document.getElementById("results").innerHTML = "";
    
    $.ajax({
      type: "POST",
      url: AppConfig.questionAnsSrv.api,
      data : JSON.stringify({ 'nlquery': question}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(results) {
    	$("#loader").removeClass('loader');
    	var formatted = "";
		for(var i=0; i<results["answers"].length; ++i){
			formatted = formatted + results["answers"][i] + '<br>';
		}
    	document.getElementById("results").innerHTML = formatted;
      },
      error: function(error) {
    	
        console.log(error)
      }
    });
  });  
});     

