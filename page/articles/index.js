$(function() {
    let toast = $(document).dialog({
        type : 'toast',
        infoIcon: '../../public/image/loading.gif',
        infoText: '',
    });
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
   }
   let id = GetQueryString('id');
   activeLineShow(id);
   $('.tab').removeClass('tab-active');
   $('.tab').eq(id).addClass('tab-active');
   $('.list-wrapper').fadeOut(100);
   $('.list-wrapper').eq(id).fadeIn(200);
    $('.consult-index-main').click(function(){
        window.location.href = "../news/index.html";
    })

    $('.tab-bar .tab').click(function() {
        if ($(this).prop("className").indexOf('tab-active') == -1) {
            var left = $(this).position().left + 25;
            $('.tab-bar .slider').animate({
                left: left + "px"
            }, {
                duration: 200,
                easing: "swing"
            })
            var index = $(this).index()-2;
    
            $('.list-wrapper').fadeOut(100);
            switch (index) {
                case 0:
                    $('.list-wrapper').eq(index).slideDown(200);
                    break;
                case 1:
                    $('.list-wrapper').eq(index).fadeIn(200);
                    break
                case 2:
                    $('.list-wrapper').eq(index).fadeIn(200);
                    break;
            }
            
            activeLineShow(index);
    
            $('.tab').removeClass('tab-active')
            $(this).addClass('tab-active')
        }
    })

    function activeLineShow(index){//滑动线
        if (index == 0) {
            $('.active-line').css('top','54px');
        } else if (index == 1) {
            $('.active-line').css('top','154px');
        } else if (index == 2) {
            $('.active-line').css('top','254px');
        }
    }

    var categoryIdArr = ['9776c97617df461db8f491ae0028ec7c', '083c19637f5b42679c7b91791f31c6a9', '0fb077adbceb4709ab4b7f50e7a44298'];


    var page = [
        { "pageSize": 10, "pageNo": 1 },
        { "pageSize": 10, "pageNo": 1 },
        { "pageSize": 10, "pageNo": 1 },
    ]

    $('.list-wrapper').each(function(index, element) {
        var html = [];
        console.log(index)
        httpGet( api.articleList1,{ categoryId: categoryIdArr[index], paging: true, pageSize: page[index].pageSize, pageNo: page[index].pageNo },
            function success(res){
                var data = res.data.data;
                var totalPage = res.data.totalPage;
                for (var m = 0; m < data.length; m++) {
                    html.push('<div class="list-item"><a class="in"  href="info.html?index='+index+'&id=' + data[m].id + '"><div class="item-date">');
                    html.push('<div class="day">' + data[m].createDate[2] + '</div>');
                    html.push('<div class="mouth">' + data[m].createDate[0] + '-' + data[m].createDate[1] + '</div>');
                    html.push('</div>');
                    html.push('<div class="item-content"><h3 class="title">' + data[m].title + '</h3>');
                    html.push('<p class="publish">发布者：' + data[m].author + '</p>');
                    html.push('<p class="description">' + data[m].description + '</p>');
                    html.push('</div></a></div>');
                }
                $('.list-wrapper').eq(index).find('.list').html(html.join(''));
                if(totalPage != page[index].pageNo){
                    $('.list-wrapper').eq(index).find('.load-more-btn').fadeIn();
                }
            },
            function complete(xhr, status) {
                //关闭loading
                if (toast) {
                    toast.update({
                        infoIcon: '../../public/image/loading.gif',
                        infoText: '正在处理',
                        autoClose: 1,
                    });
                }
            },
            function error(xhr, type){
                $(document).dialog({
                    type : 'notice',
                    infoText: xhr && xhr.message ? xhr.message : '请求失败',
                    autoClose: 1500,
                    position: 'center' 
                });
            }
        )
    })




    $(".load-more-btn").click(function() {
        toast = $(document).dialog({
            type : 'toast',
            infoIcon: '../../public/image/loading.gif',
            infoText: '',
        });
        var pageNo = page[id].pageNo+=1;
        httpGet( api.articleList1,{ categoryId: categoryIdArr[id], paging: true, pageSize: page[id].pageSize, pageNo: pageNo },
            function success(res){
                var data = res.data.data;
                var totalPage = res.data.totalPage;
                var html=[];
                 for (var m = 0; m < data.length; m++) {
                    html.push('<div class="list-item"><a class="in"  href="info.html?index='+id+'&id=' + data[m].id + '"><div class="item-date">');
                    html.push('<div class="day">' + data[m].createDate[2] + '</div>');
                    html.push('<div class="mouth">' + data[m].createDate[0] + '-' + data[m].createDate[1] + '</div>');
                    html.push('</div>');
                    html.push('<div class="item-content"><h3 class="title">' + data[m].title + '</h3>');
                    html.push('<p class="publish">发布者:' + data[m].author + '</p>');
                    html.push('<p class="description">' + data[m].description + '</p>');
                    html.push('</div></a></div>');
                }
                if (html.length > 0) {
                    page[id].pageNo = pageNo;
                }
                $('.list-wrapper').eq(id).find('.list').append(html.join(''));
                if(totalPage > Number(page[id].pageNo)){
                    $('.list-wrapper').eq(id).find('.load-more-btn').fadeIn();
                } else {
                    $('.list-wrapper').eq(id).find('.load-more-btn').fadeOut();

                }
                console.log(totalPage ,pageNo, page[id].pageNo)
            },
            function complete(xhr, status) {
                //关闭loading
                if (toast) {
                    toast.update({
                        infoIcon: '../../public/image/loading.gif',
                        infoText: '正在处理',
                        autoClose: 1,
                    });
                }
            },
            function error(xhr, type){
                $(document).dialog({
                    type : 'notice',
                    infoText: xhr && xhr.message ? xhr.message : '请求失败',
                    autoClose: 1500,
                    position: 'center' 
                });
            }
        )


    })

})