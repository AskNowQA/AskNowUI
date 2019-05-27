
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

	// Search function
	function submit_search(){
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
	}
	// Search executed on click of "Search" button
	$('#submit').on('click', submit_search);
	// Search on pressing enter after writing question
	$('#question').on('keypress', function(e) {
		var code = e.keyCode || e.which;
		if(code==13 && $(this).val().length > 0){
			submit_search();
		}
	});


	function submitFeedback(value, question){
		// Api call to submit feedback
		console.log(value);
	}

	$(document).on('click', '.feedback a', function() {
		if($(this).hasClass("active")){
			return;
		}
		$(this).parent().children("a").removeClass("active");
		$(this).addClass("active");
		submitFeedback($(this).data("value"));
	});
 
