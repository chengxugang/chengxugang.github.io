$(function(){
    let windowH,curScrollTop,serviceContent3Top,serviceContent4Top,serviceContent5Top,serviceContent6Top,serviceContent7Top,serviceContent8Top;
    windowH = $(window).height();    //浏览器窗口高度
    let serviceContent3 = $('.service-content4');
    let serviceContent4 = $('.service-content5');
    let serviceContent5 = $('.service-content6');
    let serviceContent6 = $('.service-content7');
    let serviceContent7 = $('.service-content8');
    curScrollTop = $(window).scrollTop();

    function serviceContentShow (curScrollTop) {
        serviceContent3Top = serviceContent3.offset().top + 100;
        serviceContent4Top = serviceContent4.offset().top + 100;
        serviceContent5Top = serviceContent5.offset().top + 100;
        serviceContent6Top = serviceContent6.offset().top + 100;
        serviceContent7Top = serviceContent7.offset().top + 100;
        serviceContent8Top = serviceContent7.offset().top + 300;

        if (curScrollTop+windowH-serviceContent3Top > 0) {
            $('.service-content3').addClass('animated fadeInLeft animated1')
        }

        if (curScrollTop+windowH-serviceContent4Top > 0) {
            $('.service-content4').addClass('animated fadeInRight animated1')
        }

        if (curScrollTop+windowH-serviceContent5Top > 0) {
            $('.service-content5').addClass('animated fadeInLeft animated1')
        }

        if (curScrollTop+windowH-serviceContent6Top > 0) {
            $('.service-content6').addClass('animated fadeInRight animated1')
        }

        if (curScrollTop+windowH-serviceContent7Top > 0) {
            $('.service-content7').addClass('animated fadeInLeft animated1')
        }

        if (curScrollTop+windowH-serviceContent8Top > 0) {
            $('.service-content8').addClass('animated fadeInRight animated1')
        }
    }

    serviceContentShow(curScrollTop);

    $(window).scroll(function(){
        curScrollTop = $(this).scrollTop();   //页面滚动的高度
        serviceContentShow(curScrollTop)
    })
})