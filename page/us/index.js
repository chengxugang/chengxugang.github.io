
$(function(){
    const categoryId2 = '03bcbcc95e9a4f0995bb7e2effa7eb99';
    const categoryId3 = '6d87c54a1e11431784bca55f47f0b211';
    const categoryId1 = 'de071b4d08d047c8bb6d19637a0b286b';
    const categoryId4 = 'd3cf9473b09146d582281d96b8a72b7e';//合作法院
    const categoryId5 = 'ccbc3f76e5f04d1a9e7b68908bbff35d';//合作院校
    const categoryId6 = 'd2c10449dd6141ab813b8649c6340869';//合作金融机构
    const keyword = 2;
    let pageSize = 6;
    let pageNo = 1;
    let totalPage = 1;
    let resultData = [];
    let curNum = 0;
    let allCount = 0;
    const viewer = new Viewer(document.getElementById('big-image'), {
        title: false,
        toolbar: {
            zoomIn: 4,
            zoomOut: 4,
            oneToOne: 4,
            reset: 4,
            prev: 0,
            play: {
              show: 0,
            },
            next: 0,
            rotateLeft: 4,
            rotateRight: 4,
            flipHorizontal: 4,
            flipVertical: 4,
          },
        next: false,
        navbar: false,
    });
    
    //--开启loading
    let toast = $(document).dialog({
        type : 'toast',
        infoIcon: '../../public/image/loading.gif',
        infoText: '',
    });
    let Swiper1 = new Swiper('.swip1', {
        slidesPerView : pageSize,
        fade: {
            crossFade: true
        },
        onSlideChangeEnd: function(swiper){
        },
        observer:true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents:true//修改swiper的父元素时，自动初始化swiper
    });
    let Swiper2 = new Swiper('.swip2', {
        slidesPerView : pageSize,
        initialSlide : pageSize - 1,
        fade: {
            crossFade: true
        },
        onSlideChangeEnd: function(swiper){
            if(resultData.length > 0) {
                console.log('swiper.activeIndex',swiper.activeIndex)
                curNum = Math.abs(resultData.length - 1 -swiper.activeIndex);
                if (curNum > -1 && curNum < resultData.length) {
                    $('.swip2 span').html(resultData[curNum].createDate[0]+'年'+resultData[curNum].createDate[1]+'月');
                }
                console.log('swiper.curNum',curNum,pageNo)
                if (curNum === resultData.length-1 && totalPage === pageNo) {
                    $('#btn1').addClass('top-active');
                    $('#btn2').removeClass('top-active');
                } else if (curNum === 0 && pageNo === 1) {
                    $('#btn2').addClass('top-active');
                    $('#btn1').removeClass('top-active');
                } else {
                    $('#btn2').addClass('top-active');
                    $('#btn1').addClass('top-active');
                }
                $('.swip1 .module').removeClass('module1').removeClass('module2');
                $('.swip1 .module').eq(curNum).addClass('module2');
                if (curNum < pageSize-1) {
                    $('.swip1 .module').eq(curNum+1).addClass('module1');
                }
                if (curNum > 0) {
                    $('.swip1 .module').eq(curNum-1).addClass('module1');
                }
            }
        },
        observer:true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents:true//修改swiper的父元素时，自动初始化swiper
    });
    
    function articleList1 (add){
        //发展历程
        httpGet( api.articleList1,{categoryId: categoryId1,paging: true,pageSize:pageSize,pageNo:pageNo},
            function success(result){
                resultData = result.data && result.data.data ? result.data.data : [];
                totalPage = result.data && result.data.totalPage ? result.data.totalPage : 1;
                allCount = result.data && result.data.allCount ? result.data.allCount : 0;
                let contentShow = '';
                let contentShowSlide = '';
                for (let i = 0; i < resultData.length; i++) {
                    let item = resultData[i];
                    contentShow += '<div class="swiper-slide">'+
                                        '<div class="module">'+
                                            '<div class="module-time flex flex-direction-column">'+
                                                '<span>'+item.createDate[0]+'年</span>'+
                                                '<span>'+item.createDate[1]+'月</span>'+
                                            '</div>'+
                                            '<div class="module-content flex flex-justify-content-center">'+
                                                '<span class="line flex-1"><span></span></span>'+
                                                '<span class="title flex-1">'+item.title+'</span>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>';
                    if (i == resultData.length - 1) {
                        contentShowSlide += '<div class="swiper-slide"><span></span></div>';
                    } else {
                        contentShowSlide += '<div class="swiper-slide"></div>';
                    }
                }
                contentShowSlide += '<div class="swiper-slide"></div><div class="swiper-slide"></div><div class="swiper-slide"></div><div class="swiper-slide"></div><div class="swiper-slide"></div>';
                $('.swip1 .swiper-wrapper').html(contentShow);
                $('.swip2 .swiper-wrapper').html(contentShowSlide);
                if(add){
                    Swiper2.slideTo(pageSize-1);
                    $('.swip2 span').html(resultData[0].createDate[0]+'年'+resultData[0].createDate[1]+'月');
                } else {
                    Swiper2.slideTo(0);
                    $('.swip2 span').html(resultData[resultData.length-1].createDate[0]+'年'+resultData[resultData.length-1].createDate[1]+'月');
                }
                if (allCount > pageSize && pageNo !== totalPage) {
                    $('#btn2').addClass('top-active');
                }
                $('.swip1 .module').removeClass('module1').removeClass('module2');
                $('.swip1 .module').eq(curNum).addClass('module2');
                if (curNum < pageSize-1) {
                    $('.swip1 .module').eq(curNum+1).addClass('module1');
                }
                if (curNum > 0) {
                    $('.swip1 .module').eq(curNum-1).addClass('module1');
                }
                
            },
            function complete(xhr, status) {
                if (toast) {
                    //--关闭loading
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
    
    (function foundersExecutives() {
        articleList1(true);
        //创始人及高管
        httpGet( api.articleList1,{categoryId: categoryId2},
            function success(result){
                let resultData = result.data ? result.data : [];
                let contentShow = '';
                for (let i = 0; i < resultData.length; i++) {
                    let item = resultData[i]
                    contentShow += '<div class="module" style="background-image: url('+item.image+')">'+
                                    '<div class="module-content animated bounceInDown">'+
                                        '<div class="module-box">'+
                                            '<div class="name">'+item.title+'</div>'+
                                            '<div>'+
                                                item.keywords+
                                            '</div>'+
                                            '<div class="hr_"></div>'+
                                            '<div>'+item.description+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>';
                }
                $('.team-module').append(contentShow);
                // $('.team-module .module').hover(function(){
                //     console.log(1)
                //     $(this).find('.module-content').addClass('bounceInDown').removeClass('fadeOutDown');
                // },function(){
                //     console.log(2)
                //     $(this).find('.module-content').addClass('fadeOutDown').removeClass('bounceInDown');
                // });
                // $('.team-module .module').mouseover(function() {
                //     // 鼠标移入时添加hover类
                //     $(this).find('.module-content').addClass('animated').addClass('bounceInDown');

                // })
                // $('.team-module .module').mouseout(function() {
                //     // 鼠标移出时移出hover类
                //     $(this).find('.module-content').addClass('animated').addClass('bounceOutDown');
                // });
                
            },
            function complete(xhr, status) {
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

        //团队活动
        httpGet( api.articleList1,{categoryId: categoryId3},
            function success(result){
                let resultData = result.data ? result.data : [];
                let contentShow = '';
                for (let index = 0; index < resultData.length; index++) {
                    let item = resultData[index];
                    contentShow += '<div class="swiper-slide">'+
                                    '<div class="swiper-img">'+
                                        '<img src="'+item.image+'" alt="'+item.title+'"/>'+
                                    '</div>'+
                                    '<div class="swiper-line">'+
                                        '<span class="line-tip"></span>'+
                                    '</div>'+
                                    '<div class="swiper-description">'+
                                        '<div class="time-description">'+item.createDate[0]+'.'+item.createDate[1]+'.'+item.createDate[2]+'</div>'+
                                        '<div>'+item.description+'</div>'+
                                    '</div>'+
                               '</div>';
                }
                $('.swip3 .swiper-wrapper').append(contentShow);
                $('.swip3 .swiper-slide').eq(1).find('.swiper-img').addClass('swiper-img1');
                $('.swip3 .swiper-slide').click(function(){
                    let curImgIndex = $(this).index();
                    $('#big-image').attr('src',resultData[curImgIndex]['image']);
                    viewer.show();
                })
                if (resultData.length > 3) {
                    $('#btn4').addClass('top-active');
                }
                let mySwiper = new Swiper('.swip3', {
                    slidesPerView : 3,
                    spaceBetween : 20,
                    nextButton: '#btn4',
                    prevButton: '#btn3',
                    onSlideChangeEnd: function(swiper){
                        console.log(swiper.activeIndex+1)
                         if (resultData.length > 3) {
                            if (swiper.activeIndex > 0) {
                                $('#btn3').addClass('top-active');
                            } else {
                                $('#btn3').removeClass('top-active');
                            }
                            if (swiper.activeIndex === resultData.length-3) {
                                $('#btn4').removeClass('top-active');
                            } else {
                                $('#btn4').addClass('top-active');
                            }
                            $('.swip3 .swiper-img').removeClass('swiper-img1');

                            $('.swip3 .swiper-slide').eq(swiper.activeIndex+1).find('.swiper-img').addClass('swiper-img1');

                                
                        }
                    },
                    observer:true,//修改swiper自己或子元素时，自动初始化swiper
                    observeParents:true//修改swiper的父元素时，自动初始化swiper
    
                });
         
            },
            function complete(xhr, status) {
                
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
    })();

    $('#btn2').click(function(){
        curNum++;
        if (curNum < resultData.length) {
            Swiper2.slidePrev();
            console.log(resultData)
            // $('.swip2 span').html(resultData[curNum].createDate[0]+'年'+resultData[curNum].createDate[1]+'月');
        } else if (pageNo < totalPage) {
            curNum = 0;
            pageNo++;
            toast = $(document).dialog({
                type : 'toast',
                infoIcon: '../../public/image/loading.gif',
                infoText: '',
            });
            articleList1(true);
        }
    })

    $('#btn1').click(function(){
        curNum--;
        if (curNum > -1) {
            Swiper2.slideNext();
            console.log(resultData)
            // $('.swip2 span').html(resultData[curNum].createDate[0]+'年'+resultData[curNum].createDate[1]+'月');
        } else if (pageNo > 1) {
            curNum = pageSize-1;
            pageNo--;
            toast = $(document).dialog({
                type : 'toast',
                infoIcon: '../../public/image/loading.gif',
                infoText: '',
            });
            
            articleList1(false);
        }
    })

    $('.tabpane').hide();
    $('.tabpane').eq(0).show();

    $('.tab-m').click(function(){
        $('.tab-m').removeClass('tab-active');
        let index = $(this).index()-1;
        if (index == 0) {
            $('.tab-nav .active-line').css('top','18px');
        } else if (index == 1) {
            $('.tab-nav .active-line').css('top','118px');
        } else if (index == 2) {
            $('.tab-nav .active-line').css('top','218px');
        }
        $(this).addClass('tab-active');
        
        $('.tabpane').hide();
        $('.tabpane').eq(index).show();
    })

    let toast1 = null;
    const al = '../../public/image/al.png';
    // const provinceInitial = ['A','B','C','F','G','H','J','L','N','Q','S','T','X','Y','Z'];
    const provinceInitial = ['G','H','Y'];
    //省份首字母
    (function provinceInitialShow(){
        let contentShow = '';
        for (let index = 0; index < provinceInitial.length; index++) {
            let item = provinceInitial[index];
            contentShow += '<span class="court-name">'+item+'</span>';
        }
        $('.province-screening').append(contentShow);
        $('.province-screening .court-name').eq(keyword).addClass('active');
        $('.province-screening .court-name').click(function(){
            toast1 = $(document).dialog({
                type : 'toast',
                infoIcon: '../../public/image/loading.gif',
                infoText: '',
            });
            cooperationCourtList(provinceInitial[$(this).index()-1]);
            $('.province-screening .court-name').removeClass('active');
            $('.province-screening .court-name').eq($(this).index()-1).addClass('active');
        })
    })();
    
    //合作法院
    cooperationCourtList(provinceInitial[keyword]);
    function cooperationCourtList(curKeyword){
        httpGet( api.cooperationCourtList,{parentId: categoryId4,keyword:curKeyword},
            function success(result){
                let resultData = result.data ? result.data : [];
                let contentShow = '';
                for (let index = 0; index < resultData.length; index++) {
                    let item = resultData[index];
                    let courtContent = '';
                    for (let i = 0; i < item['child'].length; i++) {
                        let val = item['child'][i];
                        let courtMain = '';
                        for (let o = 0; o < val['child'].length; o++) {
                            let ii = val['child'][o];
                            courtMain += '<span data-url="'+ii['href']+'">'+ii['name']+'</span>';
                        }
                        console.log(courtMain)
                        courtContent += '<div class="court-content">'+
                                            '<div class="court-adress">'+val['name']+'</div>'+
                                            '<div class="court-main flex flex-wrap-wrap">'+
                                                courtMain+
                                            '</div>'+
                                        '</div>';
                    }
                    console.log(courtContent)
                    contentShow += '<div class="court-module">'+
                                        '<div class="title"><span class="province-initial">'+curKeyword+'</span><span class="title-name">'+item['name']+'</span></div>'+
                                        courtContent+
                                    '</div>';
                }
                console.log(contentShow)
                $('.court-box').html(contentShow);
                $('.court-main span').click(function(){
                    window.open($(this).attr('data-url'))
                })
            },
            function complete(xhr, status) {
                if (toast1) {
                    //--关闭loading
                    toast1.update({
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

    //合作院校
    cooperativeCollegesList();
    function cooperativeCollegesList(){
        httpGet( api.articleList1,{categoryId: categoryId5},
            function success(result){
                let resultData = result.data ? result.data : [];
                let contentShow = '';
                for (let index = 0; index < resultData.length; index++) {
                    let item = resultData[index];
                    contentShow += '<img src="'+item['image']+'"></span>';
                }
                console.log(contentShow)
                $('.cooperative-colleges-content').html(contentShow);
            },
            function complete(xhr, status) {
               
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

    //合作金融机构
    cFInstitutionsList();
    function cFInstitutionsList(){
        httpGet( api.articleList1,{categoryId: categoryId6},
            function success(result){
                let resultData = result.data ? result.data : [];
                let contentShow = '';
                for (let index = 0; index < resultData.length; index++) {
                    let item = resultData[index];
                    contentShow += '<img src="'+item['image']+'"></span>';
                }
                console.log(contentShow)
                $('.c-f-institutions-content').html(contentShow);
            },
            function complete(xhr, status) {
               
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

    // $('.cooperation-court-content').append(cooperationCourtShow);
    //合作金融机构
    // let cFInstitutionsShow = '';
    // for (let item of cFInstitutions) {
    //     cFInstitutionsShow += '<img src="'+item.img+'" alt="'+item.title+'"/>';
    // }
    // $('.c-f-institutions-content').append(cFInstitutionsShow);
    //合作院校
    // let cooperativeCollegesShow = '';
    // for (let item of cooperativeColleges) {
    //     cooperativeCollegesShow += '<img src="'+item.img+'" alt="'+item.title+'"/>';
    // }
    // $('.cooperative-colleges-content').append(cooperativeCollegesShow);


})