import _ from 'underscore';
const electron = require('electron').remote;

const dateKeys = [
    "time",
    "lastUpdate"
]

function clone(obj) {
    return Object.assign({}, obj);
}

function _parseIntoDates(obj) {
    for(let key in obj) {
        // hasOwnProperty isn't needed
        // since this is raw JSON
        let val = obj[key];
        
        if(typeof val === 'object') {
            obj[key] = _parseIntoDates(val)
        } else if(_.contains(dateKeys, key)) {
            let newval = Date.parse(val)
            obj[key] = newval
        }
    }

    return obj
}

export function parseIntoDates(obj) {
    return _parseIntoDates(clone(obj))
}



export function getAppPath() {
    let appPath = electron.app.getAppPath()

    if(process.env.ELECTRON_ENV == 'development') {
        return appPath;
    } else {
        return appPath.replace('app.asar', 'app.asar.unpacked')
    }
}