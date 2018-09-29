// pages/history/history.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    footprint: [] //我的足迹
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var footprint = wx.getStorageSync("footprint");
    this.setData({
      footprint: footprint
    });
  },
  //删除足迹
  delete: function(e) {
    const index = e.currentTarget.dataset.index;
    var footprint = this.data.footprint;
    footprint.splice(index, 1);
    this.setData({
      footprint: footprint
    });
    wx.setStorage({
      key: "footprint",
      data: footprint
    });
  },
  //清空足迹
  clearFoot: function() {
    const that = this;
    wx.showModal({
      title: "大白提示",
      content: "是否清空足迹",
      success: function(res) {
        if (res.confirm) {
          var footprint = [];
          that.setData({
            footprint: footprint
          });
          wx.setStorage({
            key: "footprint",
            data: footprint
          });
        } else {
          return;
        }
      }
    });
  }
});
