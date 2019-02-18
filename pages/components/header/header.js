// pages/components/header/header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    phone:{
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickHeader: function(){
      wx.createAnimation({
        
      })
    },
    change: function(){
      this.triggerEvent('myevent',{phone: 8})
    }
  }
})
