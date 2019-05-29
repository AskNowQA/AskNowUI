$("#loader").addClass('loader');
$(".all-resources").hide()
$(function() {   
        $.ajax({
            type:'GET',
            url: '/_getJSON'
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
