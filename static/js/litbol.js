function loadLitBolPage(literaljson){
	// Javascript function JSON.parse to parse JSON data
    question = literaljson.question;
    answer = literaljson.answer;
    document.getElementsByClassName("showQuestion")[0].innerHTML=question;
    document.getElementsByClassName("boli_answer")[0].innerHTML=answer;  
}