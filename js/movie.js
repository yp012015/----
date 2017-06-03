mui.init();
getHotMovies(0,10);
/**
 * 获取热播电影列表
 * @param {Object} page		当前页数
 * @param {Object} pageSize	每页条数
 */
function getHotMovies (page,pageSize) {
	mui.ajax(
		httpAction.hotMovieList,
		{
			data:{
				type:'hot',
				offset:page,
				limit:pageSize
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			headers:{'Content-Type':'application/json'},	              
			success:function(data){
				//服务器返回响应，根据响应结果
				console.log("data= " + JSON.stringify(data));
			},
			error:function(xhr,type,errorThrown){
				//异常处理；
				console.log(type);
				mui.alert("获取电影列表失败，服务器接口异常！");
			}
		}
	);
}
