"use strict";
(function(){
	// Search function
	function submitSearch(){
		// Grab values
		var question = $('input[name="question"]').val();
		$("#loader").addClass('loader');
		window.location.href = '/answer?question=' + question;
	}

	// Search executed on click of "Search" button
	$('#submit').on('click', submitSearch);
	// Search on pressing enter after writing question
	$('#question').on('keypress', function(e) {
		var code = e.keyCode || e.which;
		// if 'enter' key is pressed and the field is not empty
		if(code==13 && $(this).val().length > 0){
			submitSearch();
		}
	});
})();
	