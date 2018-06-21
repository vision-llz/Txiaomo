const fs = require('fs'); 
var readBase64 = fs.createReadStream('base64.txt'); 
const https=require('https')
const iconv = require('iconv-lite'); 
const request = require('request');

/**
 * 百度识图
 */
const AipImgClient = require('baidu-aip-sdk').imageClassify;
const HttpClient = require('baidu-aip-sdk').HttpClient;

var APP_ID = '11421710';
var API_KEY = 'sizwkNgutxLAZghEdfhHIULh';
var SECRET_KEY = 'cgnAEhKrokh0lmUuuqFEmbpeEGXhQ4zt';
var aipImgClient = new AipImgClient(APP_ID, API_KEY, SECRET_KEY);

a='搜索'

switch (a.slice(0,2)) {
    case '搜索':
        console.log('666')
        break;

    default:
        break;
}

return
HttpClient.setRequestOptions({timeout:5000});
HttpClient.setRequestInterceptor(function(requestOptions) {
    return requestOptions;
})
let img = fs.readFileSync('./media/50596093e5823.jpg').toString('base64');
aipImgClient.advancedGeneral(img).then(function(result) {
    console.log(JSON.stringify(result));
}).catch(function(err) {
    console.log(err);
})


return
/**
 * 必应搜图
 */
let subscriptionKey ='841a6d32d35148c69a6f29a4fef8ba6a'
let host = 'api.cognitive.microsoft.com';
let path = '/bing/v7.0/images/search';
let term = '美女';

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
                console.log(header + ": " + response.headers[header]);
        body = JSON.stringify(JSON.parse(body), null, '  ');
        console.log('\nJSON Response:\n');
        console.log(body);
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




return
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