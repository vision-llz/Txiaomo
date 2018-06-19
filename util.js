const sd = require('silly-datetime'); 
const fs = require('fs'); 
var request = require('request')
var getTime = function() {
    return sd.format(new Date(), 'YYYY年MM月DD日HH时mm分'); 
}

const downloadImg = (url,imgFolderName)=>{
    let folder=fs.readdirSync('./media/ImgFolder')
    if (folder.indexOf(imgFolderName)===-1) {
        fs.mkdirSync('./media/ImgFolder/' + imgFolderName)
    }
    let imgName = url.slice(url.lastIndexOf('/') + 1, url.length);
    let imgs = fs.readdirSync('./media/ImgFolder/' + imgFolderName)
    
    if (imgs.length===0||imgs.indexOf(imgName)===-1) {
        console.log('imgFolderName==>' + imgFolderName)
        console.log('imgName==>' + imgName)
        request(url).pipe(fs.createWriteStream('./media/ImgFolder/' + imgFolderName + '/' + imgName))
    }
}
module.exports = {getTime,downloadImg}