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
    miniProgramLogoUrl: config.base_path + '/www/alyp/img/miniProgramLogo.png',
    onShowCanvas: false

  },
  onLoad() {
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
  getUserInfo(e) {
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
    //只要把切换后当前的index传给<swiper>组件的current属性即可 
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  dotsChange(e) {
    //只要把切换后当前的index传给<swiper>组件的current属性即可 
    this.setData({
      dotsCurrent: e.detail.current
    })
  },
  //点击指示点切换 
  smallImgClick(e) {
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
  previewImage(e) {
    wx.showLoading({
      title: '海报生成中',
      mask: true
    })
    let that = this,
      ctx = wx.createCanvasContext('sharePoster', this),
      nameColor = '#3968B0',
      commentColor = '#595757',
      bgImgUrl = this.data.previewImageList[this.data.swiperCurrent],
      windowWidth = 3 * 375,//屏幕宽
      windowHeight = 3 * 667,
      info_width = 3 * 375,//底部信息区宽
      info_height = 3 * 125, //底部信息区高
      info_x = 0, //底部信息区x
      info_y = 3 * 545, //底部信息区y 下移60
      code_x = 3 * 135,
      code_y = 3 * 460,
      code_width = 3 * 100,
      code_height = 3 * 100,
      logo_x = 3 * 120,
      logo_y = 3 * 570,
      logo_width = 3 * 140,
      logo_height = 3 * 33,
      name_x,
      name_y = 3 * 630,
      headImg_x = 3 * 65,
      headImg_y = 3 * 583,
      line_x = 3 * 110, //评论区x
      line_y = 3 * 575, //评论区首行y
      lineArray = utils.canvasBreakLine(that.data.myCommentValue, ctx, 3 * 160, 3 * 14) //评论多行文本换行
    switch (this.data.name.length) {
      case 1:
        name_x = 3 * 55;
        break;
      case 2:
        name_x = 3 * 47;
        break;
      case 3:
        name_x = 3 * 37;
        break;
      case 4:
        name_x = 3 * 27;
        break;
      case 5:
        name_x = 3 * 17;
        break;
      default:
        name_x = 3 * 27;
        break;
    }
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
        ctx.drawImage(that.data.codeImageUrl, code_x, code_y, code_width, code_height)
        //画二维码提示
        ctx.setFillStyle('#ccc')
        ctx.setFontSize(3 * 13)
        ctx.fillText('扫码查看案件详情 | 生成你的专属海报', 3 * 80, 3 * 650)
        //画姓名
        ctx.setFillStyle(nameColor)
        ctx.setFontSize(3 * 18)
        ctx.fillText(that.data.name, name_x, name_y)
        //画头像
        wx.downloadFile({
          url: that.data.headImgUrl,
          success(res) {
            ctx.save()
            ctx.beginPath()
            ctx.arc(headImg_x, headImg_y, 3 * 25, 0, 2 * Math.PI)
            ctx.closePath();
            ctx.fill();
            ctx.clip()
            ctx.drawImage(res.tempFilePath, 3 * 40, 3 * 558, 3 * 50, 3 * 50)
            ctx.restore()
            lineArray.forEach(function(item, index) {
              ctx.setFillStyle(commentColor)
              ctx.setFontSize(3 * 14)
              ctx.fillText(item, line_x, line_y + 3 * 17 * index)
            })
            wx.getImageInfo({
              src: that.data.miniProgramLogoUrl,
              success(res) {
                if(that.data.myCommentValue.length == 0){
                  ctx.drawImage(res.path,logo_x,logo_y,logo_width,logo_height)
                }
                ctx.draw(false, () => {
                  //生成图片
                  that.canvasToTempFilePath(false)
                })
              },
              fail(err) {
                wx.hideLoading()
              }
            })
            
          },
          fail(err) {
            wx.hideLoading()
          }
        })
      },
      fail(err) {
        wx.hideLoading()
      }
    })
  },
  canvasToTempFilePath(saveDirect) {
    let that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 3 * 375,
      height: 3 * 667,
      destWidth: 3 * 375,
      destHeight: 3 * 667,
      canvasId: 'sharePoster',
      success(res) {
        that.scanImage(res.tempFilePath)
      },
      fail(){
        wx.showToast({
          title: '操作失败',
          icon: 'fail',
          duration: 1500
        })
      }
    })
  },
  scanImage(tempFilePath){
    wx.previewImage({
      urls: [tempFilePath],
      fail(){
        wx.showToast({
          title: '预览失败',
          icon: 'none',
          duration: 1500
        })
      },
      complete(){
        wx.hideLoading()
      }
    })
  },
  showAddComment(e) {
    this.setData({
      addCommentsFlag: true,
      focus: true,
      selection_start: 0,
      selection_end: this.data.myCommentLength
    })
  },
  cancelAddComment(e){
    this.setData({
      addCommentsFlag: false,
      focus: false,
      selection_start: -1,
      selection_end: -1
    })
  },
  sureAddComment(e) {
    this.setData({
      myCommentValue: this.data.tempMyCommentValue,
      addCommentsFlag: false,
      focus: false,
      selection_start: -1,
      selection_end: -1
    })
  },
  bindCommentInput(e) {
    this.setData({
      myCommentLength: e.detail.cursor,
      tempMyCommentValue: e.detail.value.replace(/垃圾/g, '**')
    })
  }

})