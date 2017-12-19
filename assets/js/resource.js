//load the local json
var resourcejson = function () {
    var jsonTemp = null;
    $.ajax({
        'async': false,
        'url': "resource.json",
        'success': function (data) {
            jsonTemp = data;
        }
    });
    return jsonTemp;
}();


function loadResource(resourcejson){
	// Javascript function JSON.parse to parse JSON data
    question = localStorage.getItem("question");

    //jsonTemp = JSON.parse(resourcejson);
    var currentEntity = $.grep(resourcejson, function (Q) {
        return Q.question == question;
    });
    
    var myJSON = JSON.stringify(currentEntity);
    var myObj = JSON.parse(myJSON);

    answer = myObj[0].answer;
    type = myObj[0].type;
    abstract = myObj[0].abstract;
    summary = myObj[0].summary;
    recommendations = myObj[0].recommendations;
    related_entities = myObj[0].related_entities;
    similar_entities = myObj[0].similar_entities;
    var related_entities_list = related_entities.split(',')
    var similar_entities_list = similar_entities.split(',')

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

loadResource(resourcejson)
