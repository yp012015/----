mui.init({
	//初始化预加载页面
//	preloadPages: [{
//		id: 'video.html',
//		url: 'movie_video.html'
//	}]
});
//设置标题栏渐变的范围
function setTransparentHeight () {
	//获取电影信息(灰色部分)的高度
	var grayHeight = $(".movie-info").height();
	//控制标题栏透明度变化
	mui('.mui-bar-transparent').transparent({
	    top: grayHeight/2,//距离顶部高度(滚动到该位置即触发)
	    offset: grayHeight/2,//滚动透明距离
	    duration: 16,//过渡时间  ms
	    //监听区域滚动容器  (*mui 3.5版本+支持) 默认window默认监听原生滚动,如监听mui scroll控件滚动,则: document.querySelector('.mui-scroll-wrapper')
	//  scrollby: document.querySelector('.mui-scroll-wrapper')
	});
}
//当标题栏透明度变化时触发
$(".mui-bar-transparent").on("alpha", function(evt) {
	//获取标题栏的背景色rgba
	var backgroundVal = $("#header").css("background-color");
	//截取透明度alpha值
	var start = backgroundVal.lastIndexOf(",")+1;
	var end = backgroundVal.length-1;
	var alpha = backgroundVal.substring(start,end);
//	console.log("backgroundVal= " + backgroundVal + "\nalpha= " + alpha);
	changeTitleColor(alpha);
});
//字体跟随导航栏标题同时变色！
function changeTitleColor(alpha) {
	$(".mui-title").css("color","rgba(255,255,255,"+ alpha +")");
}
var name="",//电影名称
	id="",//电影id
	img="",//电影照片
	hcmts="",//电影热门评论
	rt="",//上映时间
	sc="";//电影得分
mui.plusReady(function () {
	var self = plus.webview.currentWebview();
	name = self.movieName;
	id = self.movieId;
//	console.log("name= " + name + "\nid= " +  id);	
	$(".mui-title").text(name);
	getMovieDetail(id);
})
/**
 * 根据电影id获取电影详情
 * @param {Object} id 电影id
 */
function getMovieDetail(id) {
//	plus.nativeUI.showWaiting("数据加载中…");
	mui.ajax(httpAction.getMovieDetail + id + ".json", {
		dataType: 'json', //服务器返回json格式数据
		type: 'get', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(result) {
			//关闭等待框
//			plus.nativeUI.closeWaiting();
			//内容信息
			var data = result.data;
			//电影信息
			var movieDetail = data.MovieDetailModel;
			//电影评论
			var commentResponseModel = data.CommentResponseModel;
			$(".commentTotal").text("查看全部" + commentResponseModel.total + "条评论");
			setMovieValue(movieDetail);
			var commentData = commentResponseModel.cmts;
			hcmts = commentResponseModel.hcmts;
			setCommentValue(commentData);
			setTransparentHeight();
		},
		error: function(xhr, type, errorThrown) {
			//关闭等待框
			closeWaiting();
			console.log(type);
		}	
	});
}
/**
 * 给页面赋值
 */
function setMovieValue (movieDetail) {
	if(movieDetail == null) {
		$(".loading").fadeOut();
		mui.alert("为查询到电影详情，请稍后重试！");
		return;
	}
//	console.log("movieDetail= " + JSON.stringify(movieDetail))
	rt = movieDetail.rt;//上映时间
	sc = movieDetail.sc;//电影得分
	img = movieDetail.img;
	$("#movieName").text(movieDetail.nm);
	$(".mui-ellipsis").text(movieDetail.scm);
	$("#movie-dra").html(movieDetail.dra);
	$(".movie-type").text(movieDetail.cat);
	$(".movie-duration").text(movieDetail.src + "/" + movieDetail.dur + "分钟");
	$(".movie-date").text(rt);
	//电影海报
	$(".movie-img").attr("src",img);
	//评分
	$(".pingfen-val1").text(sc);
	//评分人数
	$(".pingfen-val2").text(movieDetail.wish);
	//导演
	$("#dirName").text(movieDetail.dir);
	//演员
	$("#movie-star").text(movieDetail.star);
	
	closeWaiting();
	setBtnPlayListener();
}
/**
 * 加载评论列表到页面
 * @param {Object} commentData 评论内容
 */
function setCommentValue (commentData) {
	mui.each(commentData,function (index,element) {
//		console.log("index= " + index + "\nelement= " + JSON.stringify(element));
		if(index>5)return;
		var score = element.score;//评论分数
		var domStr = '<li class="mui-table-view-cell mui-media">' + 
			        '<a>'+
			            '<img class="mui-media-object mui-pull-left commentAvatar" src="'+ element.avatarurl +'">' +
			            '<div class="mui-media-body commentData">'+
			                '<p class="commentUserName">'+ element.nickName +'</p>'+
			                setScore(score)+
			                '<p class="mui-ellipsis commentStr">'+ element.content +'</p>'+
			            '</div>'+
			        '</a>'+
			    '</li>';
		$("#commentList").append(domStr);
		setScore(score);
	})
}

var videoPage = null;
/**
 * 设置播放按钮的监听事件
 * 点击电影图片，获取当前列表项的id，并将该id传给电影预告片页面，然后打开电影预告片页面
 */
function setBtnPlayListener () {
	var btnPlay = document.getElementById("img-play");
	btnPlay.addEventListener('tap',function () {
		//获得video页面
		/*if(!videoPage) {
			videoPage = plus.webview.getWebviewById('video.html');
		}
		//触发详情页面的newsId事件
		mui.fire(videoPage, 'movieId', {
			id: id,
			name: name
		});
		//打开详情页面          
		mui.openWindow({
			id: 'video.html'
		});*/
		mui.openWindow({
			url:"movie_video.html",
			id:"movie_video.html",
			extras:{
				movieId:id,
				movieName:name,
				img:img,
				hcmts:hcmts,
				rt:rt,
				sc:sc
			},
			waiting:{
				autoShow:false
			}
		})
	})
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

//查看全部评论的点击事件监听
var btnMore = document.getElementById("div-more-comment");
btnMore.addEventListener('tap',function () {
	mui.openWindow({
		url:'comment_more.html',
		id:'comment_more.html',
		waiting:{
			autoShow:false
		},
		extras:{
			movieId:id,
			movieName:name
		}
	});
})

//关闭进度条,显示页面内容
function closeWaiting () {
	$(".loading").fadeOut();
	$("#header").fadeIn();
	$(".mui-content").fadeIn();
	$('.mui-content').css('padding-top',0);
}

//检测页面加载进度
/*document.onreadystatechange = function () {
	console.log(document.readyState);
	if(document.readyState == "complete"){
		
	}
}*/
