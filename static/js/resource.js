
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


    document.getElementById("showQuestion").innerHTML=question;
    document.getElementById("entity-name").innerHTML=answer;
    document.getElementById("entity-type").innerHTML="An Entity of Type :  "+type;
    document.getElementById("abstract-content").innerHTML=abstract;
    document.getElementById("summary-content").innerHTML=summary;
    document.getElementById("recommendation-content").innerHTML=recommendations;

    var related_entities_content=generateHrefList(related_entities_list);
    var similar_entities_content=generateHrefList(similar_entities_list); 
    
    document.getElementById("related-entities-content").innerHTML=related_entities_content;
    document.getElementById("related-sim-content").innerHTML=similar_entities_content;
}

function generateHrefList(list){
    content=[]
    for (var i = 0; i < list.length; i++)
    {
        content =content + '<a href="resource.html">'+list[i]+'</a>'+'  ';
     }
    return content
}
