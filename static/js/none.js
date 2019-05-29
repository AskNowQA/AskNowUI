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
                var entities = data.entities;
                var relations = data.relations;
                for(var i = 0; i < entities.length; i++){
                    if(isValidURL(entities[i])){
                        entity = '<a class="blob orange" href="'+ entities[i] +'" target="blank"><i class="mark">Entity</i>'+entities[i]+'</a>';
                        $("#entities_relations").append(entity)
                    }
                }
                for(var i = 0; i < relations.length; i++){
                    if(isValidURL(relations[i])){
                        relation = '<a class="blob blue" href="'+ relations[i] +'" target="blank"><i class="mark">Relation</i>'+relations[i]+'</a>';
                        $("#entities_relations").append(relation)
                    }
                }

            });
        });

function isValidURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}


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
