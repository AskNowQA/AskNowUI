$("#loader").addClass('loader');
$(function() {
	var url_string = window.location.href;
        var url = new URL(url_string);
        var question = url.searchParams.get("question");
        $.ajax({
            type:'POST',
            url: '/_getJSON',
	    data: {'question':question}
            }).success(function (data){
                $("#loader").removeClass('loader');
                loadLitBolPage(data)
            });
        });


function loadLitBolPage(literaljson){
	// Javascript function JSON.parse to parse JSON data
    question = literaljson.question;
    answer = literaljson.answer;
    document.getElementsByClassName("showQuestion")[0].innerHTML=question;
    document.getElementsByClassName("boli_answer")[0].innerHTML=answer;  
}
