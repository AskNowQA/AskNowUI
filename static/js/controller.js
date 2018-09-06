$( document ).ready(function() {
	console.log('Starting SpeechRecognition library.');
	var speech = new Speech();

    speech.recognition.onstart = function() {
		$('#start').val("false");
		document.getElementById('listen').style.visibility = "visible";
    }

	speech.recognition.onend = function() {
		$('#start').val("true");
		updateDialogues($("#question").val());
		document.getElementById('listen').style.visibility = "hidden";
    }

	$('#start').click(function(){
		if ($('#start').val() == "true") {
			document.getElementById("results").innerHTML = "";
			speech.startCapture();
		}
		else {
			speech.stopCapture();
		}
	});
});
