"use strict";
(function(){
	var LIMIT = 3,
		COUNT = 1,
		url = new URL(window.location.href),
		question = url.searchParams.get("question");

	// Adding question to search field
	document.getElementById("question").value = question;
	
	// Fetching answer for question from API  
    $.ajax({
        type:'POST',
        url: '/_getJSON',
		data: { 'question': question}
    }).success(function (data){
        if(data.question_type == "resource"){
        	loadResource(data, "answer");
        }
        if(data.question_type == "list"){
        	loadList(data, "answer");
        }
        if(data.question_type == "literal" || data.question_type == "boolean"){
        	loadLitBol(data, "answer");
        }
        if(data.question_type == "none"){
        	loadNone(data,"answer");
        }
        $("#loading").hide();
        $("#submit").show();
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

	function createEntitiesRelationsList(entities, relations){
		var entity, relation;
		for(var i = 0; i < entities.length; i++){
	        if(isValidURL(entities[i])){
	            entity = document.getElementById('entity-blob').innerHTML;
	            entity = entity.replace("${entity}", entities[i])
	            				.replace("${entity}", entities[i]);
	            $("#entities_relations").append(entity);
	        }
	    }
	    for(var i = 0; i < relations.length; i++){
	        if(isValidURL(relations[i])){
	            relation = document.getElementById('relation-blob').innerHTML
	            				.replace("${relation}", relations[i])
	            				.replace("${relation}", relations[i]);
	            $("#entities_relations").append(relation);
	        }
	    }
	}
	function loadResource(data, append_to_html){
		// 'Resource' type answer retrieved
	    var question = data.question,
	    	answer = data.answer,
	    	type = data.type,
	    	abstract = data.abstract,
	    	entities = data.fullDetail.entities,
	        relations = data.fullDetail.best_path,
	        html = document.getElementById('resource').innerHTML
	        				.replace("${answer}", answer)
					    	.replace("${feedback}", document.getElementById('feedback').innerHTML)
					    	.replace("${type}", type)
					    	.replace("${abstract}", abstract);

		$("#"+append_to_html).append(html);
		createEntitiesRelationsList(entities, relations);

	}

	function loadList(data, append_to_html){
	    // 'List' type answer retrieved
	    var question = data.question,
	    	answer = data.answer,
	    	abstract = data.abstract,
	    	length = Object.keys(answer).length,
	    	entities = data.fullDetail.entities,
			relations = data.fullDetail.best_path,
			list_item,
			list_items = "",
			html = document.getElementById('list').innerHTML;

	    LIMIT = length < LIMIT? length : LIMIT;

	    for (var i=0; i<LIMIT; i++){
	    	list_items += document.getElementById('list-item').innerHTML
	    					.replace("${feedback}", document.getElementById('feedback').innerHTML)
	    					.replace("${answer}", answer[i])
	    					.replace("${abstract}", abstract[i]);
	    }
	    html = html.replace("${list-items}", list_items);
		
		createEntitiesRelationsList(entities, relations);
		$("#"+append_to_html).append(html);
	   
		// More list item display on reaching page end
	    $(window).scroll(function() {
		   if($(window).scrollTop() + $(window).height() == $(document).height()) {
		       for (var i=LIMIT*COUNT; i<LIMIT*(COUNT+1); i++){
		            if(i < length){
		                list_item = document.getElementById('list-item').innerHTML
	    					.replace("${feedback}", document.getElementById('feedback').innerHTML)
	    					.replace("${answer}", answer[i])
	    					.replace("${abstract}", abstract[i]);
		               $(".list").append(list_item);}             
		        }
		        COUNT = COUNT +1
		    }
		});
	}

	function loadLitBol(data, append_to_html){
		// 'Literal' and 'boolean' type answer retrieved
	    var html = document.getElementById('lit-boi').innerHTML.replace("${answer}", data.answer),
        	entities = data.fullDetail.entities,
        	relations = data.fullDetail.best_path;
        createEntitiesRelationsList(entities, relations);
	    $("#"+append_to_html).append(html);
	}

	function loadNone(data,append_to_html){
		// When no answer was found
		var html = document.getElementById('none').innerHTML,
        	entities = data.entities,
        	relations = data.relations;
        createEntitiesRelationsList(entities, relations);
	    $("#"+append_to_html).append(html);
	}

	// JQuery Events for answer.html
	// Feedback
	function submitFeedback(value, question){
		// Api call to submit feedback
		console.log(value);
	}
	$(document).on('click touchstart', '.feedback a', function() {
		if($(this).hasClass("active")){
			return;
		}
		$(this).parent().children("a").removeClass("active");
		$(this).addClass("active");
		submitFeedback($(this).data("value"));
	});
	// Expand and collapse list items
	$(document).on("click touchstart",".expand-list-content", function () {
	   $(this).closest(".list-item").find(".list-content").addClass('expanded');
	   $(this).hide();
	   $(this).closest(".list-item").find(".collapse-list-content").show();
	});

	$(document).on("click touchstart",".collapse-list-content", function () {
	   $(this).closest(".list-item").find(".list-content").removeClass("expanded");
	   $(this).hide();
	   $(this).closest(".list-item").find(".expand-list-content").show();
	});

})();
