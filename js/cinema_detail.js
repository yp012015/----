mui.plusReady(function () {
	var self = plus.webview.currentWebview();
	var id = self.cinemaId;
	getCinemaShowTime(id);
});
function getCinemaShowTime (cinemaId,movieId) {
	var params;
	if(!movieId){//如果电影id不为空
		params = {
			"cinemaid":cinemaId
		}
	}else {
		params = {
			"cinemaid":cinemaId,
			"movieid":movieId
		}
	}
	console.log("params= " + JSON.stringify(params));
	console.log(httpAction.getCinemaShowTime + "?cinemaid=" + cinemaId);
	mui.ajax(httpAction.getCinemaShowTime + "?cinemaid=" + cinemaId,{
//		data:params,
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(result){
			console.log("result= " + result);
			var cinemaDetailModel = result.data.cinemaDetailModel;
			setCinemaDetailModel(cinemaDetailModel);
			setMovieDateShow(result.data.DateShow);
			$(".loading").fadeOut();
		},
		error:function(xhr,type,errorThrown){
			mui.toast("连接服务器失败，请稍后重试！");
		}
	});
}
/**
 * 设置影院的基本信息
 * @param {Object} cinemaDetailModel
 */
function setCinemaDetailModel(cinemaDetailModel) {
	//影院名称
	$(".mui-title").text(cinemaDetailModel.nm);
	$(".cinema-name").text(cinemaDetailModel.nm);
	//影院地址
	$(".stci-info p").text(cinemaDetailModel.addr);
}
/**
 * 加载电影的播放日期及时间
 * @param {Object} dateShow
 */
function setMovieDateShow (dateShow) {
	var length = 0;//用于标记播放日期有几天
	mui.each(dateShow,function (index,element) {
		length++;
		var innerHtml = '<a class="mui-control-item" href="#item'+ length +'mobile">'+
							index + 
						'</a>';
		$("#sliderSegmentedControl").append(innerHtml);
		var tabHtml='<div id="item'+ length +'mobile" class="mui-slider-item mui-control-content">'+
						'<div id="scroll' +length+ '" class="mui-scroll-wrapper">'+
							'<div class="mui-scroll">'+
								'<ul class="mui-table-view">'+
								setItem(element)+
								'</ul>'+
							'</div>'+
						'</div>'+
					'</div>';
		$(".mui-slider-group2").append(tabHtml);
//		console.log("index= " + index + "/nelement= " + JSON.stringify(element));
	});
	$("#item1mobile").addClass("mui-active");
	//更改sliderProgressBar的单位长度
//	$("#sliderProgressBar").removeClass("mui-col-xs-4");
	$("#sliderProgressBar").addClass("mui-col-xs-" + Math.ceil(12/length));
	$('.mui-input-group').on('change', 'input', function() {
		if(this.checked) {
			sliderSegmentedControl.className = 'mui-slider-indicator mui-segmented-control mui-segmented-control-inverted mui-segmented-control-' + this.value;
			//force repaint
			sliderProgressBar.setAttribute('style', sliderProgressBar.getAttribute('style'));
		}
	});
	
}
/**
 * 将电影的播放时间展示在列表上
 * @param {Object} timeList
 */
function setItem (timeList) {
	var html="";
	mui.each(timeList,function (index,element) {
		html += '<li class="mui-table-view-cell">'+
					'<div class="mui-row">'+
					    '<div class="mui-col-sm-3  mui-col-xs-3">'+
					    	'<p class="startTime">'+ element.tm +'</p>'+
					    	'<em>'+ element.end +'结束</em>'+
					    '</div>'+
					    '<div class="mui-col-sm-4  mui-col-xs-4">'+
					    	'<p class="stl-ver">'+ element.lang + '&nbsp&nbsp'+ element.tp +'</p>'+
					    	'<p class="two-line">'+ element.th +'</p>'+
					    '</div>'+
					    '<div class="mui-col-sm-2  mui-col-xs-2">'+
					    	'<span class="unit">'+
					    		'<span class="stonefont">'+parseInt(Math.random()*40 + 20)+'</span>元'+
					    	'</span>'+
					    '</div>'+
					    '<div class="mui-col-sm-3  mui-col-xs-3">'+
					    	'<button type="button" class="mui-btn mui-btn-red mui-btn-outlined">选座购票</button>'+
					    '</div>'+
					'</div>'+
				'</li>';
	})
	return html;
}

mui.init({
	swipeBack: false
});

//(function($) {
//	$('.mui-scroll-wrapper').scroll({
//		indicators: true //是否显示滚动条
//	});
//	var html2 = '<ul class="mui-table-view"><li class="mui-table-view-cell">第二个选项卡子项-1</li><li class="mui-table-view-cell">第二个选项卡子项-2</li><li class="mui-table-view-cell">第二个选项卡子项-3</li><li class="mui-table-view-cell">第二个选项卡子项-4</li><li class="mui-table-view-cell">第二个选项卡子项-5</li></ul>';
//	var html3 = '<ul class="mui-table-view"><li class="mui-table-view-cell">第三个选项卡子项-1</li><li class="mui-table-view-cell">第三个选项卡子项-2</li><li class="mui-table-view-cell">第三个选项卡子项-3</li><li class="mui-table-view-cell">第三个选项卡子项-4</li><li class="mui-table-view-cell">第三个选项卡子项-5</li></ul>';
//	var item2 = document.getElementById('item2mobile');
//	var item3 = document.getElementById('item3mobile');
//	document.getElementById('slider').addEventListener('slide', function(e) {
//		if(e.detail.slideNumber === 1) {
//			if(item2.querySelector('.mui-loading')) {
//				setTimeout(function() {
//					item2.querySelector('.mui-scroll').innerHTML = html2;
//				}, 500);
//			}
//		} else if(e.detail.slideNumber === 2) {
//			if(item3.querySelector('.mui-loading')) {
//				setTimeout(function() {
//					item3.querySelector('.mui-scroll').innerHTML = html3;
//				}, 500);
//			}
//		}
//	});
//	var sliderSegmentedControl = document.getElementById('sliderSegmentedControl');
//	$('.mui-input-group').on('change', 'input', function() {
//		if(this.checked) {
//			sliderSegmentedControl.className = 'mui-slider-indicator mui-segmented-control mui-segmented-control-inverted mui-segmented-control-' + this.value;
//			//force repaint
//			sliderProgressBar.setAttribute('style', sliderProgressBar.getAttribute('style'));
//		}
//	});
//})(mui);
