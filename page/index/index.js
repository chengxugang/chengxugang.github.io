$(function() {
    //--开启loading
    // let toast = $(document).dialog({
    //         type : 'toast',
    //         infoIcon: '../../public/image/loading.gif',
    //         infoText: '',
    //     });
    //--关闭loading
    // toast.update({
    //     infoIcon: '../../public/image/icon/loading.gif',
    //     infoText: '正在处理',
    //     autoClose: 1,
    // });
    //--信息提示框
    // $(document).dialog({
    //     type : 'notice',
    //     infoText: '请求失败',
    //     autoClose: 1500,
    //     position: 'center' 
    // });

    //点击事件
    // $('.phone').click(function(){

    // })

    //请求数据
    // httpGet( api.SDLoanDetailConfirm,{orderId:orderId},
    //     function success(result){
    //         $(document).dialog({
    //             type : 'notice',
    //             infoText: '请求成功',
    //             autoClose: 1500,
    //             position: 'center' 
    //         });
    //     },
    //     function complete(xhr, status) {
    //         //关闭loading
    //         if (toast) {
    //             toast.update({
    //                 infoIcon: '../../public/image/icon/loading.gif',
    //                 infoText: '正在处理',
    //                 autoClose: 1,
    //             });
    //         }
    //     },
    //     function error(xhr, type){
    //         $(document).dialog({
    //             type : 'notice',
    //             infoText: xhr && xhr.message ? xhr.message : '请求失败',
    //             autoClose: 1500,
    //             position: 'center' 
    //         });
    //     }
    // )


    // $('.tab').hover(function() {
    //     var index = $(this).index();
    //     $(this).addClass('tab-' + (index + 1) + '-on')
    // }, function() {
    //     var index = $(this).index();
    //     $(this).removeClass('tab-' + (index + 1) + '-on')
    // })

    $.get(api.bannerList, { categoryId: '988955659bfe4ce9acebf0afd26e1cc9' }, function(res) {
        if (res.code == 200) {
            var data = res.data;
            var html = [];
            for (var i = 0; i < data.length; i++) {
                html.push('<div class="swiper-slide">')
                html.push('<img src="' + data[i].imgUrl + '"/>')
                html.push('</div')
            }
            $('.swiper-wrapper').html(html.join(''));

            window.setTimeout(function() {
                var swiper = new Swiper('.swiper-container', {
                    speed: 500,
                    autoplay: 4400,
                    autoplayDisableOnInteraction: false,
                    effect: 'fade',
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    onSlideChangeStart: function(swiper) {
                        nextSlide = swiper.slides.eq(swiper.activeIndex);
                    },
                    onSlideChangeEnd: function(swiper) {
                        prevSlide = swiper.slides[swiper.previousIndex];
                        prevSlide.className = "swiper-slide";
                    },
                });
            }, 1000)
        }
    }, "json")


})