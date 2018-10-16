App({
  onLaunch: function() {
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      this.goLoginPageTimeOut();
      return;
    }
  },
  onShow: function() {},
  onHide: function() {},
  goLoginPageTimeOut: function() {
    setTimeout(function() {
      wx.navigateTo({
        url: "/pages/start/start"
      });
    }, 1000);
  },
  globalData: {
    userInfo: null,
    host: "https://www.97youmeitao.com/", //主域名
    getJdList: "api.php/quan.jd/getJdList", //京东外链默认抓取商品列表
    searchJdGood: "api.php/quan.jd/searchJdGood", //京东外链搜索商品
    getJdCoupon: "api.php/quan.jd/getJdCoupon", //生成京东联盟优惠券地址
    getGoodsList: "api.php/quan.pddapi/getGoodsList", //拼多多默认商品列表
    searchGoods: "api.php/quan.pddapi/searchGoods", //拼多多搜索商品
    goodsPromotionUrl: "api.php/quan.pddapi/goodsPromotionUrl", //拼多多转链
    setFavorite: "api.php/small.user/addfavorites", //添加收藏
    getFavorites: "api.php/small.user/getfavoriteslist", //获取收藏列表
    delFavorite: "api.php/small.user/delfavoriteslist", //删除收藏
    shareProfile: "一个不允许你不省钱的小程序", //分享标题
    shareImg:'http://pbn1t9k4c.bkt.clouddn.com/tbshareImg.jpg'
  }
});
