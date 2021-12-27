var http = require("http");
var player = require("play-sound")((opts = {}));
const iconv = require("iconv-lite");
let key = "sh600031,sz002407,sh600237,sh601633,sz002747,sh600338,sh600111,sz000301,sz002600,sh600702,sh600779";
let url = "http://hq.sinajs.cn/list=" + key;
// let url = "http://qt.gtimg.cn/q=sz000004"
let arr = [];
let audio = undefined;
let logTips = true;
const soundPlayer = (play = true, assets) => {
  if (!play) {
    audio && audio.kill();
    return;
  }
  audio = player.play("", function (err) {
    if (err && !err.killed) throw err;
  });
};
let searchGp = setInterval(() => {
  let data = new Date();
  let hours = data.getHours();
  let minute = data.getMinutes();

  if (hours >= 15) {
    console.log("今天已结束~");
    //下午三点关闭
    clearInterval(searchGp);
  } else if (hours < 13 && hours >= 11 && minute > 30) {
    if (hours >= 11 && minute > 30 && hours < 13 && logTips) {
      console.log("中午休息中~");
      logTips = false;
    }
  } else {
    logTips = true;
    // console.log(`${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`)
    http
      .get(url, (res) => {
        let datas = [];
        let size = 0;
        res.on("data", (data) => {
          datas.push(data);
          size += data.length;
        });
        res.on("end", function () {
          let data = [];
          if (datas.length === 0) {
            returnErr("请换个关键词试试吧~", userName, bot);
          }
          let buff = Buffer.concat(datas, size);
          let result = iconv.decode(buff, "utf8");

          // JSON.parse(result).list.forEach(element => {
          //     arr.push(element.thumb)
          // });
          let list = result.split(";");
          let price = "";
          let time = "";
          let amplitude = "";
          list.forEach((item) => {
            let listArr = item.split(",");
            if (listArr.length < 3) {
              return;
            }
            let itemPrice = listArr[3];
            let yd = listArr[2];
            let itemSpread = itemPrice - yd;
            let itemAmplitude;
            time = listArr[listArr.length - 2];
            price += "[" + parseFloat(itemPrice).toFixed(2) + "]";
            if (parseInt(itemPrice) > 0 && parseInt(yd) > 0) {
              itemAmplitude =
                ((itemSpread * 100) / itemPrice).toFixed(2) + "%·";
            } else {
              itemAmplitude = "0.00%·";
            }
            amplitude += itemAmplitude;
          });
          let date = new Date();
          console.log(
            `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
          );
          console.log("[三一] [dfd] [铜峰] [ccqc][埃斯顿][珠峰] [bfxt] [盛虹] [领益] [舍得][水井坊]");
          console.log(price);
          console.log(amplitude);
        });
      })
      .on("error", (err) => {
        console.log("数据搜索失败====>" + err);
      });
  }
}, 1500);
