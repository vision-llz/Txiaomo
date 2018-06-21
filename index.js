'use strict'

require('babel-register')
const Wechat = require('./src/wechat.js'); 
const fs = require('fs'); 
const write=require('./write')
const qrcode = require('qrcode-terminal'); 
const sendMsg = require('./sendMessage');
const request = require('request');
const AipImgClient=require('baidu-aip-sdk').imageClassify;
const HttpClient=require('baidu-aip-sdk').HttpClient;

/**
 * 百度识图
 */
var APP_ID ='11421710';
var API_KEY = 'sizwkNgutxLAZghEdfhHIULh';
var SECRET_KEY ='cgnAEhKrokh0lmUuuqFEmbpeEGXhQ4zt';
var aipImgClient=new AipImgClient(APP_ID,API_KEY,SECRET_KEY);
HttpClient.setRequestOptions({ timeout: 5000 });
HttpClient.setRequestInterceptor(function (requestOptions) {
    return requestOptions;
})

let bot, loginUserName; 
let snalysisNameArr = [];   //临时存储识图用户
try {
    bot = new Wechat(require('./sync-data.json'))
}catch (error) {
    bot = new Wechat(); 
}
/**
 * 启动机器人
 */
if (bot.PROP.uin) {
    bot.restart(); 
}else {
    bot.start(); 
}
/**
 * uuid事件
 */
bot.on('uuid', uuid =>  {
    console.log('uuid=' + uuid); 
    console.log('请扫码登录'); 
    qrcode.generate('https://login.weixin.qq.com/l/'+uuid,{
small:true
    }); 
})
/**
 * 登录
 */
bot.on('user-avatar', avatar =>  {
    // console.log('用户头像url=', avatar);
})
/**
 * 登陆成功
 */
bot.on('login', () =>  {
    console.log('登陆成功'); 
    fs.writeFileSync('./sync-data.json', JSON.stringify(bot.botData)); 
    console.log(bot)
    loginUserName = bot.botData.user.UserName;
    setTimeout(() => {
        let data=''
        console.log(bot.contacts)
        // bot.contacts.forEach(element => {
        //     if (element.UserName.slice(0,2) === '@@') {
        //         data+=element.NickName+'\n'
        //     }
        // });
        for (const key in bot.contacts) {
            if (key.slice(0,2) === '@@') {
                data += bot.contacts[key].NickName+'\n'
            }
        }
        write.writeTxt('联系人', data)
    }, 10000);
})
/**
 * 联系人更新事件，参数为被更新的联系人列表
 */
bot.on('contacts-updated', contacts => {
    Object.keys(bot.contacts)
    

})
/**
 * 登出成功
 */
bot.on('logout', () =>  {
    console.log('登出成功')
    // 清除数据
    fs.unlinkSync('./sync-data.json')
})
/**
 * 获取消息
 */
bot.on('message', msg =>  {
    /**
     * 发送时间
     */
    console.log('发送时间--->'+msg.getDisplayTime());
    /**
     * 消息发送者姓名
     */
    let userName = bot.contacts[msg.FromUserName].getDisplayName();
    console.log('来自--->' + userName);
    // console.log(bot.contacts[msg.FromUserName].getNickName());
    /**
     * 判断消息类型
     */
    let toMsgName='';
    if (msg.ToUserName.indexOf('@@')!==-1) {
        toMsgName=msg.ToUserName
    }else{
        if (msg.FromUserName === loginUserName) {
            toMsgName = msg.ToUserName
        }else{
            toMsgName=msg.FromUserName
        }
    }
    
    /**
     * 消息来源用户
     */
    // console.log(msg)
    let fromName=msg.FromUserName;
    console.log('fromName====>' + fromName)
    switch (msg.MsgType) {
        case bot.CONF.MSGTYPE_TEXT:
        /**
         * 文本消息
         * 
         */
        let text=msg.Content;
        if (text.charAt(0) === '@' && text.indexOf('\n') !== -1) {
            text=text.slice(text.indexOf('\n')+1,text.length);
        }
        // if (userName.indexOf('[群]') !== -1) {
        //     console.log(bot.contacts)
        // }
        let searchName='';
        
        if (text && text.length>=2) {
            if (msg.ToUserName=== 'filehelper') {
                toUser = 'filehelper'
            }
            //用户ID
            if (msg.Content && msg.Content.indexOf('@') !== -1) {
                searchName=msg.Content.slice(':')[0];
            }
            console.log(msg)

            if (text.slice(0, 2) === '搜图') {
                sendMsg.sendImg(text.slice(2), toMsgName,bot) 
            } else if (text.slice(0, 2) === '识图') {
                snalysisNameArr.push(fromName);
            } else if (text.slice(0, 3) === '相似图') {
                
            }
        }
            break;
        case bot.CONF.MSGTYPE_IMAGE:
            console.log(snalysisNameArr)
            if (snalysisNameArr.indexOf(msg.FromUserName) !==-1) {
                bot.getMsgImg(msg.MsgId||msg.NewMsgId).then(res=>{
                    write.writeImg(msg.FromUserName,res.data)
                    snalysisNameArr.splice(snalysisNameArr.indexOf(msg.FromUserName,0));
                    let img = fs.readFileSync('./media/img/'+msg.FromUserName+'.jpg').toString('base64');
                    aipImgClient.advancedGeneral(img).then(function (result) {
                        console.log(result);
                        let data=result.result;
                        let msg='已查询到结果(来源为百度识图)：';
                        for (let index = 0; index < data.length; index++) {
                            msg += '\n' + (index+1) + '：' + data[index].root + '===>' + data[index].keyword
                        }
                        sendMsg.returnErr(msg, toMsgName,bot);
                    }).catch(function (err) {
                        console.log(err)
                        sendMsg.returnErr('查询人数过多，请重试~', toMsgName, bot);
                    })   
                }).catch(err=>{
                    console.log(err)
                }) 
            }
            /**
             * 图片消息
             */
            break;
        case bot.CONF.MSGTYPE_VOICE:
            /**
             * 语音消息
             */
            break;
        
        case bot.CONF.MSGTYPE_EMOTICON:
            /**
             * 表情消息
             */
            break;
        case bot.CONF.MSGTYPE_VIDEO:
            /**
             * 视频消息
             */
            break;
        case bot.CONF.MSGTYPE_MICROVIDEO:
            /**
             * 小视频消息
             */
            break;
        case bot.CONF.MSGTYPE_APP:
            /**
             * 文件消息
             */
            break;
        
        default:
            break;
    }
})


/**
 * 获取联系人头像
 */
bot.on('message', msg => {
    bot.getHeadImg(bot.contacts[msg.FromUserName].HeadImgUrl).then(res => {
        console.log(res)
        fs.writeFileSync(`./media/$ {msg.FromUserName}.jpg`, res.data)
    }).catch(err => {
        bot.emit('error', err)
    })
})









