//启用双击监听
mui.init({
	gestureConfig:{
		doubletap:true
	},
	//初始化预加载页面
	preloadPages:[{
	    id:'video.html',
	    url:'video.html'           
  	}],
	subpages:[{
		url:'movie_sub.html',
		id:'movie_sub.html',
		styles:{
			top: '45px',
			bottom: '0px',
		}
	}]
});
var contentWebview = null;
document.querySelector('header').addEventListener('doubletap',function () {
	if(contentWebview==null){
		contentWebview = plus.webview.currentWebview().children()[0];
	}
	contentWebview.evalJS("mui('#pullrefresh').pullRefresh().scrollTo(0,0,100)");
});