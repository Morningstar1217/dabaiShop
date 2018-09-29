const app = getApp();
const funs = require("../../common/function.js");
Page({
  data: {
    menu: [
      {
        id: 0,
        name: "全部"
      },
      {
        id: 1,
        name: "服装"
      },
      {
        id: 2,
        name: "母婴"
      },
      {
        id: 3,
        name: "女装"
      },
      {
        id: 4,
        name: "内衣"
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
        name: "家纺"
      },
      {
        id: 8,
        name: "运动"
      },
      {
        id: 9,
        name: "居家"
      }
    ],
    imgUrls: [
      "/images/banner1.jpg",
      "/images/banner2.jpg",
      "/images/banner3.jpg",
      "/images/banner4.jpg"
    ],
    count: 0, //选择分类
    menuFlag: true, //是否打开全部分类
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
    shopId: 0, //选择购物平台
    copysuccess: false, //是否复制成功
    nogoods: false, //没有商品
    filterCount: 0, //条件筛选
    footprint: [] //足迹
  },
  onLoad: function() {
    this.getGoodsList();
  },
  //打开搜索页面
  toSearch: function(e) {
    const shopId = this.data.shopId;
    wx.navigateTo({
      url: "/pages/search/search?shopId=" + shopId
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
  /* 选择分类 */
  changeMenu: function(e) {
    wx.showLoading({
      title: "请稍后..."
    });
    this.setData({
      count: e.target.id,
      currentPage: 1,
      featuredComList: []
    });
    if (this.data.shopId == 0) {
      this.getGoodsList();
    } else {
      this.getJdList();
    }
  },
  /* 打开全部分类 */
  openMenu: function() {
    this.setData({
      menuFlag: !this.data.menuFlag
    });
  },
  /* 复制优惠券 */
  goBuy: function(e) {
    this.setFootprint(e);
    const sku = e.currentTarget.id;
    if (this.data.shopId == 0) {
      const url = this.data.host + this.data.goodsPromotionUrl;
      this.getCoupon(url, sku);
    } else {
      const url = this.data.host + this.data.getJdCoupon;
      const goodUrl = e.currentTarget.dataset.url;
      this.getCoupon(url, sku, goodUrl);
    }
    //添加足迹
  },
  /* 关闭遮罩 */
  closeWrap: function() {
    this.setData({
      sureBuy: false
    });
  },
  //获取商品链接
  getGoodsList: function() {
    if (this.data.count == 0) {
      const goodsUrl = this.data.host + this.data.getGoodsList;
      this.getData(goodsUrl);
    } else {
      const goodsUrl = this.data.host + this.data.searchGoods;
      const keyword = this.data.menu[this.data.count].name;
      this.getData(goodsUrl, keyword);
    }
  },
  //获取京东商品链接
  getJdList: function() {
    if (this.data.count == 0) {
      const goodsUrl = this.data.host + this.data.getJdList;
      this.getData(goodsUrl);
    } else {
      const goodsUrl = this.data.host + this.data.searchJdGood;
      const keyword = this.data.menu[this.data.count].name;
      this.getData(goodsUrl, keyword);
    }
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
      filterCount: e.currentTarget.id,
      featuredComList: [],
      currentPage: 1
    });
    if (this.data.shopId == 0) {
      this.getGoodsList();
    } else {
      this.getJdList();
    }
  },
  //网络请求
  getData: function(url, name, sku) {
    const that = this;
    const type = that.data.filterCount;
    wx.request({
      url: url,
      data: {
        page: that.data.currentPage,
        keyword: name,
        sku: sku,
        type: type
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function(res) {
        console.log(res);
        if (res.code == -1) {
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
        console.log(res);
        if (res.data.code == 1) {
          wx.showToast({
            title: "收藏成功",
            icon: "success"
          });
        }
      }
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
  //足迹
  setFootprint: function(e) {
    console.log(e);
    var footprint = wx.getStorageSync("footprint");
    if (!footprint) {
      footprint = [];
    }
    var pingtai = "";
    if (this.data.shopId == 0) {
      pingtai = "pdd";
    } else {
      pingtai = "jd";
    }
    const foot = {
      pic: e.currentTarget.dataset.pic,
      price: e.currentTarget.dataset.price,
      title: e.currentTarget.dataset.title,
      sku: e.currentTarget.id,
      couponLink: e.currentTarget.dataset.url,
      market_price: e.currentTarget.dataset.marketprice,
      price: e.currentTarget.dataset.price,
      pingtai: pingtai
    };
    footprint.unshift(foot);
    wx.setStorage({
      key: "footprint",
      data: footprint
    });
  }
});
