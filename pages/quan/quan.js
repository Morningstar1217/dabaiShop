// pages/quan/quan.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopId: 0 //选择购物平台
  },
  //切换平台
  changeShop: function(e) {
    if (e.currentTarget.id == 0) {
      this.setData({
        shopId: 0,
        featuredComList: [],
        currentPage: 1
      })
    } else {
      this.setData({
        shopId: 1,
        featuredComList: [],
        currentPage: 1
      })
    }
  },
  //打开搜索页面
  toSearch: function(e) {
    const shopId = this.data.shopId
    wx.navigateTo({
      url: '/pages/search/search?shopId=' + shopId
    })
  },
  //分享
  onShareAppMessage: function() {
    return {
      title: app.globalData.shareProfile,
      path: '/pages/index/index',
      imageUrl: app.globalData.shareImg,
      success: function(res) {},
      fail: function(res) {}
    }
  }
})
