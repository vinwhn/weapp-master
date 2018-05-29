// pages/p2/p2.js
//QQMap API
var QQMapWX = require('../qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js');
var qqmapsdk;
var slctions=[''];
var app = getApp();
var mobileLocation = {
  longitude: 0,
  latitude: 0,
  address: '',
};
//var shktime = app.globalData.shktime;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selections: [''],   //选项集
    animationData: {},  //动画1
    animationData2: {}, //动画2
    i:0,                //随机数
    inx:0,              //选项列表长度
    current:'',         //当前类目
    iftip:false,
    address: '',         //当前地址
    longitude: '',       //经度  
    latitude: '',        //纬度
    changetext: '重新定位',      //改变的字符
    imgurl: "../index/img/fresh0.png", //改变的图片
    color: "#1296db",     //改变的文字颜色
    mobileLocation: {
      longitude: 0,
      latitude: 0,
      address: '',
    },
  },

  //
  //重新拉取附近的美食
  //
  reReqMapData: function(){   
    var that = this;
    qqmapsdk = new QQMapWX({
      key: 'ZNFBZ-RKXKK-ZDWJV-A566C-XKGVE-OBFCG',
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        //app.globalData.longitude=res.longitude;
        //app.globalData.latitude=res.latitude;
        getApp().globalData.longitude = res.longitude;
        getApp().globalData.latitude = res.latitude;
        var mobileLocation = {
          longitude: res.longitude,
          latitude: res.latitude,
        };
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        });
        wx.setStorage({
          key: 'longi',
          data: res.longitude,
        });
        wx.setStorage({
          key: 'lati',
          data: res.latitude,
        });
        qqmapsdk.reverseGeocoder({//腾讯地图逆地址解析
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            mobileLocation.address = address;
            that.setData({
              mobileLocation: mobileLocation,
              //changetext:'正在定位',
              //address:address,
            });
          }
        });
      }
    });  
    qqmapsdk.search({
      keyword:'美食',
      page_size: 10,
      success: function (res) {
        //console.log('新数据');
        for (var i = 0; i < 10; i++) {
          var t = res.data[i].title.indexOf('(');
          //console.log(res.data[i].title);
          if(t>0)
          {
            slctions[i] = res.data[i].title.slice(0,t);///截取出来不带括号的部分
          }
          else{
            slctions[i] = res.data[i].title.slice(0,14);
          }
          //console.log(slctions[i]);
        };
        //console.log(slctions)
        wx.setStorage({
          key: 'choices',
          data: slctions,
        });
        wx.setStorageSync("dType", 0);//0表示为饭馆页面进入
        //console.log("数据已写入");
        wx.setStorageSync('crt', '附近的美食');
        that.setData({
          selections: wx.getStorageSync('choices'),
          current:'附近的美食',
          changetext: '重新定位',
          imgurl: "../index/img/fresh0.png",
          color: "#1296db",
        });
      },
    })
    app.globalData.shktime = 0;
    that.setData({
      changetext: '正在定位',
      imgurl: "../index/img/fresh.png",
      color: "#ffa530",
    })
  },

  //
  //重新选取位置
  //
  chooseLocation: function () {//选择位置
    qqmapsdk = new QQMapWX({
      key: 'ZNFBZ-RKXKK-ZDWJV-A566C-XKGVE-OBFCG',
    });
    var that = this;
    wx.chooseLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      /*location:{
        longitude: mobileLocation.longitude,
        latitude: mobileLocation.latitude,
      },*/
      success: function (res) {
        getApp().globalData.longitude = res.longitude;
        getApp().globalData.latitude = res.latitude;
        wx.setStorage({
          key: 'longi',
          data: res.longitude,
        });
        wx.setStorage({
          key: 'lati',
          data: res.latitude,
        });
        let mobileLocation = {
          longitude: res.longitude,
          latitude: res.latitude,
          address: res.address,
        };
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            mobileLocation.address = address;
            //当前位置信息
            that.setData({
              mobileLocation: mobileLocation,
            });
          }
        });
        qqmapsdk.search({
          keyword: '美食',
          location: {
            latitude: mobileLocation.latitude,
            longitude: mobileLocation.longitude,
          },
          page_size: 10,
          success: function (res) {
            //console.log('新数据');
            for (var i = 0; i < 10; i++) {
              var t = res.data[i].title.indexOf('(');
              if (t > 0) {
                slctions[i] = res.data[i].title.slice(0, t);///截取出来不带括号的部分
              }
              else {
                slctions[i] = res.data[i].title.slice(0, 14);
              }
              //console.log(slctions[i]);
            };
            /*for(var i=0;i<slctions0.length;i++){
              if(slctions.indexOf(slctions0[i])==-1){
                slctions.push(slctions0[i]);
              }
            }*/
            //console.log(slctions)
            wx.setStorage({
              key: 'choices',
              data: slctions,
            });
            wx.setStorageSync("dType", 0);//0表示为饭馆页面进入
            //console.log("数据已写入");
            wx.setStorageSync('crt', '附近的美食');
            that.setData({
              selections: wx.getStorageSync('choices'),
              current: '附近的美食',
              location: {
                longitude: res.longitude,
                latitude: res.latitude,
              }
            });
          },
        })
        /*that.setData({
          mobileLocation: mobileLocation,
          //address:address,
        });*/
      },
      fail: function (res) {
        //fall
      },
      complete: function (res) {
        //complete
      },
    })
  },

  //
  //摇动抽签
  //
  shake2Toll: function(){

    var y = Math.floor(Math.random()*this.data.inx);
    this.setData({
      i:y,
    });
    //console.log(y);
    var animation = wx.createAnimation({
      duration: 80,
      timingFunction: 'ease-in-out',
      transformOrigin: '50% 50% 0',
      opacity: 0.8
    });
    var animation2 = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease-out',
      transformOrigin: '50% 50% 0',
      opacity: 0.8,
      delay:640
    });
    this.animation = animation;
    animation.translateX(40).rotate(30).translateY(15).step();
    animation.translateX(0).rotate(0).translateY(0).step();
    animation.translateX(-40).rotate(-30).translateY(15).step();
    animation.translateX(0).rotate(0).translateY(0).step();
    animation.translateX(40).rotate(30).translateY(15).step();
    animation.translateX(0).rotate(0).translateY(0).step();
    animation.translateX(-40).rotate(-30).translateY(15).step();
    animation.translateX(0).rotate(0).translateY(0).step();

    this.setData({
      animationData: this.animation.export(),
    });
    this.animation = animation2;
    animation2.translateY(-180).scale(2,2).step();
    this.setData({
      animationData2: this.animation.export(),
    });
    app.globalData.shktime++;
    if (app.globalData.shktime>=5){   
      this.setData({
        iftip:true,
      })
    }
  },
  //
  //选项缩回
  //
  removeTicket: function(){
    var animation = wx.createAnimation({
      duration: 70,
      timingFunction: 'ease-in-out',
      transformOrigin: '50% 50% 0',
      opacity: 0.8
    });
    animation.scale(0.5, 0.5).step();
    this.animation = animation;
    this.setData({
      animationData2:this.animation.export(),
    });
  },
  
  //
  //进入编辑选项
  //
  editOptions: function(){
    wx.navigateTo({
      url: '../p3/p3',
    })
  },

  test: function(){
    wx.showToast({
      title: 'Shaaaaaaaake!!',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //设置页标题
    wx.setNavigationBarTitle({
      title: '吃饭馆',
    });
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'ZNFBZ-RKXKK-ZDWJV-A566C-XKGVE-OBFCG',
    });
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
    //根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
    //app.globalData.longitude = res.longitude;
    //app.globalData.latitude = res.latitude;
        var mobileLocation = {
          longitude: wx.getStorageSync('longi') || res.longitude,
          latitude: wx.getStorageSync('lati') || res.latitude,
        };
    /*that.setData({
      latitude: wx.getStorageSync('lati'),
      longitude: wx.getStorageSync('longi'),
    }); */
        qqmapsdk.reverseGeocoder({
          location: {
            //latitude: getApp().globalData.latitude,
            //longitude: getApp().globalData.longitude,
            latitude: wx.getStorageSync('lati') || res.latitude,
            longitude: wx.getStorageSync('longi') || res.longitude,
          },
          success: function (addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            mobileLocation.address = address;
            that.setData({
              mobileLocation: mobileLocation,
              address: address,
            });
          }
        });
      }
    });
    slctions = wx.getStorageSync('choices') || [];//empty or saved value
    this.setData({
      current:(wx.getStorageSync('crt')||'附近的美食'),
    });
    if (slctions.length == 0)    //添加基于地理位置的选项
    {
      qqmapsdk.search({
        keyword: '美食',
        /*location: {
          longitude: mobileLocation.longitude,
          latitude: mobileLocation.latitude,
        },*/
        page_size: 10,
        success: function (res) {
          //console.log('新数据')
          for(var i=0;i<10;i++){
            slctions[i] = res.data[i].title;
          }
          //console.log(slctions)
          wx.setStorage({
            key: 'choices',
            data: slctions,
          })
          //console.log("数据已写入")
          that.setData({
            selections: wx.getStorageSync('choices'),
            inx: slctions.length,
          })
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      selections: wx.getStorageSync('choices'),
      inx: wx.getStorageSync('choices').length,
      current: (wx.getStorageSync('crt') || '附近的美食')
    })
    wx.setStorageSync('dType', 0);//从美食进入
    var that = this;
    this.ifshow = true;
    wx.onAccelerometerChange(function (res) {
      if (!that.ifshow) {
        return;
      }
      else {
        if (res.x > 3) {
          that.shake2Toll();
          console.log(res);
        }
      }
    });
    if (app.globalData.shktime >= 5) {
      this.setData({
        iftip: true,
      })
    }
    else{
      this.setData({
        iftip:false,
      })
    }
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.ifshow = false;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})