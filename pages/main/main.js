// pages/main/main.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],
    tools: [{
        name: "我的收藏",
        pic: "/images/fav.png",
        url: "/pages/favorite/favorite"
      },
      {
        name: "我的足迹",
        pic: "/images/history.png",
        url: "/pages/history/history"
      },
      {
        name: "新用户免单",
        pic: "/images/free.png",
        url: ""
      },
      {
        name: "查券教程",
        pic: "/images/search.png",
        url: ""
      },
      {
        name: "联系客服",
        pic: "/images/message.png",
        url: ""
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: wx.getStorageSync("userInfo")
    });
  },
  //分享
  onShareAppMessage: function() {
    return {
      title: app.globalData.shareProfile,
      path: "/pages/index/index",
      imageUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1538135479434&di=1e26798f3abe2b4feb34a3a47d9d9fcf&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F019e98554209ab0000019ae9764c6f.jpg",
      success: function(res) {
        // 转发成功
        wx.showToast({
          title: "转发成功",
          icon: "success"
        });
      },
      fail: function(res) {
        // 转发失败
      }
    };
  }
});