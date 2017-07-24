mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			callback: pulldownRefresh
		},
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});
mui.plusReady(function () {
	
});
//通过window.screen.width获取屏幕的宽度
//var offWidth = window.screen.width / 20; //这里用宽度/30表示1rem取得的px
//document.getElementsByTagName("html")[0].style.fontSize = offWidth + 'px'; //把rem的值复制给顶级标签html的font-size
var pulldown=100,pullup=200;
getCinemas();

/**
 * 获取影院列表
 * @param {Number} method 判断是下拉刷新还是上拉加载更多
 */
function getCinemas (method) {
	mui.ajax(
		httpAction.cinemaList,
		{
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(result){
				//服务器返回响应，根据响应结果
				if(result.status == 0){//获取数据正常
					var cinemas = result.data;
					if(method == pulldown)//如果是下拉刷新，需要清空之前的列表
						$(".mui-table-view").empty();
					mui.each(cinemas,function (index,element) {
//						console.log("index = " + index + ", element=" + JSON.stringify(element));
						appendCinemaList(element);
					})
				}
				if(method == pulldown)
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
				else if(method == pullup)
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(!hasNext); //参数为true代表没有更多数据了。
			},
			error:function(xhr,type,errorThrown){
				if(method == pulldown)
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
				else if(method == pullup)
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(!hasNext); //参数为true代表没有更多数据了。
				//异常处理；
				console.log(type);
//				mui.alert("获取影院列表失败，服务器接口异常！");
			}
		}
	);
}
/**将影院信息显示到列表中*/
function appendCinemaList (cinemas) {
	mui.each(cinemas,function (index,cinemaInfo) {
		var cinemaName = cinemaInfo.nm;
		var cinemaAddr = cinemaInfo.addr;
		if(cinemaName.length > 13){
			cinemaName = cinemaName.substr(0,10)+"…";
		}
		if(cinemaAddr.length > 20){
			cinemaAddr = cinemaAddr.substr(0,17)+"…";
		}
		//判断是否IMAX厅
		var imaxStr = "";
		if(cinemaInfo.imax == 1){
			imaxStr = '<button type="button" class="mui-btn mui-btn-success mui-btn-outlined imax">IMAX厅</button>'
		}else{
			imaxStr = '<!--<button type="button" class="mui-btn mui-btn-success mui-btn-outlined imax">IMAX厅</button>-->'
		}
		//判断是否可退票
		var isRefundStr = "";
		if(cinemaInfo.sell == true){
			isRefundStr = '<button type="button" class="mui-btn mui-btn-primary refund">退</button>'
		}else{
			isRefundStr = '<!--<button type="button" class="mui-btn mui-btn-success mui-btn-outlined seat">IMAX厅</button>-->'
		}
		//判断是否可改签
		var isChangesStr = "";
		if(cinemaInfo.deal == 0){
			isChangesStr = '<button type="button" class="mui-btn mui-btn-primary change">改签</button>'
		}else{
			isChangesStr = '<!--<button type="button" class="mui-btn mui-btn-primary change">改签</button>-->'
		}
		//判断是否有折扣
		var isPreferential = "";
		if(cinemaInfo.preferential == 0){
			isPreferentialStr = '<button type="button" class="mui-btn mui-btn-warning discount">折扣卡</button>'
		}else{
			isPreferentialStr = '<!--<button type="button" class="mui-btn mui-btn-warning discount">折扣卡</button>-->'
		}
		var content =  '<li class="mui-table-view-cell mui-media" cinemaId="'+cinemaInfo.id+'">'+
			            '<a href="javascript:;">'+
			                '<div class="mui-media-body">'+ cinemaName +
								'<span class="price">' + cinemaInfo.sellPrice + '</span><span class="rmb">元起</span class="rmb">'+
								'<p class="address">' + cinemaAddr + '<span class="distance">' + cinemaInfo.distance + 'km</span></p>'+
							'</div>'+
							'<div>'+
								'<button type="button" class="mui-btn mui-btn-success mui-btn-outlined seat">座</button>'+
								imaxStr +
								isRefundStr +
								isChangesStr +
								isPreferentialStr +
							'</div>'+
			            '</a>'+
			        '</li>';
	    $(".mui-table-view").append(content);
	})
}
/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	getCinemas(pulldown);
}
/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	getCinemas(pullup);
}
/**点击影院列表，获取当前列表项的id，并将该id传给影院详情页面，然后打开影院详情页面*/
mui(".mui-table-view").on('tap', '.mui-table-view-cell', function() {
	//获取id
	var cinemaId = $(this).attr("cinemaId");
	//获得详情页面
	mui.openWindow({
		url:"cinema_detail.html",
		id:"cinema_detail",
		waiting:{
			autoShow:false
		},
		extras:{
			cinemaId:cinemaId
		},
	});
})