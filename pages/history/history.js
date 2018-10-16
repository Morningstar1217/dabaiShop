// pages/history/history.js

const app = getApp()
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
    favPage: true, //收藏页面不显示收藏
    titleMsg: '', //点击复制优惠券提示文字
    sureBuy: false, //遮罩是否打开
    currentPage: 1, //请求的当前页面页码
    showTop: false, //是否显示返回顶部按钮
    copysuccess: false, //是否复制成功
    nogoods: false, //没有商品
    pingtai: '', //平台
    delFlag: false, //是否选中
    consolePlat: false, //平台是否显示
    selectAllStatus: false, //全选
    footprint: [] //我的足迹
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var footprint = wx.getStorageSync('footprint')
    this.setData({
      footprint: footprint
    })
  },
  /* 复制优惠券 */
  goBuy: function(e) {
    const sku = e.currentTarget.id
    this.setData({
      pingtai: e.currentTarget.dataset.pingtai
    })
    if (this.data.pingtai == 'pdd') {
      const url = this.data.host + this.data.goodsPromotionUrl
      this.getCoupon(url, sku)
    } else {
      const url = this.data.host + this.data.getJdCoupon
      const goodUrl = e.currentTarget.dataset.url
      this.getCoupon(url, sku, goodUrl)
    }
  },
  /* 关闭遮罩 */
  closeWrap: function() {
    this.setData({
      sureBuy: false
    })
  },
  //领券
  getCoupon: function(url, sku, goodUrl) {
    const that = this
    wx.request({
      url: url,
      data: {
        sku: sku,
        url: goodUrl
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        if (that.data.pingtai == 'pdd') {
          const flag = res.data.data.url
          that.showTitle(flag)
        } else {
          const flag = res.data.data
          that.showTitle(flag)
        }
        wx.hideLoading()
      }
    })
  },
  //弹窗
  showTitle: function(flag) {
    const that = this
    if (flag) {
      wx.setClipboardData({
        data: flag,
        success: function() {
          wx.hideToast()
          if (that.data.pingtai == 'pdd') {
            that.setData({
              sureBuy: true,
              titleMsg: '拼多多',
              copysuccess: true
            })
          } else {
            that.setData({
              sureBuy: true,
              titleMsg: '京东',
              copysuccess: true
            })
          }
        }
      })
    } else {
      that.setData({
        sureBuy: true,
        titleMsg: '该商品优惠券已被抢光~\n再看看别的商品吧',
        copysuccess: false
      })
    }
  },
  /* 是否选定商品 */
  change: function(e) {
    console.log(e)
    const index = e.currentTarget.dataset.index
    let footprint = this.data.footprint // 获取购物车列表
    const selected = footprint[index].selected // 获取当前商品的选中状态
    footprint[index].selected = !selected // 改变状态
    this.setData({
      footprint: footprint
    })
  },
  /* 选择全部商品 */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus // 是否全选状态
    selectAllStatus = !selectAllStatus
    let footprint = this.data.footprint

    for (let i = 0; i < footprint.length; i++) {
      footprint[i].selected = selectAllStatus // 改变所有商品状态
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      footprint: footprint
    })
  },
  /* 删除商品 */
  deleteList(e) {
    let footprint = this.data.footprint
    let arr2 = []
    for (let i = 0; i < footprint.length; i++) {
      if (!footprint[i].selected) {
        arr2.push(footprint[i])
      }
    }
    this.setData({
      footprint: arr2
    })
    wx.setStorage({
      key: 'footprint',
      data: arr2
    })
  },
  //删除收藏
  delFavorite: function(sku, pingtai) {
    const that = this
    const unionid = wx.getStorageSync('unionid')
    const url = that.data.host + that.data.delFavorite
    wx.request({
      url: url,
      data: {
        unionid: unionid,
        sku: sku,
        pingtai: pingtai
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {}
    })
  },
  /* 管理收藏商品 */
  filterManager: function(e) {
    this.setData({
      consolePlat: !this.data.consolePlat
    })
  },
  //是否显示返回顶部
  onPageScroll: function(e) {
    if (e.scrollTop >= 500) {
      this.setData({
        showTop: true
      })
    } else {
      this.setData({
        showTop: false
      })
    }
  },
  //返回顶部
  toTop: function() {
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.setData({
      showTop: false
    })
  }
})
