$(function() {



    var hash = location.hash.slice(1);
    if (hash) {
        $('.anchor-link-title').each(function() {
            var href = $(this).attr('href');
            if (href) {
                var top = $(this).position().top;
                $('.anchor-ink-ball').css('top', top).fadeIn();
                $(this).parent().addClass('ant-anchor-link-active')
                return false;
            }
        })
    } else {
        var top = $('.anchor-link-title').first().position().top;
        $('.anchor-ink-ball').css('top', top).fadeIn()
        $('.anchor-link-title').first().parent().addClass('ant-anchor-link-active')
    }

    $(".anchor-link-title").click(function() {
        $("html, body").animate({
            scrollTop: $($(this).attr("href")).offset().top + "px"
        }, {
            duration: 500,
            easing: "swing"
        });

        var top = $(this).position().top;
        $('.anchor-link-title').parent().removeClass('ant-anchor-link-active')
        $(this).parent().addClass('ant-anchor-link-active')
        $('.anchor-ink-ball').css('top', top).fadeIn()

        return false;
    });


    $(window).scroll(function() {
       
        var scrollTop = $(window).scrollTop() 
        for (i = 0; i < 4; i++) { 
            if ($(".law-block").eq(i).offset().top <= scrollTop) { 
                $('.anchor-link').removeClass("ant-anchor-link-active"); 
                $('.anchor-link').eq(i).addClass("ant-anchor-link-active"); 
                var top =  $('.anchor-link-title').eq(i).position().top;
                $('.anchor-ink-ball').css('top', top).fadeIn()
            }
        }
    })





})