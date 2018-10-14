var commonFunction = {
  //获取京东商品
  getJdList: function(page, keyword) {
    wx.request({
      url: "https://www.97youmeitao.com/api.php/quan.jd/getJdList",
      header: {
        "Content-Type": "application/json"
      },
      data: {
        page: page,
        keyword: keyword
      },
      success: function(res) {
        console.log(res);
      }
    });
  },
  //获取拼多多商品
  getPddList: function(page, keyword, type = 0) {
    wx.request({
      url: "https://www.97youmeitao.com/api.php/quan.pddapi/getGoodsList",
      header: {
        "Content-Type": "application/json"
      },
      data: {
        page: page,
        keyword: keyword,
        type: type
      },
      success: function(res) {
        console.log(res);
      }
    });
  }
};

module.exports = {
  getJdList: commonFunction.getJdList,
  getPddList: commonFunction.getPddList
};
