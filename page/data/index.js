

$(function(){
    //--开启loading
    let toast = $(document).dialog({
        type : 'toast',
        infoIcon: '../../public/image/loading.gif',
        infoText: '',
    });
    
    let myChart1 = null;
    let myChart2 = null;
    let myChart3 = null;
    let myChart4 = null;
    let myChart5 = null;
    let myChartIf1 = true;
    let myChartIf2 = true;

    let windowH,curScrollTop,myChartOffsetTop1,myChartOffsetTop2;
    windowH = $(window).height();    //浏览器窗口高度
    let myChartPosition1 = $(".title-subtext");//标的物分类占比情况
    let myChartPosition2 = $('.chart4');//外勤任务数
    let option1 = null;
    let option2 = null;
    let option3 = null;
    let option4 = null;
    let option5 = null;
    let upIf1 = null;
    let upIf2 = null;

    $(window).scroll(function(){
        curScrollTop = $(this).scrollTop();   //页面滚动的高度
        myChartOffsetTop1 = myChartPosition1.offset().top + 100;
        myChartOffsetTop2 =  myChartPosition2.offset().top + 100;
        if (upIf1 === '0') {
            if (curScrollTop-myChartOffsetTop1 < 0 && myChartIf1 && option1 && myChart1 && option2 && myChart2 && option3 && myChart3 && option4 && myChart4) {
                myChartIf1 = false;
                myChart1.setOption(option1);
                myChart2.setOption(option2);
                myChart3.setOption(option3);
                myChart4.setOption(option4);
            } 
        } else if(upIf1 === '1') {
            if (windowH+curScrollTop>myChartOffsetTop1 && myChartIf1 && option1 && myChart1 && option2 && myChart2 && option3 && myChart3 && option4 && myChart4) {
                myChartIf1 = false;
                myChart1.setOption(option1);
                myChart2.setOption(option2);
                myChart3.setOption(option3);
                myChart4.setOption(option4);
            } 
        }
        console.log('sddd',curScrollTop-myChartOffsetTop2)
        if (upIf2 === '0') {
            if (curScrollTop-myChartOffsetTop2 < 0 && myChartIf2 && option5 && myChart5) {
                myChartIf2 = false;
                myChart5.setOption(option5);
                $('.data-module4 .module').addClass('fadeInLeft');
            } 
        } else if(upIf2 === '1') {
            if (windowH+curScrollTop>myChartOffsetTop2 && myChartIf2 && option5 && myChart5) {
                myChartIf2 = false;
                myChart5.setOption(option5);
                $('.data-module4 .module').addClass('fadeInLeft');
            } 
        }

        

    });

    (function pretreatment () {//预处理
        //全国接受委托标的物分布情况
        httpGet( api.countCity,{},
            function success(result){
                let resultData = result.data ? result.data : {};
                let total = resultData.total ? resultData.total.toString() : '0';
                let totalNum = resultData.total ? resultData.total : 0;
                $("#dataNums").css('width',total.length * 40 + 25 +'px');
                $("#dataNums").rollNum({
                    deVal: totalNum
                });

                let topList = resultData.topList ?resultData.topList : [];
                let list = resultData.list ?resultData.list : [];
                drawChart(list,topList);
                topTableShow(topList,totalNum);
            },
            function complete(xhr, status) {
                countTypeGet();
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

    function countTypeGet() {
        //标的物分类占比情况
        httpGet( api.countType,{},
            function success(result){
                let _data1 = result.data[0]? result.data[0] : {};
                let _data2= result.data[1]? result.data[1] : {};
                let _data3 = result.data[2]? result.data[2] : {};
                let _data4 = result.data[3]? result.data[3] : {};
                $('.chart2-1 .title-subtext').text('总计：'+_data1.total);
                $('.chart2-2 .title-subtext').text('总计：'+_data2.total);
                $('.chart2-3 .title-subtext').text('总计：'+_data3.total);
                $('.chart2-4 .title-subtext').text('总计：'+_data4.total);
                $('.chart-legend-text1').each(function(index, element) {
                    $(this).html((_data1.data[index]['value']/_data1.total*100).toFixed(2)+'%')
                })
                $('.chart-legend-text2').each(function(index, element) {
                    $(this).html((_data2.data[index]['value']/_data2.total*100).toFixed(2)+'%')
                })
                $('.chart-legend-text3').each(function(index, element) {
                    $(this).html((_data3.data[index]['value']/_data3.total*100).toFixed(2)+'%')
                })
                $('.chart-legend-text4').each(function(index, element) {
                    $(this).html((_data4.data[index]['value']/_data4.total*100).toFixed(2)+'%')
                })
                drawChart1(_data1);
                drawChart2(_data2);
                drawChart3(_data3);
                drawChart4(_data4);
            },
            function complete(xhr, status) {
                countCourtGet();
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

    function countCourtGet() {
        //合作法院分布情况
        httpGet( api.countCourt,{},
            function success(result){
                let _data = result.data? result.data : [];
                let _dataInit = [];
                
                for (let i = 0; i < _data.length; i++) {
                    let item = _data[i];
                    let _name = item.name;
                    if (item.name.indexOf('省') !== -1) {
                        _name = item.name.split('省')[0];
                    } else if (item.name.indexOf('市') !== -1) {
                        _name = item.name.split('市')[0];
                    } else if (item.name.indexOf('壮族自治区') !== -1) {
                        _name = item.name.split('壮族自治区')[0];
                    }
                    let _dataColor = '';
                    let textColor = '#fff';
                    switch(i){
                        case 0: _dataColor = '#3BD6B8';break;
                        case 1: _dataColor = '#EECB6C';break;
                        case 2: _dataColor = '#E8928D';break;
                        default: _dataColor = '#fff';textColor='#333'
                    }
                    _dataInit.push(
                        {
                            name: _name,
                            value: item.num,
                            itemStyle: {
                                normal: {
                                    label:{show:true},
                                    borderColor: '#ddd',
                                    color:_dataColor,
                                    areaColor: _dataColor,
                                }, //区域颜色
                                emphasis: {
                                    label:{show:true},
                                    areaColor: _dataColor,
                                    shadowOffsetX: 0,
                                    shadowOffsetY: 0,
                                    shadowBlur: 20,
                                    borderWidth: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            label: {
                                show: true, // 是否显示对应地名
                                formatter: '{b}\n{c}家',
                                fontSize: 10,
                                textStyle: {
                                    color: textColor
                                }
                            },
                        }
                    )
                }
                console.log('_dataColor',_dataInit)
                let totalNum=  result.data && result.data[0] ? result.data[0].totalNum: 0;4
                $('.court-total').append('总共'+totalNum+'家');
                drawChart5(_dataInit);
            },
            function complete(xhr, status) {
                countTaskByMonthGet();
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

    function countTaskByMonthGet() {
        //外勤任务数
        httpGet( api.countTaskByMonth,{},
            function success(result){
                let dataInit = result.data && result.data.dates? result.data.dates : [];
                let inquestList = result.data && result.data.inquestList? result.data.inquestList : [];
                let lookList = result.data && result.data.lookList? result.data.lookList : [];
                drawChart6(dataInit,inquestList,lookList);
            },
            function complete(xhr, status) {
                countTaskGet();
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

    function countTaskGet() {
        //外勤任务数
        httpGet( api.countTask,{},
            function success(result){
                let dutyStatisticsInfo = result.data ? result.data : {};
                let inquestNumShow = '<span class="font-size17">今'+dutyStatisticsInfo.todayInquestNum+'/</span>昨'+dutyStatisticsInfo.yesterdayInquestNum;
                $('.inquest-num').append(inquestNumShow);
                let lookNumShow = '<span class="font-size17">今'+dutyStatisticsInfo.todayLookNum+'/</span>昨'+dutyStatisticsInfo.yesterdayLookNum;
                $('.look-num').append(lookNumShow);
                let todayBookNumShow = '<span class="font-size17">今'+dutyStatisticsInfo.todayBookNum+'/</span>昨'+dutyStatisticsInfo.yesterdayBookNum;
                $('.today-book-num').append(todayBookNumShow);
                let monthTaskNumShow = '<span class="font-size17">'+dutyStatisticsInfo.monthTaskNum+'</span>';
                $('.month-task-num').append(monthTaskNumShow);
                let totalTaskNumShow = '总任务数：'+dutyStatisticsInfo.totalTaskNum;
                $('.total-task-num').append(totalTaskNumShow);
                let monthBookNumShow = '<span class="font-size17">'+dutyStatisticsInfo.monthBookNum+'</span>';
                $('.month-book-num').append(monthBookNumShow);
                let totalBookNumShow = '总累计预约人数：'+dutyStatisticsInfo.totalBookNum;
                $('.total-book-num').append(totalBookNumShow);
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

    function drawChart6(dataInit,inquestList,lookList) {
        // 基于准备好的dom，初始化echarts实例
        myChart5 = echarts.init(document.getElementById('chart4'))
        // 监听屏幕变化自动缩放图表
        window.addEventListener('resize', function () {
            myChart5.resize()
        })
        // 绘制图表
        myChart5.setOption({
            color: ["#0FBDC0", "#FFCA6A"],
            title: {
                text: '',
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 'center', // 'center' | 'left' | {number},
                y: 'bottom', // 'center' | 'bottom' | {number}
                data:['勘验任务数','看样任务数'],
                textStyle: {
                    fontSize: 12,
                    color: '#fff'
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                },
                type: 'category',
                boundaryGap: false,
                data: dataInit
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            series: [
                {
                    name:'勘验任务数',
                    type:'line',
                    data: inquestList
                },
                {
                    name:'看样任务数',
                    type:'line',
                    data: lookList
                }
            ]
        }        
        )
        option5 = myChart5.getOption();
        if (myChartPosition2.offset().top > $(window).height() && (($(window).scrollTop()+$(window).height()) < (myChartPosition2.offset().top+100)||($(window).scrollTop()+$(window).height())-(myChartPosition2.offset().top+100) > $(window).height())) {
            myChart5.clear();  
            console.log('sdddd',2222)    
        } else {
            $('.data-module4 .module').addClass('fadeInLeft');
        }
        if (($(window).scrollTop()+$(window).height())-(myChartPosition2.offset().top+100) > $(window).height()) {
            upIf2 = '0';
        } else {
            upIf2 = '1';
        }
        
    }

    function drawChart5(dataInit) {
        // 基于准备好的dom，初始化echarts实例
        let chart = echarts.init(document.getElementById('chart3'))
        // 监听屏幕变化自动缩放图表
        window.addEventListener('resize', function () {
            chart.resize()
        })
        // 绘制图表
        chart.setOption({ // 进行相关配置
            // 提示框组件
            tooltip: {
                trigger: 'item', // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
                // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
                // 使用函数模板  传入的数据值 -> value: number | Array
                formatter: function (val) {
                    if (val.data) {
                        return val.data.name + '：' + val.data.value + '家'
                    } 
                }
            },
            series: [
              {
                name: '', // 浮动框的标题
                type: 'map',
                map: 'china', 
                // geoIndex: 0,
                data: dataInit,// 文本位置修正
                itemStyle: {
                    normal: {
                        borderColor: '#ddd',
                        areaColor: '#fff'
                    },
                    emphasis: {
                        label:{show:true},
                        areaColor: '#eee',
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowBlur: 20,
                        borderWidth: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
              }
            ]
          })
           
    }

    function drawChart1(dataInit1) {
        // 基于准备好的dom，初始化echarts实例
        myChart1 = echarts.init(document.getElementById('chart2-1'));
        // 监听屏幕变化自动缩放图表
        window.addEventListener('resize', function () {
            myChart1.resize()
        })
        // 绘制图表
        myChart1.setOption({
            color: ['#3BD6B8','#EECB6C','#E8928D'],
            legend: {
                show: false
            },
            tooltip: {
                show:true,
                trigger: 'item',
                position: ['48%', '48%'],
                backgroundColor: 'implements',
                textStyle:{
                    color: '#fff',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontFamily: 'sans-serif',
                    fontSize: 14,
                },
                formatter: '<div class="chart-tooltip">{d}%<div class="font-size11 gray-style">({b})</div></div>'
            },
            graphic:{            //echarts饼图中间放字
                type:'image',
                left: '44.5%',
                top: '50%',
			    zlevel:10,
                style:{
                    image: './image/fang.png',
                    width: 26,
                    height: 26,
                },
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    hoverAnimation: false,
                    tooltip: {
                        show: false
                    },
                    radius: ['84%', '85%'],
                    center: ['50%', '56%'],
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        value: 100
                    }],
                    label: {
                        show: false,
                    },  
                },
                {
                    name: '',
                    type: 'pie',
                    hoverAnimation: false,
                    tooltip: {
                        show: false
                    },
                    radius: ['80%', '81%'],
                    center: ['50%', '56%'],
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        value: 100
                    }],
                   
                    label: {
                        show: false,
                    },  
                },
                {
                    name: '一拍',
                    type: 'pie',
                    hoverOffset: 5,
                    radius: ['60%', '68%'],
                    center: ['50%', '56%'],
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        hoverAnimation: false,
                        tooltip: {
                            show: false
                        },
                        value: dataInit1.total - dataInit1.data[0].value
                    },dataInit1.data[0]],
                    label: {
                        show: false,
                    },
                },
                {
                    name: '二拍',
                    type: 'pie',
                    radius: ['48%', '56%'],
                    center: ['50%', '56%'],
                    hoverOffset: 5,
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        tooltip: {
                            show: false
                        },
                        hoverAnimation: false,
                        value: dataInit1.total - dataInit1.data[1].value
                    },dataInit1.data[1]],
                    label: {
                        show: false,
                    },  
                },
                {
                    name: '变卖',
                    type: 'pie',
                    radius: ['36%', '44%'],
                    center: ['50%', '56%'],
                    hoverOffset: 5,
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        hoverAnimation: false,
                        tooltip: {
                            show: false
                        },
                        value: dataInit1.total - dataInit1.data[2].value
                    },dataInit1.data[2]],
                    label: {
                        show: false,
                    },  
                }
            ]
        }
        ) 
        option1 = myChart1.getOption();
        if (myChartPosition1.offset().top > $(window).height() && (($(window).scrollTop()+$(window).height()) < (myChartPosition1.offset().top+100)||($(window).scrollTop()+$(window).height())-(myChartPosition1.offset().top+100) > $(window).height())) {
            myChart1.clear();      
        }
        if (($(window).scrollTop()+$(window).height())-(myChartPosition1.offset().top+100) > $(window).height()) {
            upIf1 = '0';
        } else {
            upIf1 = '1';
        }
    }
    //自定义图例高亮时
    $('.chart1-legend').on('mouseover', function(e) {
        let _index = $(this).index() + 2;
        myChart1.dispatchAction({type:'showTip',seriesIndex: _index,dataIndex: 1});
        myChart1.dispatchAction({type: 'highlight',seriesIndex: _index,dataIndex: 1});
    })
    $('.chart1-legend').on('mouseout', function(e) {
        let _index = $(this).index() + 2;
        myChart1.dispatchAction({type:'hideTip',seriesIndex: _index,dataIndex: 1});
        myChart1.dispatchAction({type: 'downplay',seriesIndex: _index,dataIndex: 1});
    })
   
    function drawChart2(dataInit2) {
        // 基于准备好的dom，初始化echarts实例
        myChart2 = echarts.init(document.getElementById('chart2-2'))
        // 监听屏幕变化自动缩放图表
        window.addEventListener('resize', function () {
            myChart2.resize()
        })
        // 绘制图表
        myChart2.setOption({
            color: ['#3BD6B8','#EECB6C','#E8928D'],
            legend: {
                show: false
            },
            tooltip: {
                show:true,
                trigger: 'item',
                position: ['48%', '48%'],
                backgroundColor: 'implements',
                textStyle:{
                    color: '#fff',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontFamily: 'sans-serif',
                    fontSize: 14,
                },
                formatter: '<div class="chart-tooltip">{d}%<div class="font-size11 gray-style">({b})</div></div>'
            },
            graphic:{            //echarts饼图中间放字
                type:'image',
                left: '44.5%',
                top: '50%',
			    zlevel:10,
                style:{
                    image: './image/tudi.png',
                    width: 26,
                    height: 26,
                },
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    hoverAnimation: false,
                    tooltip: {
                        show: false
                    },
                    radius: ['84%', '85%'],
                    center: ['50%', '56%'],
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        value: 100
                    }],
                    label: {
                        show: false,
                    },  
                },
                {
                    name: '',
                    type: 'pie',
                    hoverAnimation: false,
                    tooltip: {
                        show: false
                    },
                    radius: ['80%', '81%'],
                    center: ['50%', '56%'],
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        value: 100
                    }],
                   
                    label: {
                        show: false,
                    },  
                },
                {
                    name: '一拍',
                    type: 'pie',
                    hoverOffset: 5,
                    radius: ['60%', '68%'],
                    center: ['50%', '56%'],
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        hoverAnimation: false,
                        tooltip: {
                            show: false
                        },
                        value: dataInit2.total - dataInit2.data[0].value
                    },dataInit2.data[0]],
                    label: {
                        show: false,
                    },
                },
                {
                    name: '二拍',
                    type: 'pie',
                    radius: ['48%', '56%'],
                    center: ['50%', '56%'],
                    hoverOffset: 5,
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        tooltip: {
                            show: false
                        },
                        hoverAnimation: false,
                        value: dataInit2.total - dataInit2.data[1].value
                    },dataInit2.data[1]],
                    label: {
                        show: false,
                    },  
                },
                {
                    name: '变卖',
                    type: 'pie',
                    radius: ['36%', '44%'],
                    center: ['50%', '56%'],
                    hoverOffset: 5,
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        hoverAnimation: false,
                        tooltip: {
                            show: false
                        },
                        value: dataInit2.total - dataInit2.data[2].value
                    },dataInit2.data[2]],
                    label: {
                        show: false,
                    },  
                }
            ]
        }
        )
        option2 = myChart2.getOption();
        if (myChartPosition1.offset().top > $(window).height() && (($(window).scrollTop()+$(window).height()) < (myChartPosition1.offset().top+100)||($(window).scrollTop()+$(window).height())-(myChartPosition1.offset().top+100) > $(window).height())) {
            myChart2.clear();      
        }
    }
    //自定义图例高亮时
    $('.chart2-legend').on('mouseover', function(e) {
        let _index = $(this).index() + 2;
        myChart2.dispatchAction({type:'showTip',seriesIndex: _index,dataIndex: 1});
        myChart2.dispatchAction({type: 'highlight',seriesIndex: _index,dataIndex: 1});
    })
    $('.chart2-legend').on('mouseout', function(e) {
        let _index = $(this).index() + 2;
        myChart2.dispatchAction({type:'hideTip',seriesIndex: _index,dataIndex: 1});
        myChart2.dispatchAction({type: 'downplay',seriesIndex: _index,dataIndex: 1});
    })
    function drawChart3(dataInit3) {
        // 基于准备好的dom，初始化echarts实例
        myChart3 = echarts.init(document.getElementById('chart2-3'))
        // 监听屏幕变化自动缩放图表
        window.addEventListener('resize', function () {
            myChart3.resize()
        })
        // 绘制图表
        myChart3.setOption({
            color: ['#3BD6B8','#EECB6C','#E8928D'],
            legend: {
                show: false
            },
            tooltip: {
                show:true,
                trigger: 'item',
                position: ['48%', '48%'],
                backgroundColor: 'implements',
                textStyle:{
                    color: '#fff',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontFamily: 'sans-serif',
                    fontSize: 14,
                },
                formatter: '<div class="chart-tooltip">{d}%<div class="font-size11 gray-style">({b})</div></div>'
            },
            graphic:{            //echarts饼图中间放字
                type:'image',
                left: '44.5%',
                top: '50%',
			    zlevel:10,
                style:{
                    image: './image/che.png',
                    width: 26,
                    height: 26,
                },
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    hoverAnimation: false,
                    tooltip: {
                        show: false
                    },
                    radius: ['84%', '85%'],
                    center: ['50%', '56%'],
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        value: 100
                    }],
                    label: {
                        show: false,
                    },  
                },
                {
                    name: '',
                    type: 'pie',
                    hoverAnimation: false,
                    tooltip: {
                        show: false
                    },
                    radius: ['80%', '81%'],
                    center: ['50%', '56%'],
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        value: 100
                    }],
                   
                    label: {
                        show: false,
                    },  
                },
                {
                    name: '一拍',
                    type: 'pie',
                    hoverOffset: 5,
                    radius: ['60%', '68%'],
                    center: ['50%', '56%'],
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        hoverAnimation: false,
                        tooltip: {
                            show: false
                        },
                        value: dataInit3.total - dataInit3.data[0].value
                    },dataInit3.data[0]],
                    label: {
                        show: false,
                    },
                },
                {
                    name: '二拍',
                    type: 'pie',
                    radius: ['48%', '56%'],
                    center: ['50%', '56%'],
                    hoverOffset: 5,
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        tooltip: {
                            show: false
                        },
                        hoverAnimation: false,
                        value: dataInit3.total - dataInit3.data[1].value
                    },dataInit3.data[1]],
                    label: {
                        show: false,
                    },  
                },
                {
                    name: '变卖',
                    type: 'pie',
                    radius: ['36%', '44%'],
                    center: ['50%', '56%'],
                    hoverOffset: 5,
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        hoverAnimation: false,
                        tooltip: {
                            show: false
                        },
                        value: dataInit3.total - dataInit3.data[2].value
                    },dataInit3.data[2]],
                    label: {
                        show: false,
                    },  
                }
            ]
        }
        )
        option3 = myChart3.getOption();
        if (myChartPosition1.offset().top > $(window).height() && (($(window).scrollTop()+$(window).height()) < (myChartPosition1.offset().top+100)||($(window).scrollTop()+$(window).height())-(myChartPosition1.offset().top+100) > $(window).height())) {
            myChart3.clear();      
        }
    }
    //自定义图例高亮时
    $('.chart3-legend').on('mouseover', function(e) {
        let _index = $(this).index() + 2;
        myChart3.dispatchAction({type:'showTip',seriesIndex: _index,dataIndex: 1});
        myChart3.dispatchAction({type: 'highlight',seriesIndex: _index,dataIndex: 1});
    })
    $('.chart3-legend').on('mouseout', function(e) {
        let _index = $(this).index() + 2;
        myChart3.dispatchAction({type:'hideTip',seriesIndex: _index,dataIndex: 1});
        myChart3.dispatchAction({type: 'downplay',seriesIndex: _index,dataIndex: 1});
    })
    function drawChart4(dataInit4) {
        // 基于准备好的dom，初始化echarts实例
        myChart4 = echarts.init(document.getElementById('chart2-4'))
        // 监听屏幕变化自动缩放图表
        window.addEventListener('resize', function () {
            myChart4.resize()
        })
        // 绘制图表
        myChart4.setOption({
            color: ['#3BD6B8','#EECB6C','#E8928D'],
            legend: {
                show: false
            },
            tooltip: {
                show:true,
                trigger: 'item',
                position: ['48%', '48%'],
                backgroundColor: 'implements',
                textStyle:{
                    color: '#fff',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontFamily: 'sans-serif',
                    fontSize: 14,
                },
                formatter: '<div class="chart-tooltip">{d}%<div class="font-size11 gray-style">({b})</div></div>'
            },
            graphic:{            //echarts饼图中间放字
                type:'image',
                left: '44.5%',
                top: '50%',
			    zlevel:10,
                style:{
                    image: './image/qita.png',
                    width: 26,
                    height: 26,
                },
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    hoverAnimation: false,
                    tooltip: {
                        show: false
                    },
                    radius: ['84%', '85%'],
                    center: ['50%', '56%'],
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        value: 100
                    }],
                    label: {
                        show: false,
                    },  
                },
                {
                    name: '',
                    type: 'pie',
                    hoverAnimation: false,
                    tooltip: {
                        show: false
                    },
                    radius: ['80%', '81%'],
                    center: ['50%', '56%'],
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        value: 100
                    }],
                   
                    label: {
                        show: false,
                    },  
                },
                {
                    name: '一拍',
                    type: 'pie',
                    hoverOffset: 5,
                    radius: ['60%', '68%'],
                    center: ['50%', '56%'],
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        hoverAnimation: false,
                        tooltip: {
                            show: false
                        },
                        value: dataInit4.total - dataInit4.data[0].value
                    },dataInit4.data[0]],
                    label: {
                        show: false,
                    },
                },
                {
                    name: '二拍',
                    type: 'pie',
                    radius: ['48%', '56%'],
                    center: ['50%', '56%'],
                    hoverOffset: 5,
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        tooltip: {
                            show: false
                        },
                        hoverAnimation: false,
                        value: dataInit4.total - dataInit4.data[1].value
                    },dataInit4.data[1]],
                    label: {
                        show: false,
                    },  
                },
                {
                    name: '变卖',
                    type: 'pie',
                    radius: ['36%', '44%'],
                    center: ['50%', '56%'],
                    hoverOffset: 5,
                    data: [{
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#21252E'
                            }
                        },
                        hoverAnimation: false,
                        tooltip: {
                            show: false
                        },
                        value: dataInit4.total - dataInit4.data[2].value
                    },dataInit4.data[2]],
                    label: {
                        show: false,
                    },  
                }
            ]
        }
        )
        option4 = myChart4.getOption();
        if (myChartPosition1.offset().top > $(window).height() && (($(window).scrollTop()+$(window).height()) < (myChartPosition1.offset().top+100)||($(window).scrollTop()+$(window).height())-(myChartPosition1.offset().top+100) > $(window).height())) {
            myChart4.clear();      
        }
    }
    //自定义图例高亮时
    $('.chart4-legend').on('mouseover', function(e) {
        let _index = $(this).index() + 2;
        myChart4.dispatchAction({type:'showTip',seriesIndex: _index,dataIndex: 1});
        myChart4.dispatchAction({type: 'highlight',seriesIndex: _index,dataIndex: 1});
    })
    $('.chart4-legend').on('mouseout', function(e) {
        let _index = $(this).index() + 2;
        myChart4.dispatchAction({type:'hideTip',seriesIndex: _index,dataIndex: 1});
        myChart4.dispatchAction({type: 'downplay',seriesIndex: _index,dataIndex: 1});
    })

    function topTableShow(topList,totalNum){
        let contentShow = '';
        for (let i = 0; i < topList.length; i++) {
            let index = Number(i)+1;
            let _width = Number(topList[i]['num'])/totalNum*100;
            contentShow += '<div class="table-tr"><span class="tr1">'+
                                 index +
                            '</span>'+
                            '<span class="tr2">'+
                                topList[i]['name']+
                            '</span>'+
                            '<span class="tr3">'+
                                '<span class="num-proportion"><span style="width: ' +_width+'%"></span></span>'+
                                '<span class="num-text">'+ topList[i]['num'] +'</span>'+
                            '</span></div>';
        }
        $('.wrapper-body').append(contentShow);
        setTimeout(function(){
            $('.num-proportion span').addClass('num-proportion-span');
        },500)
    }

    function drawChart(dataInit,dataSource) {
        // 基于准备好的dom，初始化echarts实例
        let chart = echarts.init(document.getElementById('chart'))
        // 监听屏幕变化自动缩放图表
        window.addEventListener('resize', function () {
            chart.resize()
        })
        // 绘制图表
        chart.setOption({
            // 图表主标题
            title: {
                text: '', // 主标题文本，支持使用 \n 换行
                top: 20, // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
                left: 'center', // 值: 'left', 'center', 'right' 同上
                textStyle: { // 文本样式
                    fontSize: 24,
                    fontWeight: 600,
                    color: '#fff'
                }
            },
            // 提示框组件
            tooltip: {
                trigger: 'item', // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
                // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
                // 使用函数模板  传入的数据值 -> value: number | Array
                formatter: function (val) {
                    console.log(val)
                    if (val.data) {
                        return val.data.name + '<br>标的物: ' + val.data.value[2]
                    }
                }
            },
            geo: {
                map: 'china', // 地图类型
                show: true, // 是否显示地理坐标系组件
                // 是否开启鼠标缩放和平移漫游 默认不开启 如果只想要开启缩放或者平移，
                // 可以设置成 'scale' 或者 'move' 设置成 true 为都开启
                roam: false,
                // 图形上的文本标签
                label: {
                    show: false // 是否显示对应地名
                },
                // 地图区域的多边形 图形样式
                itemStyle: {
                    areaColor: '#171A24', // 地图区域的颜色
                    borderWidth: 3, // 描边线宽 为 0 时无描边
                    borderColor: '#0A77C3', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
                    // borderType: 'solid' // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
                },
                // 高亮状态下的多边形和标签样式
                emphasis: {
                    label: {
                        show: true, // 是否显示标签
                        color: '#fff' // 文字的颜色 如果设置为 'auto'，则为视觉映射得到的颜色，如系列色
                    },
                    itemStyle: {
                        areaColor: '#aeaeae' // 地图区域的颜色
                    }
                }
            },
            series: [
                
                {
                    type: 'scatter', // 类型
                    coordinateSystem: 'geo', // 该系列使用的坐标系 可选: 'cartesian2d','polar','geo'
                    // 标记的图形, 标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 
                    // 'pin', 'arrow', 'none'
                    symbol: 'circle',
                    symbolSize: 6, // 标记的大小
                    // 图形的样式
                    itemStyle: {
                        color: 'yellow'
                    },
                    // 系列中的数据内容数组, 数组项通常为具体的数据项
                    data: dataInit
                },
                {
                    type: 'effectScatter', // 类型
                    coordinateSystem: 'geo', // 该系列使用的坐标系 可选: 'cartesian2d','polar','geo'
                    // 标记的图形, 标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 
                    // 'pin', 'arrow', 'none'
                    symbol: 'circle',
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke',
                        scale: 3.5
                    },
                    hoverAnimation: true,
                    // 标记的大小, 如果需要每个数据的图形大小不一样，可以设置为如下格式的回调函数 
                    // (value: Array|number, params: Object) => number|Array
                    // 其中第一个参数 value 为 data 中的数据值。第二个参数params 是其它的数据项参数
                    symbolSize: function (val) {
                        return 14
                    },
                    // 图形的样式
                    itemStyle: {
                        color: 'yellow',
                        shadowBlur: 14,
                        shadowColor: 'yellow'
                    },
                    // 系列中的数据内容数组。数组项通常为具体的数据项
                    data: dataSource
                },
                {
                    type: 'map',
                    map: 'china',
                    geoIndex: 1,
                    show: true, // 是否显示地理坐标系组件
                    // 是否开启鼠标缩放和平移漫游 默认不开启 如果只想要开启缩放或者平移，
                    // 可以设置成 'scale' 或者 'move' 设置成 true 为都开启
                    roam: false,
                    // 图形上的文本标签
                    label: {
                        show: false // 是否显示对应地名
                    },
                    itemStyle: {
                      normal: {
                        areaColor: '#171A24',
                        borderColor: '#171A24',
                        borderWidth: 1
                      },
                    },
                    // 高亮状态下的多边形和标签样式
                    emphasis: {
                        label: {
                            show: true, // 是否显示标签
                            color: '#fff' // 文字的颜色 如果设置为 'auto'，则为视觉映射得到的颜色，如系列色
                        },
                        itemStyle: {
                            areaColor: '#aeaeae' // 地图区域的颜色
                        }
                    },
                    data: []
                },
            ]
        })
    }

})