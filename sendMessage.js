const https = require('https'); 
const querystring = require('querystring'); 
const url = require('url'); 
const util = require('./util'); 
const fs = require('fs'); 
const iconv = require('iconv-lite'); 
const writeFile = require('./write'); 
const request = require('request')
const searchBingImg =require('./searchImg')

function sendImg(params, name, bot) {
    if (!params||params.length<1) {
        return
    }
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

    /**
     * 必应
     */

    let imgData = []
    let subscriptionKey = '841a6d32d35148c69a6f29a4fef8ba6a'
    let host = 'api.cognitive.microsoft.com';
    let path = '/bing/v7.0/images/search';
    let term = params;

    let response_handler = function (response) {
        let body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            console.log('\nRelevant Headers:\n');
            for (var header in response.headers)
                // header keys are lower-cased by Node.js
                if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
                    // console.log(header + ": " + response.headers[header]);
                    // body = JSON.stringify(JSON.parse(body), null, '  ');
                    // console.log('\nJSON Response:\n');
                    imgData = JSON.parse(body).value;
                    let dataText = { dataName: params, dataArr: [], getUser: [] };
                    if (imgData && imgData.length > 0) {
                        for (const item of imgData) {
                            if (item.contentUrl.indexOf('?') !==-1) {
                                item.contentUrl=item.contentUrl.split('?')[0];
                            }
                            if (item && item.contentUrl != null) dataText.dataArr.push(item.contentUrl);
                        }
                    } else {
                        returnErr('请搜索别的关键字试试吧~', name, bot)
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
                    returnMsg(bot, img, dataText.dataName, name)
        });
        response.on('error', function (e) {
            console.log('Error: ' + e.message);
        });
    };

    let bing_image_search = function (search) {
        console.log('Searching images for: ' + term);
        let request_params = {
            method: 'GET',
            hostname: host,
            path: path + '?q=' + encodeURIComponent(search),
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
            }
        };

        let req = https.request(request_params, response_handler);
        req.end();
    }

    if (subscriptionKey.length === 32) {
        bing_image_search(term);
    } else {
        console.log('Invalid Bing Search API subscription key!');
        console.log('Please paste yours into the source code.');
    }
    
    
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
module.exports = { sendImg, returnErr};