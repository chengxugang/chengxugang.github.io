$(function() {
    let toast = $(document).dialog({
        type : 'toast',
        infoIcon: '../../public/image/loading.gif',
        infoText: '',
    });
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    var id = getQueryString('id');
    var index = getQueryString('index');
    activeLineShow(index);
    $('.tab').removeClass('tab-active');
    $('.tab').eq(index).addClass('tab-active');
    $('.list-wrapper').fadeOut(100);
    $('.list-wrapper').eq(index).fadeIn(200);
    switch(index){
        case '0': $('.tab-name').html('公司新闻');break;
        case '1': $('.tab-name').html('企业动态');break;
        case '2': $('.tab-name').html('法学院');break;
    }
    $('.consult-index').click(function(){
        window.location.href = "../news/index.html";
    })
    $('.consult-list').click(function(){
        window.location.href = "./index.html?id="+index;
    })

    $('.tab-bar .tab').click(function() {
        let index = $(this).index()-1;
        window.location.href = "./index.html?id="+index;
    })

    function activeLineShow(index){//滑动线
        if (index == 0) {
            $('.active-line').css('top','18px');
        } else if (index == 1) {
            $('.active-line').css('top','118px');
        } else if (index == 2) {
            $('.active-line').css('top','218px');
        }
    }

    if(id){
        httpGet(api.articleInfo,{id: id},
            function success(res){
                var html=[];
                html.push('<div class="date"><div class="day">'+res.data.createDate[2]+'</div><div class="mouth">'+res.data.createDate[0]+'-'+res.data.createDate[1]+'</div></div>');
                html.push('<div class="article-content-wrapper"><h1 class="title">'+res.data.title+'</h1><p class="publisher">发布者：'+res.data.author+'</p> <div class="article-content">'+res.data.articleData.content+'</div></div>')
                $('#content').html(html.join(''))
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
    }

   
})