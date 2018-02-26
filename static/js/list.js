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


$(document).on("click touchstart",".list-content", function () {
   $(this).removeClass("list-content");
   $(this).addClass('list-content-expanded') 
});

$(document).on("click touchstart",".list-content-expanded", function () {
   $(this).removeClass("list-content-expanded");
   $(this).addClass('list-content') 
});


function loadListPage(resourcejson){
    // Javascript function JSON.parse to parse JSON data
    question = resourcejson.question;
    document.getElementsByClassName("showQuestion")[0].innerHTML=question;
    answer = resourcejson.answer;
    abstract = resourcejson.abstract;
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
        "        </div>"
    $(".list").append(newitem);
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


