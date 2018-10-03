Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgHei: ""
  },
  save: function() {
    wx.previewImage({
      urls: ["http://pbn1t9k4c.bkt.clouddn.com/conKe.png"]
    });
  },
  onLoad: function() {
    const that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          imgHei: res.windowHeight - 60
        });
      }
    });
  }
});
