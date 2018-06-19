const Wechat = require('wechat4u'); 
const fs = require('fs'); 
const qrcode = require('qrcode-terminal'); 
const sendMsg = require('./sendMessage');
const request = require('request')
let bot, loginUserName; 

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
    loginUserName = bot.botData.user.UserName;
    fs.writeFileSync('./sync-data.json', JSON.stringify(bot.botData)); 
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
    switch (msg.MsgType) {
        case bot.CONF.MSGTYPE_TEXT:
        /**
         * 文本消息
         * 
         */
        console.log(msg)
        let text=msg.Content;
        if (text.charAt(0) === '@' && text.indexOf('\n') !== -1) {
            text=text.slice(text.indexOf('\n')+1,text.length);
        }
        // if (userName.indexOf('[群]') !== -1) {
        //     console.log(bot.contacts)
        // }
        let searchName='';
        if (text && text.length>2) {
            if (msg.ToUserName=== 'filehelper') {
                toUser = 'filehelper'
            }

            //用户ID
            if (msg.Content && msg.Content.indexOf('@') !== -1) {
                searchName=msg.Content.slice(':')[0];
            }

            if (text.slice(0, 2) === '搜图') {
                sendMsg.sendImg(text.slice(2), toMsgName,bot)
            }
        }
            break;
        case bot.CONF.MSGTYPE_IMAGE:
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









