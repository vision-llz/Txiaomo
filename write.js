const fs = require('fs'); 
const util = require('./util'); 
const events = require('events'); 

const writeTxt = (name, params) =>  {
    // let text = ''; 
    // params.on('data', function(data) {
    //     text += data; 
    // }); 
    let time = name?name:util.getTime(); 
    fs.writeFileSync('./media/imgNameArr/' + time + '.txt', params); 
}

const writeImg = (params) =>  {
    // let text = ''; 
    // params.on('data', function(data) {
    //     text += data; 
    // }); 
    let time = util.getTime(); 
    fs.writeFileSync('./media/img' + time + '.txt', params); 
}

module.exports =  {writeTxt}