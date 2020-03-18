$(function() {
    let articleListArr = [];
    $.get(api.bannerList, { categoryId: 'a67413a1b18849139d5d13e9d4d04885' }, function(res) {
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
                });
            }, 1000)
        }
    }, "json")


    $('.tab').click(function() {
        var left = $(this).position().left;
        $('.tabbar .slider').animate({
            left: left + "px"
        }, {
            duration: 200,
            easing: "swing"
        })
        var index = $(this).index()-1;

        $('.tab').removeClass('tab-active');
        $('.tab').eq(index).addClass('tab-active');

        $('.tab-content').fadeOut(100);
        switch (index) {
            case 0:
                $('.tab-content').eq(index).slideDown(200);
                break;
            case 1:
                $('.tab-content').eq(index).fadeIn(200);
                break
            case 2:
                $('.tab-content').eq(index).fadeIn(200);
                break;
        }
        console.log(articleListArr)
        
        let description = articleListArr[index][0] && articleListArr[index][0]['description'] ? articleListArr[index][0]['description'] : '';
        console.log(description)
        $('.articles>.left>.abstract').html(description)
        $('.articles>.left>.title').html($('.tab-content').eq(index).children('.article-item').first().children('.article-title').html())
    })

    var categoryIdArr = ['9776c97617df461db8f491ae0028ec7c', '083c19637f5b42679c7b91791f31c6a9', '0fb077adbceb4709ab4b7f50e7a44298'];

    $('.tab-content').each(function(index, element) {
        var html = [];
        $.get(api.articleList, { categoryId: categoryIdArr[index], paging: false }, function(res) {
            if (res.code == 200) {
                var data = res.data;
                articleListArr[index] = res.data;
                for (var m = 0; m < (data.length > 2 ? 3 : data.length); m++) {
                    html.push('<div class="article-item" data-index="'+index+'">');
                    html.push('<div class="article-date">' + data[m].createDate[0]+'-'+ data[m].createDate[1]+'-' + data[m].createDate[2] + '</div>');
                    html.push('<a class="article-title">' + data[m].title + '</a>');
                    html.push('</div>');
                }
                if (index == 0) {
                    $('.articles>.left>.title').html(data[0].title)
                    $('.articles>.left>.abstract').html(data[0].description)
                }
                $('.tab-content').eq(index).html(html.join('') + '<div class="more"><a href="../articles/index.html?id='+index+'">更多>></a></div>');
                $('.article-item').click(function(){
                    let _index = $(this).attr('data-index');
                    let _id = articleListArr[_index][$(this).index()]['id'];
                    window.location.href = '../articles/info.html?index='+_index+'&id='+_id;
                })    
            }
        }, "json")
    })

})