$("#loader").addClass('loader');
$(".all-resources").hide()
$(function() {   
        $.ajax({
            type:'GET',
            url: '/_getJSON'
            }).success(function (data){
                $("#loader").removeClass('loader');
                $(".all-resources").show()
                q=data.answer;
                newBingImageSearch(q, 'results', 'entity-img');
                search(q);
                loadResourcePage(data)
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
    answer = resourcejson.answer;
    type = resourcejson.type;
    abstract = resourcejson.abstract;
    summary = resourcejson.summary;
    recommendations = resourcejson.recommendations;
    related_entities = resourcejson.related_entities;
    similar_entities = resourcejson.similar_entities;
    var related_entities_list = related_entities.split(',')
    var similar_entities_list = similar_entities.split(',')


    //document.getElementById("showQuestion").innerHTML=question;
	document.getElementById("question").value=question;
    document.getElementById("entity-name").innerHTML=answer;
    document.getElementById("entity-type").innerHTML="An Entity of Type :  "+type;
    document.getElementById("abstract-content").innerHTML=abstract;
    //document.getElementById("summary-content").innerHTML=summary;
    //document.getElementById("recommendation-content").innerHTML=recommendations;

    var related_entities_content=generateHrefList(related_entities_list);
    var similar_entities_content=generateHrefList(similar_entities_list); 
    
    //document.getElementById("related-entities-content").innerHTML=related_entities_content;
    //document.getElementById("related-sim-content").innerHTML=similar_entities_content;

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
}

function generateHrefList(list){
    content=[]
    for (var i = 0; i < list.length; i++)
    {
        content =content + '<a href="resource.html">'+list[i]+'</a>'+'  ';
     }
    return content
}
