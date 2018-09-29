// pages/search/search.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menu: [
      {
        id: 0,
        name: "服装"
      },
      {
        id: 1,
        name: "电暖气"
      },
      {
        id: 2,
        name: "心机上衣女"
      },
      {
        id: 3,
        name: "男装"
      },
      {
        id: 4,
        name: "秋新款"
      },
      {
        id: 5,
        name: "手机"
      },
      {
        id: 6,
        name: "电器"
      },
      {
        id: 7,
        name: "手机壳"
      }
    ],
    shopId: 0, //选择购物平台
    //历史记录
    historys: [],
    searchValue: "" //搜索输入
  },
  onLoad: function(options) {
    if (options) {
      this.setData({
        shopId: options.shopId
      });
    }
  },
  onShow: function() {
    if (!wx.getStorageSync("historys")) {
      this.setData({
        historys: []
      });
    } else {
      const historys = wx.getStorageSync("historys");
      this.setData({
        historys: historys
      });
    }
  },
  //切换平台
  changeShop: function(e) {
    if (e.currentTarget.id == 0) {
      this.setData({
        shopId: 0,
        featuredComList: [],
        currentPage: 1
      });
    } else {
      this.setData({
        shopId: 1,
        featuredComList: [],
        currentPage: 1
      });
    }
  },
  //记录搜索字
  remSearch: function(e) {
    this.setData({
      searchValue: e.detail.value
    });
  },
  //搜索
  goSearch: function() {
    var keyword = this.data.searchValue;
    if (!keyword) {
      keyword = this.data.menu[0].name;
    }
    const shopId = this.data.shopId;
    wx.navigateTo({
      url: "/pages/result/result?keyword=" + keyword + "&shopId=" + shopId
    });
  },
  //点击热门搜索
  goHotSearch: function(e) {
    const keyword = this.data.menu[e.currentTarget.id].name;
    this.setData({
      searchValue: keyword
    });
    this.goSearch();
  },
  //点击历史记录搜索
  goHisSearch: function(e) {
    const keyword = this.data.historys[e.currentTarget.dataset.index];
    this.setData({
      searchValue: keyword
    });
    this.goSearch();
  },
  //删除当前
  delete: function(e) {
    const index = e.currentTarget.dataset.index;
    const historys = this.data.historys;
    historys.splice(index, 1);
    this.setData({
      historys: historys
    });
    wx.setStorage({
      key: "historys",
      data: historys
    });
  },
  //清空历史记录
  deleteAll: function() {
    const that = this;
    wx.showModal({
      title: "大白提示",
      content: "确定清空吗?",
      success: function(res) {
        if (res.confirm) {
          const historys = that.data.historys;
          historys.splice(0);
          that.setData({
            historys: historys
          });
          wx.setStorage({
            key: "historys",
            data: historys
          });
        } else {
          return;
        }
      }
    });
  }
});
