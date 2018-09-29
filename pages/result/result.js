// pages/result/result.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    host: app.globalData.host, //主网站地址
    getGoodsList: app.globalData.getGoodsList, //获取拼多多外链地址
    goodsPromotionUrl: app.globalData.goodsPromotionUrl, //拼多多优惠券转链
    searchGoods: app.globalData.searchGoods, //拼多多搜索商品
    getJdList: app.globalData.getJdList, //京东外链默认抓取商品列表
    searchJdGood: app.globalData.searchJdGood, //京东外链搜索商品
    getJdCoupon: app.globalData.getJdCoupon, //生成京东联盟优惠券地址
    setFavorite: app.globalData.setFavorite, //添加收藏
    featuredComList: [], //商品列表
    titleMsg: "", //点击复制优惠券提示文字
    sureBuy: false, //遮罩是否打开
    currentPage: 1, //请求的当前页面页码
    showTop: false, //是否显示返回顶部按钮
    shopId: 0, //选择购物平台 0 为拼多多 1 为京东
    searchValue: "", //搜索输入
    copysuccess: false, //是否复制成功
    nogoods: false, //没有商品
    //历史记录
    historys: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      searchValue: options.keyword,
      shopId: options.shopId
    });
    this.goSearch();
  },
  //记录搜索字
  remSearch: function(e) {
    this.setData({
      searchValue: e.detail.value
    });
  },
  //切换平台
  changeShop: function(e) {
    wx.showLoading({
      title: "请稍后..."
    });
    if (e.currentTarget.id == 0) {
      this.setData({
        shopId: 0,
        featuredComList: [],
        currentPage: 1
      });
      this.getGoodsList();
    } else {
      this.setData({
        shopId: 1,
        featuredComList: [],
        currentPage: 1
      });
      this.getJdList();
    }
  },
  //搜索
  goSearch: function() {
    var historys = wx.getStorageSync("historys");
    if (!historys) {
      historys = [];
    }
    var keyword = this.data.searchValue;
    historys.unshift(keyword);
    this.setData({
      historys: historys
    });
    wx.setStorage({
      key: "historys",
      data: historys
    });
    this.setData({
      featuredComList: [],
      currentPage: 1
    });
    if (this.data.shopId == 0) {
      this.getGoodsList();
    } else {
      this.getJdList();
    }
  },
  /* 复制优惠券 */
  goBuy: function(e) {
    const sku = e.currentTarget.id;
    if (this.data.shopId == 0) {
      const url = this.data.host + this.data.goodsPromotionUrl;
      this.getCoupon(url, sku);
    } else {
      const url = this.data.host + this.data.getJdCoupon;
      const goodUrl = e.currentTarget.dataset.url;
      this.getCoupon(url, sku, goodUrl);
    }
    this.setFootprint(e);
  },
  //足迹
  setFootprint: function(e) {
    var footprint = wx.getStorageSync("footprint");
    if (!footprint) {
      footprint = [];
    }
    const foot = {
      pic: e.currentTarget.dataset.pic,
      price: e.currentTarget.dataset.price
    };
    footprint.unshift(foot);
    wx.setStorage({
      key: "footprint",
      data: footprint
    });
  },
  /* 关闭遮罩 */
  closeWrap: function() {
    this.setData({
      sureBuy: false
    });
  },
  //获取商品链接
  getGoodsList: function() {
    const goodsUrl = this.data.host + this.data.searchGoods;
    const keyword = this.data.searchValue;
    this.getData(goodsUrl, keyword);
  },
  //获取京东商品链接
  getJdList: function() {
    const goodsUrl = this.data.host + this.data.searchJdGood;
    const keyword = this.data.searchValue;
    this.getData(goodsUrl, keyword);
  },
  //获取更多
  getMoreGoodsList: function() {
    if (this.data.shopId == 0) {
      this.getGoodsList();
    } else {
      this.getJdList();
    }
  },
  //是否显示返回顶部
  onPageScroll: function(e) {
    if (e.scrollTop >= 500) {
      this.setData({
        showTop: true
      });
    } else {
      this.setData({
        showTop: false
      });
    }
  },
  //返回顶部
  toTop: function() {
    wx.pageScrollTo({
      scrollTop: 0
    });
    this.setData({
      showTop: false
    });
  },
  //切换条件筛选
  changeFilter: function(e) {
    this.setData({
      filterCount: e.currentTarget.id
    });
  },
  //网络请求
  getData: function(url, name) {
    const that = this;
    wx.request({
      url: url,
      data: {
        page: that.data.currentPage,
        keyword: name
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function(res) {
        if (res.data.code == -1) {
          that.setData({
            nogoods: true
          });
        } else {
          const arr1 = that.data.featuredComList;
          const arr2 = res.data.data.list;
          arr1.push.apply(arr1, arr2);
          if (arr1.length == 0) {
            that.setData({
              nogoods: true
            });
          } else {
            that.setData({
              featuredComList: arr1,
              currentPage: that.data.currentPage + 1,
              nogoods: false
            });
          }
        }
        wx.hideLoading();
      }
    });
  },
  //领券
  getCoupon: function(url, sku, goodUrl) {
    const that = this;
    wx.request({
      url: url,
      data: {
        sku: sku,
        url: goodUrl
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function(res) {
        console.log(res);
        if (that.data.shopId == 0) {
          const flag = res.data.data.url;
          that.showTitle(flag);
        } else {
          const flag = res.data.data;
          that.showTitle(flag);
        }
        wx.hideLoading();
      }
    });
  },
  //弹窗
  showTitle: function(flag) {
    const that = this;
    if (flag) {
      wx.setClipboardData({
        data: flag,
        success: function() {
          wx.hideToast();
          if (that.data.shopId == 0) {
            that.setData({
              sureBuy: true,
              titleMsg: "拼多多",
              copysuccess: true
            });
          } else {
            that.setData({
              sureBuy: true,
              titleMsg: "京东",
              copysuccess: true
            });
          }
        }
      });
    } else {
      that.setData({
        sureBuy: true,
        titleMsg: "该商品优惠券已被抢光~\n再看看别的商品吧",
        copysuccess: false
      });
    }
  },
  //滑动触底
  onReachBottom: function(e) {
    this.getMoreGoodsList();
  },
  //收藏
  setCol: function(e) {
    const dataset = e.currentTarget.dataset;
    const that = this;
    const shopId = that.data.shopId;
    const url = that.data.host + that.data.setFavorite;
    const unionid = wx.getStorageSync("unionid");
    //拼多多
    if (shopId == 0) {
      var pingtai = "pdd";
    } else {
      var pingtai = "jd";
    }
    wx.request({
      url: url,
      data: {
        unionid: unionid,
        sku: dataset.sku,
        title: dataset.title,
        couponLink: dataset.couponLink,
        market_price: dataset.marketprice,
        price: dataset.price,
        pic: dataset.pic,
        pingtai: pingtai
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function(res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: "收藏成功",
            icon: "success"
          });
        }
      }
    });
  }
});
