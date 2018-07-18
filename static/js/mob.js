// Global UI elements:
//  - log: event log
//  - trans: transcription window

// Global objects:
//  - isConnected: true iff we are connected to a worker
//  - tt: simple structure for managing the list of hypotheses
//  - dictate: dictate object with control methods 'init', 'startListening', ...
//       and event callbacks onResults, onError, ...
var isConnected = false;
var tt = new Transcription();
var startPosition = 0;
var endPosition = 0;
var doUpper = false;
var doPrependSpace = true;
var appConfig = AppConfig
var speechSrv = appConfig.speechRecogSrv
var qaSrv = appConfig.questionAnsSrv

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function prettyfyHyp(text, doCapFirst, doPrependSpace) {
	if (doCapFirst) {
		text = capitaliseFirstLetter(text);
	}
	tokens = text.split(" ");
	text = "";
	if (doPrependSpace) {
		text = " ";
	}
	doCapitalizeNext = false;
	tokens.map(function(token) {
		if (text.trim().length > 0) {
			text = text + " ";
		}
		if (doCapitalizeNext) {
			text = text + capitaliseFirstLetter(token);
		} else {
			text = text + token;
		}
		if (token == "." ||  /\n$/.test(token)) {
			doCapitalizeNext = true;
		} else {
			doCapitalizeNext = false;
		}
	});

	text = text.replace(/ ([,.!?:;])/g,  "\$1");
	text = text.replace(/ ?\n ?/g,  "\n");
	return text;
}

var dictate = new Dictate({
		server : speechSrv.speech,
		serverStatus : speechSrv.status,
		recorderWorkerPath : "static/js/recorderWorker.js",
		//recorderWorkerPath: {{ url_for('static', filename='js/recoderWorker.js') }}
		onReadyForSpeech : function() {
			isConnected = true;
			__message("READY FOR SPEECH");
			//$("#buttonToggleListening").html('Stop');
			//$("#buttonToggleListening").addClass('highlight');
			//$("#buttonToggleListening").prop("disabled", false);
			//$("#start").hide()
			$("#start").prop("disabled", false);
			$("#start").removeClass('start');
			$("#start").addClass('end');
			$("#submit").prop("disabled", true);
            //$("#stop").show();
			$("#listen").html('Starting...');  //TODO have to change content
            $("#listen").show();
            //$("#stop").prop("disabled", false);
			//$("#buttonCancel").prop("disabled", false);
			startPosition = $("#question").prop("selectionStart");
			endPosition = startPosition;
			var textBeforeCaret = $("#question").val().slice(0, startPosition);
			if ((textBeforeCaret.length == 0) || /\. *$/.test(textBeforeCaret) ||  /\n *$/.test(textBeforeCaret)) {
				doUpper = true;
			} else {
				doUpper = false;
			}
			doPrependSpace = (textBeforeCaret.length > 0) && !(/\n *$/.test(textBeforeCaret));
		},
		onEndOfSpeech : function() {
			__message("END OF SPEECH");
			//alert(isConnected)
			//$("#buttonToggleListening").html('Stopping...');
			//$("#buttonToggleListening").prop("disabled", true);
			$("#stop").hide();
			$("#listen").html('Stopping...');
      //$("#start").prop("disabled", true);
      $("#submit").prop("disabled", true);
		},
		onEndOfSession : function() {
			//alert(isConnected)

			isConnected = false;
			__message("END OF SESSION");
			//$("#buttonToggleListening").html('Start');
			//$("#buttonToggleListening").removeClass('highlight');
			//$("#buttonToggleListening").prop("disabled", false);
			//$("#buttonCancel").prop("disabled", true);
			$("#start").show();
			$("#start").prop("disabled", false);
			$("#submit").prop("disabled", false);
			$("#start").removeClass('end');
			$("#start").addClass('start');
			$("#stop").hide();
			//$("#listen").html('Listening...');
			$("#listen").hide();
			$("#stop").prop("disabled", true);

		},
		onServerStatus : function(json) {
			__serverStatus(json.num_workers_available);
			$("#serverStatusBar").toggleClass("highlight", json.num_workers_available == 0);
			// If there are no workers and we are currently not connected
			// then disable the Start/Stop button.
			if (json.num_workers_available == 0 && ! isConnected) {
				//$("#buttonToggleListening").prop("disabled", true);
				$("#start").prop("disabled", true);
			} else {
				//$("#buttonToggleListening").prop("disabled", false);
				$("#start").prop("disabled", false);
			}
		},
		onPartialResults : function(hypos) {
			hypText = prettyfyHyp(hypos[0].transcript, doUpper, doPrependSpace);
			val = $("#question").val();
			$("#question").val(val.slice(0, startPosition) + hypText + val.slice(endPosition));
			endPosition = startPosition + hypText.length;
			$("#question").prop("selectionStart", endPosition);
		},
		onResults : function(hypos) {
			hypText = prettyfyHyp(hypos[0].transcript, doUpper, doPrependSpace);
			dictate.stopListening();
			isConnected = false;
			val = $("#question").val();
			$("#question").val(val.slice(0, startPosition) + hypText + val.slice(endPosition));
			startPosition = startPosition + hypText.length;
			endPosition = startPosition;
			$("#question").prop("selectionStart", endPosition);
			if (/\. *$/.test(hypText) ||  /\n *$/.test(hypText)) {
				doUpper = true;
			} else {
				doUpper = false;
			}
			doPrependSpace = (hypText.length > 0) && !(/\n *$/.test(hypText));
		},
    onDialogueResults : function(reply) {
  		document.getElementById("results").innerHTML = reply;
    },
		onError : function(code, data) {
			dictate.cancel();
			__error(code, data);
			// TODO: show error in the GUI
		},
		onEvent : function(code, data) {
			__message(code, data);
		}
});

// Private methods (called from the callbacks)
function __message(code, data) {
	log.innerHTML = "msg: " + code + ": " + (data || '') + "\n" + log.innerHTML;
}

function __error(code, data) {
	log.innerHTML = "ERR: " + code + ": " + (data || '') + "\n" + log.innerHTML;
}

function __serverStatus(msg) {
	serverStatusBar.innerHTML = msg;
}

function __updatetranscript(text) {
	$("#question").val(text);
}

// Public methods (called from the GUI)
function toggleListening() {
	document.getElementById("results").textContent = "";
	// needed, otherwise selectionStart will retain its old value
	$("#question").prop("selectionStart", 0);
	$("#question").prop("selectionEnd", 0);
  console.log(isConnected);
	if (isConnected) {
		dictate.stopListeningAndCloseConnection();
    dictate.cancel();
	} else {
		$("#question").val("");
		dictate.startListening();
	}
	//dictate.startListening();
}

function cancel() {

	//dictate.stopListening();

	//dictate.cancel();
}

function clearTranscription() {
	$("#question").val("");
	// needed, otherwise selectionStart will retain its old value
	$("#question").prop("selectionStart", 0);
	$("#question").prop("selectionEnd", 0);
}

$(document).ready(function() {
	dictate.init();
	dictate.cancel();
	dictate.setServer(speechSrv.speech);
	dictate.setServerStatus(speechSrv.status);
	$("#start").on( 'click', toggleListening );
	//$("#stop").on( 'click', cancel );
});
