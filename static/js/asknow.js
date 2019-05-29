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


