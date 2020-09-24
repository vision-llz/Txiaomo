var http = require('http')
const iconv = require('iconv-lite');
let key = "sz002204,sh512690";
let url = 'http://hq.sinajs.cn/list=' + key;
// let url = "http://qt.gtimg.cn/q=sz000004"
let arr = []
let logTips = true
let searchGp = setInterval(() => {
    let data = new Date();
    let hours = data.getHours();
    let minute = data.getMinutes();

    if (hours >= 15) {
        console.log("今天已结束~")
        //下午三点关闭
        clearInterval(searchGp);
    } else if (hours < 13 && hours >= 11 && minute > 30) {
        if (hours >= 11 && minute > 30 && hours < 13 && logTips) {
            console.log("中午休息中~")
            logTips = false;
        }
    } else {
        logTips = true;
        // console.log(`${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`)
        http.get(url, (res) => {
            let datas = [];
            let size = 0;
            res.on('data', (data) => {
                datas.push(data);
                size += data.length;
            })
            res.on('end', function () {
                let data = [];
                if (datas.length === 0) {
                    returnErr('请换个关键词试试吧~', userName, bot)
                }
                let buff = Buffer.concat(datas, size);
                let result = iconv.decode(buff, 'utf8');

                // JSON.parse(result).list.forEach(element => {
                //     arr.push(element.thumb)
                // });
                let list = result.split(";");
                let price = "";
                let time = "";
                let amplitude = "";
                list.forEach(item => {
                    let listArr = item.split(',');
                    if (listArr.length < 3) {
                        return;
                    }
                    let itemPrice = listArr[3]
                    let yd = listArr[2]
                    let itemSpread = itemPrice - yd;
                    let itemAmplitude;
                    time = listArr[listArr.length - 2]
                    price += "[" + parseFloat(itemPrice).toFixed(3) + "] "
                    if (parseInt(itemPrice) > 0 && parseInt(yd) > 0) {
                        itemAmplitude = (itemSpread * 100 / itemPrice).toFixed(3) + "%·"
                    } else {
                        itemAmplitude = "0.00%·"
                    }
                    amplitude += itemAmplitude

                })
                console.log(time)
                console.log(price)
                console.log(amplitude)
            })
        }).on('error', (err) => {
            console.log('数据搜索失败====>' + err)
        })
    }
}, 2000);