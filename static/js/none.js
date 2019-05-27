$("#loader").addClass('loader');
$(".all-resources").hide()
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
                $(".all-resources").show()
            });
        });

function loadResourcePage(resourcejson){
	// Javascript function JSON.parse to parse JSON data
    question = resourcejson.question;
    document.getElementById("showQuestion").innerHTML=question;
    
}

function generateHrefList(list){
    content=[]
    for (var i = 0; i < list.length; i++)
    {
        content =content + '<a href="none.html">'+list[i]+'</a>'+'  ';
     }
    return content
}
