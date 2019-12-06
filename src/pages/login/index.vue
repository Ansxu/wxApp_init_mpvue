<template>
  <div class="login">
    <open-data class="icon icon_circular_bead" type="userAvatarUrl"></open-data>
    <div class="auth-text">
      <text class="main">{{title}}</text>
      <text class="sub">{{content}}</text>
    </div>
    <button class="login-btn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="doBind">{{buttonText}}</button>
  </div>
</template>

<script>
import { host, myget, mypost,post,get } from "@/utils";
import logins from '@/utils/login'
// var qcloud = require("wafer2-client-sdk/index.js");
export default {
  data() {
    return {
      phonecode: "获取验证码",
      show: true,
      sessionId: "",
      openid: "",
      ivdata: "",
      encryptedData: "",
      count: "",
      timer: null,
      telNumber: "",
      code: "",
      accessToken: "",
      askUrl: "",
      // 是否授权的提示信息
      title:'该小程序由絮开发，请提供以下授权，即可继续操作',
      content:'· 获得你的公开信息（昵称、头像等）',
      buttonText:'登录'
    };
  },
  onLoad(){
    //  this.askUrl = this.$root.$mp.query.askUrl;
    //  this.askUrl = this.askUrl.toString().replace(/\%3F/g, '?').replace(/\%3D/g, '=').replace(/\%26/g, '&');
    //   console.log("当前请求的路径："+this.askUrl);
  },
  onShow() {
    const that =this;
    wx.getSetting({
      success(res){
        // 已授权
        if(res.authSetting['scope.userInfo']){
          that.title = '登录信息已过期或者已经失效，需重新进行登录'
          that.buttonText = '授权登录'
        }
        // 未授权
        else{

        }
      }
    })
  },
  computed:{
  },
  methods: {
    // 点击登录
    async doBind(){
      // 正常
        logins({
          success(res){
            setTimeout(()=>{
              wx.navigateBack();
            },1500)
          }
        });

        // 临时
        //  let res = await post('Login/LoginByMobile',{
        //       Mobile: '15927443397',
        //       PassWord: '123456',
        //  })
         
        //    wx.setStorageSync('userId',  res.data.UserId); //保存用户Id到本地缓存
        //    wx.setStorageSync('token', res.data.Token); //保存的令牌 accessToken

        //    console.log(wx.getStorageSync("userId"),wx.getStorageSync("token"))
        //    wx.navigateBack();
    },
  }
};
</script>
<style lang='scss' scoped>
@import "./style";
</style>
