const config = require("../../utils/config.js")
const utils = require("../../utils/util.js")
//banner
const app = getApp()
Page({
  data: {
    userInfo: {},
    name: '', //姓名
    headImgUrl: '', //头像地址
    hasUserInfo: false,
    //轮播图
    swiperCurrent: 0,
    dotsCurrent: 0,
    addCommentsFlag: false, //控制评论框的显示
    myCommentValue: '',
    tempMyCommentValue: '',
    myCommentLength: 0,
    focus: false, //是否获得焦点
    selection_start: -1, //选中起点

    
    selection_end: -1, //选中终点
    previewImageList: [
      config.base_path + '/www/alyp/img/sharePoster_1.png',
      config.base_path + '/www/alyp/img/sharePoster_2.png',
      config.base_path + '/www/alyp/img/sharePoster_3.png',
      config.base_path + '/www/alyp/img/sharePoster_4.png',
      config.base_path + '/www/alyp/img/sharePoster_5.png',
      config.base_path + '/www/alyp/img/sharePoster_6.png',
      config.base_path + '/www/alyp/img/sharePoster_7.png',
      config.base_path + '/www/alyp/img/sharePoster_8.png'
    ],
    codeImageUrl: config.base_path + '/www/public/img/code.png',
    onShowCanvas: false

  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        name: app.globalData.userInfo.nickName,
        headImgUrl: app.globalData.userInfo.avatarUrl
      })
      console.log(app.globalData.userInfo)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          name: res.userInfo.nickName,
          headImgUrl: res.userInfo.avatarUrl
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            name: res.userInfo.nickName,
            headImgUrl: res.userInfo.avatarUrl
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      name: e.detail.userInfo.nickName,
      headImgUrl: e.detail.userInfo.avatarUrl
    })
  },
  //轮播图的切换事件 
  swiperChange: function(e) {
    console.log(e)
    //只要把切换后当前的index传给<swiper>组件的current属性即可 
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  dotsChange: function(e) {
    console.log(e)
    //只要把切换后当前的index传给<swiper>组件的current属性即可 
    this.setData({
      dotsCurrent: e.detail.current
    })
  },
  //点击指示点切换 
  smallImgClick: function(e) {
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
  previewImage: function(e) {
    // wx.showLoading({
    //   title: '泡面就快好',
    //   mask: true
    // })
    let that = this,
      ctx = wx.createCanvasContext('sharePoster', this),
      nameColor = '#3968B0',
      commentColor = '#595757',
      bgImgUrl = this.data.previewImageList[this.data.swiperCurrent],
      windowWidth = wx.getSystemInfoSync().windowWidth,
      windowHeight = wx.getSystemInfoSync().windowHeight,
      info_width = wx.getSystemInfoSync().windowWidth, //底部信息区宽
      info_height = 150, //底部信息区高
      info_x = 0, //底部信息区x
      info_y = 460, //底部信息区y
      code_x = (wx.getSystemInfoSync().windowWidth / 2) - 32, //二维码信息
      code_y = 410,
      code_width = 64,
      code_height = 64,
      name_x = 40,
      name_y = 548,
      headImg_x = 65,
      headImg_y = 498,
      line_x = 110,//评论区x
      line_y = 490,//评论区首行y
      lineArray = utils.canvasBreakLine(that.data.myCommentValue,ctx, 160, 14)//评论多行文本换行
    wx.getImageInfo({
      src: bgImgUrl,
      success(res) {
        //画背景图
        ctx.drawImage(res.path, 0, 0, windowWidth, windowHeight)
        //画底部信息区白色底
        ctx.rect(info_x, info_y, info_width, info_height)
        ctx.setFillStyle('#fff')
        ctx.fill()
        //画二维码
        ctx.drawImage(that.data.codeImageUrl,code_x,code_y,code_width,code_height)
        //画姓名
        ctx.setFillStyle(nameColor)
        ctx.setFontSize(18)
        ctx.fillText(that.data.name,name_x,name_y)
        //画头像
        wx.downloadFile({
          url: that.data.headImgUrl,
          success(res) {
            ctx.save()
            ctx.beginPath()
            ctx.arc(headImg_x, headImg_y, 25, 0, 2 * Math.PI)
            ctx.setStrokeStyle('transparent')
            ctx.stroke()
            ctx.clip()
            ctx.drawImage(res.tempFilePath,40, 473, 50, 50)
            ctx.restore()
            lineArray.forEach(function(item,index){
              ctx.setFillStyle(commentColor)
              ctx.setFontSize(14)
              ctx.fillText(item, line_x, line_y + 17 * index)
            })
            ctx.draw()
          },
          fail: function (err) {
            console.log(err)
          }
        })
        that.setData({
          onShowCanvas: true
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  showAddComment: function(e) {
    this.setData({
      addCommentsFlag: true,
      focus: true,
      selection_start: 0,
      selection_end: this.data.myCommentLength
    })
  },
  cancelAddComment: function(e) {
    this.setData({
      addCommentsFlag: false,
      focus: false,
      selection_start: -1,
      selection_end: -1
    })
  },
  sureAddComment: function(e) {
    this.setData({
      myCommentValue: this.data.tempMyCommentValue,
      addCommentsFlag: false,
      focus: false,
      selection_start: -1,
      selection_end: -1
    })
  },
  bindCommentInput: function(e) {
    this.setData({
      myCommentLength: e.detail.cursor,
      tempMyCommentValue: e.detail.value.replace(/垃圾/g, '**')
    })
  }

})