LIMIT = 3
COUNT = 1
$("#loader").addClass('loader');
$(function() {  
	$("#load").hide()
	$.ajax({
		type:'GET',
		url: '/_getJSON',
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


$(document).on("click touchstart",".expand-list-content", function () {
   //$(this).find().removeClass("list-content");
   $(this).closest(".list-item").find(".list-content").addClass('expanded');
   $(this).hide();
   $(this).closest(".list-item").find(".collapse-list-content").show();
});

$(document).on("click touchstart",".collapse-list-content", function () {
   $(this).closest(".list-item").find(".list-content").removeClass("expanded");
   //$(this).addClass('list-content') 
   $(this).hide();
   $(this).closest(".list-item").find(".expand-list-content").show();
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
    var feedbackFragment = '<div class="feedback">'+
                    '<span>Was this helpful?</span>'+
                    '<span>'+
                        '<a data-value="1">'+
                            '<span class="fa-stack">'+
                                '<i class="fa fa-thumbs-up fa-stack-1x"></i>'+
                            '</span>'+
                        '</a>'+
                        '<a data-value="0">'+
                            '<span class="fa-stack">'+
                                '<i class="fa fa-thumbs-down fa-stack-1x"></i>'+
                            '</span>'+
                        '</a>'+
                    '</span>'+
                '</div>'
    $("#load").show()
    for (var i=0; i<LIMIT; i++){
        var newitem = "<div class='list-item'>" +
        "          <div class='list-content' >" +
                     feedbackFragment +
        "            <h2>"+answer[i]+"</h2>" +
        "            <p>"+abstract[i]+"</p>" +
        "          </div>" +
        "          <a class='expand-list-content'>Show more...</a>" +
        "          <a class='collapse-list-content'>Show less...</a>" +
        "        </div>";
		    $(".list").append(newitem);
    }
	
	var entities = resourcejson.fullDetail.entities,
		relations = resourcejson.fullDetail.best_path.concat(resourcejson.fullDetail.rdf_best_path),
		entity,
		relation;
  for(var i = 0; i < relations.length; i++){
    if(relations[i].split("/").indexOf("ontology") == -1 && 
       relations[i].split("/").indexOf("property") == -1){
      entities.push(relations.splice(i, 1)[0]);
    }
  }
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
                var feedbackFragment = '<div class="feedback">'+
                    '<span>Was this helpful?</span>'+
                    '<span>'+
                        '<a data-value="1">'+
                            '<span class="fa-stack">'+
                                '<i class="fa fa-thumbs-up fa-stack-1x"></i>'+
                            '</span>'+
                        '</a>'+
                        '<a data-value="0">'+
                            '<span class="fa-stack">'+
                                '<i class="fa fa-thumbs-down fa-stack-1x"></i>'+
                            '</span>'+
                        '</a>'+
                    '</span>'+
                '</div>'
                var newitem = "<div class='list-item'>" +
                              "<div class='list-content'>" +
                              feedbackFragment + 
                              "<h2>"+answer[i]+"</h2>" +
                              "<p>"+abstract[i]+"</p>" +
                              "</div>" +
                              "<a class='expand-list-content'>Show more...</a>" +
                              "<a class='collapse-list-content'>Show less...</a>" +
                              "</div>"
               $(".list").append(newitem);}             
        }
        COUNT = COUNT +1
    });
}


