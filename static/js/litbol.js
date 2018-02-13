$("#loader").addClass('loader');
$(function() {
        $.ajax({
            type:'GET',
            url: '/_getJSON',
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