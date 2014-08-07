// cookie.js
// cookie处理：获取指定名称的cookie，设置cookie，删除cookie
// date: 20140804
// author: guihua
var cookie = {
	// 取cookies函数
	getCookie : function(name) {
		var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));

		if (arr != null) {
			return unescape(arr[2]);
		}
		return null;
	},
	// 添加cookie
	setCookie : function(objName, objValue, objHours) {
		var str = objName + "=" + escape(objValue);

		// 设定过期时间，浏览器关闭时cookie自动消失
		if (objHours > 0) {
			var date = new Date(), ms = objHours * 3600 * 1000;

			date.setTime(date.getTime() + ms);
			str += "; expires=" + date.toGMTString();
		}

		document.cookie = str;
	},
	// 删除cookie
	delCookie : function(name) {
		var cval = getCookie();

		if (cval != null) {
			document.cookie = name + "=;expires=" + (new Date(0)).toGMTString();
		}
	}
};
