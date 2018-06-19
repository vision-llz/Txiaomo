const fs = require('fs'); 
var readBase64 = fs.createReadStream('base64.txt'); 
const http=require('http')
const iconv = require('iconv-lite'); 
var request = require('request')

console.log(fs.readdirSync('./media/imgSearchInfo'))
return
console.log(JSON.parse(iconv.decode(fs.readFileSync('./media/imgSearchInfo/searchImgInfo.txt'), 'utf8')))
// let a = 'http://p0.so.qhimgs1.com/t01b3e970644b47ec1c.jpg'
// let a = 'http://p0.so.qhimgs1.com/t01b3e970644b47ec1c.jpg'.split('/')
// console.log(a.slice(a.lastIndexOf('/')+1,a.length-4))
// console.log(fs.readdirSync('./media/ImgFolder'))
return
fs.mkdirSync('./media/ImgFolder/666')
request('http://p0.so.qhimgs1.com/t01b3e970644b47ec1c.jpg').pipe(fs.createWriteStream('./media/ImgFolder/666/meinv.jpg'))
return
var data = ''; 
readBase64.on('data', function (params) {
    data += params; 
})
readBase64.on('end', function () {
    var base64 = data.replace("data:img/jpg;base64,", ""); 
    var avatarBuffer = new Buffer(base64, 'base64'); 
    fs.writeFile('avatar.jpg', avatarBuffer, function(err) {
        if (err) console.log(err)
        console.log('写入成功')
    })
})