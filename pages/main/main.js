// pages/main/main.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],
    tools: [
      {
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
        url: "/pages/freePoster/freePoster"
      },
      {
        name: "查券教程",
        pic: "/images/search.png",
        url: ""
      },
      {
        name: "联系客服",
        pic: "/images/message.png",
        url: "/pages/conKe/conKe"
      }
    ],
    painting: {},
    shareImage: "",
    showFlag: false
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
      imageUrl:
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1538135479434&di=1e26798f3abe2b4feb34a3a47d9d9fcf&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F019e98554209ab0000019ae9764c6f.jpg",
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
  },
  //绘图
  eventDraw() {
    wx.showLoading({
      title: "绘制分享图片中",
      mask: true
    });
    const userInfo = wx.getStorageSync("userInfo");
    this.setData({
      painting: {
        width: 375,
        height: 555,
        views: [
          {
            type: "image",
            url: "/images/background.jpeg",
            top: 0,
            left: 0,
            width: 375,
            height: 555
          },
          {
            type: "image",
            url: userInfo.avatarUrl,
            top: 27.5,
            left: 29,
            width: 55,
            height: 55
          },
          {
            type: "image",
            url: "/images/avatar_cover.jpeg",
            top: 27.5,
            left: 29,
            width: 55,
            height: 55
          },
          {
            type: "text",
            content: "您的好友【" + userInfo.nickName + "】",
            fontSize: 16,
            color: "#402D16",
            textAlign: "left",
            top: 33,
            left: 96,
            bolder: true
          },
          {
            type: "text",
            content: "发现一个好地方，邀请你一起来~",
            fontSize: 15,
            color: "#563D20",
            textAlign: "left",
            top: 59.5,
            left: 96
          },
          {
            type: "image",
            url: "/images/pic.jpeg",
            top: 136,
            left: 42.5,
            width: 290,
            height: 186
          },
          {
            type: "image",
            url: "/images/wxacode.jpg",
            top: 443,
            left: 85,
            width: 68,
            height: 68
          },

          {
            type: "text",
            content: "长按识别图中二维码加入大白之家",
            fontSize: 14,
            color: "#383549",
            textAlign: "left",
            top: 460,
            left: 165.5,
            lineHeight: 20,
            MaxLineNumber: 2,
            breakWord: true,
            width: 125
          }
        ]
      }
    });
  },
  eventGetImage(event) {
    console.log(event);
    wx.hideLoading();
    const { tempFilePath, errMsg } = event.detail;
    if (errMsg == "canvasdrawer:ok") {
      this.setData({
        shareImage: tempFilePath,
        showFlag: true
      });
    } else if (errMsg == "canvasdrawer:samme params") {
      this.setData({
        showFlag: true
      });
    }
  },
  //隐藏
  hideWrap: function() {
    this.setData({
      showFlag: false
    });
  },
  //保存
  save: function() {
    wx.previewImage({
      urls: [this.data.shareImage]
    });
  }
});
