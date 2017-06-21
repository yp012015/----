mui.init({
	swipeBack: true //启用右滑关闭功能
});
mui.plusReady(function () {
	var self = plus.webview.currentWebview();
	var name = self.movieName;
	var id = self.movieId;
	console.log("name= " + name + "\nid= " +  id);	
	$(".mui-title").text(name);
	getMovieDetail(id);
})
/**
 * 根据电影id获取电影详情
 * @param {Object} id 电影id
 */
function getMovieDetail(id) {
	mui.ajax(httpAction.getMovieDetail + id + ".json", {
		dataType: 'json', //服务器返回json格式数据
		type: 'get', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(result) {
			//内容信息
			var data = result.data;
			//电影信息
			var movieDetail = data.MovieDetailModel;
			setValue(movieDetail);
		},
		error: function(xhr, type, errorThrown) {
			console.log(type);
		}	
	});
}
/**
 * 给页面赋值
 * @param {Object} movieDetail 电影详情
 */
function setValue (movieDetail) {
	console.log("movieDetail= " + JSON.stringify(movieDetail))
	$("#movieName").text(movieDetail.nm);
	$(".mui-ellipsis").text(movieDetail.scm);
	$("#movie-dra").html(movieDetail.dra);
	$(".movie-type").text(movieDetail.cat);
	$(".movie-duration").text(movieDetail.src + "/" + movieDetail.dur + "分钟");
	$(".movie-date").text(movieDetail.rt);
	//电影海报
	$(".movie-img").attr("src",movieDetail.img);
	//评分
	$(".pingfen-val1").text(movieDetail.sc);
	//评分人数
	$(".pingfen-val2").text(movieDetail.wish);
	$("#movie-star").text(movieDetail.star);
}