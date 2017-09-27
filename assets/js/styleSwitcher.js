
(function ($) {
    "use strict";
    var mainAppNew = {

        main_fun: function () {

            /*=====================================
             THEME SWITCHER SCRIPTS 
            ===================================*/
            jQuery('#switch-panel').click(function () {
                if (jQuery(this).hasClass('show-panel')) {
                    jQuery('.switcher').css({ 'left': '-50px' });
                    jQuery('#switch-panel').removeClass('show-panel');
                    jQuery('#switch-panel').addClass('hide-panel');
                } else if (jQuery(this).hasClass('hide-panel')) {
                    jQuery('.switcher').css({ 'left': 0 });
                    jQuery('#switch-panel').removeClass('hide-panel');
                    jQuery('#switch-panel').addClass('show-panel');
                }
            });

           
            $('#green').click(function () {
                $('#mainCSS').attr('href', 'assets/css/themes/green.css');
            });
            $('#blue').click(function () {
                $('#mainCSS').attr('href', 'assets/css/themes/blue.css');
            });
            $('#green1').click(function () {
                $('#mainCSS').attr('href', 'assets/css/themes/green1.css');
            });
            $('#beige').click(function () {
                $('#mainCSS').attr('href', 'assets/css/themes/beige.css');
            });

           
        },

        initialization: function () {
            mainAppNew.main_fun();

        }

    }
    // Initializing ///

    $(document).ready(function () {
        mainAppNew.main_fun();
    });

}(jQuery));
