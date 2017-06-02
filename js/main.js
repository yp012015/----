//初始化mui
mui.init({
	beforeback:function(){
		var btnArray = ['否', '是'];
		mui.confirm('确认退出应用？', '退出应用', btnArray, function(e) {
			if (e.index == 1) {
				plus.runtime.quit();
			}
		})
		return false;
	}
});
mui.plusReady(function() {
	//获取主webview
	var parentWebView = plus.webview.currentWebview();
	//声明四个子webview的数组
	var pageList = [{
		url: "movie.html",
		id: "movie"
	}, {
		url: "cinema.html",
		id: "cinema"
	}, {
		url: "discover.html",
		id: "discover"
	}, {
		url: "mine.html",
		id: "mine"
	}];
	//依次创建四个子webview
	for(var i = 0; i < pageList.length; i++) {
		var url = pageList[i].url;
		var id = pageList[i].id;
		//如果该webview已经被创建，那么跳过
		if(plus.webview.getWebviewById(id)) {
			continue;
		}
		//开始创建webview
		var newWebView = plus.webview.create(url, id, {
			bottom: '50px',
			popGesture: 'none'
		});
		//显示第一个webview，隐藏其他的webview
		i === 0 ? newWebView.show() : newWebView.hide();
		//将子webview追加到父webview上面
		parentWebView.append(newWebView);
	}
	//关闭等待框
    plus.nativeUI.closeWaiting();
    //显示当前页面
    mui.currentWebview.show();
	//声明默认显示的子webview的id
	var currentViewId = 'movie';
	mui('.mui-bar').on('tap', '.mui-tab-item', function(e) {
		//mui.alert(this.dataset.id);
		//如果当前显示的webview和用户点击即将显示的webview为同一个，那么什么也不做，直接跳过
		var showViewId = this.dataset.id;
		console.log("showViewId= " + showViewId);
		if(currentViewId === showViewId)
			return;
		//隐藏当前正显示的webview
		plus.webview.getWebviewById(currentViewId).hide();
		//显示用户点击的webview
		var willShowView = plus.webview.getWebviewById(showViewId);
		willShowView.show("none", 0, function() {
			//触发这个webview中定义的showPage事件
			mui.fire(willShowView, "showPage");
		});
		//更新当前显示的子webview的id
		currentViewId = showViewId;
	});
})