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
// H5 plus事件处理
function plusReady () {
	if(window.plus){
		plus.nativeUI.closeWaiting();
	}
}
var loadCompleted = false;
var page=0, pageSize=10;//第几页，每页条数
var pulldown=100,pullup=200;
var hasNext = false;//是否还有下一页
getHotMovies();

/**
 * 获取热播电影列表
 * @param {Number} method 判断是下拉刷新还是上拉加载更多
 */
function getHotMovies (method) {
	var params = {
				type:'hot',
				offset:pageSize*page++,
				limit:pageSize
		};
//	console.log("params = " + JSON.stringify(params));
	mui.ajax(
		httpAction.hotMovieList,
		{
			data:params,
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(result){
				if(!loadCompleted){
					if (window.plus) {
						plus.nativeUI.closeWaiting();
					} else{
						document.addEventListener("plusready", plusReady, false);
					}
					loadCompleted = true;
				} 
				//服务器返回响应，根据响应结果
				if(result.status == 0){//获取数据正常
					hasNext = result.data.hasNext;
					var movies = result.data.movies;
					if(method == pulldown)//如果是下拉刷新，需要清空之前的列表
						$(".mui-table-view").empty();
					mui.each(movies,function (index,element) {
//						console.log("index = " + index + ", element=" + JSON.stringify(element));
						appendMovieList(element);
					})
				}
				if(method == pulldown)
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
				else if(method == pullup)
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(!hasNext); //参数为true代表没有更多数据了。
			},
			error:function(xhr,type,errorThrown){
				if(!loadCompleted){
					if (window.plus) {
						plus.nativeUI.closeWaiting();
					} else{
						document.addEventListener("plusready", plusReady, false);
					}
					loadCompleted = true;
				} 
				if(method == pulldown)
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
				else if(method == pullup)
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(!hasNext); //参数为true代表没有更多数据了。
				//异常处理；
				console.log(type);
//				mui.alert("获取电影列表失败，服务器接口异常！");
			}
		}
	);
}

function appendMovieList (movieInfo) {
	var movieName = movieInfo.nm;
	if(movieName.length > 13){
		movieName = movieName.substr(0,10)+"…";
	}
	var content = '<li class="mui-table-view-cell mui-media" movieId="'+movieInfo.id+'">'+
		            '<a href="javascript:;">'+
		                '<img class="mui-media-object mui-pull-left movie-img" src='+ movieInfo.img +' movieId="'+movieInfo.id+'">'+
		                '<div class="mui-media-body">'+
		                	'<span class="movieName">'+ movieName +'</span>'+
		                    '<span class="score">'+ movieInfo.sc +'分</span>'+
		                    '<p class="movie-second scm">'+ movieInfo.scm +'</p>'+
		                    '<p class="movie-second showInfo">'+ movieInfo.showInfo +
		                    	'<button type="button" class="mui-btn mui-btn-red mui-btn-outlined">购票</button>'+
		                    '</p>'+
		                '</div>'+
		            '</a>'+
		        '</li>';
    $(".mui-table-view").append(content);
}
/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	page = 0;
	getHotMovies(pulldown);
}
/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	getHotMovies(pullup);
}
var detailPage = null;
/**点击电影列表，获取当前列表项的id，并将该id传给电影详情页面，然后打开电影详情页面*/
mui(".mui-table-view").on('tap', '.mui-table-view-cell', function() {
	//获取id
	var id = $(this).attr("movieId");
	var movieName = $(this).find(".movieName").text();
	//获得详情页面
	mui.openWindow({
		url:"movie_detail.html",
		id:"movie_detail",
		extras:{
			movieId:id,
			movieName:movieName
		}
	});
})
/**点击电影图片，获取当前列表项的id，并将该id传给电影预告片页面，然后打开电影预告片页面*/
mui(".mui-table-view>.movie-img").on('tap', '.mui-table-view-cell', function() {
	//获取id
	var id = $(this).attr("movieId");
	var movieName = $(this).find(".movieName").text();
	//获得详情页面
	if(!detailPage) {
		detailPage = plus.webview.getWebviewById('video.html');
	}
	//触发详情页面的newsId事件
	mui.fire(detailPage, 'movieId', {
		id: id,
		name: movieName
	});
	//打开详情页面          
	mui.openWindow({
		id: 'video.html'
	});
})