(function ($) {
    "use strict";
    var mainApp = {

        main_fun: function () {
            //SCROLL SCRIPT
            $(function () {
                $('.move-me a').bind('click', function (event) { //just pass move-me in design and start scrolling
                    var $anchor = $(this);
                    $('html, body').stop().animate({
                        scrollTop: $($anchor.attr('href')).offset().top
                    }, 1000, 'easeInOutQuad');
                    event.preventDefault();
                });
            });
		//scrollReveal scripts
            window.scrollReveal = new scrollReveal();
        },



        initialization: function () {
            mainApp.main_fun();

        }


    }
    // Initializing ///

    $(document).ready(function () {
        mainApp.main_fun()


    });

}(jQuery));



//start resource
var ToC =
    "<nav role='navigation' class='table-of-contents'>" +
    "<h2>Content:</h2>" +
    "<ul>";

var newLine, el, title, link;

$("#service h4").each(function() {

    el = $(this);
    title = el.text();
    link = "#" + el.attr("id");

    newLine =
        "<li>" +
        "<a href='" + link + "'>" +
        title +
        "</a>" +
        "</li>";

    ToC += newLine;

});

ToC +=
    "</ul>" +
    "</nav>";

$(".all-resources").prepend(ToC);


function loadmore() {
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

    var newitem = "<div class='list-item'>" +
        "          <div class='list-content'>" +
        "            <h2>Hamburg</h2>" +
        "            <p>Bgsm.</p>" +
        "            <a>Show detailed</a>" +
        "          </div>" +
        "        </div>"
    $(".list").append(newitem);
}


//var apiKey = 'grqwfxjxft9mjygsck4u5jdn';
var apiKey = 'ezjawnquqhmkhgyhpr8ff88z';
$.ajax(
    {
        type:'GET',
        url:"https://api.gettyimages.com/v3/search/images/creative?phrase=dog",
        beforeSend: function (request)
        {
            request.setRequestHeader("Api-Key", apiKey);
        }})
    .done(function(data){
        console.log("Success with data")
        for(var i = 0;i<data.images.length;i++)
        {
            $("#output").append("<img src='" + data.images[i].display_sizes[0].uri + "'/>");
        }
    })
    .fail(function(data){
        alert(JSON.stringify(data,2))
    });

