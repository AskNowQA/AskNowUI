$( document ).ready(function() {
	console.log('Starting SpeechRecognition library.');
	var speech = new Speech();

  speech.recognition.onstart = function() {
		$('#start').val("false");
		//document.getElementById('listen').style.visibility = "visible";
  }

	speech.recognition.onend = function() {
		$('#start').val("true");
		$('#start').addClass('start').removeClass('end');
		//document.getElementById('listen').style.visibility = "hidden";
  }

	$('#start').click(function(){
		if ($('#start').val() == "true") {
			$("#question").val("");
			speech.startCapture();
			$('#start').addClass('end').removeClass('start');
		}
		else {
			speech.stopCapture();
			$('#start').val("true");
		  $('#start').addClass('start').removeClass('end');
		}
	});
});
