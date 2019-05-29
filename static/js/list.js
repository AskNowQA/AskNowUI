LIMIT = 3
COUNT = 1
$("#loader").addClass('loader');
$(function() {
        var url_string = window.location.href;
	var url = new URL(url_string);
	var question = url.searchParams.get("question");
	$("#load").hide()
	$.ajax({
		type:'POST',
		url: '/_getJSON',
		data: { 'question': question}
		}).success(function (data){
			$("#loader").removeClass('loader');
			loadListPage(data)
		});
	});


function loadmore(resourcejson) {
    var listImg = []
    $(".list img").each(function () {
        el = $(this);
        var link = el.attr("id");
        listImg.push(link)

    });

    for (var i = 0; i < listImg.length; i++){
        var image_x = document.getElementById(listImg[i]);
        image_x.parentNode.removeChild(image_x);
    }
}


$(document).on("click touchstart",".list-content", function () {
   $(this).removeClass("list-content");
   $(this).addClass('list-content-expanded') 
});

$(document).on("click touchstart",".list-content-expanded", function () {
   $(this).removeClass("list-content-expanded");
   $(this).addClass('list-content') 
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

function loadListPage(resourcejson){
    // Javascript function JSON.parse to parse JSON data
    var question = resourcejson.question;
    //document.getElementsByClassName("showQuestion")[0].innerHTML=question;
	document.getElementById("question").value=question;
    var answer = resourcejson.answer;
    var abstract = resourcejson.abstract;
    var length = Object.keys(answer).length;
    if (length<LIMIT){
        LIMIT = length
    }
    $("#load").show()
    for (var i=0; i<LIMIT; i++){
        var newitem = "<div class='list-item'>" +
        "          <div class='list-content' >" +
        "            <h2>"+answer[i]+"</h2>" +
        "            <p>"+abstract[i]+"</p>" +
        "            <a href=''>Show detailed</a>" +
        "          </div>" +
        "        </div>";
		    $(".list").append(newitem);
    }
	
	var entities = resourcejson.entities;
	var relations = resourcejson.relations;
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

   
    $( "#load" ).click(function() {
        for (var i=LIMIT*COUNT; i<LIMIT*(COUNT+1); i++){
            if (i>=length){
                document.getElementById('load').innerHTML= "Loading done"
            }
            else{
                var newitem = "<div class='list-item'>" +
                              "<div class='list-content'>" +
                              "<h2>"+answer[i]+"</h2>" +
                              "<p>"+abstract[i]+"</p>" +
                              "<a>Show detailed</a>" +
                              "</div>" +
                              "</div>"
               $(".list").append(newitem);}             
        }
        COUNT = COUNT +1
    });
}


