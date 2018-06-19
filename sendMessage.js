const http = require('http'); 
const querystring = require('querystring'); 
const url = require('url'); 
const util = require('./util'); 
const fs = require('fs'); 
const iconv = require('iconv-lite'); 
const writeFile = require('./write'); 
const request = require('request')

function sendImg(params, name, bot) {
    /**
     * 读取img文件夹，查找已保存的关键字图片url
     */
    let filesList = fs.readdirSync('./media/imgNameArr')
    if (filesList.length > 0) {
        for (const file of filesList) {
            let fileName = file.split('.')[0]
            if (fileName === params) {
                let imgUrl = fs.readFileSync('./media/imgNameArr/' + fileName + '.txt'); 
                imgUrl = JSON.parse(iconv.decode(imgUrl, 'utf8'))
                let dataName = imgUrl.dataName; //图片搜索关键字
                let urlList = imgUrl.dataArr; //图片URL数组
                let getUsers = imgUrl.getUser; //搜索过改关键字的用户或群组
                let number = parseInt(urlList.length * Math.random())//生成一个随机整数
                returnMsg(bot, urlList[number], dataName, name); 
                return
            }
        }
    }
    let key = encodeURI(params); 
    // let url = 'http://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=' + key + '&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&word=' + key+'&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&pn=10&rn=10&gsm=1e&1528461395633=';
    let url = 'http://image.so.com/j?q=' + key + '&src=srp&correct=' + key+'&sn=60&pn=100';
// let url = 'http://pic.sogou.com/pics/channel/getAllRecomPicByTag.jsp?category=' + params + '&tag=' + params + '&start=15&len=15';
// let url = 'http://www.polaxiong.com/collections/get_entries_by_tags/' +key+'?{}';
// http://www.polaxiong.com/collections/get_entries_by_tags/'+key+'?{}

    http.get(url, (res) =>  {
        let datas = []; 
        let size = 0; 
        // res.setEncoding('utf8');
        res.on('data', (data) =>  {
            datas.push(data); 
            size += data.length; 
        })
        res.on('end', function() {
            let data = []; 
            if (datas.length === 0) {
                returnErr('请换个关键词试试吧~', userName, bot)
            }
            let buff = Buffer.concat(datas, size); 
            let result = iconv.decode(buff, 'utf8'); 
            data = JSON.parse(result).list; 
            /**
             * dataName:搜索图片的关键字
             * dataArr:图片数组
             * getUser:在微信搜索过该图片的用户
             */
            let dataText =  {dataName:params, dataArr:[], getUser:[]}; 
            if (data && data.length > 0) {
                for (const item of data) {
                    if (item && item.thumb != null) dataText.dataArr.push(item.thumb); 
                }
            }else {
                returnErr('请搜索别的关键字试试吧~', userName, bot)
                return
            }
            /**
             * 以搜索关键字命名存入./media/imgNameArr */
            // if (dataArr.length===0) {
            //     return
            // }
            writeFile.writeTxt(params, JSON.stringify(dataText))
            let number = parseInt(dataText.dataArr.length * Math.random())
            let img = dataText.dataArr[number]
            returnMsg(bot,img,dataText.dataName,name)
        })
    }).on('error', (err) =>  {
        console.log(err)
    })
}
function returnMsg(bot, url, urlname, userName) {
    try {
        console.log(url)
        console.log(urlname)
        console.log(userName)
        util.downloadImg(url, urlname)
        bot.sendMsg( {
            file:request(url), 
            filename:urlname + '.jpg'
        }, userName)
            .catch(err =>  {
                let imgArr=fs.readdirSync('./media/ImgFolder/'+urlname)
                bot.uploadMedia(fs.createReadStream('./media/ImgFolder/' + urlname + '/' + parseInt(imgArr.length * Math.random())))
                .then(res => {
                    return bot.sendPic(res.mediaId, userName)
                })
                .catch(err => {
                    console.log(err)
                })
            }) 
        // bot.sendPic(url)
        // .then(res=>{
        //     return bot.sendPic(urlname + '.jpg', userName)
        // })
        // .catch(err=>{
        //     returnErr(err, userName, bot)
        // })
        
    } catch (error) {
        returnErr('请搜索别的关键字试试吧~', userName, bot)
    }
}
function returnErr(msg,userName,bot) {
    bot.sendMsg(msg, userName)
        .catch(err => {
            bot.emit('error', err)
        })
}
module.exports={sendImg};