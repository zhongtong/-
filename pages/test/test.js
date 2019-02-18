const config = require("../../utils/config.js")
//banner
const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    //轮播图
    swiperCurrent: 0,
    dotsCurrent: 0,
    addCommentsFlag:false,
    myCommentValue: '',
    tempMyCommentValue: '',
    myCommentLength: 0,   
    slider: [{
      picUrl: config.base_path + '/www/alyp/img/sharePoster_1.png'
    },
    {
      picUrl: config.base_path + '/www/alyp/img/sharePoster_2.png'
    },
    {
      picUrl: config.base_path + '/www/alyp/img/sharePoster_3.png'
    },
    {
      picUrl: config.base_path + '/www/alyp/img/sharePoster_4.png'
    },
    {
      picUrl: config.base_path + '/www/alyp/img/sharePoster_5.png'
    },
    {
      picUrl: config.base_path + '/www/alyp/img/sharePoster_6.png'
    },
    {
      picUrl: config.base_path + '/www/alyp/img/sharePoster_7.png'
    },
    {
      picUrl: config.base_path + '/www/alyp/img/sharePoster_8.png'
    }
    ],
    previewImageList:[
      config.base_path + '/www/alyp/img/sharePoster_1.png',
      config.base_path + '/www/alyp/img/sharePoster_2.png',
      config.base_path + '/www/alyp/img/sharePoster_3.png',
      config.base_path + '/www/alyp/img/sharePoster_4.png',
      config.base_path + '/www/alyp/img/sharePoster_5.png',
      config.base_path + '/www/alyp/img/sharePoster_6.png',
      config.base_path + '/www/alyp/img/sharePoster_7.png',
      config.base_path + '/www/alyp/img/sharePoster_8.png'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    circular: true,
    beforeColor: "white",//指示点颜色  
    afterColor: "coral",//当前选中的指示点颜色 
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log(app.globalData.userInfo)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //轮播图的切换事件 
  swiperChange: function (e) {
    console.log(e)
    //只要把切换后当前的index传给<swiper>组件的current属性即可 
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  dotsChange: function (e) {
    console.log(e)
    //只要把切换后当前的index传给<swiper>组件的current属性即可 
    this.setData({
      dotsCurrent: e.detail.current
    })
  },
  //点击指示点切换 
  smallImgClick: function (e) {
    console.log(e)
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },
  // smallImgSlide: function (e) { //缩略图列表随轮播图移动
  //   console.log(e)
  //   if (this.data.dotsCurrent < this.data.slider.length - 3){
  //     this.setData({
  //       dotsCurrent: e.currentTarget.id
  //     })
  //   }
  // },
  previewImage: function (e) {
    let current = e.target.dataset.src
    console.log(current)
    console.log(this.data.slider)
    wx.previewImage({
      urls: this.data.previewImageList,
      current: current
    })
  },
  showAddComment: function (e) {
    this.setData({
      addCommentsFlag: true
    })
  },
  cancelAddComment: function (e) {
    this.setData({
      addCommentsFlag: false
    })
  },
  sureAddComment: function (e) {
    this.setData({
      myCommentValue: this.data.tempMyCommentValue,
      addCommentsFlag: false
    })
  },
  bindCommentInput: function (e) {
    this.setData({
      myCommentLength: e.detail.cursor,
      tempMyCommentValue: e.detail.value.replace(/垃圾/g,'**')
    })
  }

})