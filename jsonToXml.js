//<string name="all_area_code">区号</string>

let json = require('./json.json');

let itemXmlName = ""
let firstName = ""

let firstKey = ""
let lastKey = ""
const objectToString = (data) => {
    if (typeof (data) === 'string') {
        // itemXmlName = firstName + '_' + key
        console.log('key', firstName + '_' + firstKey);
        if (lastKey !== firstKey) {
            firstName = ""
        }
        lastKey = firstKey
    } else {
        for (const key in data) {
            if (typeof (data[key]) === 'string') {
                lastKey = key
            } else {
                firstKey = key
                firstName += `_${key}`
            }
            objectToString(data[key])
        }
    }
    // for (const key in data) {
    //     if (typeof (data[key]) === 'string') {
    //         if (firstKey === key) {
    //             console.log('key',firstName)
    //         } else {
    //             firstName = ""
    //         }
    //         firstKey = key
    //     } else {
    //         firstName = `${firstName}_${key}`
    //     }
    //     objectToString(data[key])
    // }
}

objectToString(json)
