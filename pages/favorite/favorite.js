// pages/favorite/favorite.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    host: app.globalData.host, //主网址
    getFavorites: app.globalData.getFavorites, //获取收藏
    delFavorite: app.globalData.delFavorite, //删除收藏
    goodsPromotionUrl: app.globalData.goodsPromotionUrl, //拼多多优惠券转链
    getJdCoupon: app.globalData.getJdCoupon, //生成京东联盟优惠券地址
    featuredComList: [], //商品列表
    favs: [], //收藏列表记录
    favPage: true, //收藏页面不显示收藏
    titleMsg: "", //点击复制优惠券提示文字
    sureBuy: false, //遮罩是否打开
    currentPage: 1, //请求的当前页面页码
    showTop: false, //是否显示返回顶部按钮
    copysuccess: false, //是否复制成功
    nogoods: false, //没有商品
    pingtai: "", //平台
    delFlag: false, //是否选中
    consolePlat: false, //平台是否显示
    selectAllStatus: false, //全选
    consoMsg: "编辑", //编辑收藏
    keyword: "" //搜索关关键字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getFavs();
  },
  //获取收藏列表
  getFavs: function() {
    const that = this;
    const unionid = wx.getStorageSync("unionid");
    const url = that.data.host + that.data.getFavorites;
    wx.request({
      url: url,
      data: {
        unionid: unionid
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function(res) {
        console.log(res);
        if (res.data.code == -1) {
          that.setData({
            nogoods: true
          });
        } else {
          const featuredComList = res.data.data;
          featuredComList.reverse();
          that.setData({
            featuredComList: featuredComList,
            favs: featuredComList
          });
        }
      }
    });
  },
  /* 复制优惠券 */
  goBuy: function(e) {
    const sku = e.currentTarget.id;
    this.setData({
      pingtai: e.currentTarget.dataset.pingtai
    });
    if (this.data.pingtai == "pdd") {
      const url = this.data.host + this.data.goodsPromotionUrl;
      this.getCoupon(url, sku);
    } else {
      const url = this.data.host + this.data.getJdCoupon;
      const goodUrl = e.currentTarget.dataset.url;
      this.getCoupon(url, sku, goodUrl);
    }
  },
  /* 关闭遮罩 */
  closeWrap: function() {
    this.setData({
      sureBuy: false
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
        if (that.data.pingtai == "pdd") {
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
          if (that.data.pingtai == "pdd") {
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
  /* 是否选定商品 */
  change: function(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    let featuredComList = this.data.featuredComList; // 获取购物车列表
    const selected = featuredComList[index].selected; // 获取当前商品的选中状态
    featuredComList[index].selected = !selected; // 改变状态
    this.setData({
      featuredComList: featuredComList
    });
  },
  /* 选择全部商品 */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus; // 是否全选状态
    selectAllStatus = !selectAllStatus;
    let featuredComList = this.data.featuredComList;

    for (let i = 0; i < featuredComList.length; i++) {
      featuredComList[i].selected = selectAllStatus; // 改变所有商品状态
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      featuredComList: featuredComList
    });
  },
  /* 删除商品 */
  deleteList(e) {
    let featuredComList = this.data.featuredComList;
    let arr2 = [];
    for (let i = 0; i < featuredComList.length; i++) {
      if (!featuredComList[i].selected) {
        arr2.push(featuredComList[i]);
      } else {
        this.delFavorite(featuredComList[i].sku, featuredComList[i].pingtai);
      }
      this.setData({
        featuredComList: arr2
      });
    }
  },
  //删除收藏
  delFavorite: function(sku, pingtai) {
    const that = this;
    const unionid = wx.getStorageSync("unionid");
    const url = that.data.host + that.data.delFavorite;
    wx.request({
      url: url,
      data: {
        unionid: unionid,
        sku: sku,
        pingtai: pingtai
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function(res) {}
    });
  },
  /* 管理收藏商品 */
  filterManager: function(e) {
    this.setData({
      consolePlat: !this.data.consolePlat
    });
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
  //保存搜索关键字
  remSearch: function(e) {
    this.setData({
      keyword: e.detail.value
    });
  },
  //搜索收藏产品
  toSearch: function() {
    var favs = this.data.favs;
    const keyword = this.data.keyword;
    this.setData({ consolePlat: false });
    if (!keyword) {
      this.getFavs();
    } else {
      var arr2 = [];
      favs.forEach(ele => {
        if (ele.title.match(keyword)) {
          arr2.unshift(ele);
        }
      });
      this.setData({
        featuredComList: arr2
      });
    }
  }
});
