const fs = require('fs'); 
const util = require('./util'); 
const events = require('events'); 

const writeTxt = (name, params) =>  {
    // let text = ''; 
    // params.on('data', function(data) {
    //     text += data; 
    // }); 
    let time = name?name:util.getTime(); 
    fs.writeFileSync('./media/txt/' + time + '.txt', params); 
}

const writeImg = (name,params) =>  {
    // let text = ''; 
    // params.on('data', function(data) {
    //     text += data; 
    // }); 
    let time = util.getTime(); 
    if (name !== '') {
        time=name;
    }
    fs.writeFileSync('./media/img/' + time + '.jpg', params); 
}

module.exports = { writeTxt, writeImg}