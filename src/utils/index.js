

//API接口地址
// 线上
// const host = 'https://api.gllyz.com/api/';
// 线上后台地址
// const filePath = 'http://xcx.gllgyz.com';
const host = 'http://hxapia.com/api/';// 测试
const wssPath = 'wss://hxapia.com/WebSocketServer.ashx';// wss地址
const filePath = 'http://www.hxapia.com';// 测试后台地址
const LoginPath = "/pages/login/main";//登录路径
const RegisterPath = "/pages/login/register/main";//注册路径
import {get,post} from '@/utils/request.js';
export {
  host,filePath,wssPath,dateUtils,LoginPath,RegisterPath,get,post
}
//判断是否登录，未登录做弹窗跳转登录页面
export function judgeLogin(){
  if (!wx.getStorageSync("userId") || !wx.getStorageSync("token")) {
      wx.showModal({
        title:'是否跳转到登录页面？',
        success(res){
          if(res.confirm){
            wx.navigateTo({
              url: LoginPath
            })
          }
        }
      })
      return false;
  }else{
    return true;
  }
}
// navigateTo跳转，转参数
export function navigate(path,params={}){
  let p='';
  const keyArr = Object.keys(params);
  keyArr.length>0&&(p="?");
  keyArr.map(item=>{
    p+=`${item}=${params[item]}`;
    // 不是最后一个值就+&
    if(item!==keyArr[keyArr.length-1]){
      p+='&';
    }
  })
  wx.navigateTo({
    url:`/pages/${path}${p}`
  })
}
export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
//验证手机号
export function valPhone(tel) {
  var r_phone = /^[1][3,4,5,6,7,8][0-9]{9}$/;
  // var phoneNumber = $.trim($('#phoneNumber').val());
  if (trim(tel) == "") {
    wx.showToast({
      title: "手机号不能为空!",
      icon: "none",
      duration: 2000
    });
    return false;
  }
  if (!r_phone.test(tel)) {
    wx.showToast({
      title: "请输入正确的手机格式!",
      icon: "none",
      duration: 1500
    });
    return false;
  }
  return true;
}

// 函数防抖
let timeout = null
export function debounce(fn, wait = 500) {
  if (timeout !== null) clearTimeout(timeout)
  timeout = setTimeout(fn, wait)
}
// 函数节流
let throtteStatus = false
export function throtte(fn, wait = 500) {
  if (throtteStatus) return;
  throtteStatus = true;
  setTimeout(fn, wait)
  setTimeout(() => {
    throtteStatus = false;
  }, wait)
}
// 时间格式化工具
function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}
// 微信支付
// param--支付参数（后台返回）；success--支付成功执行的方法
export function wx_pay(param) {
  return new Promise((resolve, reject) => {
    let payData = JSON.parse(param);
    wx.requestPayment({
      timeStamp: payData.timeStamp,
      nonceStr: payData.nonceStr,
      package: payData.package,
      signType: payData.signType,
      paySign: payData.paySign,
      success(res) {
        resolve(res)
      },
      fail(err) {
        wx.showToast({
          title: "支付失败，请重新尝试",
          icon: "none"
        });
        reject(err)
      }
    });
  })
}

// 更改时间格式
// type:'date'--返回日期；'time'--返回日期+时间; 's'--日期+时间+秒
export function editTime(time, type = 'date') {

  let newTime = ''
  if (type === 'time') {
    newTime = time.substr(0, time.lastIndexOf(':'))
    newTime = newTime.replace('T', ' ')
  }
  if (type === "date") {
    newTime = time.substr(0, time.lastIndexOf('T'))
  }
  if (type === "s") {
    newTime = time.substr(0, time.lastIndexOf('.'))
    newTime = newTime.replace('T', ' ')
  }
  return newTime;
}

// 更改图片展示，判断是否带链接图片
export function autoImg(img) {
  if (img.indexOf('http') === -1) {
    return filePath + img
  }
  return img;
}
/**JS获取距当前时间差
 * @param int time JS毫秒时间戳
 */
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function (milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function (dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function (number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '-' + _format(date.getMonth() + 1) + '-' + _format(date.getDay()) + ' ' +
			_format(date.getHours()) + ':' + _format(date.getMinutes())+':'+_format(date.getSeconds());
	},
	parse: function (str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};
export function get_time_diff(time) {
  var diff = '';
  var time_diff = new Date().getTime() - time;
  // 计算相差天数  
  var days = Math.floor(time_diff / (24 * 3600 * 1000));
  if (days > 0) {
    return diff += days + '天';
  }
  // 计算相差小时数  
  var leave1 = time_diff % (24 * 3600 * 1000);
  var hours = Math.floor(leave1 / (3600 * 1000));
  if (hours > 0) {
    return diff += hours + '小时';
  } else {
    if (diff !== '') {
      return diff += hours + '小时';
    }
  }
  // 计算相差分钟数  
  var leave2 = leave1 % (3600 * 1000);
  var minutes = Math.floor(leave2 / (60 * 1000));
  if (minutes > 0) {
    return diff += minutes + '分钟';
  } else {
    if (diff !== '') {
      return diff += minutes + '分钟';
    }
  }
  // 计算相差秒数  
  var leave3 = leave2 % (60 * 1000);
  var seconds = Math.round(leave3 / 1000);
  if (seconds == 0) {
    return diff = '刚刚';
  } else if (seconds > 0) {
    return diff += seconds + '秒';
  } else {
    if (diff !== '') {
      return diff += seconds + '秒';
    }
  }

  return diff;
}
// module.exports = {
//   dateUtils: dateUtils,
// }