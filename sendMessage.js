const https = require('https'); 
const querystring = require('querystring'); 
const url = require('url'); 
const util = require('./util'); 
const fs = require('fs'); 
const iconv = require('iconv-lite'); 
const writeFile = require('./write'); 
const request = require('request')
const searchImg =require('./searchImg')



function sendImg(params, name, bot) {
    if (!params||params.length<1) {
        console.log('1')
        return
    }
    let searchImgFun = new Promise(function (resolve, reject) {
        console.log('2')
        searchImg.searchSoImg(resolve,params);
    })
    searchImgFun.then(function(value) {
        console.log('3')
        console.log(value)
        let term = params;
        let dataText = { dataName: params, dataArr: [], getUser: [] };
        if (value && value.length > 0) {
            dataText.dataArr = value
            writeFile.writeTxt(params, JSON.stringify(dataText))
            let number = parseInt(dataText.dataArr.length * Math.random())
            let img = dataText.dataArr[number]
            returnMsg(bot, img, dataText.dataName, name)
        }else{
            /**
             * 读取img文件夹，查找已保存的关键字图片url
             */
            let filesList = fs.readdirSync('./media/imgFolder')
            console.log('发图======>name:' + name)
            if (filesList.length > 0) {
                if (filesList.indexOf(params + '.txt') === -1) {
                    console.log('文件读取err')
                    returnImgErr(bot, name, '搜图')
                    return
                }
                for (const file of filesList) {
                    let fileName = file.split('.')[0]
                    if (fileName === params) {
                        let imgUrl = fs.readFileSync('./media/imgFolder/' + fileName + '.txt');
                        imgUrl = JSON.parse(iconv.decode(imgUrl, 'utf8'))
                        let dataName = imgUrl.dataName; //图片搜索关键字
                        let urlList = imgUrl.dataArr; //图片URL数组
                        let getUsers = imgUrl.getUser; //搜索过该关键字的用户或群组
                        let number = parseInt(urlList.length * Math.random())//生成一个随机整数
                        returnMsg(bot, urlList[number], dataName, name);
                        return
                    }
                }
            }
        }
    }).catch(function(err) {
        console.log('嗯哼=========>'+err)
        bot.uploadMedia(fs.createReadStream('./media/嗯哼.png'))
            .then(res => {
                return bot.sendPic(res.mediaId, name)
            })
            .catch(err => {
                console.log(err)
            })
        return
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
                console.log('发送图片第一次进入catch--------------->')
                let imgArr=fs.readdirSync('./media/ImgFolder/'+urlname)
                bot.uploadMedia(fs.createReadStream('./media/ImgFolder/' + urlname + '/' + parseInt(imgArr.length * Math.random())))
                .then(res => {
                    return bot.sendPic(res.mediaId, userName)
                })
                .catch(err => {
                    console.log('发送图片第二次进入catch--------------->')
                    returnImgErr(bot, userName,'搜图')
                })
            }) 
        
    } catch (error) {
        console.log('------------------------returnMsg失败------------------------')
        console.log(error)
    }
}
function returnTxt(msg,userName,bot) {
    bot.sendMsg(msg, userName)
        .catch(err => {
            bot.emit('error', err)
        })
}

function returnImgErr(bot,name,params) {
    let img=''
    switch (params) {
        case '搜图':
            img='嗯哼'
            break;
        case '识图':
            img='罢工了'
            break;
        default:
            break;
    }
    bot.uploadMedia(fs.createReadStream('./media/' + img+'.png'))
        .then(res => {
            return bot.sendPic(res.mediaId, name)
        })
        .catch(err => {
            console.log('发送图片第三次进入catch--------------->')
            console.log(err)
        })
}
module.exports = { sendImg, returnTxt, returnImgErr};