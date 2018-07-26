/*
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

*/

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
      data : JSON.stringify(question),
      contentType: "text/plain; charset=utf-8",
      //dataType: "JSON",
      success: function(results) {
      	$("#loader").removeClass('loader');
      	var formatted = "";
        var ans = results["answers"][0];
    		for(var i=0; i<results["answers"].length; ++i){
    			formatted = formatted + results["answers"][i] + '<br>';
    		}
      	document.getElementById("results").innerHTML = ans.replace(new RegExp('<pad>', 'g'), "");
        updateDialogues(ans.replace(new RegExp('<pad>', 'g'), ""));
      },
      error: function(error) {
        console.log(error)
      }
    });
  });
});
