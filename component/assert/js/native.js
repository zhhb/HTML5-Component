// native API
var nativeAPI = {
	// 返回上一个Activity页面
	backToPrev : function() {
		window.WindVane.call('UIService', 'back', "");
	},
	// 返回上一个History页面
	backHome : function() {
		window.WindVane.call('UIService', 'backHistory', "");
	},
	// 显示Toast提示
	showToastMsg : function(toastMsg) {
		window.WindVane.call('UIService', 'showToast', {
			"forLong" : false,
			"msg" : toastMsg
		});
	},
	// 启动一个新的h5页面，展示指定url
	goToH5Page : function(url, pluginId) {
		window.WindVane.call('UIService', 'startPluginH5', {
			"uri" : url,
			"pluginId" : pluginId
		});
	},
	// 输出log到手机端Logcat控制台
	printLog : function(str) {
		window.WindVane.call('CommonService', 'printLog', str);
	},
	// h5通过RouterService跳转到指定uri的本地widget组件
	goToNativePage : function(productType, globalId) {
		window.WindVane.call('RouterService', 'route', {
			'uri' : 'widget://customerDetail?key_product_type=' + productType + '&globalId=' + globalId
		});
	},
	// 弹出选择框，包括单选和多选，单选类型为showSingleSelect，多选为showMultiSelect
	getDialog : function(dialogType, title, selValue, optionsData, callback) {
		window.WindVane.call('UIService', dialogType, {
			"title" : title,
			"selected" : selValue,
			"items" : optionsData
		}, function success(json) {
			return callback.onSuccess(json);
		}, function error(json) {
			return callback.onError(json);
		});
	},
	// 弹出确认框
	getConfirmDialog : function(title, confirmMsg, callback) {
		window.WindVane.call('UIService', 'confirm', {
			"title" : title,
			'msg' : confirmMsg
		}, function success(json) {
			return callback.onSuccess(json);
		}, function fail(json) {
			return callback.onError(json);
		});
	},
	// 弹出时间选择框
	getDateDialog : function(year, month, day, callback) {
		window.WindVane.call('UIService', 'showDatePicker', {
			"year" : year,
			"monthOfYear" : month,
			"dayOfMonth" : day
		}, function success(json) {
			return callback.onSuccess(json);
		});
	},
	// h5通过DataService获取用户登陆信息
	getLoginInfo : function(callback) {
		window.WindVane.call('DataService', 'getLoginInfo', "", function success(json) {
			return callback(json);
		});
	},
	// 判断当前app的网络环境是否为wifi
	getNetworkInfo : function(callback) {
		window.WindVane.call('CommonService', 'getNetworkInfo', "", function success(json) {
			return callback(json.result.isWifi);
		});
	},
	// h5通过DataService发送http请求，获取服务器端返回的json数据
	requestData : function(param, callback) {
		window.WindVane.call('DataService', 'sendRequest', param, function success(json) {
			return callback.onSuccess(json);
		}, function fail(json) {
			return callback.onError(json);
		});
	}
}