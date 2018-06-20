var request = require('request')
var https = require('https')
var write = require('./write')


const searchBingImg = (key)=>{
    let imgData=[]
    let subscriptionKey = '841a6d32d35148c69a6f29a4fef8ba6a'
    let host = 'api.cognitive.microsoft.com';
    let path = '/bing/v7.0/images/search';
    let term = key;

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
                return    imgData =JSON.parse(body).value;
            // write.writeTxt('测试必应', JSON.parse(body))
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

const searchSoImg = (params)=>{
    let key = encodeURI(params);
    // let url = 'http://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=' + key + '&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&word=' + key+'&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&pn=10&rn=10&gsm=1e&1528461395633=';
    let url = 'http://image.so.com/j?q=' + key + '&src=srp&correct=' + key + '&sn=60&pn=100';
// let url = 'http://pic.sogou.com/pics/channel/getAllRecomPicByTag.jsp?category=' + params + '&tag=' + params + '&start=15&len=15';
// let url = 'http://www.polaxiong.com/collections/get_entries_by_tags/' +key+'?{}';
// http://www.polaxiong.com/collections/get_entries_by_tags/'+key+'?{}
    http.get(url, (res) => {
        let datas = [];
        let size = 0;
        // res.setEncoding('utf8');
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
            return JSON.parse(result).list;
        })
    }).on('error', (err) => {
        console.log(err)
    })
}


module.exports = { searchBingImg,searchSoImg }