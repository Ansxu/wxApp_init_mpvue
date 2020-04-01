//   params={
//        loginFn//登录成功执行方法
//        isLogin:Boolean//需要先判断是否登录
//   }
// 统一请求返回CODE,在index.js
// export const CODE={
//     success:0,//成功
//     fail:1,//失败
//     notLogin:2,//未登录，需要登录
//     resCode1:200,//成功特别方式
//   }
import {host,LoginPath,judgeLogin} from '@/utils/index';
import logins from './login';

// 统一请求返回code
const CODE={
    success:0,//成功
    fail:1,//失败
    notLogin:2,//未登录，需要登录
    resCode1:200,//成功特别方式
  }
export function get(url, data,params={}) {
    if(params.isLogin){
        judgeLogin();
        return;
    }
    return request(url, data, 'GET', params)
  }
  export function post(url, data,params={}) {
    if(params.isLogin){
        judgeLogin();
        return;
    }
    return request(url, data,'POST', params)
  }

let status = false;//是否已跳出弹窗
// 请求封装
function request(url, data,method, params) {
    wx.showLoading({
      title: '加载中' //数据请求前loading
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: host + url, //仅为示例，并非真实的接口地址
        method: method,
        data: data,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading();
          switch (res.data.code) {
            case CODE.success:
              resolve(res.data);
              break;
            case CODE.resCode1:
              resolve(res.data);
              break;
            case CODE.notLogin:
              wx.showToast({
                title: '需要重新登录!',
                icon: 'none'
              })
              // 没登录过跳转到登录页面
              if (!wx.getStorageSync("userId") || !wx.getStorageSync("token")) {
                //   弹出登录弹窗
                if(!status){
                  status = true;
                  wx.showModal({
                    title:'是否跳转到登录页面？',
                    success(res){
                      if(res.confirm){
                        wx.navigateTo({
                          url: LoginPath
                        })
                      }
                    },
                    complete(){
                      status = false;
                    }
                  })
                }
              } else {
                // 设置需要重新登录执行的函数
                // getApp()--微信全局对象
                if (params.loginFn) {
                  // 创建全局对象userInfoReadyCallback为匿名函数，执行需要重新登录函数
                  getApp().userInfoReadyCallback = () => {
                    params.loginFn()
                  }
                }
                // 登录过期自动重新登录
                logins({
                  success() {
                    if (getApp().userInfoReadyCallback) {
                      getApp().userInfoReadyCallback()
                      // 执行完成清空匿名函数
                      getApp().userInfoReadyCallback = null
                    }
                  }
                }).then(() => {
                  reject()
                });
              }
              break;
            default:
              wx.showToast({
                title: res.data.msg, //提示的内容,
                icon: "none", //图标,
                mask: false, //显示透明蒙层，防止触摸穿透,
              });
              reject(res.data)
          }
        },
        fail: function (error) {
          wx.hideLoading();
          wx.showToast({
            title: error || '请求失败' + '，请刷新页面重试!',
            icon: "none"
          })
          reject(false)
        }
      })
    })
  }