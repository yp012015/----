mui.init({
	pullRefresh: {
		container: "#pullrefresh", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		down: {
			style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
			color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
			height: 50, //可选,默认50.触发下拉刷新拖动距离,
			auto:false,
			callback: pulldownRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		},
		up: {
			callback: pullupRefresh
		}
	}
});
mui.previewImage();
var movieId= "";
var limit=50;//每页加载数据条数
var pageIndex=0;//页数
/**
 * 下拉刷新具体业务实现
 * @param {Object} movieId 电影id
 */
function pulldownRefresh() {
	pageIndex = 0;
	loadData(1);
//	setTimeout(function() {
//		var table = document.body.querySelector('.mui-table-view');
//		var cells = document.body.querySelectorAll('.mui-table-view-cell');
//		for(var i = cells.length, len = i + 3; i < len; i++) {
//			var li = document.createElement('li');
//			li.className = 'mui-table-view-cell';
//			li.innerHTML = '<a class="mui-navigate-right">Item ' + (i + 1) + '</a>';
//			//下拉刷新，新纪录插到最前面；
//			table.insertBefore(li, table.firstChild);
//		}
//		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
//	}, 1500);
}

/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
//	setTimeout(function() {
//		mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > 2)); //参数为true代表没有更多数据了。
//		var table = document.body.querySelector('.mui-table-view');
//		var cells = document.body.querySelectorAll('.mui-table-view-cell');
//		for(var i = cells.length, len = i + 20; i < len; i++) {
//			var li = document.createElement('li');
//			li.className = 'mui-table-view-cell';
//			li.innerHTML = '<a class="mui-navigate-right">Item ' + (i + 1) + '</a>';
//			table.appendChild(li);
//		}
//	}, 1500);
	loadData(2);
}
/**
 * 获取评论数据
 * @param {Object} methodType 加载方式(1.下拉刷新2.上拉加载更多)
 */
function loadData (methodType) {
	var url = httpAction.getCommentList+movieId+'&limit='+limit+'&offset=' + pageIndex*limit;
	mui.ajax(url,{
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(result){
			//内容信息
			var data = result.data;
			//电影评论
			var commentResponseModel = data.CommentResponseModel;
			var commentData = commentResponseModel.cmts;
			setCommentValue(commentData);
			pageIndex++;
			switch(methodType){
				case 1 ://下拉
					console.log("1");
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
					console.log('$(".loading").fadeOut()------start')
					$(".loading").fadeOut();
					console.log('$(".loading").fadeOut()------finish')
					break;
				case 2://上拉
					var hasNext = data.hasNext;
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(!hasNext); //参数为true代表没有更多数据了。
					break;
				default:
					$(".loading").fadeOut();
			}
			
		},
		error:function(xhr,type,errorThrown){
			mui.toast("连接服务器失败，请稍后重试！");
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
		}
	});
}

/**
 * 加载评论列表到页面
 * @param {Object} commentData 评论内容
 */
function setCommentValue (commentData) {
	mui.each(commentData,function (index,element) {
		var score = element.score;//评论分数
		var domStr = '<li class="mui-table-view-cell mui-media">' + 
			        '<a>'+
			            '<img class="mui-media-object mui-pull-left commentAvatar" src="'+ element.avatarurl +'" data-preview-src="" data-preview-group="1" >' +
			            '<div class="mui-media-body commentData">'+
			                '<p class="commentUserName">'+ element.nickName +'</p>'+
			                setScore(score)+
			                '<p class="mui-ellipsis commentStr">'+ element.content +'</p>'+
			                '<span class="commentTime">'+ handleDate(element.time) +'</span>'+
			            '</div>'+
			        '</a>'+
			    '</li>';
		$("#commentList").append(domStr);
		setScore(score);
	})
}
/**
 * 处理评论时间的显示方式
 * @param {Object} dateStr
 */
function handleDate (dateStr) {
	var result = dateStr;
	//评论时间
	var commentDate = new Date(dateStr);
	var currentDate = new Date();
	//当前时间
	//1.判断是否为同一月
	if(commentDate.getMonth() == currentDate.getMonth()){
		var commentDay = commentDate.getDay();
		var currentDay = commentDate.getDay();
		//2.判断是否为相差在一周内
		if(currentDay-commentDay<7){
			//3.判断是否为同一天
			if(currentDay-commentDay==0){
				//4.判断是否为同一小时
				if(currentDate.getHours()-commentDate.getHours()==0){
					//5.判断是否为同一分钟
					if (currentDate.getMinutes()-commentDate.getMinutes()==0) {
						//显示刚刚
						result = '刚刚';
					} else{
						//显示xx分钟前
						result = currentDate.getMinutes() - commentDate.getMinutes() + '分钟前';
					}
				} else {
					//显示xx小时前
					result = currentDate.getHours()-commentDate.getHours() + '小时前';
				}
			} else {
				result = currentDay-commentDay + '天前';
			}
		}
	}
	return result;
}
//电影评论分数
function setScore (score) {
	var domScoreStr = '<div class="icons mui-inline">';
	for(var i=1; i<=5;i++){
		//如果当前星星的位置小于或等于用户评分，将该星星填充
		if(i<=Math.floor(score)){
			domScoreStr += '<i class="mui-icon mui-icon-star-filled"></i>';
		}else{//否者星星为空心
			domScoreStr += '<i class="mui-icon mui-icon-star"></i>';
		}
	}
	domScoreStr += '</div>';
	return domScoreStr;
}

var count = 0;

if(mui.os.plus) {
	mui.plusReady(function() {
//		setTimeout(function() {
//			mui('#pullrefresh').pullRefresh().pullupLoading();
//		}, 1000);
		var self = plus.webview.currentWebview();
		var movieName = self.movieName;
		$(".mui-title").text("猫眼短评-" + movieName);
		movieId = self.movieId;
		loadData();
	});
} else {
	mui.ready(function() {
		mui('#pullrefresh').pullRefresh().pullupLoading();
	});
}